import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { emperorRoster, periodGroups } from '../src/domain/emperor/rosterData.ts';
import { countryLabel, getDynastyFlagSpec } from '../src/domain/emperor/countryLabels.ts';
import { createEmperorRecord, parseEmperorArchive, serializeEmperorArchive } from '../src/domain/emperor/workspace.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(__dirname, '..', 'assets', 'emperor', 'source');
const countryCardsDir = path.resolve(__dirname, '..', 'assets', 'emperor', 'country-cards');

test('roster contains 100 structurally valid entries for all top 100 emperors', () => {
  assert.equal(emperorRoster.length, 100);
  const ids = new Set();

  for (const emp of emperorRoster) {
    assert.ok(emp.id && emp.id.trim(), `ID empty for ${emp.name}`);
    assert.ok(!ids.has(emp.id), `Duplicate ID: ${emp.id}`);
    ids.add(emp.id);

    assert.ok(emp.name && emp.name.trim(), `Name empty for ${emp.id}`);
    assert.ok(emp.fullName && emp.fullName.trim(), `FullName empty for ${emp.id}`);
    assert.ok(emp.dynasty && emp.dynasty.trim(), `Dynasty empty for ${emp.id}`);
    assert.ok(periodGroups.includes(emp.periodGroup), `Invalid period group for ${emp.id}: ${emp.periodGroup}`);
    assert.ok(Array.isArray(emp.eraNames), `eraNames not array for ${emp.id}`);
    assert.ok(emp.reignDisplay, `reignDisplay empty for ${emp.id}`);
    assert.ok(emp.institution, `institution empty for ${emp.id}`);
    assert.ok(emp.artworkTitle, `artworkTitle empty for ${emp.id}`);

    // Check image file exists in assets/emperor/source
    const imagePath = path.join(sourceDir, emp.imageFilename);
    assert.ok(fs.existsSync(imagePath), `Image file missing: ${emp.imageFilename} for ${emp.name}`);
  }
});

test('all roster dynasties map to Traditional Clerical Script flag cards and Five-Element Virtue themes', () => {
  const seenElements = new Set();
  for (const emp of emperorRoster) {
    const label = countryLabel(emp.dynasty);
    assert.notEqual(label, '國號待補', `Missing country label for dynasty: ${emp.dynasty}`);
    const spec = getDynastyFlagSpec(emp.dynasty);
    assert.equal(spec.label, label);
    assert.ok(['metal', 'wood', 'water', 'fire', 'earth'].includes(spec.element));
    assert.ok(spec.theme.bgPrimary.startsWith('#'));
    seenElements.add(spec.element);

    const filename = 'country-' + Array.from(label).map((ch) => ch.codePointAt(0).toString(16)).join('-') + '.png';
    const flagPath = path.join(countryCardsDir, filename);
    assert.ok(fs.existsSync(flagPath), `Flag card PNG missing: ${filename} for ${emp.dynasty}`);
  }
  assert.deepEqual(
    [...seenElements].sort(),
    ['earth', 'fire', 'metal', 'water', 'wood'],
    'All five Virtue elements (白金、青木、黑水、赤火、黄土) must be represented',
  );
});

test('workspace initialized with all 100 emperors validates and roundtrips cleanly', () => {
  const records = emperorRoster.map(item => {
    const [start = '', end = ''] = item.reignDisplay.split('–');
    return createEmperorRecord(item.id, item.name, {
      dynasty: item.dynasty,
      templeName: item.templeName,
      posthumousName: item.posthumousName,
      eraNames: item.eraNames,
      reigns: [{ start: start.trim(), end: end.trim() }],
      identity: 'reigning',
      sources: [item.institution, item.artworkTitle],
    });
  });

  const workspace = {
    format: 'xdrate-emperor-archive',
    schemaVersion: 1,
    selectedEmperorId: emperorRoster[0].id,
    records,
  };

  const serialized = serializeEmperorArchive(workspace);
  const parsed = parseEmperorArchive(serialized);
  assert.equal(parsed.records.length, 100);
  assert.equal(parsed.selectedEmperorId, emperorRoster[0].id);
});

test('all 100 ranks (1-100) and standardized historical names including 爱新觉罗·玄烨 are complete', () => {
  const ranks = emperorRoster.map((e) => e.rank).sort((a, b) => a - b);
  assert.deepEqual(
    ranks,
    Array.from({ length: 100 }, (_, i) => i + 1),
    'Ranks 1 through 100 must be completely populated without gaps',
  );

  const names = new Set(emperorRoster.map((e) => e.name));
  for (const requiredName of [
    '爱新觉罗·努尔哈赤',
    '爱新觉罗·皇太极',
    '爱新觉罗·福临',
    '爱新觉罗·玄烨',
    '爱新觉罗·胤禛',
    '爱新觉罗·弘历',
    '爱新觉罗·颙琰',
    '孛儿只斤·忽必烈',
    '孛儿只斤·爱育黎拔力八达',
    '孛儿只斤·硕德八剌',
    '苻坚',
    '宇文泰',
    '刘彻',
    '刘恒',
    '李世民',
  ]) {
    assert.ok(names.has(requiredName), `Missing standardized emperor name in roster: ${requiredName}`);
  }

  const normalize = (v) => v.toLowerCase().replace(/[·•・.\s]/g, '');
  const kangxi = emperorRoster.find((e) => e.id === 'qing-xuanye');
  assert.ok(kangxi);
  assert.equal(kangxi.name, '爱新觉罗·玄烨');
  assert.ok(normalize(kangxi.name).includes(normalize('爱新觉罗玄烨')));
  assert.ok(kangxi.fullName.includes('康熙'));
});
