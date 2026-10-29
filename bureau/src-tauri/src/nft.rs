//! Bouquet NFTs on the desktop, for their owner only.
//!
//! The owner links a wallet to this computer once, from the web app: the wallet signs a message naming this computer's
//! own code, and the web app hands it back through a `belai://` link. The app checks the signature itself, then reads
//! the chain (read-only) to know which bouquets the wallet holds. A bouquet is drawn by the engine kept in the app from
//! its recipe, at its age, and painted again every few hours so it opens, declines and fades on time. Once a day the
//! app asks the chain whether the wallet still owns it: a bouquet sold or given leaves the desk; without any network
//! for seven days, it waits out of sight until the next answer.

use crate::chaine::{Noeud, Recette, Reseau};
use crate::store::{Jeton, LienSigne};
use crate::{lien, peintre, App};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter, Manager, WebviewUrl};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};
use tauri_plugin_opener::OpenerExt;

/// Painted again after this long, so the stage follows the clock.
const REPEINDRE: u64 = 6 * 3600;
/// The chain is asked about ownership this often.
const VERIFIER: u64 = 24 * 3600;
/// Without any answer from the chain for this long, a bouquet waits out of sight.
const HORS_LIGNE: u64 = 7 * 24 * 3600;
/// The watch wakes up this often.
const VEILLE: u64 = 600;

/// A delay in seconds; BELAI_ESSAI_<NAME> shortens it for tests on a local node (never set in a release).
fn duree(nom: &str, defaut: u64) -> u64 {
    std::env::var(format!("BELAI_ESSAI_{nom}"))
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(defaut)
}

pub fn maintenant() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0)
}

/// The network the app reads: set when the app is built (BELAI_RESEAU, BELAI_RPC, BELAI_CONTRAT, BELAI_DEBUT, BELAI_WEB),
/// the same variables at launch taking precedence (tests on a local node). None while no contract is named.
pub fn reseau() -> Option<Reseau> {
    let v = |nom: &str, compile: Option<&'static str>| {
        std::env::var(nom)
            .ok()
            .or(compile.map(str::to_owned))
            .filter(|s| !s.is_empty())
    };
    let contrat = v("BELAI_CONTRAT", option_env!("BELAI_CONTRAT"))?.to_ascii_lowercase();
    if !lien::est_adresse(&contrat) {
        return None;
    }
    Some(Reseau {
        id: v("BELAI_RESEAU", option_env!("BELAI_RESEAU"))
            .and_then(|s| s.parse().ok())
            .unwrap_or(8453),
        rpc: v("BELAI_RPC", option_env!("BELAI_RPC"))
            .unwrap_or_else(|| "https://mainnet.base.org".into()),
        contrat,
        debut: v("BELAI_DEBUT", option_env!("BELAI_DEBUT"))
            .and_then(|s| s.parse().ok())
            .unwrap_or(0),
        web: v("BELAI_WEB", option_env!("BELAI_WEB"))
            .unwrap_or_else(|| "https://belai.garden/ecran/".into()),
    })
}

/// This computer's own code, drawn once.
pub fn appareil(app: &AppHandle) -> String {
    let st = app.state::<App>();
    let mut d = st.desk.lock().unwrap();
    if d.appareil.len() != 32 {
        let mut b = [0u8; 16];
        if getrandom::getrandom(&mut b).is_err() {
            // never weaker than the clock, and the link only names this computer
            b = (maintenant() as u128 ^ u128::from(std::process::id()) << 64).to_le_bytes();
        }
        d.appareil = hex::encode(b);
        st.changed();
    }
    d.appareil.clone()
}

fn dire(app: &AppHandle, texte: impl Into<String>, alerte: bool) {
    app.dialog()
        .message(texte)
        .title("Belai's Flowers")
        .kind(if alerte {
            MessageDialogKind::Warning
        } else {
            MessageDialogKind::Info
        })
        .show(|_| {});
}

/// Opens the web app in the browser, with this computer's code and the network, to link a wallet.
pub fn ouvrir_web(app: &AppHandle) {
    let Some(r) = reseau() else { return };
    let url = format!(
        "{}?ordinateur={}&reseau={}&contrat={}&debut={}",
        r.web,
        appareil(app),
        r.id,
        r.contrat,
        r.debut
    );
    if let Err(e) = app.opener().open_url(url, None::<&str>) {
        dire(app, format!("Le navigateur ne s'ouvre pas : {e}"), true);
    }
}

/// The value of a parameter in a `belai://` link.
fn parametre(url: &str, nom: &str) -> Option<String> {
    let q = url.split_once('?')?.1;
    q.split('&').find_map(|kv| {
        let (k, v) = kv.split_once('=')?;
        (k == nom).then(|| v.to_owned())
    })
}

fn base64url(s: &str) -> Option<String> {
    use base64::Engine;
    let b = base64::engine::general_purpose::URL_SAFE_NO_PAD
        .decode(s.trim_end_matches('='))
        .ok()?;
    String::from_utf8(b).ok()
}

/// A `belai://lier?m=…&s=…[&jeton=…]` link from the web app: the signed link, and maybe a bouquet to set on the desk.
pub fn lien_recu(app: &AppHandle, url: &str) {
    let Some(r) = reseau() else {
        dire(
            app,
            "Cette version de l'appli ne lit pas encore les bouquets NFT.",
            true,
        );
        return;
    };
    let (Some(m), Some(s)) = (
        parametre(url, "m").and_then(|m| base64url(&m)),
        parametre(url, "s"),
    ) else {
        dire(app, lien::Refus::Illisible.to_string(), true);
        return;
    };
    let l = match lien::verifier(&m, &s, &appareil(app), r.id, &r.contrat) {
        Ok(l) => l,
        Err(e) => return dire(app, e.to_string(), true),
    };
    {
        let st = app.state::<App>();
        let mut d = st.desk.lock().unwrap();
        // another wallet: the bouquets of the former one leave with it
        if d.lien.as_ref().is_some_and(|x| x.adresse != l.adresse) {
            let partis: Vec<String> = d
                .bouquets
                .iter()
                .filter(|b| b.nft.is_some())
                .map(|b| b.id.clone())
                .collect();
            drop(d);
            for id in partis {
                crate::remove(app, &id);
            }
            d = st.desk.lock().unwrap();
        }
        d.lien = Some(LienSigne {
            adresse: l.adresse.clone(),
            message: m,
            signature: s,
        });
        st.changed();
    }
    app.state::<App>().save_now();
    let jeton =
        parametre(url, "jeton").filter(|j| !j.is_empty() && j.bytes().all(|c| c.is_ascii_digit()));
    let handle = app.clone();
    std::thread::spawn(move || {
        rafraichir(&handle);
        match jeton {
            Some(j) => poser(&handle, &j),
            None => dire(&handle, "Ton portefeuille est relié à cet ordinateur. Tes bouquets sont dans le menu de l'icône Belai.", false),
        }
    });
}

/// Forgets the wallet: its bouquets leave the desk.
pub fn delier(app: &AppHandle) {
    let st = app.state::<App>();
    let partis: Vec<String> = {
        let mut d = st.desk.lock().unwrap();
        d.lien = None;
        d.bouquets
            .iter()
            .filter(|b| b.nft.is_some())
            .map(|b| b.id.clone())
            .collect()
    };
    st.changed();
    st.possedes.lock().unwrap().clear();
    for id in partis {
        crate::remove(app, &id);
    }
    crate::refresh_tray(app);
}

fn adresse_liee(app: &AppHandle) -> Option<String> {
    app.state::<App>()
        .desk
        .lock()
        .unwrap()
        .lien
        .as_ref()
        .map(|l| l.adresse.clone())
}

/// Reads again which bouquets the linked wallet holds (for the tray menu).
pub fn rafraichir(app: &AppHandle) {
    let (Some(r), Some(a)) = (reseau(), adresse_liee(app)) else {
        return;
    };
    if let Ok(liste) = Noeud::new(r).bouquets_de(&a) {
        *app.state::<App>().possedes.lock().unwrap() = liste;
        crate::refresh_tray(app);
    }
}

/// Sets a bouquet NFT of the linked wallet on the desk (run off the main thread: it asks the chain).
pub fn poser(app: &AppHandle, jeton: &str) {
    let (Some(r), Some(a)) = (reseau(), adresse_liee(app)) else {
        return dire(
            app,
            "Relie d'abord ton portefeuille à cet ordinateur.",
            true,
        );
    };
    let deja = app
        .state::<App>()
        .desk
        .lock()
        .unwrap()
        .bouquets
        .iter()
        .any(|b| b.nft.as_ref().is_some_and(|n| n.id == jeton));
    if deja {
        return dire(
            app,
            format!("Le bouquet n° {jeton} est déjà sur ton bureau."),
            false,
        );
    }
    let noeud = Noeud::new(r.clone());
    match noeud.reseau() {
        Ok(id) if id == r.id => {}
        Ok(_) => return dire(app, "Le nœud interrogé ne sert pas le bon réseau.", true),
        Err(e) => {
            return dire(
                app,
                format!("La chaîne ne répond pas ({e}). Réessaie dans un moment."),
                true,
            )
        }
    }
    match noeud.proprietaire(jeton) {
        Ok(Some(p)) if p == a => {}
        Ok(_) => {
            return dire(
                app,
                format!("Le bouquet n° {jeton} n'est pas dans ton portefeuille."),
                true,
            )
        }
        Err(e) => return dire(app, format!("La chaîne ne répond pas ({e})."), true),
    }
    // the engine kept in the app must be the one frozen on the chain, or the bouquet would not be drawn as on-chain
    if let Some(h) = noeud.empreinte_moteur() {
        if h != peintre::empreinte() {
            dire(app, "Le moteur de dessin de cette version de Belai Bureau n'est pas celui de la chaîne : mets l'appli à jour pour voir tes bouquets exactement comme ils sont.", true);
        }
    }
    let recette = match noeud.recette(jeton) {
        Ok(x) => x,
        Err(e) => {
            return dire(
                app,
                format!("La recette du bouquet n° {jeton} ne se lit pas ({e})."),
                true,
            )
        }
    };
    let st = app.state::<App>();
    let pid = {
        let d = st.desk.lock().unwrap();
        let ms = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|t| t.as_millis())
            .unwrap_or(0);
        crate::store::new_id(ms, &d.bouquets)
    };
    if let Err(e) = garder_recette(app, &pid, &recette) {
        return dire(app, e, true);
    }
    let t = maintenant();
    st.en_cours.lock().unwrap().insert(
        pid.clone(),
        Jeton {
            id: jeton.to_owned(),
            adresse: a,
            verifie: t,
            peint: t,
        },
    );
    peindre(app, &pid);
}

fn fichier_recette(app: &AppHandle, pid: &str) -> std::path::PathBuf {
    app.state::<App>().drawings.join(format!("{pid}.recette"))
}

fn garder_recette(app: &AppHandle, pid: &str, r: &Recette) -> Result<(), String> {
    let f = fichier_recette(app, pid);
    std::fs::create_dir_all(f.parent().unwrap()).map_err(|e| e.to_string())?;
    std::fs::write(f, r.belai()).map_err(|e| e.to_string())
}

/// The page served to a painting window (the `peintre` scheme): the engine page of that bouquet, with its relay.
pub fn page(app: &AppHandle, chemin: &str) -> Option<Vec<u8>> {
    let pid = chemin.trim_matches('/');
    if pid.is_empty() || !pid.bytes().all(|c| c.is_ascii_hexdigit()) {
        return None;
    }
    let belai = std::fs::read_to_string(fichier_recette(app, pid)).ok()?;
    Some(peintre::page_relayee(&belai))
}

/// Paints a bouquet at its age, in a hidden window running the engine.
pub fn peindre(app: &AppHandle, pid: &str) {
    let label = format!("peintre-{pid}");
    if app.get_webview_window(&label).is_some() {
        return;
    }
    #[cfg(windows)]
    let url = format!("http://peintre.localhost/{pid}");
    #[cfg(not(windows))]
    let url = format!("peintre://localhost/{pid}");
    let Ok(url) = url.parse() else { return };
    let r = tauri::WebviewWindowBuilder::new(app, &label, WebviewUrl::CustomProtocol(url))
        .visible(false)
        .focused(false)
        .skip_taskbar(true)
        .inner_size(900.0, 900.0)
        .build();
    if let Err(e) = r {
        eprintln!("peintre {pid}: {e}");
    }
}

/// The drawing sent back by a painting window: a new bouquet is set on the desk, a known one is shown at its new age.
pub fn peint(app: &AppHandle, label: &str, svg: &str) -> Result<(), String> {
    let pid = label
        .strip_prefix("peintre-")
        .ok_or("pas un peintre")?
        .to_owned();
    if let Some(w) = app.get_webview_window(label) {
        let _ = w.destroy();
    }
    let st = app.state::<App>();
    let nouveau = st.en_cours.lock().unwrap().remove(&pid);
    let b = match crate::bouquet::read(svg) {
        Ok(b) => b,
        Err(e) => {
            if nouveau.is_some() {
                dire(app, format!("Ce bouquet ne se dessine pas : {e}"), true);
            }
            return Err(e.to_string());
        }
    };
    match nouveau {
        Some(j) => {
            let nom = format!("Bouquet n° {}", j.id);
            crate::placer(app, &pid, nom, b, Some(j), false)
        }
        None => {
            std::fs::write(st.drawing(&pid), &b.svg).map_err(|e| e.to_string())?;
            if let Some(p) = st.desk.lock().unwrap().get_mut(&pid) {
                p.view_box = b.view_box;
                if let Some(n) = p.nft.as_mut() {
                    n.peint = maintenant();
                }
            }
            st.changed();
            let l = crate::label(&pid);
            if let Some(w) = app.get_webview_window(&l) {
                let _ = w.emit_to(l.as_str(), "recharger", ());
            }
            Ok(())
        }
    }
}

/// Every ten minutes: bouquets painted again at their age, ownership asked to the chain, the wallet's list read again.
pub fn veiller(app: AppHandle) {
    std::thread::spawn(move || {
        let mut derniere_liste = 0u64;
        loop {
            veille(&app);
            if maintenant().saturating_sub(derniere_liste) > duree("VERIFIER", VERIFIER) {
                rafraichir(&app);
                derniere_liste = maintenant();
            }
            std::thread::sleep(Duration::from_secs(duree("VEILLE", VEILLE)));
        }
    });
}

fn veille(app: &AppHandle) {
    let Some(r) = reseau() else { return };
    let st = app.state::<App>();
    let lie = adresse_liee(app);
    let nfts: Vec<(String, Jeton)> = st
        .desk
        .lock()
        .unwrap()
        .bouquets
        .iter()
        .filter_map(|b| b.nft.clone().map(|n| (b.id.clone(), n)))
        .collect();
    if nfts.is_empty() {
        return;
    }
    let noeud = Noeud::new(r.clone());
    let joignable = noeud.reseau().map(|id| id == r.id).unwrap_or(false);
    let t = maintenant();
    for (pid, n) in nfts {
        // the wallet was unlinked, or changed: the bouquet leaves
        if lie.as_deref() != Some(n.adresse.as_str()) {
            crate::remove(app, &pid);
            continue;
        }
        if joignable && t.saturating_sub(n.verifie) >= duree("VERIFIER", VERIFIER) {
            match noeud.proprietaire(&n.id) {
                Ok(Some(p)) if p == n.adresse => {
                    if let Some(b) = st.desk.lock().unwrap().get_mut(&pid) {
                        if let Some(x) = b.nft.as_mut() {
                            x.verifie = t;
                        }
                    }
                    st.changed();
                }
                Ok(_) => {
                    crate::remove(app, &pid);
                    dire(app, format!("Le bouquet n° {} a quitté ton portefeuille : il quitte aussi ton bureau.", n.id), false);
                    continue;
                }
                Err(_) => {}
            }
        }
        let verifie = st
            .desk
            .lock()
            .unwrap()
            .bouquets
            .iter()
            .find(|b| b.id == pid)
            .and_then(|b| b.nft.as_ref().map(|x| x.verifie));
        let attente =
            verifie.is_some_and(|v| t.saturating_sub(v) > duree("HORS_LIGNE", HORS_LIGNE));
        if let Some(w) = app.get_webview_window(&crate::label(&pid)) {
            let vu = w.is_visible().unwrap_or(true);
            if attente && vu {
                let _ = w.hide();
            } else if !attente && !vu {
                let _ = w.show();
                crate::settle(&w);
            }
        }
        if !attente && t.saturating_sub(n.peint) >= duree("REPEINDRE", REPEINDRE) {
            peindre(app, &pid);
        }
    }
    st.save_now();
}

/// The tray lines of the wallet: link it, or its bouquets not yet on the desk.
pub fn etat(app: &AppHandle) -> Option<(Option<String>, Vec<String>)> {
    reseau()?;
    let st = app.state::<App>();
    let d = st.desk.lock().unwrap();
    let adresse = d.lien.as_ref().map(|l| l.adresse.clone());
    let poses: Vec<&str> = d
        .bouquets
        .iter()
        .filter_map(|b| b.nft.as_ref().map(|n| n.id.as_str()))
        .collect();
    let libres = st
        .possedes
        .lock()
        .unwrap()
        .iter()
        .filter(|j| !poses.contains(&j.as_str()))
        .cloned()
        .collect();
    Some((adresse, libres))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn links_are_read() {
        use base64::Engine;
        let m = "Belai's Garden : un message\nsur deux lignes";
        let enc = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(m);
        let url = format!("belai://lier?m={enc}&s=0xabc&jeton=12");
        assert_eq!(
            parametre(&url, "m").and_then(|x| base64url(&x)).as_deref(),
            Some(m)
        );
        assert_eq!(parametre(&url, "s").as_deref(), Some("0xabc"));
        assert_eq!(parametre(&url, "jeton").as_deref(), Some("12"));
        assert_eq!(parametre(&url, "autre"), None);
        assert_eq!(parametre("belai://lier", "m"), None);
        assert_eq!(base64url("@@"), None);
        assert_eq!(base64url(&format!("{enc}==")).as_deref(), Some(m));
    }

    #[test]
    fn no_network_without_a_contract() {
        std::env::set_var("BELAI_CONTRAT", "pas une adresse");
        assert!(reseau().is_none());
        std::env::set_var(
            "BELAI_CONTRAT",
            "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        );
        std::env::set_var("BELAI_RESEAU", "31337");
        let r = reseau().unwrap();
        assert_eq!(
            (r.id, r.contrat.as_str()),
            (31337, "0x5fbdb2315678afecb367f032d93f642f64180aa3")
        );
        std::env::remove_var("BELAI_CONTRAT");
        std::env::remove_var("BELAI_RESEAU");
    }
}
