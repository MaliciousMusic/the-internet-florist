//! Belai's Flowers on the desktop: each living bouquet in its own little window, set on the wallpaper,
//! moved and sized at will, swaying in the same breeze as in the shop. Everything stays on this computer.

mod bouquet;
mod chaine;
mod desk;
mod essai;
mod lien;
mod maintien;
mod nft;
mod peintre;
mod store;

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::Duration;

use store::{Area, Desk, Jeton, Placed};
use tauri::menu::{CheckMenuItem, Menu, MenuEvent, MenuItem, PredefinedMenuItem, Submenu};
use tauri::tray::TrayIconBuilder;
use tauri::{
    AppHandle, Emitter, Manager, PhysicalPosition, PhysicalSize, RunEvent, WebviewUrl,
    WebviewWindow, WindowEvent,
};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

/// Passed by the system when it starts the app with the session: no file picker then.
const AT_LOGIN: &str = "--au-demarrage";

struct App {
    desk: Mutex<Desk>,
    dirty: AtomicBool,
    desk_file: PathBuf,
    drawings: PathBuf,
    /// Bouquet NFTs being painted for the first time, by their future id on the desk.
    en_cours: Mutex<HashMap<String, Jeton>>,
    /// The bouquets the linked wallet holds, as last read on the chain.
    possedes: Mutex<Vec<String>>,
}

impl App {
    fn drawing(&self, id: &str) -> PathBuf {
        self.drawings.join(format!("{id}.svg"))
    }
    fn changed(&self) {
        self.dirty.store(true, Ordering::Release);
    }
    fn save_now(&self) {
        if self.dirty.swap(false, Ordering::AcqRel) {
            let d = self.desk.lock().unwrap().clone();
            if let Err(e) = d.save(&self.desk_file) {
                eprintln!("bureau.json: {e}");
            }
        }
    }
}

fn label(id: &str) -> String {
    format!("b-{id}")
}

fn id_of(label: &str) -> Option<&str> {
    label.strip_prefix("b-")
}

/// The work areas of the screens (without the taskbar), the main screen first.
fn areas(app: &AppHandle) -> Vec<Area> {
    let mut out = Vec::new();
    if let Ok(Some(m)) = app.primary_monitor() {
        let a = m.work_area();
        out.push(Area {
            x: a.position.x,
            y: a.position.y,
            w: a.size.width,
            h: a.size.height,
        });
    }
    for m in app.available_monitors().unwrap_or_default() {
        let a = m.work_area();
        let area = Area {
            x: a.position.x,
            y: a.position.y,
            w: a.size.width,
            h: a.size.height,
        };
        if !out.contains(&area) {
            out.push(area);
        }
    }
    if out.is_empty() {
        out.push(Area {
            x: 0,
            y: 0,
            w: 1920,
            h: 1040,
        });
    }
    out
}

/// The work area under a bouquet (the one holding its centre), else the main one.
fn area_of(app: &AppHandle, b: &Placed) -> Area {
    let (cx, cy) = (b.x + b.w as i32 / 2, b.y + b.h as i32 / 2);
    let all = areas(app);
    all.iter()
        .copied()
        .find(|a| cx >= a.x && cx < a.x + a.w as i32 && cy >= a.y && cy < a.y + a.h as i32)
        .unwrap_or(all[0])
}

/// Opens the window of a bouquet, where it was left.
fn open(app: &AppHandle, b: &Placed) -> tauri::Result<WebviewWindow> {
    let locked = app.state::<App>().desk.lock().unwrap().locked || b.fixe;
    let w = tauri::WebviewWindowBuilder::new(
        app,
        label(&b.id),
        WebviewUrl::App(format!("widget.html?id={}", b.id).into()),
    )
    .title(&b.name)
    .decorations(false)
    .transparent(true)
    .shadow(false)
    .resizable(true)
    .skip_taskbar(true)
    .always_on_bottom(!b.devant)
    .always_on_top(b.devant)
    .focused(false)
    .visible(false)
    .min_inner_size(
        f64::from(store::MIN_SIDE) / 2.0,
        f64::from(store::MIN_SIDE) / 2.0,
    )
    .build()?;
    w.set_position(PhysicalPosition::new(b.x, b.y))?;
    w.set_size(PhysicalSize::new(b.w, b.h))?;
    w.set_ignore_cursor_events(locked)?;
    w.show()?;
    settle(&w);
    Ok(w)
}

/// Sets a bouquet's window on the desktop. Done after every change of its window flags,
/// which the windowing layer rewrites from its own state.
fn settle(w: &WebviewWindow) {
    #[cfg(windows)]
    if let Ok(h) = w.hwnd() {
        let devant = id_of(w.label()).is_some_and(|id| {
            w.app_handle()
                .state::<App>()
                .desk
                .lock()
                .unwrap()
                .bouquets
                .iter()
                .any(|b| b.id == id && b.devant)
        });
        desk::settle(h.0 as isize, devant);
    }
    #[cfg(not(windows))]
    let _ = w;
}

/// Gives every bouquet window its state: still (the desk is locked, or the bouquet is fixed) or movable.
/// A still bouquet shows no frame and lets the mouse through to the desktop.
fn appliquer(app: &AppHandle) {
    let d = app.state::<App>().desk.lock().unwrap().clone();
    for b in &d.bouquets {
        let l = label(&b.id);
        if let Some(w) = app.get_webview_window(&l) {
            let immobile = d.locked || b.fixe;
            let _ = w.set_ignore_cursor_events(immobile);
            settle(&w);
            let _ = w.emit_to(l.as_str(), "verrou", immobile);
        }
    }
}

/// Puts a bouquet in front of every window (tabs, apps, folders), or back on the desktop under them.
fn placer_plan(app: &AppHandle, id: &str, devant: bool) {
    let st = app.state::<App>();
    if let Some(b) = st.desk.lock().unwrap().get_mut(id) {
        b.devant = devant;
    }
    st.changed();
    let l = label(id);
    if let Some(w) = app.get_webview_window(&l) {
        let _ = w.set_always_on_bottom(!devant);
        let _ = w.set_always_on_top(devant);
        settle(&w);
        let _ = w.emit_to(l.as_str(), "plan", devant);
    }
    refresh_tray(app);
}

fn est_devant(app: &AppHandle, id: &str) -> bool {
    app.state::<App>()
        .desk
        .lock()
        .unwrap()
        .bouquets
        .iter()
        .any(|b| b.id == id && b.devant)
}

/// The still bouquet under a point of the screen (fixed, or the desk locked), those in front of the windows first.
fn immobile_sous(app: &AppHandle, x: i32, y: i32) -> Option<String> {
    let st = app.state::<App>();
    let d = st.desk.lock().unwrap();
    let dedans = |b: &&Placed| {
        (d.locked || b.fixe) && x >= b.x && x < b.x + b.w as i32 && y >= b.y && y < b.y + b.h as i32
    };
    let devant = d.bouquets.iter().rev().filter(|b| b.devant).find(dedans);
    devant
        .or_else(|| d.bouquets.iter().rev().filter(|b| !b.devant).find(dedans))
        .map(|b| b.id.clone())
}

/// Shows (or hides, when `p` is below 0) the ring of a long press in a bouquet's window.
fn anneau(app: &AppHandle, id: &str, p: f64, x: i32, y: i32) {
    let (bx, by) = app
        .state::<App>()
        .desk
        .lock()
        .unwrap()
        .bouquets
        .iter()
        .find(|b| b.id == id)
        .map(|b| (b.x, b.y))
        .unwrap_or((0, 0));
    let l = label(id);
    if let Some(w) = app.get_webview_window(&l) {
        let _ = w.emit_to(l.as_str(), "maintien", (p, x - bx, y - by));
    }
}

/// Watches the left button: held six seconds on a still bouquet, it makes it editable again.
fn guetter(app: AppHandle) {
    std::thread::spawn(move || {
        let mut m = maintien::Maintien::default();
        let debut = std::time::Instant::now();
        loop {
            std::thread::sleep(Duration::from_millis(80));
            let (appui, x, y) = maintien::souris();
            let t = debut.elapsed().as_millis() as u64;
            match m.pas(appui, x, y, t, |x, y| immobile_sous(&app, x, y)) {
                maintien::Pas::Rien => {}
                maintien::Pas::Progres(id, p, x, y) => anneau(&app, &id, p, x, y),
                maintien::Pas::Annule(id) => anneau(&app, &id, -1.0, 0, 0),
                maintien::Pas::Libere(id) => {
                    anneau(&app, &id, -1.0, 0, 0);
                    fixer(&app, &id, false);
                    if app.state::<App>().desk.lock().unwrap().locked {
                        set_locked(&app, false);
                    }
                }
            }
        }
    });
}

/// Fixes a bouquet where it stands, or frees it to be moved and sized again.
fn fixer(app: &AppHandle, id: &str, fixe: bool) {
    let st = app.state::<App>();
    if let Some(b) = st.desk.lock().unwrap().get_mut(id) {
        b.fixe = fixe;
    }
    st.changed();
    appliquer(app);
    refresh_tray(app);
}

/// Takes a « Vase animé » file and sets its bouquet on the desktop.
fn add(app: &AppHandle, path: &std::path::Path) -> Result<(), String> {
    let page =
        std::fs::read_to_string(path).map_err(|_| "Ce fichier ne peut pas être lu.".to_owned())?;
    let b = bouquet::read(&page).map_err(|e| e.to_string())?;
    let st = app.state::<App>();
    let id = {
        let d = st.desk.lock().unwrap();
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|t| t.as_millis())
            .unwrap_or(0);
        store::new_id(now, &d.bouquets)
    };
    let name = b.name.clone();
    placer(app, &id, name, b, None, false)
}

/// Sets a drawn bouquet on the desktop, beside the others, and opens its window.
fn placer(
    app: &AppHandle,
    id: &str,
    name: String,
    b: bouquet::Bouquet,
    nft: Option<Jeton>,
    essai: bool,
) -> Result<(), String> {
    let st = app.state::<App>();
    let placed = {
        let mut d = st.desk.lock().unwrap();
        let area = areas(app)[0];
        let size = store::sized(b.view_box, area, store::SIZES[1].2);
        let (x, y) = store::first_place(area, size, &d.bouquets);
        let p = Placed {
            id: id.to_owned(),
            name,
            view_box: b.view_box,
            x,
            y,
            w: size.0,
            h: size.1,
            fixe: false,
            devant: false,
            nft,
            essai,
        };
        std::fs::create_dir_all(&st.drawings).map_err(|e| e.to_string())?;
        std::fs::write(st.drawing(&p.id), b.svg).map_err(|e| e.to_string())?;
        // a new bouquet is meant to be placed: the desk unlocks (fixed bouquets stay fixed)
        let unlock = d.locked;
        d.locked = false;
        d.bouquets.push(p.clone());
        (p, unlock)
    };
    let (placed, unlock) = placed;
    if unlock {
        appliquer(app);
    }
    st.changed();
    st.save_now();
    open(app, &placed).map_err(|e| e.to_string())?;
    refresh_tray(app);
    Ok(())
}

fn remove(app: &AppHandle, id: &str) {
    let st = app.state::<App>();
    if st.desk.lock().unwrap().remove(id).is_some() {
        if let Some(w) = app.get_webview_window(&label(id)) {
            let _ = w.destroy();
        }
        let _ = std::fs::remove_file(st.drawing(id));
        let _ = std::fs::remove_file(st.drawings.join(format!("{id}.recette")));
        st.changed();
        st.save_now();
        refresh_tray(app);
    }
}

fn resize(app: &AppHandle, id: &str, share: f64) {
    let st = app.state::<App>();
    let mut d = st.desk.lock().unwrap();
    let Some(b) = d.get_mut(id) else { return };
    let area = area_of(app, b);
    let (w, h) = store::sized(b.view_box, area, share);
    // the vase keeps its foot where it stood: the size changes around the bottom centre
    let x = b.x + (b.w as i32 - w as i32) / 2;
    let y = b.y + b.h as i32 - h as i32;
    let x = x.clamp(area.x, (area.x + area.w as i32 - w as i32).max(area.x));
    let y = y.clamp(area.y, (area.y + area.h as i32 - h as i32).max(area.y));
    (b.x, b.y, b.w, b.h) = (x, y, w, h);
    drop(d);
    if let Some(win) = app.get_webview_window(&label(id)) {
        let _ = win.set_size(PhysicalSize::new(w, h));
        let _ = win.set_position(PhysicalPosition::new(x, y));
    }
    st.changed();
}

fn set_locked(app: &AppHandle, locked: bool) {
    app.state::<App>().desk.lock().unwrap().locked = locked;
    app.state::<App>().changed();
    appliquer(app);
    refresh_tray(app);
}

fn pick(app: &AppHandle) {
    let handle = app.clone();
    app.dialog()
        .file()
        .set_title("Choisis un vase animé")
        .add_filter("Vase animé", &["html", "htm", "svg"])
        .pick_file(move |f| {
            let Some(path) = f.and_then(|f| f.into_path().ok()) else {
                return;
            };
            if let Err(e) = add(&handle, &path) {
                handle
                    .dialog()
                    .message(e)
                    .title("Belai's Flowers")
                    .kind(MessageDialogKind::Warning)
                    .show(|_| {});
            }
        });
}

/// The menu of the tray icon: add, lock, start with the session, the bouquets one by one, quit.
fn tray_menu(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let d = app.state::<App>().desk.lock().unwrap().clone();
    let autostart = app.autolaunch().is_enabled().unwrap_or(false);
    let menu = Menu::new(app)?;
    menu.append(&MenuItem::with_id(
        app,
        "ajouter",
        "Ajouter un bouquet…",
        true,
        None::<&str>,
    )?)?;
    menu.append(&CheckMenuItem::with_id(
        app,
        "verrou",
        "Verrouiller les bouquets",
        !d.bouquets.is_empty(),
        d.locked,
        None::<&str>,
    )?)?;
    menu.append(&PredefinedMenuItem::separator(app)?)?;
    for b in &d.bouquets {
        let sub = Submenu::with_id(app, format!("menu:{}", b.id), &b.name, true)?;
        sub.append(&CheckMenuItem::with_id(
            app,
            format!("fixe:{}", b.id),
            "Fixé ici",
            true,
            b.fixe,
            None::<&str>,
        )?)?;
        sub.append(&CheckMenuItem::with_id(
            app,
            format!("devant:{}", b.id),
            "Devant les fenêtres",
            true,
            b.devant,
            None::<&str>,
        )?)?;
        sub.append(&PredefinedMenuItem::separator(app)?)?;
        for (key, name, _) in store::SIZES {
            sub.append(&MenuItem::with_id(
                app,
                format!("taille:{key}:{}", b.id),
                name,
                true,
                None::<&str>,
            )?)?;
        }
        sub.append(&PredefinedMenuItem::separator(app)?)?;
        sub.append(&MenuItem::with_id(
            app,
            format!("retirer:{}", b.id),
            "Retirer du bureau",
            true,
            None::<&str>,
        )?)?;
        menu.append(&sub)?;
    }
    if !d.bouquets.is_empty() {
        menu.append(&PredefinedMenuItem::separator(app)?)?;
    }
    // the wallet: link it, then its bouquets not yet on the desk
    if let Some((adresse, libres)) = nft::etat(app) {
        match adresse {
            None => menu.append(&MenuItem::with_id(
                app,
                "relier",
                "Relier mon portefeuille…",
                true,
                None::<&str>,
            )?)?,
            Some(a) => {
                let court = format!("Portefeuille {}…{}", &a[..6], &a[a.len() - 4..]);
                let sub = Submenu::with_id(app, "portefeuille", court, true)?;
                for j in &libres {
                    sub.append(&MenuItem::with_id(
                        app,
                        format!("poser:{j}"),
                        format!("Poser le bouquet n° {j}"),
                        true,
                        None::<&str>,
                    )?)?;
                }
                if libres.is_empty() {
                    sub.append(&MenuItem::with_id(
                        app,
                        "aucun",
                        "Aucun autre bouquet dans ce portefeuille",
                        false,
                        None::<&str>,
                    )?)?;
                }
                sub.append(&PredefinedMenuItem::separator(app)?)?;
                sub.append(&MenuItem::with_id(
                    app,
                    "relier",
                    "Voir mes bouquets dans le navigateur…",
                    true,
                    None::<&str>,
                )?)?;
                sub.append(&MenuItem::with_id(
                    app,
                    "delier",
                    "Délier ce portefeuille",
                    true,
                    None::<&str>,
                )?)?;
                menu.append(&sub)?;
            }
        }
        menu.append(&PredefinedMenuItem::separator(app)?)?;
    }
    menu.append(&CheckMenuItem::with_id(
        app,
        "demarrage",
        "Lancer au démarrage",
        true,
        autostart,
        None::<&str>,
    )?)?;
    menu.append(&MenuItem::with_id(
        app,
        "quitter",
        "Quitter",
        true,
        None::<&str>,
    )?)?;
    Ok(menu)
}

fn refresh_tray(app: &AppHandle) {
    if let (Some(tray), Ok(menu)) = (app.tray_by_id("belai"), tray_menu(app)) {
        let _ = tray.set_menu(Some(menu));
    }
}

/// The menu shown by a right click on a bouquet.
fn bouquet_menu(app: &AppHandle, id: &str) -> tauri::Result<Menu<tauri::Wry>> {
    let menu = Menu::new(app)?;
    menu.append(&MenuItem::with_id(
        app,
        format!("fixer:{id}"),
        "Fixer ici",
        true,
        None::<&str>,
    )?)?;
    menu.append(&MenuItem::with_id(
        app,
        format!("plan:{id}"),
        if est_devant(app, id) {
            "Passer derrière les fenêtres"
        } else {
            "Passer devant les fenêtres"
        },
        true,
        None::<&str>,
    )?)?;
    menu.append(&PredefinedMenuItem::separator(app)?)?;
    for (key, name, _) in store::SIZES {
        menu.append(&MenuItem::with_id(
            app,
            format!("taille:{key}:{id}"),
            name,
            true,
            None::<&str>,
        )?)?;
    }
    menu.append(&PredefinedMenuItem::separator(app)?)?;
    menu.append(&MenuItem::with_id(
        app,
        "verrou-un",
        "Verrouiller les bouquets",
        true,
        None::<&str>,
    )?)?;
    menu.append(&MenuItem::with_id(
        app,
        "ajouter",
        "Ajouter un bouquet…",
        true,
        None::<&str>,
    )?)?;
    menu.append(&MenuItem::with_id(
        app,
        format!("retirer:{id}"),
        "Retirer du bureau",
        true,
        None::<&str>,
    )?)?;
    Ok(menu)
}

fn on_menu(app: &AppHandle, e: MenuEvent) {
    let id = e.id().as_ref();
    match id {
        "ajouter" => pick(app),
        "verrou" => {
            let locked = !app.state::<App>().desk.lock().unwrap().locked;
            set_locked(app, locked);
        }
        "verrou-un" => set_locked(app, true),
        "relier" => nft::ouvrir_web(app),
        "delier" => nft::delier(app),
        "demarrage" => {
            let a = app.autolaunch();
            let _ = if a.is_enabled().unwrap_or(false) {
                a.disable()
            } else {
                a.enable()
            };
            refresh_tray(app);
        }
        "quitter" => {
            app.state::<App>().save_now();
            app.exit(0);
        }
        _ => {
            if let Some(b) = id
                .strip_prefix("devant:")
                .or_else(|| id.strip_prefix("plan:"))
            {
                let devant = est_devant(app, b);
                placer_plan(app, b, !devant);
            } else if let Some(b) = id.strip_prefix("fixer:") {
                fixer(app, b, true);
            } else if let Some(b) = id.strip_prefix("fixe:") {
                let fixe = app
                    .state::<App>()
                    .desk
                    .lock()
                    .unwrap()
                    .bouquets
                    .iter()
                    .any(|x| x.id == b && x.fixe);
                fixer(app, b, !fixe);
            } else if let Some(j) = id.strip_prefix("poser:") {
                let (handle, j) = (app.clone(), j.to_owned());
                std::thread::spawn(move || nft::poser(&handle, &j));
            } else if let Some(b) = id.strip_prefix("retirer:") {
                remove(app, b);
            } else if let Some(rest) = id.strip_prefix("taille:") {
                if let Some((key, b)) = rest.split_once(':') {
                    if let Some((_, _, share)) = store::SIZES.iter().find(|s| s.0 == key) {
                        resize(app, b, *share);
                    }
                }
            }
        }
    }
}

/// The drawing of a bouquet, for its window.
#[tauri::command]
fn dessin(app: AppHandle, id: String) -> Result<(String, bool, bool), String> {
    if !id.chars().all(|c| c.is_ascii_hexdigit()) {
        return Err("bouquet inconnu".into());
    }
    let st = app.state::<App>();
    let locked = {
        let d = st.desk.lock().unwrap();
        d.locked || d.bouquets.iter().any(|b| b.id == id && b.fixe)
    };
    std::fs::read_to_string(st.drawing(&id))
        .map(|s| (s, locked, est_devant(&app, &id)))
        .map_err(|e| e.to_string())
}

/// A right click on a bouquet.
#[tauri::command]
fn menu(window: WebviewWindow) -> Result<(), String> {
    let id = id_of(window.label()).ok_or("pas un bouquet")?.to_owned();
    let m = bouquet_menu(window.app_handle(), &id).map_err(|e| e.to_string())?;
    window.popup_menu(&m).map_err(|e| e.to_string())
}

/// The front/back button of a bouquet.
#[tauri::command]
fn basculer_plan(window: WebviewWindow) -> Result<(), String> {
    let id = id_of(window.label()).ok_or("pas un bouquet")?.to_owned();
    let devant = est_devant(window.app_handle(), &id);
    placer_plan(window.app_handle(), &id, !devant);
    Ok(())
}

/// The ✓ button of a bouquet: fixed where it stands.
#[tauri::command]
fn fixer_ici(window: WebviewWindow) -> Result<(), String> {
    let id = id_of(window.label()).ok_or("pas un bouquet")?.to_owned();
    fixer(window.app_handle(), &id, true);
    Ok(())
}

/// The end of a resize by the corner: the window hugs the bouquet again.
#[tauri::command]
fn ajuster(window: WebviewWindow) -> Result<(), String> {
    let app = window.app_handle();
    let id = id_of(window.label()).ok_or("pas un bouquet")?;
    let size = window.outer_size().map_err(|e| e.to_string())?;
    let st = app.state::<App>();
    let vb = st
        .desk
        .lock()
        .unwrap()
        .bouquets
        .iter()
        .find(|b| b.id == id)
        .map(|b| b.view_box)
        .ok_or("bouquet inconnu")?;
    let h = bouquet::height_for(vb, f64::from(size.width))
        .round()
        .max(1.0) as u32;
    if h.abs_diff(size.height) > 2 {
        let pos = window.outer_position().map_err(|e| e.to_string())?;
        // the foot stays where it is
        window
            .set_size(PhysicalSize::new(size.width, h))
            .map_err(|e| e.to_string())?;
        window
            .set_position(PhysicalPosition::new(
                pos.x,
                pos.y + size.height as i32 - h as i32,
            ))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// The drawing of a bouquet NFT at its age, sent by its painting window.
#[tauri::command]
async fn peint(window: WebviewWindow, svg: String) -> Result<(), String> {
    let label = window.label().to_owned();
    nft::peint(window.app_handle(), &label, &svg)
}

fn remember(
    app: &AppHandle,
    label: &str,
    pos: Option<PhysicalPosition<i32>>,
    size: Option<PhysicalSize<u32>>,
) {
    let Some(id) = id_of(label) else { return };
    let st = app.state::<App>();
    if let Some(b) = st.desk.lock().unwrap().get_mut(id) {
        if let Some(p) = pos {
            (b.x, b.y) = (p.x, p.y);
        }
        if let Some(s) = size {
            if s.width > 0 && s.height > 0 {
                (b.w, b.h) = (s.width, s.height);
            }
        }
    }
    st.changed();
}

/// A `belai://` link: a bouquet of the shop to try, or the web app's signed link to a wallet.
fn lien(app: &AppHandle, url: &str) {
    if essai::est_essai(url) {
        essai::recu(app, url);
    } else {
        nft::lien_recu(app, url);
    }
}

/// A warning in a dialog of its own.
fn avertir(app: &AppHandle, texte: impl Into<String>) {
    app.dialog()
        .message(texte)
        .title("Belai's Flowers")
        .kind(MessageDialogKind::Warning)
        .show(|_| {});
}

fn links_in(args: &[String]) -> Vec<String> {
    args.iter()
        .skip(1)
        .filter(|a| a.starts_with("belai://"))
        .cloned()
        .collect()
}

fn files_in(args: &[String]) -> Vec<PathBuf> {
    args.iter()
        .skip(1)
        .filter(|a| !a.starts_with("--") && !a.starts_with("belai://"))
        .map(PathBuf::from)
        .filter(|p| p.is_file())
        .collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            // launched again (a « Vase animé » opened with the app, or a belai:// link from the web app):
            // the running one takes it
            let links = links_in(&args);
            for l in &links {
                lien(app, l);
            }
            let files = files_in(&args);
            if files.is_empty() && links.is_empty() {
                pick(app);
            }
            for f in files {
                if let Err(e) = add(app, &f) {
                    app.dialog()
                        .message(e)
                        .title("Belai's Flowers")
                        .kind(MessageDialogKind::Warning)
                        .show(|_| {});
                }
            }
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![AT_LOGIN]),
        ))
        .invoke_handler(tauri::generate_handler![
            dessin,
            menu,
            ajuster,
            peint,
            fixer_ici,
            basculer_plan
        ])
        // the engine page of a bouquet NFT, for its hidden painting window
        .register_uri_scheme_protocol("peintre", |ctx, req| {
            match nft::page(ctx.app_handle(), req.uri().path()) {
                Some(body) => tauri::http::Response::builder()
                    .header("Content-Type", "text/html; charset=utf-8")
                    .header("Content-Security-Policy", peintre::CSP)
                    .body(body)
                    .unwrap(),
                None => tauri::http::Response::builder()
                    .status(404)
                    .body(Vec::new())
                    .unwrap(),
            }
        })
        .setup(|app| {
            let config = app.path().app_config_dir()?;
            let data = app.path().app_data_dir()?;
            let desk_file = config.join("bureau.json");
            let first_launch = !desk_file.exists();
            let desk = Desk::load(&desk_file);
            app.manage(App {
                desk: Mutex::new(desk),
                dirty: AtomicBool::new(false),
                desk_file,
                drawings: data.join("bouquets"),
                en_cours: Mutex::new(HashMap::new()),
                possedes: Mutex::new(Vec::new()),
            });
            nft::appareil(app.handle());
            // belai:// links open this app (the installer registers it too)
            #[cfg(desktop)]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                if let Err(e) = app.deep_link().register("belai") {
                    eprintln!("belai://: {e}");
                }
            }
            let handle = app.handle().clone();

            // the bouquet tried last time is gone
            let tries: Vec<String> = {
                let d = handle.state::<App>().desk.lock().unwrap();
                d.bouquets
                    .iter()
                    .filter(|b| b.essai)
                    .map(|b| b.id.clone())
                    .collect()
            };
            for id in tries {
                remove(&handle, &id);
            }
            // bouquets whose screen is gone come back on the main one
            let all = areas(&handle);
            let placed = {
                let st = handle.state::<App>();
                let mut d = st.desk.lock().unwrap();
                for i in 0..d.bouquets.len() {
                    if !store::visible(&d.bouquets[i], &all) {
                        let size = store::sized(d.bouquets[i].view_box, all[0], store::SIZES[1].2);
                        let others: Vec<Placed> = d
                            .bouquets
                            .iter()
                            .enumerate()
                            .filter(|(j, o)| *j != i && store::visible(o, &all))
                            .map(|(_, o)| o.clone())
                            .collect();
                        let (x, y) = store::first_place(all[0], size, &others);
                        let b = &mut d.bouquets[i];
                        (b.x, b.y, b.w, b.h) = (x, y, size.0, size.1);
                        st.changed();
                    }
                }
                d.bouquets.clone()
            };
            for b in &placed {
                if let Err(e) = open(&handle, b) {
                    eprintln!("bouquet {}: {e}", b.id);
                }
            }

            TrayIconBuilder::with_id("belai")
                .tooltip("Belai's Flowers · bouquets sur le bureau")
                .icon(
                    app.default_window_icon()
                        .cloned()
                        .ok_or("icône manquante")?,
                )
                .menu(&tray_menu(&handle)?)
                .show_menu_on_left_click(true)
                .build(app)?;
            // one handler for every menu: the tray's and the bouquets' right clicks
            app.on_menu_event(on_menu);

            if first_launch {
                let _ = handle.autolaunch().enable();
                refresh_tray(&handle);
            }
            let args: Vec<String> = std::env::args().collect();
            for l in links_in(&args) {
                lien(&handle, &l);
            }
            nft::veiller(handle.clone());
            guetter(handle.clone());
            let files = files_in(&args);
            for f in &files {
                if let Err(e) = add(&handle, f) {
                    handle
                        .dialog()
                        .message(e)
                        .title("Belai's Flowers")
                        .kind(MessageDialogKind::Warning)
                        .show(|_| {});
                }
            }
            if files.is_empty()
                && placed.is_empty()
                && links_in(&args).is_empty()
                && !args.iter().any(|a| a == AT_LOGIN)
            {
                pick(&handle);
            }

            // positions are written once a second at most, while a bouquet is being moved
            let saver = handle.clone();
            std::thread::spawn(move || loop {
                std::thread::sleep(Duration::from_secs(1));
                saver.state::<App>().save_now();
            });
            // once a second, each bouquet learns whether other windows hide it: its breeze rests meanwhile
            let watcher = handle.clone();
            std::thread::spawn(move || {
                let mut known: std::collections::HashMap<String, bool> =
                    std::collections::HashMap::new();
                loop {
                    std::thread::sleep(Duration::from_millis(1000));
                    for (label, w) in watcher.webview_windows() {
                        if id_of(&label).is_none() {
                            continue;
                        }
                        let hidden = w
                            .hwnd()
                            .map(|h| desk::covered(h.0 as isize))
                            .unwrap_or(false);
                        if known.insert(label.clone(), hidden) != Some(hidden) {
                            let _ = w.emit_to(label.as_str(), "couvert", hidden);
                        }
                    }
                }
            });
            Ok(())
        })
        .on_window_event(|window, event| match event {
            WindowEvent::Moved(p) => remember(window.app_handle(), window.label(), Some(*p), None),
            WindowEvent::Resized(s) => {
                remember(window.app_handle(), window.label(), None, Some(*s))
            }
            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("Belai's Flowers ne peut pas démarrer")
        .run(|app, event| match event {
            // the app lives in the tray, even with no bouquet on the desk
            RunEvent::ExitRequested {
                api, code: None, ..
            } => api.prevent_exit(),
            RunEvent::Exit => app.state::<App>().save_now(),
            _ => {}
        });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn labels_carry_the_id() {
        assert_eq!(id_of(&label("19a2f")), Some("19a2f"));
        assert_eq!(id_of("main"), None);
    }

    #[test]
    fn files_given_at_launch() {
        let me = std::env::current_exe().unwrap().display().to_string();
        let args = vec![
            "app".into(),
            AT_LOGIN.into(),
            me.clone(),
            "nulle-part.html".into(),
        ];
        assert_eq!(files_in(&args), vec![PathBuf::from(me)]);
        let args = vec!["app".into(), "belai://lier?m=x&s=y".into()];
        assert_eq!(links_in(&args), vec!["belai://lier?m=x&s=y".to_owned()]);
        assert!(files_in(&args).is_empty());
    }
}
