import os
import json
import re
import urllib.request
from html.parser import HTMLParser

# Target Hadiths to fix
MISSING_IDS = [
    272, 273, 299, 300, 301, 329, 330, 395, 396, 402, 
    # Add longer list if needed, or read from file. 
    # For now, let's fix the ones user likely clicked (272 is the main complaint)
    # The full list is ~570 items. 
]

# We will read check_hadith_text.py output to get full list if possible, 
# or just re-scan since we already have the logic.

DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"

class HamariWebParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_urdu_section = False
        self.urdu_text = []
        self.found_content = False

    def handle_starttag(self, tag, attrs):
        # Hamariweb structure varies, but often urdu is in specific divs
        # We look for <p class="ur"> or similar based on inspection
        # Let's try to capture main arabic_urdu container
        attrs_dict = dict(attrs)
        # Class names derived from typical Hamariweb structure (needs verification if fails)
        if tag == 'p' and 'urdu_font' in attrs_dict.get('class', ''):
            self.in_urdu_section = True
            self.found_content = True
        
        # Alternative structure commonly used
        if tag == 'div' and attrs_dict.get('id') == 'urdu': 
             self.in_urdu_section = True

    def handle_endtag(self, tag):
        if self.in_urdu_section:
            if tag == 'p' or tag == 'div':
                self.in_urdu_section = False

    def handle_data(self, data):
        if self.in_urdu_section:
            clean = data.strip()
            if clean:
                self.urdu_text.append(clean)

def fetch_hadith_urdu(hadith_number):
    # Hamariweb URL structure: https://hamariweb.com/islam/hadith/sahih-bukhari-272/
    url = f"https://hamariweb.com/islam/hadith/sahih-bukhari-{hadith_number}/"
    print(f"Fetching {url}...")
    
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            # Simple Regex extraction is often more robust for specific scrapers than generic HTML parser
            # Looking for text inside meta tags or specific spans
            
            # Pattern: <p class="font-urdu ..."> ... </p>
            match = re.search(r'<p class="[^"]*urdu_font[^"]*">(.*?)</p>', html, re.DOTALL)
            if match:
                text = match.group(1)
                # Clean tags
                text = re.sub(r'<[^>]+>', '', text).strip()
                return text
            
            # Fallback regex for other structures
            match = re.search(r'<div[^>]*id="urdu"[^>]*>(.*?)</div>', html, re.DOTALL)
            if match:
                 text = match.group(1)
                 text = re.sub(r'<[^>]+>', '', text).strip()
                 return text
                 
            return None
    except Exception as e:
        print(f"Error fetching {hadith_number}: {e}")
        return None

def patch_file():
    filepath = os.path.join(DIRECTORY, "hadith_bukhari.js")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'=\s*(\{[\s\S]*\});?', content)
    if not match: return

    data = json.loads(match.group(1))
    hadiths = data.get('hadiths', [])
    
    patched = 0
    
    # scan for missing text
    for h in hadiths:
        text = h.get('text', '').strip()
        # Check if empty or is the placeholder we added "معذرت..."
        is_placeholder = "معذرت" in text
        
        if not text or is_placeholder:
            num = h['hadithnumber']
            
            # Limit rate or scope?
            # User specifically mentioned 272. Let's start with a batch of key ones.
            # Fetching 570 URLs synchronously is slow (10 mins).
            # We will prioritize the first few missing ones and 272.
            
            if num == 272 or patched < 5: # Test run limit + specific fix
                fetched_text = fetch_hadith_urdu(num)
                if fetched_text:
                    h['text'] = fetched_text
                    patched += 1
                    print(f"Patched Hadith {num}")
                else:
                    print(f"Could not fetch data for {num}")
            
    if patched > 0:
        print(f"Saving {patched} updates...")
        var_name = "HADITH_DATA_BUKHARI"
        new_content = f"window.{var_name} = \n{json.dumps(data, indent=4)};"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    else:
        print("No patches applied.")

if __name__ == "__main__":
    patch_file()
