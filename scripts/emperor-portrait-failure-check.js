async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const portrait = page.locator('.emperor-card .portrait-large img');
  await portrait.waitFor();
  const source = await portrait.getAttribute('src');
  await page.evaluate(() => {
    const nativeDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      if (this.closest('.emperor-card')?.parentElement?.getAttribute('aria-hidden') === 'true') {
        return Promise.reject(new Error('simulated portrait decode failure'));
      }
      return nativeDecode.call(this);
    };
    window.__placeholderSeen = false;
    new MutationObserver(() => {
      const placeholder = document.querySelector('[aria-hidden="true"] .portrait-large [role="img"]');
      if (placeholder?.getAttribute('aria-label')?.includes('西漢国号字牌') || placeholder?.textContent === '西漢') window.__placeholderSeen = true;
    }).observe(document.body, { childList: true, subtree: true });
  });
  await page.getByLabel('图片比例').selectOption('4:5');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  const download = await pending;
  const chunks = [];
  for await (const chunk of await download.createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  if (png.readUInt32BE(16) !== 1920 || png.readUInt32BE(20) !== 2400) throw new Error('占位图导出尺寸不正确');
  await page.getByText('画像加载失败，本次图片使用繁体国号字牌', { exact: false }).waitFor();
  if (!await page.evaluate(() => window.__placeholderSeen)) throw new Error('导出没有使用占位图');
  if (await portrait.getAttribute('src') !== source) throw new Error('导出改变了原画像');
  return { placeholderExport: '通过', visibleWarning: '通过', originalPreserved: '通过' };
}
