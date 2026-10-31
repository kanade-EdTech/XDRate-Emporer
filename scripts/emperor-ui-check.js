async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  // Each isolated run gives its downloads unique names, including when runs overlap.
  await page.addInitScript(() => {
    const prefix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-`;
    const descriptor = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'download');
    Object.defineProperty(HTMLAnchorElement.prototype, 'download', {
      ...descriptor,
      set(value) { descriptor.set.call(this, prefix + value); },
    });
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  const algorithm = page.getByLabel('评分算法');
  await page.locator('.dimension-grid button').first().click();
  const score = page.getByLabel('精确分数（可填 0.1 精度）');
  await score.fill('');
  await score.pressSequentially('55.5');
  await page.getByLabel('评价理由（可选）').fill('自动检查的理由');
  await page.getByLabel('个人签名档（可选）').fill('自动检查签名');
  await algorithm.selectOption('emperor-custom-level-v1');
  const axisScore = page.locator('.custom-axes fieldset').first().getByLabel('分数（0 表示未评）');
  await axisScore.fill('8');
  await axisScore.press('Control+A');
  await axisScore.press('Backspace');
  check(await axisScore.inputValue() === '', '自定义评分不能清空输入');
  await axisScore.pressSequentially('10');
  check(await axisScore.inputValue() === '10', '自定义评分不能输入 10');
  await axisScore.fill('7');
  await page.getByRole('button', { name: '添加扣分项' }).click();
  const deduction = page.getByLabel('扣分（−5 至 0）').first();
  await deduction.fill('');
  await deduction.pressSequentially('-0.5', { delay: 40 });
  check(await deduction.inputValue() === '-0.5', '小数扣分输入不正确');
  await page.reload();
  check(await page.getByLabel('个人签名档（可选）').inputValue() === '自动检查签名', '签名未恢复');
  check(await page.locator('.custom-axes fieldset').first().getByLabel('分数（0 表示未评）').inputValue() === '7', '自定义评分未恢复');
  check(await deduction.inputValue() === '-0.5', '小数扣分未恢复');
  await algorithm.selectOption('emperor-fixed-12-v1');
  await page.locator('.dimension-grid button').first().click();
  check(await score.inputValue() === '55.5', '固定评分未恢复');
  check(await page.getByLabel('评价理由（可选）').inputValue() === '自动检查的理由', '理由未恢复');

  await page.getByLabel('人物图片（可选）').setInputFiles('assets/emperor/source/刘邦.jpg');
  await page.getByText('图片已处理，将随本地草稿和备份保存。').waitFor();
  const portrait = page.locator('.emperor-card .portrait-large img');
  const original = await portrait.getAttribute('src');
  check(original && original.startsWith('data:image/jpeg;base64,'), '图片未压缩');
  await page.reload();
  check(await portrait.getAttribute('src') === original, '图片未随草稿恢复');

  for (let index = 1; index < 12; index++) {
    await page.locator('.dimension-grid button').nth(index).click();
    await score.fill('80');
  }
  await page.locator('.dimension-grid button').first().click();
  await page.getByLabel('评价理由（可选）').fill('长理由内容'.repeat(100));
  check(await page.locator('.card-score strong').innerText() === '77.1', '十二维综合分不正确');
  check(await page.locator('.card-values > div').count() === 12, '评分卡缺少维度');
  check((await page.locator('.card-reasons').innerText()).includes('长理由内容'), '评分卡缺少理由');

  async function downloadBytes(action) {
    const pending = page.waitForEvent('download');
    await action();
    const download = await pending;
    const chunks = [];
    for await (const chunk of await download.createReadStream()) chunks.push(chunk);
    return Buffer.concat(chunks);
  }

  for (const [ratio, width, height] of [
    ['16:9', 2400, 1350], ['8:5', 2400, 1500], ['3:2', 2400, 1600],
    ['4:3', 2400, 1800], ['5:4', 2400, 1920], ['1:1', 2400, 2400],
    ['4:5', 1920, 2400], ['3:4', 1800, 2400], ['2:3', 1600, 2400],
    ['5:8', 1500, 2400], ['9:16', 1350, 2400],
  ]) {
    await page.getByLabel('图片比例').selectOption(ratio);
    const png = await downloadBytes(() => page.getByRole('button', { name: '下载评分卡 PNG' }).click());
    check(png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `${ratio} 不是 PNG`);
    check(png.readUInt32BE(16) === width && png.readUInt32BE(20) === height, `${ratio} 尺寸不正确`);
    await page.waitForFunction(([expectedWidth, expectedHeight]) => {
      const image = document.querySelector('.generated-preview img');
      return image && image.complete && image.naturalWidth === expectedWidth && image.naturalHeight === expectedHeight;
    }, [width, height], { timeout: 10000 });
    const preview = await page.locator('.generated-preview img').getAttribute('src');
    check(Buffer.from(preview.split(',')[1], 'base64').equals(png), `${ratio} 预览与下载不一致`);
  }

  await page.getByLabel('个人签名档（可选）').fill('修改后的签名');
  await page.getByRole('button', { name: '分享图片', exact: true }).click();
  const choices = await page.locator('.share-choice button').allTextContents();
  check(JSON.stringify(choices) === JSON.stringify(['生成新图片', '取消', '分享旧图片']), '旧图分享选项不正确');
  await page.locator('.share-choice').getByRole('button', { name: '取消' }).click();
  check(await page.locator('.share-choice').count() === 0, '取消分享未关闭选项');

  await page.locator('.emperor-backup summary').click();
  const backup = await downloadBytes(() => page.getByRole('button', { name: '导出 JSON 备份' }).click());
  await page.getByLabel('个人签名档（可选）').fill('备份之后的修改');
  await page.evaluate(() => { window.confirm = () => true; });
  await page.locator('.emperor-backup input[type=file]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup });
  await page.getByText('备份已恢复。').waitFor();
  check(await page.getByLabel('个人签名档（可选）').inputValue() === '修改后的签名', '备份未恢复签名');
  check(await portrait.getAttribute('src') === original, '备份未恢复图片');
  check(await page.getByLabel('图片比例').inputValue() === '9:16', '备份未恢复图片比例');

  const other = await page.context().newPage();
  try {
    await other.goto(page.url());
    await other.getByLabel('个人签名档（可选）').fill('另一页面的签名');
    await page.locator('.storage-conflict').waitFor();
    await page.getByLabel('个人签名档（可选）').fill('本页未保存签名');
    const saved = await page.evaluate(() => {
      const archive = JSON.parse(localStorage.getItem('xdrate.emperor.workspace.v1'));
      return archive.records.find((record) => record.profile.id === archive.selectedEmperorId).signature;
    });
    check(saved === '另一页面的签名', '冲突时本页覆盖了另一页面');
  } finally { await other.close(); }
  return { scoring: '通过', portrait: '通过', elevenRatiosAndPreview: '通过', staleShare: '通过', backup: '通过', storageConflict: '通过' };
}
