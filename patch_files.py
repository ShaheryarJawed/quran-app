import json
import os
import re

def patch_js_file(js_filename, patch_json_filename, var_name):
    print(f"Patching {js_filename} with {patch_json_filename}...")
    
    if not os.path.exists(patch_json_filename):
        print(f"  Patch file {patch_json_filename} not found.")
        return

    with open(patch_json_filename, 'r', encoding='utf-8') as f:
        patch_data = json.load(f)
        
    print(f"  Loaded {len(patch_data)} updates.")
    
    with open(js_filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON
    match = re.search(r'=\s*(\{[\s\S]*\});?', content)
    if not match: 
        print("  Could not find JSON object in JS file.")
        return

    json_str = match.group(1)
    try:
        data = json.loads(json_str)
    except Exception as e:
        print(f"  JSON decode error: {e}")
        return

    hadiths = data.get('hadiths', [])
    updated_count = 0
    
    for h in hadiths:
        hid_str = str(h.get('hadithnumber'))
        
        # If we have an update
        if hid_str in patch_data:
            new_text = patch_data[hid_str]
            # Verify it's not empty
            if new_text and len(new_text) > 5:
                # Update only if current text is empty or placeholder (or just overwrite if we trust patch)
                # User asked to add missing data.
                current_text = h.get('text', '').strip()
                if not current_text or "معذرت" in current_text:
                    h['text'] = new_text
                    updated_count += 1
    
    if updated_count > 0:
        print(f"  Applied {updated_count} updates.")
        # Reconstruct file
        new_json = json.dumps(data, indent=4, ensure_ascii=False)
        new_content = f"window.{var_name} = \n{new_json};"
        
        with open(js_filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("  Saved JS file.")
    else:
        print("  No updates applied (maybe already updated).")

def main():
    patch_js_file("hadith_bukhari.js", "bukhari_patch.json", "HADITH_DATA_BUKHARI")
    patch_js_file("hadith_nasai.js", "nasai_patch.json", "HADITH_DATA_NASAI")

if __name__ == "__main__":
    main()
