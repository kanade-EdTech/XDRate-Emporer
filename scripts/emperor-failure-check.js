async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.setViewportSize({ width: 1440, height: 900 });
  const signature = page.getByLabel('个人签名档（可选）');
  await signature.fill('需要保留的签名');
  await page.locator('.dimension-grid button').first().click();
  await page.getByLabel('精确分数（可填 0.1 精度）').fill('70');
  await page.locator('.emperor-backup summary').click();
  await page.locator('.emperor-backup input[type=file]').setInputFiles({
    name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{"incomplete":'),
  });
  await page.getByText('导入失败，当前内容未更改：', { exact: false }).waitFor();
  check(await signature.inputValue() === '需要保留的签名', '无效导入改变了签名');
  check(await page.getByLabel('精确分数（可填 0.1 精度）').inputValue() === '70', '无效导入改变了评分');
  await page.reload();
  check(await signature.inputValue() === '需要保留的签名', '无效导入影响了已保存草稿');
  await page.locator('.dimension-grid button').first().click();
  check(await page.getByLabel('精确分数（可填 0.1 精度）').inputValue() === '70', '无效导入影响了已保存评分');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  await download;
  await page.locator('.generated-preview img').waitFor();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => {} });
  });
  await page.getByRole('button', { name: '分享图片', exact: true }).click();
  await page.getByText('当前环境不支持图片系统分享', { exact: false }).waitFor();
  check(await page.getByRole('link', { name: '下载这张图片' }).isVisible(), '不支持分享时没有下载入口');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('cancelled', 'AbortError'); } });
  });
  await page.getByRole('button', { name: '分享图片', exact: true }).click();
  await page.getByText('已取消分享。').waitFor();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new Error('simulated failure'); } });
  });
  await page.getByRole('button', { name: '分享图片', exact: true }).click();
  await page.getByText('分享未完成，请重试或下载图片。').waitFor();
  check(await signature.inputValue() === '需要保留的签名', '分享失败影响了草稿');
  check(await page.getByLabel('精确分数（可填 0.1 精度）').inputValue() === '70', '分享失败影响了评分');
  return { invalidImport: '通过', unsupportedShare: '通过', cancelledShare: '通过', failedShare: '通过' };
}
