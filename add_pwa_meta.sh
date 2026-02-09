#!/bin/bash
# Add PWA meta tags to all HTML files

META_TAGS='<link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#fbbf24">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="DeenSphere">
    <link rel="apple-touch-icon" href="/icon-192.png">'

for file in *.html; do
    if [ -f "$file" ]; then
        # Check if manifest already added
        if ! grep -q 'rel="manifest"' "$file"; then
            # Add after viewport meta tag
            sed -i.pwa "/<meta name=\"viewport\"/a\\
$META_TAGS
" "$file"
            echo "Added PWA meta to $file"
        else
            echo "PWA meta already in $file"
        fi
    fi
done
