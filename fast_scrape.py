import json
import os
import time
import urllib.request
import re
import random
import concurrent.futures

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

    # Fallback pattern for some pages
    match = re.search(r'<div[^>]*id="urdu"[^>]*>(.*?)</div>', html, re.DOTALL)
    if match:
        text = match.group(1)
        text = re.sub(r'<[^>]+>', '', text).strip()
        return text

    return None

def process_item(item):
    book, hid = item
    hid_str = str(hid)
    
    # URL construction
    if book == "Bukhari":
        url = f"https://hamariweb.com/islam/hadith/sahih-bukhari-{hid}/"
    else:
        url = f"https://hamariweb.com/islam/hadith/sunan-an-nasai-{hid}/"
        
    print(f"Fetching {book} {hid}...")
    html = fetch_content(url)
    
    result = None
    if html:
        urdu = extract_urdu(html)
        if urdu:
            result = (book, hid_str, urdu)
            print(f"  > Found {book} {hid}")
        else:
            print(f"  > No Urdu for {book} {hid}")
    
    # Random sleep to be slightly polite even in threads
    time.sleep(random.uniform(0.2, 0.5))
    return result

def main():
    # Load missing IDs
    with open("missing_bukhari_ids.json", "r") as f:
        missing_bukhari = json.load(f)
    with open("missing_nasai_ids.json", "r") as f:
        missing_nasai = json.load(f)
        
    # Prepare work items
    # Filter out already done if patch files exist
    done_bukhari = {}
    if os.path.exists("bukhari_patch.json"):
        with open("bukhari_patch.json", "r") as f:
            done_bukhari = json.load(f)
            
    done_nasai = {}
    if os.path.exists("nasai_patch.json"):
        with open("nasai_patch.json", "r") as f:
            done_nasai = json.load(f)
            
    work_items = []
    
    for hid in missing_bukhari:
        if str(hid) not in done_bukhari:
            work_items.append(("Bukhari", hid))
            
    for hid in missing_nasai:
        if str(hid) not in done_nasai:
            work_items.append(("Nasai", hid))
            
    print(f"Total items to fetch: {len(work_items)}")
    
    # Use ThreadPoolExecutor
    results_bukhari = done_bukhari
    results_nasai = done_nasai
    
    counter = 0
    save_interval = 20
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        future_to_item = {executor.submit(process_item, item): item for item in work_items}
        
        for future in concurrent.futures.as_completed(future_to_item):
            res = future.result()
            if res:
                book, hid_str, urdu = res
                if book == "Bukhari":
                    results_bukhari[hid_str] = urdu
                else:
                    results_nasai[hid_str] = urdu
            
            counter += 1
            if counter % save_interval == 0:
                print(f"Saving progress... ({counter}/{len(work_items)})")
                with open("bukhari_patch.json", "w", encoding='utf-8') as f:
                    json.dump(results_bukhari, f, ensure_ascii=False, indent=4)
                with open("nasai_patch.json", "w", encoding='utf-8') as f:
                    json.dump(results_nasai, f, ensure_ascii=False, indent=4)

    # Final save
    with open("bukhari_patch.json", "w", encoding='utf-8') as f:
        json.dump(results_bukhari, f, ensure_ascii=False, indent=4)
    with open("nasai_patch.json", "w", encoding='utf-8') as f:
        json.dump(results_nasai, f, ensure_ascii=False, indent=4)
        
    print("All scraping done.")

if __name__ == "__main__":
    main()
