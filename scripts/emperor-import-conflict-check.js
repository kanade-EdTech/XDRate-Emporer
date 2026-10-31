async (page) => {
  const signature = page.getByLabel('个人签名档（可选）');
  await signature.fill('备份中的签名');
  await page.locator('.emperor-backup summary').click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 JSON 备份' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const backup = Buffer.concat(chunks);
  const other = await page.context().newPage();
  try {
    await other.goto(page.url());
    await other.getByLabel('个人签名档（可选）').fill('其他页面的修改');
    await page.locator('.storage-conflict').waitFor();
    await signature.fill('本页未保存的修改');
    await page.evaluate(() => { window.confirm = () => true; });
    await page.locator('.emperor-backup input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup });
    await page.locator('.storage-conflict').getByText('导入未执行', { exact: false }).waitFor();
    if (await signature.inputValue() !== '本页未保存的修改') throw new Error('冲突导入改变了本页编辑');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('xdrate.emperor.workspace.v1')));
    if (stored.records.find((item) => item.profile.id === stored.selectedEmperorId).signature !== '其他页面的修改') throw new Error('冲突导入覆盖了其他页面');
  } finally {
    await other.close();
  }
  return { conflictImportBlocked: '通过', bothEditsPreserved: '通过' };
}
