import { readFile } from "node:fs/promises";
import { decodeBank, verifyBank } from "../src/bank.ts";
const bytes = await readFile(new URL("../assets/library.pcm", import.meta.url));
export const bankBytes = bytes.buffer instanceof ArrayBuffer && bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
  ? bytes.buffer : bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
await verifyBank(bankBytes);
export const bank = decodeBank(bankBytes);
