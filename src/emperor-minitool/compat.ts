// Small, local fallbacks for APIs used by this application on the Chrome 61 baseline.
const host = window as unknown as Record<string, unknown>;
if (!host.globalThis) host.globalThis = window;
if (!Object.fromEntries) Object.fromEntries = (entries: Iterable<readonly [PropertyKey, unknown]>) => {
  const output: Record<PropertyKey, unknown> = {};
  for (const [key, value] of entries) Object.defineProperty(output, key, { value, enumerable: true, writable: true, configurable: true });
  return output;
};
if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', { configurable: true, writable: true, value: function (this: unknown[], callback: (value: unknown, index: number, array: unknown[]) => unknown) {
    const result: unknown[] = [];
    this.forEach((value, index, array) => { const mapped = callback(value, index, array); if (Array.isArray(mapped)) result.push(...mapped); else result.push(mapped); });
    return result;
  } });
}
if (!HTMLImageElement.prototype.decode) HTMLImageElement.prototype.decode = function () {
  return new Promise<void>((resolve, reject) => {
    if (this.complete) { if (this.naturalWidth) resolve(); else reject(new Error('图片无法读取')); return; }
    this.addEventListener('load', () => resolve(), { once: true });
    this.addEventListener('error', () => reject(new Error('图片无法读取')), { once: true });
  });
};
if (!host.queueMicrotask) host.queueMicrotask = (callback: () => void) => { Promise.resolve().then(callback); };
export {};
