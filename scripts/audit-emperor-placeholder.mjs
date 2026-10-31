import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('Usage: node scripts/audit-emperor-placeholder.mjs <build-directory>');
  process.exit(2);
}

const absoluteRoot = path.resolve(root);
const files = [];
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`不允许符号链接：${path.relative(absoluteRoot, fullPath)}`);
    if (entry.isDirectory()) await visit(fullPath);
    else if (entry.isFile()) files.push(fullPath);
  }
}

try {
  const countryCards = JSON.parse(await readFile(new URL('../assets/emperor/country-cards/manifest.json', import.meta.url), 'utf8'));
  const allowedCountryHashes = new Set(countryCards.cards.map((card) => card.sha256));
  await visit(absoluteRoot);
  if (!files.some((file) => path.relative(absoluteRoot, file) === 'index.html')) throw new Error('缺少入口 index.html');
  const html = await readFile(path.join(absoluteRoot, 'index.html'), 'utf8');
  if (!html.includes('帝王评分卡') || !/src=["']\.\/assets\//.test(html) || !/href=["']\.\/assets\//.test(html)) {
    throw new Error('入口名称或相对资源路径不正确');
  }
  for (const match of html.matchAll(/(?:src|href)=["'](\.\/assets\/[^"']+)["']/g)) {
    const target = path.resolve(absoluteRoot, match[1]);
    if (!target.startsWith(`${absoluteRoot}${path.sep}`) || !files.includes(target)) throw new Error(`入口资源缺失或路径无效：${match[1]}`);
  }
  let scripts = 0;
  let styles = 0;
  const manifest = [];
  for (const file of files.sort()) {
    const relative = path.relative(absoluteRoot, file).replaceAll('\\', '/');
    const data = await readFile(file);
    const extension = path.extname(file).toLowerCase();
    const hash = createHash('sha256').update(data).digest('hex');
    const isJpeg = data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    const isPng = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isGif = /^GIF8[79]a/.test(data.subarray(0, 6).toString('ascii'));
    const isWebp = data.subarray(0, 4).toString('ascii') === 'RIFF' && data.subarray(8, 12).toString('ascii') === 'WEBP';
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp', '.ico', '.svg'].includes(extension) || isJpeg || isPng || isGif || isWebp) {
      if (!(extension === '.png' && isPng && allowedCountryHashes.has(hash))) throw new Error(`发现非国号字牌的打包图片：${relative}`);
    }
    if (extension === '.js' || extension === '.css' || extension === '.html') {
      const content = data.toString('utf8');
      if (/data:image\/(?:png|jpe?g|webp|gif);base64,[A-Za-z0-9+/]{128}/i.test(content)) throw new Error(`发现嵌入图片：${relative}`);
      if (/海棠仙|香蕉皮|XDRate Music/.test(content)) throw new Error(`发现音乐版界面文本：${relative}`);
    }
    if (extension === '.js') scripts++;
    if (extension === '.css') styles++;
    manifest.push({ file: relative, bytes: data.length, sha256: hash });
  }
  if (!scripts || !styles) throw new Error('缺少脚本或样式文件');
  console.log(JSON.stringify({ result: '通过', files: manifest }, null, 2));
} catch (error) {
  console.error(`检查失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
