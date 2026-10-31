async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const search = page.getByLabel('搜索帝王');
  const results = page.getByRole('region', { name: '帝王名录结果' });
  for (const term of ['刘病已', '刘询', '中宗', '孝宣', '本始', '西汉']) {
    await search.fill(term);
    if (!await results.getByRole('button').filter({ hasText: '刘病已' }).count()) throw new Error(`搜索“${term}”未找到刘病已`);
  }
  await search.fill('刘询');
  await results.getByRole('button').filter({ hasText: '刘病已' }).click();
  if (!(await page.locator('.emperor-card .card-head h1').innerText()).includes('刘病已')) throw new Error('选择人物失败');
  await page.locator('.dimension-grid button').first().click();
  await page.getByLabel('精确分数（可填 0.1 精度）').fill('63');
  await search.fill('刘邦');
  await results.getByRole('button').filter({ hasText: '刘邦' }).click();
  if (await page.locator('.emperor-card .card-head h1').innerText() !== '刘邦') throw new Error('切换人物失败');
  await search.fill('刘询');
  await results.getByRole('button').filter({ hasText: '刘病已' }).click();
  await page.locator('.dimension-grid button').first().click();
  if (await page.getByLabel('精确分数（可填 0.1 精度）').inputValue() !== '63') throw new Error('切回人物后评分未保留');
  await page.getByRole('group', { name: '朝代时期筛选' }).getByRole('button', { name: '元明清' }).click();
  await page.getByText('没有找到匹配的人物', { exact: false }).waitFor();
  return { searchFields: '通过', switchAndRestore: '通过', periodFilter: '通过' };
}
