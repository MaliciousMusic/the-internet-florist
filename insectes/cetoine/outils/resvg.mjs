// resvg from the shared tools' node_modules (the species' own tools live outside that folder)
import { createRequire } from 'node:module';
export const { Resvg } = createRequire(new URL('../../outils/package.json', import.meta.url))('@resvg/resvg-js');
