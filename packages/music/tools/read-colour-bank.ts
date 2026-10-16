import {readFile} from 'node:fs/promises';
import {decodeColours,verifyColours} from '../src/colour-bank.ts';
const bytes=await readFile(new URL('../assets/colours.pcm',import.meta.url));
export const colourBytes=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength) as ArrayBuffer;
await verifyColours(colourBytes);
export const colours=decodeColours(colourBytes);
