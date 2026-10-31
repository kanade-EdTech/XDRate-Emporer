async (page) => {
  const failed = [];
  const external = [];
  page.on('response', (response) => {
    if (['script', 'stylesheet', 'image'].includes(response.request().resourceType()) && response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  });
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(page.url()).origin) external.push(request.url());
  });
  await page.reload();
  await page.getByRole('heading', { name: '评分编辑' }).waitFor();
  const portrait = page.locator('.emperor-card .portrait-large img');
  await portrait.waitFor();
  await page.waitForFunction(() => {
    const img = document.querySelector('.emperor-card .portrait-large img');
    return img && img.complete && img.naturalWidth > 0;
  });
  await page.getByLabel('图片比例').selectOption('4:5');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const png = Buffer.concat(chunks);
  if (png.readUInt32BE(16) !== 1920 || png.readUInt32BE(20) !== 2400) throw new Error('子目录图片导出失败');
  if (failed.length || external.length) throw new Error(`资源异常：${JSON.stringify({ failed, external })}`);
  return { subdirectoryAssets: '通过', portrait: '通过', pngExport: '通过', noExternalRequests: '通过' };
}
