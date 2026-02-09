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
        // Enforce Email Verification for Email/Password provider
        if (user.providerData[0]?.providerId === 'password' && !user.emailVerified) {
            auth.signOut();
            alert("🔒 Email Verification Required\n\nPlease check your inbox and verify your email address before signing in.");
            return;
        }

        // Bridge to existing App Logic
        const appUser = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            photo: user.photoURL,
            provider: user.providerData[0]?.providerId || 'email',
            joined: new Date().toISOString()
        };

        // Save to LocalStorage (Legacy Bridge for simple state)
        localStorage.setItem('currentUser', JSON.stringify(appUser));

        // Redirect
        window.location.href = 'index.html';
    }

    // 1. Google Login (Auto Verified)
    btnGoogle.addEventListener('click', () => {
        if (!checkConfig()) return;
        const provider = new firebase.auth.GoogleAuthProvider();
        btnGoogle.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Check Popup...`;

        auth.signInWithPopup(provider)
            .then((result) => handleAuthSuccess(result.user))
            .catch((error) => {
                console.error(error);
                btnGoogle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/> <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/> <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/> <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/> </svg> Continue with Google`;
                alert(error.message);
            });
    });

    // 2. Email Signup + Verification
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkConfig()) return;

        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = signupForm.querySelector('input[type="password"]').value;
        const btn = signupForm.querySelector('button');

        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Sending Verification...`;

        auth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                const user = result.user;

                // 1. Update Name
                user.updateProfile({ displayName: name }).then(() => {
                    // 2. Send Verification Email
                    user.sendEmailVerification().then(() => {
                        // 3. Sign Out (Don't let them in yet)
                        auth.signOut();

                        // 4. Feedback
                        btn.innerHTML = "Account Created";
                        alert(`✅ Account Created!\n\nWe have sent a verification email to:\n${email}\n\nPlease verify your email before signing in.`);

                        // Switch to Login Tab
                        tabs[0].click();
                    });
                });
            })
            .catch((error) => {
                btn.innerHTML = "Create Account";
                alert(error.message);
            });
    });

    // 3. Email Login (Strict)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkConfig()) return;

        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        const btn = loginForm.querySelector('button');

        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Verifying Credentials...`;

        auth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                // Check Verification
                if (!result.user.emailVerified) {
                    auth.signOut();
                    btn.innerHTML = "Sign In";

                    // Offer resend?
                    if (confirm("🔒 Email Not Verified.\n\nWould you like us to resend the verification link?")) {
                        result.user.sendEmailVerification()
                            .then(() => alert("Verification link resent!"))
                            .catch(err => alert("Error resending: " + err.message));
                    }
                    return;
                }

                // Success
                handleAuthSuccess(result.user);
            })
            .catch((error) => {
                btn.innerHTML = "Sign In";
                alert(error.message);
            });
    });

});
