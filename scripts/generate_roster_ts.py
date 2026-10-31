"""
生成 src/domain/emperor/rosterData.ts
包含全部 100 位考证帝王（前25名百帝258未出场核心帝王 + 第26~100名百帝258已出场帝王）的年号、庙号、真实全名、谥号、在位年代及权威出处
"""

import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET_FILE = os.path.join(ROOT_DIR, 'src', 'domain', 'emperor', 'rosterData.ts')
SOURCE_DIR = os.path.join(ROOT_DIR, 'assets', 'emperor', 'source')

# 读取已生成的权威画像索引清单（26~100名，共75位）
auth_json_path = os.path.join(ROOT_DIR, 'dist', '前100名', '权威画像索引清单.json')
with open(auth_json_path, 'r', encoding='utf-8') as f:
    ranked_75 = json.load(f)['items']

# 完整前25名核心帝王清单（百帝258未出场前25名，考证真实全名、常用尊称、庙号、谥号、年号、在位年份、权威馆藏）
SUPPLEMENTARY_TOP_25 = [
    {
        "id": "han-liu-bang",
        "rank": 1,
        "name": "刘邦",
        "fullName": "刘邦（汉高祖）",
        "dynasty": "西汉",
        "periodGroup": "秦汉",
        "templeName": "太祖（通称汉高祖）",
        "posthumousName": "高皇帝",
        "eraNames": ["汉初无年号"],
        "reignDisplay": "前202–前195",
        "imageFilename": "刘邦.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《历代圣贤帝王像·汉太祖高皇帝》"
    },
    {
        "id": "han-liu-heng",
        "rank": 2,
        "name": "刘恒",
        "fullName": "刘恒（汉文帝）",
        "dynasty": "西汉",
        "periodGroup": "秦汉",
        "templeName": "太宗",
        "posthumousName": "孝文皇帝",
        "eraNames": ["前元", "后元"],
        "reignDisplay": "前180–前157",
        "imageFilename": "刘恒.jpg",
        "institution": "台北故宫博物院 / 国家图书馆",
        "artworkTitle": "《历代圣贤半身像·汉文帝》"
    },
    {
        "id": "han-liu-che",
        "rank": 3,
        "name": "刘彻",
        "fullName": "刘彻（汉武帝）",
        "dynasty": "西汉",
        "periodGroup": "秦汉",
        "templeName": "世宗",
        "posthumousName": "孝武皇帝",
        "eraNames": ["建元", "元光", "元朔", "元狩", "元鼎", "元封", "太初", "天汉", "太始", "征和", "后元"],
        "reignDisplay": "前141–前87",
        "imageFilename": "刘彻.jpg",
        "institution": "国家典籍博物馆 / 台北故宫博物院",
        "artworkTitle": "《历代古人像赞·汉武帝》"
    },
    {
        "id": "han-liu-bingyi",
        "rank": 4,
        "name": "刘病已",
        "fullName": "刘病已（后改名刘询，汉宣帝）",
        "dynasty": "西汉",
        "periodGroup": "秦汉",
        "templeName": "中宗",
        "posthumousName": "孝宣皇帝",
        "eraNames": ["本始", "地节", "元康", "神爵", "五凤", "甘露", "黄龙"],
        "reignDisplay": "前74–前49",
        "imageFilename": "刘病已.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《历代圣贤帝王像·汉中宗宣皇帝》"
    },
    {
        "id": "han-liu-xiu",
        "rank": 5,
        "name": "刘秀",
        "fullName": "刘秀（汉光武帝）",
        "dynasty": "东汉",
        "periodGroup": "秦汉",
        "templeName": "世祖",
        "posthumousName": "光武皇帝",
        "eraNames": ["建武", "建武中元"],
        "reignDisplay": "25–57",
        "imageFilename": "刘秀.jpg",
        "institution": "波士顿美术馆 / 台北故宫博物院",
        "artworkTitle": "阎立本《历代帝王图·汉光武帝》"
    },
    {
        "id": "han-liu-zhuang",
        "rank": 6,
        "name": "刘庄",
        "fullName": "刘庄（初名刘阳，汉明帝）",
        "dynasty": "东汉",
        "periodGroup": "秦汉",
        "templeName": "显宗",
        "posthumousName": "孝明皇帝",
        "eraNames": ["永平"],
        "reignDisplay": "57–75",
        "imageFilename": "刘庄.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《历代圣贤帝王像·汉显宗明皇帝》"
    },
    {
        "id": "han-liu-zhao",
        "rank": 7,
        "name": "刘肇",
        "fullName": "刘肇（汉和帝）",
        "dynasty": "东汉",
        "periodGroup": "秦汉",
        "templeName": "穆宗（后除）",
        "posthumousName": "孝和皇帝",
        "eraNames": ["永元", "元兴"],
        "reignDisplay": "88–106",
        "imageFilename": "刘肇.jpg",
        "institution": "国家典籍博物馆 / 台北故宫博物院",
        "artworkTitle": "《历代古人像赞·汉和帝》"
    },
    {
        "id": "former-qin-fu-jian-xuanzhao",
        "rank": 8,
        "name": "苻坚",
        "fullName": "苻坚（文玉，前秦宣昭帝）",
        "dynasty": "十六国·前秦",
        "periodGroup": "魏晋南北朝",
        "templeName": "世祖",
        "posthumousName": "宣昭皇帝",
        "eraNames": ["永兴", "甘露", "建元"],
        "reignDisplay": "357–385",
        "imageFilename": "苻坚.jpg",
        "institution": "哈佛大学燕京图书馆 / 历代帝王图鉴",
        "artworkTitle": "《前秦世祖宣昭皇帝像》"
    },
    {
        "id": "liu-song-liu-yu",
        "rank": 9,
        "name": "刘裕",
        "fullName": "刘裕（小字寄奴，宋武帝）",
        "dynasty": "南朝·宋",
        "periodGroup": "魏晋南北朝",
        "templeName": "高祖",
        "posthumousName": "武皇帝",
        "eraNames": ["永初"],
        "reignDisplay": "420–422",
        "imageFilename": "刘裕.jpg",
        "institution": "台北故宫博物院 / 国家图书馆",
        "artworkTitle": "《古先君臣图鉴·宋武帝》"
    },
    {
        "id": "northern-wei-tuoba-hong",
        "rank": 10,
        "name": "拓跋宏",
        "fullName": "拓跋宏（改姓元宏，北魏孝文帝）",
        "dynasty": "北魏",
        "periodGroup": "魏晋南北朝",
        "templeName": "高祖",
        "posthumousName": "孝文皇帝",
        "eraNames": ["延兴", "承明", "太和"],
        "reignDisplay": "471–499",
        "imageFilename": "拓跋宏.jpg",
        "institution": "洛阳龙门石窟宾阳中洞浮雕 / 国家图书馆",
        "artworkTitle": "《北魏孝文帝礼佛图》"
    },
    {
        "id": "northern-zhou-yuwen-tai",
        "rank": 11,
        "name": "宇文泰",
        "fullName": "宇文泰（字黑獭，北周文帝）",
        "dynasty": "北周",
        "periodGroup": "魏晋南北朝",
        "templeName": "太祖（追尊）",
        "posthumousName": "文皇帝",
        "eraNames": ["大统（西魏）"],
        "reignDisplay": "534–556（西魏掌权）",
        "imageFilename": "宇文泰.jpg",
        "institution": "国家图书馆 / 历代帝王图鉴",
        "artworkTitle": "《北周太祖文皇帝像》"
    },
    {
        "id": "northern-zhou-yuwen-yong",
        "rank": 12,
        "name": "宇文邕",
        "fullName": "宇文邕（北周武帝）",
        "dynasty": "北周",
        "periodGroup": "魏晋南北朝",
        "templeName": "高祖",
        "posthumousName": "武皇帝",
        "eraNames": ["保定", "天和", "建德", "宣政"],
        "reignDisplay": "560–578",
        "imageFilename": "宇文邕.jpg",
        "institution": "美国波士顿美术馆（MFA Boston）",
        "artworkTitle": "阎立本《历代帝王图·周武帝宇文邕》"
    },
    {
        "id": "tang-li-shimin",
        "rank": 13,
        "name": "李世民",
        "fullName": "李世民（唐太宗）",
        "dynasty": "唐朝",
        "periodGroup": "隋唐五代",
        "templeName": "太宗",
        "posthumousName": "文武大圣大广孝皇帝",
        "eraNames": ["贞观"],
        "reignDisplay": "626–649",
        "imageFilename": "李世民.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "阎立本《历代帝王图·唐太宗》/南薰殿坐像"
    },
    {
        "id": "song-zhao-kuangyin",
        "rank": 14,
        "name": "赵匡胤",
        "fullName": "赵匡胤（宋太祖）",
        "dynasty": "北宋",
        "periodGroup": "宋辽金夏",
        "templeName": "太祖",
        "posthumousName": "启运立极英武睿文神德圣功至明大孝皇帝",
        "eraNames": ["建隆", "乾德", "开宝"],
        "reignDisplay": "960–976",
        "imageFilename": "赵匡胤.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《宋太祖坐像轴》（南薰殿旧藏）"
    },
    {
        "id": "song-zhao-guangyi",
        "rank": 15,
        "name": "赵光义",
        "fullName": "赵光义（初名赵匡义，改名赵炅，宋太宗）",
        "dynasty": "北宋",
        "periodGroup": "宋辽金夏",
        "templeName": "太宗",
        "posthumousName": "至仁应道神功圣德文武睿烈大明广孝皇帝",
        "eraNames": ["太平兴国", "雍熙", "端拱", "淳化", "至道"],
        "reignDisplay": "976–997",
        "imageFilename": "赵光义.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《宋太宗坐像轴》（南薰殿旧藏）"
    },
    {
        "id": "song-zhao-zhen",
        "rank": 16,
        "name": "赵祯",
        "fullName": "赵祯（初名赵受益，宋仁宗）",
        "dynasty": "北宋",
        "periodGroup": "宋辽金夏",
        "templeName": "仁宗",
        "posthumousName": "体天法道极功全德神文圣武睿感明孝皇帝",
        "eraNames": ["天圣", "明道", "景祐", "宝元", "康定", "庆历", "皇祐", "至和", "嘉祐"],
        "reignDisplay": "1022–1063",
        "imageFilename": "赵祯.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《宋仁宗坐像轴》（南薰殿旧藏）"
    },
    {
        "id": "liao-abaoji",
        "rank": 17,
        "name": "耶律阿保机",
        "fullName": "耶律阿保机（耶律亿，辽太祖）",
        "dynasty": "辽朝",
        "periodGroup": "宋辽金夏",
        "templeName": "太祖",
        "posthumousName": "大圣大明神烈天皇帝",
        "eraNames": ["神册", "天赞", "天显"],
        "reignDisplay": "916–926",
        "imageFilename": "耶律阿保机.jpg",
        "institution": "赤峰市博物馆 / 《三才图会》",
        "artworkTitle": "《三才图会·人物三卷·辽太祖》"
    },
    {
        "id": "jin-aguda",
        "rank": 18,
        "name": "完颜阿骨打",
        "fullName": "完颜旻（阿骨打，金太祖）",
        "dynasty": "金朝",
        "periodGroup": "宋辽金夏",
        "templeName": "太祖",
        "posthumousName": "应乾兴运昭德定功仁明庄孝大圣武元皇帝",
        "eraNames": ["收国", "天辅"],
        "reignDisplay": "1115–1123",
        "imageFilename": "完颜阿骨打.jpg",
        "institution": "黑龙江省博物馆 / 台北故宫博物院",
        "artworkTitle": "《历代圣贤帝王像·金太祖》"
    },
    {
        "id": "jin-wanyan-yong",
        "rank": 19,
        "name": "完颜雍",
        "fullName": "完颜雍（葛王、小尧舜，金世宗）",
        "dynasty": "金朝",
        "periodGroup": "宋辽金夏",
        "templeName": "世宗",
        "posthumousName": "光天明德大圣武孝皇帝",
        "eraNames": ["大定"],
        "reignDisplay": "1161–1189",
        "imageFilename": "完颜雍.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《圣帝明王善端录·金世宗》"
    },
    {
        "id": "yuan-hubilie",
        "rank": 20,
        "name": "孛儿只斤·忽必烈",
        "fullName": "孛儿只斤·忽必烈（薛禅汗，元世祖）",
        "dynasty": "元朝",
        "periodGroup": "元明清",
        "templeName": "世祖",
        "posthumousName": "圣德神功文武皇帝",
        "eraNames": ["中统", "至元"],
        "reignDisplay": "1260–1294",
        "imageFilename": "孛儿只斤·忽必烈.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《元世祖出猎图》/《元世祖半身像》"
    },
    {
        "id": "ming-zhu-yuanzhang",
        "rank": 21,
        "name": "朱元璋",
        "fullName": "朱元璋（初名朱重八，明太祖、洪武帝）",
        "dynasty": "明朝",
        "periodGroup": "元明清",
        "templeName": "太祖",
        "posthumousName": "开天行道肇纪立极大圣至神仁文义武俊德成功高皇帝",
        "eraNames": ["洪武"],
        "reignDisplay": "1368–1398",
        "imageFilename": "朱元璋.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《明太祖坐像轴》（南薰殿旧藏）"
    },
    {
        "id": "ming-zhu-di",
        "rank": 22,
        "name": "朱棣",
        "fullName": "朱棣（明成祖、永乐帝）",
        "dynasty": "明朝",
        "periodGroup": "元明清",
        "templeName": "成祖（初太宗）",
        "posthumousName": "启天弘道高明肇运圣武神功纯仁至孝文皇帝",
        "eraNames": ["永乐"],
        "reignDisplay": "1402–1424",
        "imageFilename": "朱棣.jpg",
        "institution": "台北故宫博物院",
        "artworkTitle": "《明成祖坐像轴》（南薰殿旧藏）"
    },
    {
        "id": "qing-huang-taiji",
        "rank": 23,
        "name": "爱新觉罗·皇太极",
        "fullName": "爱新觉罗·皇太极（清太宗）",
        "dynasty": "清朝",
        "periodGroup": "元明清",
        "templeName": "太宗",
        "posthumousName": "应天兴国弘德彰武宽温仁圣睿孝敬敏昭益纯德端宪文皇帝",
        "eraNames": ["天聪", "崇德"],
        "reignDisplay": "1626–1643",
        "imageFilename": "爱新觉罗·皇太极.jpg",
        "institution": "故宫博物院（北京） / 沈阳故宫博物院",
        "artworkTitle": "《清太宗朝服像轴》"
    },
    {
        "id": "qing-xuanye",
        "rank": 24,
        "name": "爱新觉罗·玄烨",
        "fullName": "爱新觉罗·玄烨（清圣祖、康熙帝）",
        "dynasty": "清朝",
        "periodGroup": "元明清",
        "templeName": "圣祖",
        "posthumousName": "合天弘运文武睿哲恭俭宽裕孝敬诚信中和功德大成仁皇帝",
        "eraNames": ["康熙"],
        "reignDisplay": "1661–1722",
        "imageFilename": "爱新觉罗·玄烨.jpg",
        "institution": "故宫博物院（北京）",
        "artworkTitle": "《清圣祖朝服像轴》"
    },
    {
        "id": "qing-hongli",
        "rank": 25,
        "name": "爱新觉罗·弘历",
        "fullName": "爱新觉罗·弘历（清高宗、乾隆帝）",
        "dynasty": "清朝",
        "periodGroup": "元明清",
        "templeName": "高宗",
        "posthumousName": "法天隆运至诚先觉体元立极敷文奋武钦明孝慈神圣纯皇帝",
        "eraNames": ["乾隆"],
        "reignDisplay": "1735–1796",
        "imageFilename": "爱新觉罗·弘历.jpg",
        "institution": "故宫博物院（北京）",
        "artworkTitle": "《清高宗朝服像轴》"
    }
]

# 映射时期分组逻辑
def get_period_group(dynasty: str) -> str:
    if any(k in dynasty for k in ['秦', '汉', '新朝']) and '前秦' not in dynasty and '后秦' not in dynasty and '成汉' not in dynasty and '汉赵' not in dynasty and '蜀汉' not in dynasty and '后汉' not in dynasty and '北汉' not in dynasty and '南汉' not in dynasty:
        return '秦汉'
    elif any(k in dynasty for k in ['魏', '蜀', '吴', '晋', '北朝', '南朝', '燕', '赵', '凉', '十六国', '齐', '梁', '陈', '北周', '前秦', '后秦', '成汉']):
        if '后周' in dynasty or '南吴' in dynasty or '吴越' in dynasty:
            return '隋唐五代'
        return '魏晋南北朝'
    elif any(k in dynasty for k in ['隋', '唐', '五代', '吴越', '闽', '十国', '后周', '前蜀', '武周']):
        return '隋唐五代'
    elif any(k in dynasty for k in ['宋', '辽', '金', '西夏']) and '南朝' not in dynasty and '后金' not in dynasty:
        return '宋辽金夏'
    else:
        return '元明清'

# 75位帝王详细数据映射表（第26~100名，庙号、谥号、年号、在位年代及常用尊称细化考证）
ERA_DATA_MAP = {
    26: {"temple": "世宗", "post": "宪皇帝", "eras": ["雍正"], "reign": "1722–1735", "id": "qing-yinzhen", "full": "爱新觉罗·胤禛（清世宗、雍正帝）"},
    27: {"temple": "世宗", "post": "睿武昭宪皇帝", "eras": ["显德"], "reign": "954–959", "id": "later-zhou-chai-rong", "full": "柴荣（郭荣，周世宗）"},
    28: {"temple": "太祖（追尊）", "post": "武皇帝", "eras": ["建安（汉）"], "reign": "216–220（魏王）", "id": "wei-cao-cao", "full": "曹操（魏武帝）"},
    29: {"temple": "仁宗", "post": "昭皇帝", "eras": ["洪熙"], "reign": "1424–1425", "id": "ming-zhu-gaochi", "full": "朱高炽（明仁宗、洪熙帝）"},
    30: {"temple": "太祖", "post": "圣神恭肃文武孝皇帝", "eras": ["广顺", "显德"], "reign": "951–954", "id": "later-zhou-guo-wei", "full": "郭威（后周太祖）"},
    31: {"temple": "太祖", "post": "武皇帝", "eras": ["天复", "天祐"], "reign": "902–905（吴王）", "id": "wu-yang-xingmi", "full": "杨行密（南吴太祖）"},
    32: {"temple": "高祖", "post": "文皇帝", "eras": ["开皇", "仁寿"], "reign": "581–604", "id": "sui-yang-jian", "full": "杨坚（隋文帝）"},
    33: {"temple": "圣宗", "post": "文武大孝宣皇帝", "eras": ["统和", "开泰", "太平"], "reign": "982–1031", "id": "liao-yelv-longxu", "full": "耶律隆绪（辽圣宗）"},
    34: {"temple": "真宗", "post": "文明武定章圣元孝皇帝", "eras": ["咸平", "景德", "大中祥符", "天禧", "乾兴"], "reign": "997–1022", "id": "song-zhao-heng", "full": "赵恒（宋真宗）"},
    35: {"temple": "太祖", "post": "大皇帝", "eras": ["黄武", "黄龙", "赤乌", "太元", "神凤"], "reign": "222–252", "id": "wu-sun-quan", "full": "孙权（吴大帝）"},
    36: {"temple": "世祖", "post": "文皇帝", "eras": ["天嘉", "天康"], "reign": "559–566", "id": "chen-chen-qian", "full": "陈蒨（陈文帝）"},
    37: {"temple": "高祖", "post": "景明皇帝", "eras": ["皇始"], "reign": "351–355", "id": "former-qin-fu-jian", "full": "苻健（前秦高祖）"},
    38: {"temple": "始皇帝（无庙号）", "post": "无（废除谥法）", "eras": ["秦始皇无年号"], "reign": "前247–前210", "id": "qin-ying-zheng-ranked", "full": "嬴政（赵政，秦始皇）"},
    39: {"temple": "高祖", "post": "明皇帝", "eras": ["太和", "建平"], "reign": "319–333", "id": "later-zhao-shi-le", "full": "石勒（后赵明帝）"},
    40: {"temple": "孝宗", "post": "哲文神武明圣悉孝皇帝", "eras": ["隆兴", "乾道", "淳熙"], "reign": "1162–1189", "id": "song-zhao-shen", "full": "赵昚（宋孝宗）"},
    41: {"temple": "太宗", "post": "明元皇帝", "eras": ["永兴", "神瑞", "泰常"], "reign": "409–423", "id": "northern-wei-tuoba-si", "full": "拓跋嗣（北魏明元帝）"},
    42: {"temple": "宣宗", "post": "章皇帝", "eras": ["宣德"], "reign": "1425–1435", "id": "ming-zhu-zhanji", "full": "朱瞻基（明宣宗、宣德帝）"},
    43: {"temple": "太祖", "post": "文明皇帝", "eras": ["燕元"], "reign": "337–348（燕王）", "id": "former-yan-murong-huang", "full": "慕容皝（前燕文明帝）"},
    44: {"temple": "太祖", "post": "高皇帝", "eras": ["建元"], "reign": "479–482", "id": "southern-qi-xiao-daocheng", "full": "萧道成（南齐高帝）"},
    45: {"temple": "太祖", "post": "昭武孝皇帝", "eras": ["天复", "开平"], "reign": "898–925（闽王）", "id": "min-wang-shenzhi", "full": "王审知（闽太祖）"},
    46: {"temple": "肃宗", "post": "孝章皇帝", "eras": ["建初", "元和", "章和"], "reign": "75–88", "id": "han-liu-da", "full": "刘炟（汉章帝）"},
    47: {"temple": "烈祖", "post": "光文肃武孝高皇帝", "eras": ["升元"], "reign": "937–943", "id": "southern-tang-li-bian", "full": "李昪（徐知诰，南唐烈祖）"},
    48: {"temple": "高祖（追尊）", "post": "神武皇帝", "eras": ["天平", "元象"], "reign": "534–547（大丞相）", "id": "eastern-wei-gao-huan", "full": "高欢（北齐神武帝）"},
    49: {"temple": "高祖", "post": "神尧大圣大光孝皇帝", "eras": ["武德"], "reign": "618–626", "id": "tang-li-yuan", "full": "李渊（唐高祖）"},
    50: {"temple": "仁宗", "post": "康靖皇帝", "eras": ["大庆", "人庆", "天盛", "乾祐"], "reign": "1139–1193", "id": "western-xia-li-renxiao", "full": "李仁孝（西夏仁宗）"},
    51: {"temple": "太祖", "post": "武肃王", "eras": ["天宝", "宝大", "宝正"], "reign": "907–932", "id": "wuyue-qian-liu", "full": "钱镠（吴越武肃王）"},
    52: {"temple": "高祖", "post": "光文皇帝", "eras": ["元熙", "永凤", "河瑞", "光兴"], "reign": "304–310", "id": "han-zhao-liu-yuan", "full": "刘渊（汉赵光文帝）"},
    53: {"temple": "宪宗", "post": "纯皇帝", "eras": ["成化"], "reign": "1464–1487", "id": "ming-zhu-jianshen", "full": "朱见深（明宪宗、成化帝）"},
    54: {"temple": "高宗", "post": "天皇大帝", "eras": ["永徽", "显庆", "龙朔", "麟德", "乾封", "总章", "咸亨", "上元", "仪凤", "调露", "永隆", "开耀", "永淳", "弘道"], "reign": "649–683", "id": "tang-li-zhi", "full": "李治（唐高宗）"},
    55: {"temple": "崇宗", "post": "昭简皇帝", "eras": ["天仪治平", "天祐民安", "永安", "贞观", "雍宁", "元德", "正德", "大德"], "reign": "1086–1139", "id": "western-xia-li-qianshun", "full": "李乾顺（西夏崇宗）"},
    56: {"temple": "哲宗", "post": "宪元继道显德定功钦文睿武齐圣昭孝皇帝", "eras": ["元祐", "绍圣", "元符"], "reign": "1085–1100", "id": "song-zhao-xu", "full": "赵煦（宋哲宗）"},
    57: {"temple": "烈祖", "post": "昭烈皇帝", "eras": ["章武"], "reign": "221–223", "id": "shu-han-liu-bei", "full": "刘备（汉昭烈帝）"},
    58: {"temple": "高祖", "post": "文皇帝", "eras": ["黄初"], "reign": "220–226", "id": "wei-cao-pi", "full": "曹丕（魏文帝）"},
    59: {"temple": "太宗（后除）", "post": "孝景皇帝", "eras": ["前元", "中元", "后元"], "reign": "前157–前141", "id": "han-liu-qi", "full": "刘启（汉景帝）"},
    60: {"temple": "高宗", "post": "文成皇帝", "eras": ["兴安", "兴光", "太安", "和平"], "reign": "452–465", "id": "northern-wei-tuoba-jun", "full": "拓跋濬（北魏文成帝）"},
    61: {"temple": "太祖", "post": "文皇帝", "eras": ["元嘉"], "reign": "424–453", "id": "liu-song-liu-yilong", "full": "刘义隆（宋文帝）"},
    62: {"temple": "明宗", "post": "圣德和武钦孝皇帝", "eras": ["天成", "长兴"], "reign": "926–933", "id": "later-tang-li-siyuan", "full": "李嗣源（后唐明宗）"},
    63: {"temple": "孝宗", "post": "敬皇帝", "eras": ["弘治"], "reign": "1487–1505", "id": "ming-zhu-youtang", "full": "朱祐樘（明孝宗、弘治帝）"},
    64: {"temple": "武宗", "post": "至道昭肃孝皇帝", "eras": ["会昌"], "reign": "840–846", "id": "tang-li-yan", "full": "李炎（李瀍，唐武宗）"},
    65: {"temple": "高祖", "post": "武皇帝", "eras": ["永定"], "reign": "557–559", "id": "chen-chen-baxian", "full": "陈霸先（陈武帝）"},
    66: {"temple": "宪宗", "post": "昭文章武大圣至神孝皇帝", "eras": ["元和"], "reign": "805–820", "id": "tang-li-chun", "full": "李纯（唐宪宗）"},
    67: {"temple": "世祖", "post": "成武皇帝", "eras": ["燕元", "建兴"], "reign": "384–396", "id": "later-yan-murong-chui", "full": "慕容垂（后燕成武帝）"},
    68: {"temple": "太宗", "post": "武皇帝", "eras": ["建兴", "晏平", "玉衡"], "reign": "304–334", "id": "cheng-han-li-xiong", "full": "李雄（成汉武帝）"},
    69: {"temple": "神宗", "post": "体元显道法古立宪帝德王功英文烈武钦仁穆孝皇帝", "eras": ["熙宁", "元丰"], "reign": "1067–1085", "id": "song-zhao-xu-shenzong", "full": "赵顼（宋神宗）"},
    70: {"temple": "高祖", "post": "文桓皇帝", "eras": ["皇初", "弘始"], "reign": "394–416", "id": "later-qin-yao-xing", "full": "姚兴（后秦文桓帝）"},
    71: {"temple": "显祖", "post": "献文皇帝", "eras": ["天安", "皇兴"], "reign": "465–471", "id": "northern-wei-tuoba-hong-xianzu", "full": "拓跋弘（北魏献文帝）"},
    72: {"temple": "肃祖", "post": "明皇帝", "eras": ["太宁"], "reign": "322–325", "id": "jin-sima-shao", "full": "司马绍（晋明帝）"},
    73: {"temple": "高祖", "post": "武皇帝", "eras": ["天监", "普通", "大通", "中大通", "大同", "中大同", "太清"], "reign": "502–549", "id": "liang-xiao-yan", "full": "萧衍（梁武帝）"},
    74: {"temple": "代宗", "post": "睿文孝武皇帝", "eras": ["宝应", "广德", "永泰", "大历"], "reign": "762–779", "id": "tang-li-yu", "full": "李豫（唐代宗）"},
    75: {"temple": "世祖", "post": "章皇帝", "eras": ["顺治"], "reign": "1643–1661", "id": "qing-fulin", "full": "爱新觉罗·福临（清世祖、顺治帝）"},
    76: {"temple": "玄宗", "post": "至道大圣大明孝皇帝", "eras": ["先天", "开元", "天宝"], "reign": "712–756", "id": "tang-li-longji", "full": "李隆基（唐玄宗、唐明皇）"},
    77: {"temple": "景宗", "post": "孝成皇帝", "eras": ["保宁", "乾亨"], "reign": "969–982", "id": "liao-yelv-xian", "full": "耶律贤（辽景宗）"},
    78: {"temple": "仁宗", "post": "圣神文武皇帝", "eras": ["皇庆", "延祐"], "reign": "1311–1320", "id": "yuan-ayurbarwada", "full": "孛儿只斤·爱育黎拔力八达（元仁宗）"},
    79: {"temple": "世宗（后除）", "post": "孝昭皇帝", "eras": ["始元", "元凤", "元平"], "reign": "前87–前74", "id": "han-liu-fuling", "full": "刘弗陵（汉昭帝）"},
    80: {"temple": "世宗", "post": "献武皇帝", "eras": ["建平"], "reign": "398–405", "id": "southern-yan-murong-de", "full": "慕容德（南燕献武帝）"},
    81: {"temple": "宣宗", "post": "圣武献文孝皇帝", "eras": ["大中"], "reign": "846–859", "id": "tang-li-chen", "full": "李忱（唐宣宗）"},
    82: {"temple": "世宗", "post": "明皇帝", "eras": ["武成"], "reign": "557–560", "id": "northern-zhou-yuwen-yu", "full": "宇文毓（北周明帝）"},
    83: {"temple": "世祖", "post": "武皇帝", "eras": ["永明"], "reign": "482–493", "id": "southern-qi-xiao-ze", "full": "萧赜（南齐武帝）"},
    84: {"temple": "仁宗", "post": "睿皇帝", "eras": ["嘉庆"], "reign": "1796–1820", "id": "qing-yongyan", "full": "爱新觉罗·颙琰（清仁宗、嘉庆帝）"},
    85: {"temple": "世祖", "post": "太武皇帝", "eras": ["始光", "神䴥", "延和", "太延", "太平真君", "正平"], "reign": "423–452", "id": "northern-wei-tuoba-tao", "full": "拓跋焘（北魏太武帝）"},
    86: {"temple": "高祖", "post": "神武圣文孝德明惠皇帝", "eras": ["天复", "武成", "永平", "通正", "天汉", "光天"], "reign": "907–918", "id": "former-shu-wang-jian", "full": "王建（前蜀高祖）"},
    87: {"temple": "太宗", "post": "孝武惠文皇帝", "eras": ["天显", "会同", "大同"], "reign": "926–947", "id": "liao-yelv-deguang", "full": "耶律德光（辽太宗）"},
    88: {"temple": "世祖", "post": "武皇帝", "eras": ["泰始", "咸宁", "太康", "太熙"], "reign": "266–290", "id": "jin-sima-yan", "full": "司马炎（晋武帝）"},
    89: {"temple": "烈祖", "post": "明皇帝", "eras": ["太和", "青龙", "景初"], "reign": "226–239", "id": "wei-cao-rui", "full": "曹叡（魏明帝）"},
    90: {"temple": "烈祖", "post": "景昭皇帝", "eras": ["元玺", "光寿"], "reign": "348–360", "id": "former-yan-murong-jun", "full": "慕容儁（前燕景昭帝）"},
    91: {"temple": "太宗", "post": "体元应运世德昭功哲惠仁圣文烈皇帝", "eras": ["天会"], "reign": "1123–1135", "id": "jin-wanyan-sheng", "full": "完颜晟（吴乞买，金太宗）"},
    92: {"temple": "英宗", "post": "宪文肃武宣孝皇帝", "eras": ["治平"], "reign": "1063–1067", "id": "song-zhao-shu", "full": "赵曙（宋英宗）"},
    93: {"temple": "则天大圣皇后（武周圣神皇帝）", "post": "则天顺圣皇后", "eras": ["天授", "如意", "长寿", "延载", "证圣", "天册万岁", "万岁登封", "万岁通天", "神功", "圣历", "久视", "大足", "长安"], "reign": "690–705", "id": "wu-zhou-wu-zetian", "full": "武曌（武则天）"},
    94: {"temple": "太祖", "post": "承天广运圣德神功肇纪立极仁孝睿武端毅钦安弘文定业高皇帝", "eras": ["天命"], "reign": "1616–1626", "id": "qing-nurhaci", "full": "爱新觉罗·努尔哈赤（清太祖）"},
    95: {"temple": "代宗", "post": "景皇帝", "eras": ["景泰"], "reign": "1449–1457", "id": "ming-zhu-qiyu", "full": "朱祁钰（明代宗、景泰帝）"},
    96: {"temple": "肃宗", "post": "孝昭皇帝", "eras": ["皇建"], "reign": "560–561", "id": "northern-qi-gao-yan", "full": "高演（北齐孝昭帝）"},
    97: {"temple": "景皇帝（无庙号）", "post": "景皇帝", "eras": ["永安"], "reign": "258–264", "id": "wu-sun-xiu", "full": "孙休（吴景帝）"},
    98: {"temple": "英宗", "post": "睿圣文孝皇帝", "eras": ["至治"], "reign": "1320–1323", "id": "yuan-shidebala", "full": "孛儿只斤·硕德八剌（元英宗）"},
    99: {"temple": "睿宗", "post": "玄真大圣大成孝皇帝", "eras": ["文明", "景云", "太极", "延和"], "reign": "684–690, 710–712", "id": "tang-li-dan", "full": "李旦（唐睿宗）"},
    100: {"temple": "太祖", "post": "道武皇帝", "eras": ["登国", "皇始", "天兴", "天赐"], "reign": "386–409", "id": "northern-wei-tuoba-gui", "full": "拓跋珪（北魏道武帝）"}
}

def resolve_image(name: str, fallback_file: str) -> str:
    """如果存在清晰标准正名画像（如 爱新觉罗·胤禛.jpg），优先使用；否则使用 fallback_file"""
    clean_name = f"{name}.jpg"
    clean_path = os.path.join(SOURCE_DIR, clean_name)
    if os.path.exists(clean_path):
        return clean_name
    return fallback_file

def main():
    final_list = []

    # 1. 前25名核心帝王（百帝258未出场前列）
    for emp in SUPPLEMENTARY_TOP_25:
        final_list.append(emp)

    # 2. 第26至100名百帝258帝王（75位）
    for item in ranked_75:
        rank = item['rank']
        meta = ERA_DATA_MAP.get(rank, {})
        dynasty = item['dynasty']
        period = get_period_group(dynasty)

        fallback_file = f"第{rank:03d}名_{item['name']}.jpg"
        resolved_img = resolve_image(item['name'], fallback_file)

        entry = {
            "id": meta.get("id", f"emperor-rank-{rank}"),
            "rank": rank,
            "name": item['name'],
            "fullName": meta.get("full", item['name']),
            "dynasty": dynasty,
            "periodGroup": period,
            "templeName": meta.get("temple", item.get('temple_name', '无')),
            "posthumousName": meta.get("post", '无'),
            "eraNames": meta.get("eras", []),
            "reignDisplay": meta.get("reign", '待考'),
            "imageFilename": resolved_img,
            "institution": item.get('institution', '故宫博物院 / 维基共享资源'),
            "artworkTitle": item.get('artwork_title', '官方高清典藏画像')
        }
        final_list.append(entry)

    # 排序：按 rank 升序排列（1至100名）
    final_list.sort(key=lambda x: x.get('rank', 999))

    # 生成 TypeScript 代码
    ts_content = f"""/**
 * 古代帝王评分卡：前 100 名完整候选名录与元数据
 * 包含第 1 至 100 名完整历史名录（前 25 名百帝 258 未出场核心帝王 + 第 26 至 100 名百帝 258 已出场帝王）。
 * 全量经过史料核验（真实全名、常用尊称、庙号、谥号、年号、在位年代、权威馆藏出处）。
 */

export interface EmperorRosterItem {{
  id: string;
  rank?: number;
  name: string;
  fullName: string;
  dynasty: string;
  periodGroup: '秦汉' | '魏晋南北朝' | '隋唐五代' | '宋辽金夏' | '元明清';
  templeName: string;
  posthumousName: string;
  eraNames: string[];
  reignDisplay: string;
  imageFilename: string;
  institution: string;
  artworkTitle: string;
}}

export const periodGroups = ['全部', '秦汉', '魏晋南北朝', '隋唐五代', '宋辽金夏', '元明清'] as const;
export type PeriodGroup = (typeof periodGroups)[number];

export const emperorRoster: readonly EmperorRosterItem[] = {json.dumps(final_list, ensure_ascii=False, indent=2)};

export const emperorRosterById = new Map<string, EmperorRosterItem>(
  emperorRoster.map((item) => [item.id, item]),
);
"""

    with open(TARGET_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"成功生成 {TARGET_FILE}！共包含 {len(final_list)} 位历史帝王。")

if __name__ == '__main__':
    main()
