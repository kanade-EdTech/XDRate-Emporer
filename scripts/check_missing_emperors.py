import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('assets/emperor/source/皇帝清单.json', 'r', encoding='utf-8') as f:
    ranked = json.load(f)

ranked_names = {x['name']: x for x in ranked}

# Let's check common emperors in Chinese history
candidates = [
    ('刘彻', '汉武帝'),
    ('刘恒', '汉文帝'),
    ('武则天', '武周则天文字圣帝/武曌'),
    ('铁木真', '成吉思汗/元太祖'),
    ('皇太极', '清太宗/爱新觉罗·皇太极'),
    ('努尔哈赤', '清太祖/爱新觉罗·努尔哈赤'),
    ('李渊', '唐高祖'),
    ('完颜阿骨打', '金太祖'),
    ('完颜雍', '金世宗/小尧舜'),
    ('耶律大石', '西辽德宗'),
    ('司马昭', '晋文帝'),
    ('刘备', '蜀汉昭烈帝'),
    ('孙权', '东吴大帝'),
    ('曹丕', '魏文帝'),
    ('刘裕', '宋武帝'),
    ('萧道成', '齐高帝'),
    ('萧衍', '梁武帝'),
    ('陈霸先', '陈武帝'),
    ('拓跋宏', '北魏孝文帝'),
    ('宇文邕', '北周武帝'),
    ('李世民', '唐太宗'),
    ('朱元璋', '明太祖'),
    ('刘邦', '汉高祖'),
    ('刘秀', '汉光武帝'),
    ('朱棣', '明成祖'),
    ('赵匡胤', '宋太祖'),
    ('赵光义', '宋太宗'),
    ('康熙', '清圣祖'),
    ('乾隆', '清高宗'),
    ('忽必烈', '元世祖'),
    ('刘病已', '汉宣帝'),
    ('刘庄', '汉明帝'),
]

for name, title in candidates:
    match = ranked_names.get(name)
    if not match:
        # try search partial
        partials = [x for x in ranked if name in x['name'] or name in x.get('title', '')]
        if partials:
            print(f"PARTIAL: {name} ({title}) -> {partials[0]['rank']} {partials[0]['name']}")
        else:
            print(f"MISSING: {name} ({title})")
    else:
        print(f"RANKED: #{match['rank']} {name} ({title})")
