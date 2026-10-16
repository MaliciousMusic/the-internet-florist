//! The living bouquet of an NFT, drawn by the engine kept in the app: the very page the engine contract returns
//! (`html()`: head template, the bouquet's data, middle template, the engine, tail template, packages/engine), built here
//! from the recipe read on the chain. The engine computes the stage from the creation time and this computer's clock,
//! so the bouquet ages and fades by itself. A short script added at the end hands the drawing and its breeze marks to
//! the app, which then sways it like any bouquet on the desktop.

/// The engine, as stored on-chain (base64 of the gzip of the minified script), and the page templates.
const MOTEUR: &[u8] = include_bytes!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/../../packages/engine/dist/engine.b64"
));
const TETE: &[u8] = include_bytes!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/../../packages/engine/page/head.html"
));
const MILIEU: &[u8] = include_bytes!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/../../packages/engine/page/mid.html"
));
const QUEUE: &[u8] = include_bytes!(concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/../../packages/engine/page/tail.html"
));

/// Waits for the drawing to be complete (data-pret), adds the shared definitions (gradients, filters) to it and sends it.
const RELAIS: &str = r#"<script>(function(){var n=0,t=setInterval(function(){var s=document.getElementById('bq');if(!s||s.getAttribute('data-pret')!=='1'){if(++n>600){clearInterval(t);window.__TAURI__.core.invoke('peint',{svg:''})}return}clearInterval(t);var c=s.cloneNode(true),d=document.getElementById('defs');c.removeAttribute('style');c.removeAttribute('id');c.removeAttribute('data-pret');if(!c.getAttribute('xmlns'))c.setAttribute('xmlns','http://www.w3.org/2000/svg');if(d){var k=document.createElementNS('http://www.w3.org/2000/svg','defs');k.innerHTML=d.innerHTML;c.insertBefore(k,c.firstChild)}window.__TAURI__.core.invoke('peint',{svg:new XMLSerializer().serializeToString(c)})},100)})()</script>"#;

/// The page as the engine contract returns it, byte for byte.
pub fn page(belai: &str) -> Vec<u8> {
    [TETE, belai.as_bytes(), MILIEU, MOTEUR, QUEUE].concat()
}

/// The page with the relay that hands the drawing to the app.
pub fn page_relayee(belai: &str) -> Vec<u8> {
    let mut p = page(belai);
    let fin = b"</body></html>";
    let at = p
        .windows(fin.len())
        .rposition(|w| w == fin)
        .unwrap_or(p.len());
    p.splice(at..at, RELAIS.bytes());
    p
}

/// The engine's fingerprint (keccak256 of the stored bytes), to compare with contentHash() on the chain.
pub fn empreinte() -> String {
    format!("0x{}", hex::encode(crate::lien::keccak(MOTEUR)))
}

/// What the painting window may run: the page's own inline scripts and the engine they unzip; nothing from outside.
pub const CSP: &str = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; \
                       connect-src ipc: http://ipc.localhost";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_page_is_the_engine_contract_s() {
        // dist/fixture.html is what html(7, 1767225600, 41, seed, [20,2541,1952], [12,5,3]) returns (pack.py)
        let fixture = std::fs::read(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../packages/engine/dist/fixture.html"
        ))
        .unwrap();
        // the seed of the fixture is 0x5eed00c0ffee << 200: on 64 hex digits, 00, 5eed00c0ffee, then 50 zeros
        let belai = format!(
            "{{\"id\":7,\"createdAt\":1767225600,\"vaseId\":41,\"seed\":\"0x005eed00c0ffee{}\",\"skus\":[20,2541,1952],\"amounts\":[12,5,3]}}",
            "0".repeat(50)
        );
        assert!(
            page(&belai) == fixture,
            "la page diffère de dist/fixture.html"
        );
        let r = page_relayee(&belai);
        assert_eq!(r.len(), fixture.len() + RELAIS.len());
        assert!(r.ends_with(format!("{RELAIS}</body></html>").as_bytes()));
        assert!(empreinte().starts_with("0x") && empreinte().len() == 66);
    }
}
