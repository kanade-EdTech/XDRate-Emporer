async (page) => {
  const key = 'xdrate.emperor.workspace.v1';
  const original = '{"未完成的草稿":"原始内容"';
  await page.evaluate(([storageKey, value]) => localStorage.setItem(storageKey, value), [key, original]);
  await page.reload();
  const alert = page.getByRole('alert');
  await alert.getByText('本地数据未能载入', { exact: false }).waitFor();
  await page.getByLabel('个人签名档（可选）').fill('临时修改');
  const downloadPromise = page.waitForEvent('download');
  await alert.getByRole('button', { name: '下载原始本地数据' }).click();
  const download = await downloadPromise;
  const chunks = [];
  for await (const chunk of await download.createReadStream()) chunks.push(chunk);
  if (Buffer.concat(chunks).toString('utf8') !== original) throw new Error('导出的原始内容不一致');
  if (await page.evaluate((storageKey) => localStorage.getItem(storageKey), key) !== original) throw new Error('原始本地数据被覆盖');
  await page.evaluate(() => { window.confirm = () => false; });
  await alert.getByRole('button', { name: '使用本页工作区恢复自动保存' }).click();
  if (await page.evaluate((storageKey) => localStorage.getItem(storageKey), key) !== original) throw new Error('取消恢复后原始数据被覆盖');
  await page.evaluate(() => { window.confirm = () => true; });
  await alert.getByRole('button', { name: '使用本页工作区恢复自动保存' }).click();
  await page.getByRole('alert').waitFor({ state: 'detached' });
  await page.reload();
  if (await page.getByLabel('个人签名档（可选）').inputValue() !== '临时修改') throw new Error('恢复后临时修改未保存');
  await page.evaluate(([storageKey, value]) => localStorage.setItem(storageKey, value), [key, original]);
  await page.reload();
  await page.getByRole('alert').getByText('本地数据未能载入', { exact: false }).waitFor();
  await page.evaluate(([storageKey, value]) => {
    window.confirm = () => true;
    localStorage.setItem(storageKey, value);
  }, [key, '其他页面的新数据']);
  await page.getByRole('button', { name: '使用本页工作区恢复自动保存' }).click();
  await page.getByText('其他页面修改了本地草稿', { exact: false }).waitFor();
  if (await page.evaluate((storageKey) => localStorage.getItem(storageKey), key) !== '其他页面的新数据') throw new Error('恢复覆盖了其他页面的数据');
  if (!await page.getByRole('button', { name: '下载原始本地数据' }).isVisible()) throw new Error('冲突后原始数据导出入口丢失');
  return { originalDataExport: '通过', originalDataPreserved: '通过', cancelRecovery: '通过', resumeSaving: '通过', conflictProtection: '通过' };
}
