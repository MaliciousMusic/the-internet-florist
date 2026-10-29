//! A bouquet of the shop tried on the desktop: the site's « Try on your desktop » opens
//! `belai://essai?u=<its ouvert.json>&n=<its name>`. The app reads the bouquet open, as the shop draws it (its pieces, each
//! its own SVG, the swaying ones with their joint and swing), puts the pieces back into one drawing whose swaying layers
//! carry the widget's breeze marks (`data-bz`), and sets it on the desk like any other, marked as a try: one at a time, gone
//! when the app starts again. Only the shop's own addresses are read.

use std::io::Read;
use std::time::Duration;

use serde::Deserialize;
use tauri::{AppHandle, Manager};

use crate::bouquet::{Bouquet, MAX_BYTES};
use crate::App;

/// The shop's addresses: a link to anything else is refused. A local build may add its own (`BELAI_SITES`, commas).
const SITES: &[&str] = &[
    "https://maliciousmusic.github.io/the-internet-florist/",
    "https://belai.garden/",
];

fn sites() -> Vec<String> {
    let mut v: Vec<String> = SITES.iter().map(|s| (*s).to_owned()).collect();
    if let Some(extra) = option_env!("BELAI_SITES") {
        v.extend(
            extra
                .split(',')
                .map(str::trim)
                .filter(|s| !s.is_empty())
                .map(str::to_owned),
        );
    }
    v
}

#[derive(Debug, Deserialize)]
pub struct Ouvert {
    pub vb: [f64; 4],
    pub pieces: Vec<Piece>,
}

#[derive(Debug, Deserialize)]
pub struct Piece {
    /// Its box in the drawing's units.
    pub b: [f64; 4],
    /// The breeze's joint, for a swaying piece.
    pub o: Option<[f64; 2]>,
    /// Its swing: amplitude (degrees), period and delay (milliseconds).
    pub z: Option<[f64; 3]>,
    /// Its own SVG file.
    pub s: String,
}

/// Is this a link to try a bouquet?
pub fn est_essai(url: &str) -> bool {
    url.starts_with("belai://essai")
}

/// The decoded value of a parameter of the link (`%XX` and `+`).
fn parametre(url: &str, nom: &str) -> Option<String> {
    let q = url.split_once('?')?.1;
    let v = q.split('&').find_map(|kv| {
        let (k, v) = kv.split_once('=')?;
        (k == nom).then_some(v)
    })?;
    let b = v.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        match b[i] {
            b'%' if i + 2 < b.len() => {
                let h = std::str::from_utf8(&b[i + 1..i + 3]).ok()?;
                out.push(u8::from_str_radix(h, 16).ok()?);
                i += 3;
            }
            b'%' => return None,
            b'+' => {
                out.push(b' ');
                i += 1;
            }
            c => {
                out.push(c);
                i += 1;
            }
        }
    }
    String::from_utf8(out).ok()
}

/// The address of the bouquet to read, if the shop's: one of its sites, a plain path ending in `/ouvert.json`.
pub fn adresse(url: &str, sites: &[String]) -> Option<String> {
    let u = parametre(url, "u")?;
    let plain = u
        .bytes()
        .all(|c| c.is_ascii_alphanumeric() || b"-_./:".contains(&c));
    (plain
        && !u.contains("..")
        && u.ends_with("/ouvert.json")
        && sites.iter().any(|s| u.starts_with(s.as_str())))
    .then_some(u)
}

/// The bouquet's name as the menus show it: printable, 60 characters at most.
pub fn nom(url: &str) -> String {
    let n: String = parametre(url, "n")
        .unwrap_or_default()
        .chars()
        .filter(|c| !c.is_control())
        .take(60)
        .collect();
    let n = n.trim();
    if n.is_empty() {
        "Bouquet".to_owned()
    } else {
        n.to_owned()
    }
}

/// The inside of a piece's file (its root `<svg>` opened and closed), its ids and their uses prefixed: the pieces were
/// separate files, and the same id may be in several of them.
fn dedans(s: &str, pre: &str) -> Option<String> {
    let open = s.find("<svg")?;
    let body_start = open + s[open..].find('>')? + 1;
    let end = s.rfind("</svg>")?;
    if end < body_start {
        return None;
    }
    let body = &s[body_start..end];
    let mut out = String::with_capacity(body.len() + body.len() / 20);
    let mut rest = body;
    while let Some(i) = rest.find("id=\"") {
        let before = rest[..i].chars().last();
        out.push_str(&rest[..i + 4]);
        if before.is_some_and(char::is_whitespace) {
            out.push_str(pre);
        }
        rest = &rest[i + 4..];
    }
    out.push_str(rest);
    Some(
        out.replace("url(#", &format!("url(#{pre}"))
            .replace("href=\"#", &format!("href=\"#{pre}")),
    )
}

/// The pieces as one drawing: each in its own frame (a nested `<svg>` clips as its file did), the swaying ones in a group
/// marked for the widget's breeze, « amplitude,x,y,lag ».
pub fn assembler(o: &Ouvert) -> Option<Bouquet> {
    let [vx, vy, vw, vh] = o.vb;
    if !(vw > 0.0 && vh > 0.0) || o.pieces.is_empty() {
        return None;
    }
    let mut svg = format!(
        r#"<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="{vx} {vy} {vw} {vh}">"#
    );
    let mut swaying = 0;
    for (i, p) in o.pieces.iter().enumerate() {
        let body = dedans(&p.s, &format!("q{i}_"))?;
        let [x, y, w, h] = p.b;
        let piece = format!(
            r#"<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="{x} {y} {w} {h}" preserveAspectRatio="none">{body}</svg>"#
        );
        match (p.o, p.z) {
            (Some([ox, oy]), Some([a, _, delay])) => {
                swaying += 1;
                // (the shop's delays set each piece's phase; here a lag of a few seconds at most)
                let lag = (delay.abs() % 3000.0).round();
                svg.push_str(&format!(r#"<g data-bz="{a},{ox},{oy},{lag}">{piece}</g>"#));
            }
            _ => svg.push_str(&piece),
        }
    }
    svg.push_str("</svg>");
    Some(Bouquet {
        svg,
        view_box: o.vb,
        name: String::new(),
        swaying,
    })
}

fn lire(u: &str) -> Result<Ouvert, String> {
    let agent = ureq::AgentBuilder::new()
        .timeout(Duration::from_secs(40))
        .build();
    let r = agent
        .get(u)
        .call()
        .map_err(|e| format!("Le bouquet ne se télécharge pas ({e})."))?;
    let mut text = String::new();
    r.into_reader()
        .take(MAX_BYTES as u64 + 1)
        .read_to_string(&mut text)
        .map_err(|e| format!("Le bouquet ne se lit pas ({e})."))?;
    if text.len() > MAX_BYTES {
        return Err("Ce bouquet est trop lourd.".to_owned());
    }
    serde_json::from_str(&text).map_err(|_| "Ce bouquet ne se lit pas.".to_owned())
}

/// A `belai://essai` link: the bouquet read from the shop, then set on the desk in place of the last one tried.
pub fn recu(app: &AppHandle, url: &str) {
    let Some(u) = adresse(url, &sites()) else {
        return crate::avertir(
            app,
            "Ce lien d'essai ne vient pas de la boutique Belai's Garden.",
        );
    };
    let name = format!("Essai · {}", nom(url));
    let handle = app.clone();
    std::thread::spawn(move || {
        let b = match lire(&u)
            .and_then(|o| assembler(&o).ok_or_else(|| "Ce bouquet ne se lit pas.".to_owned()))
        {
            Ok(b) => b,
            Err(e) => return crate::avertir(&handle, e),
        };
        let st = handle.state::<App>();
        let ancien: Vec<String> = st
            .desk
            .lock()
            .unwrap()
            .bouquets
            .iter()
            .filter(|p| p.essai)
            .map(|p| p.id.clone())
            .collect();
        for id in ancien {
            crate::remove(&handle, &id);
        }
        let id = {
            let d = st.desk.lock().unwrap();
            let ms = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|t| t.as_millis())
                .unwrap_or(0);
            crate::store::new_id(ms, &d.bouquets)
        };
        if let Err(e) = crate::placer(&handle, &id, name, b, None, true) {
            crate::avertir(&handle, e);
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    const SITE: &str = "https://maliciousmusic.github.io/the-internet-florist/";

    fn lien(u: &str) -> String {
        format!("belai://essai?u={u}&n=Printemps%20%C3%A0%20la%20carpe")
    }

    #[test]
    fn only_the_shops_bouquets() {
        let s = vec![SITE.to_owned()];
        let ok = format!("{SITE}decor/scene/bouquets/citrine/ouvert.json");
        let enc = ok.replace(':', "%3A").replace('/', "%2F");
        assert_eq!(adresse(&lien(&enc), &s), Some(ok.clone()));
        assert_eq!(adresse(&lien(&ok), &s), Some(ok));
        for bad in [
            "https://ailleurs.example/bouquets/x/ouvert.json",
            "https://maliciousmusic.github.io/the-internet-florist/../x/ouvert.json",
            "https://maliciousmusic.github.io/the-internet-florist/decor/scene/bouquets/x/autre.json",
            "https://maliciousmusic.github.io/the-internet-florist/x/ouvert.json?y=1",
            "https://maliciousmusic.github.io.example/the-internet-florist/ouvert.json",
        ] {
            assert_eq!(adresse(&lien(bad), &s), None, "{bad}");
        }
        assert_eq!(adresse("belai://essai?n=x", &s), None);
        assert_eq!(adresse("belai://essai?u=%ZZ", &s), None);
        assert_eq!(adresse("belai://essai?u=abc%2", &s), None);
    }

    #[test]
    fn names_are_plain() {
        assert_eq!(nom(&lien("x")), "Printemps à la carpe");
        assert_eq!(nom("belai://essai?u=x"), "Bouquet");
        assert_eq!(nom("belai://essai?n=a%0Ab"), "ab");
        assert_eq!(
            nom(&format!("belai://essai?n={}", "x".repeat(200))).len(),
            60
        );
    }

    #[test]
    fn pieces_become_one_drawing() {
        let o = Ouvert {
            vb: [0.0, 0.0, 100.0, 200.0],
            pieces: vec![
                Piece {
                    b: [10.0, 20.0, 30.0, 40.0],
                    o: None,
                    z: None,
                    s: r##"<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 20 30 40"><defs><linearGradient id="g1"/></defs><path fill="url(#g1)" data-id="k"/></svg>"##.into(),
                },
                Piece {
                    b: [0.0, 0.0, 50.0, 60.0],
                    o: Some([25.0, 60.0]),
                    z: Some([2.5, 8000.0, 4200.0]),
                    s: r##"<svg viewBox="0 0 50 60"><clipPath
 id="g1"/><use xlink:href="#g1" clip-path="url(#g1)"/></svg>"##.into(),
                },
            ],
        };
        let b = assembler(&o).unwrap();
        assert_eq!(b.swaying, 1);
        assert_eq!(b.view_box, [0.0, 0.0, 100.0, 200.0]);
        assert!(b.svg.starts_with(r#"<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 200">"#));
        assert!(b.svg.contains(r#"<svg x="10" y="20" width="30" height="40" viewBox="10 20 30 40" preserveAspectRatio="none"><defs><linearGradient id="q0_g1"/></defs><path fill="url(#q0_g1)" data-id="k"/></svg>"#));
        assert!(b.svg.contains(r##"<g data-bz="2.5,25,60,1200"><svg x="0" y="0" width="50" height="60" viewBox="0 0 50 60" preserveAspectRatio="none"><clipPath
 id="q1_g1"/><use xlink:href="#q1_g1" clip-path="url(#q1_g1)"/></svg></g>"##));
        assert!(b.svg.ends_with("</svg></g></svg>"));
        // what the widget reads back
        let r = crate::bouquet::read(&b.svg).unwrap();
        assert_eq!((r.view_box, r.swaying), (b.view_box, 1));
    }

    #[test]
    fn a_broken_piece_is_refused() {
        let o = Ouvert {
            vb: [0.0, 0.0, 1.0, 1.0],
            pieces: vec![Piece {
                b: [0.0; 4],
                o: None,
                z: None,
                s: "pas de dessin".into(),
            }],
        };
        assert!(assembler(&o).is_none());
    }
}
