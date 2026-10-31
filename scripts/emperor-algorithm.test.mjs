import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { fixedDimensions, createEmperorRecord, calculateFixedScores, calculateCustomScores, calculateEmperorRecord } from '../src/domain/emperor/workspace.ts';

const fixed = values => Object.fromEntries(fixedDimensions.map(([id], index) => [id, values[index]]));
test('fixed formula: exact vectors and all twelve basis vectors', () => {
  assert.equal(fixedDimensions.reduce((sum, [, , weight]) => sum + weight, 0), 100);
  for (const value of [0, 50, 55.5, 80, 100]) assert.equal(calculateFixedScores(fixed(Array(12).fill(value))).score100, value);
  for (let index = 0; index < 12; index++) {
    const values = Array(12).fill(0); values[index] = 100;
    assert.equal(calculateFixedScores(fixed(values)).score100, fixedDimensions[index][2]);
  }
  const cases = [
    [[80,70,60,50,90,80,70,60,50,90,80,70], 73.3, 73.3],
    [[80,90,70,60,85,75,65,55,95,88,78,82], 78.91, 78.9],
    [[80,80,80,80,80,80,80,80,80,80,80,90], 81.8, 81.8],
  ];
  for (const [values, raw, displayed] of cases) {
    const result = calculateFixedScores(fixed(values));
    assert.equal(result.subtotal100, raw); assert.equal(result.score100, displayed);
    assert.ok(Math.abs(result.contributions.reduce((sum, c) => sum + c.contribution100, 0) - raw) < 1e-9);
  }
});
test('missing dimensions have coverage and subtotal but no final score; zero is rated', () => {
  const values = Array(12).fill(null);
  assert.equal(calculateFixedScores(fixed(values)).completed, 0);
  values[0] = 100;
  const result = calculateFixedScores(fixed(values));
  assert.equal(result.coveragePercent, 12); assert.equal(result.subtotal100, 12);
  assert.equal(result.score100, null); assert.equal(result.status, 'incomplete');
  values[1] = 0; assert.equal(calculateFixedScores(fixed(values)).completed, 2);
});
test('domain calculation rejects invalid numbers, keys and precision', () => {
  for (const value of [-1, 100.1, 55.55, NaN, Infinity, '50', undefined]) {
    const values = Array(12).fill(50); values[0] = value;
    assert.throws(() => calculateFixedScores(fixed(values)));
  }
  const scores = fixed(Array(12).fill(50)); delete scores.virtue; scores.fake = 50;
  assert.throws(() => calculateFixedScores(scores));
});
test('custom algorithm remains numerically equal to the existing v4 across weight and deduction combinations', async () => {
  const source = await readFile(new URL('../src/domain/rating/calculateRating.ts', import.meta.url), 'utf8');
  const legacy = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
  for (let seed = 0; seed < 200; seed++) {
    const draft = createEmperorRecord('test').custom;
    draft.axes = draft.axes.map((axis, index) => ({ ...axis, score: (seed + index * 3) % 11, importanceLevel: (seed + index) % 7, enabled: (seed + index) % 4 !== 0 }));
    draft.negativeItems = [{ id: 'deduction', name: '不足', reason: '', score: -(seed % 51) / 10, enabled: seed % 3 !== 0 }];
    const before = structuredClone(draft);
    const expected = legacy.calculateRating(draft); const actual = calculateCustomScores(draft);
    assert.equal(actual.status, expected.status);
    assert.equal(actual.score100, expected.status === 'ready' ? expected.score100 : null);
    assert.deepEqual(actual.contributions, expected.contributions);
    assert.deepEqual(draft, before);
  }
});
test('algorithm switching calculates the selected draft without mutating the other one', () => {
  const person = createEmperorRecord('test'); person.fixed.scores = fixed(Array(12).fill(80));
  person.custom.axes[0].score = 6;
  assert.equal(calculateEmperorRecord(person).score100, 80);
  person.selectedAlgorithm = 'emperor-custom-level-v1';
  assert.equal(calculateEmperorRecord(person).score100, 60);
  person.selectedAlgorithm = 'emperor-fixed-12-v1';
  assert.equal(calculateEmperorRecord(person).score100, 80);
});
