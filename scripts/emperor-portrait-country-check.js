async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const card = page.locator('.emperor-card');
  const portrait = card.locator('.portrait-large > img');
  await page.waitForFunction(() => {
    const img = document.querySelector('.emperor-card .portrait-large > img');
    return img && img.complete && img.naturalWidth > 0;
  });
  const originalUrl = new URL(await portrait.getAttribute('src'), page.url()).href;
  await page.route(originalUrl, (route) => route.abort());
  await page.reload();
  await card.getByRole('img', { name: '刘邦暂无画像，以西漢国号字牌代替' }).waitFor();
  await page.unroute(originalUrl);
  await page.getByLabel('搜索帝王').fill('郭威');
  await page.getByRole('region', { name: '帝王名录结果' }).getByRole('button').filter({ hasText: '郭威' }).click();
  await card.getByRole('img', { name: '郭威暂无画像，以後周国号字牌代替' }).waitFor();
  await page.waitForFunction(() => {
    const img = document.querySelector('.emperor-card .portrait-country img');
    return img && img.complete && img.naturalWidth > 0;
  });
  await card.screenshot({ path: 'output/emperor-country-card-preview.png' });
  await page.getByLabel('图片比例').selectOption('4:5');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  if (png.readUInt32BE(16) !== 1920 || png.readUInt32BE(20) !== 2400) throw new Error('国号卡导出尺寸不正确');
  await page.waitForFunction((src) => document.querySelector('.generated-preview img')?.getAttribute('src') === src, `data:image/png;base64,${png.toString('base64')}`);
  await page.getByLabel('人物图片（可选）').setInputFiles('assets/emperor/source/刘邦.jpg');
  await page.getByText('图片已处理，将随本地草稿和备份保存。').waitFor();
  if (!(await portrait.getAttribute('src')).startsWith('data:image/jpeg;base64,')) throw new Error('自选画像没有覆盖国号字牌');
  return { builtInPortrait: '通过', loadFailureFallback: '通过', missingPortraitCountry: '通过', pngExport: '通过', uploadedPortraitPriority: '通过' };
}
