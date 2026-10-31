async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (let index = 0; index < 3; index++) {
    await page.locator('.dimension-grid button').nth(index).click();
    await page.getByLabel('评价理由（可选）').fill('长\n'.repeat(250));
  }
  await page.getByLabel('图片比例').selectOption('4:5');
  const pending = page.waitForEvent('download', { timeout: 60000 });
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  if (png.readUInt32BE(16) !== 1920 || png.readUInt32BE(20) !== 2400) throw new Error('长内容 PNG 尺寸不正确');
  await page.getByText('已降低临时渲染分辨率', { exact: false }).waitFor();
  const source = `data:image/png;base64,${png.toString('base64')}`;
  await page.waitForFunction((expected) => document.querySelector('.generated-preview img')?.getAttribute('src') === expected, source);
  return { lengthyContentExport: '通过', resolutionWarning: '通过', previewMatchesDownload: '通过' };
}
