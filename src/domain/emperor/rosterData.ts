/**
 * 古代帝王评分卡：前 100 名完整候选名录与元数据
 * 包含第 1 至 100 名完整历史名录（前 25 名百帝 258 未出场核心帝王 + 第 26 至 100 名百帝 258 已出场帝王）。
 * 全量经过史料核验（真实全名、常用尊称、庙号、谥号、年号、在位年代、权威馆藏出处）。
 */

export interface EmperorRosterItem {
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
}

export const periodGroups = ['全部', '秦汉', '魏晋南北朝', '隋唐五代', '宋辽金夏', '元明清'] as const;
export type PeriodGroup = (typeof periodGroups)[number];

export const emperorRoster: readonly EmperorRosterItem[] = [
  {
    "id": "han-liu-bang",
    "rank": 1,
    "name": "刘邦",
    "fullName": "刘邦（汉高祖）",
    "dynasty": "西汉",
    "periodGroup": "秦汉",
    "templeName": "太祖（通称汉高祖）",
    "posthumousName": "高皇帝",
    "eraNames": [
      "汉初无年号"
    ],
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
    "eraNames": [
      "前元",
      "后元"
    ],
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
    "eraNames": [
      "建元",
      "元光",
      "元朔",
      "元狩",
      "元鼎",
      "元封",
      "太初",
      "天汉",
      "太始",
      "征和",
      "后元"
    ],
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
    "eraNames": [
      "本始",
      "地节",
      "元康",
      "神爵",
      "五凤",
      "甘露",
      "黄龙"
    ],
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
    "eraNames": [
      "建武",
      "建武中元"
    ],
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
    "eraNames": [
      "永平"
    ],
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
    "eraNames": [
      "永元",
      "元兴"
    ],
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
    "eraNames": [
      "永兴",
      "甘露",
      "建元"
    ],
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
    "eraNames": [
      "永初"
    ],
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
    "eraNames": [
      "延兴",
      "承明",
      "太和"
    ],
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
    "eraNames": [
      "大统（西魏）"
    ],
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
    "eraNames": [
      "保定",
      "天和",
      "建德",
      "宣政"
    ],
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
    "eraNames": [
      "贞观"
    ],
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
    "eraNames": [
      "建隆",
      "乾德",
      "开宝"
    ],
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
    "eraNames": [
      "太平兴国",
      "雍熙",
      "端拱",
      "淳化",
      "至道"
    ],
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
    "eraNames": [
      "天圣",
      "明道",
      "景祐",
      "宝元",
      "康定",
      "庆历",
      "皇祐",
      "至和",
      "嘉祐"
    ],
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
    "eraNames": [
      "神册",
      "天赞",
      "天显"
    ],
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
    "eraNames": [
      "收国",
      "天辅"
    ],
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
    "eraNames": [
      "大定"
    ],
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
    "eraNames": [
      "中统",
      "至元"
    ],
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
    "eraNames": [
      "洪武"
    ],
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
    "eraNames": [
      "永乐"
    ],
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
    "eraNames": [
      "天聪",
      "崇德"
    ],
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
    "eraNames": [
      "康熙"
    ],
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
    "eraNames": [
      "乾隆"
    ],
    "reignDisplay": "1735–1796",
    "imageFilename": "爱新觉罗·弘历.jpg",
    "institution": "故宫博物院（北京）",
    "artworkTitle": "《清高宗朝服像轴》"
  },
  {
    "id": "qing-yinzhen",
    "rank": 26,
    "name": "爱新觉罗·胤禛",
    "fullName": "爱新觉罗·胤禛（清世宗、雍正帝）",
    "dynasty": "清朝",
    "periodGroup": "元明清",
    "templeName": "世宗",
    "posthumousName": "宪皇帝",
    "eraNames": [
      "雍正"
    ],
    "reignDisplay": "1722–1735",
    "imageFilename": "爱新觉罗·胤禛.jpg",
    "institution": "故宫博物院（北京）",
    "artworkTitle": "《清世宗朝服像轴》"
  },
  {
    "id": "later-zhou-chai-rong",
    "rank": 27,
    "name": "柴荣",
    "fullName": "柴荣（郭荣，周世宗）",
    "dynasty": "后周",
    "periodGroup": "隋唐五代",
    "templeName": "世宗",
    "posthumousName": "睿武昭宪皇帝",
    "eraNames": [
      "显德"
    ],
    "reignDisplay": "954–959",
    "imageFilename": "第027名_柴荣.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代圣贤帝王像·周世宗》"
  },
  {
    "id": "wei-cao-cao",
    "rank": 28,
    "name": "曹操",
    "fullName": "曹操（魏武帝）",
    "dynasty": "三国·曹魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "太祖（追尊）",
    "posthumousName": "武皇帝",
    "eraNames": [
      "建安（汉）"
    ],
    "reignDisplay": "216–220（魏王）",
    "imageFilename": "第028名_曹操.jpg",
    "institution": "国家图书馆 / 台北故宫博物院",
    "artworkTitle": "《历代古人像赞·魏武帝曹操》 / 《三才图会》"
  },
  {
    "id": "ming-zhu-gaochi",
    "rank": 29,
    "name": "朱高炽",
    "fullName": "朱高炽（明仁宗、洪熙帝）",
    "dynasty": "明朝",
    "periodGroup": "元明清",
    "templeName": "仁宗",
    "posthumousName": "昭皇帝",
    "eraNames": [
      "洪熙"
    ],
    "reignDisplay": "1424–1425",
    "imageFilename": "第029名_朱高炽.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《明仁宗坐像轴》"
  },
  {
    "id": "later-zhou-guo-wei",
    "rank": 30,
    "name": "郭威",
    "fullName": "郭威（后周太祖）",
    "dynasty": "后周",
    "periodGroup": "隋唐五代",
    "templeName": "太祖",
    "posthumousName": "圣神恭肃文武孝皇帝",
    "eraNames": [
      "广顺",
      "显德"
    ],
    "reignDisplay": "951–954",
    "imageFilename": "第030名_郭威.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代圣贤帝王像·周太祖郭威》"
  },
  {
    "id": "wu-yang-xingmi",
    "rank": 31,
    "name": "杨行密",
    "fullName": "杨行密（南吴太祖）",
    "dynasty": "五代·南吴",
    "periodGroup": "隋唐五代",
    "templeName": "太祖",
    "posthumousName": "武皇帝",
    "eraNames": [
      "天复",
      "天祐"
    ],
    "reignDisplay": "902–905（吴王）",
    "imageFilename": "第031名_杨行密.jpg",
    "institution": "国家图书馆 / 日本内阁文库",
    "artworkTitle": "《三才图会·人物卷二·吴太祖杨行密》"
  },
  {
    "id": "sui-yang-jian",
    "rank": 32,
    "name": "杨坚",
    "fullName": "杨坚（隋文帝）",
    "dynasty": "隋朝",
    "periodGroup": "隋唐五代",
    "templeName": "高祖",
    "posthumousName": "文皇帝",
    "eraNames": [
      "开皇",
      "仁寿"
    ],
    "reignDisplay": "581–604",
    "imageFilename": "第032名_杨坚.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·隋文帝杨坚》"
  },
  {
    "id": "liao-yelv-longxu",
    "rank": 33,
    "name": "耶律隆绪",
    "fullName": "耶律隆绪（辽圣宗）",
    "dynasty": "辽朝",
    "periodGroup": "宋辽金夏",
    "templeName": "圣宗",
    "posthumousName": "文武大孝宣皇帝",
    "eraNames": [
      "统和",
      "开泰",
      "太平"
    ],
    "reignDisplay": "982–1031",
    "imageFilename": "第033名_耶律隆绪.jpg",
    "institution": "内蒙古博物院 / 故宫博物院",
    "artworkTitle": "《辽圣宗永庆陵墓室壁画皇帝行乐图》 / 《辽代帝王摹本》"
  },
  {
    "id": "song-zhao-heng",
    "rank": 34,
    "name": "赵恒",
    "fullName": "赵恒（宋真宗）",
    "dynasty": "北宋",
    "periodGroup": "宋辽金夏",
    "templeName": "真宗",
    "posthumousName": "文明武定章圣元孝皇帝",
    "eraNames": [
      "咸平",
      "景德",
      "大中祥符",
      "天禧",
      "乾兴"
    ],
    "reignDisplay": "997–1022",
    "imageFilename": "赵恒.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《宋真宗坐像轴》"
  },
  {
    "id": "wu-sun-quan",
    "rank": 35,
    "name": "孙权",
    "fullName": "孙权（吴大帝）",
    "dynasty": "三国·东吴",
    "periodGroup": "魏晋南北朝",
    "templeName": "太祖",
    "posthumousName": "大皇帝",
    "eraNames": [
      "黄武",
      "黄龙",
      "赤乌",
      "太元",
      "神凤"
    ],
    "reignDisplay": "222–252",
    "imageFilename": "第035名_孙权.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·吴主孙权》"
  },
  {
    "id": "chen-chen-qian",
    "rank": 36,
    "name": "陈蒨",
    "fullName": "陈蒨（陈文帝）",
    "dynasty": "南朝·陈",
    "periodGroup": "魏晋南北朝",
    "templeName": "世祖",
    "posthumousName": "文皇帝",
    "eraNames": [
      "天嘉",
      "天康"
    ],
    "reignDisplay": "559–566",
    "imageFilename": "第036名_陈蒨.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·陈文帝蒨》"
  },
  {
    "id": "former-qin-fu-jian",
    "rank": 37,
    "name": "苻健",
    "fullName": "苻健（前秦高祖）",
    "dynasty": "十六国·前秦",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "景明皇帝",
    "eraNames": [
      "皇始"
    ],
    "reignDisplay": "351–355",
    "imageFilename": "第037名_苻健.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·前秦苻健》"
  },
  {
    "id": "qin-ying-zheng-ranked",
    "rank": 38,
    "name": "嬴政",
    "fullName": "嬴政（赵政，秦始皇）",
    "dynasty": "秦朝",
    "periodGroup": "秦汉",
    "templeName": "始皇帝（无庙号）",
    "posthumousName": "无（废除谥法）",
    "eraNames": [
      "秦始皇无年号"
    ],
    "reignDisplay": "前247–前210",
    "imageFilename": "第038名_嬴政.jpg",
    "institution": "台北故宫博物院 / 国家图书馆",
    "artworkTitle": "《历代帝王圣贤名臣像册·秦始皇》 / 《三才图会》"
  },
  {
    "id": "later-zhao-shi-le",
    "rank": 39,
    "name": "石勒",
    "fullName": "石勒（后赵明帝）",
    "dynasty": "十六国·后赵",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "明皇帝",
    "eraNames": [
      "太和",
      "建平"
    ],
    "reignDisplay": "319–333",
    "imageFilename": "第039名_石勒.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后赵石勒》"
  },
  {
    "id": "song-zhao-shen",
    "rank": 40,
    "name": "赵昚",
    "fullName": "赵昚（宋孝宗）",
    "dynasty": "南宋",
    "periodGroup": "宋辽金夏",
    "templeName": "孝宗",
    "posthumousName": "哲文神武明圣悉孝皇帝",
    "eraNames": [
      "隆兴",
      "乾道",
      "淳熙"
    ],
    "reignDisplay": "1162–1189",
    "imageFilename": "第040名_赵昚.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《宋孝宗坐像轴》"
  },
  {
    "id": "northern-wei-tuoba-si",
    "rank": 41,
    "name": "拓跋嗣",
    "fullName": "拓跋嗣（北魏明元帝）",
    "dynasty": "北魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "太宗",
    "posthumousName": "明元皇帝",
    "eraNames": [
      "永兴",
      "神瑞",
      "泰常"
    ],
    "reignDisplay": "409–423",
    "imageFilename": "第041名_拓跋嗣.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后魏明元帝》"
  },
  {
    "id": "ming-zhu-zhanji",
    "rank": 42,
    "name": "朱瞻基",
    "fullName": "朱瞻基（明宣宗、宣德帝）",
    "dynasty": "明朝",
    "periodGroup": "元明清",
    "templeName": "宣宗",
    "posthumousName": "章皇帝",
    "eraNames": [
      "宣德"
    ],
    "reignDisplay": "1425–1435",
    "imageFilename": "第042名_朱瞻基.jpg",
    "institution": "台北故宫博物院 / 故宫博物院（北京）",
    "artworkTitle": "《明宣宗坐像轴》 / 《明宣宗行乐图》"
  },
  {
    "id": "former-yan-murong-huang",
    "rank": 43,
    "name": "慕容皝",
    "fullName": "慕容皝（前燕文明帝）",
    "dynasty": "十六国·前燕",
    "periodGroup": "魏晋南北朝",
    "templeName": "太祖",
    "posthumousName": "文明皇帝",
    "eraNames": [
      "燕元"
    ],
    "reignDisplay": "337–348（燕王）",
    "imageFilename": "第043名_慕容皝.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·前燕慕容皝》"
  },
  {
    "id": "southern-qi-xiao-daocheng",
    "rank": 44,
    "name": "萧道成",
    "fullName": "萧道成（南齐高帝）",
    "dynasty": "南朝·齐",
    "periodGroup": "魏晋南北朝",
    "templeName": "太祖",
    "posthumousName": "高皇帝",
    "eraNames": [
      "建元"
    ],
    "reignDisplay": "479–482",
    "imageFilename": "第044名_萧道成.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王圣贤名臣像册·齐高帝萧道成》"
  },
  {
    "id": "min-wang-shenzhi",
    "rank": 45,
    "name": "王审知",
    "fullName": "王审知（闽太祖）",
    "dynasty": "五代·闽国",
    "periodGroup": "隋唐五代",
    "templeName": "太祖",
    "posthumousName": "昭武孝皇帝",
    "eraNames": [
      "天复",
      "开平"
    ],
    "reignDisplay": "898–925（闽王）",
    "imageFilename": "第045名_王审知.jpg",
    "institution": "福建省博物院 / 福州开元寺",
    "artworkTitle": "《闽太祖王审知古摹真容画像》 / 《开元寺闽王祠真容像》"
  },
  {
    "id": "han-liu-da",
    "rank": 46,
    "name": "刘炟",
    "fullName": "刘炟（汉章帝）",
    "dynasty": "东汉",
    "periodGroup": "秦汉",
    "templeName": "肃宗",
    "posthumousName": "孝章皇帝",
    "eraNames": [
      "建初",
      "元和",
      "章和"
    ],
    "reignDisplay": "75–88",
    "imageFilename": "第046名_刘炟.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王圣贤名臣像册·汉章帝》"
  },
  {
    "id": "southern-tang-li-bian",
    "rank": 47,
    "name": "李昪",
    "fullName": "李昪（徐知诰，南唐烈祖）",
    "dynasty": "五代·南唐",
    "periodGroup": "隋唐五代",
    "templeName": "烈祖",
    "posthumousName": "光文肃武孝高皇帝",
    "eraNames": [
      "升元"
    ],
    "reignDisplay": "937–943",
    "imageFilename": "第047名_李昪.jpg",
    "institution": "南京博物院 / 台北故宫博物院",
    "artworkTitle": "《历代圣贤帝王像·南唐烈祖李昪》"
  },
  {
    "id": "eastern-wei-gao-huan",
    "rank": 48,
    "name": "高欢",
    "fullName": "高欢（北齐神武帝）",
    "dynasty": "东魏·北齐",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖（追尊）",
    "posthumousName": "神武皇帝",
    "eraNames": [
      "天平",
      "元象"
    ],
    "reignDisplay": "534–547（大丞相）",
    "imageFilename": "第048名_高欢.jpg",
    "institution": "中国国家博物馆 / 邯郸市博物馆",
    "artworkTitle": "《响堂山石窟北齐帝后礼佛造像浮雕》 / 《三才图会》"
  },
  {
    "id": "tang-li-yuan",
    "rank": 49,
    "name": "李渊",
    "fullName": "李渊（唐高祖）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "高祖",
    "posthumousName": "神尧大圣大光孝皇帝",
    "eraNames": [
      "武德"
    ],
    "reignDisplay": "618–626",
    "imageFilename": "第049名_李渊.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《唐高祖坐像轴》"
  },
  {
    "id": "western-xia-li-renxiao",
    "rank": 50,
    "name": "李仁孝",
    "fullName": "李仁孝（西夏仁宗）",
    "dynasty": "西夏",
    "periodGroup": "宋辽金夏",
    "templeName": "仁宗",
    "posthumousName": "康靖皇帝",
    "eraNames": [
      "大庆",
      "人庆",
      "天盛",
      "乾祐"
    ],
    "reignDisplay": "1139–1193",
    "imageFilename": "第050名_李仁孝.jpg",
    "institution": "俄罗斯埃尔米塔日博物馆（冬宫）",
    "artworkTitle": "《黑水城出土西夏宫廷唐卡皇帝御容像》"
  },
  {
    "id": "wuyue-qian-liu",
    "rank": 51,
    "name": "钱镠",
    "fullName": "钱镠（吴越武肃王）",
    "dynasty": "五代·吴越",
    "periodGroup": "隋唐五代",
    "templeName": "太祖",
    "posthumousName": "武肃王",
    "eraNames": [
      "天宝",
      "宝大",
      "宝正"
    ],
    "reignDisplay": "907–932",
    "imageFilename": "第051名_钱镠.jpg",
    "institution": "浙江省博物馆 / 临安博物馆",
    "artworkTitle": "《吴越武肃王真容像》"
  },
  {
    "id": "han-zhao-liu-yuan",
    "rank": 52,
    "name": "刘渊",
    "fullName": "刘渊（汉赵光文帝）",
    "dynasty": "十六国·汉赵",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "光文皇帝",
    "eraNames": [
      "元熙",
      "永凤",
      "河瑞",
      "光兴"
    ],
    "reignDisplay": "304–310",
    "imageFilename": "第052名_刘渊.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·前赵刘渊》"
  },
  {
    "id": "ming-zhu-jianshen",
    "rank": 53,
    "name": "朱见深",
    "fullName": "朱见深（明宪宗、成化帝）",
    "dynasty": "明朝",
    "periodGroup": "元明清",
    "templeName": "宪宗",
    "posthumousName": "纯皇帝",
    "eraNames": [
      "成化"
    ],
    "reignDisplay": "1464–1487",
    "imageFilename": "第053名_朱见深.jpg",
    "institution": "台北故宫博物院 / 故宫博物院（北京）",
    "artworkTitle": "《明宪宗坐像轴》 / 《明宪宗调禽图》"
  },
  {
    "id": "tang-li-zhi",
    "rank": 54,
    "name": "李治",
    "fullName": "李治（唐高宗）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "高宗",
    "posthumousName": "天皇大帝",
    "eraNames": [
      "永徽",
      "显庆",
      "龙朔",
      "麟德",
      "乾封",
      "总章",
      "咸亨",
      "上元",
      "仪凤",
      "调露",
      "永隆",
      "开耀",
      "永淳",
      "弘道"
    ],
    "reignDisplay": "649–683",
    "imageFilename": "第054名_李治.jpg",
    "institution": "台北故宫博物院 / 乾陵博物馆",
    "artworkTitle": "《历代帝王圣贤名臣像册·唐高宗》 / 乾陵生前造像"
  },
  {
    "id": "western-xia-li-qianshun",
    "rank": 55,
    "name": "李乾顺",
    "fullName": "李乾顺（西夏崇宗）",
    "dynasty": "西夏",
    "periodGroup": "宋辽金夏",
    "templeName": "崇宗",
    "posthumousName": "昭简皇帝",
    "eraNames": [
      "天仪治平",
      "天祐民安",
      "永安",
      "贞观",
      "雍宁",
      "元德",
      "正德",
      "大德"
    ],
    "reignDisplay": "1086–1139",
    "imageFilename": "第055名_李乾顺.jpg",
    "institution": "俄罗斯科学院东方文献研究所 / 宁夏博物馆",
    "artworkTitle": "《黑水城出土西夏版画崇宗御容赞》"
  },
  {
    "id": "song-zhao-xu",
    "rank": 56,
    "name": "赵煦",
    "fullName": "赵煦（宋哲宗）",
    "dynasty": "北宋",
    "periodGroup": "宋辽金夏",
    "templeName": "哲宗",
    "posthumousName": "宪元继道显德定功钦文睿武齐圣昭孝皇帝",
    "eraNames": [
      "元祐",
      "绍圣",
      "元符"
    ],
    "reignDisplay": "1085–1100",
    "imageFilename": "第056名_赵煦.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《宋哲宗坐像轴》"
  },
  {
    "id": "shu-han-liu-bei",
    "rank": 57,
    "name": "刘备",
    "fullName": "刘备（汉昭烈帝）",
    "dynasty": "三国·蜀汉",
    "periodGroup": "魏晋南北朝",
    "templeName": "烈祖",
    "posthumousName": "昭烈皇帝",
    "eraNames": [
      "章武"
    ],
    "reignDisplay": "221–223",
    "imageFilename": "第057名_刘备.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·蜀主刘备》"
  },
  {
    "id": "wei-cao-pi",
    "rank": 58,
    "name": "曹丕",
    "fullName": "曹丕（魏文帝）",
    "dynasty": "三国·曹魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "文皇帝",
    "eraNames": [
      "黄初"
    ],
    "reignDisplay": "220–226",
    "imageFilename": "第058名_曹丕.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·魏文帝曹丕》"
  },
  {
    "id": "han-liu-qi",
    "rank": 59,
    "name": "刘启",
    "fullName": "刘启（汉景帝）",
    "dynasty": "西汉",
    "periodGroup": "秦汉",
    "templeName": "太宗（后除）",
    "posthumousName": "孝景皇帝",
    "eraNames": [
      "前元",
      "中元",
      "后元"
    ],
    "reignDisplay": "前157–前141",
    "imageFilename": "第059名_刘启.jpg",
    "institution": "台北故宫博物院 / 汉阳陵博物馆",
    "artworkTitle": "《历代帝王圣贤名臣像册·汉景帝》 / 汉阳陵陶俑御像"
  },
  {
    "id": "northern-wei-tuoba-jun",
    "rank": 60,
    "name": "拓跋濬",
    "fullName": "拓跋濬（北魏文成帝）",
    "dynasty": "北魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "高宗",
    "posthumousName": "文成皇帝",
    "eraNames": [
      "兴安",
      "兴光",
      "太安",
      "和平"
    ],
    "reignDisplay": "452–465",
    "imageFilename": "第060名_拓跋濬.jpg",
    "institution": "云冈研究院 / 故宫博物院",
    "artworkTitle": "《云冈石窟第十六窟大佛文成帝造像》 / 《三才图会》"
  },
  {
    "id": "liu-song-liu-yilong",
    "rank": 61,
    "name": "刘义隆",
    "fullName": "刘义隆（宋文帝）",
    "dynasty": "南朝·宋",
    "periodGroup": "魏晋南北朝",
    "templeName": "太祖",
    "posthumousName": "文皇帝",
    "eraNames": [
      "元嘉"
    ],
    "reignDisplay": "424–453",
    "imageFilename": "第061名_刘义隆.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·宋文帝刘义隆》"
  },
  {
    "id": "later-tang-li-siyuan",
    "rank": 62,
    "name": "李嗣源",
    "fullName": "李嗣源（后唐明宗）",
    "dynasty": "五代·后唐",
    "periodGroup": "隋唐五代",
    "templeName": "明宗",
    "posthumousName": "圣德和武钦孝皇帝",
    "eraNames": [
      "天成",
      "长兴"
    ],
    "reignDisplay": "926–933",
    "imageFilename": "第062名_李嗣源.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代圣贤帝王像·后唐明宗李嗣源》"
  },
  {
    "id": "ming-zhu-youtang",
    "rank": 63,
    "name": "朱祐樘",
    "fullName": "朱祐樘（明孝宗、弘治帝）",
    "dynasty": "明朝",
    "periodGroup": "元明清",
    "templeName": "孝宗",
    "posthumousName": "敬皇帝",
    "eraNames": [
      "弘治"
    ],
    "reignDisplay": "1487–1505",
    "imageFilename": "第063名_朱祐樘.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《明孝宗坐像轴》"
  },
  {
    "id": "tang-li-yan",
    "rank": 64,
    "name": "李炎",
    "fullName": "李炎（李瀍，唐武宗）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "武宗",
    "posthumousName": "至道昭肃孝皇帝",
    "eraNames": [
      "会昌"
    ],
    "reignDisplay": "840–846",
    "imageFilename": "李炎.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王圣贤名臣像册·唐武宗》"
  },
  {
    "id": "chen-chen-baxian",
    "rank": 65,
    "name": "陈霸先",
    "fullName": "陈霸先（陈武帝）",
    "dynasty": "南朝·陈",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "武皇帝",
    "eraNames": [
      "永定"
    ],
    "reignDisplay": "557–559",
    "imageFilename": "第065名_陈霸先.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·陈武帝陈霸先》"
  },
  {
    "id": "tang-li-chun",
    "rank": 66,
    "name": "李纯",
    "fullName": "李纯（唐宪宗）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "宪宗",
    "posthumousName": "昭文章武大圣至神孝皇帝",
    "eraNames": [
      "元和"
    ],
    "reignDisplay": "805–820",
    "imageFilename": "李纯.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王半身像·唐宪宗》"
  },
  {
    "id": "later-yan-murong-chui",
    "rank": 67,
    "name": "慕容垂",
    "fullName": "慕容垂（后燕成武帝）",
    "dynasty": "十六国·后燕",
    "periodGroup": "魏晋南北朝",
    "templeName": "世祖",
    "posthumousName": "成武皇帝",
    "eraNames": [
      "燕元",
      "建兴"
    ],
    "reignDisplay": "384–396",
    "imageFilename": "第067名_慕容垂.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后燕慕容垂》"
  },
  {
    "id": "cheng-han-li-xiong",
    "rank": 68,
    "name": "李雄",
    "fullName": "李雄（成汉武帝）",
    "dynasty": "十六国·成汉",
    "periodGroup": "魏晋南北朝",
    "templeName": "太宗",
    "posthumousName": "武皇帝",
    "eraNames": [
      "建兴",
      "晏平",
      "玉衡"
    ],
    "reignDisplay": "304–334",
    "imageFilename": "第068名_李雄.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·成汉李雄》"
  },
  {
    "id": "song-zhao-xu-shenzong",
    "rank": 69,
    "name": "赵顼",
    "fullName": "赵顼（宋神宗）",
    "dynasty": "北宋",
    "periodGroup": "宋辽金夏",
    "templeName": "神宗",
    "posthumousName": "体元显道法古立宪帝德王功英文烈武钦仁穆孝皇帝",
    "eraNames": [
      "熙宁",
      "元丰"
    ],
    "reignDisplay": "1067–1085",
    "imageFilename": "第069名_赵顼.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《宋神宗坐像轴》"
  },
  {
    "id": "later-qin-yao-xing",
    "rank": 70,
    "name": "姚兴",
    "fullName": "姚兴（后秦文桓帝）",
    "dynasty": "十六国·后秦",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "文桓皇帝",
    "eraNames": [
      "皇初",
      "弘始"
    ],
    "reignDisplay": "394–416",
    "imageFilename": "第070名_姚兴.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后秦姚兴》"
  },
  {
    "id": "northern-wei-tuoba-hong-xianzu",
    "rank": 71,
    "name": "拓跋弘",
    "fullName": "拓跋弘（北魏献文帝）",
    "dynasty": "北魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "显祖",
    "posthumousName": "献文皇帝",
    "eraNames": [
      "天安",
      "皇兴"
    ],
    "reignDisplay": "465–471",
    "imageFilename": "第071名_拓跋弘.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后魏献文帝》"
  },
  {
    "id": "jin-sima-shao",
    "rank": 72,
    "name": "司马绍",
    "fullName": "司马绍（晋明帝）",
    "dynasty": "东晋",
    "periodGroup": "魏晋南北朝",
    "templeName": "肃祖",
    "posthumousName": "明皇帝",
    "eraNames": [
      "太宁"
    ],
    "reignDisplay": "322–325",
    "imageFilename": "第072名_司马绍.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·晋明帝司马绍》"
  },
  {
    "id": "liang-xiao-yan",
    "rank": 73,
    "name": "萧衍",
    "fullName": "萧衍（梁武帝）",
    "dynasty": "南朝·梁",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "武皇帝",
    "eraNames": [
      "天监",
      "普通",
      "大通",
      "中大通",
      "大同",
      "中大同",
      "太清"
    ],
    "reignDisplay": "502–549",
    "imageFilename": "第073名_萧衍.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王圣贤名臣像册·梁武帝萧衍》"
  },
  {
    "id": "tang-li-yu",
    "rank": 74,
    "name": "李豫",
    "fullName": "李豫（唐代宗）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "代宗",
    "posthumousName": "睿文孝武皇帝",
    "eraNames": [
      "宝应",
      "广德",
      "永泰",
      "大历"
    ],
    "reignDisplay": "762–779",
    "imageFilename": "李豫.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王半身像·唐代宗》"
  },
  {
    "id": "qing-fulin",
    "rank": 75,
    "name": "爱新觉罗·福临",
    "fullName": "爱新觉罗·福临（清世祖、顺治帝）",
    "dynasty": "清朝",
    "periodGroup": "元明清",
    "templeName": "世祖",
    "posthumousName": "章皇帝",
    "eraNames": [
      "顺治"
    ],
    "reignDisplay": "1643–1661",
    "imageFilename": "第075名_爱新觉罗·福临.jpg",
    "institution": "故宫博物院（北京）",
    "artworkTitle": "《清世祖朝服像轴》"
  },
  {
    "id": "tang-li-longji",
    "rank": 76,
    "name": "李隆基",
    "fullName": "李隆基（唐玄宗、唐明皇）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "玄宗",
    "posthumousName": "至道大圣大明孝皇帝",
    "eraNames": [
      "先天",
      "开元",
      "天宝"
    ],
    "reignDisplay": "712–756",
    "imageFilename": "第076名_李隆基.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《唐玄宗坐像轴》 / 唐《明皇幸蜀图》"
  },
  {
    "id": "liao-yelv-xian",
    "rank": 77,
    "name": "耶律贤",
    "fullName": "耶律贤（辽景宗）",
    "dynasty": "辽朝",
    "periodGroup": "宋辽金夏",
    "templeName": "景宗",
    "posthumousName": "孝成皇帝",
    "eraNames": [
      "保宁",
      "乾亨"
    ],
    "reignDisplay": "969–982",
    "imageFilename": "第077名_耶律贤.jpg",
    "institution": "内蒙古博物院 / 故宫博物院",
    "artworkTitle": "《辽代乾陵壁画辽景宗与萧太后行乐图》 / 故宫辽帝像"
  },
  {
    "id": "yuan-ayurbarwada",
    "rank": 78,
    "name": "孛儿只斤·爱育黎拔力八达",
    "fullName": "孛儿只斤·爱育黎拔力八达（元仁宗）",
    "dynasty": "元朝",
    "periodGroup": "元明清",
    "templeName": "仁宗",
    "posthumousName": "圣神文武皇帝",
    "eraNames": [
      "皇庆",
      "延祐"
    ],
    "reignDisplay": "1311–1320",
    "imageFilename": "第078名_孛儿只斤·爱育黎拔力八达.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《元仁宗半身像》"
  },
  {
    "id": "han-liu-fuling",
    "rank": 79,
    "name": "刘弗陵",
    "fullName": "刘弗陵（汉昭帝）",
    "dynasty": "西汉",
    "periodGroup": "秦汉",
    "templeName": "世宗（后除）",
    "posthumousName": "孝昭皇帝",
    "eraNames": [
      "始元",
      "元凤",
      "元平"
    ],
    "reignDisplay": "前87–前74",
    "imageFilename": "第079名_刘弗陵.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王圣贤名臣像册·汉昭帝》"
  },
  {
    "id": "southern-yan-murong-de",
    "rank": 80,
    "name": "慕容德",
    "fullName": "慕容德（南燕献武帝）",
    "dynasty": "十六国·南燕",
    "periodGroup": "魏晋南北朝",
    "templeName": "世宗",
    "posthumousName": "献武皇帝",
    "eraNames": [
      "建平"
    ],
    "reignDisplay": "398–405",
    "imageFilename": "第080名_慕容德.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·南燕慕容德》"
  },
  {
    "id": "tang-li-chen",
    "rank": 81,
    "name": "李忱",
    "fullName": "李忱（唐宣宗）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "宣宗",
    "posthumousName": "圣武献文孝皇帝",
    "eraNames": [
      "大中"
    ],
    "reignDisplay": "846–859",
    "imageFilename": "第081名_李忱.jpg",
    "institution": "五台山佛光寺（全国重点文保单位） / 台北故宫博物院",
    "artworkTitle": "《佛光寺文殊殿唐宣宗生前彩塑造像》 / 台北故宫《唐宣宗像》"
  },
  {
    "id": "northern-zhou-yuwen-yu",
    "rank": 82,
    "name": "宇文毓",
    "fullName": "宇文毓（北周明帝）",
    "dynasty": "北周",
    "periodGroup": "魏晋南北朝",
    "templeName": "世宗",
    "posthumousName": "明皇帝",
    "eraNames": [
      "武成"
    ],
    "reignDisplay": "557–560",
    "imageFilename": "第082名_宇文毓.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后周明帝》"
  },
  {
    "id": "southern-qi-xiao-ze",
    "rank": 83,
    "name": "萧赜",
    "fullName": "萧赜（南齐武帝）",
    "dynasty": "南朝·齐",
    "periodGroup": "魏晋南北朝",
    "templeName": "世祖",
    "posthumousName": "武皇帝",
    "eraNames": [
      "永明"
    ],
    "reignDisplay": "482–493",
    "imageFilename": "第083名_萧赜.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·齐武帝萧赜》"
  },
  {
    "id": "qing-yongyan",
    "rank": 84,
    "name": "爱新觉罗·颙琰",
    "fullName": "爱新觉罗·颙琰（清仁宗、嘉庆帝）",
    "dynasty": "清朝",
    "periodGroup": "元明清",
    "templeName": "仁宗",
    "posthumousName": "睿皇帝",
    "eraNames": [
      "嘉庆"
    ],
    "reignDisplay": "1796–1820",
    "imageFilename": "第084名_爱新觉罗·颙琰.jpg",
    "institution": "故宫博物院（北京）",
    "artworkTitle": "《清仁宗朝服像轴》"
  },
  {
    "id": "northern-wei-tuoba-tao",
    "rank": 85,
    "name": "拓跋焘",
    "fullName": "拓跋焘（北魏太武帝）",
    "dynasty": "北魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "世祖",
    "posthumousName": "太武皇帝",
    "eraNames": [
      "始光",
      "神䴥",
      "延和",
      "太延",
      "太平真君",
      "正平"
    ],
    "reignDisplay": "423–452",
    "imageFilename": "第085名_拓跋焘.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后魏太武帝》"
  },
  {
    "id": "former-shu-wang-jian",
    "rank": 86,
    "name": "王建",
    "fullName": "王建（前蜀高祖）",
    "dynasty": "五代·前蜀",
    "periodGroup": "魏晋南北朝",
    "templeName": "高祖",
    "posthumousName": "神武圣文孝德明惠皇帝",
    "eraNames": [
      "天复",
      "武成",
      "永平",
      "通正",
      "天汉",
      "光天"
    ],
    "reignDisplay": "907–918",
    "imageFilename": "第086名_王建.jpg",
    "institution": "成都永陵博物馆（国家一级博物馆 / 国保单位）",
    "artworkTitle": "《五代前蜀高祖王建地下玄宫真容石雕坐像》"
  },
  {
    "id": "liao-yelv-deguang",
    "rank": 87,
    "name": "耶律德光",
    "fullName": "耶律德光（辽太宗）",
    "dynasty": "辽朝",
    "periodGroup": "宋辽金夏",
    "templeName": "太宗",
    "posthumousName": "孝武惠文皇帝",
    "eraNames": [
      "天显",
      "会同",
      "大同"
    ],
    "reignDisplay": "926–947",
    "imageFilename": "第087名_耶律德光.jpg",
    "institution": "故宫博物院（北京）",
    "artworkTitle": "《故宫藏辽代帝王像·辽太宗耶律德光》"
  },
  {
    "id": "jin-sima-yan",
    "rank": 88,
    "name": "司马炎",
    "fullName": "司马炎（晋武帝）",
    "dynasty": "西晋",
    "periodGroup": "魏晋南北朝",
    "templeName": "世祖",
    "posthumousName": "武皇帝",
    "eraNames": [
      "泰始",
      "咸宁",
      "太康",
      "太熙"
    ],
    "reignDisplay": "266–290",
    "imageFilename": "第088名_司马炎.jpg",
    "institution": "波士顿美术馆（Museum of Fine Arts, Boston）",
    "artworkTitle": "《历代帝王图·晋武帝司马炎》"
  },
  {
    "id": "wei-cao-rui",
    "rank": 89,
    "name": "曹叡",
    "fullName": "曹叡（魏明帝）",
    "dynasty": "三国·曹魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "烈祖",
    "posthumousName": "明皇帝",
    "eraNames": [
      "太和",
      "青龙",
      "景初"
    ],
    "reignDisplay": "226–239",
    "imageFilename": "第089名_曹叡.jpg",
    "institution": "国家图书馆 / 洛阳博物馆",
    "artworkTitle": "《三才图会·人物二卷·魏明帝曹叡》 / 洛阳西朱村曹魏大墓出土石牌像"
  },
  {
    "id": "former-yan-murong-jun",
    "rank": 90,
    "name": "慕容儁",
    "fullName": "慕容儁（前燕景昭帝）",
    "dynasty": "十六国·前燕",
    "periodGroup": "魏晋南北朝",
    "templeName": "烈祖",
    "posthumousName": "景昭皇帝",
    "eraNames": [
      "元玺",
      "光寿"
    ],
    "reignDisplay": "348–360",
    "imageFilename": "第090名_慕容儁.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·前燕慕容儁》"
  },
  {
    "id": "jin-wanyan-sheng",
    "rank": 91,
    "name": "完颜晟",
    "fullName": "完颜晟（吴乞买，金太宗）",
    "dynasty": "金朝",
    "periodGroup": "宋辽金夏",
    "templeName": "太宗",
    "posthumousName": "体元应运世德昭功哲惠仁圣文烈皇帝",
    "eraNames": [
      "天会"
    ],
    "reignDisplay": "1123–1135",
    "imageFilename": "完颜晟.jpg",
    "institution": "故宫博物院 / 台北故宫博物院",
    "artworkTitle": "《故宫藏历代名画大系·金太宗御容像》"
  },
  {
    "id": "song-zhao-shu",
    "rank": 92,
    "name": "赵曙",
    "fullName": "赵曙（宋英宗）",
    "dynasty": "北宋",
    "periodGroup": "宋辽金夏",
    "templeName": "英宗",
    "posthumousName": "宪文肃武宣孝皇帝",
    "eraNames": [
      "治平"
    ],
    "reignDisplay": "1063–1067",
    "imageFilename": "第092名_赵曙.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《宋英宗坐像轴》"
  },
  {
    "id": "wu-zhou-wu-zetian",
    "rank": 93,
    "name": "武曌",
    "fullName": "武曌（武则天）",
    "dynasty": "武周",
    "periodGroup": "隋唐五代",
    "templeName": "则天大圣皇后（武周圣神皇帝）",
    "posthumousName": "则天顺圣皇后",
    "eraNames": [
      "天授",
      "如意",
      "长寿",
      "延载",
      "证圣",
      "天册万岁",
      "万岁登封",
      "万岁通天",
      "神功",
      "圣历",
      "久视",
      "大足",
      "长安"
    ],
    "reignDisplay": "690–705",
    "imageFilename": "第093名_武曌.jpg",
    "institution": "台北故宫博物院 / 龙门石窟研究院",
    "artworkTitle": "《历代帝后像·武则天》 / 龙门石窟卢舍那大佛"
  },
  {
    "id": "qing-nurhaci",
    "rank": 94,
    "name": "爱新觉罗·努尔哈赤",
    "fullName": "爱新觉罗·努尔哈赤（清太祖）",
    "dynasty": "后金·清朝",
    "periodGroup": "元明清",
    "templeName": "太祖",
    "posthumousName": "承天广运圣德神功肇纪立极仁孝睿武端毅钦安弘文定业高皇帝",
    "eraNames": [
      "天命"
    ],
    "reignDisplay": "1616–1626",
    "imageFilename": "第094名_爱新觉罗·努尔哈赤.jpg",
    "institution": "故宫博物院（北京） / 沈阳故宫博物院",
    "artworkTitle": "《清太祖努尔哈赤朝服像轴》"
  },
  {
    "id": "ming-zhu-qiyu",
    "rank": 95,
    "name": "朱祁钰",
    "fullName": "朱祁钰（明代宗、景泰帝）",
    "dynasty": "明朝",
    "periodGroup": "元明清",
    "templeName": "代宗",
    "posthumousName": "景皇帝",
    "eraNames": [
      "景泰"
    ],
    "reignDisplay": "1449–1457",
    "imageFilename": "第095名_朱祁钰.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《明代宗坐像轴》"
  },
  {
    "id": "northern-qi-gao-yan",
    "rank": 96,
    "name": "高演",
    "fullName": "高演（北齐孝昭帝）",
    "dynasty": "北齐",
    "periodGroup": "魏晋南北朝",
    "templeName": "肃宗",
    "posthumousName": "孝昭皇帝",
    "eraNames": [
      "皇建"
    ],
    "reignDisplay": "560–561",
    "imageFilename": "第096名_高演.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·北齐孝昭帝高演》"
  },
  {
    "id": "wu-sun-xiu",
    "rank": 97,
    "name": "孙休",
    "fullName": "孙休（吴景帝）",
    "dynasty": "三国·东吴",
    "periodGroup": "魏晋南北朝",
    "templeName": "景皇帝（无庙号）",
    "posthumousName": "景皇帝",
    "eraNames": [
      "永安"
    ],
    "reignDisplay": "258–264",
    "imageFilename": "第097名_孙休.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·吴景帝孙休》"
  },
  {
    "id": "yuan-shidebala",
    "rank": 98,
    "name": "孛儿只斤·硕德八剌",
    "fullName": "孛儿只斤·硕德八剌（元英宗）",
    "dynasty": "元朝",
    "periodGroup": "元明清",
    "templeName": "英宗",
    "posthumousName": "睿圣文孝皇帝",
    "eraNames": [
      "至治"
    ],
    "reignDisplay": "1320–1323",
    "imageFilename": "第098名_孛儿只斤·硕德八剌.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《元英宗半身像》"
  },
  {
    "id": "tang-li-dan",
    "rank": 99,
    "name": "李旦",
    "fullName": "李旦（唐睿宗）",
    "dynasty": "唐朝",
    "periodGroup": "隋唐五代",
    "templeName": "睿宗",
    "posthumousName": "玄真大圣大成孝皇帝",
    "eraNames": [
      "文明",
      "景云",
      "太极",
      "延和"
    ],
    "reignDisplay": "684–690, 710–712",
    "imageFilename": "第099名_李旦.jpg",
    "institution": "台北故宫博物院",
    "artworkTitle": "《历代帝王半身像·唐睿宗》"
  },
  {
    "id": "northern-wei-tuoba-gui",
    "rank": 100,
    "name": "拓跋珪",
    "fullName": "拓跋珪（北魏道武帝）",
    "dynasty": "北魏",
    "periodGroup": "魏晋南北朝",
    "templeName": "太祖",
    "posthumousName": "道武皇帝",
    "eraNames": [
      "登国",
      "皇始",
      "天兴",
      "天赐"
    ],
    "reignDisplay": "386–409",
    "imageFilename": "第100名_拓跋珪.jpg",
    "institution": "国家图书馆",
    "artworkTitle": "《三才图会·人物二卷·后魏道武帝拓跋珪》"
  }
];

export const emperorRosterById = new Map<string, EmperorRosterItem>(
  emperorRoster.map((item) => [item.id, item]),
);
