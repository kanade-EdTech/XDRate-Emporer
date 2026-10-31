async (page) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    window.__albumProbe = { writes: 0, saves: 0 };
    window.xhs = { miniTool: {
      writeTempFile: async ({ data }) => {
        if (!data.startsWith('data:image/png;base64,')) throw new Error('not PNG');
        window.__albumProbe.writes++;
        window.__albumProbe.data = data;
        return { filePath: 'mock-local-temp.png' };
      },
      saveImageToPhotosAlbum: async ({ filePath }) => {
        if (filePath !== 'mock-local-temp.png') throw new Error('wrong temp path');
        window.__albumProbe.saves++;
        return { errMsg: 'saveImageToPhotosAlbum:ok' };
      }
    } };
  });
  await page.getByRole('navigation', { name: '页面导航' }).getByRole('button', { name: '评分', exact: true }).click();
  await page.getByRole('button', { name: /^德，权重 12%/  }).click();
  await page.getByRole('button', { name: '设为 50', exact: true }).click();
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await page.getByRole('navigation', { name: '页面导航' }).getByRole('button', { name: '预览', exact: true }).click();
  await page.getByRole('combobox', { name: '图片比例', exact: true }).selectOption('4:5');
  await page.getByRole('button', { name: '生成评分卡 PNG', exact: true }).click();
  const image = page.locator('img[src^="data:image/png"]');
  await image.waitFor({ timeout: 20000 });
  await image.evaluate(img => img.decode());
  const size = await image.evaluate(img => ({ width: img.naturalWidth, height: img.naturalHeight }));
  if (size.width !== 1920 || size.height !== 2400) throw new Error('wrong ratio: ' + JSON.stringify(size));
  await page.getByRole('button', { name: '保存到系统相册', exact: true }).click();
  await page.waitForFunction(() => window.__albumProbe.saves === 1);
  const bridge = await page.evaluate(() => ({ writes: window.__albumProbe.writes, saves: window.__albumProbe.saves, samePNG: window.__albumProbe.data === document.querySelector('img[src^="data:image/png"]').src }));
  if (!bridge.samePNG || bridge.writes !== 1) throw new Error('preview/save mismatch');
  if (await page.locator('a[download]').count()) throw new Error('forbidden download link');
  await page.screenshot({ path: 'output/emperor-minitool-acceptance.png', fullPage: true });
  await page.reload();
  await page.getByRole('navigation', { name: '页面导航' }).getByRole('button', { name: '评分', exact: true }).click();
  await page.getByRole('button', { name: '德，权重 12%，50 分', exact: true }).waitFor();
  if (errors.length) throw new Error(errors.join('\n'));
  return { size, bridge, persisted: true, pageErrors: errors };
}
