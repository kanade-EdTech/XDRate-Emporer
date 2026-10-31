// Run with: node --experimental-strip-types scripts/sync-emperor-portrait-assets.mjs
import { existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emperorRoster } from '../src/domain/emperor/rosterData.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'assets/emperor/source');
const selected = new Map();
const aliases = new Map();
for (const person of emperorRoster) {
  const cleanName = person.imageFilename.replace(/^第\d+名_/, '');
  const chosen = [person.imageFilename, cleanName].find((name) => name && !/^第\d+名_/.test(name) && path.basename(name) === name && existsSync(path.join(source, name)));
  if (!chosen) continue;
  if (!selected.has(chosen)) selected.set(chosen, `portrait${selected.size}`);
  aliases.set(chosen, selected.get(chosen));
  aliases.set(person.imageFilename, selected.get(chosen));
}
const imports = [...selected].map(([file, name]) => `import ${name} from ${JSON.stringify(`../../assets/emperor/source/${file}`)};`);
const entries = [...aliases].map(([file, name]) => `  ${JSON.stringify(file)}: ${name},`);
writeFileSync(path.join(root, 'src/app/emperorPortraitAssets.ts'), [
  '// Generated from current roster; only selected clean image files are bundled.',
  '// Regenerate with: node --experimental-strip-types scripts/sync-emperor-portrait-assets.mjs',
  ...imports, '', 'export const filenameToUrl: Record<string, string> = {', ...entries, '};', '',
].join('\n'));
console.log(`Selected ${selected.size} portrait files; ranked screenshots and unused aliases excluded.`);
