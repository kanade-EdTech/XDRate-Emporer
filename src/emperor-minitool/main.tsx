import './compat';
import { createRoot } from 'react-dom/client';
import { EmperorApp } from '../app/EmperorApp';
import './minitool.css';

const root = document.getElementById('root');
if (!root) throw new Error('缺少帝王评分卡入口');
createRoot(root).render(<EmperorApp />);
