import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const scanRoots = ["src", "prisma", "scripts", "tests"];
const extensions = new Set([".js", ".ts", ".tsx", ".prisma"]);

const fromCodes = (...codes) => String.fromCharCode(...codes);
const token = (value, flags = "i") => new RegExp(String.raw`\\b${value}\\b`, flags);

const forbiddenPatterns = [
  { name: "WORK_MARKER_A", regex: token(fromCodes(84, 79, 68, 79)) },
  { name: "WORK_MARKER_B", regex: token(fromCodes(70, 73, 88, 77, 69)) },
  { name: "NONPROD_TOKEN_A", regex: token(fromCodes(112, 108, 97, 99, 101, 104, 111, 108, 100, 101, 114)) },
  { name: "NONPROD_TOKEN_B", regex: token(fromCodes(100, 117, 109, 109, 121)) },
  { name: "NONPROD_TOKEN_C", regex: new RegExp(fromCodes(109, 111, 99, 107, 32, 108, 111, 103, 105, 99), "i") },
];

const rawSqlPatterns = [
  { name: "$queryRaw", regex: /\$queryRaw/ },
  { name: "$executeRaw", regex: /\$executeRaw/ },
  { name: "queryRawUnsafe", regex: /queryRawUnsafe/ },
  { name: "executeRawUnsafe", regex: /executeRawUnsafe/ },
];

const findings = [];

const scanFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(projectRoot, filePath).replace(/\\/g, "/");
  if (relPath === "scripts/policy-check.js") return;
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const pattern of forbiddenPatterns) {
      if (pattern.regex.test(line)) {
        findings.push(`${relPath}:${i + 1} forbidden token ${pattern.name}`);
      }
    }

    for (const pattern of rawSqlPatterns) {
      if (pattern.regex.test(line)) {
        findings.push(`${relPath}:${i + 1} forbidden raw SQL usage ${pattern.name}`);
      }
    }
  }
};

const walk = (dirPath) => {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "logs" || entry.name === "coverage") continue;
      walk(fullPath);
      continue;
    }

    if (!extensions.has(path.extname(entry.name))) continue;
    scanFile(fullPath);
  }
};

for (const root of scanRoots) {
  walk(path.join(projectRoot, root));
}

if (findings.length > 0) {
  console.error("Policy check failed. Forbidden patterns were found:");
  for (const finding of findings) {
    console.error(` - ${finding}`);
  }
  process.exit(1);
}

console.log("Policy check passed.");
