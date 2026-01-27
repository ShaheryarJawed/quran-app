import json
import re
import urllib.request
import time

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
    match = re.search(r'<p[^>]*id="urduText"[^>]*>(.*?)</p>', html, re.DOTALL)
    if not match:
        match = re.search(r'<p[^>]*class="[^"]*urdu_text[^"]*"[^>]*>(.*?)</p>', html, re.DOTALL)
    if match: return re.sub(r'<[^>]+>', '', match.group(1)).strip()
    match = re.search(r'<div[^>]*id="urdu"[^>]*>(.*?)</div>', html, re.DOTALL)
    if match: return re.sub(r'<[^>]+>', '', match.group(1)).strip()
    return None

def force_fix(filename, book_name, target_ids):
    print(f"Force fixing {filename} for {target_ids}...")
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'=\s*(\{[\s\S]*\});?', content)
    if not match: return
    
    data = json.loads(match.group(1))
    hadiths = data.get('hadiths', [])
    updates = 0
    
    for h in hadiths:
        hid = h.get('hadithnumber')
        if hid in target_ids:
            text = h.get('text', '').strip()
            if not text or "معذرت" in text:
                print(f"  Fetching {book_name} {hid}...")
                slug = "sahih-bukhari" if book_name == "Bukhari" else "sunan-an-nasai"
                url = f"https://hamariweb.com/islam/hadith/{slug}-{hid}/"
                
                html = fetch_content(url)
                if html:
                    urdu = extract_urdu(html)
                    if urdu:
                        h['text'] = urdu
                        updates += 1
                        print(f"  > Success")
                    else:
                        print(f"  > No Urdu found")
                else:
                    print(f"  > Fetch failed")
                time.sleep(0.5)

    if updates > 0:
        print(f"Saving {updates} updates...")
        var_name = "HADITH_DATA_" + book_name.upper()
        new_json = json.dumps(data, indent=4, ensure_ascii=False)
        new_content = f"window.{var_name} = \n{new_json};"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
    else:
        print("No updates.")

def main():
    force_fix("hadith_bukhari.js", "Bukhari", [2311, 2755, 2805, 7416])
    force_fix("hadith_nasai.js", "Nasai", [5303, 5384])

if __name__ == "__main__":
    main()
