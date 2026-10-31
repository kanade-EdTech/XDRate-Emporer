import { mkdirSync, mkdtempSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (args, env = process.env) => {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`命令未完成，退出码：${result.status ?? '未知'}`);
};

let outDir;
try {
  run([path.join(root, 'node_modules/typescript/bin/tsc'), '-b', '--pretty', 'false']);
  const outputRoot = path.join(root, 'output');
  mkdirSync(outputRoot, { recursive: true });
  outDir = mkdtempSync(path.join(outputRoot, 'emperor-placeholder-'));
  run([
    path.join(root, 'node_modules/vite/bin/vite.js'), 'build',
    '--outDir', outDir, '--emptyOutDir', 'false',
  ], { ...process.env, XDRATE_EMPEROR_PLACEHOLDER_ONLY: '1' });
  run([path.join(root, 'scripts/audit-emperor-placeholder.mjs'), outDir]);
  console.log(`\n测试构建已生成：${outDir}`);
  console.log('此构建不包含内置人物画像，包含繁体隶书国号字牌，可自行上传人物图片。');
} catch (error) {
  console.error(`测试构建失败：${error instanceof Error ? error.message : String(error)}`);
  if (outDir) console.error(`未完成的文件保留在：${outDir}`);
  process.exitCode = 1;
}
