async (page) => {
  const external = [];
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(page.url()).origin) external.push(request.url());
  });
  await page.reload();
  await page.locator('.emperor-card .portrait-large').getByRole('img', { name: '刘邦暂无画像，以西漢国号字牌代替' }).waitFor();
  await page.getByLabel('人物图片（可选）').setInputFiles('assets/emperor/source/刘邦.jpg');
  await page.getByText('图片已处理，将随本地草稿和备份保存。').waitFor();
  const portrait = page.locator('.emperor-card .portrait-large img');
  const src = await portrait.getAttribute('src');
  if (!src?.startsWith('data:image/jpeg;base64,')) throw new Error('自选图片未生效');
  await page.reload();
  if (await portrait.getAttribute('src') !== src) throw new Error('刷新后自选图片未恢复');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  if (!Buffer.concat(chunks).subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('未导出有效 PNG');
  if (external.length) throw new Error(`出现外部请求：${external.join(', ')}`);
  return { placeholder: '通过', localPortrait: '通过', reload: '通过', pngExport: '通过', noExternalRequests: '通过' };
}
