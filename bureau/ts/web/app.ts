/* « Mes bouquets sur mon ordinateur »: connect the wallet, see its bouquets, sign the link to this computer once,
   then set a bouquet on the desk through Belai Bureau. Opened by the desktop app with this computer's code.
   Everything is read through the wallet itself; nothing is sent anywhere but to the desktop app. */
import {
  adresseDe, appelJeton, creeLe, emisLe, estAdresse, estAppareil, etape, hexUtf8, lienBelai, message,
  SEL_BOUQUET, SEL_OWNER_OF, sujetVers, TOPIC_TRANSFER, type Lien,
} from './lien.js';

interface Eip1193 {
  request(a: { method: string; params?: unknown[] }): Promise<unknown>;
}
interface Annonce {
  info: { uuid: string; name: string; icon: string; rdns: string };
  provider: Eip1193;
}

const $ = (id: string) => document.getElementById(id)!;
const q = new URLSearchParams(location.search);
const appareil = q.get('ordinateur') ?? '';
const reseau = Number(q.get('reseau') ?? '8453');
const contrat = (q.get('contrat') ?? '').toLowerCase();
const debut = BigInt(q.get('debut') ?? '0');

let wallet: Eip1193 | null = null;
let adresse = '';
let signe: { m: string; s: string } | null = null;

function dire(t: string, alerte = false): void {
  const e = $('etat');
  e.textContent = t;
  e.classList.toggle('alerte', alerte);
}

/* ---- wallets: every extension announces itself (EIP-6963); the old window.ethereum when none does */
const portefeuilles = new Map<string, Annonce>();
addEventListener('eip6963:announceProvider', (e: Event) => {
  const a = (e as CustomEvent<Annonce>).detail;
  if (a?.info?.uuid && !portefeuilles.has(a.info.uuid)) {
    portefeuilles.set(a.info.uuid, a);
    montrerPortefeuilles();
  }
});

function montrerPortefeuilles(): void {
  const l = $('portefeuilles');
  l.replaceChildren();
  const liste: { nom: string; icone?: string; p: Eip1193 }[] = [...portefeuilles.values()].map(a => ({
    nom: a.info.name, icone: a.info.icon, p: a.provider,
  }));
  const ancien = (window as unknown as { ethereum?: Eip1193 }).ethereum;
  if (!liste.length && ancien) liste.push({ nom: 'Mon portefeuille', p: ancien });
  for (const w of liste) {
    const b = document.createElement('button');
    b.className = 'portefeuille';
    if (w.icone?.startsWith('data:image/')) {
      const i = document.createElement('img');
      i.src = w.icone;
      i.alt = '';
      b.append(i);
    }
    b.append(document.createTextNode(w.nom));
    b.onclick = () => void connecter(w.p);
    l.append(b);
  }
  $('sansportefeuille').hidden = liste.length > 0;
}

async function connecter(p: Eip1193): Promise<void> {
  try {
    const comptes = (await p.request({ method: 'eth_requestAccounts' })) as string[];
    if (!comptes?.length || !estAdresse(comptes[0])) throw new Error('aucun compte');
    wallet = p;
    adresse = comptes[0].toLowerCase();
    const id = Number(BigInt((await p.request({ method: 'eth_chainId' })) as string));
    if (id !== reseau) {
      await p.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${reseau.toString(16)}` }] });
    }
  } catch (e) {
    dire(`Le portefeuille n'a pas répondu (${(e as Error).message ?? e}).`, true);
    return;
  }
  $('etape-portefeuille').hidden = true;
  $('etape-bouquets').hidden = false;
  $('adresse').textContent = `${adresse.slice(0, 6)}…${adresse.slice(-4)}`;
  await lister();
}

/* ---- the bouquets of the wallet: every one it received, kept while it still owns it */
async function appeler(data: string): Promise<string> {
  return (await wallet!.request({ method: 'eth_call', params: [{ to: contrat, data }, 'latest'] })) as string;
}

async function lister(): Promise<void> {
  dire('Lecture de tes bouquets…');
  const fin = BigInt((await wallet!.request({ method: 'eth_blockNumber' })) as string);
  const recus = new Set<bigint>();
  let de = debut;
  let pas = 50000n;
  while (de <= fin) {
    const a = de + pas - 1n < fin ? de + pas - 1n : fin;
    try {
      const logs = (await wallet!.request({
        method: 'eth_getLogs',
        params: [{ address: contrat, fromBlock: `0x${de.toString(16)}`, toBlock: `0x${a.toString(16)}`,
          topics: [TOPIC_TRANSFER, null, sujetVers(adresse)] }],
      })) as { topics: string[] }[];
      for (const l of logs) if (l.topics[3]) recus.add(BigInt(l.topics[3]));
      de = a + 1n;
    } catch (e) {
      if (pas <= 500n) throw e;
      pas /= 5n;
    }
  }
  const liste = $('liste');
  liste.replaceChildren();
  const maintenant = Date.now() / 1000;
  let n = 0;
  for (const j of [...recus].sort((x, y) => (x < y ? -1 : 1))) {
    let a: string | null = null;
    try { a = adresseDe(await appeler(appelJeton(SEL_OWNER_OF, j))); } catch { /* gone */ }
    if (a !== adresse) continue;
    const cree = creeLe(await appeler(appelJeton(SEL_BOUQUET, j)));
    const li = document.createElement('li');
    const nom = document.createElement('span');
    nom.innerHTML = `<b>Bouquet n° ${j}</b><small>${cree === null ? '' : etape(cree, maintenant)}</small>`;
    const b = document.createElement('button');
    b.className = 'cta';
    b.textContent = 'Mettre sur mon écran';
    b.onclick = () => void poser(j.toString());
    li.append(nom, b);
    liste.append(li);
    n++;
  }
  dire(n ? `${n} bouquet${n > 1 ? 's' : ''} dans ce portefeuille.` : 'Aucun bouquet dans ce portefeuille pour l’instant.');
  $('relier').hidden = false;
}

/* ---- the link: one signature for this computer, kept for this visit */
async function signer(): Promise<{ m: string; s: string } | null> {
  if (signe) return signe;
  const l: Lien = { adresse, appareil, reseau, contrat, emis: emisLe(new Date()) };
  const m = message(l);
  try {
    const s = (await wallet!.request({ method: 'personal_sign', params: [hexUtf8(m), adresse] })) as string;
    signe = { m, s };
    return signe;
  } catch {
    dire('Signature refusée : rien n’a été relié.', true);
    return null;
  }
}

async function poser(jeton?: string): Promise<void> {
  const x = await signer();
  if (!x) return;
  dire(jeton ? `Belai Bureau va poser le bouquet n° ${jeton} sur ton bureau.` : 'Belai Bureau est relié à ton portefeuille.');
  location.href = lienBelai(x.m, x.s, jeton);
}

/* ---- start */
if (!estAppareil(appareil) || !estAdresse(contrat) || !Number.isInteger(reseau)) {
  $('etape-portefeuille').hidden = true;
  $('depuis-appli').hidden = false;
} else {
  $('relier').onclick = () => void poser();
  dispatchEvent(new Event('eip6963:requestProvider'));
  // extensions that answer late, or only the old way
  setTimeout(montrerPortefeuilles, 400);
}
