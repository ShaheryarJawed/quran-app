import json
import os
import time
import urllib.request
import re
import random

HEADERS = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}

def fetch_content(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_urdu(html):
    # Pattern: id="urduText"
    match = re.search(r'<p[^>]*id="urduText"[^>]*>(.*?)</p>', html, re.DOTALL)
    if not match:
        match = re.search(r'<p[^>]*class="[^"]*urdu_text[^"]*"[^>]*>(.*?)</p>', html, re.DOTALL)
    
    if match:
        text = match.group(1)
        text = re.sub(r'<[^>]+>', '', text).strip()
        return text
        
    match = re.search(r'<div[^>]*id="urdu"[^>]*>(.*?)</div>', html, re.DOTALL)
    if match:
        text = match.group(1)
        text = re.sub(r'<[^>]+>', '', text).strip()
        return text

    return None

def main():
    ids_file = "missing_nasai_ids.json"
    output_file = "nasai_patch.json"
    
    with open(ids_file, 'r', encoding='utf-8') as f:
        missing_ids = json.load(f)
        
    scraped_data = {}
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            scraped_data = json.load(f)
    
    print(f"Total Missing: {len(missing_ids)}")
    print(f"Already Scraped: {len(scraped_data)}")
    
    count = 0
    # Process only 50 for now? Or let it run?
    # I'll stick to full run logic but rely on interruption if needed.
    
    for hid in missing_ids:
        hid_str = str(hid)
        
        if hid_str in scraped_data and scraped_data[hid_str]:
            continue
            
        url = f"https://hamariweb.com/islam/hadith/sunan-an-nasai-{hid}/"
        print(f"[{count+1}] Fetching {url}...")
        
        html = fetch_content(url)
        if html:
            urdu = extract_urdu(html)
            if urdu:
                scraped_data[hid_str] = urdu
                print(f"  > Success ({len(urdu)} chars)")
            else:
                print("  > No Urdu text found in HTML")
        
        if count % 5 == 0:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(scraped_data, f, ensure_ascii=False, indent=4)
        
        count += 1
        time.sleep(random.uniform(0.5, 1.5))
        
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(scraped_data, f, ensure_ascii=False, indent=4)
        
    print("Done.")

if __name__ == "__main__":
    main()
