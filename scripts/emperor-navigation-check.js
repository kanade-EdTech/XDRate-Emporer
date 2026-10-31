async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const desktop = page.getByRole('navigation', { name: '工作台导航' });
  const desktopPreview = desktop.getByRole('button', { name: '预览卡片' });
  await desktopPreview.click();
  await page.waitForFunction(() => document.activeElement?.classList.contains('emperor-stage'));
  if (await desktopPreview.getAttribute('aria-current') !== 'location') throw new Error('桌面预览导航状态不正确');
  await desktop.getByRole('button', { name: '评分', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.classList.contains('emperor-editor'));

  await page.setViewportSize({ width: 320, height: 640 });
  const mobile = page.getByRole('navigation', { name: '页面导航' });
  const roster = mobile.getByRole('button', { name: '名录' });
  await roster.click();
  await page.waitForFunction(() => document.activeElement?.classList.contains('emperor-roster'));
  if (await roster.getAttribute('aria-current') !== 'location') throw new Error('手机名录导航状态不正确');
  await page.getByLabel('搜索帝王').fill('刘邦');
  await page.getByRole('region', { name: '帝王名录结果' }).getByRole('button').filter({ hasText: '刘邦' }).click();
  await page.waitForFunction(() => document.activeElement?.classList.contains('emperor-editor'));
  if (await mobile.getByRole('button', { name: '评分' }).getAttribute('aria-current') !== 'location') throw new Error('选择人物后未进入评分');
  await mobile.getByRole('button', { name: '预览' }).click();
  await page.waitForFunction(() => document.activeElement?.classList.contains('emperor-stage'));
  return { desktopFocus: '通过', mobileFocus: '通过', currentNavigation: '通过', rosterSelection: '通过' };
}
