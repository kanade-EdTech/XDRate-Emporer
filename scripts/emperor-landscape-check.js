async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (let i = 0; i < 4; i++) {
    await page.locator('.dimension-grid button').nth(i).click();
    await page.getByLabel('评价理由（可选）').fill(`第 ${i + 1} 条理由，保留完整文字。`);
  }
  await page.evaluate(() => {
    window.__landscapeCheck = null;
    new MutationObserver(() => {
      const section = document.querySelector('.export-landscape .card-reasons-grid');
      if (!section) return;
      const items = [...section.querySelectorAll(':scope > div')];
      const rectangles = items.map((item) => item.getBoundingClientRect());
      window.__landscapeCheck = {
        texts: items.map((item) => item.textContent),
        twoColumns: rectangles[1].left > rectangles[0].left && rectangles[1].top === rectangles[0].top,
        noOverlap: rectangles.every((a, i) => rectangles.every((b, j) => i === j || a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top)),
      };
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
  await page.getByLabel('图片比例').selectOption('16:9');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载评分卡 PNG' }).click();
  await downloadPromise;
  const result = await page.evaluate(() => window.__landscapeCheck);
  if (!result || !result.twoColumns || !result.noOverlap || result.texts.length !== 4 || !result.texts[3].includes('第 4 条理由')) {
    throw new Error(`横版理由布局检查失败：${JSON.stringify(result)}`);
  }
  return { twoColumns: '通过', completeReasons: '通过', noOverlap: '通过' };
}
