async (page) => {
  await page.evaluate(() => {
    Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: undefined });
    window.confirm = () => true;
  });
  await page.getByLabel('评分算法').selectOption('emperor-custom-level-v1');
  await page.getByRole('button', { name: '移除此轴' }).first().click();
  await page.getByRole('button', { name: '添加评价轴' }).click();
  await page.getByRole('button', { name: '添加扣分项' }).click();
  await page.getByRole('button', { name: '添加扣分项' }).click();
  await page.getByLabel('扣分（−5 至 0）').first().fill('-1');
  await page.reload();
  if (await page.getByRole('button', { name: '移除此轴' }).count() !== 12) throw new Error('评价轴未保存');
  if (await page.getByRole('button', { name: '移除扣分项' }).count() !== 2) throw new Error('扣分项未保存');
  if (await page.getByLabel('扣分（−5 至 0）').first().inputValue() !== '-1') throw new Error('扣分值未保存');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('xdrate.emperor.workspace.v1')));
  const custom = saved.records.find((item) => item.profile.id === saved.selectedEmperorId).custom;
  const ids = [...custom.axes, ...custom.negativeItems].map((item) => item.id);
  if (new Set(ids).size !== ids.length || ids.filter((id) => id.startsWith('local-')).length !== 3) throw new Error('兼容标识重复或缺失');
  return { fallbackIds: '通过', addAxisAndDeductions: '通过', reload: '通过' };
}
