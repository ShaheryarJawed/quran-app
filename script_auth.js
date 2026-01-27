document.addEventListener('DOMContentLoaded', () => {

    // TAB SWITCHING LOGIC
    const tabs = document.querySelectorAll('.auth-tab');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
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

    // --- REAL FIREBASE AUTH LOGIC ---

    const auth = firebase.auth();
    const btnGoogle = document.getElementById('btn-google-login');

    // Helper: Check Config
    function checkConfig() {
        if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
            alert("CRITICAL: You need to configure Firebase!\n\n1. Open 'firebase-config.js'\n2. Paste your keys from the Firebase Console.");
            return false;
        }
        return true;
    }

    // Helper: Save User & Redirect
    function handleAuthSuccess(user) {
        // Bridge to existing App Logic
        const appUser = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            photo: user.photoURL,
            provider: user.providerData[0]?.providerId || 'email',
            joined: new Date().toISOString()
        };

        // Save to LocalStorage (Legacy Bridge)
        localStorage.setItem('currentUser', JSON.stringify(appUser));

        // Redirect
        window.location.href = 'index.html';
    }

    // 1. Google Login
    btnGoogle.addEventListener('click', () => {
        if (!checkConfig()) return;

        const provider = new firebase.auth.GoogleAuthProvider();

        btnGoogle.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Check Popup...`;

        auth.signInWithPopup(provider)
            .then((result) => {
                handleAuthSuccess(result.user);
            })
            .catch((error) => {
                console.error(error);
                btnGoogle.innerHTML = `<i class='bx bx-error'></i> Error: ${error.message}`;
            });
    });

    // 2. Email Signup
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkConfig()) return;

        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        const btn = signupForm.querySelector('button');

        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Creating Account...`;

        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user;
                // Update Profile with Name
                user.updateProfile({ displayName: name })
                    .then(() => handleAuthSuccess(user));
            })
            .catch((error) => {
                btn.innerHTML = "Create Account";
                alert(error.message);
            });
    });

    // 3. Email Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkConfig()) return;

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        const btn = loginForm.querySelector('button');

        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Verifying...`;

        auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                handleAuthSuccess(result.user);
            })
            .catch((error) => {
                btn.innerHTML = "Sign In";
                alert(error.message);
            });
    });

});
