import assert from 'node:assert/strict';
import test from 'node:test';
import { exportPixelRatio } from '../src/app/exportCanvasLimits.ts';

test('short cards retain their preferred render density', () => {
  assert.equal(exportPixelRatio(520, 1500, 2), 2);
  assert.equal(exportPixelRatio(960, 1000, 3), 3);
});

test('long cards stay inside the temporary pixel and side limits', () => {
  for (const [width, height, preferred] of [[520, 12000, 2], [960, 10000, 3], [520, 100000, 2]]) {
    const ratio = exportPixelRatio(width, height, preferred);
    assert.ok(ratio > 0 && ratio <= preferred);
    assert.ok(width * height * ratio * ratio <= 12_000_000.01);
    assert.ok(width * ratio <= 16000.01 && height * ratio <= 16000.01);
  }
});

test('invalid dimensions are rejected', () => {
  for (const dimensions of [[0, 100, 2], [100, Infinity, 2], [100, 100, NaN]]) {
    assert.throws(() => exportPixelRatio(...dimensions), /图片尺寸无效/);
  }
});
