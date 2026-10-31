import {
  getDynastyFlagSpec,
  type VirtueElement,
  type VirtueTheme,
} from '../domain/emperor/countryLabels';

const countryFiles = import.meta.glob<string>('../../assets/emperor/country-cards/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

const cards: Record<string, string> = {};
for (const [path, url] of Object.entries(countryFiles)) {
  const name = path.split('/').pop()?.replace(/\.png$/, '') ?? '';
  const label = name
    .replace(/^country-/, '')
    .split('-')
    .map((value) => String.fromCodePoint(parseInt(value, 16)))
    .join('');
  cards[label] = url;
}

const CLERICAL_FONT_STACK = '"LiSu", "STLiti", "SimLi", "隶书", "Baoli SC", "KaiTi", serif';

/**
 * 使用 HTML5 @canvas 绘制朝代五德（白金、青木、黑水、赤火、黄土德）繁体隶书国号旌旗
 */
export function drawDynastyFlagOnCanvas(
  canvas: HTMLCanvasElement,
  dynasty: string,
  width = 560,
  height = 720,
): void {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { label, theme } = getDynastyFlagSpec(dynasty);
  const scaleX = width / 560;
  const scaleY = height / 720;

  ctx.save();
  ctx.scale(scaleX, scaleY);

  // 1. 旗面主底色（五德代表色）
  ctx.fillStyle = theme.bgPrimary;
  ctx.fillRect(0, 0, 560, 720);

  // 2. 内幅底色
  ctx.fillStyle = theme.bgSecondary;
  ctx.fillRect(42, 48, 475, 624);

  // 3. 左右牙旗火焰锯齿边
  const toothCount = 11;
  const toothStep = (672 - 48) / toothCount;
  ctx.fillStyle = theme.borderOuter;
  for (let i = 0; i < toothCount; i++) {
    const y0 = 48 + i * toothStep;
    const ym = y0 + toothStep / 2;
    const y1 = y0 + toothStep;

    ctx.beginPath();
    ctx.moveTo(20, y0);
    ctx.lineTo(42, ym);
    ctx.lineTo(20, y1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(539, y0);
    ctx.lineTo(517, ym);
    ctx.lineTo(539, y1);
    ctx.closePath();
    ctx.fill();
  }

  // 4. 内外双层边框
  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 5;
  ctx.strokeRect(20, 32, 519, 656);

  ctx.strokeStyle = theme.borderInner;
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 48, 475, 624);

  // 5. 顶部旌旗横梁与梁头
  ctx.fillStyle = theme.borderOuter;
  ctx.fillRect(12, 18, 535, 14);
  ctx.beginPath();
  ctx.arc(16, 25, 10, 0, Math.PI * 2);
  ctx.arc(543, 25, 10, 0, Math.PI * 2);
  ctx.fill();

  // 6. 四角回纹装饰
  const corners: Array<[number, number, number, number]> = [
    [52, 58, 1, 1],
    [507, 58, -1, 1],
    [52, 662, 1, -1],
    [507, 662, -1, -1],
  ];
  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 3;
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 28 * dx, cy);
    ctx.lineTo(cx + 28 * dx, cy + 16 * dy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + 28 * dy);
    ctx.lineTo(cx + 16 * dx, cy + 28 * dy);
    ctx.stroke();
  }

  // 7. 中心规矩团窠纹圆环
  const centerX = 280;
  const centerY = 348;
  const rOuter = 174;
  const rInner = 162;

  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, rOuter, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = theme.borderInner;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, rInner, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 2;
  for (let deg = 0; deg < 360; deg += 45) {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(rad) * rInner, centerY + Math.sin(rad) * rInner);
    ctx.lineTo(centerX + Math.cos(rad) * rOuter, centerY + Math.sin(rad) * rOuter);
    ctx.stroke();
  }

  // 8. 顶部装饰（仅保留配色，不绘制五德文字说明）
  ctx.fillStyle = theme.textSecondary;
  ctx.font = `38px ${CLERICAL_FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 菱形瑞纹
  ctx.fillStyle = theme.borderOuter;
  for (const diamondX of [152, 408]) {
    ctx.beginPath();
    ctx.moveTo(diamondX - 10, 92);
    ctx.lineTo(diamondX, 84);
    ctx.lineTo(diamondX + 10, 92);
    ctx.lineTo(diamondX, 100);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = theme.borderInner;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(96, 124);
  ctx.lineTo(464, 124);
  ctx.stroke();

  // 9. 中心繁体隶书国号大字
  const columns = label.split('·');
  columns.forEach((column, index) => {
    const chars = Array.from(column);
    let size: number;
    let lineHeight: number;
    if (columns.length === 1) {
      if (chars.length === 1) {
        size = 216;
        lineHeight = size;
      } else if (chars.length === 2) {
        size = 142;
        lineHeight = size * 1.05;
      } else if (chars.length === 3) {
        size = 98;
        lineHeight = size * 1.02;
      } else {
        size = 74;
        lineHeight = size * 0.98;
      }
    } else {
      if (chars.length === 1) {
        size = 128;
        lineHeight = size;
      } else if (chars.length === 2) {
        size = 108;
        lineHeight = size * 1.02;
      } else {
        size = 72;
        lineHeight = size * 0.96;
      }
    }

    ctx.font = `${size}px ${CLERICAL_FONT_STACK}`;
    const x = columns.length === 1 ? 280 : index === 0 ? 342 : 216;
    const startY = 348 - ((chars.length - 1) * lineHeight) / 2;

    chars.forEach((ch, offset) => {
      const y = startY + offset * lineHeight;
      ctx.fillStyle = theme.borderInner;
      ctx.fillText(ch, x + 2, y + 2);
      ctx.fillStyle = theme.textPrimary;
      ctx.fillText(ch, x, y);
    });
  });

  // 10. 底部“國號旌旗”印信
  ctx.fillStyle = theme.sealBg;
  ctx.fillRect(196, 592, 168, 58);
  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 3;
  ctx.strokeRect(196, 592, 168, 58);
  ctx.strokeStyle = theme.sealText;
  ctx.lineWidth = 1;
  ctx.strokeRect(202, 598, 156, 46);

  ctx.fillStyle = theme.sealText;
  ctx.font = `34px ${CLERICAL_FONT_STACK}`;
  ctx.fillText('國號旌旗', 280, 621);

  ctx.restore();
}

export function emperorCountryCard(dynasty: string): {
  label: string;
  element: VirtueElement;
  theme: VirtueTheme;
  url: string | undefined;
} {
  const spec = getDynastyFlagSpec(dynasty);
  return {
    ...spec,
    url: cards[spec.label],
  };
}
