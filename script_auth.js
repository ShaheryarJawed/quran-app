document.addEventListener('DOMContentLoaded', () => {

    // TAB SWITCHING LOGIC
    const tabs = document.querySelectorAll('.auth-tab');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');

            const mode = tab.dataset.tab;
            if (mode === 'login') {
                formTitle.textContent = "Welcome Back";
                formSubtitle.textContent = "Please enter your details to sign in.";
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
            } else {
                formTitle.textContent = "Create Account";
                formSubtitle.textContent = "Join DeenSphere for a personalized journey.";
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            }
        });
    });

    // --- AUTH SIMULATION LOGIC ---

    // 1. Google Login Simulation
    const btnGoogle = document.getElementById('btn-google-login');
    btnGoogle.addEventListener('click', () => {
        // Simulate API Call delay
        const originalText = btnGoogle.innerHTML;
        btnGoogle.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Signing in...`;

        setTimeout(() => {
            // Mock User Data
            const user = {
                name: "Shaheryar Jawed", // Fallback name or from previous context
                email: "user@gmail.com",
                photo: "https://lh3.googleusercontent.com/a/default-user=s96-c", // Google generic avatar
                provider: "google",
                joined: new Date().toISOString()
            };

            // Save to LocalStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirect to Home
            window.location.href = 'index.html';
        }, 1500);
    });

    // 2. Email Signup Simulation
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const btn = signupForm.querySelector('button');

        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Creating Account...`;

        setTimeout(() => {
            // Mock User Data (No photo for email users usually, generate initial avatar later)
            const user = {
                name: name,
                email: email,
                photo: null, // Will trigger Initials UI
                color: getRandomColor(),
                provider: "email",
                joined: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        }, 1500);
    });

    // 3. Email Login Simulation (Mock)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('button');
        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Verifying...`;

        setTimeout(() => {
            // For demo, just log them in as "Demo User" if they use email
            const user = {
                name: "Demo User",
                email: "demo@deensphere.com",
                photo: null,
                color: "#10b981", // Emerald
                provider: "email",
                joined: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        }, 1500);
    });

});

function getRandomColor() {
    const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];
    return colors[Math.floor(Math.random() * colors.length)];
}
