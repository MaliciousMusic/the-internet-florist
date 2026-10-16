//! What the app remembers between two launches: the bouquets set on the desktop, where, and at what size.
//! Kept as a small JSON file in the app's config folder; each bouquet's drawing is a file next to it.

use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Placed {
    pub id: String,
    pub name: String,
    pub view_box: [f64; 4],
    /// Outer position and size, in physical pixels of the virtual screen.
    pub x: i32,
    pub y: i32,
    pub w: u32,
    pub h: u32,
    /// Fixed where it stands: no frame on hover, no moving, the mouse goes through to the desktop.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub fixe: bool,
    /// In front of every window (tabs, apps, folders) instead of on the desktop under them.
    #[serde(default, skip_serializing_if = "std::ops::Not::not")]
    pub devant: bool,
    /// Set for a bouquet read from the chain: shown only while the linked wallet owns it.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nft: Option<Jeton>,
}

/// A bouquet NFT on the desk.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Jeton {
    /// The token id, in decimal.
    pub id: String,
    /// The wallet that owned it when it was set here.
    pub adresse: String,
    /// The last time the chain said this wallet still owns it (unix seconds).
    pub verifie: u64,
    /// The last time it was painted at its age (unix seconds).
    pub peint: u64,
}

/// The wallet linked to this computer: the message it signed and the signature.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct LienSigne {
    pub adresse: String,
    pub message: String,
    pub signature: String,
}

#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(default)]
pub struct Desk {
    /// Locked bouquets let the mouse through to the desktop under them.
    pub locked: bool,
    pub bouquets: Vec<Placed>,
    /// This computer's own code (32 hex digits), drawn at the first launch; a wallet link names it.
    pub appareil: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lien: Option<LienSigne>,
}

impl Desk {
    pub fn load(path: &Path) -> Desk {
        std::fs::read_to_string(path)
            .ok()
            .and_then(|s| serde_json::from_str(&s).ok())
            .unwrap_or_default()
    }

    pub fn save(&self, path: &Path) -> std::io::Result<()> {
        if let Some(dir) = path.parent() {
            std::fs::create_dir_all(dir)?;
        }
        // written aside then swapped, so a crash never leaves half a file
        let tmp = path.with_extension("json.tmp");
        std::fs::write(
            &tmp,
            serde_json::to_vec_pretty(self).map_err(std::io::Error::other)?,
        )?;
        std::fs::rename(tmp, path)
    }

    pub fn get_mut(&mut self, id: &str) -> Option<&mut Placed> {
        self.bouquets.iter_mut().find(|b| b.id == id)
    }

    pub fn remove(&mut self, id: &str) -> Option<Placed> {
        let i = self.bouquets.iter().position(|b| b.id == id)?;
        Some(self.bouquets.remove(i))
    }
}

/// A rectangle of the virtual screen (a monitor's work area), physical pixels.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Area {
    pub x: i32,
    pub y: i32,
    pub w: u32,
    pub h: u32,
}

/// The sizes offered in a bouquet's menu, as a share of the screen height.
pub const SIZES: [(&str, &str, f64); 4] = [
    ("petit", "Petit", 0.22),
    ("moyen", "Moyen", 0.38),
    ("grand", "Grand", 0.6),
    ("immense", "Très grand", 0.9),
];

/// The smallest a bouquet can be made, in physical pixels.
pub const MIN_SIDE: u32 = 80;

/// A size for a bouquet: `share` of the area's height, the width following the drawing, kept on the screen.
pub fn sized(view_box: [f64; 4], area: Area, share: f64) -> (u32, u32) {
    let ratio = view_box[2] / view_box[3];
    let mut h = (f64::from(area.h) * share).max(f64::from(MIN_SIDE));
    let mut w = h * ratio;
    if w > f64::from(area.w) {
        w = f64::from(area.w);
        h = w / ratio;
    }
    (w.round() as u32, h.round() as u32)
}

/// Where a new bouquet stands: at the bottom right of the area, a little off the edges,
/// moved to the left of the bouquets already there so they never land on top of each other.
pub fn first_place(area: Area, size: (u32, u32), others: &[Placed]) -> (i32, i32) {
    let margin = (area.h / 24) as i32;
    let gap = margin / 2;
    let (w, h) = (size.0 as i32, size.1 as i32);
    let mut x = area.x + area.w as i32 - w - margin;
    let y = (area.y + area.h as i32 - h - margin).max(area.y);
    // each step moves left of one bouquet in the way: as many steps as there are bouquets at most
    for _ in 0..=others.len() {
        let hit = others.iter().filter(|o| {
            x < o.x + o.w as i32 + gap && o.x < x + w + gap && y < o.y + o.h as i32 && o.y < y + h
        });
        match hit.map(|o| o.x).min() {
            Some(left) => x = left - gap - w,
            None => break,
        }
    }
    (x.max(area.x), y)
}

/// A bouquet whose screen was unplugged comes back on one that is there: true when enough of it
/// (a quarter of its width and height) lies on one of the areas.
pub fn visible(b: &Placed, areas: &[Area]) -> bool {
    areas.iter().any(|a| {
        let ox = overlap(b.x, b.w, a.x, a.w);
        let oy = overlap(b.y, b.h, a.y, a.h);
        ox * 4 >= i64::from(b.w).min(i64::from(a.w)) && oy * 4 >= i64::from(b.h).min(i64::from(a.h))
    })
}

fn overlap(p: i32, len: u32, q: i32, qlen: u32) -> i64 {
    let (p, q) = (i64::from(p), i64::from(q));
    ((p + i64::from(len)).min(q + i64::from(qlen)) - p.max(q)).max(0)
}

/// A short, unique name for a new bouquet's files.
pub fn new_id(now_ms: u128, taken: &[Placed]) -> String {
    let mut n = now_ms;
    loop {
        let id = format!("{n:x}");
        if taken.iter().all(|b| b.id != id) {
            return id;
        }
        n += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const AREA: Area = Area {
        x: 0,
        y: 0,
        w: 1920,
        h: 1032,
    };
    const VB: [f64; 4] = [0.0, 0.0, 400.0, 500.0];

    fn placed(id: &str, x: i32, y: i32) -> Placed {
        Placed {
            id: id.into(),
            name: "Bouquet".into(),
            view_box: VB,
            x,
            y,
            w: 400,
            h: 500,
            fixe: false,
            devant: false,
            nft: None,
        }
    }

    #[test]
    fn keeps_the_desk_between_launches() {
        let dir = std::env::temp_dir().join(format!("belai-bureau-test-{}", std::process::id()));
        let path = dir.join("bureau.json");
        assert_eq!(Desk::load(&path), Desk::default());
        let mut d = Desk {
            appareil: "0123456789abcdef0123456789abcdef".into(),
            lien: Some(LienSigne {
                adresse: "0xab".into(),
                message: "m".into(),
                signature: "0x".into(),
            }),
            locked: true,
            bouquets: vec![
                placed("a", 10, 20),
                Placed {
                    fixe: true,
                    devant: true,
                    nft: Some(Jeton {
                        id: "7".into(),
                        adresse: "0xab".into(),
                        verifie: 1,
                        peint: 2,
                    }),
                    ..placed("b", 30, 40)
                },
            ],
        };
        d.save(&path).unwrap();
        assert_eq!(Desk::load(&path), d);
        d.get_mut("b").unwrap().x = 99;
        assert_eq!(d.remove("b").unwrap().x, 99);
        assert!(d.remove("b").is_none());
        assert!(d.get_mut("b").is_none());
        std::fs::write(&path, "{ cassé").unwrap();
        assert_eq!(Desk::load(&path), Desk::default());
        std::fs::write(&path, "{\"locked\":true}").unwrap();
        assert!(Desk::load(&path).locked);
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn sizes_follow_the_drawing() {
        assert_eq!(sized(VB, AREA, 0.5), (413, 516));
        // a wide bouquet on a narrow screen is held by the width
        assert_eq!(
            sized([0.0, 0.0, 1000.0, 100.0], Area { w: 500, ..AREA }, 0.5),
            (500, 50)
        );
        assert_eq!(sized(VB, AREA, 0.0), (64, 80));
    }

    #[test]
    fn new_bouquets_stand_side_by_side() {
        let s = (400, 500);
        assert_eq!(first_place(AREA, s, &[]), (1477, 489));
        let first = Placed {
            x: 1477,
            y: 489,
            ..placed("a", 0, 0)
        };
        assert_eq!(
            first_place(AREA, s, std::slice::from_ref(&first)),
            (1056, 489)
        );
        // a bouquet elsewhere on the screen is not in the way
        assert_eq!(first_place(AREA, s, &[placed("b", 0, 0)]), (1477, 489));
        let row: Vec<Placed> = (0..6)
            .map(|i| Placed {
                x: 1477 - 421 * i,
                y: 489,
                ..placed("r", 0, 0)
            })
            .collect();
        assert_eq!(first_place(AREA, s, &row), (0, 489));
        assert_eq!(first_place(Area { h: 300, ..AREA }, s, &[]), (1508, 0));
    }

    #[test]
    fn lost_bouquets_are_found() {
        let areas = [
            AREA,
            Area {
                x: 1920,
                y: 0,
                w: 1920,
                h: 1080,
            },
        ];
        assert!(visible(&placed("a", 100, 100), &areas));
        assert!(visible(&placed("a", 3600, 700), &areas));
        assert!(!visible(&placed("a", 3800, 100), &areas));
        assert!(!visible(&placed("a", 100, 1000), &areas));
        assert!(!visible(&placed("a", -5000, 100), &areas));
    }

    #[test]
    fn ids_never_collide() {
        assert_eq!(new_id(255, &[]), "ff");
        assert_eq!(
            new_id(255, &[placed("ff", 0, 0), placed("100", 0, 0)]),
            "101"
        );
    }
}
