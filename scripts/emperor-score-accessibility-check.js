async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const card = page.locator('.emperor-card');
  const radar = card.getByRole('img', { name: /十二维评分雷达图/ });
  const firstScore = card.locator('.card-values > div').first().locator('b');
  const secondScore = card.locator('.card-values > div').nth(1).locator('b');
  await page.getByRole('button', { name: '德，权重 12%，未评分' }).click();
  if (!(await firstScore.ariaSnapshot()).includes('未评分')) throw new Error('未评分的可访问名称不正确');
  await page.getByLabel('精确分数（可填 0.1 精度）').fill('0');
  await page.getByRole('button', { name: '德，权重 12%，0 分' }).waitFor();
  if (!(await firstScore.ariaSnapshot()).includes('0')) throw new Error('零分的可访问名称不正确');
  if (!(await secondScore.ariaSnapshot()).includes('未评分')) throw new Error('其他未评分项目被误读为零分');
  const description = await radar.getAttribute('aria-label');
  if (!description.includes('德：0分') || !description.includes('智：未评分')) throw new Error('雷达图描述没有区分零分与未评分');
  await page.reload();
  await page.getByRole('button', { name: '德，权重 12%，0 分' }).waitFor();
  return { scoreButtonLabels: '通过', cardValues: '通过', radarDescription: '通过', reload: '通过' };
}
