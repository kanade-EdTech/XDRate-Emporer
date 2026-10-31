async (page) => {
  const key = 'xdrate.emperor.workspace.v1';
  const signature = page.getByLabel('个人签名档（可选）');
  await signature.fill('已有本地草稿');
  await page.waitForFunction((storageKey) => localStorage.getItem(storageKey)?.includes('已有本地草稿'), key);
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    window.__blockStorageRead = true;
    Storage.prototype.getItem = function (key) {
      if (window.__blockStorageRead && key === 'xdrate.emperor.workspace.v1') throw new DOMException('blocked', 'SecurityError');
      return original.call(this, key);
    };
  });
  await page.reload();
  const alert = page.getByRole('alert');
  await alert.getByText('无法确认是否已有草稿', { exact: false }).waitFor();
  await signature.fill('临时编辑');
  await page.evaluate(() => { window.__blockStorageRead = false; window.confirm = () => false; });
  await alert.getByRole('button', { name: '重新检查本地数据' }).click();
  await alert.getByText('已取消载入', { exact: false }).waitFor();
  if (await signature.inputValue() !== '临时编辑') throw new Error('取消载入丢失临时编辑');
  await page.evaluate(() => { window.confirm = () => true; });
  await alert.getByRole('button', { name: '重新检查本地数据' }).click();
  await alert.waitFor({ state: 'detached' });
  if (await signature.inputValue() !== '已有本地草稿') throw new Error('未恢复已有草稿');

  const invalid = '{"unreadable":';
  await page.evaluate(([storageKey, value]) => localStorage.setItem(storageKey, value), [key, invalid]);
  await page.reload();
  await alert.getByText('无法确认是否已有草稿', { exact: false }).waitFor();
  await page.evaluate(() => { window.__blockStorageRead = false; });
  await alert.getByRole('button', { name: '重新检查本地数据' }).click();
  await alert.getByText('内容无法解析', { exact: false }).waitFor();
  const pending = page.waitForEvent('download');
  await alert.getByRole('button', { name: '下载原始本地数据' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  if (Buffer.concat(chunks).toString('utf8') !== invalid) throw new Error('恢复读取后的原始数据不一致');
  await page.evaluate(() => { window.confirm = () => true; });
  await alert.getByRole('button', { name: '使用本页工作区恢复自动保存' }).click();
  await alert.waitFor({ state: 'detached' });
  await page.evaluate((storageKey) => localStorage.removeItem(storageKey), key);
  await page.reload();
  await alert.getByText('无法确认是否已有草稿', { exact: false }).waitFor();
  await signature.fill('无旧草稿时的临时编辑');
  await page.evaluate(() => { window.__blockStorageRead = false; });
  await alert.getByRole('button', { name: '重新检查本地数据' }).click();
  await alert.waitFor({ state: 'detached' });
  const stored = await page.evaluate((storageKey) => JSON.parse(localStorage.getItem(storageKey)), key);
  if (stored.records.find((item) => item.profile.id === stored.selectedEmperorId).signature !== '无旧草稿时的临时编辑') throw new Error('无旧草稿时临时编辑未保存');
  return { blockedReadMessage: '通过', cancelPreservesEdits: '通过', restoreExisting: '通过', invalidDataExport: '通过', emptyStorageSave: '通过' };
}
