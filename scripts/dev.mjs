import { spawn } from "node:child_process";

const forwarded = process.argv.slice(2);
let hostname = "0.0.0.0";
let port = "3000";
const previewMode = forwarded.includes("--strictPort");

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];
  if ((argument === "--host" || argument === "-H") && forwarded[index + 1]) {
    hostname = forwarded[index + 1];
    index += 1;
  } else if ((argument === "--port" || argument === "-p") && forwarded[index + 1]) {
    port = forwarded[index + 1];
    index += 1;
  }
}

const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    previewMode ? "start" : "dev",
    "-H",
    hostname,
    "-p",
    port,
  ],
  { stdio: "inherit", env: process.env },
);

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
