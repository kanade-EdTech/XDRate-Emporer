async (page) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.locator('.emperor-mobile-nav').getByRole('button', { name: '评分' }).click();
  await page.locator('.dimension-grid button').first().click();
  await page.getByLabel('精确分数（可填 0.1 精度）').fill('80');
  await page.getByLabel('评价理由（可选）').fill('这是一段用于检查长图的评价理由。'.repeat(15));
  await page.locator('.emperor-mobile-nav').getByRole('button', { name: '预览' }).click();
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 640 });
    await page.getByLabel('图片比例').selectOption('原始');
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
    const chunks = [];
    for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
    const png = Buffer.concat(chunks);
    if (png.readUInt32BE(16) !== 1040) throw new Error(`${width}px 视口下原始长图宽度不是 1040px`);
    const expected = `data:image/png;base64,${png.toString('base64')}`;
    await page.waitForFunction((src) => document.querySelector('.generated-preview img')?.getAttribute('src') === src, expected);
  }
  return { mobileOriginalWidth: '通过', desktopOriginalWidth: '通过', previewMatchesDownload: '通过' };
}
