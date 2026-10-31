import os
import sys
import json
import urllib.request
import urllib.parse
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_DIR = os.path.join(ROOT_DIR, 'assets', 'emperor', 'source')

# Candidate files on Wikimedia Commons for the 13 missing top emperors
TARGETS = [
    {
        'id': 'han-liu-che',
        'rank': 4,
        'name': '刘彻',
        'fullName': '刘彻',
        'dynasty': '西汉',
        'periodGroup': '秦汉',
        'templeName': '世宗',
        'posthumousName': '孝武皇帝',
        'eraNames': ['建元', '元光', '元朔', '元狩', '元鼎', '元封', '太初', '天汉', '太始', '征和', '后元'],
        'reignDisplay': '前141–前87',
        'imageFilename': '刘彻.jpg',
        'institution': '国家典籍博物馆 / 台北故宫博物院',
        'artworkTitle': '《历代古人像赞·汉武帝》 / 《三才图会》',
        'commons_candidates': ['File:Liu Che (Emperor Wu of Han).png', 'File:漢武帝.jpg']
    },
    {
        'id': 'han-liu-heng',
        'rank': 5,
        'name': '刘恒',
        'fullName': '刘恒',
        'dynasty': '西汉',
        'periodGroup': '秦汉',
        'templeName': '太宗',
        'posthumousName': '孝文皇帝',
        'eraNames': ['前元', '后元'],
        'reignDisplay': '前180–前157',
        'imageFilename': '刘恒.jpg',
        'institution': '台北故宫博物院 / 国家图书馆',
        'artworkTitle': '《历代圣贤半身像·汉文帝》 / 《三才图会》',
        'commons_candidates': ['File:Liu Heng (Emperor Wen of Han).png', 'File:SancaiWendiiHan.jpg', 'File:Portraits of Famous Men - Liu Heng 2.jpg']
    },
    {
        'id': 'song-zhao-zhen',
        'rank': 9,
        'name': '赵祯',
        'fullName': '赵祯',
        'dynasty': '北宋',
        'periodGroup': '宋辽金夏',
        'templeName': '仁宗',
        'posthumousName': '体天法道极功全德神文圣武睿感明孝皇帝',
        'eraNames': ['天圣', '明道', '景祐', '宝元', '康定', '庆历', '皇祐', '至和', '嘉祐'],
        'reignDisplay': '1022–1063',
        'imageFilename': '赵祯.jpg',
        'institution': '台北故宫博物院',
        'artworkTitle': '《宋仁宗坐像轴》',
        'commons_candidates': ['File:Song Renzong.jpg', 'File:Song Renzong (cropped).jpg']
    },
    {
        'id': 'qing-huang-taiji',
        'rank': 11,
        'name': '爱新觉罗·皇太极',
        'fullName': '爱新觉罗·皇太极',
        'dynasty': '清朝',
        'periodGroup': '元明清',
        'templeName': '太宗',
        'posthumousName': '应天兴国弘德彰武宽温仁圣睿孝敬敏昭益纯德端宪文皇帝',
        'eraNames': ['天聪', '崇德'],
        'reignDisplay': '1626–1643',
        'imageFilename': '皇太极.jpg',
        'institution': '故宫博物院（北京） / 沈阳故宫博物院',
        'artworkTitle': '《清太宗朝服像轴》',
        'commons_candidates': ['File:Hong Taiji.jpg']
    },
    {
        'id': 'yuan-temujin',
        'rank': 1,
        'name': '孛儿只斤·铁木真',
        'fullName': '孛儿只斤·铁木真',
        'dynasty': '大蒙古国 / 元朝',
        'periodGroup': '元明清',
        'templeName': '太祖',
        'posthumousName': '法天启运圣武皇帝（成吉思汗）',
        'eraNames': ['大蒙古国无年号'],
        'reignDisplay': '1206–1227',
        'imageFilename': '铁木真.jpg',
        'institution': '台北故宫博物院',
        'artworkTitle': '《元代帝半身像·元太祖》',
        'commons_candidates': ['File:YuanEmperorAlbumGenghisPortrait.jpg']
    },
    {
        'id': 'jin-aguda',
        'rank': 15,
        'name': '完颜阿骨打',
        'fullName': '完颜旻（阿骨打）',
        'dynasty': '金朝',
        'periodGroup': '宋辽金夏',
        'templeName': '太祖',
        'posthumousName': '应乾兴运昭德定功仁明庄孝大圣武元皇帝',
        'eraNames': ['收国', '天辅'],
        'reignDisplay': '1115–1123',
        'imageFilename': '完颜阿骨打.jpg',
        'institution': '黑龙江省博物馆 / 台北故宫博物院',
        'artworkTitle': '《历代圣贤帝王像·金太祖》 / 《三才图会》',
        'commons_candidates': ['File:Wanyan Aguda.jpg', 'File:Wanggiyan Aguda.jpg']
    },
    {
        'id': 'jin-wanyan-yong',
        'rank': 17,
        'name': '完颜雍',
        'fullName': '完颜雍（葛王、小尧舜）',
        'dynasty': '金朝',
        'periodGroup': '宋辽金夏',
        'templeName': '世宗',
        'posthumousName': '光天明德大圣武孝皇帝',
        'eraNames': ['大定'],
        'reignDisplay': '1161–1189',
        'imageFilename': '完颜雍.jpg',
        'institution': '台北故宫博物院',
        'artworkTitle': '《圣帝明王善端录·金世宗》',
        'commons_candidates': ['File:聖帝明王善端錄（宋元明） 冊 金世宗 K2A003132N000000011PAB (cropped).png', 'File:聖帝明王善端錄（宋元明） 冊 金世宗 K2A003132N000000011PAB.png']
    },
    {
        'id': 'liao-abaoji',
        'rank': 19,
        'name': '耶律阿保机',
        'fullName': '耶律阿保机（耶律亿）',
        'dynasty': '辽朝',
        'periodGroup': '宋辽金夏',
        'templeName': '太祖',
        'posthumousName': '大圣大明神烈天皇帝',
        'eraNames': ['神册', '天赞', '天显'],
        'reignDisplay': '916–926',
        'imageFilename': '耶律阿保机.jpg',
        'institution': '赤峰市博物馆 / 《三才图会》',
        'artworkTitle': '《三才图会·人物三卷·辽太祖》',
        'commons_candidates': ['File:太阳湖公园 - 耶律阿保机像 - 2024-05-30 01.jpg', 'File:Liao Taizu.jpg']
    },
    {
        'id': 'liu-song-liu-yu',
        'rank': 20,
        'name': '刘裕',
        'fullName': '刘裕',
        'dynasty': '南朝宋',
        'periodGroup': '魏晋南北朝',
        'templeName': '高祖',
        'posthumousName': '武皇帝',
        'eraNames': ['永初'],
        'reignDisplay': '420–422',
        'imageFilename': '刘裕.jpg',
        'institution': '台北故宫博物院 / 国家图书馆',
        'artworkTitle': '《古先君臣图鉴·宋武帝》 / 《三才图会》',
        'commons_candidates': ['File:Liu Yu (Song Wudi).jpg', 'File:南朝宋武帝 (古先君臣圖鑑).png', 'File:南朝宋武帝 (歷代君臣圖像).png']
    },
    {
        'id': 'northern-zhou-yuwen-yong',
        'rank': 21,
        'name': '宇文邕',
        'fullName': '宇文邕',
        'dynasty': '北周',
        'periodGroup': '魏晋南北朝',
        'templeName': '高祖',
        'posthumousName': '武皇帝',
        'eraNames': ['保定', '天和', '建德', '宣政'],
        'reignDisplay': '560–578',
        'imageFilename': '宇文邕.jpg',
        'institution': '美国波士顿美术馆（MFA Boston）',
        'artworkTitle': '阎立本《历代帝王图·周武帝宇文邕》',
        'commons_candidates': ['File:Zhou Wu Tang.jpg', 'File:Yen Li-pen 001.jpg']
    },
    {
        'id': 'northern-wei-tuoba-hong',
        'rank': 22,
        'name': '拓跋宏',
        'fullName': '拓跋宏（元宏）',
        'dynasty': '北魏',
        'periodGroup': '魏晋南北朝',
        'templeName': '高祖',
        'posthumousName': '孝文皇帝',
        'eraNames': ['延兴', '承明', '太和'],
        'reignDisplay': '471–499',
        'imageFilename': '拓跋宏.jpg',
        'institution': '洛阳龙门石窟宾阳中洞浮雕 / 国家图书馆',
        'artworkTitle': '《北魏孝文帝礼佛图》 / 《三才图会·后魏孝文帝》',
        'commons_candidates': ['File:Emperor Xiaowen of Northern Wei.jpg', 'File:Emperor Xiaowen and his entourage worshipping the Buddha 522-523 CE. Central Binyang Cave (also known as Cave 3) in the Longmen complex.jpg']
    },
    {
        'id': 'han-liu-zhao',
        'rank': 24,
        'name': '刘肇',
        'fullName': '刘肇',
        'dynasty': '东汉',
        'periodGroup': '秦汉',
        'templeName': '穆宗（后除）',
        'posthumousName': '孝和皇帝',
        'eraNames': ['永元', '元兴'],
        'reignDisplay': '88–106',
        'imageFilename': '刘肇.jpg',
        'institution': '国家典籍博物馆 / 台北故宫博物院',
        'artworkTitle': '《历代古人像赞·汉和帝》 / 《三才图会》',
        'commons_candidates': ['File:漢和帝 (cropped).png', 'File:Emperor He of Han (cropped).png', 'File:Liu Zhao.jpg']
    },
    {
        'id': 'jin-sima-yi',
        'rank': 25,
        'name': '司马懿',
        'fullName': '司马懿',
        'dynasty': '西晋（追尊）',
        'periodGroup': '魏晋南北朝',
        'templeName': '高祖',
        'posthumousName': '宣皇帝',
        'eraNames': ['曹魏正始/嘉平'],
        'reignDisplay': '249–251（辅政掌权）',
        'imageFilename': '司马懿.jpg',
        'institution': '台北故宫博物院',
        'artworkTitle': '《历代圣贤半身像册·司马懿》',
        'commons_candidates': ['File:歷代聖賢半身像 冊 司馬懿 (Sima Yi).png', 'File:Sima Yi (Jin Xuandi).jpg', 'File:魏·太傅 司馬懿.jpg']
    }
]

def download_file(file_title, out_path):
    encoded_title = urllib.parse.quote(file_title.replace('File:', '').replace(' ', '_'))
    url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded_title}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()
        if len(data) < 2000:
            raise ValueError(f"File too small ({len(data)} bytes)")

        # Save temporary
        tmp_path = out_path + '.tmp'
        with open(tmp_path, 'wb') as f:
            f.write(data)

        # Verify with PIL and convert/save as clean JPG
        with Image.open(tmp_path) as img:
            rgb_img = img.convert('RGB')
            # Save standard high quality JPEG
            rgb_img.save(out_path, format='JPEG', quality=95)

        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        return len(data)

def main():
    os.makedirs(SOURCE_DIR, exist_ok=True)
    success = 0
    failed = []

    for item in TARGETS:
        out_file = os.path.join(SOURCE_DIR, item['imageFilename'])
        print(f"正在处理: {item['name']} -> {item['imageFilename']}...")
        downloaded = False
        for candidate in item['commons_candidates']:
            try:
                bytes_num = download_file(candidate, out_file)
                print(f"  [成功] 从 {candidate} 下载 {bytes_num} 字节")
                downloaded = True
                success += 1
                break
            except Exception as e:
                print(f"  [重试] {candidate} 失败: {e}")

        if not downloaded:
            failed.append(item['name'])

    print(f"\n下载完成: 成功 {success}/{len(TARGETS)}, 失败 {len(failed)}")
    if failed:
        print("失败列表:", failed)

if __name__ == '__main__':
    main()
