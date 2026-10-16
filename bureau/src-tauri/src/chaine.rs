//! Reading the bouquets contract (IBelaiBouquets) on the chain, read-only, through a public JSON-RPC node:
//! who owns a bouquet, its slot (creation time, vase), its recipe (SKUs, amounts, seed), and the bouquets a wallet
//! received. No key, no transaction, no server of ours.

use crate::lien::keccak;
use serde_json::{json, Value};
use std::time::Duration;

/// Where the bouquets live: the network, a node to ask, the contract and the block it was deployed in.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Reseau {
    pub id: u64,
    pub rpc: String,
    pub contrat: String,
    pub debut: u64,
    /// The web app page that links a wallet (opened with this computer's code).
    pub web: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Recette {
    pub id: String,
    pub cree: u64,
    pub vase: u64,
    /// 0x and 64 lowercase hex digits
    pub graine: String,
    pub skus: Vec<String>,
    pub quantites: Vec<String>,
}

impl Recette {
    /// `window.BELAI` as the engine contract writes it: decimal numbers, no spaces, the seed as 0x + 64 hex digits.
    pub fn belai(&self) -> String {
        format!(
            "{{\"id\":{},\"createdAt\":{},\"vaseId\":{},\"seed\":\"{}\",\"skus\":[{}],\"amounts\":[{}]}}",
            self.id,
            self.cree,
            self.vase,
            self.graine,
            self.skus.join(","),
            self.quantites.join(",")
        )
    }
}

#[derive(Debug)]
pub struct Erreur(pub String);

impl std::fmt::Display for Erreur {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0)
    }
}

fn err<E: std::fmt::Display>(e: E) -> Erreur {
    Erreur(e.to_string())
}

// ---------------------------------------------------------------- ABI, by hand: a few fixed shapes

pub fn selecteur(signature: &str) -> String {
    hex::encode(&keccak(signature.as_bytes())[..4])
}

/// A uint256 from its decimal writing, as 64 hex digits.
pub fn mot_de(decimal: &str) -> Option<String> {
    if decimal.is_empty() || decimal.len() > 78 || !decimal.bytes().all(|c| c.is_ascii_digit()) {
        return None;
    }
    // base 10 → base 256, on 32 bytes
    let mut b = [0u8; 32];
    for c in decimal.bytes() {
        let mut carry = u32::from(c - b'0');
        for x in b.iter_mut().rev() {
            let v = u32::from(*x) * 10 + carry;
            *x = (v & 0xff) as u8;
            carry = v >> 8;
        }
        if carry != 0 {
            return None;
        }
    }
    Some(hex::encode(b))
}

/// A uint256 word (64 hex digits) in decimal.
pub fn decimal(mot: &str) -> Option<String> {
    let mut b = hex::decode(mot).ok()?;
    if b.len() != 32 {
        return None;
    }
    let mut out = Vec::new();
    while b.iter().any(|&x| x != 0) {
        let mut r = 0u32;
        for x in b.iter_mut() {
            let v = (r << 8) | u32::from(*x);
            *x = (v / 10) as u8;
            r = v % 10;
        }
        out.push(b'0' + r as u8);
    }
    if out.is_empty() {
        out.push(b'0');
    }
    out.reverse();
    String::from_utf8(out).ok()
}

/// The 32-byte words of an answer.
fn mots(reponse: &str) -> Option<Vec<String>> {
    let h = reponse.trim_start_matches("0x");
    if !h.len().is_multiple_of(64) {
        return None;
    }
    Some(
        (0..h.len() / 64)
            .map(|i| h[i * 64..i * 64 + 64].to_ascii_lowercase())
            .collect(),
    )
}

fn petit(mot: &str) -> Option<usize> {
    let v = u64::from_str_radix(mot.get(48..)?, 16).ok()?;
    (mot[..48].bytes().all(|c| c == b'0') && v < 1 << 32).then_some(v as usize)
}

/// ownerOf: the address in the word.
pub fn lire_adresse(reponse: &str) -> Option<String> {
    let m = mots(reponse)?;
    let w = m.first()?;
    w[..24]
        .bytes()
        .all(|c| c == b'0')
        .then(|| format!("0x{}", &w[24..]))
}

/// bouquet(): (address creator, uint40 createdAt, uint16 vaseId).
pub fn lire_bouquet(reponse: &str) -> Option<(u64, u64)> {
    let m = mots(reponse)?;
    if m.len() < 3 {
        return None;
    }
    Some((petit_u64(&m[1])?, petit_u64(&m[2])?))
}

fn petit_u64(mot: &str) -> Option<u64> {
    mot[..48]
        .bytes()
        .all(|c| c == b'0')
        .then(|| u64::from_str_radix(&mot[48..], 16).ok())?
}

/// recipe(): a tuple (uint256[] skuIds, uint256[] amounts, bytes32 seed), returned behind one offset.
pub fn lire_recette(reponse: &str) -> Option<(Vec<String>, Vec<String>, String)> {
    let m = mots(reponse)?;
    let base = petit(m.first()?)? / 32;
    let tableau = |at: usize| -> Option<Vec<String>> {
        let debut = base + petit(m.get(at)?)? / 32;
        let n = petit(m.get(debut)?)?;
        if n > 4096 {
            return None;
        }
        (0..n).map(|i| decimal(m.get(debut + 1 + i)?)).collect()
    };
    let skus = tableau(base)?;
    let quantites = tableau(base + 1)?;
    let graine = format!("0x{}", m.get(base + 2)?);
    (skus.len() == quantites.len()).then_some((skus, quantites, graine))
}

// ---------------------------------------------------------------- the node

pub struct Noeud {
    r: Reseau,
    agent: ureq::Agent,
}

impl Noeud {
    pub fn new(r: Reseau) -> Noeud {
        let agent = ureq::AgentBuilder::new()
            .timeout(Duration::from_secs(20))
            .build();
        Noeud { r, agent }
    }

    fn appel(&self, methode: &str, params: Value) -> Result<Value, Erreur> {
        let rep: Value = self
            .agent
            .post(&self.r.rpc)
            .send_json(json!({"jsonrpc": "2.0", "id": 1, "method": methode, "params": params}))
            .map_err(err)?
            .into_json()
            .map_err(err)?;
        if let Some(e) = rep.get("error") {
            return Err(Erreur(
                e.get("message")
                    .and_then(Value::as_str)
                    .unwrap_or("erreur du nœud")
                    .to_owned(),
            ));
        }
        rep.get("result")
            .cloned()
            .ok_or_else(|| Erreur("réponse vide".into()))
    }

    fn lire(&self, signature: &str, jeton: &str) -> Result<String, Erreur> {
        let mot = mot_de(jeton).ok_or_else(|| Erreur("numéro de bouquet illisible".into()))?;
        let data = format!("0x{}{}", selecteur(signature), mot);
        let r = self.appel(
            "eth_call",
            json!([{"to": self.r.contrat, "data": data}, "latest"]),
        )?;
        r.as_str()
            .map(str::to_owned)
            .ok_or_else(|| Erreur("réponse illisible".into()))
    }

    /// The network the node serves: it must be the one the app was built for.
    pub fn reseau(&self) -> Result<u64, Erreur> {
        let r = self.appel("eth_chainId", json!([]))?;
        let h = r
            .as_str()
            .ok_or_else(|| Erreur("réponse illisible".into()))?;
        u64::from_str_radix(h.trim_start_matches("0x"), 16).map_err(err)
    }

    /// The owner of a bouquet; None once it does not exist (or the contract refuses).
    pub fn proprietaire(&self, jeton: &str) -> Result<Option<String>, Erreur> {
        match self.lire("ownerOf(uint256)", jeton) {
            Ok(r) => Ok(lire_adresse(&r)),
            // a call that reverts: no such bouquet
            Err(e) if e.0.contains("revert") => Ok(None),
            Err(e) => Err(e),
        }
    }

    pub fn recette(&self, jeton: &str) -> Result<Recette, Erreur> {
        let (cree, vase) = lire_bouquet(&self.lire("bouquet(uint256)", jeton)?)
            .ok_or_else(|| Erreur("bouquet illisible".into()))?;
        let (skus, quantites, graine) = lire_recette(&self.lire("recipe(uint256)", jeton)?)
            .ok_or_else(|| Erreur("recette illisible".into()))?;
        Ok(Recette {
            id: jeton.to_owned(),
            cree,
            vase,
            graine,
            skus,
            quantites,
        })
    }

    /// The fingerprint of the engine frozen on the chain (IBelaiBouquets.engine() then IBelaiEngine.contentHash()),
    /// None when the contract names none.
    pub fn empreinte_moteur(&self) -> Option<String> {
        let data = format!("0x{}", selecteur("engine()"));
        let r = self
            .appel(
                "eth_call",
                json!([{"to": self.r.contrat, "data": data}, "latest"]),
            )
            .ok()?;
        let moteur = lire_adresse(r.as_str()?)?;
        if moteur == format!("0x{}", "0".repeat(40)) {
            return None;
        }
        let data = format!("0x{}", selecteur("contentHash()"));
        let h = self
            .appel("eth_call", json!([{"to": moteur, "data": data}, "latest"]))
            .ok()?;
        let m = mots(h.as_str()?)?;
        Some(format!("0x{}", m.first()?))
    }

    /// The bouquets a wallet holds now: every bouquet it ever received (Transfer logs, read by ranges of blocks),
    /// kept when it is still its owner.
    pub fn bouquets_de(&self, adresse: &str) -> Result<Vec<String>, Erreur> {
        let fin = {
            let r = self.appel("eth_blockNumber", json!([]))?;
            u64::from_str_radix(r.as_str().unwrap_or("0x0").trim_start_matches("0x"), 16)
                .map_err(err)?
        };
        let topic = format!(
            "0x{}",
            hex::encode(keccak(b"Transfer(address,address,uint256)"))
        );
        let vers = format!("0x{:0>64}", adresse.trim_start_matches("0x"));
        let mut recus: Vec<String> = Vec::new();
        let (mut de, mut pas) = (self.r.debut, 50_000u64);
        while de <= fin {
            let a = (de + pas - 1).min(fin);
            let filtre = json!([{"address": self.r.contrat, "fromBlock": format!("0x{de:x}"), "toBlock": format!("0x{a:x}"),
                                 "topics": [topic, Value::Null, vers]}]);
            match self.appel("eth_getLogs", filtre) {
                Ok(Value::Array(logs)) => {
                    for l in logs {
                        if let Some(id) = l["topics"]
                            .get(3)
                            .and_then(Value::as_str)
                            .and_then(|t| decimal(t.trim_start_matches("0x")))
                        {
                            if !recus.contains(&id) {
                                recus.push(id);
                            }
                        }
                    }
                    de = a + 1;
                }
                // nodes cap the range of a log query: ask for less
                Err(_) if pas > 500 => pas /= 5,
                Err(e) => return Err(e),
                Ok(_) => return Err(Erreur("réponse illisible".into())),
            }
        }
        let mut garde = Vec::new();
        for id in recus {
            if self.proprietaire(&id)?.as_deref() == Some(adresse) {
                garde.push(id);
            }
        }
        Ok(garde)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn selectors_are_the_abi_s() {
        assert_eq!(selecteur("ownerOf(uint256)"), "6352211e");
        assert_eq!(selecteur("balanceOf(address)"), "70a08231");
        // the same as the web app's (ts/web/lien.ts)
        assert_eq!(selecteur("bouquet(uint256)"), "52323054");
    }

    #[test]
    fn numbers_cross_both_ways() {
        assert_eq!(mot_de("0").unwrap(), "0".repeat(64));
        assert_eq!(mot_de("255").unwrap(), format!("{}ff", "0".repeat(62)));
        let max = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
        assert_eq!(mot_de(max).unwrap(), "f".repeat(64));
        assert_eq!(decimal(&"f".repeat(64)).unwrap(), max);
        assert_eq!(
            decimal(&mot_de("1767225600").unwrap()).unwrap(),
            "1767225600"
        );
        assert!(mot_de(
            "115792089237316195423570985008687907853269984665640564039457584007913129639936"
        )
        .is_none());
        assert!(mot_de("").is_none() && mot_de("12a").is_none() && mot_de("-1").is_none());
        assert!(decimal("12").is_none() && decimal("zz").is_none());
    }

    fn w(n: u64) -> String {
        format!("{n:064x}")
    }

    #[test]
    fn answers_are_read() {
        let owner = format!("0x{}{}", "0".repeat(24), "ab".repeat(20));
        assert_eq!(
            lire_adresse(&owner).unwrap(),
            format!("0x{}", "ab".repeat(20))
        );
        assert!(lire_adresse(&format!("0x{}", "f".repeat(64))).is_none());
        assert!(lire_adresse("0x").is_none() && lire_adresse("0x123").is_none());

        let createur = format!("{}{}", "0".repeat(24), "cd".repeat(20));
        let b = format!("0x{createur}{}{}", w(1_767_225_600), w(41));
        assert_eq!(lire_bouquet(&b), Some((1_767_225_600, 41)));
        assert!(lire_bouquet(&format!("0x{}", w(1))).is_none());

        // recipe(7): tuple offset, then (offset skus, offset amounts, seed), then the two arrays
        let graine = "5eed".repeat(16);
        let r = [
            w(32),
            w(96),
            w(192),
            graine.clone(),
            w(2),
            w(20),
            w(2541),
            w(2),
            w(12),
            w(5),
        ]
        .concat();
        let (s, q, g) = lire_recette(&format!("0x{r}")).unwrap();
        assert_eq!(s, vec!["20", "2541"]);
        assert_eq!(q, vec!["12", "5"]);
        assert_eq!(g, format!("0x{graine}"));
        // arrays of different lengths, or truncated
        let bad = [w(32), w(96), w(160), graine.clone(), w(1), w(20), w(0)].concat();
        assert!(lire_recette(&format!("0x{bad}")).is_none());
        assert!(lire_recette(&format!("0x{}", &r[..r.len() - 64])).is_none());
        assert!(lire_recette(&format!(
            "0x{}",
            [w(32), w(96), w(192), graine, w(1u64 << 40)].concat()
        ))
        .is_none());
    }

    #[test]
    fn the_page_data_is_the_engine_contract_s() {
        let r = Recette {
            id: "7".into(),
            cree: 1_767_225_600,
            vase: 41,
            graine: format!("0x{}", "0".repeat(64)),
            skus: vec!["20".into(), "2541".into(), "1952".into()],
            quantites: vec!["12".into(), "5".into(), "3".into()],
        };
        assert_eq!(
            r.belai(),
            format!(
                "{{\"id\":7,\"createdAt\":1767225600,\"vaseId\":41,\"seed\":\"0x{}\",\"skus\":[20,2541,1952],\"amounts\":[12,5,3]}}",
                "0".repeat(64)
            )
        );
    }
}
