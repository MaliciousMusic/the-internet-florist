import { spawn } from "node:child_process";
import { waitForAudioResources } from "./resources.ts";
await waitForAudioResources();
const child = spawn(process.execPath, ["--experimental-strip-types", "--test", "--test-concurrency=1", "test/*.test.ts"],
  { stdio: "inherit", windowsHide: true });
child.on("error", error => { console.error(error.message); process.exitCode = 1; });
child.on("exit", code => { process.exitCode = code ?? 1; });
