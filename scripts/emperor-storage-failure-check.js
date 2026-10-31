async (page) => {
  const key = 'xdrate.emperor.workspace.v1';
  const signature = page.getByLabel('个人签名档（可选）');
  await page.evaluate(() => {
    window.__originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'xdrate.emperor.workspace.v1') throw new DOMException('quota exceeded', 'QuotaExceededError');
      return window.__originalSetItem.call(this, key, value);
    };
  });
  await signature.fill('待恢复的内容');
  const alert = page.getByRole('alert');
  await alert.getByText('本地草稿无法正常保存', { exact: false }).waitFor();
  const pending = page.waitForEvent('download');
  await alert.getByRole('button', { name: '导出本页备份' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const backup = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (backup.records.find((item) => item.profile.id === backup.selectedEmperorId).signature !== '待恢复的内容') throw new Error('失败后的备份不包含当前编辑');
  await alert.getByRole('button', { name: '重试本地保存' }).click();
  await alert.getByText('仍无法保存', { exact: false }).waitFor();
  await page.evaluate(() => { Storage.prototype.setItem = window.__originalSetItem; });
  await alert.getByRole('button', { name: '重试本地保存' }).click();
  await alert.waitFor({ state: 'detached' });
  await page.reload();
  if (await signature.inputValue() !== '待恢复的内容') throw new Error('重试后刷新未恢复');
  await page.evaluate((storageKey) => {
    window.__originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === storageKey) throw new DOMException('quota exceeded', 'QuotaExceededError');
      return window.__originalSetItem.call(this, key, value);
    };
  }, key);
  await signature.fill('本页修改');
  await alert.getByText('本地草稿无法正常保存', { exact: false }).waitFor();
  await page.evaluate((storageKey) => {
    const other = JSON.parse(localStorage.getItem(storageKey));
    other.records.find((item) => item.profile.id === other.selectedEmperorId).signature = '其他页面的修改';
    window.__originalSetItem.call(localStorage, storageKey, JSON.stringify(other));
    Storage.prototype.setItem = window.__originalSetItem;
  }, key);
  await alert.getByRole('button', { name: '重试本地保存' }).click();
  await page.getByText('其他页面修改了本地草稿', { exact: false }).waitFor();
  const stored = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), key);
  if (stored.records.find((item) => item.profile.id === stored.selectedEmperorId).signature !== '其他页面的修改') throw new Error('重试时覆盖了其他页面的修改');
  return { failedSaveBackup: '通过', retry: '通过', reload: '通过', conflictProtection: '通过' };
}
