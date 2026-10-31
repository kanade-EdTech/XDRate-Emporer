import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  calculateEmperorRecord,
  createEmperorRecord,
  fixedDimensions,
  emperorImageRatios,
  emperorWorkspaceKey,
  MAX_EMPEROR_ARCHIVE_BYTES,
  loadEmperorWorkspace,
  parseEmperorArchive,
  saveEmperorWorkspace,
  serializeEmperorArchive,
  type DimensionId,
  type EmperorProfile,
  type EmperorRecord,
  type EmperorWorkspace,
  type EmperorImageRatio,
} from '../domain/emperor/workspace';
import {
  emperorRoster,
  periodGroups,
  type PeriodGroup,
  type EmperorRosterItem,
} from '../domain/emperor/rosterData';
import { CustomAxes } from './CustomAxes';
import { EmperorRadar } from './EmperorRadar';
import { EmperorPortrait } from './EmperorPortrait';
import { emperorCountryCard } from './emperorCountryCards';
import { DynastyFlagCanvas } from './DynastyFlagCanvas';
import { PreciseScoreInput } from './PreciseScoreInput';
import { preparePortrait } from './preparePortrait';
import { exportPixelRatio } from './exportCanvasLimits';
import { renderEmperorMiniCard } from '../emperor-minitool/renderCard';
import { savePngToMiniToolAlbum } from '../platform/minitoolBridge';
import './emperor.css';

const nameCollator = new Intl.Collator('zh-CN-u-co-pinyin');
const emperorsByName = [...emperorRoster].sort((a, b) =>
  nameCollator.compare(a.name, b.name) || a.id.localeCompare(b.id),
);
const rosterIds = new Set(emperorRoster.map((item) => item.id));

function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[·•・.\s]/g, '');
}

function createProfileFromRoster(item: EmperorRosterItem): Partial<EmperorProfile> {
  const [start = '', end = ''] = item.reignDisplay.split('–');
  return {
    dynasty: item.dynasty,
    templeName: item.templeName,
    posthumousName: item.posthumousName,
    eraNames: item.eraNames,
    reigns: [{ start: start.trim(), end: end.trim() }],
    identity: 'reigning',
    sources: [item.institution, item.artworkTitle],
  };
}

function initialWorkspace(): EmperorWorkspace {
  return {
    format: 'xdrate-emperor-archive',
    schemaVersion: 1,
    selectedEmperorId: emperorRoster[0].id,
    records: emperorRoster.map((item) =>
      createEmperorRecord(item.id, item.name, createProfileFromRoster(item)),
    ),
  };
}

function loadInitialWorkspace(): { workspace: EmperorWorkspace; failed: boolean } {
  try {
    const cached = loadEmperorWorkspace(localStorage);
    if (!cached) return { workspace: initialWorkspace(), failed: false };

    // 合并尚未在本地缓存中存在的帝王人物
    const existingIds = new Set(cached.records.map((r) => r.profile.id));
    const mergedRecords = [...cached.records];
    let hasMerged = false;

    for (const item of emperorRoster) {
      if (!existingIds.has(item.id)) {
        mergedRecords.push(createEmperorRecord(item.id, item.name, createProfileFromRoster(item)));
        hasMerged = true;
      } else {
        const existing = mergedRecords.find((r) => r.profile.id === item.id);
        if (existing) {
          if (
            existing.profile.name !== item.name &&
            (!existing.profile.name ||
              ['康熙', '乾隆', '忽必烈', '皇太极', '铁木真'].includes(existing.profile.name))
          ) {
            existing.profile.name = item.name;
            hasMerged = true;
          }
          if (!existing.profile.templeName && item.templeName) {
            existing.profile.templeName = item.templeName;
            hasMerged = true;
          }
          if (!existing.profile.dynasty && item.dynasty) {
            existing.profile.dynasty = item.dynasty;
            hasMerged = true;
          }
          if (!existing.profile.posthumousName && item.posthumousName) {
            existing.profile.posthumousName = item.posthumousName;
            hasMerged = true;
          }
          if (
            (!existing.profile.eraNames || existing.profile.eraNames.length === 0) &&
            item.eraNames.length > 0
          ) {
            existing.profile.eraNames = item.eraNames;
            hasMerged = true;
          }
        }
      }
    }

    if (hasMerged) {
      cached.records = mergedRecords;
    }
    return { workspace: cached, failed: false };
  } catch {
    return { workspace: initialWorkspace(), failed: true };
  }
}

export function EmperorApp() {
  const [loaded] = useState(loadInitialWorkspace);
  const [storageError, setStorageError] = useState(loaded.failed);
  const [preserveInvalidCache, setPreserveInvalidCache] = useState(loaded.failed);
  const [storageConflict, setStorageConflict] = useState(false);
  const conflictRef = useRef(false);
  const [initialCache, setInitialCache] = useState(() => { try { return localStorage.getItem(emperorWorkspaceKey); } catch { return null; } });
  const knownCache = useRef(initialCache);
  const [backupMessage, setBackupMessage] = useState('');
  const [backupText, setBackupText] = useState('');
  const [backupTextOpen, setBackupTextOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [imageMessage, setImageMessage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<{ url: string; filename: string; workspace: EmperorWorkspace; ratio: string } | null>(null);
  const [shareChoice, setShareChoice] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const cancelShareRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const rosterRegionRef = useRef<HTMLElement>(null);
  const editorRegionRef = useRef<HTMLElement>(null);
  const cardRegionRef = useRef<HTMLElement>(null);
  const dimensionButtons = useRef<Partial<Record<DimensionId, HTMLButtonElement | null>>>({});
  const [workspace, setWorkspace] = useState<EmperorWorkspace>(loaded.workspace);
  const imageRatio = workspace.imageRatio ?? '原始';
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;
  const importSequence = useRef(0);
  const portraitSequence = useRef(0);
  const [portraitMessage, setPortraitMessage] = useState('');
  const [query, setQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodGroup>('全部');
  const [tab, setTab] = useState<'roster' | 'edit' | 'card'>('edit');
  const [dimension, setDimension] = useState<DimensionId | null>(null);

  function navigateTab(next: 'roster' | 'edit' | 'card') {
    setTab(next);
    const mobile = window.matchMedia('(max-width: 700px)').matches;
    window.requestAnimationFrame(() => {
      const region = next === 'roster' ? rosterRegionRef.current : next === 'edit' ? editorRegionRef.current : cardRegionRef.current;
      region?.focus({ preventScroll: true });
      if (mobile) window.scrollTo({ top: 0, behavior: 'auto' });
      else region?.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  }

  const record =
    workspace.records.find((item) => item.profile.id === workspace.selectedEmperorId) ??
    workspace.records[0];
  const result = calculateEmperorRecord(record);

  const currentRosterItem = emperorRoster.find((e) => e.id === record.profile.id);
  const reignDisplay = record.profile.reigns
    .map(({ start, end }) => [start.trim(), end.trim()].filter(Boolean).join('–'))
    .filter(Boolean)
    .join('、');

  useEffect(() => {
    if (preserveInvalidCache || conflictRef.current) return;
    try {
      if (localStorage.getItem(emperorWorkspaceKey) !== knownCache.current) {
        conflictRef.current = true;
        setStorageConflict(true);
        return;
      }
      saveEmperorWorkspace(localStorage, workspace);
      knownCache.current = localStorage.getItem(emperorWorkspaceKey);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [workspace, preserveInvalidCache]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if ((event.key === emperorWorkspaceKey || event.key === null) && event.storageArea === localStorage && event.newValue !== knownCache.current) {
        conflictRef.current = true;
        setStorageConflict(true);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!storageError && !storageConflict) return;
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [storageError, storageConflict]);

  function resolveStorageConflict(choice: 'load' | 'overwrite') {
    const message = choice === 'load' ? '载入其他页面保存的草稿会替换本页未保存的修改。建议先导出本页备份，确定继续吗？' : '用本页草稿覆盖本地数据会替换其他页面保存的修改。建议先备份，确定继续吗？';
    if (!window.confirm(message)) return;
    try {
      if (choice === 'load') {
        if (localStorage.getItem(emperorWorkspaceKey) === null) throw new Error('没有可载入的草稿');
        const restored = loadInitialWorkspace();
        if (restored.failed) throw new Error('其他页面的草稿无效');
        knownCache.current = localStorage.getItem(emperorWorkspaceKey);
        setWorkspace(restored.workspace);
        setDimension(null);
        setPreserveInvalidCache(false);
      } else {
        saveEmperorWorkspace(localStorage, workspaceRef.current);
        knownCache.current = localStorage.getItem(emperorWorkspaceKey);
        setPreserveInvalidCache(false);
      }
      conflictRef.current = false;
      setStorageConflict(false);
      setStorageError(false);
      setBackupMessage(choice === 'load' ? '已载入其他页面保存的草稿。' : '已保存本页草稿。');
    } catch {
      setStorageError(true);
      setBackupMessage('处理冲突失败，请先导出本页备份。');
    }
  }

  function retryLocalSave() {
    if (preserveInvalidCache || conflictRef.current) return;
    try {
      if (localStorage.getItem(emperorWorkspaceKey) !== knownCache.current) {
        conflictRef.current = true;
        setStorageConflict(true);
        return;
      }
      saveEmperorWorkspace(localStorage, workspaceRef.current);
      knownCache.current = localStorage.getItem(emperorWorkspaceKey);
      setStorageError(false);
      setBackupMessage('本页草稿已保存，自动保存已恢复。');
    } catch {
      setStorageError(true);
      setBackupMessage('仍无法保存，请先导出备份并检查浏览器存储空间。');
    }
  }

  useEffect(() => {
    if (shareChoice) cancelShareRef.current?.focus();
  }, [shareChoice]);

  function closeShareChoice() {
    setShareChoice(false);
    shareButtonRef.current?.focus();
  }

  function exportBackup() {
    if (__EMPEROR_MINITOOL__) {
      try { setBackupText(serializeEmperorArchive(workspace)); setBackupTextOpen(true); setBackupMessage('备份文本已生成，请全选并手动复制保存。'); }
      catch { setBackupMessage('备份生成失败，请减少图片或检查当前内容。'); }
      return;
    }
    try {
      const blob = new Blob([serializeEmperorArchive(workspace)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'xdrate-emperor-backup.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setBackupMessage('备份文件已生成。');
    } catch (error) {
      setBackupMessage(error instanceof Error && error.message.includes('文件大小')
        ? '备份超过 16 MB，无法导出；请先减少自选图片或文本后重试。'
        : '备份生成失败，请检查当前内容。');
    }
  }

  function exportOriginalCache() {
    if (initialCache === null) return;
    if (__EMPEROR_MINITOOL__) { setBackupText(initialCache); setBackupTextOpen(true); setBackupMessage('原始数据已显示，请手动复制保存。'); return; }
    try {
      const url = URL.createObjectURL(new Blob([initialCache], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'xdrate-emperor-original-data.txt';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setBackupMessage('原始本地数据已导出，请妥善保存。');
    } catch {
      setBackupMessage('原始本地数据导出失败，请保持此页面打开并检查浏览器下载设置。');
    }
  }

  function replaceInvalidCache() {
    if (initialCache === null || !window.confirm('此操作会用当前临时工作区替换无法读取的本地数据，原始内容将不再保存在浏览器中。请先下载原始本地数据和本页备份，确定继续吗？')) return;
    try {
      if (localStorage.getItem(emperorWorkspaceKey) !== initialCache) {
        conflictRef.current = true;
        setStorageConflict(true);
        return;
      }
      saveEmperorWorkspace(localStorage, workspaceRef.current);
      knownCache.current = localStorage.getItem(emperorWorkspaceKey);
      setPreserveInvalidCache(false);
      setStorageError(false);
      setBackupMessage('已保存当前工作区，自动保存已恢复。');
    } catch {
      setStorageError(true);
      setBackupMessage('保存失败，请检查浏览器存储并保留原始数据备份。');
    }
  }

  function retryUnavailableStorage() {
    try {
      const raw = localStorage.getItem(emperorWorkspaceKey);
      if (raw === null) {
        saveEmperorWorkspace(localStorage, workspaceRef.current);
        knownCache.current = localStorage.getItem(emperorWorkspaceKey);
        setPreserveInvalidCache(false);
        setStorageError(false);
        setBackupMessage('未发现本地草稿，当前工作区已保存。');
        return;
      }
      try {
        parseEmperorArchive(raw);
      } catch {
        setInitialCache(raw);
        knownCache.current = raw;
        setBackupMessage('已读取原始本地数据，但内容无法解析；请先下载原始数据。');
        return;
      }
      if (!window.confirm('发现可读取的本地草稿。载入它会替换当前临时编辑，建议先导出本页备份。确定载入吗？')) {
        setBackupMessage('已取消载入，当前临时编辑未更改。');
        return;
      }
      if (localStorage.getItem(emperorWorkspaceKey) !== raw) {
        conflictRef.current = true;
        setStorageConflict(true);
        setBackupMessage('本地草稿已发生变化，请先处理冲突。');
        return;
      }
      const restored = loadInitialWorkspace();
      if (restored.failed) throw new Error('读取失败');
      if (localStorage.getItem(emperorWorkspaceKey) !== raw) {
        conflictRef.current = true;
        setStorageConflict(true);
        setBackupMessage('本地草稿已发生变化，请先处理冲突。');
        return;
      }
      knownCache.current = raw;
      setWorkspace(restored.workspace);
      setDimension(null);
      setPreserveInvalidCache(false);
      setStorageError(false);
      setBackupMessage('本地草稿已载入。');
    } catch {
      setStorageError(true);
      setBackupMessage('仍无法读取或保存本地数据，请保留页面并先导出本页备份。');
    }
  }

  async function downloadCard(download = true) {
    if (__EMPEROR_MINITOOL__) {
      if (exporting) return;
      setExporting(true); setImageMessage('正在生成评分卡…');
      try {
        const url = await renderEmperorMiniCard(record, imageRatio);
        setGeneratedImage({ url, filename: `${record.profile.name || '帝王'}-评分卡.png`, workspace, ratio: imageRatio });
        setImageMessage('评分卡已生成，可预览后保存到系统相册。内容过长时请选原始长图。');
      } catch { setImageMessage('评分卡生成失败，请减少内容后重试，当前评分仍保留。'); }
      finally { setExporting(false); }
      return;
    }
    if (!cardRef.current || exporting) return;
    const snapshot = cardRef.current.cloneNode(true) as HTMLElement;
    const srcCanvases = cardRef.current.querySelectorAll('canvas');
    const dstCanvases = snapshot.querySelectorAll('canvas');
    srcCanvases.forEach((srcCanvas, idx) => {
      const dstCanvas = dstCanvases[idx];
      if (dstCanvas) {
        dstCanvas.width = srcCanvas.width;
        dstCanvas.height = srcCanvas.height;
        dstCanvas.getContext('2d')?.drawImage(srcCanvas, 0, 0);
      }
    });
    const container = document.createElement('div');
    const ratioParts = imageRatio === '原始' ? null : imageRatio.split(':').map(Number);
    const landscape = ratioParts !== null && ratioParts[0] > ratioParts[1];
    // Keep original long images readable even when the editor is open on a narrow phone.
    const snapshotWidth = landscape ? 960 : 520;
    const preferredPixelRatio = ratioParts ? 3 : 2;
    if (landscape) {
      snapshot.classList.add('export-landscape');
      if (record.selectedAlgorithm === 'emperor-custom-level-v1') snapshot.classList.add('export-custom');
    }
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = `position:fixed;left:-10000px;top:0;width:${snapshotWidth}px;pointer-events:none;`;
    container.appendChild(snapshot);
    document.body.appendChild(container);
    setExporting(true);
    setImageMessage('正在生成图片…');
    try {
      await document.fonts.ready;
      const images = Array.from(snapshot.querySelectorAll('img'));
      let portraitFallback = false;
      await Promise.all(images.map(async (image) => {
        try {
          await image.decode();
        } catch (error) {
          if (!image.closest('.portrait-large')) throw error;
          const country = emperorCountryCard(record.profile.dynasty);
          const placeholder = document.createElement('span');
          placeholder.className = 'portrait-country';
          placeholder.style.backgroundColor = country.theme.bgSecondary;
          placeholder.style.color = country.theme.textPrimary;
          placeholder.setAttribute('role', 'img');
          placeholder.setAttribute('aria-label', `${record.profile.name}的${country.label}五德国号头像`);
          placeholder.textContent = country.label;
          placeholder.classList.add('portrait-country-text');
          if (country.url && image.getAttribute('src') !== country.url) {
            const countryImage = new Image();
            countryImage.src = country.url;
            countryImage.alt = '';
            try {
              await countryImage.decode();
              placeholder.textContent = '';
              placeholder.classList.remove('portrait-country-text');
              const crop = document.createElement('span');
              crop.className = 'portrait-country-crop';
              crop.appendChild(countryImage);
              placeholder.appendChild(crop);
            } catch { /* Keep a readable country name if its graphic also fails. */ }
          }
          image.replaceWith(placeholder);
          portraitFallback = true;
        }
      }));
      if (landscape) {
        const reasonsSection = snapshot.querySelector<HTMLElement>('.card-reasons[aria-label="分项理由"]');
        if (reasonsSection && reasonsSection.querySelectorAll(':scope > div').length > 1) {
          const singleColumnHeight = reasonsSection.getBoundingClientRect().height;
          reasonsSection.classList.add('card-reasons-grid');
          if (reasonsSection.getBoundingClientRect().height >= singleColumnHeight) reasonsSection.classList.remove('card-reasons-grid');
        }
      }
      const bounds = snapshot.getBoundingClientRect();
      const pixelRatio = exportPixelRatio(bounds.width, bounds.height, preferredPixelRatio);
      let dataUrl = await toPng(snapshot, { pixelRatio, backgroundColor: '#f3ead7' });
      const source = new Image();
      source.src = dataUrl;
      await source.decode();
      const sourceDensity = source.naturalWidth / snapshot.getBoundingClientRect().width;
      let smallText = 11 * sourceDensity < 18;
      if (imageRatio !== '原始') {
        const [widthUnits, heightUnits] = imageRatio.split(':').map(Number);
        const scale = Math.floor(2400 / Math.max(widthUnits, heightUnits));
        const canvas = document.createElement('canvas');
        canvas.width = widthUnits * scale;
        canvas.height = heightUnits * scale;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('无法创建画布');
        context.fillStyle = '#f3ead7';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const fit = Math.min(canvas.width / source.width, canvas.height / source.height);
        smallText = 11 * sourceDensity * Math.min(fit, 1) < 18;
        const width = source.width * fit;
        const height = source.height * fit;
        context.drawImage(source, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        dataUrl = canvas.toDataURL('image/png');
      }
      const filename = `${record.profile.name.replace(/[\\/:*?"<>|]/g, '_') || '帝王'}-评分卡.png`;
      setGeneratedImage({ url: dataUrl, filename, workspace, ratio: imageRatio });
      if (download) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.click();
      }
      const resultMessage = download ? '图片已生成，请查看下载文件。' : '图片已生成，请点击“分享图片”打开系统分享。';
      const portraitMessage = portraitFallback ? '画像加载失败，本次图片使用繁体国号字牌；可检查图片后重新生成。' : '';
      const resolutionMessage = pixelRatio < preferredPixelRatio - 0.001 ? '内容较长，已降低临时渲染分辨率；缩短内容可改善清晰度。' : '';
      const sizeMessage = smallText ? `内容较长或比例较宽，文字可能偏小；${imageRatio === '原始' ? '可缩短内容后重新生成。' : '可尝试原始长图。'}` : '';
      setImageMessage(`${resultMessage}${portraitMessage}${resolutionMessage}${sizeMessage}`);
    } catch {
      setImageMessage('图片生成失败，请检查画像是否加载完成后重试。');
    } finally {
      container.remove();
      setExporting(false);
    }
  }

  async function shareImage(image: NonNullable<typeof generatedImage>) {
    if (__EMPEROR_MINITOOL__) {
      if (sharing) return;
      setSharing(true);
      try {
        const result = await savePngToMiniToolAlbum(image.url, window);
        setImageMessage(result.status === 'completed' ? '已保存到系统相册。' : result.status === 'cancelled' ? '已取消保存，评分和图片已保留。' : result.status === 'denied' ? '相册权限未授权，请检查权限后重试。' : result.status === 'unavailable' ? '请在小红书小工具容器中保存到相册。' : '相册保存未完成，可重试，评分和图片已保留。');
      } catch { setImageMessage('相册保存未完成，请重试。'); }
      finally { setSharing(false); }
      return;
    }
    if (sharing) return;
    try {
      const encoded = image.url.split(',')[1];
      const binary = atob(encoded);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const file = new File([bytes], image.filename, { type: 'image/png' });
      if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
        setImageMessage('当前环境不支持图片系统分享，可在下方下载上次生成的图片。');
        return;
      }
      setSharing(true);
      await navigator.share({ files: [file], title: '帝王评分卡' });
      setImageMessage('已交给系统分享面板，发布结果请在目标应用中确认。');
    } catch (error) {
      setImageMessage(error instanceof Error && error.name === 'AbortError' ? '已取消分享。' : '分享未完成，请重试或下载图片。');
    } finally {
      setSharing(false);
    }
  }

  function requestShare() {
    if (exporting || sharing) return;
    if (!generatedImage) { void downloadCard(false); return; }
    if (generatedImage.workspace !== workspace || generatedImage.ratio !== imageRatio) { setShareChoice(true); return; }
    void shareImage(generatedImage);
  }

  async function importBackup(file: File | string) {
    const sequence = ++importSequence.current;
    const originalWorkspace = workspaceRef.current;
    try {
      if (!__EMPEROR_MINITOOL__ && (file as File).size > MAX_EMPEROR_ARCHIVE_BYTES) throw new Error('文件超过 16 MB');
      const imported = parseEmperorArchive(__EMPEROR_MINITOOL__ ? file as string : await (file as File).text());
      if (sequence !== importSequence.current) return;
      if (workspaceRef.current !== originalWorkspace) {
        setBackupMessage('读取备份期间内容发生变化，请重新选择文件后导入。');
        return;
      }
      const ids = new Set(imported.records.map((item) => item.profile.id));
      const missing = emperorRoster.filter((item) => !ids.has(item.id));
      if (imported.records.length + missing.length > 500) throw new Error('人物数量过多');
      imported.records.push(...missing.map((item) => createEmperorRecord(item.id, item.name, createProfileFromRoster(item))));
      const hasImportConflict = () => {
        if (!conflictRef.current && localStorage.getItem(emperorWorkspaceKey) === knownCache.current) return false;
        conflictRef.current = true;
        setStorageConflict(true);
        setBackupMessage('导入未执行：本地草稿已被其他页面修改，请先处理保存冲突，再重新导入。');
        return true;
      };
      if (hasImportConflict()) return;
      if (!window.confirm('导入将替换当前全部帝王评分和草稿。建议先导出备份。确定继续吗？')) {
        setBackupMessage('已取消导入，当前内容未更改。');
        return;
      }
      if (hasImportConflict()) return;
      saveEmperorWorkspace(localStorage, imported);
      knownCache.current = localStorage.getItem(emperorWorkspaceKey);
      conflictRef.current = false;
      setStorageConflict(false);
      setWorkspace(imported);
      setPreserveInvalidCache(false);
      setStorageError(false);
      setDimension(null);
      setPortraitMessage('');
      setBackupMessage('备份已恢复。');
    } catch (error) {
      if (sequence !== importSequence.current) return;
      setBackupMessage(`导入失败，当前内容未更改：${error instanceof Error ? error.message : '文件无法读取'}`);
    }
  }

  function update(change: (current: EmperorRecord) => EmperorRecord) {
    setWorkspace((current) => ({
      ...current,
      records: current.records.map((item) =>
        item.profile.id === record.profile.id ? change(item) : item,
      ),
    }));
  }

  async function choosePortrait(file: File) {
    const sequence = ++portraitSequence.current;
    const original = workspaceRef.current;
    const id = record.profile.id;
    setPortraitMessage('正在处理图片…');
    try {
      const portraitDataUrl = await preparePortrait(file);
      if (sequence !== portraitSequence.current) return;
      if (workspaceRef.current !== original) { setPortraitMessage('处理图片时内容发生变化，请重新选择图片。'); return; }
      setWorkspace((current) => ({ ...current, records: current.records.map((item) => item.profile.id === id ? { ...item, portraitDataUrl } : item) }));
      setPortraitMessage('图片已处理，将随本地草稿和备份保存。');
    } catch (error) {
      if (sequence === portraitSequence.current) setPortraitMessage(`图片未更改：${error instanceof Error ? error.message : '处理失败'}`);
    }
  }

  function clearCurrentDraft() {
    const name = record.profile.name || '当前人物';
    const algorithm = record.selectedAlgorithm === 'emperor-fixed-12-v1' ? '十二维固定权重' : '自定义等级轴';
    if (!window.confirm(`确定清除${name}的“${algorithm}”评分、理由、一句话评价和总体评价吗？此操作无法撤销。`)) return;
    update((current) => current.selectedAlgorithm === 'emperor-fixed-12-v1'
      ? { ...current, fixed: {
          scores: Object.fromEntries(fixedDimensions.map(([id]) => [id, null])) as EmperorRecord['fixed']['scores'],
          reasons: Object.fromEntries(fixedDimensions.map(([id]) => [id, ''])) as EmperorRecord['fixed']['reasons'],
          comment: '',
          summary: '',
        } }
      : { ...current, custom: {
          ...current.custom,
          axes: current.custom.axes.map((axis) => ({ ...axis, score: 0, reason: '' })),
          negativeItems: current.custom.negativeItems.map((item) => ({ ...item, score: 0, reason: '' })),
          comment: '',
          summary: '',
        } });
    setDimension(null);
  }

  function setScore(id: DimensionId, value: number | null) {
    update((current) => ({
      ...current,
      fixed: {
        ...current.fixed,
        scores: { ...current.fixed.scores, [id]: value },
      },
    }));
  }

  const active = fixedDimensions.find(([id]) => id === dimension);
  const reasons = record.selectedAlgorithm === 'emperor-fixed-12-v1'
    ? fixedDimensions.map(([id, label]) => ({ id, label, text: record.fixed.reasons[id] }))
    : [
        ...record.custom.axes.filter((axis) => axis.enabled).map((axis) => ({ id: axis.id, label: axis.name, text: axis.reason })),
        ...record.custom.negativeItems.filter((item) => item.enabled).map((item) => ({ id: item.id, label: item.name, text: item.reason })),
      ];

  // 筛选名录：结合朝代时期与跨字段关键词检索（姓名、真实全名、庙号、谥号、年号、朝代，支持忽略间隔号“·”搜索）
  const filteredEmperors = emperorsByName.filter((emp) => {
    if (selectedPeriod !== '全部' && emp.periodGroup !== selectedPeriod) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    const qNorm = normalizeSearchText(q);
    const matchesField = (val: string) =>
      val.toLowerCase().includes(q) || (qNorm.length > 0 && normalizeSearchText(val).includes(qNorm));
    const matchesName = matchesField(emp.name) || matchesField(emp.fullName);
    const matchesTemple = matchesField(emp.templeName);
    const matchesPost = matchesField(emp.posthumousName);
    const matchesDynasty = matchesField(emp.dynasty);
    const matchesEra = emp.eraNames.some((era) => matchesField(era));
    return matchesName || matchesTemple || matchesPost || matchesDynasty || matchesEra;
  });
  const localRecords = workspace.records.filter((item) => !rosterIds.has(item.profile.id));
  const filteredLocalRecords = selectedPeriod === '全部' ? localRecords.filter(({ profile }) => {
    const q = query.trim().toLowerCase();
    const qNorm = normalizeSearchText(q);
    return [profile.name, profile.dynasty, profile.templeName, profile.posthumousName, ...profile.eraNames].some(
      (value) => value.toLowerCase().includes(q) || (qNorm.length > 0 && normalizeSearchText(value).includes(qNorm)),
    );
  }).sort((a, b) => nameCollator.compare(a.profile.name, b.profile.name) || a.profile.id.localeCompare(b.profile.id)) : [];

  return (
    <div className="emperor-app">
      <header className="emperor-top">
        <div className="emperor-brand">
          <span>帝</span>
          <div>
            <strong>帝王评分卡</strong>
            <small>XDRATE · EMPEROR</small>
          </div>
        </div>
        <nav aria-label="工作台导航">
          <button
            className={tab === 'roster' ? 'selected' : ''}
            aria-current={tab === 'roster' ? 'location' : undefined}
            onClick={() => navigateTab('roster')}
          >
            名录（{emperorRoster.length}位）
          </button>
          <button className={tab === 'edit' ? 'selected' : ''} aria-current={tab === 'edit' ? 'location' : undefined} onClick={() => navigateTab('edit')}>
            评分
          </button>
          <button className={tab === 'card' ? 'selected' : ''} aria-current={tab === 'card' ? 'location' : undefined} onClick={() => navigateTab('card')}>
            预览卡片
          </button>
        </nav>
        <span className="emperor-save" role="status">
          {storageConflict ? '其他页面已修改草稿，本页暂停自动保存' : storageError ? '本地保存失败，请保留当前页面' : '草稿保存在本地'}
        </span>
      </header>

      <main className={`emperor-layout emperor-show-${tab}`}>
        {/* 左栏：名录与筛选 */}
        <section className="emperor-panel emperor-roster" ref={rosterRegionRef} tabIndex={-1} aria-label="帝王名录">
          <h2>帝王名录</h2>
          <p className="emperor-note">按姓名拼音排序</p>

          {/* 朝代时期切换 */}
          <div className="period-chips" role="group" aria-label="朝代时期筛选">
            {periodGroups.map((p) => (
              <button
                key={p}
                className={selectedPeriod === p ? 'selected' : ''}
                aria-pressed={selectedPeriod === p}
                onClick={() => setSelectedPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <input
            aria-label="搜索帝王"
            placeholder="搜姓名/庙号/谥号/年号，如“雍正”“太宗”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="emperor-note" role="status" aria-live="polite">
            {filteredEmperors.length + filteredLocalRecords.length === 0
              ? '没有找到匹配的人物，请尝试其他关键词或切换到“全部”。'
              : `当前找到 ${filteredEmperors.length + filteredLocalRecords.length} 条人物记录。`}
          </p>

          <div className="emperor-list" role="region" aria-label="帝王名录结果">
            {filteredEmperors.map((emp) => {
              const isSelected = emp.id === record.profile.id;
              const empRecord = workspace.records.find((r) => r.profile.id === emp.id);
              const empResult = empRecord ? calculateEmperorRecord(empRecord) : null;
              const hasScore =
                empResult?.score100 !== null && empResult?.score100 !== undefined;

              const isFixed = empResult?.algorithmId === 'emperor-fixed-12-v1';
              const completedCount = isFixed ? empResult.completed : 0;

              return (
                <button
                  key={emp.id}
                  className={`emperor-list-item ${isSelected ? 'selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setWorkspace((current) => ({
                      ...current,
                      selectedEmperorId: emp.id,
                    }));
                    setDimension(null);
                    setPortraitMessage('');
                    navigateTab('edit');
                  }}
                >
                  <EmperorPortrait
                    id={emp.id}
                    name={emp.name}
                    dynasty={empRecord?.profile.dynasty ?? emp.dynasty}
                    imageFilename={emp.imageFilename}
                    customSrc={empRecord?.portraitDataUrl}
                  />
                  <div className="emperor-item-info">
                    <strong>
                      {emp.name}
                    </strong>
                    <span>
                      {emp.dynasty} · {emp.templeName}
                    </span>
                    <div className="emperor-item-meta">
                      <span>年号：{emp.eraNames.slice(0, 2).join('/') || '无'}</span>
                    </div>
                  </div>
                  <small
                    style={{
                      color: hasScore ? '#8e211b' : '#5b5348',
                      fontWeight: hasScore ? 700 : 400,
                    }}
                  >
                    {hasScore
                      ? empResult?.score100?.toFixed(1)
                      : isFixed && completedCount > 0
                        ? `已评 ${completedCount}/12`
                        : '未评'}
                  </small>
                </button>
              );
            })}
          </div>
          {filteredLocalRecords.length > 0 && <section aria-label="其他本地存档">
            <h3>其他本地存档</h3>
            <p className="emperor-note">以下记录未匹配当前名录，可能与名录人物同名；评分分别保存。</p>
            <div className="emperor-list">
              {filteredLocalRecords.map((item) => <button key={item.profile.id} className={item.profile.id === record.profile.id ? 'selected' : ''} aria-pressed={item.profile.id === record.profile.id} onClick={() => { setWorkspace((current) => ({ ...current, selectedEmperorId: item.profile.id })); setDimension(null); setPortraitMessage(''); navigateTab('edit'); }}>
                <EmperorPortrait id={item.profile.id} name={item.profile.name} dynasty={item.profile.dynasty} customSrc={item.portraitDataUrl} />
                <span><strong>{item.profile.name || '未命名人物'}</strong><small> · 本地存档</small></span>
              </button>)}
            </div>
          </section>}
          {selectedPeriod !== '全部' && localRecords.length > 0 && <p className="emperor-note">其他本地存档可在“全部”中查看。</p>}
          <p className="emperor-note">
            共收录 {emperorRoster.length} 位帝王。部分人物图片尚待整理。
          </p>
        </section>

        {/* 中栏：评分卡实时画布 */}
        <section className="emperor-stage" ref={cardRegionRef} tabIndex={-1} aria-label="评分卡预览">
          <article className="emperor-card" ref={cardRef}>
            <div className="card-head">
              <EmperorPortrait
                id={record.profile.id}
                name={record.profile.name}
                dynasty={record.profile.dynasty}
                imageFilename={currentRosterItem?.imageFilename}
                customSrc={record.portraitDataUrl}
                large
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <small style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>我的评分卡</span>
                </small>
                <h1>{record.profile.name || currentRosterItem?.name || '未命名人物'}</h1>
                {currentRosterItem?.fullName && currentRosterItem.fullName !== record.profile.name && (
                  <small style={{ display: 'block', color: '#5b5348', marginTop: '2px' }}>
                    {currentRosterItem.fullName}
                  </small>
                )}
                <div className="card-dynasty-row">
                  <p>{record.profile.dynasty || currentRosterItem?.dynasty || '朝代待补充'}</p>
                  <DynastyFlagCanvas
                    dynasty={record.profile.dynasty || currentRosterItem?.dynasty || ''}
                    mode="badge"
                  />
                </div>
                <div className="card-tags">
                  <span className="tag-badge cinnabar">
                    庙号：{record.profile.templeName || currentRosterItem?.templeName || '无'}
                  </span>
                  <span className="tag-badge gold">
                    谥号：{record.profile.posthumousName || currentRosterItem?.posthumousName || '无'}
                  </span>
                </div>
              </div>
            </div>

            {/* 在位、年号、庙谥横向数据栏 */}
            <div className="card-reign-bar">
              <div>
                <span>在位年代</span>
                <strong>{reignDisplay || currentRosterItem?.reignDisplay || '待考'}</strong>
              </div>
              <div>
                <span>代表年号</span>
                <strong>{record.profile.eraNames.slice(0, 2).join('/') || currentRosterItem?.eraNames.slice(0, 2).join('/') || '无'}</strong>
              </div>
              <div>
                <span>庙号</span>
                <strong>{record.profile.templeName || currentRosterItem?.templeName || '无'}</strong>
              </div>
              <div>
                <span>主要谥号</span>
                <strong>{record.profile.posthumousName || currentRosterItem?.posthumousName || '无'}</strong>
              </div>
            </div>

            <div className="card-score">
              <span>综合评分</span>
              <strong>{result.score100 === null ? '—' : result.score100.toFixed(1)}</strong>
              <small>
                {result.algorithmId === 'emperor-fixed-12-v1'
                  ? '十二维固定权重'
                  : '自定义等级轴'}
              </small>
              {result.status === 'incomplete' && (
                <small>
                  已评 {result.completed}/12 · 权重覆盖 {result.coveragePercent}%
                </small>
              )}
              {result.algorithmId === 'emperor-fixed-12-v1' && result.status === 'incomplete' && result.completed > 0 && (
                <small>已评部分贡献 {Number(result.subtotal100.toFixed(3))} 分（非综合分）</small>
              )}
            </div>

            {result.algorithmId === 'emperor-fixed-12-v1' && (
              <EmperorRadar scores={record.fixed.scores} />
            )}

            <div className={`card-values${result.algorithmId === 'emperor-custom-level-v1' ? ' card-values-custom' : ''}`}>
              {result.algorithmId === 'emperor-fixed-12-v1'
                ? result.contributions.map((item) => (
                    <div key={item.id}>
                      <span>{item.label} <small className="card-axis-weight">{item.weightPercent}%</small></span>
                      <b>{item.score === null ? <><span aria-hidden="true">—</span><span className="emperor-visually-hidden">未评分</span></> : item.score}</b>
                    </div>
                  ))
                : record.custom.axes.filter((axis) => axis.enabled).map((axis) => (
                    <div key={axis.id}>
                      <span>{axis.name || '未命名评价轴'} · LV{axis.importanceLevel}{axis.importanceLevel === 0 ? '（不计入）' : ''}</span>
                      <b>{axis.score === 0 ? '未评' : `${axis.score} / 10`}</b>
                    </div>
                  ))}
            </div>

            {result.algorithmId === 'emperor-custom-level-v1' && (
              <section className="card-calculation" aria-label="自定义算法计算说明">
                <h2>计算说明</h2>
                {result.status === 'ready' ? <>
                  <p>加权基础分：{Number(result.positiveScore100.toFixed(3))} 分</p>
                  <p>扣分合计：{Number(result.penalty100.toFixed(3))} 分</p>
                  <p>相加后限制在 0–100 分，显示一位小数：{result.score100.toFixed(1)} 分</p>
                </> : <p>尚无计入计算的评分轴，请给启用且权重大于 0 的轴评分。</p>}
              </section>
            )}
            {record.selectedAlgorithm === 'emperor-custom-level-v1' && record.custom.negativeItems.some((item) => item.enabled && item.score !== 0) && (
              <section className="card-reasons" aria-label="扣分明细">
                <h2>扣分明细</h2>
                {record.custom.negativeItems.filter((item) => item.enabled && item.score !== 0).map((item) => (
                  <div key={item.id}><strong>{item.name || '未命名扣分项'}</strong><p>{item.score} 分（综合分 {Number((item.score * 10).toFixed(2))} 分）</p></div>
                ))}
                {result.status === 'uncalculable' && <p>尚无有效评分轴，综合分暂不可计算。</p>}
              </section>
            )}
            {reasons.some((reason) => reason.text.trim()) && (
              <section className="card-reasons" aria-label="分项理由">
                <h2>分项理由</h2>
                {reasons.filter((reason) => reason.text.trim()).map((reason, index) => (
                  <div key={`${reason.id}-${index}`}><strong>{reason.label}</strong><p>{reason.text}</p></div>
                ))}
              </section>
            )}
            {(record.selectedAlgorithm === 'emperor-fixed-12-v1' ? record.fixed.summary : record.custom.summary)?.trim() && (
              <p className="card-summary"><strong>一句话评价：</strong>{record.selectedAlgorithm === 'emperor-fixed-12-v1' ? record.fixed.summary : record.custom.summary}</p>
            )}
            {(record.selectedAlgorithm === 'emperor-fixed-12-v1' ? record.fixed.comment : record.custom.comment).trim() && (
              <p className="card-comment">{record.selectedAlgorithm === 'emperor-fixed-12-v1' ? record.fixed.comment : record.custom.comment}</p>
            )}

            <footer>
              <span>评分者：{record.signature || '未填写'}</span>
              <span>阅</span>
            </footer>
          </article>
          <label className="image-ratio-label">图片比例 <select value={imageRatio} onChange={(event) => setWorkspace((current) => ({ ...current, imageRatio: event.target.value as EmperorImageRatio }))}>{emperorImageRatios.map((ratio) => <option key={ratio} value={ratio}>{ratio === '原始' ? '原始长图' : ratio}</option>)}</select></label>
          <p className="emperor-note">{__EMPEROR_MINITOOL__ ? '小工具图片采用离线长图排版；固定比例完整容纳同一长图并留白，长内容建议选择原始长图。下方“上次生成的图片”为相册实际保存内容。' : '横版图片会调整卡片排版；固定比例保留完整内容，必要时缩放并留白，长内容的文字可能较小。'}</p>
          <button type="button" onClick={() => void downloadCard()} disabled={exporting}>{exporting ? '生成中…' : __EMPEROR_MINITOOL__ ? '生成评分卡 PNG' : '下载评分卡 PNG'}</button>
          <button type="button" ref={shareButtonRef} aria-expanded={shareChoice} onClick={requestShare}>{__EMPEROR_MINITOOL__ ? '保存到系统相册' : '分享图片'}</button>
          {shareChoice && <section className="share-choice" aria-label="图片已过期" onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeShareChoice(); } }}><p>评分或图片比例已更改，选择要{__EMPEROR_MINITOOL__ ? '保存' : '分享'}的图片：</p><div><button type="button" onClick={() => { closeShareChoice(); void downloadCard(false); }}>生成新图片</button><button type="button" ref={cancelShareRef} onClick={closeShareChoice}>取消</button><button type="button" onClick={() => { closeShareChoice(); if (generatedImage) void shareImage(generatedImage); }}>{__EMPEROR_MINITOOL__ ? '保存旧图片' : '分享旧图片'}</button></div></section>}
          <p role="status">{imageMessage}</p>
          {generatedImage && <section className="generated-preview"><h2>上次生成的图片</h2>{(generatedImage.workspace !== workspace || generatedImage.ratio !== imageRatio) && <p>内容或比例已更改，请重新生成。</p>}<img src={generatedImage.url} alt="上次生成的评分卡图片" />{!__EMPEROR_MINITOOL__ && <a className="generated-download" href={generatedImage.url} download={generatedImage.filename}>下载这张图片</a>}</section>}
          <p className="emperor-note">
            人物资料及图片来源仍在整理中。
          </p>
        </section>

        {/* 右栏：评分编辑器 */}
        <section className="emperor-panel emperor-editor" ref={editorRegionRef} tabIndex={-1} aria-label="评分编辑">
          <h2>评分编辑</h2>
          {storageConflict && <section className="storage-conflict" role="alert"><p>其他页面修改了本地草稿。本页改动暂未自动保存，可先导出备份，再选择如何处理。</p>{preserveInvalidCache && initialCache !== null && <button type="button" onClick={exportOriginalCache}>下载原始本地数据</button>}<button type="button" onClick={exportBackup}>导出本页备份</button><button type="button" onClick={() => resolveStorageConflict('load')}>载入其他页面草稿</button><button type="button" onClick={() => resolveStorageConflict('overwrite')}>用本页草稿覆盖</button><p role="status">{backupMessage}</p></section>}
          {storageError && !storageConflict && <section className="storage-conflict" role="alert"><p>{preserveInvalidCache ? initialCache === null ? '当前无法读取本地存储，无法确认是否已有草稿。当前页面为临时工作区；建议先导出本页备份，再重新检查。' : '本地数据未能载入，原始内容已保留。请先下载原始本地数据；当前页面显示的是临时工作区。' : '本地草稿无法正常保存。请先导出本页备份，再检查浏览器存储或导入有效备份。'}</p>{preserveInvalidCache && initialCache !== null && <button type="button" onClick={exportOriginalCache}>下载原始本地数据</button>}<button type="button" onClick={exportBackup}>导出本页备份</button>{preserveInvalidCache && initialCache !== null && <button type="button" onClick={replaceInvalidCache}>使用本页工作区恢复自动保存</button>}{preserveInvalidCache && <button type="button" onClick={retryUnavailableStorage}>重新检查本地数据</button>}{!preserveInvalidCache && <button type="button" onClick={retryLocalSave}>重试本地保存</button>}<p role="status">{backupMessage}</p></section>}
          <section className="editor-person-summary" aria-label="当前评分人物">
            <div className="editor-person-heading">
              <EmperorPortrait id={record.profile.id} name={record.profile.name} dynasty={record.profile.dynasty} imageFilename={currentRosterItem?.imageFilename} customSrc={record.portraitDataUrl} />
              <div><strong>{record.profile.name || '未命名人物'}</strong><p>{record.profile.dynasty || '朝代待补充'}</p></div>
              <div className="editor-person-score"><span>综合评分</span><strong>{result.score100 === null ? '—' : result.score100.toFixed(1)}</strong></div>
            </div>
            <p>{result.algorithmId === 'emperor-fixed-12-v1' ? `十二维固定权重 · 已评 ${result.completed}/12` : '自定义等级轴'}</p>
            {result.algorithmId === 'emperor-fixed-12-v1' && <EmperorRadar scores={record.fixed.scores} />}
          </section>
          <label>人物图片（可选）<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (!file) return; if (record.portraitDataUrl && !window.confirm('当前人物已有自选图片，确定替换吗？')) { portraitSequence.current++; setPortraitMessage('已取消更换图片。'); return; } void choosePortrait(file); }} /></label>
          <p className="emperor-note">图片会压缩后保存在本地草稿和 JSON 备份中。</p>
          {record.portraitDataUrl && <button type="button" onClick={() => { if (window.confirm('确定移除当前人物的自选图片吗？')) { portraitSequence.current++; update((current) => ({ ...current, portraitDataUrl: undefined })); setPortraitMessage('已移除自选图片。'); } }}>移除自选图片</button>}
          <p role="status">{portraitMessage}</p>
          <button type="button" onClick={clearCurrentDraft}>清空当前算法评分</button>
          <details className="emperor-backup"><summary>备份与恢复</summary>
            <p>备份包含全部人物的两种评分草稿和签名。</p>
            <button type="button" onClick={exportBackup}>导出 JSON 备份</button>
            {__EMPEROR_MINITOOL__ ? <><button onClick={() => setBackupTextOpen(true)}>粘贴备份文本恢复</button><p>小工具不支持下载文件；请复制备份文本并妥善保存。</p></> : <label>导入 JSON 备份<input type="file" accept=".json,application/json" onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (file) void importBackup(file); }} /></label>}
            <p role="status">{backupMessage}</p>
          </details>
          {__EMPEROR_MINITOOL__ && backupTextOpen && <section className="emperor-text-backup"><label>备份文本<textarea rows={8} maxLength={MAX_EMPEROR_ARCHIVE_BYTES} value={backupText} onChange={(event) => setBackupText(event.target.value)} /></label><button onClick={() => void importBackup(backupText)}>从文本恢复</button><button onClick={() => setBackupTextOpen(false)}>收起备份文本</button></section>}
          <label>
            评分算法
            <select
              value={record.selectedAlgorithm}
              onChange={(e) =>
                update((current) => ({
                  ...current,
                  selectedAlgorithm: e.target.value as typeof current.selectedAlgorithm,
                }))
              }
            >
              <option value="emperor-fixed-12-v1">十二维固定权重</option>
              <option value="emperor-custom-level-v1">自定义等级轴</option>
            </select>
          </label>

          {record.selectedAlgorithm === 'emperor-fixed-12-v1' ? (
            <>
              <p className="emperor-note">
                0 是真实评分；未评分显示“—”。十二项全部打分后方展示综合总分。
              </p>
              {result.algorithmId === 'emperor-fixed-12-v1' && result.status === 'incomplete' && result.completed > 0 && (
                <p className="emperor-note" role="status">已评部分贡献 {Number(result.subtotal100.toFixed(3))} 分，覆盖权重 {result.coveragePercent}%；这不是最终综合分。</p>
              )}
              <div className="dimension-grid">
                {fixedDimensions.map(([id, label, weight]) => (
                  <button
                    key={id}
                    ref={(element) => { dimensionButtons.current[id] = element; }}
                    aria-label={`${label}，权重 ${weight}%，${record.fixed.scores[id] === null ? '未评分' : `${record.fixed.scores[id]} 分`}`}
                    aria-expanded={dimension === id}
                    className={dimension === id ? 'selected' : ''}
                    onClick={() => setDimension(id)}
                  >
                    <span>
                      {label} <small>{weight}%</small>
                    </span>
                    <strong>{record.fixed.scores[id] ?? '—'}</strong>
                  </button>
                ))}
              </div>

              {active && (
                <div className="dimension-editor" onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setDimension(null); dimensionButtons.current[active[0]]?.focus(); } }}>
                  <h3>
                    {active[1]} · 权重 {active[2]}%
                  </h3>
                  <p className="emperor-note">{record.fixed.scores[active[0]] === null ? '此项尚未评分。' : `此项贡献 ${Number(((record.fixed.scores[active[0]] ?? 0) * active[2] / 100).toFixed(3))} 分（百分制）。`}</p>
                  <label>
                    滑动评分（0–100）
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={record.fixed.scores[active[0]] ?? 50}
                      aria-valuetext={
                        record.fixed.scores[active[0]] === null
                          ? '未评分'
                          : String(record.fixed.scores[active[0]])
                      }
                      onChange={(e) => setScore(active[0], Number(e.target.value))}
                    />
                  </label>
                  <div className="score-step">
                    <button
                      disabled={record.fixed.scores[active[0]] === null}
                      onClick={() =>
                        setScore(
                          active[0],
                          Math.max(0, (record.fixed.scores[active[0]] ?? 0) - 1),
                        )
                      }
                    >
                      −1
                    </button>
                    <button
                      disabled={record.fixed.scores[active[0]] === null}
                      onClick={() =>
                        setScore(
                          active[0],
                          Math.min(100, (record.fixed.scores[active[0]] ?? 0) + 1),
                        )
                      }
                    >
                      ＋1
                    </button>
                    <button onClick={() => setScore(active[0], 50)}>设为 50</button>
                  </div>
                  <label>
                    精确分数（可填 0.1 精度）
                    <PreciseScoreInput key={`${record.profile.id}-${active[0]}`} value={record.fixed.scores[active[0]]} onChange={(value) => setScore(active[0], value)} />
                  </label>
                  <label>
                    评价理由（可选）
                    <textarea
                      maxLength={500}
                      placeholder="写下你给出这个分数的史实依据与理由…"
                      value={record.fixed.reasons[active[0]]}
                      onChange={(e) =>
                        update((current) => ({
                          ...current,
                          fixed: {
                            ...current.fixed,
                            reasons: {
                              ...current.fixed.reasons,
                              [active[0]]: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </label>
                  <button onClick={() => setScore(active[0], null)}>清除此项</button>
                  <button onClick={() => { setDimension(null); dimensionButtons.current[active[0]]?.focus(); }}>关闭</button>
                </div>
              )}
            </>
          ) : (
            <CustomAxes
              key={record.profile.id}
              draft={record.custom}
              onChange={(custom) => update((current) => ({ ...current, custom }))}
            />
          )}

          <label>
            一句话评价（可选）
            <input
              maxLength={24}
              placeholder="用一句话概括，最多 24 字"
              value={(record.selectedAlgorithm === 'emperor-fixed-12-v1' ? record.fixed.summary : record.custom.summary) ?? ''}
              onChange={(e) => update((current) => current.selectedAlgorithm === 'emperor-fixed-12-v1'
                ? { ...current, fixed: { ...current.fixed, summary: e.target.value } }
                : { ...current, custom: { ...current.custom, summary: e.target.value } })}
            />
          </label>
          <label>
            总体评价（可选）
            <textarea
              maxLength={3000}
              placeholder="写下你对这位帝王的总体评语…"
              value={
                record.selectedAlgorithm === 'emperor-fixed-12-v1'
                  ? record.fixed.comment
                  : record.custom.comment
              }
              onChange={(e) =>
                update((current) =>
                  current.selectedAlgorithm === 'emperor-fixed-12-v1'
                    ? { ...current, fixed: { ...current.fixed, comment: e.target.value } }
                    : { ...current, custom: { ...current.custom, comment: e.target.value } },
                )
              }
            />
          </label>
          <label>
            个人签名档（可选）
            <input
              placeholder="你的署名"
              value={record.signature}
              maxLength={120}
              onChange={(e) =>
                update((current) => ({ ...current, signature: e.target.value }))
              }
            />
          </label>
        </section>
      </main>

      {/* 手机端底栏导航 */}
      <nav className="emperor-mobile-nav" aria-label="页面导航">
        <button
          className={tab === 'roster' ? 'selected' : ''}
          aria-current={tab === 'roster' ? 'location' : undefined}
          onClick={() => navigateTab('roster')}
        >
          名录
        </button>
        <button className={tab === 'edit' ? 'selected' : ''} aria-current={tab === 'edit' ? 'location' : undefined} onClick={() => navigateTab('edit')}>
          评分
        </button>
        <button className={tab === 'card' ? 'selected' : ''} aria-current={tab === 'card' ? 'location' : undefined} onClick={() => navigateTab('card')}>
          预览
        </button>
      </nav>
    </div>
  );
}
