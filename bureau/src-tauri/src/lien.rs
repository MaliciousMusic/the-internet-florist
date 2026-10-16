//! The link between a wallet and this computer: a message the wallet signs once (an off-chain signature, free, which
//! allows no transaction), naming the wallet, this computer's own code, the network and the bouquets contract.
//! Whoever holds the wallet's key can sign it; nobody else can, and a signature made for another computer is refused.
//! The app checks it alone, without any server: it recovers the signer from the signature (EIP-191 « personal_sign »).

use k256::ecdsa::{RecoveryId, Signature, VerifyingKey};
use sha3::{Digest, Keccak256};
use std::fmt;

/// The first line of every link message: what the wallet shows its owner before signing.
pub const TITRE: &str = "Belai's Garden : afficher mes bouquets sur mon ordinateur";

/// What a link message says, line by line.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Lien {
    /// The wallet, 0x and 40 lowercase hex digits.
    pub adresse: String,
    /// This computer's code (32 hex digits), drawn at the first launch.
    pub appareil: String,
    pub reseau: u64,
    /// The bouquets contract, 0x and 40 lowercase hex digits.
    pub contrat: String,
    /// When it was signed, as the web app wrote it (UTC, ISO 8601).
    pub emis: String,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Refus {
    Illisible,
    Signature,
    AutreSignataire,
    AutreAppareil,
    AutreReseau,
    AutreContrat,
}

impl fmt::Display for Refus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            Refus::Illisible => "Ce lien de portefeuille est illisible.",
            Refus::Signature => "La signature de ce lien est abîmée.",
            Refus::AutreSignataire => "Ce lien n'a pas été signé par le portefeuille qu'il nomme.",
            Refus::AutreAppareil => "Ce lien a été signé pour un autre ordinateur. Relie ton portefeuille depuis celui-ci.",
            Refus::AutreReseau => "Ce lien a été signé pour un autre réseau.",
            Refus::AutreContrat => "Ce lien nomme un autre contrat de bouquets.",
        })
    }
}

impl Lien {
    /// The message, exactly as the web app has the wallet sign it.
    pub fn message(&self) -> String {
        format!(
            "{TITRE}\n\nPortefeuille : {}\nOrdinateur : {}\nRéseau : {}\nContrat : {}\nÉmis le : {}\n\n\
             Cette signature ne coûte rien et n'autorise aucune transaction.",
            self.adresse, self.appareil, self.reseau, self.contrat, self.emis
        )
    }

    /// Reads a link message back; None when it is not one.
    pub fn lire(message: &str) -> Option<Lien> {
        let champ = |nom: &str| {
            message
                .lines()
                .find_map(|l| l.strip_prefix(nom).map(|v| v.trim().to_owned()))
        };
        if message.lines().next()? != TITRE {
            return None;
        }
        let l = Lien {
            adresse: champ("Portefeuille : ")?.to_ascii_lowercase(),
            appareil: champ("Ordinateur : ")?,
            reseau: champ("Réseau : ")?.parse().ok()?,
            contrat: champ("Contrat : ")?.to_ascii_lowercase(),
            emis: champ("Émis le : ")?,
        };
        // only the message written by the web app, byte for byte: nothing added, nothing hidden
        (est_adresse(&l.adresse) && est_adresse(&l.contrat) && l.message() == message).then_some(l)
    }
}

pub fn est_adresse(a: &str) -> bool {
    a.len() == 42 && a.starts_with("0x") && a[2..].bytes().all(|c| c.is_ascii_hexdigit())
}

pub fn keccak(b: &[u8]) -> [u8; 32] {
    Keccak256::digest(b).into()
}

/// The address that signed `message` with `personal_sign`, 0x and 40 lowercase hex digits.
pub fn signataire(message: &str, signature: &str) -> Result<String, Refus> {
    let s = hex::decode(signature.trim_start_matches("0x")).map_err(|_| Refus::Signature)?;
    if s.len() != 65 {
        return Err(Refus::Signature);
    }
    let v = match s[64] {
        27 | 28 => s[64] - 27,
        0 | 1 => s[64],
        _ => return Err(Refus::Signature),
    };
    let sig = Signature::from_slice(&s[..64]).map_err(|_| Refus::Signature)?;
    let rid = RecoveryId::from_byte(v).ok_or(Refus::Signature)?;
    let mut prefixe = format!("\x19Ethereum Signed Message:\n{}", message.len()).into_bytes();
    prefixe.extend_from_slice(message.as_bytes());
    let cle = VerifyingKey::recover_from_prehash(&keccak(&prefixe), &sig, rid)
        .map_err(|_| Refus::Signature)?;
    Ok(adresse_de(&cle))
}

pub fn adresse_de(cle: &VerifyingKey) -> String {
    let p = cle.to_encoded_point(false);
    format!("0x{}", hex::encode(&keccak(&p.as_bytes()[1..])[12..]))
}

/// Checks a signed link for this computer, network and contract.
pub fn verifier(
    message: &str,
    signature: &str,
    appareil: &str,
    reseau: u64,
    contrat: &str,
) -> Result<Lien, Refus> {
    let l = Lien::lire(message).ok_or(Refus::Illisible)?;
    if signataire(message, signature)? != l.adresse {
        return Err(Refus::AutreSignataire);
    }
    if l.appareil != appareil {
        return Err(Refus::AutreAppareil);
    }
    if l.reseau != reseau {
        return Err(Refus::AutreReseau);
    }
    if l.contrat != contrat.to_ascii_lowercase() {
        return Err(Refus::AutreContrat);
    }
    Ok(l)
}

#[cfg(test)]
mod tests {
    use super::*;
    use k256::ecdsa::SigningKey;

    /// Signs as a wallet does with personal_sign (r, s, v = 27 or 28).
    fn signer(cle: &SigningKey, message: &str) -> String {
        let mut m = format!("\x19Ethereum Signed Message:\n{}", message.len()).into_bytes();
        m.extend_from_slice(message.as_bytes());
        let (sig, rid) = cle.sign_prehash_recoverable(&keccak(&m)).unwrap();
        let mut b = sig.to_bytes().to_vec();
        b.push(27 + rid.to_byte());
        format!("0x{}", hex::encode(b))
    }

    fn cle() -> SigningKey {
        // a fresh key for each run: no key written in the repository
        let mut b = [0u8; 32];
        getrandom::getrandom(&mut b).unwrap();
        SigningKey::from_slice(&b).unwrap()
    }

    fn lien(adresse: &str) -> Lien {
        Lien {
            adresse: adresse.into(),
            appareil: "0123456789abcdef0123456789abcdef".into(),
            reseau: 31337,
            contrat: "0x5fbdb2315678afecb367f032d93f642f64180aa3".into(),
            emis: "2026-10-16T01:50:00Z".into(),
        }
    }

    #[test]
    fn keccak_is_ethereum_s() {
        assert_eq!(
            hex::encode(keccak(b"Transfer(address,address,uint256)")),
            "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        );
    }

    #[test]
    fn the_owner_s_signature_links_this_computer() {
        let k = cle();
        let a = adresse_de(k.verifying_key());
        let l = lien(&a);
        let m = l.message();
        let s = signer(&k, &m);
        assert_eq!(Lien::lire(&m), Some(l.clone()));
        assert_eq!(
            verifier(
                &m,
                &s,
                &l.appareil,
                31337,
                &l.contrat.to_uppercase().replace("0X", "0x")
            ),
            Ok(l.clone())
        );
        // v as 0/1 is read too
        let mut b = hex::decode(&s[2..]).unwrap();
        b[64] -= 27;
        assert_eq!(signataire(&m, &hex::encode(&b)), Ok(a.clone()));
    }

    #[test]
    fn nobody_else_can_link() {
        let (k, autre) = (cle(), cle());
        let a = adresse_de(k.verifying_key());
        let l = lien(&a);
        let m = l.message();
        // signed by another wallet than the one named
        assert_eq!(
            verifier(&m, &signer(&autre, &m), &l.appareil, 31337, &l.contrat),
            Err(Refus::AutreSignataire)
        );
        let s = signer(&k, &m);
        assert_eq!(
            verifier(
                &m,
                &s,
                "ffffffffffffffffffffffffffffffff",
                31337,
                &l.contrat
            ),
            Err(Refus::AutreAppareil)
        );
        assert_eq!(
            verifier(&m, &s, &l.appareil, 8453, &l.contrat),
            Err(Refus::AutreReseau)
        );
        assert_eq!(
            verifier(&m, &s, &l.appareil, 31337, &a),
            Err(Refus::AutreContrat)
        );
        // a message changed after signing names another signer
        let changee = m.replace("31337", "31338");
        assert_eq!(
            verifier(&changee, &s, &l.appareil, 31338, &l.contrat),
            Err(Refus::AutreSignataire)
        );
        assert_eq!(
            verifier(&m, "0x1234", &l.appareil, 31337, &l.contrat),
            Err(Refus::Signature)
        );
        assert_eq!(
            verifier(&m, "zz", &l.appareil, 31337, &l.contrat),
            Err(Refus::Signature)
        );
        let mut b = hex::decode(&s[2..]).unwrap();
        b[64] = 30;
        assert_eq!(signataire(&m, &hex::encode(&b)), Err(Refus::Signature));
    }

    #[test]
    fn the_web_app_s_message_is_read() {
        // the same file the web app's tests build (apps/bureau/test/lien.test.js)
        let m = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../test/lien-temoin.txt"
        ))
        .unwrap();
        let l = Lien::lire(&m).unwrap();
        assert_eq!(l.adresse, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8");
        assert_eq!(
            (l.reseau, l.appareil.as_str()),
            (31337, "0123456789abcdef0123456789abcdef")
        );
        assert_eq!(l.message(), m);
    }

    #[test]
    fn only_link_messages_are_read() {
        let l = lien("0x00000000000000000000000000000000000000aa");
        assert!(Lien::lire(&l.message()).is_some());
        assert!(Lien::lire("Bonjour").is_none());
        assert!(Lien::lire(&format!("{}\nPS : autre chose", l.message())).is_none());
        assert!(Lien::lire(&l.message().replace("Réseau : 31337", "Réseau : trois")).is_none());
        assert!(Lien::lire(
            &l.message()
                .replace("0x00000000000000000000000000000000000000aa", "0x12")
        )
        .is_none());
        assert!(Lien::lire("").is_none());
        for r in [
            Refus::Illisible,
            Refus::Signature,
            Refus::AutreSignataire,
            Refus::AutreAppareil,
            Refus::AutreReseau,
            Refus::AutreContrat,
        ] {
            assert!(!r.to_string().is_empty());
        }
    }
}
