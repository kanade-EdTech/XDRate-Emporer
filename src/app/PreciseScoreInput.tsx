import { useEffect, useState } from 'react';

export function PreciseScoreInput({ value, onChange }: { value: number | null; onChange: (value: number | null) => void }) {
  const [text, setText] = useState(value === null ? '' : String(value));
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setText(value === null ? '' : String(value)); setInvalid(false); }, [value]);
  return <>
    <input type="text" inputMode="decimal" value={text} aria-invalid={invalid} onChange={(event) => {
      const next = event.target.value;
      setText(next);
      if (next === '') { setInvalid(false); onChange(null); return; }
      if (/^(?:\d{1,3})(?:\.\d?)?$/.test(next) && Number(next) <= 100) {
        setInvalid(false);
        if (!next.endsWith('.')) onChange(Number(next));
      } else setInvalid(true);
    }} onBlur={() => {
      if (invalid || text.endsWith('.')) { setText(value === null ? '' : String(value)); setInvalid(false); }
    }} />
    {invalid && <small role="alert">请输入 0 到 100 的数字，最多保留一位小数。</small>}
  </>;
}
