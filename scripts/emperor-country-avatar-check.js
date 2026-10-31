async (page) => {
  const crop = page.locator('.emperor-card .portrait-country-crop');
  await crop.waitFor();
  await page.waitForFunction(() => document.querySelector('.emperor-card .portrait-country-crop img')?.complete);
  const geometry = await crop.evaluate((frame) => {
    const image = frame.querySelector('img');
    return { clipped: getComputedStyle(frame).overflow === 'hidden', frame: frame.getBoundingClientRect().width, image: image.getBoundingClientRect().width };
  });
  if (!geometry.clipped || geometry.image < geometry.frame * 1.5) throw new Error('国号头像没有裁取中央部分');
  await page.locator('.emperor-card .portrait-large').screenshot({ path: 'output/emperor-central-avatar-preview.png' });
  await page.getByLabel('图片比例').selectOption('4:5');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  if (png.readUInt32BE(16) !== 1920 || png.readUInt32BE(20) !== 2400) throw new Error('头像导出尺寸不正确');
  return { centralCrop: '通过', pngExport: '通过' };
}
