// apps.mjs: the app icons of the demo's desktops (demo.mjs, owner 2026-10-27: « crédibles et compréhensibles », no brand):
// each the thing it stands for on a rounded square of its colour. 64 x 64 units, drawn at the size of their place.

const sq = (id, a, b) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="64" height="64" rx="14.5" fill="url(#${id})"/>`;
const svg = (body) => `<svg viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;

export const APPS = {
  // the browser: a globe
  nav: svg(`${sq('g-nav', '#5fb0ff', '#1d6fe0')}<circle cx="32" cy="32" r="17" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="32" cy="32" rx="7.5" ry="17" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M15.5 26h33M15.5 38h33" stroke="#fff" stroke-width="2.6"/>`),
  // the files: a folder
  dossier: svg(`${sq('g-dos', '#eaf2fc', '#cfe0f5')}<path d="M12 21a4 4 0 0 1 4-4h10l4 4h18a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#f5b83d"/><path d="M12 27h40v18a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#fcd060"/>`),
  // the mail: an envelope
  courriel: svg(`${sq('g-mai', '#4fb3ff', '#1a7ae6')}<rect x="13" y="19" width="38" height="27" rx="4" fill="#fff"/><path d="M14.5 21.5 32 34l17.5-12.5" fill="none" stroke="#1a7ae6" stroke-width="2.6" stroke-linejoin="round"/>`),
  // the calendar: today's date
  agenda: svg(`<rect width="64" height="64" rx="14.5" fill="#fff"/><rect x="0.5" y="0.5" width="63" height="63" rx="14" fill="none" stroke="#e3e6ea"/><text x="32" y="20" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#ea4335">OCT</text><text x="32" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="27" font-weight="400" fill="#1f2328">27</text>`),
  // the photos: a landscape, its sun
  photos: svg(`${sq('g-pho', '#bfe3ff', '#e9f6ff')}<circle cx="44" cy="22" r="6" fill="#ffc73d"/><path d="M8 50 25 29l10 12 7-8 14 17z" fill="#3fa267"/><path d="M8 50 25 29l6 7.2L19 50z" fill="#2f8a52"/>`),
  // the music: a note
  musique: svg(`${sq('g-mus', '#ff6f8b', '#ef2d55')}<path d="M27 43V20l17-4v22" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><circle cx="23" cy="44" r="5" fill="#fff"/><circle cx="40" cy="39" r="5" fill="#fff"/>`),
  // the messages: a bubble
  messages: svg(`${sq('g-msg', '#6ee07a', '#2fbf4a')}<path d="M32 16c-10.5 0-19 6.7-19 15 0 4.6 2.6 8.7 6.7 11.4L18 49l8-3.6c1.9.4 3.9.6 6 .6 10.5 0 19-6.7 19-15s-8.5-15-19-15z" fill="#fff"/>`),
  // the settings: a cog
  reglages: svg(`${sq('g-reg', '#c3c8cf', '#8d949e')}<circle cx="32" cy="32" r="13" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="5.1 5.1"/><circle cx="32" cy="32" r="10.5" fill="none" stroke="#fff" stroke-width="3.4"/><circle cx="32" cy="32" r="4" fill="#fff"/>`),
  // the notes: lines on a pad
  notes: svg(`<rect width="64" height="64" rx="14.5" fill="#fff"/><rect x="0" y="0" width="64" height="16" rx="14.5" fill="#ffd54a"/><rect x="0" y="9" width="64" height="7" fill="#ffd54a"/><path d="M14 28h36M14 37h36M14 46h24" stroke="#c7cbd1" stroke-width="2.4" stroke-linecap="round"/>`),
  // Belai Bureau: the site's own icon (the vase and its three flowers on the shop's blue)
  belai: '<img alt="" src="apple-touch-icon.png">',
};

// a row of icons by name, each an <i> the desktop's styles size; the browser's carries .ic-nav (the cursor's target), Belai
// Bureau's .ic-belai (shown once it is installed)
export const row = (names) => names.map((n) => `<i class="ic ic-app${n === 'nav' ? ' ic-nav' : ''}${n === 'belai' ? ' ic-belai' : ''}">${APPS[n]}</i>`).join('');
