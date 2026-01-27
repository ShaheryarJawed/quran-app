import json
import os
import urllib.request
import ssl

DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"
MISSING_REPORT = "missing_report.json"

# Map internal book names to API keys
# Based on editions.json found:
API_MAP = {
    "ibnmajah": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-ibnmajah.json",
    "abudawud": "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-abudawud.json",
    # Add others as confirmed
}

def fetch_data(url):
    print(f"Fetching {url}...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    with urllib.request.urlopen(url, context=ctx) as response:
        return json.loads(response.read().decode('utf-8'))

def patch_book(book_name, missing_ids):
    if book_name not in API_MAP:
        print(f"No API URL known for {book_name}")
        return

    # 1. Fetch Urdu Data
    api_data = fetch_data(API_MAP[book_name])
    remote_hadiths = api_data.get('hadiths', [])
    
    # Index remote data by hadithnumber
    # Note: API might use different numbering (reference vs simple). 
    # Usually 'hadithnumber' matches typical schemes.
    remote_map = {}
    for h in remote_hadiths:
        # API returns 'hadithnumber' as integer usually
        num = h.get('hadithnumber')
        text = h.get('text', '').strip()
        if num and text:
            remote_map[num] = text

    # 2. Open Local File
    filename = f"hadith_{book_name}.js"
    filepath = os.path.join(DIRECTORY, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # extract JS object
    import re
    match = re.search(r'=\s*(\{[\s\S]*\});?', content)
    if not match:
        print(f"Could not parse {filename}")
        return
    
    js_data = json.loads(match.group(1))
    local_hadiths = js_data.get('hadiths', [])
    
    patched_count = 0
    
    # 3. Patch
    for h in local_hadiths:
        num = h['hadithnumber']
        if num in missing_ids:
            if num in remote_map:
                new_text = remote_map[num]
                # Validate it's not empty inside JSON too
                if new_text and len(new_text) > 5:
                    h['text'] = new_text
                    patched_count += 1
                else:
                    print(f"Remote text for {num} is empty/short")
            else:
                print(f"Hadith {num} not found in remote source")

    if patched_count > 0:
        print(f"Applying {patched_count} patches to {filename}...")
        # Reconstruct JS file
        # Preserve variable name roughly
        var_name = f"HADITH_DATA_{book_name.upper()}"
        if book_name == "ibnmajah": var_name = "HADITH_DATA_IBNMAJAH" # Handle naming quirks if any
        # actually let's just use the regex match start/end to replace the JSON part safely?
        # Re-dumping might change formatting, but it ensures validity.
        
        # We need to construct the valid JS string again.
        # "window.HADITH_DATA_BOOK = { ... };"
        
        # Let's trust the logic to rewrite.
        
        # Check variable name from file content start
        var_match = re.search(r'(window\.[A-Za-z0-9_]+)\s*=', content)
        if var_match:
            var_decl = var_match.group(1)
            new_content = f"{var_decl} = \n{json.dumps(js_data, indent=4, ensure_ascii=False)};"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Saved.")
        else:
            print("Could not detect variable name, skipping save.")
    else:
        print("No patches applied.")

def main():
    if not os.path.exists(MISSING_REPORT):
        print("Missing report not found")
        return

    with open(MISSING_REPORT, 'r') as f:
        report = json.load(f)
    
    # Target specific books based on plan
    target = "abudawud"
    if target in report:
        print(f"Patching {target} ({len(report[target])} missing)...")
        patch_book(target, report[target])
    else:
        print(f"{target} has no missing items reported.")

if __name__ == "__main__":
    main()
