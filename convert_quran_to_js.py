
import json

try:
    with open('quran.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Wrap in window.ISLAMIC_DATA.quran_full or similar global
    # We'll use window.GLOBAL_QURAN_DATA for distinct access
    js_content = f"window.GLOBAL_QURAN_DATA = {json.dumps(data)};"

    with open('quran_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print("Success: quran_data.js created.")

except Exception as e:
    print(f"Error: {e}")
