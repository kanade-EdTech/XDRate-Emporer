import assert from 'node:assert/strict';
import test from 'node:test';
import { createEmperorRecord, parseEmperorArchive, serializeEmperorArchive, saveEmperorWorkspace, loadEmperorWorkspace, emperorWorkspaceKey } from '../src/domain/emperor/workspace.ts';

const fixture = () => ({ format: 'xdrate-emperor-archive', schemaVersion: 1, selectedEmperorId: 'person-a', records: [createEmperorRecord('person-a', '测试人物')] });

test('both algorithm drafts preserve null, real zero, fractions, reasons and weights', () => {
  const workspace = fixture();
  const person = workspace.records[0];
  person.fixed.scores.virtue = 0;
  person.fixed.scores.wisdom = 55.5;
  person.fixed.reasons.wisdom = '测试理由';
  person.custom.axes[0].score = 8;
  person.custom.axes[0].importanceLevel = 6;
  person.selectedAlgorithm = 'emperor-custom-level-v1';
  assert.deepEqual(parseEmperorArchive(serializeEmperorArchive(workspace)), workspace);
  person.selectedAlgorithm = 'emperor-fixed-12-v1';
  assert.equal(person.custom.axes[0].score, 8);
});
test('image ratio survives backup and legacy archives remain compatible', () => {
  const legacy = fixture();
  assert.equal(parseEmperorArchive(serializeEmperorArchive(legacy)).imageRatio, undefined);
  legacy.imageRatio = '16:9';
  assert.equal(parseEmperorArchive(serializeEmperorArchive(legacy)).imageRatio, '16:9');
  legacy.imageRatio = 'invalid';
  assert.throws(() => serializeEmperorArchive(legacy));
});
test('optional summaries preserve separate drafts and old archives remain readable', () => {
  const workspace = fixture();
  const person = workspace.records[0];
  person.fixed.comment = '旧版总体评价';
  const legacy = parseEmperorArchive(serializeEmperorArchive(workspace));
  assert.equal(legacy.records[0].fixed.summary, undefined);
  assert.equal(legacy.records[0].fixed.comment, '旧版总体评价');
  person.fixed.summary = '甲'.repeat(24);
  person.custom.summary = '自定义评价';
  const restored = parseEmperorArchive(serializeEmperorArchive(workspace));
  assert.equal(restored.records[0].fixed.summary, '甲'.repeat(24));
  assert.equal(restored.records[0].custom.summary, '自定义评价');
  person.fixed.summary = '甲'.repeat(25);
  assert.throws(() => serializeEmperorArchive(workspace), /一句话评价/);
});
test('local portrait survives backup and rejects unsupported content', () => {
  const workspace = fixture();
  workspace.records[0].portraitDataUrl = 'data:image/jpeg;base64,YWJj';
  assert.equal(parseEmperorArchive(serializeEmperorArchive(workspace)).records[0].portraitDataUrl, workspace.records[0].portraitDataUrl);
  workspace.records[0].portraitDataUrl = 'data:image/svg+xml;base64,YWJj';
  assert.throws(() => serializeEmperorArchive(workspace));
});
test('large Chinese backups use the same byte limit for export and import', () => {
  const workspace = fixture();
  for (let i = 0; i < 120; i++) {
    const record = createEmperorRecord(`person-${i}`);
    for (const key of Object.keys(record.fixed.reasons)) record.fixed.reasons[key] = '评'.repeat(500);
    workspace.records.push(record);
  }
  const encoded = serializeEmperorArchive(workspace);
  assert.ok(new TextEncoder().encode(encoded).byteLength > 2_000_000);
  assert.deepEqual(parseEmperorArchive(encoded), workspace);
});
test('cache uses only the emperor namespace and restores independent people', () => {
  const values = new Map([['xdrate.music.workspace.v2', 'untouched']]);
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(loadEmperorWorkspace(storage), null);
  const workspace = fixture();
  workspace.records.push(createEmperorRecord('person-b'));
  workspace.records[1].fixed.scores.virtue = 100;
  saveEmperorWorkspace(storage, workspace);
  assert.deepEqual(loadEmperorWorkspace(storage), workspace);
  assert.equal(values.get('xdrate.music.workspace.v2'), 'untouched');
  assert.equal(values.size, 2);
  assert.ok(values.has(emperorWorkspaceKey));
});
test('invalid imports leave the existing workspace unchanged', () => {
  const current = fixture();
  const before = serializeEmperorArchive(current);
  for (const mutate of [
    w => { w.format = 'xdrate-music-archive'; },
    w => { w.schemaVersion = 2; },
    w => { w.records.push(structuredClone(w.records[0])); },
    w => { w.selectedEmperorId = 'missing'; },
    w => { w.records[0].fixed.scores.virtue = -1; },
    w => { w.records[0].fixed.scores.virtue = 100.1; },
    w => { w.records[0].fixed.scores.virtue = 55.55; },
    w => { w.records[0].fixed.scores.virtue = '50'; },
    w => { delete w.records[0].fixed.scores.virtue; },
    w => { w.records[0].fixed.scores.unrecognized = 50; },
    w => { w.records[0].custom.axes[0].score = 0.5; },
    w => { w.records[0].selectedAlgorithm = 'unknown'; },
  ]) {
    const imported = fixture(); mutate(imported);
    assert.throws(() => parseEmperorArchive(JSON.stringify(imported)));
    assert.equal(serializeEmperorArchive(current), before);
  }
  assert.throws(() => parseEmperorArchive('{'));
});
test('failed validation does not overwrite a valid cache', () => {
  let stored = 'existing';
  const invalid = fixture(); invalid.records[0].custom.axes[0].importanceLevel = 7;
  assert.throws(() => saveEmperorWorkspace({ setItem: (_, value) => { stored = value; } }, invalid));
  assert.equal(stored, 'existing');
});
test('nonfinite scores cannot silently serialize as unrated null', () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    const workspace = fixture(); workspace.records[0].fixed.scores.virtue = value;
    assert.throws(() => serializeEmperorArchive(workspace));
  }
  const encoded = JSON.stringify(fixture()).replace('"virtue":null', '"virtue":1e400');
  assert.throws(() => parseEmperorArchive(encoded));
});
