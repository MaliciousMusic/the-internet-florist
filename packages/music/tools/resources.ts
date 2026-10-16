import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { freemem } from "node:os";
const execute = promisify(execFile);

/** Serial audio jobs start only while the workstation retains its required free-memory margin. */
export async function waitForAudioResources(): Promise<void> {
  for (;;) {
    // Release previous excerpt buffers before measuring the workstation's available memory.
    globalThis.gc?.();
    const bytes = process.platform === "win32"
      ? Number((await execute("powershell.exe", ["-NoProfile", "-Command", "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory"], { windowsHide: true })).stdout.trim()) * 1024
      : freemem();
    if (Number.isFinite(bytes) && bytes > 4 * 1024 ** 3 + 64 * 1024 ** 2) return;
    console.log(`En attente de mémoire pour le rendu audio : ${(bytes / 1024 ** 3).toFixed(2)} Gio libres.`);
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
}
