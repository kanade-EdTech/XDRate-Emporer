import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SUPP_PATH = os.path.join(ROOT_DIR, 'assets', 'emperor', 'source', '补充皇帝清单.json')

with open(SUPP_PATH, 'r', encoding='utf-8') as f:
    supp_list = json.load(f)

existing_names = set(x['name'] for x in supp_list)

new_additions = [
    {
        "name": "刘彻",
        "temple_name": "汉武帝",
        "dynasty": "西汉",
        "reign": "建元/元光/元朔/元狩/元鼎/元封/太初/天汉/太始/征和/后元",
        "filename": "刘彻.jpg",
        "aliases": ["汉武帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "刘恒",
        "temple_name": "汉文帝",
        "dynasty": "西汉",
        "reign": "前元/后元",
        "filename": "刘恒.jpg",
        "aliases": ["汉文帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "赵祯",
        "temple_name": "宋仁宗",
        "dynasty": "北宋",
        "reign": "天圣/明道/景祐/宝元/康定/庆历/皇祐/至和/嘉祐",
        "filename": "赵祯.jpg",
        "aliases": ["宋仁宗.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "皇太极",
        "temple_name": "清太宗",
        "dynasty": "清朝",
        "reign": "天聪/崇德",
        "filename": "皇太极.jpg",
        "aliases": ["爱新觉罗·皇太极.jpg", "清太宗.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "铁木真",
        "temple_name": "元太祖",
        "dynasty": "大蒙古国 / 元朝",
        "reign": "成吉思汗",
        "filename": "铁木真.jpg",
        "aliases": ["孛儿只斤·铁木真.jpg", "成吉思汗.jpg", "元太祖.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "完颜阿骨打",
        "temple_name": "金太祖",
        "dynasty": "金朝",
        "reign": "收国/天辅",
        "filename": "完颜阿骨打.jpg",
        "aliases": ["金太祖.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "完颜雍",
        "temple_name": "金世宗",
        "dynasty": "金朝",
        "reign": "大定",
        "filename": "完颜雍.jpg",
        "aliases": ["金世宗.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "耶律阿保机",
        "temple_name": "辽太祖",
        "dynasty": "辽朝",
        "reign": "神册/天赞/天显",
        "filename": "耶律阿保机.jpg",
        "aliases": ["辽太祖.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "刘裕",
        "temple_name": "宋武帝",
        "dynasty": "南朝宋",
        "reign": "永初",
        "filename": "刘裕.jpg",
        "aliases": ["宋武帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "宇文邕",
        "temple_name": "北周武帝",
        "dynasty": "北周",
        "reign": "保定/天和/建德/宣政",
        "filename": "宇文邕.jpg",
        "aliases": ["北周武帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "拓跋宏",
        "temple_name": "北魏孝文帝",
        "dynasty": "北魏",
        "reign": "延兴/承明/太和",
        "filename": "拓跋宏.jpg",
        "aliases": ["元宏.jpg", "北魏孝文帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "刘肇",
        "temple_name": "汉和帝",
        "dynasty": "东汉",
        "reign": "永元/元兴",
        "filename": "刘肇.jpg",
        "aliases": ["汉和帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    },
    {
        "name": "司马懿",
        "temple_name": "晋宣帝",
        "dynasty": "西晋（追尊）",
        "reign": "嘉平",
        "filename": "司马懿.jpg",
        "aliases": ["晋高祖.jpg", "晋宣帝.jpg"],
        "status": "前25名候选（百帝258待发布）"
    }
]

added = 0
for item in new_additions:
    if item['name'] not in existing_names:
        supp_list.append(item)
        existing_names.add(item['name'])
        added += 1

with open(SUPP_PATH, 'w', encoding='utf-8') as f:
    json.dump(supp_list, f, ensure_ascii=False, indent=2)

print(f"成功更新补充皇帝清单: 原有 12 位，新增 {added} 位，总计 {len(supp_list)} 位头部核心帝王")
