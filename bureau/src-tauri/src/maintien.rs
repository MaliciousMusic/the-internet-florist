//! A long press frees a fixed bouquet. A fixed bouquet lets the mouse through, so its window never hears a click: the
//! app watches the left button itself. Pressed for six seconds on a fixed bouquet, without moving, the bouquet becomes
//! editable again; a ring under the pointer fills meanwhile, and letting go or moving away cancels it.

/// How long to hold, in milliseconds.
pub const DUREE: u64 = 6000;
/// The ring shows after this long, so a plain click on the desktop never flashes it.
pub const RETARD: u64 = 500;
/// How far the pointer may drift while held, in pixels.
pub const DERIVE: i32 = 12;

#[derive(Debug, Clone, PartialEq)]
pub enum Pas {
    Rien,
    /// The ring of a bouquet: how far (0 to 1), and where the pointer is on the screen.
    Progres(String, f64, i32, i32),
    /// The press stopped before the end.
    Annule(String),
    /// Held long enough: the bouquet is freed.
    Libere(String),
}

#[derive(Debug, Default)]
pub struct Maintien {
    /// The bouquet pressed, when, and where.
    cible: Option<(String, u64, i32, i32)>,
    /// A press that already freed a bouquet, or began elsewhere: nothing until the button is let go.
    attendre: bool,
}

impl Maintien {
    /// One look at the mouse: is the left button down, where is the pointer, at what time (ms).
    /// `sous` names the fixed bouquet under a point, if any.
    pub fn pas(
        &mut self,
        appui: bool,
        x: i32,
        y: i32,
        t: u64,
        sous: impl Fn(i32, i32) -> Option<String>,
    ) -> Pas {
        if !appui {
            self.attendre = false;
            return match self.cible.take() {
                Some((id, t0, ..)) if t.saturating_sub(t0) >= RETARD => Pas::Annule(id),
                _ => Pas::Rien,
            };
        }
        if self.attendre {
            return Pas::Rien;
        }
        let Some((id, t0, x0, y0)) = self.cible.clone() else {
            match sous(x, y) {
                Some(id) => self.cible = Some((id, t, x, y)),
                None => self.attendre = true,
            }
            return Pas::Rien;
        };
        if (x - x0).abs() > DERIVE || (y - y0).abs() > DERIVE {
            self.cible = None;
            self.attendre = true;
            return if t.saturating_sub(t0) >= RETARD {
                Pas::Annule(id)
            } else {
                Pas::Rien
            };
        }
        let d = t.saturating_sub(t0);
        if d >= DUREE {
            self.cible = None;
            self.attendre = true;
            Pas::Libere(id)
        } else if d >= RETARD {
            Pas::Progres(id, (d - RETARD) as f64 / (DUREE - RETARD) as f64, x, y)
        } else {
            Pas::Rien
        }
    }
}

/// The left button and the pointer, on the whole screen (physical pixels).
#[cfg(windows)]
pub fn souris() -> (bool, i32, i32) {
    use windows_sys::Win32::Foundation::POINT;
    use windows_sys::Win32::UI::Input::KeyboardAndMouse::{GetAsyncKeyState, VK_LBUTTON};
    use windows_sys::Win32::UI::WindowsAndMessaging::GetCursorPos;
    let mut p = POINT { x: 0, y: 0 };
    // SAFETY: plain Win32 queries with a valid out-pointer.
    unsafe {
        let appui = (GetAsyncKeyState(i32::from(VK_LBUTTON)) as u16 & 0x8000) != 0;
        GetCursorPos(&mut p);
        (appui, p.x, p.y)
    }
}

#[cfg(not(windows))]
pub fn souris() -> (bool, i32, i32) {
    (false, 0, 0)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sur(x: i32, _y: i32) -> Option<String> {
        (x < 100).then(|| "a".to_owned())
    }

    #[test]
    fn six_seconds_still_free_the_bouquet() {
        let mut m = Maintien::default();
        assert_eq!(m.pas(true, 10, 10, 0, sur), Pas::Rien);
        assert_eq!(m.pas(true, 12, 10, 400, sur), Pas::Rien);
        assert_eq!(
            m.pas(true, 12, 11, 500, sur),
            Pas::Progres("a".into(), 0.0, 12, 11)
        );
        match m.pas(true, 13, 11, 3250, sur) {
            Pas::Progres(id, p, ..) => assert!(id == "a" && (p - 0.5).abs() < 1e-9),
            autre => panic!("{autre:?}"),
        }
        assert_eq!(m.pas(true, 13, 11, 6000, sur), Pas::Libere("a".into()));
        // still held: nothing more until the button is let go
        assert_eq!(m.pas(true, 13, 11, 9000, sur), Pas::Rien);
        assert_eq!(m.pas(false, 13, 11, 9100, sur), Pas::Rien);
        assert_eq!(m.pas(true, 13, 11, 9200, sur), Pas::Rien);
    }

    #[test]
    fn letting_go_or_moving_cancels() {
        let mut m = Maintien::default();
        m.pas(true, 10, 10, 0, sur);
        // a plain click: no ring, nothing to cancel
        assert_eq!(m.pas(false, 10, 10, 200, sur), Pas::Rien);
        m.pas(true, 10, 10, 1000, sur);
        m.pas(true, 10, 10, 2000, sur);
        assert_eq!(m.pas(false, 10, 10, 2100, sur), Pas::Annule("a".into()));
        m.pas(true, 10, 10, 3000, sur);
        m.pas(true, 10, 10, 4000, sur);
        assert_eq!(m.pas(true, 40, 10, 4100, sur), Pas::Annule("a".into()));
        // the press goes on, but stays cancelled until let go
        assert_eq!(m.pas(true, 10, 10, 12000, sur), Pas::Rien);
    }

    #[test]
    fn a_press_elsewhere_does_nothing() {
        let mut m = Maintien::default();
        assert_eq!(m.pas(true, 500, 10, 0, sur), Pas::Rien);
        // sliding onto a bouquet while held does not start it
        assert_eq!(m.pas(true, 10, 10, 7000, sur), Pas::Rien);
        assert_eq!(m.pas(false, 10, 10, 7100, sur), Pas::Rien);
        let _ = souris();
    }
}
