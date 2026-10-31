import { calculateEmperorRecord, fixedDimensions, type EmperorRecord, type EmperorImageRatio } from '../domain/emperor/workspace';
import { emperorCountryCard } from '../app/emperorCountryCards';

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

export async function renderEmperorMiniCard(record: EmperorRecord, ratio: EmperorImageRatio) {
  const result = calculateEmperorRecord(record);
  const fixed = record.selectedAlgorithm === 'emperor-fixed-12-v1';
  const draft = fixed ? record.fixed : record.custom;
  const country = emperorCountryCard(record.profile.dynasty);
  const portrait = await loadImage(record.portraitDataUrl || country.url || '');
  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) throw new Error('无法创建图片画布');
  measure.font = '28px sans-serif';
  const wrap = (text: string, width = 936) => {
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
      let line = '';
      for (const char of Array.from(paragraph)) {
        if (line && measure.measureText(line + char).width > width) { lines.push(line); line = ''; }
        line += char;
      }
      lines.push(line);
    }
    return lines;
  };
  const reasons = fixed ? fixedDimensions.map(([id, label]) => ({ label, text: record.fixed.reasons[id] }))
    : [...record.custom.axes, ...record.custom.negativeItems].filter((item) => item.enabled).map((item) => ({ label: item.name, text: item.reason }));
  const blocks = reasons.filter((item) => item.text.trim()).map((item) => ({ label: item.label, lines: wrap(item.text) }));
  if (draft.summary?.trim()) blocks.push({ label: '一句话评价', lines: wrap(draft.summary) });
  if (draft.comment.trim()) blocks.push({ label: '总体评价', lines: wrap(draft.comment) });
  const values = fixed ? fixedDimensions.map(([id, label, weight]) => `${label} ${weight}%：${record.fixed.scores[id] === null ? '未评' : record.fixed.scores[id]}`)
    : record.custom.axes.filter((item) => item.enabled).map((item) => `${item.name || '未命名'} · LV${item.importanceLevel}：${item.score === 0 ? '未评' : item.score + '/10'}`);
  const metadata = [record.profile.reigns.map((item) => [item.start, item.end].filter(Boolean).join('–')).join('、'), record.profile.templeName, record.profile.posthumousName].filter(Boolean).join(' · ');
  const metadataLines = wrap(metadata);
  const headerExtra = Math.max(0, metadataLines.length - 3) * 36;
  const gridTop = (fixed ? 880 : 560) + headerExtra;
  const valueLines = values.map((value) => wrap(value, 900));
  const gridBottom = gridTop + valueLines.reduce((sum, lines) => sum + Math.max(52, lines.length * 36 + 16), 0);
  const signatureLines = wrap(`评分者：${record.signature || '未填写'}`);
  const details = !fixed && result.algorithmId === 'emperor-custom-level-v1' && result.status === 'ready'
    ? [`加权基础分 ${result.positiveScore100.toFixed(1)}；扣分合计 ${result.penalty100.toFixed(1)}`,
      ...record.custom.negativeItems.filter((item) => item.enabled && item.score !== 0).map((item) => `${item.name || '扣分项'}：${item.score}（综合分 ${Number((item.score * 10).toFixed(2))}）`)] : [];
  const detailsLines = details.flatMap((line) => wrap(line));
  const height = gridBottom + detailsLines.length * 40 + blocks.reduce((sum, block) => sum + 90 + block.lines.length * 40, 0) + 140 + signatureLines.length * 32;
  const density = Math.min(1, Math.sqrt(8_000_000 / (1040 * height)), 16000 / height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(1040 * density);
  canvas.height = Math.floor(height * density);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建图片画布');
  ctx.scale(density, density);
  ctx.fillStyle = '#f3ead7'; ctx.fillRect(0, 0, 1040, height);
  ctx.strokeStyle = '#b08d3c'; ctx.lineWidth = 4; ctx.strokeRect(3, 3, 1034, height - 6);
  ctx.fillStyle = '#8e211b'; ctx.font = '24px sans-serif'; ctx.fillText('XDRATE · EMPEROR', 48, 58);
  if (portrait) {
    if (record.portraitDataUrl) {
      const scale = Math.min(200 / portrait.naturalWidth, 200 / portrait.naturalHeight);
      const w = portrait.naturalWidth * scale, h = portrait.naturalHeight * scale;
      ctx.drawImage(portrait, 48 + (200 - w) / 2, 90 + (200 - h) / 2, w, h);
    } else {
      ctx.drawImage(portrait, portrait.naturalWidth * 100 / 560, portrait.naturalHeight * 168 / 720,
        portrait.naturalWidth * 360 / 560, portrait.naturalHeight * 360 / 720, 48, 90, 200, 200);
    }
  } else { ctx.font = '50px serif'; ctx.fillText(country.label, 50, 200); }
  ctx.fillStyle = '#2a2622'; ctx.font = 'bold 50px serif';
  for (const [i, line] of wrap(record.profile.name || '未命名人物', 670).entries()) ctx.fillText(line, 280, 145 + i * 54);
  ctx.font = '28px sans-serif'; ctx.fillText(record.profile.dynasty || '朝代待补充', 280, 235);
  metadataLines.forEach((line, i) => ctx.fillText(line, 48, 338 + i * 36));
  ctx.save(); ctx.translate(0, headerExtra);
  ctx.textAlign = 'center'; ctx.font = 'bold 76px serif'; ctx.fillStyle = '#8e211b';
  ctx.fillText(result.score100 === null ? '—' : result.score100.toFixed(1), 520, 470);
  ctx.font = '26px sans-serif'; ctx.fillStyle = '#443728';
  ctx.fillText(fixed ? '十二维固定权重' : '自定义等级轴', 520, 510);
  if (fixed && result.algorithmId === 'emperor-fixed-12-v1') {
    ctx.fillText(`已评 ${result.completed}/12 · 权重覆盖 ${result.coveragePercent}%`, 520, 548);
    const point = (i: number, radius: number) => ({ x: 520 + Math.cos(-Math.PI / 2 + i * Math.PI / 6) * radius, y: 702 + Math.sin(-Math.PI / 2 + i * Math.PI / 6) * radius });
    for (const radius of [30, 60, 90, 120]) {
      ctx.beginPath(); fixedDimensions.forEach((_, i) => { const p = point(i, radius); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
      ctx.closePath(); ctx.strokeStyle = '#b7a688'; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.font = '20px sans-serif';
    fixedDimensions.forEach(([id, label], i) => {
      const p = point(i, 150); ctx.fillStyle = '#443728'; ctx.fillText(label, p.x, p.y + 6);
      const score = record.fixed.scores[id];
      if (score !== null) { const dot = point(i, score * 1.2); ctx.fillStyle = '#b3322a'; ctx.beginPath(); ctx.arc(dot.x, dot.y, 4, 0, 2 * Math.PI); ctx.fill(); }
    });
  }
  ctx.restore();
  ctx.textAlign = 'left'; ctx.font = '26px sans-serif';
  let valueY = gridTop;
  valueLines.forEach((lines) => { const rowHeight = Math.max(52, lines.length * 36 + 16); ctx.fillStyle = '#ebe0c8'; ctx.fillRect(48, valueY - 30, 936, rowHeight - 6); ctx.fillStyle = '#2a2622'; lines.forEach((line, i) => ctx.fillText(line, 56, valueY + i * 36)); valueY += rowHeight; });
  let y = gridBottom + 14;
  for (const line of detailsLines) { ctx.fillStyle = '#443728'; ctx.fillText(line, 48, y); y += 40; }
  for (const block of blocks) {
    y += 36; ctx.strokeStyle = '#cabb9d'; ctx.beginPath(); ctx.moveTo(48, y); ctx.lineTo(992, y); ctx.stroke();
    y += 42; ctx.font = 'bold 28px sans-serif'; ctx.fillStyle = '#2a2622'; ctx.fillText(block.label, 48, y);
    ctx.font = '28px sans-serif';
    for (const line of block.lines) { y += 40; ctx.fillText(line, 48, y); }
    y += 12;
  }
  ctx.font = '26px sans-serif'; ctx.fillStyle = '#8e211b';
  signatureLines.forEach((line, i) => ctx.fillText(line, 48, height - 48 - (signatureLines.length - 1 - i) * 32));
  if (ratio === '原始') return canvas.toDataURL('image/png');
  const [rw, rh] = ratio.split(':').map(Number), factor = Math.floor(2400 / Math.max(rw, rh));
  const output = document.createElement('canvas'); output.width = rw * factor; output.height = rh * factor;
  const outputCtx = output.getContext('2d'); if (!outputCtx) throw new Error('无法生成图片');
  outputCtx.fillStyle = '#f3ead7'; outputCtx.fillRect(0, 0, output.width, output.height);
  const fit = Math.min(output.width / canvas.width, output.height / canvas.height);
  outputCtx.drawImage(canvas, (output.width - canvas.width * fit) / 2, (output.height - canvas.height * fit) / 2, canvas.width * fit, canvas.height * fit);
  return output.toDataURL('image/png');
}
