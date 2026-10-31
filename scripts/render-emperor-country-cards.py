"""Render complete dynastic Five-Element Virtue flag images in Traditional Clerical Script (繁体隶书); never copy or embed font software."""
from pathlib import Path
import hashlib
import json
import math
import re
import sys
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

root = Path(__file__).resolve().parents[1]
source = (root / 'src/domain/emperor/countryLabels.ts').read_text(encoding='utf-8')
labels = json.loads(re.search(r'dynastyCountryLabels: Record<string, string> = (\{.*?\});', source, re.S).group(1))

target = root / 'assets/emperor/country-cards'
target.mkdir(parents=True, exist_ok=True)

dist_flags = root / 'dist/朝代旗帜'
dist_flags.mkdir(parents=True, exist_ok=True)

font_path = Path('C:/Windows/Fonts/SIMLI.TTF')
if not font_path.exists():
    raise SystemExit('Install the licensed Windows LiSu font locally before rendering these signs.')

VIRTUE_THEMES = {
    'metal': {
        'element': 'metal',
        'virtueLabel': '金德尚白',
        'shortVirtue': '白金德',
        'bgPrimary': '#EAE5DC',
        'bgSecondary': '#F4F1EA',
        'borderOuter': '#8F6D2E',
        'borderInner': '#B89B5E',
        'textPrimary': '#231C14',
        'textSecondary': '#6B5120',
        'sealBg': '#9B261E',
        'sealText': '#F8F4EC',
    },
    'wood': {
        'element': 'wood',
        'virtueLabel': '木德尚青',
        'shortVirtue': '青木德',
        'bgPrimary': '#1B4D47',
        'bgSecondary': '#235E57',
        'borderOuter': '#D9B66C',
        'borderInner': '#7FA99B',
        'textPrimary': '#F6EEDB',
        'textSecondary': '#DEC386',
        'sealBg': '#A82A21',
        'sealText': '#FAF2E1',
    },
    'water': {
        'element': 'water',
        'virtueLabel': '水德尚黑',
        'shortVirtue': '黑水德',
        'bgPrimary': '#1A1C20',
        'bgSecondary': '#24272D',
        'borderOuter': '#C89B4B',
        'borderInner': '#7D6538',
        'textPrimary': '#F3EBDC',
        'textSecondary': '#D6B06A',
        'sealBg': '#A8281F',
        'sealText': '#F7EFE2',
    },
    'fire': {
        'element': 'fire',
        'virtueLabel': '火德尚赤',
        'shortVirtue': '赤火德',
        'bgPrimary': '#8B1E18',
        'bgSecondary': '#9E251E',
        'borderOuter': '#E5C174',
        'borderInner': '#C29546',
        'textPrimary': '#FCF3E1',
        'textSecondary': '#EBD094',
        'sealBg': '#D9B25F',
        'sealText': '#5C110D',
    },
    'earth': {
        'element': 'earth',
        'virtueLabel': '土德尚黃',
        'shortVirtue': '黃土德',
        'bgPrimary': '#C9932B',
        'bgSecondary': '#D8A33B',
        'borderOuter': '#4A300D',
        'borderInner': '#78521B',
        'textPrimary': '#231606',
        'textSecondary': '#4D320E',
        'sealBg': '#98231B',
        'sealText': '#FBF2E0',
    },
}

COUNTRY_VIRTUE_BY_LABEL = {
    '秦': 'water', '北魏': 'water', '北周': 'water', '後趙': 'water',
    '遼': 'water', '清': 'water', '後金·清': 'water',

    '西漢': 'fire', '東漢': 'fire', '蜀漢': 'fire', '漢趙': 'fire',
    '南朝宋': 'fire', '南朝梁': 'fire', '隋': 'fire', '南唐': 'fire',
    '北宋': 'fire', '南宋': 'fire', '明': 'fire',

    '曹魏': 'earth', '東吳': 'earth', '唐': 'earth', '武周': 'earth',
    '後唐': 'earth', '西夏': 'earth', '元': 'earth', '大蒙古國·元': 'earth',
    '國號待補': 'earth',

    '前秦': 'wood', '前燕': 'wood', '後燕': 'wood', '南燕': 'wood',
    '北齊': 'wood', '東魏·北齊': 'wood', '南朝齊': 'wood', '後周': 'wood',
    '吳越': 'wood',

    '西晉': 'metal', '東晉': 'metal', '南朝陳': 'metal', '金': 'metal',
    '後秦': 'metal', '成漢': 'metal', '前蜀': 'metal', '南吳': 'metal',
    '閩': 'metal',
}


def render_flag_image(label: str, theme: dict) -> Image.Image:
    width, height = 560, 720
    image = Image.new('RGB', (width, height), theme['bgPrimary'])
    draw = ImageDraw.Draw(image)

    # Inner banner field
    draw.rectangle((42, 48, 517, 672), fill=theme['bgSecondary'])

    # War-flag serrated triangles (牙旗齿边) along left and right edges
    tooth_count = 11
    tooth_step = (672 - 48) / tooth_count
    for i in range(tooth_count):
        y0 = 48 + i * tooth_step
        ym = y0 + tooth_step / 2
        y1 = y0 + tooth_step
        # Left serrated tooth
        draw.polygon([(20, y0), (42, ym), (20, y1)], fill=theme['borderOuter'])
        # Right serrated tooth
        draw.polygon([(539, y0), (517, ym), (539, y1)], fill=theme['borderOuter'])

    # Outer and inner banner borders
    draw.rectangle((20, 32, 539, 688), outline=theme['borderOuter'], width=5)
    draw.rectangle((42, 48, 517, 672), outline=theme['borderInner'], width=2)

    # Top flagpole crossbar (旌旗横梁)
    draw.rectangle((12, 18, 547, 32), fill=theme['borderOuter'])
    draw.ellipse((6, 14, 26, 36), fill=theme['borderOuter'])
    draw.ellipse((533, 14, 553, 36), fill=theme['borderOuter'])

    # Corner classical fretwork (四角回纹装饰)
    corners = [(52, 58, 1, 1), (507, 58, -1, 1), (52, 662, 1, -1), (507, 662, -1, -1)]
    for cx, cy, dx, dy in corners:
        draw.line([(cx, cy), (cx + 28 * dx, cy), (cx + 28 * dx, cy + 16 * dy)], fill=theme['borderOuter'], width=3)
        draw.line([(cx, cy), (cx, cy + 28 * dy), (cx + 16 * dx, cy + 28 * dy)], fill=theme['borderOuter'], width=3)

    # Central octagonal / circular imperial medallion (中心规矩团窠纹)
    cx, cy, r_outer, r_inner = 280, 348, 174, 162
    draw.ellipse((cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer), outline=theme['borderOuter'], width=3)
    draw.ellipse((cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner), outline=theme['borderInner'], width=2)

    # 8 cardinal tick marks on the medallion ring
    for deg in range(0, 360, 45):
        rad = math.radians(deg)
        x1 = cx + math.cos(rad) * r_inner
        y1 = cy + math.sin(rad) * r_inner
        x2 = cx + math.cos(rad) * r_outer
        y2 = cy + math.sin(rad) * r_outer
        draw.line([(x1, y1), (x2, y2)], fill=theme['borderOuter'], width=2)

    # Top Virtue Banner (五德尚色横额 - 繁体隶书)
    virtue_font = ImageFont.truetype(str(font_path), 38)
    draw.text((280, 92), theme['virtueLabel'], font=virtue_font, fill=theme['textSecondary'], anchor='mm')
    draw.polygon([(142, 92), (152, 84), (162, 92), (152, 100)], fill=theme['borderOuter'])
    draw.polygon([(398, 92), (408, 84), (418, 92), (408, 100)], fill=theme['borderOuter'])
    draw.line([(96, 124), (464, 124)], fill=theme['borderInner'], width=2)

    # Center State Name (繁体隶书国号大字)
    columns = label.split('·')
    for index, column in enumerate(columns):
        if len(columns) == 1:
            if len(column) == 1:
                size = 216
                line_height = size * 1.0
            elif len(column) == 2:
                size = 142
                line_height = size * 1.05
            elif len(column) == 3:
                size = 98
                line_height = size * 1.02
            else:
                size = 74
                line_height = size * 0.98
        else:
            if len(column) == 1:
                size = 128
                line_height = size * 1.0
            elif len(column) == 2:
                size = 108
                line_height = size * 1.02
            else:
                size = 72
                line_height = size * 0.96

        font = ImageFont.truetype(str(font_path), size)
        x = 280 if len(columns) == 1 else (342 if index == 0 else 216)
        start_y = 348 - (len(column) - 1) * line_height / 2
        for offset, character in enumerate(column):
            y = start_y + offset * line_height
            # Subtle relief shadow for legibility
            draw.text((x + 2, y + 2), character, font=font, fill=theme['borderInner'], anchor='mm')
            draw.text((x, y), character, font=font, fill=theme['textPrimary'], anchor='mm')

    # Bottom Seal Stamp (底部国号旌旗印章)
    seal_font = ImageFont.truetype(str(font_path), 34)
    draw.rectangle((196, 592, 364, 650), fill=theme['sealBg'], outline=theme['borderOuter'], width=3)
    draw.rectangle((202, 598, 358, 644), outline=theme['sealText'], width=1)
    draw.text((280, 621), '國號旌旗', font=seal_font, fill=theme['sealText'], anchor='mm')

    return image


cards = []
label_to_image = {}

for label in sorted(set(labels.values()) | {'國號待補'}):
    virtue_key = COUNTRY_VIRTUE_BY_LABEL.get(label, 'earth')
    theme = VIRTUE_THEMES[virtue_key]
    image = render_flag_image(label, theme)
    label_to_image[label] = (image, theme)

    filename = 'country-' + '-'.join(f'{ord(char):x}' for char in label) + '.png'
    path = target / filename
    image.save(path, optimize=True)
    cards.append({
        'label': label,
        'virtue': theme['virtueLabel'],
        'shortVirtue': theme['shortVirtue'],
        'bgPrimary': theme['bgPrimary'],
        'file': filename,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
    })

(target / 'manifest.json').write_text(
    json.dumps({'kind': 'country-wordmark', 'cards': cards}, ensure_ascii=False, indent=2),
    encoding='utf-8',
)

# Also save human-readable named dynastic flag images to dist/朝代旗帜
dist_manifest = []
for dynasty_cn, label_trad in sorted(labels.items()):
    image, theme = label_to_image[label_trad]
    safe_dynasty = re.sub(r'[\\/:*?"<>|\s]+', '_', dynasty_cn)
    safe_label = re.sub(r'[\\/:*?"<>|\s]+', '_', label_trad)
    human_filename = f"{safe_dynasty}_{safe_label}_{theme['virtueLabel']}.png"
    out_path = dist_flags / human_filename
    image.save(out_path, optimize=True)
    dist_manifest.append({
        'dynasty': dynasty_cn,
        'traditionalLabel': label_trad,
        'virtue': theme['virtueLabel'],
        'shortVirtue': theme['shortVirtue'],
        'backgroundColor': theme['bgPrimary'],
        'textColor': theme['textPrimary'],
        'font': '繁体隶书 (LiSu / SIMLI)',
        'filename': human_filename,
    })

(dist_flags / '朝代五德旗帜清单.json').write_text(
    json.dumps({
        'title': '中国历代王朝五德终始代表色（白金、青木、黑水、赤火、黄土）繁体隶书国号旗帜清单',
        'count': len(dist_manifest),
        'items': dist_manifest,
    }, ensure_ascii=False, indent=2),
    encoding='utf-8',
)

print(f'Rendered {len(cards)} country-card flags and {len(dist_manifest)} named dynastic flags in Traditional Clerical Script.')
