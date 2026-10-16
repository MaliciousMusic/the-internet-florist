import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const publicRoot=fileURLToPath(new URL('../../../',import.meta.url));
const publicAssets=new Set();
try{const manifest=JSON.parse(await readFile(path.join(publicRoot,'music/manifest.json'),'utf8'));
  for(const name of Object.keys(manifest.files))publicAssets.add('music/'+name);
  publicAssets.add('music/manifest.json');publicAssets.add('index.html');
}catch{}
const port = Number(process.env.BELAI_MUSIC_PORT ?? 8741);
if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 8766) throw new Error("Invalid music port");
const samples = JSON.parse(await readFile(new URL("../assets/manifest.json", import.meta.url), "utf8"));
const allowed = new Set(["atelier-musique.html", "music.js", "worklet.js", "render-worker.js", "manifest.json",
  "credits.html", "atelier-phrases.html", "atelier-reseaux.html", "connected-worker.js", "sample-manifest.json", "composition-worker.js", "engine-status.json", `library-${samples.sha256.slice(0, 12)}.pcm`]);
for (const [instrument, metadata] of Object.entries(samples.instruments)) allowed.add(`instrument-${instrument}-${metadata.sha256.slice(0, 12)}.pcm`);
const colours=JSON.parse(await readFile(new URL('../assets/colour-manifest.json',import.meta.url),'utf8'));
for(const [instrument,metadata] of Object.entries(colours.instruments))allowed.add(`colour-${instrument}-${metadata.sha256.slice(0,12)}.pcm`);
for(const name of ['colour-manifest.json','writing-catalogue.json','reference-summary.json'])allowed.add(name);
for(const name of ['belai-flower.html','flower-drawing.js','live-worker.js','signature-catalogue.json','universe-manifest.json'])allowed.add(name);
const universes=JSON.parse(await readFile(new URL('../assets/universe-manifest.json',import.meta.url),'utf8'));
for(const [instrument,metadata] of Object.entries(universes.instruments))allowed.add(`universe-${instrument}-${metadata.sha256.slice(0,12)}.pcm`);
for(const name of publicAssets)allowed.add(name);
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  let name = url.pathname.slice(1) || (publicAssets.has('index.html')?'index.html':'belai-flower.html');
  const old = /^belai-music\/(0\.[456])\.0$/.exec(url.searchParams.get("v") ?? "")?.[1];
  if (name.startsWith("catalogue/") && old) name = name.replace("catalogue/", `catalogue-${old}/`);
  if (!allowed.has(name) && !/^connected(?:-0\.2)?\/(?:index\.json|reseau-(?:5|12|40|80|350)-[12]\.(?:wav|json))$/.test(name) && !/^studies\/(?:index\.json|(?:solo|chamber|orchestra)\.(?:wav|json))$/.test(name) && !/^catalogue(?:-0\.[456])?\/index\.json$/.test(name)
    && !/^catalogue(?:-0\.[456])?\/bouquet-(1|5|12|40|80|350)-[1-3]\.(wav|json)$/.test(name)) { response.writeHead(404); response.end(); return; }
  try {
    const body = await readFile(path.join(publicAssets.has(name)?publicRoot:root, name));
    const headers = { "Content-Type": name.endsWith(".html") ? "text/html; charset=utf-8"
      : name.endsWith(".json") ? "application/json" : name.endsWith(".wav") ? "audio/wav" : name.endsWith(".pcm") ? "application/octet-stream" : "text/javascript",
      "Cache-Control": "no-store", "Accept-Ranges": "bytes", "Content-Length": body.length };
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match?.[1] ? Number(match[1]) : Math.max(0, body.length - Number(match?.[2]));
      const end = match?.[1] && match?.[2] ? Math.min(body.length - 1, Number(match[2])) : body.length - 1;
      if (!match || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= body.length || !match[1] && !match[2]) {
        response.writeHead(416, { "Content-Range": `bytes */${body.length}` }); response.end(); return;
      }
      response.writeHead(206, { ...headers, "Content-Length": end - start + 1, "Content-Range": `bytes ${start}-${end}/${body.length}` });
      response.end(body.subarray(start, end + 1)); return;
    }
    response.writeHead(200, headers);
    response.end(body);
  } catch { response.writeHead(404); response.end("Construire le paquet avec npm run build."); }
});
server.listen(port, "127.0.0.1", () => console.log(`Atelier : http://127.0.0.1:${port}`));
