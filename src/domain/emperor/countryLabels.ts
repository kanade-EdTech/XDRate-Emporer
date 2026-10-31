// Recognition labels retain historical period qualifiers; they are not claims of formal state names.
export const dynastyCountryLabels: Record<string, string> = {
  "西汉": "西漢", "东汉": "東漢", "唐朝": "唐", "北宋": "北宋",
  "元朝": "元", "明朝": "明", "清朝": "清", "后周": "後周",
  "三国·曹魏": "曹魏", "五代·南吴": "南吳", "隋朝": "隋", "辽朝": "遼",
  "三国·东吴": "東吳", "南朝·陈": "南朝陳", "十六国·前秦": "前秦", "秦朝": "秦",
  "十六国·后赵": "後趙", "南宋": "南宋", "北魏": "北魏", "十六国·前燕": "前燕",
  "南朝·齐": "南朝齊", "五代·闽国": "閩", "五代·南唐": "南唐", "东魏·北齐": "東魏·北齊",
  "西夏": "西夏", "五代·吴越": "吳越", "十六国·汉赵": "漢趙", "三国·蜀汉": "蜀漢",
  "南朝·宋": "南朝宋", "五代·后唐": "後唐", "十六国·后燕": "後燕", "十六国·成汉": "成漢",
  "十六国·后秦": "後秦", "东晋": "東晉", "南朝·梁": "南朝梁", "十六国·南燕": "南燕",
  "北周": "北周", "五代·前蜀": "前蜀", "西晋": "西晉", "金朝": "金",
  "武周": "武周", "后金·清朝": "後金·清", "北齐": "北齊",
  "西晋（追尊）": "西晉", "南朝宋": "南朝宋", "大蒙古国 / 元朝": "大蒙古國·元"
};

export type VirtueElement = 'metal' | 'wood' | 'water' | 'fire' | 'earth';

export interface VirtueTheme {
  element: VirtueElement;
  virtueLabel: string;
  shortVirtue: string;
  bgPrimary: string;
  bgSecondary: string;
  borderOuter: string;
  borderInner: string;
  textPrimary: string;
  textSecondary: string;
  sealBg: string;
  sealText: string;
}

export const virtueThemes: Record<VirtueElement, VirtueTheme> = {
  // 白金德（金德尚白）
  metal: {
    element: 'metal',
    virtueLabel: '金德尚白',
    shortVirtue: '白金德',
    bgPrimary: '#EAE5DC',
    bgSecondary: '#F4F1EA',
    borderOuter: '#8F6D2E',
    borderInner: '#B89B5E',
    textPrimary: '#231C14',
    textSecondary: '#6B5120',
    sealBg: '#9B261E',
    sealText: '#F8F4EC',
  },
  // 青木德（木德尚青）
  wood: {
    element: 'wood',
    virtueLabel: '木德尚青',
    shortVirtue: '青木德',
    bgPrimary: '#1B4D47',
    bgSecondary: '#235E57',
    borderOuter: '#D9B66C',
    borderInner: '#7FA99B',
    textPrimary: '#F6EEDB',
    textSecondary: '#DEC386',
    sealBg: '#A82A21',
    sealText: '#FAF2E1',
  },
  // 黑水德（水德尚黑）
  water: {
    element: 'water',
    virtueLabel: '水德尚黑',
    shortVirtue: '黑水德',
    bgPrimary: '#1A1C20',
    bgSecondary: '#24272D',
    borderOuter: '#C89B4B',
    borderInner: '#7D6538',
    textPrimary: '#F3EBDC',
    textSecondary: '#D6B06A',
    sealBg: '#A8281F',
    sealText: '#F7EFE2',
  },
  // 赤火德（火德尚赤）
  fire: {
    element: 'fire',
    virtueLabel: '火德尚赤',
    shortVirtue: '赤火德',
    bgPrimary: '#8B1E18',
    bgSecondary: '#9E251E',
    borderOuter: '#E5C174',
    borderInner: '#C29546',
    textPrimary: '#FCF3E1',
    textSecondary: '#EBD094',
    sealBg: '#D9B25F',
    sealText: '#5C110D',
  },
  // 黄土德（土德尚黄）
  earth: {
    element: 'earth',
    virtueLabel: '土德尚黃',
    shortVirtue: '黃土德',
    bgPrimary: '#C9932B',
    bgSecondary: '#D8A33B',
    borderOuter: '#4A300D',
    borderInner: '#78521B',
    textPrimary: '#231606',
    textSecondary: '#4D320E',
    sealBg: '#98231B',
    sealText: '#FBF2E0',
  },
};

// 历代王朝五德终始说代表色映射（白金、青木、黑水、赤火、黄土德）
export const countryVirtueByLabel: Record<string, VirtueElement> = {
  // 黑水德（水德尚黑）
  "秦": "water",
  "北魏": "water",
  "北周": "water",
  "後趙": "water",
  "遼": "water",
  "清": "water",
  "後金·清": "water",

  // 赤火德（火德尚赤）
  "西漢": "fire",
  "東漢": "fire",
  "蜀漢": "fire",
  "漢趙": "fire",
  "南朝宋": "fire",
  "南朝梁": "fire",
  "隋": "fire",
  "南唐": "fire",
  "北宋": "fire",
  "南宋": "fire",
  "明": "fire",

  // 黄土德（土德尚黄）
  "曹魏": "earth",
  "東吳": "earth",
  "唐": "earth",
  "武周": "earth",
  "後唐": "earth",
  "西夏": "earth",
  "元": "earth",
  "大蒙古國·元": "earth",
  "國號待補": "earth",

  // 青木德（木德尚青）
  "前秦": "wood",
  "前燕": "wood",
  "後燕": "wood",
  "南燕": "wood",
  "北齊": "wood",
  "東魏·北齊": "wood",
  "南朝齊": "wood",
  "後周": "wood",
  "吳越": "wood",

  // 白金德（金德尚白）
  "西晉": "metal",
  "東晉": "metal",
  "南朝陳": "metal",
  "金": "metal",
  "後秦": "metal",
  "成漢": "metal",
  "前蜀": "metal",
  "南吳": "metal",
  "閩": "metal",
};

export function countryLabel(dynasty: string): string {
  const value = dynasty.trim();
  return dynastyCountryLabels[value] ?? (Object.values(dynastyCountryLabels).includes(value) ? value : '國號待補');
}

export function getDynastyFlagSpec(dynasty: string): {
  label: string;
  element: VirtueElement;
  theme: VirtueTheme;
} {
  const label = countryLabel(dynasty);
  const element = countryVirtueByLabel[label] ?? 'earth';
  return {
    label,
    element,
    theme: virtueThemes[element],
  };
}
