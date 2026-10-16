//! Setting a window on the desktop itself, as a widget: above the wallpaper and the icons,
//! under every other window (or, when asked, in front of them all), out of the taskbar and of Alt+Tab, never taking the focus from the
//! window you are working in, and still there when « Afficher le bureau » (Win+D) clears the screen.

#[cfg(windows)]
pub fn settle(hwnd: isize, devant: bool) {
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        FindWindowW, GetWindowLongPtrW, SetWindowLongPtrW, SetWindowPos, GWLP_HWNDPARENT,
        GWL_EXSTYLE, HWND_BOTTOM, HWND_NOTOPMOST, HWND_TOPMOST, SWP_NOACTIVATE, SWP_NOMOVE,
        SWP_NOSIZE, WS_EX_APPWINDOW, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW,
    };
    let hwnd = hwnd as windows_sys::Win32::Foundation::HWND;
    let progman: Vec<u16> = "Progman\0".encode_utf16().collect();
    // SAFETY: plain Win32 calls on a live top-level window of this process; `progman` is NUL-terminated.
    unsafe {
        let style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
        let style =
            (style | (WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE) as isize) & !(WS_EX_APPWINDOW as isize);
        SetWindowLongPtrW(hwnd, GWL_EXSTYLE, style);
        // owned by the desktop window: it stays shown when the desktop is brought forward (Win+D)
        let desktop = FindWindowW(progman.as_ptr(), std::ptr::null());
        if !desktop.is_null() {
            SetWindowLongPtrW(hwnd, GWLP_HWNDPARENT, desktop as isize);
        }
        // in front of every window, or back under them all
        if !devant {
            SetWindowPos(
                hwnd,
                HWND_NOTOPMOST,
                0,
                0,
                0,
                0,
                SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE,
            );
        }
        SetWindowPos(
            hwnd,
            if devant { HWND_TOPMOST } else { HWND_BOTTOM },
            0,
            0,
            0,
            0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE,
        );
    }
}

#[cfg(not(windows))]
pub fn settle(_hwnd: isize, _devant: bool) {}

/// True when the windows above this one hide it entirely, so its breeze can rest.
/// Walks the windows from the top down to this one and takes their rectangles away from its own;
/// hidden, minimised, cloaked (other virtual desktops) and see-through windows hide nothing. A layered window
/// hides what is under it only when it is set fully opaque, without a colour key (as Chrome counts them).
#[cfg(windows)]
pub fn covered(hwnd: isize) -> bool {
    use windows_sys::Win32::Foundation::{HWND, RECT};
    use windows_sys::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_CLOAKED};
    use windows_sys::Win32::Graphics::Gdi::{
        CombineRgn, CreateRectRgn, DeleteObject, NULLREGION, RGN_DIFF,
    };
    use windows_sys::Win32::System::Threading::GetCurrentProcessId;
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        GetLayeredWindowAttributes, GetTopWindow, GetWindow, GetWindowLongPtrW, GetWindowRect,
        GetWindowThreadProcessId, IsIconic, IsWindowVisible, GWL_EXSTYLE, GW_HWNDNEXT, LWA_ALPHA,
        LWA_COLORKEY, WS_EX_LAYERED, WS_EX_TRANSPARENT,
    };
    let me = hwnd as HWND;
    // SAFETY: read-only Win32 queries; every region created here is deleted before returning.
    unsafe {
        let mut r = RECT {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        };
        if GetWindowRect(me, &mut r) == 0 || r.right <= r.left || r.bottom <= r.top {
            return false;
        }
        let left = CreateRectRgn(r.left, r.top, r.right, r.bottom);
        let ours = GetCurrentProcessId();
        let mut empty = false;
        let mut w = GetTopWindow(std::ptr::null_mut());
        let mut guard = 0;
        while !w.is_null() && w != me && guard < 4096 {
            guard += 1;
            let mut pid = 0u32;
            GetWindowThreadProcessId(w, &mut pid);
            let ex = GetWindowLongPtrW(w, GWL_EXSTYLE) as u32;
            let mut cloaked = 0u32;
            DwmGetWindowAttribute(
                w,
                DWMWA_CLOAKED as u32,
                (&mut cloaked as *mut u32).cast(),
                4,
            );
            let solid = ex & WS_EX_LAYERED == 0 || {
                let (mut key, mut alpha, mut flags) = (0u32, 0u8, 0u32);
                GetLayeredWindowAttributes(w, &mut key, &mut alpha, &mut flags) != 0
                    && flags & LWA_COLORKEY == 0
                    && (flags & LWA_ALPHA == 0 || alpha == 255)
            };
            let opaque = IsWindowVisible(w) != 0
                && IsIconic(w) == 0
                && cloaked == 0
                && pid != ours
                && ex & WS_EX_TRANSPARENT == 0
                && solid;
            let mut o = RECT {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            };
            if opaque && GetWindowRect(w, &mut o) != 0 && o.right > o.left && o.bottom > o.top {
                let cut = CreateRectRgn(o.left, o.top, o.right, o.bottom);
                let kind = CombineRgn(left, left, cut, RGN_DIFF);
                DeleteObject(cut);
                if kind == NULLREGION {
                    empty = true;
                    break;
                }
            }
            w = GetWindow(w, GW_HWNDNEXT) as HWND;
        }
        DeleteObject(left);
        empty
    }
}

#[cfg(not(windows))]
pub fn covered(_hwnd: isize) -> bool {
    false
}
