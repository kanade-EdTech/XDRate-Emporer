import type { EmperorRecord } from '../domain/emperor/workspace';
import { useEffect, useState } from 'react';

function AxisScoreInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [text, setText] = useState(String(value));
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setText(String(value)); setInvalid(false); }, [value]);
  return <>
    <input type="number" min="0" max="10" step="1" value={text} aria-invalid={invalid} onChange={(event) => {
      const next = event.currentTarget.value;
      setText(next);
      if (event.currentTarget.validity.badInput) { setInvalid(true); return; }
      if (next === '') { setInvalid(false); return; }
      const score = event.currentTarget.valueAsNumber;
      if (Number.isInteger(score) && score >= 0 && score <= 10) { setInvalid(false); onChange(score); }
      else setInvalid(true);
    }} onBlur={() => {
      if (!invalid && text === '') { onChange(0); setText('0'); }
      else setText(String(value));
      setInvalid(false);
    }} />
    {invalid && <small role="alert">请输入 0 到 10 的整数。</small>}
  </>;
}

function DeductionInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [text, setText] = useState(String(value));
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setText(String(value)); setInvalid(false); }, [value]);
  return <>
    <input type="text" inputMode="decimal" maxLength={20} value={text} aria-invalid={invalid} onChange={(event) => {
      const next = event.target.value;
      setText(next);
      if (next === '' || next === '-' || /^-?\d+\.$/.test(next)) { setInvalid(false); return; }
      if (/^-0(?:\.0*)?$/.test(next)) { setInvalid(false); return; }
      const score = Number(next);
      if (/^-?\d+(?:\.\d+)?$/.test(next) && Number.isFinite(score) && score >= -5 && score <= 0) {
        setInvalid(false);
        onChange(score);
      } else setInvalid(true);
    }} onBlur={() => { if (/^-0(?:\.0*)?$/.test(text)) { onChange(0); setText('0'); } else setText(String(value)); setInvalid(false); }} />
    {invalid && <small role="alert">请输入 −5 到 0 之间的数字。</small>}
  </>;
}

type Draft = EmperorRecord['custom'];
let localIdSequence = 0;
function createItemId(draft: Draft): string {
  const used = new Set([...draft.axes, ...draft.negativeItems].map((item) => item.id));
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid && !used.has(uuid)) return uuid;
  let id: string;
  do {
    id = `local-${Date.now().toString(36)}-${(localIdSequence++).toString(36)}`;
  } while (used.has(id));
  return id;
}

export function CustomAxes({ draft, onChange }: { draft: Draft; onChange: (value: Draft) => void }) {
  const setAxis = (id: string, patch: Partial<Draft['axes'][number]>) => onChange({ ...draft, axes: draft.axes.map(axis => axis.id === id ? { ...axis, ...patch } : axis) });
  return <div className="custom-axes">
    {draft.axes.map((axis, index) => <fieldset key={axis.id}><legend>评价轴 {index + 1}</legend>
      <label><input type="checkbox" checked={axis.enabled} onChange={e => setAxis(axis.id, { enabled: e.target.checked })} />启用</label>
      <label>名称<input maxLength={24} value={axis.name} onChange={e => setAxis(axis.id, { name: e.target.value })} /></label>
      <label>分数（0 表示未评）<AxisScoreInput value={axis.score} onChange={score => setAxis(axis.id, { score })} /></label>
      <label>权重<select value={axis.importanceLevel} onChange={e => setAxis(axis.id, { importanceLevel: Number(e.target.value) as typeof axis.importanceLevel })}>{[0,.25,.75,1,1.5,2.5,5].map((weight, level) => <option key={level} value={level}>LV{level} · ×{weight}</option>)}</select></label>
      <label>理由（可选）<textarea maxLength={500} value={axis.reason} onChange={e => setAxis(axis.id, { reason: e.target.value })} /></label>
      <button disabled={draft.axes.length === 1} onClick={() => { if (window.confirm(`确定移除评价轴“${axis.name || '未命名'}”及其分数和理由吗？`)) onChange({ ...draft, axes: draft.axes.filter(item => item.id !== axis.id) }); }}>移除此轴</button>
    </fieldset>)}
    <button disabled={draft.axes.length >= 12} onClick={() => onChange({ ...draft, axes: [...draft.axes, { id: createItemId(draft), name: '新评价轴', score: 0, importanceLevel: 3, enabled: true, reason: '' }] })}>添加评价轴</button>
    <h3>扣分项</h3><p>旧版固定扣分：每扣 1 分，综合分减少 10 分。</p>
    {draft.negativeItems.map((item,index) => <fieldset key={item.id}><legend>扣分项 {index+1}</legend>
      <label>名称<input value={item.name} maxLength={24} onChange={e => onChange({ ...draft, negativeItems: draft.negativeItems.map(v => v.id === item.id ? { ...v, name: e.target.value } : v) })} /></label>
      <label>扣分（−5 至 0）<DeductionInput value={item.score} onChange={score => onChange({ ...draft, negativeItems: draft.negativeItems.map(v => v.id === item.id ? { ...v, score } : v) })} /></label>
      <label><input type="checkbox" checked={item.enabled} onChange={e => onChange({ ...draft, negativeItems: draft.negativeItems.map(v => v.id === item.id ? { ...v, enabled:e.target.checked } : v) })} />启用</label>
      <label>理由（可选）<textarea maxLength={500} value={item.reason} onChange={e => onChange({ ...draft, negativeItems: draft.negativeItems.map(v => v.id === item.id ? { ...v, reason:e.target.value } : v) })} /></label>
      <button onClick={() => { if (window.confirm(`确定移除扣分项“${item.name || '未命名'}”及其分数和理由吗？`)) onChange({ ...draft, negativeItems:draft.negativeItems.filter(v => v.id !== item.id) }); }}>移除扣分项</button>
    </fieldset>)}
    <button disabled={draft.negativeItems.length >= 5} onClick={() => onChange({ ...draft, negativeItems:[...draft.negativeItems,{ id:createItemId(draft), name:'其他不足', score:0, enabled:true, reason:'' }] })}>添加扣分项</button>
  </div>;
}
