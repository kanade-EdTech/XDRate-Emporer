import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('dist/前100名/权威画像索引清单.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

items = catalog.get('items', [])
print(f"Total catalog items: {len(items)}")

commons_files = []
other_urls = []

for item in items:
    rank = item['rank']
    name = item['name']
    url = item.get('public_url', '')
    if 'File:' in url:
        # extract file name
        fname = url.split('File:')[-1]
        commons_files.append((rank, name, fname))
    else:
        other_urls.append((rank, name, url))

print(f"Commons files: {len(commons_files)}, Other: {len(other_urls)}")
for c in commons_files[:10]:
    print(f"Rank {c[0]:03d}: {c[1]} -> File:{c[2]}")
if other_urls:
    print("Other URLs:", other_urls[:5])
