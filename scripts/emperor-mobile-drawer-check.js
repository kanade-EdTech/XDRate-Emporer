async (page) => {
  await page.setViewportSize({ width: 320, height: 480 });
  const first = page.locator('.dimension-grid button').first();
  await first.click();
  const editor = page.locator('.dimension-editor');
  const stats = await editor.evaluate((node) => ({ height: node.clientHeight, scrollHeight: node.scrollHeight, viewportHeight: window.innerHeight, overflowX: document.documentElement.scrollWidth > window.innerWidth }));
  if (stats.height > stats.viewportHeight * 0.66 || stats.scrollHeight <= stats.height || stats.overflowX) throw new Error(`小屏面板布局异常：${JSON.stringify(stats)}`);
  const score = page.getByLabel('精确分数（可填 0.1 精度）');
  await score.fill('0');
  await page.getByLabel('评价理由（可选）').fill('小屏测试理由');
  await page.setViewportSize({ width: 320, height: 300 });
  const close = editor.getByRole('button', { name: '关闭' });
  await close.scrollIntoViewIfNeeded();
  await close.click();
  if (await editor.count()) throw new Error('无法关闭评分面板');
  await first.click();
  if (await score.inputValue() !== '0' || await page.getByLabel('评价理由（可选）').inputValue() !== '小屏测试理由') throw new Error('小屏评分或理由未保留');
  return { boundedScrolling: '通过', shortViewport: '通过', closeAndRestore: '通过' };
}
