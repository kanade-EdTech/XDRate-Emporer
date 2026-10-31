async (page) => {
  const src = await page.locator('.emperor-card .portrait-country img').getAttribute('src');
  const imageUrl = new URL(src, page.url()).href;
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.setContent(`<html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#f3ead7;color:#3e3021;font-family:'Microsoft YaHei',sans-serif}main{width:1200px;height:900px;padding:95px;display:flex;align-items:center;gap:65px;border:14px solid #b08d3c}.icon{width:300px;height:300px;overflow:hidden;position:relative;flex-shrink:0}.icon img{position:absolute;width:155.5556%;height:200%;left:-27.7778%;top:-46.6667%}h1{font-family:serif;font-size:72px;margin:10px 0 35px}p{font-size:30px;line-height:1.8;margin:12px 0}small{font-size:23px;letter-spacing:3px;color:#8e211b}.colors{display:flex;margin-top:45px}.colors i{width:65px;height:12px;margin-right:12px}</style></head><body><main><div class="icon"><img src="${imageUrl}"></div><section><small>XDRATE EMPEROR</small><h1>帝王评分卡</h1><p>十二维固定权重<br>自定义等级轴</p><p>五德国号 · 我的评价</p><div class="colors"><i style="background:#8B1E18"></i><i style="background:#1B4D47"></i><i style="background:#1A1C20"></i><i style="background:#C9932B"></i><i style="background:#EAE5DC;border:1px solid #8F6D2E"></i></div></section></main></body></html>`);
  await page.locator('.icon img').evaluate((img) => img.decode());
  await page.screenshot({ path: 'output/emperor-toy-poster.png' });
  await page.locator('.icon').screenshot({ path: 'output/emperor-toy-icon.png' });
  return { poster: 'output/emperor-toy-poster.png', icon: 'output/emperor-toy-icon.png' };
}
