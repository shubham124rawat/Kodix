import { cpSync, existsSync, rmSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "node_modules/monaco-editor/min/vs");
const dest = resolve(root, "public/vs");

if (!existsSync(src)) {
  console.error("monaco-editor not found in node_modules. Run npm install first.");
  process.exit(1);
}

// Fresh copy every build so stale hashed chunks never linger.
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log("Monaco editor copied to public/vs");
