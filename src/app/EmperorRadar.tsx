import { fixedDimensions, type DimensionId } from '../domain/emperor/workspace';

export function EmperorRadar({ scores }: { scores: Record<DimensionId, number | null> }) {
  const pt = (index:number, value:number) => { const angle = -Math.PI / 2 + index * Math.PI / 6; return [140 + Math.cos(angle) * value, 140 + Math.sin(angle) * value]; };
  const complete = fixedDimensions.every(([id]) => scores[id] !== null);
  const description = fixedDimensions.map(([id, label]) => `${label}：${scores[id] === null ? '未评分' : `${scores[id]}分`}`).join('；');
  return <svg className="emperor-radar" viewBox="0 0 280 280" role="img" aria-label={`十二维评分雷达图；${description}`}>
    {[25,50,75,100].map(radius => <polygon key={radius} points={fixedDimensions.map((_,index)=>pt(index,radius).join(',')).join(' ')} fill="none" stroke="#b7a688" />)}
    {fixedDimensions.map(([id,label],index) => { const [x,y]=pt(index,100), [tx,ty]=pt(index,120); return <g key={id}><line x1="140" y1="140" x2={x} y2={y} stroke="#cabb9d"/><text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#42382c">{label}</text></g>; })}
    {complete && <polygon points={fixedDimensions.map(([id],index)=>pt(index,scores[id]!).join(',')).join(' ')} fill="#b3322a44" stroke="#b3322a" strokeWidth="2"/>}
    {fixedDimensions.map(([id],index) => { const score=scores[id]; if(score===null)return null; const [x,y]=pt(index,score); return <circle key={id} cx={x} cy={y} r="3" fill="#b3322a"/>; })}
  </svg>;
}
