#!/bin/bash

# Pages to update
PAGES="quran.html hadith.html duas.html tasbih.html seerah.html vault.html"

# Search HTML to add (before auth-container)
SEARCH_HTML='                <!-- Global Search -->\n                <div class="global-search-wrapper" style="position: relative;">\n                    <div class="search-input-wrapper">\n                        <i class='"'"'bx bx-search'"'"' style="position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 1.1rem;"></i>\n                        <input type="text" id="global-search-input" placeholder="Search..." \n                            style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; padding: 0.5rem 1rem 0.5rem 2.5rem; color: white; font-size: 0.9rem; width: 250px; outline: none; transition: all 0.3s;">\n                    </div>\n                    <!-- Search Results Dropdown -->\n                    <div id="search-results" class="search-results-dropdown" style="display: none;"></div>\n                </div>\n                '

for page in $PAGES; do
    if [ -f "$page" ]; then
        echo "Processing $page..."
        # Check if search already exists
        if grep -q "global-search-input" "$page"; then
            echo "  Search already exists in $page, skipping"
        else
            # Find the auth-container line and add search before it
            sed -i.bak '/<!-- Auth Container/i\
'"$SEARCH_HTML"'
' "$page"
            echo "  Added search to $page"
        fi
    fi
done

echo "Done!"
