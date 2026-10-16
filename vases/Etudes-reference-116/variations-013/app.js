/* Show the self-contained SVG artwork, including within the zoom view. */
const dialog = document.querySelector('#detail');
const zoom = document.querySelector('#zoom');
const artwork = document.querySelector('#detail-svg');
function changeTheme() {
  const dark = document.body.classList.toggle('dark');
  for (const button of document.querySelectorAll('#theme, #detail-theme')) {
    button.textContent = dark ? 'Fond clair' : 'Fond sombre';
  }
}
document.querySelector('#theme').addEventListener('click', changeTheme);
document.querySelector('#detail-theme').addEventListener('click', changeTheme);
function setZoom() {
  const scale = Number(zoom.value) / 100;
  artwork.style.width = `${600 * scale}px`;
  artwork.style.height = `${750 * scale}px`;
  document.querySelector('#zoom-value').value = `${zoom.value} %`;
}
for (const button of document.querySelectorAll('[data-svg]')) {
  button.addEventListener('click', () => {
    artwork.src = button.dataset.svg;
    artwork.alt = button.querySelector('img').alt;
    document.querySelector('#detail-title').textContent = button.dataset.title;
    zoom.value = '100';
    setZoom();
    dialog.showModal();
    document.querySelector('#viewport').scrollTo(0, 0);
  });
}
zoom.addEventListener('input', setZoom);
document.querySelector('#close').addEventListener('click', () => dialog.close());
