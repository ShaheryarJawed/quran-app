/**
 * Shared Authentication Logic
 * Handles Profile Chip, Sign Out, and User State across all pages.
 */

const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

function initAuth() {
    // Attempt to find containers in different page structures
    // Portal/Dashboard style (index.html) usually has #auth-container
    // Library pages (quran.html) usually has .nav-actions-portal > .user-chip

    // 1. Selector Strategy
    let authContainer = document.getElementById('auth-container');
    let userChip = document.querySelector('.user-chip');

    // If we rely on generic .user-chip (Library Pages)
    // Note: Library pages usually hardcode the chip, we need to replace/update it.

    if (currentUser) {
        // --- LOGGED IN STATE ---

        // Prepare HTML for the User Chip + Dropdown
        const initials = currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ME';
        const avatarBg = currentUser.color || '#fbbf24';

        const chipHtml = `
            <div id="header-profile-chip" title="Account: ${currentUser.email}" style="cursor:pointer; display:flex; align-items:center;">
                ${currentUser.photo ?
                `<img src="${currentUser.photo}" class="avatar-portal" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid #fbbf24;">` :
                `<div class="avatar-portal" style="width:36px; height:36px; border-radius:50%; background:${avatarBg}; color:#0f172a; display:flex; align-items:center; justify-content:center; font-weight:bold; border:2px solid rgba(255,255,255,0.2);">${initials}</div>`
            }
            </div>
            
            <!-- Dropdown Menu -->
            <div id="user-dropdown" style="display:none; position:absolute; top:120%; right:0; width:200px; background:#1e293b; border:1px solid rgba(255,255,255,0.1); border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5); overflow:hidden; z-index:1000; text-align:left; animation:fadeIn 0.2s ease;">
                <div style="padding:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
                    <p style="color:white; font-size:0.9rem; margin:0; font-weight:600;">${currentUser.name}</p>
                    <p style="color:#94a3b8; font-size:0.8rem; margin:0; text-overflow:ellipsis; overflow:hidden;">${currentUser.email}</p>
                </div>
                <a href="profile.html" style="display:block; padding:0.8rem 1rem; color:#cbd5e1; text-decoration:none; transition:background 0.2s; font-size:0.9rem;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'"><i class='bx bx-user'></i> My Profile</a>
                <a href="settings.html" style="display:block; padding:0.8rem 1rem; color:#cbd5e1; text-decoration:none; transition:background 0.2s; font-size:0.9rem;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'"><i class='bx bx-cog'></i> Settings</a>
                <div style="border-top:1px solid rgba(255,255,255,0.1);"></div>
                <a href="#" id="action-logout" style="display:block; padding:0.8rem 1rem; color:#f87171; text-decoration:none; transition:background 0.2s; font-size:0.9rem;" onmouseover="this.style.background='rgba(248, 113, 113, 0.1)'" onmouseout="this.style.background='transparent'"><i class='bx bx-log-out'></i> Sign Out</a>
            </div>
        `;

        // INJECTION LOGIC
        if (authContainer) {
            // Dashboard Style: Replace innerHTML
            authContainer.innerHTML = `<div style="position:relative;">${chipHtml}</div>`;
        } else if (userChip) {
            // Library Page Style: The .user-chip div exists. 
            // We want to replace it or fill it. 
            // It's usually inside .nav-actions-portal
            // Let's replace the .user-chip OuterHTML with our wrapped structure to handle positioning
            // OR just populate it.

            // To support the absolute positioning of dropdown, ensure parent is relative
            // But library pages might not have a wrapper.
            // Let's clean it up:
            const parent = userChip.parentElement;

            // Create a wrapper
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.className = 'user-chip-wrapper';
            wrapper.innerHTML = chipHtml;

            // Replace old chip
            parent.replaceChild(wrapper, userChip);
        }

        // --- ATTACH LISTENERS ---
        // (Re-select elements from new DOM)
        const chip = document.getElementById('header-profile-chip');
        const dropdown = document.getElementById('user-dropdown');
        const logout = document.getElementById('action-logout');

        if (chip && dropdown) {
            chip.onclick = (e) => {
                e.stopPropagation();
                const isVisible = dropdown.style.display === 'block';
                dropdown.style.display = isVisible ? 'none' : 'block';
            };
        }

        if (logout) {
            logout.onclick = (e) => {
                e.preventDefault();
                signOut();
            };
        }

        // Close on click outside
        document.addEventListener('click', () => {
            if (dropdown) dropdown.style.display = 'none';
        });

    } else {
        // --- GUEST STATE ---
        // If guest, show Sign In button
        // For Dashboard
        if (authContainer) {
            authContainer.innerHTML = `
                <a href="auth.html" class="btn-portal-secondary" style="color:white; border-color:rgba(255,255,255,0.3); padding:0.4rem 1.2rem; font-size:0.9rem; text-decoration:none; display:inline-block;">Sign In</a>
            `;
        }
        // For Library Pages (userChip)
        else if (userChip) {
            // Replace chip with Link
            const parent = userChip.parentElement;
            const link = document.createElement('a');
            link.href = 'auth.html';
            link.className = 'btn-portal-secondary';
            link.style.cssText = "color:white; border:1px solid rgba(255,255,255,0.3); padding:0.4rem 1rem; border-radius:20px; font-size:0.9rem; text-decoration:none; display:inline-block;";
            link.textContent = "Sign In";
            parent.replaceChild(link, userChip);
        }
    }
}

function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Auto Init on Load
document.addEventListener('DOMContentLoaded', initAuth);
