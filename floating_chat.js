/**
 * Floating AI Chat Button
 * Shows on all pages for logged-in users only
 * WhatsApp-style floating button that links to AI Scholar
 */

(function () {
    'use strict';

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Only show for logged-in users
    if (!currentUser) return;

    // Don't show on AI chat page itself
    if (window.location.pathname.includes('ai-chat.html')) return;

    // Create floating button
    const floatingBtn = document.createElement('a');
    floatingBtn.href = 'ai-chat.html';
    floatingBtn.id = 'ai-floating-btn';
    floatingBtn.title = 'AI Islamic Scholar';
    floatingBtn.innerHTML = `
        <i class='bx bx-bot'></i>
        <span class="ai-btn-label">Ask AI</span>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        #ai-floating-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
            text-decoration: none;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        #ai-floating-btn:hover {
            width: 140px;
            border-radius: 30px;
            transform: scale(1.05);
            box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
        }

        #ai-floating-btn .ai-btn-label {
            position: absolute;
            opacity: 0;
            white-space: nowrap;
            font-size: 0.9rem;
            font-weight: 600;
            margin-left: 8px;
            transition: opacity 0.2s ease;
        }

        #ai-floating-btn:hover .ai-btn-label {
            opacity: 1;
            position: relative;
        }

        #ai-floating-btn:hover i {
            margin-right: 4px;
        }

        /* Pulse animation */
        #ai-floating-btn::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            animation: pulse-ring 2s ease-out infinite;
            z-index: -1;
        }

        @keyframes pulse-ring {
            0% {
                transform: scale(1);
                opacity: 0.5;
            }
            100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
            #ai-floating-btn {
                bottom: 80px; /* Above mobile nav */
                right: 16px;
                width: 56px;
                height: 56px;
                font-size: 1.5rem;
            }

            #ai-floating-btn:hover {
                width: 56px;
                border-radius: 50%;
            }

            #ai-floating-btn .ai-btn-label {
                display: none;
            }
        }

        /* New message indicator */
        #ai-floating-btn .new-dot {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            background: #fbbf24;
            border-radius: 50%;
            border: 2px solid #059669;
        }
    `;

    // Inject into page
    document.head.appendChild(styles);
    document.body.appendChild(floatingBtn);

    // Add tooltip on first visit
    const hasSeenTip = localStorage.getItem('ai_scholar_tip_seen');
    if (!hasSeenTip) {
        setTimeout(() => {
            const tooltip = document.createElement('div');
            tooltip.id = 'ai-tooltip';
            tooltip.innerHTML = `
                <div style="position:fixed; bottom:94px; right:24px; background:#1e293b; color:white; padding:1rem; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.3); max-width:200px; z-index:10000; animation:fadeIn 0.3s ease;">
                    <p style="margin:0 0 0.5rem 0; font-size:0.9rem;">🌙 <strong>New!</strong> Ask our AI Islamic Scholar any question!</p>
                    <button onclick="this.parentElement.parentElement.remove(); localStorage.setItem('ai_scholar_tip_seen','1');" style="background:#10b981; color:white; border:none; padding:0.4rem 0.8rem; border-radius:8px; font-size:0.8rem; cursor:pointer;">Got it!</button>
                    <div style="position:absolute; bottom:-8px; right:24px; width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid #1e293b;"></div>
                </div>
            `;
            document.body.appendChild(tooltip);
        }, 2000);
    }
})();
