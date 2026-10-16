/* The link message a wallet signs to show its bouquets on one computer, and the belai:// link that hands it to the
   desktop app. Byte for byte the message the app reads back (apps/bureau/src-tauri/src/lien.rs). */

export const TITRE = "Belai's Garden : afficher mes bouquets sur mon ordinateur";

export interface Lien {
  adresse: string;
  appareil: string;
  reseau: number;
  contrat: string;
  emis: string;
}

export function message(l: Lien): string {
  return (
    `${TITRE}\n\nPortefeuille : ${l.adresse.toLowerCase()}\nOrdinateur : ${l.appareil}\nRéseau : ${l.reseau}\n` +
    `Contrat : ${l.contrat.toLowerCase()}\nÉmis le : ${l.emis}\n\n` +
    `Cette signature ne coûte rien et n'autorise aucune transaction.`
  );
}

/** The time of signing, to the second, in UTC. */
export function emisLe(d: Date): string {
  return d.toISOString().replace(/\.\d+Z$/, 'Z');
}

export function estAdresse(a: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(a);
}

export function estAppareil(a: string): boolean {
  return /^[0-9a-f]{32}$/.test(a);
}

/** UTF-8 then base64url without padding. */
export function base64url(s: string): string {
  const b = new TextEncoder().encode(s);
  let bin = '';
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The UTF-8 bytes of a text, in hex, as personal_sign takes them. */
export function hexUtf8(s: string): string {
  let h = '0x';
  for (const x of new TextEncoder().encode(s)) h += x.toString(16).padStart(2, '0');
  return h;
}

/** The link that opens the desktop app with the signed link, and maybe a bouquet to set on the desk. */
export function lienBelai(m: string, signature: string, jeton?: string): string {
  return `belai://lier?m=${base64url(m)}&s=${signature}` + (jeton ? `&jeton=${jeton}` : '');
}

// ---------------------------------------------------------------- the chain, read through the wallet

export const SEL_OWNER_OF = '6352211e';
/** keccak256("bouquet(uint256)") first four bytes */
export const SEL_BOUQUET = '52323054';
export const TOPIC_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

export function mot(n: bigint): string {
  return n.toString(16).padStart(64, '0');
}

export function appelJeton(selecteur: string, jeton: bigint): string {
  return `0x${selecteur}${mot(jeton)}`;
}

export function adresseDe(reponse: string): string | null {
  const h = reponse.replace(/^0x/, '');
  if (h.length < 64 || !/^0{24}/.test(h)) return null;
  return `0x${h.slice(24, 64).toLowerCase()}`;
}

export function sujetVers(adresse: string): string {
  return `0x${adresse.toLowerCase().replace(/^0x/, '').padStart(64, '0')}`;
}

/** bouquet(): (creator, createdAt, vaseId) → createdAt in unix seconds */
export function creeLe(reponse: string): number | null {
  const h = reponse.replace(/^0x/, '');
  if (h.length < 192) return null;
  return Number(BigInt(`0x${h.slice(64, 128)}`));
}

/** The life stage, as stageOf() on the chain: bud < 3 days, bloom < 20, decline < 30, then faded. */
export function etape(creeA: number, maintenant: number): string {
  const jours = (maintenant - creeA) / 86400;
  return jours < 3 ? 'en bouton' : jours < 20 ? 'en fleur' : jours < 30 ? 'sur le déclin' : 'fané';
}
