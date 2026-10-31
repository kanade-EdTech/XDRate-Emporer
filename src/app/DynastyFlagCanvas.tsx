import { useEffect, useRef } from 'react';
import { getDynastyFlagSpec } from '../domain/emperor/countryLabels';
import { drawDynastyFlagOnCanvas } from './emperorCountryCards';

const CLERICAL_FONT_STACK = '"LiSu", "STLiti", "SimLi", "隶书", "Baoli SC", "KaiTi", serif';

/**
 * 绘制紧凑横幅式朝代五德旗帜徽章（@canvas 实时绘制，底色为五德代表色，字体为繁体隶书）
 */
function drawBadgeFlagOnCanvas(canvas: HTMLCanvasElement, dynasty: string): void {
  const { label, theme } = getDynastyFlagSpec(dynasty);
  const chars = Array.from(label);
  const width = Math.max(100, 48 + chars.length * 30);
  const height = 56;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();

  // 1. 旗面五德代表色主底（右侧带燕尾/牙旗三角齿）
  ctx.fillStyle = theme.bgPrimary;
  ctx.beginPath();
  ctx.moveTo(6, 4);
  ctx.lineTo(width - 4, 4);
  ctx.lineTo(width - 16, height / 2);
  ctx.lineTo(width - 4, height - 4);
  ctx.lineTo(6, height - 4);
  ctx.closePath();
  ctx.fill();

  // 2. 旗面镶边
  ctx.strokeStyle = theme.borderOuter;
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3. 左侧旗杆与枪头
  ctx.fillStyle = theme.borderOuter;
  ctx.fillRect(3, 2, 5, height - 4);

  // 4. 繁体隶书国号主字
  const mainFontSize = chars.length <= 2 ? 28 : chars.length <= 4 ? 22 : 18;
  ctx.font = `${mainFontSize}px ${CLERICAL_FONT_STACK}`;
  ctx.fillStyle = theme.textPrimary;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 16, height / 2 + 1);

  ctx.restore();
}

export function DynastyFlagCanvas({
  dynasty,
  mode = 'badge',
}: {
  dynasty: string;
  mode?: 'badge' | 'full';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { label } = getDynastyFlagSpec(dynasty);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (mode === 'full') {
      drawDynastyFlagOnCanvas(canvas, dynasty, 560, 720);
    } else {
      drawBadgeFlagOnCanvas(canvas, dynasty);
    }
  }, [dynasty, mode]);

  if (mode === 'full') {
    return (
      <canvas
        ref={canvasRef}
        className="dynasty-flag-canvas-full"
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="dynasty-flag-badge"
      role="img"
      aria-label={`${label}国号旗帜`}
      title={`${label}国号旗帜`}
    />
  );
}
