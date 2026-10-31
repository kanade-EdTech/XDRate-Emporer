async (page) => {
  await page.locator('.emperor-backup summary').click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 JSON 备份' }).click();
  const chunks = [];
  for await (const chunk of await (await pending).createReadStream()) chunks.push(chunk);
  const archive = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  const person = structuredClone(archive.records[0]);
  person.profile = { ...person.profile, id: 'local-test-person', name: '测试人物', dynasty: '测试朝代', templeName: '测试庙号', posthumousName: '测试谥号', eraNames: ['测试年号'], reigns: [{ start: '100', end: '110' }, { start: '120', end: '130' }] };
  person.fixed.scores.virtue = 0;
  archive.records.push(person);
  archive.selectedEmperorId = person.profile.id;
  await page.evaluate(() => { window.confirm = () => true; });
  await page.locator('.emperor-backup input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(archive)) });
  await page.getByText('备份已恢复。').waitFor();
  const card = page.locator('.emperor-card');
  const verify = async () => {
    const text = await card.innerText();
    for (const value of ['测试人物', '测试朝代', '测试庙号', '测试谥号', '测试年号', '100–110、120–130']) {
      if (!text.includes(value)) throw new Error(`卡片缺少存档资料：${value}`);
    }
    if (await card.locator('.card-values > div').first().locator('b').innerText() !== '0') throw new Error('真实零分没有显示');
    if (await card.locator('.card-values > div').nth(1).locator('b [aria-hidden="true"]').innerText() !== '—') throw new Error('未评分没有显示为缺项');
  };
  await verify();
  await page.reload();
  await verify();
  return { importedProfile: '通过', multipleReigns: '通过', zeroAndUnrated: '通过', reload: '通过' };
}
