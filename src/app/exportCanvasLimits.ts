// Bound the temporary raster, before it is fitted into a fixed-ratio output canvas.
// Browser and device limits vary; these limits reduce peak allocation, not guarantee it.
export function exportPixelRatio(width: number, height: number, preferred: number): number {
  if (![width, height, preferred].every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error('图片尺寸无效');
  }
  return Math.min(preferred, Math.sqrt(12_000_000 / (width * height)), 16_000 / width, 16_000 / height);
}
