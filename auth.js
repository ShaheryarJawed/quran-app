// SHARED AUTH LOGIC
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

function initAuth() {
    const authContainer = document.getElementById('auth-container');
    const notifBtn = document.getElementById('header-notif-btn');
    const signInBtn = document.getElementById('btn-signin');

    if (!authContainer) return;

    if (currentUser) {
        // STATE: LOGGED IN
        if (notifBtn) notifBtn.style.display = 'block'; // Show Notifications

        // Render Profile Chip
        const initials = currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ME';

        authContainer.innerHTML = `
            <div id="header-profile-chip" class="user-chip" title="Account: ${currentUser.email}" style="cursor:pointer; display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.1); padding:0.3rem 0.8rem 0.3rem 0.3rem; border-radius:30px;">
                ${currentUser.photo ?
                `<img src="${currentUser.photo}" class="avatar-portal" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">` :
                `<div class="avatar-portal" style="width:32px; height:32px; border-radius:50%; background:${currentUser.color || '#fbbf24'}; color:#0f172a; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">${initials}</div>`
            }
                <i class='bx bx-chevron-down' style="color:white; opacity:0.7;"></i>
            </div>
        `;

        // Settings/Logout Handler
        const chip = document.getElementById('header-profile-chip');
        if (chip) {
            chip.onclick = () => {
                const action = confirm(`Signed in as ${currentUser.name}\n\nDo you want to Log Out?`);
                if (action) signOut();
            };
        }

    } else {
        // STATE: GUEST
        if (notifBtn) notifBtn.style.display = 'none'; // Hide Notifications

        // Sign In Handler
        if (signInBtn) {
            signInBtn.onclick = mockGoogleLogin;
        }
    }
}

function mockGoogleLogin() {
    const mockUser = {
        name: "Shaheryar Jawed",
        email: "shaheryar@example.com",
        photo: null,
        color: "#10b981",
        joined: new Date().toISOString()
    };

    if (confirm("Sign In with Google\n\n[Shaheryar Jawed]\nshaheryar@example.com\n\nContinue?")) {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        window.location.reload();
    }
}

function signOut() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}
