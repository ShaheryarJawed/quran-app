import os
import json
import re
import urllib.request

# Configuration
DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"
API_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions"

# Map local book IDs to API edition names
BOOK_MAP = {
    'bukhari': 'eng-bukhari',
    'muslim': 'eng-muslim',
    'abudawud': 'eng-abudawud',
    'tirmidhi': 'eng-tirmidhi',
    'nasai': 'eng-nasai',
    'ibnmajah': 'eng-ibnmajah',
    'malik': 'eng-malik'
}

def download_json(url):
    print(f"Downloading {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def fix_book(book_id, edition_name):
    # 1. Read Local File
    filename = f"hadith_{book_id}.js"
    filepath = os.path.join(DIRECTORY, filename)
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON
    match = re.search(r'=\s*(\{[\s\S]*\});?', content)
    if not match:
        print(f"Could not parse JSON in {filename}")
        return

    json_str = match.group(1)
    try:
        local_data = json.loads(json_str)
    except Exception as e:
        print(f"JSON Error in {filename}: {e}")
        return

    # 2. Check for missing
    missing_indices = []
    hadiths = local_data.get('hadiths', [])
    for i, h in enumerate(hadiths):
        if not h.get('text', '').strip():
            missing_indices.append(i)

    if not missing_indices:
        print(f"No missing text in {book_id}")
        return

    print(f"Found {len(missing_indices)} missing items in {book_id}. Fetching fallback...")

    # 3. Download Fallback Data
    fallback_url = f"{API_BASE}/{edition_name}.json"
    fallback_data = download_json(fallback_url)
    
    if not fallback_data:
        return

    # Create lookup map for fallback
    # hadithnumber is the unique key per book usually
    fallback_map = {h['hadithnumber']: h['text'] for h in fallback_data.get('hadiths', [])}

    # 4. Patch Data
    patched_count = 0
    for i in missing_indices:
        h = hadiths[i]
        h_num = h['hadithnumber']
        
        replacement = fallback_map.get(h_num)
        if replacement:
            # We prefix so user knows it's English/Fallback
            # Check if it's actually English or whatever the source is.
            h['text'] = replacement
            # Optional: Add a note field? The UI uses 'text'.
            # h['text_lang'] = 'en'
            patched_count += 1
        else:
            print(f"  Warning: Hadith {h_num} not found in fallback source.")

    print(f"Patched {patched_count} items in {book_id}")

    # 5. Save File
    # Reconstruct JS file
    # Ensure window assignment matches original
    # We use indent=4 to match typical pretty print, though original might be different.
    # The regex captured the object. We reconstruct: window.HADITH_DATA_{ID} = { ... }
    
    var_name = f"HADITH_DATA_{book_id.upper()}"
    new_content = f"window.{var_name} = \n{json.dumps(local_data, indent=4)};"
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Saved {filename}")

def main():
    # Only fix specific books that we know have issues or all?
    # User said "many hadiths... check if data... didn't exist"
    # We found bugs in bukhari, malik, etc.
    
    # Let's fix all defined in map
    for book_id, edition_name in BOOK_MAP.items():
        fix_book(book_id, edition_name)

if __name__ == "__main__":
    main()
