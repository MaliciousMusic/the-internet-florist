//! Reading a « Vase animé » file (the living vase saved from « Sur mon écran »).
//!
//! The file is a standalone page: one `<svg>` holding the bouquet, its swaying layers marked `data-bz`,
//! and a small breeze script. Only the drawing is kept; the page's own script never runs in the app
//! (the widget page brings its own breeze, and its content security policy refuses inline scripts).

use std::fmt;

/// Larger files are refused: the richest bouquets weigh a few megabytes.
pub const MAX_BYTES: usize = 40 * 1024 * 1024;

#[derive(Debug, Clone, PartialEq)]
pub struct Bouquet {
    /// The `<svg>…</svg>` element, as written in the file.
    pub svg: String,
    /// Its viewBox: x, y, width, height.
    pub view_box: [f64; 4],
    /// The name shown in the menus, from the page title (« Bouquet de Léa »).
    pub name: String,
    /// How many layers sway in the breeze.
    pub swaying: usize,
}

#[derive(Debug, PartialEq)]
pub enum ReadError {
    TooLarge,
    NoDrawing,
    NoFrame,
}

impl fmt::Display for ReadError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            ReadError::TooLarge => "Ce fichier est trop lourd pour un bouquet.",
            ReadError::NoDrawing => "Ce fichier ne contient pas de bouquet. Choisis le « Vase animé » enregistré depuis « Sur mon écran ».",
            ReadError::NoFrame => "Le dessin de ce bouquet n'a pas de cadre (viewBox).",
        })
    }
}

/// Reads the bouquet out of a « Vase animé » page (or of a bare `.svg`).
pub fn read(page: &str) -> Result<Bouquet, ReadError> {
    if page.len() > MAX_BYTES {
        return Err(ReadError::TooLarge);
    }
    let start = find_tag(page, "<svg").ok_or(ReadError::NoDrawing)?;
    let end = page.rfind("</svg>").ok_or(ReadError::NoDrawing)? + "</svg>".len();
    if end <= start {
        return Err(ReadError::NoDrawing);
    }
    let svg = &page[start..end];
    let open_end = svg.find('>').ok_or(ReadError::NoDrawing)?;
    let view_box = attr(&svg[..open_end], "viewBox")
        .and_then(parse_view_box)
        .ok_or(ReadError::NoFrame)?;
    let name = title(page).unwrap_or_else(|| "Bouquet".to_owned());
    Ok(Bouquet {
        svg: svg.to_owned(),
        view_box,
        name,
        swaying: svg.matches(" data-bz=\"").count(),
    })
}

/// The first `<svg` that opens an element (not `<svgfoo`).
fn find_tag(s: &str, tag: &str) -> Option<usize> {
    let mut from = 0;
    while let Some(i) = s[from..].find(tag) {
        let at = from + i;
        match s.as_bytes().get(at + tag.len()) {
            Some(b' ' | b'>' | b'\n' | b'\r' | b'\t' | b'/') => return Some(at),
            _ => from = at + tag.len(),
        }
    }
    None
}

/// The value of an attribute in an opening tag.
fn attr<'a>(tag: &'a str, name: &str) -> Option<&'a str> {
    let key = format!(" {name}=");
    let i = tag.find(&key)? + key.len();
    let quote = *tag.as_bytes().get(i)?;
    if quote != b'"' && quote != b'\'' {
        return None;
    }
    let rest = &tag[i + 1..];
    let j = rest.find(quote as char)?;
    Some(&rest[..j])
}

fn parse_view_box(v: &str) -> Option<[f64; 4]> {
    let n: Vec<f64> = v
        .split(|c: char| c.is_whitespace() || c == ',')
        .filter(|p| !p.is_empty())
        .map(str::parse)
        .collect::<Result<_, _>>()
        .ok()?;
    match n[..] {
        [x, y, w, h] if w > 0.0 && h > 0.0 && n.iter().all(|v| v.is_finite()) => Some([x, y, w, h]),
        _ => None,
    }
}

/// The page title without the brand: « Bouquet de Léa · Belai's Flowers » gives « Bouquet de Léa ».
fn title(page: &str) -> Option<String> {
    let head = &page[..find_tag(page, "<svg").unwrap_or(page.len())];
    let i = head.find("<title>")? + "<title>".len();
    let j = head[i..].find("</title>")?;
    let t = unescape(&head[i..i + j]);
    let t = t.split(" · ").next().unwrap_or("").trim().to_owned();
    (!t.is_empty()).then(|| t.chars().take(60).collect())
}

fn unescape(s: &str) -> String {
    s.replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#39;", "'")
        .replace("&amp;", "&")
}

/// The height of a widget of a given width, so the window hugs the bouquet.
pub fn height_for(view_box: [f64; 4], width: f64) -> f64 {
    width * view_box[3] / view_box[2]
}

#[cfg(test)]
mod tests {
    use super::*;

    const PAGE: &str = "<!doctype html>\n<html lang=\"fr\"><head><meta charset=\"utf-8\"><title>Bouquet de L&#39;atelier · Belai's Flowers</title><style>svg{}</style></head><body><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"284 584 432 457.6\" preserveAspectRatio=\"xMidYMax meet\"><g data-bz=\"1.2,500,900,0\"><path d=\"M0 0\"/></g><g data-bz=\"0.8,510,880,120\"/><svg viewBox=\"0 0 1 1\"></svg></svg><script>(function(){})();</script></body></html>";

    #[test]
    fn reads_the_living_vase() {
        let b = read(PAGE).unwrap();
        assert!(b.svg.starts_with("<svg xmlns="));
        assert!(b.svg.ends_with("</svg></svg>"));
        assert!(!b.svg.contains("<script"));
        assert_eq!(b.view_box, [284.0, 584.0, 432.0, 457.6]);
        assert_eq!(b.name, "Bouquet de L'atelier");
        assert_eq!(b.swaying, 2);
    }

    #[test]
    fn reads_a_bare_svg() {
        let b = read("<svg viewBox='0,0,10,20'><g/></svg>").unwrap();
        assert_eq!(b.view_box, [0.0, 0.0, 10.0, 20.0]);
        assert_eq!(b.name, "Bouquet");
        assert_eq!(b.swaying, 0);
        assert_eq!(height_for(b.view_box, 300.0), 600.0);
    }

    #[test]
    fn refuses_what_is_not_a_bouquet() {
        assert_eq!(
            read("<html><body>rien</body></html>"),
            Err(ReadError::NoDrawing)
        );
        assert_eq!(
            read("<svgx viewBox=\"0 0 1 1\"></svg>"),
            Err(ReadError::NoDrawing)
        );
        assert_eq!(
            read("</svg><svg viewBox=\"0 0 1 1\">"),
            Err(ReadError::NoDrawing)
        );
        assert_eq!(read("<svg><g/></svg>"), Err(ReadError::NoFrame));
        assert_eq!(
            read("<svg viewBox=\"0 0 0 5\"></svg>"),
            Err(ReadError::NoFrame)
        );
        assert_eq!(
            read("<svg viewBox=\"0 0 a 5\"></svg>"),
            Err(ReadError::NoFrame)
        );
        assert_eq!(read("<svg viewBox=0></svg>"), Err(ReadError::NoFrame));
        assert_eq!(
            read("<svg viewBox=\"0 0 1 1></svg>"),
            Err(ReadError::NoFrame)
        );
        assert_eq!(read("<svg viewBox=\"0 0 1 1\""), Err(ReadError::NoDrawing));
        let big = "x".repeat(MAX_BYTES + 1);
        assert_eq!(read(&big), Err(ReadError::TooLarge));
    }

    #[test]
    fn errors_speak_french() {
        for e in [
            ReadError::TooLarge,
            ReadError::NoDrawing,
            ReadError::NoFrame,
        ] {
            assert!(!e.to_string().is_empty());
        }
    }

    #[test]
    fn titles_are_trimmed() {
        assert_eq!(title("<title> · Belai</title>"), None);
        assert_eq!(
            title("<title>Mes &amp; tiens</title><svg>"),
            Some("Mes & tiens".into())
        );
        let long = format!("<title>{}</title>", "é".repeat(80));
        assert_eq!(title(&long).unwrap().chars().count(), 60);
    }
}
