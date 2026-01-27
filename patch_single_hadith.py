import sys
import json
import os
import re

DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"

def patch_single(book, hadith_num, text):
    filename = f"hadith_{book}.js"
    filepath = os.path.join(DIRECTORY, filename)
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract JS object
        match = re.search(r'=\s*(\{[\s\S]*\});?', content)
        if not match:
            print(f"Could not parse JS object in {filename}")
            return

        js_data = json.loads(match.group(1))
        hadiths = js_data.get('hadiths', [])
        
        updated = False
        for h in hadiths:
            # Flexible comparison for ID (int vs str)
            if str(h.get('hadithnumber')) == str(hadith_num):
                h['text'] = text
                updated = True
                break
        
        if updated:
            # Reconstruct JS file
            # We need to find the variable declaration again
            var_match = re.search(r'(window\.[A-Za-z0-9_]+)\s*=', content)
            if var_match:
                var_decl = var_match.group(1)
                new_content = f"{var_decl} = \n{json.dumps(js_data, indent=4, ensure_ascii=False)};"
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Successfully patched {book} #{hadith_num}")
            else:
                print("Could not find variable declaration to rewrite file.")
        else:
            print(f"Hadith #{hadith_num} not found in {book}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 patch_single_hadith.py <book> <number> <text>")
    else:
        book = sys.argv[1]
        num = sys.argv[2]
        # Allow text to be passed as single arg or joined
        text = " ".join(sys.argv[3:])
        patch_single(book, num, text)
