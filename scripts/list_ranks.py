import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('assets/emperor/source/皇帝清单.json', 'r', encoding='utf-8') as f:
    ranked = json.load(f)

top100 = [x for x in ranked if x['rank'] <= 100]
top100.sort(key=lambda x: x['rank'])
for x in top100:
    print(f"{x['rank']:03d}: {x['name']}")
