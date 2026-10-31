async (page) => {
  const fileInput = page.getByLabel('人物图片（可选）');
  await fileInput.setInputFiles('assets/emperor/source/刘邦.jpg');
  await page.getByText('图片已处理，将随本地草稿和备份保存。').waitFor();
  const portrait = page.locator('.emperor-card .portrait-large img');
  const original = await portrait.getAttribute('src');
  await page.locator('.dimension-grid button').first().click();
  const score = page.getByLabel('精确分数（可填 0.1 精度）');
  await score.fill('88');
  await page.getByLabel('个人签名档（可选）').fill('需要保留的签名');
  await page.evaluate(() => { window.confirm = () => false; });
  await fileInput.setInputFiles('assets/emperor/source/刘邦.jpg');
  await page.getByText('已取消更换图片。').waitFor();
  if (await portrait.getAttribute('src') !== original) throw new Error('取消更换改变了已有图片');
  await page.evaluate(() => { window.confirm = () => true; });
  await fileInput.setInputFiles({ name: 'broken.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('not an image') });
  await page.getByText('图片未更改：无法读取图片', { exact: false }).waitFor();
  if (await portrait.getAttribute('src') !== original || await score.inputValue() !== '88') throw new Error('无效图片影响了已有图片或评分');
  await page.reload();
  if (await portrait.getAttribute('src') !== original) throw new Error('刷新后已有图片丢失');
  if (await page.getByLabel('个人签名档（可选）').inputValue() !== '需要保留的签名') throw new Error('刷新后签名丢失');
  await page.locator('.dimension-grid button').first().click();
  if (await score.inputValue() !== '88') throw new Error('刷新后评分丢失');
  return { cancelledReplacement: '通过', invalidImage: '通过', reloadAndData: '通过' };
}
