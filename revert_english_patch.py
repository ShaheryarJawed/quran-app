import os
import json
import re

# Directory
DIRECTORY = "/Users/shaheryarjawed/Desktop/Quran App"

def is_english(text):
    if not text: return False
    # Count latin chars
    latin_count = len(re.findall(r'[a-zA-Z]', text))
    # Count total non-space
    total = len(text.replace(" ", ""))
    if total == 0: return False
    
    # If more than 50% is Latin, likely English
    return (latin_count / total) > 0.5

def revert_books():
    files = [f for f in os.listdir(DIRECTORY) if f.startswith("hadith_") and f.endswith(".js")]
    
    for filename in files:
        filepath = os.path.join(DIRECTORY, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        match = re.search(r'=\s*(\{[\s\S]*\});?', content)
        if not match: continue

        try:
            data = json.loads(match.group(1))
            hadiths = data.get('hadiths', [])
            
            reverted_count = 0
            for h in hadiths:
                text = h.get('text', '')
                if is_english(text):
                    h['text'] = "" # Clear it
                    reverted_count += 1
            
            if reverted_count > 0:
                print(f"Removed English from {reverted_count} items in {filename}")
                
                # Save
                var_name = f"HADITH_DATA_{filename.replace('hadith_', '').replace('.js', '').upper()}"
                new_content = f"window.{var_name} = \n{json.dumps(data, indent=4)};"
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                    
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    revert_books()
