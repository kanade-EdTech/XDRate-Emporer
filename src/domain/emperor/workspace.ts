import type { RatingAxis, NegativeItem } from '../rating/types';

export const fixedDimensions = [
  ['virtue', '德', 12], ['wisdom', '智', 8], ['vitality', '体', 4],
  ['aesthetics', '美', 4], ['diligence', '劳', 5], ['ambition', '雄心', 5],
  ['dignity', '尊严', 8], ['magnanimity', '气量', 5], ['self_control', '欲望自控', 6],
  ['personnel_management', '人事管理', 10], ['state_power', '国力', 15],
  ['popular_support', '民心', 18],
] as const;
export type DimensionId = (typeof fixedDimensions)[number][0];
export type AlgorithmId = 'emperor-custom-level-v1' | 'emperor-fixed-12-v1';
export const emperorImageRatios = ['原始', '16:9', '8:5', '3:2', '4:3', '5:4', '1:1', '4:5', '3:4', '2:3', '5:8', '9:16'] as const;
export type EmperorImageRatio = (typeof emperorImageRatios)[number];
export interface EmperorProfile {
  id: string;
  name: string;
  dynasty: string;
  templeName: string;
  posthumousName: string;
  eraNames: string[];
  reigns: { start: string; end: string }[];
  identity: 'reigning' | 'posthumous' | 'disputed' | 'unverified';
  sources: string[];
}
export interface EmperorRecord {
  profile: EmperorProfile;
  selectedAlgorithm: AlgorithmId;
  custom: { axes: RatingAxis[]; negativeItems: NegativeItem[]; comment: string; summary?: string };
  fixed: { scores: Record<DimensionId, number | null>; reasons: Record<DimensionId, string>; comment: string; summary?: string };
  signature: string;
  portraitDataUrl?: string;
}
export interface EmperorWorkspace {
  format: 'xdrate-emperor-archive';
  schemaVersion: 1;
  records: EmperorRecord[];
  selectedEmperorId: string;
  imageRatio?: EmperorImageRatio;
}
export const emperorWorkspaceKey = 'xdrate.emperor.workspace.v1';
export const MAX_EMPEROR_ARCHIVE_BYTES = 16_000_000;

/** Fixed percentages use integer tenths internally; only the final score is rounded. */
export function calculateFixedScores(scores: Record<DimensionId, number | null>) {
  requireValue(object(scores) && Object.keys(scores).length === 12, '维度数量');
  let weightedTenths = 0;
  let completed = 0;
  let coveragePercent = 0;
  const contributions = fixedDimensions.map(([id, label, weightPercent]) => {
    const score = scores[id];
    requireValue(score === null || (typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100 && Math.abs(score * 10 - Math.round(score * 10)) < 1e-8), id);
    if (score === null) return { id, label, weightPercent, score, contribution100: null };
    const units = Math.round(score * 10) * weightPercent;
    weightedTenths += units;
    completed += 1;
    coveragePercent += weightPercent;
    return { id, label, weightPercent, score, contribution100: units / 1000 };
  });
  return {
    algorithmId: 'emperor-fixed-12-v1' as const,
    status: completed === 12 ? 'ready' as const : 'incomplete' as const,
    completed, coveragePercent, contributions,
    subtotal100: weightedTenths / 1000,
    score100: completed === 12 ? Math.floor((weightedTenths + 50) / 100) / 10 : null,
  };
}

export function calculateCustomScores(draft: EmperorRecord['custom']) {
  const weights = [0, 0.25, 0.75, 1, 1.5, 2.5, 5] as const;
  requireValue(draft.axes.length >= 1 && draft.axes.length <= 12 && draft.negativeItems.length <= 5, '自定义数量');
  uniqueIds(draft.axes, '轴 ID');
  uniqueIds(draft.negativeItems, '扣分 ID');
  for (const axis of draft.axes) requireValue(Number.isInteger(axis.score) && axis.score >= 0 && axis.score <= 10 && Number.isInteger(axis.importanceLevel) && axis.importanceLevel >= 0 && axis.importanceLevel <= 6 && typeof axis.enabled === 'boolean', '自定义分值');
  for (const item of draft.negativeItems) requireValue(Number.isFinite(item.score) && item.score >= -5 && item.score <= 0 && typeof item.enabled === 'boolean', '扣分值');
  const active = draft.axes.filter(axis => axis.enabled && axis.score >= 1 && weights[axis.importanceLevel] > 0);
  const totalWeight = active.reduce((sum, axis) => sum + weights[axis.importanceLevel], 0);
  const contributions = active.map(axis => ({ axisId: axis.id, axisName: axis.name, score: axis.score, weight: weights[axis.importanceLevel], weightedContribution100: axis.score * weights[axis.importanceLevel] * 10 / totalWeight }));
  if (totalWeight === 0) return { algorithmId: 'emperor-custom-level-v1' as const, status: 'uncalculable' as const, contributions, score100: null };
  const positiveScore100 = contributions.reduce((sum, entry) => sum + entry.weightedContribution100, 0);
  const penalty100 = draft.negativeItems.filter(item => item.enabled).reduce((sum, item) => sum + item.score, 0) * 10;
  return { algorithmId: 'emperor-custom-level-v1' as const, status: 'ready' as const, contributions, totalWeight, positiveScore100, penalty100, score100: Math.round((Math.max(0, Math.min(100, positiveScore100 + penalty100)) + Number.EPSILON) * 10) / 10 };
}

export function calculateEmperorRecord(record: EmperorRecord) {
  if (record.selectedAlgorithm === 'emperor-fixed-12-v1') return calculateFixedScores(record.fixed.scores);
  requireValue(record.selectedAlgorithm === 'emperor-custom-level-v1', '算法');
  return calculateCustomScores(record.custom);
}

export function createEmperorRecord(id: string, name = '', profileUpdates?: Partial<EmperorProfile>): EmperorRecord {
  if (!id.trim()) throw new Error('帝王 ID 不能为空');
  return {
    profile: {
      id,
      name,
      dynasty: '',
      templeName: '',
      posthumousName: '',
      eraNames: [],
      reigns: [],
      identity: 'unverified',
      sources: [],
      ...profileUpdates,
    },
    selectedAlgorithm: 'emperor-fixed-12-v1',
    custom: { axes: fixedDimensions.map(([key, label]) => ({ id: key, name: label, score: 0, importanceLevel: 3, enabled: true, reason: '' })), negativeItems: [], comment: '' },
    fixed: { scores: Object.fromEntries(fixedDimensions.map(([key]) => [key, null])) as Record<DimensionId, null>, reasons: Object.fromEntries(fixedDimensions.map(([key]) => [key, ''])) as Record<DimensionId, string>, comment: '' },
    signature: '',
  };
}

function requireValue(condition: unknown, field: string): asserts condition {
  if (!condition) throw new Error(`帝王存档字段无效：${field}`);
}
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function text(value: unknown, max = 3000): value is string {
  return typeof value === 'string' && value.length <= max;
}
function uniqueIds(items: unknown[], field: string) {
  const ids = items.map((item) => { requireValue(object(item) && text(item.id, 128) && item.id.trim(), field); return item.id; });
  requireValue(new Set(ids).size === ids.length, field);
}

/** Parses into a fresh object. Failed imports never mutate the current workspace. */
export function parseEmperorArchive(input: string): EmperorWorkspace {
  requireValue(input.length <= MAX_EMPEROR_ARCHIVE_BYTES && new TextEncoder().encode(input).byteLength <= MAX_EMPEROR_ARCHIVE_BYTES, '文件大小');
  const value: unknown = JSON.parse(input);
  requireValue(object(value) && value.format === 'xdrate-emperor-archive' && value.schemaVersion === 1, '领域或版本');
  requireValue(value.imageRatio === undefined || (typeof value.imageRatio === 'string' && emperorImageRatios.some((ratio) => ratio === value.imageRatio)), '图片比例');
  requireValue(Array.isArray(value.records) && value.records.length > 0 && value.records.length <= 500, '人物列表');
  const ids = new Set<string>();
  for (const record of value.records) {
    requireValue(object(record) && object(record.profile), '人物');
    const profile = record.profile;
    requireValue(text(profile.id, 128) && profile.id.trim() && !ids.has(profile.id), '人物 ID');
    ids.add(profile.id);
    for (const key of ['name', 'dynasty', 'templeName', 'posthumousName']) requireValue(text(profile[key], 200), key);
    requireValue(['reigning', 'posthumous', 'disputed', 'unverified'].includes(String(profile.identity)), '身份');
    for (const key of ['eraNames', 'sources']) requireValue(Array.isArray(profile[key]) && profile[key].length <= 100 && profile[key].every((v: unknown) => text(v, 1000)), key);
    requireValue(Array.isArray(profile.reigns) && profile.reigns.length <= 20 && profile.reigns.every((r: unknown) => object(r) && text(r.start, 40) && text(r.end, 40)), '在位区间');
    requireValue(['emperor-custom-level-v1', 'emperor-fixed-12-v1'].includes(String(record.selectedAlgorithm)), '算法');
    requireValue(object(record.fixed) && object(record.fixed.scores) && object(record.fixed.reasons) && text(record.fixed.comment), '固定算法草稿');
    requireValue(record.fixed.summary === undefined || text(record.fixed.summary, 24), '固定算法一句话评价');
    const scores = record.fixed.scores;
    const reasons = record.fixed.reasons;
    requireValue(Object.keys(scores).length === 12 && Object.keys(reasons).length === 12, '维度数量');
    for (const [key] of fixedDimensions) {
      const score = scores[key];
      requireValue(score === null || (typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= 100 && Math.abs(score * 10 - Math.round(score * 10)) < 1e-8), key);
      requireValue(text(reasons[key], 500), `${key}理由`);
    }
    requireValue(object(record.custom) && text(record.custom.comment) && Array.isArray(record.custom.axes) && record.custom.axes.length >= 1 && record.custom.axes.length <= 12 && Array.isArray(record.custom.negativeItems) && record.custom.negativeItems.length <= 5, '自定义草稿');
    requireValue(record.custom.summary === undefined || text(record.custom.summary, 24), '自定义算法一句话评价');
    uniqueIds(record.custom.axes, '轴 ID');
    uniqueIds(record.custom.negativeItems, '扣分 ID');
    for (const axis of record.custom.axes) {
      requireValue(object(axis) && text(axis.name, 24) && text(axis.reason, 500) && typeof axis.enabled === 'boolean' && Number.isInteger(axis.score) && Number(axis.score) >= 0 && Number(axis.score) <= 10 && Number.isInteger(axis.importanceLevel) && Number(axis.importanceLevel) >= 0 && Number(axis.importanceLevel) <= 6, '自定义轴');
    }
    for (const item of record.custom.negativeItems) requireValue(object(item) && text(item.name, 24) && text(item.reason, 500) && typeof item.enabled === 'boolean' && typeof item.score === 'number' && Number.isFinite(item.score) && item.score >= -5 && item.score <= 0, '扣分项');
    requireValue(text(record.signature, 120), '签名');
    requireValue(record.portraitDataUrl === undefined || (text(record.portraitDataUrl, 350_000) && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(record.portraitDataUrl)), '人物图片');
  }
  requireValue(typeof value.selectedEmperorId === 'string' && ids.has(value.selectedEmperorId), '选中人物');
  return value as unknown as EmperorWorkspace;
}

export function serializeEmperorArchive(workspace: EmperorWorkspace): string {
  const encoded = JSON.stringify(workspace, (_key, value: unknown) => {
    requireValue(typeof value !== 'number' || Number.isFinite(value), '非有限数值');
    return value;
  });
  parseEmperorArchive(encoded);
  return encoded;
}
export function saveEmperorWorkspace(storage: Pick<Storage, 'setItem'>, workspace: EmperorWorkspace) {
  storage.setItem(emperorWorkspaceKey, serializeEmperorArchive(workspace));
}
export function loadEmperorWorkspace(storage: Pick<Storage, 'getItem'>): EmperorWorkspace | null {
  const encoded = storage.getItem(emperorWorkspaceKey);
  return encoded === null ? null : parseEmperorArchive(encoded);
}
