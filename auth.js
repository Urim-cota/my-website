// Authentication System for TeknoLajme.al Admin Panel

// Mock user database (in production, this would be server-side)
const users = {
    'admin@teknolajme.al': {
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        lastLogin: null
    },
    'editor@teknolajme.al': {
        password: 'editor123',
        role: 'editor',
        name: 'Editor User',
        lastLogin: null
    }
};

// Session management
class SessionManager {
    constructor() {
        this.sessionKey = 'teknolajme_admin_session';
        this.tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }

    setSession(userData) {
        const session = {
            user: userData,
            timestamp: Date.now(),
            expires: Date.now() + this.tokenExpiry
        };
        
        // Store in memory (in production, use secure httpOnly cookies)
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    getSession() {
        const sessionData = sessionStorage.getItem(this.sessionKey);
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        
        // Check if session is expired
        if (Date.now() > session.expires) {
            this.clearSession();
            return null;
        }

        return session;
    }

    clearSession() {
        sessionStorage.removeItem(this.sessionKey);
    }

    isAuthenticated() {
        return this.getSession() !== null;
    }

    getCurrentUser() {
        const session = this.getSession();
        return session ? session.user : null;
    }
}

const sessionManager = new SessionManager();

// Authentication functions
function hashPassword(password) {
    // Simple hash for demo (use proper hashing like bcrypt in production)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

function validateCredentials(email, password) {
    const user = users[email];
    if (!user) {
        return { success: false, message: 'Email nuk ekziston në sistem' };
    }

    if (user.password !== password) {
        return { success: false, message: 'Fjalëkalimi është i gabuar' };
    }

    return { success: true, user: user };
}

function showError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

function showLoading(show) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const loginBtn = document.querySelector('.login-btn');
    
    if (show) {
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        loginBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        loginBtn.disabled = false;
    }
}

// Initialize login form
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (sessionManager.isAuthenticated()) {
        // Redirect to dashboard if already authenticated
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add enter key support for form fields
    document.getElementById('email')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });

    document.getElementById('password')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });

    // Clear any existing errors when user starts typing
    document.getElementById('email')?.addEventListener('input', clearErrors);
    document.getElementById('password')?.addEventListener('input', clearErrors);
});

function clearErrors() {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv && !errorDiv.classList.contains('hidden')) {
        errorDiv.classList.add('hidden');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Validate input
    if (!email || !password) {
        showError('Ju lutem plotësoni të gjitha fushat');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Formati i email-it nuk është i saktë');
        return;
    }

    showLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const result = validateCredentials(email, password);
        
        if (result.success) {
            // Update last login
            users[email].lastLogin = new Date().toISOString();
            
            // Create user session data
            const userData = {
                email: email,
                name: result.user.name,
                role: result.user.role,
                loginTime: new Date().toISOString()
            };

            // Set session
            sessionManager.setSession(userData);

            // Show success message
            document.querySelector('.login-card').innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">✅</div>
                    <h2 style="color: #2ed573; margin-bottom: 15px;">Kyçja e suksesshme!</h2>
                    <p style="color: #666; margin-bottom: 20px;">Mirë se erdhët, ${userData.name}</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <p style="font-size: 0.9rem; color: #666;">Duke ju drejtuar në panel...</p>
                    </div>
                </div>
            `;

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } else {
            showError(result.message);
            showLoading(false);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Ka ndodhur një gabim gjatë kyçjes. Ju lutem provoni përsëri.');
        showLoading(false);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Logout function
function logout() {
    sessionManager.clearSession();
    
    // Show logout confirmation
    if (confirm('Jeni të sigurt që doni të dilni nga paneli?')) {
        window.location.href = 'login.html';
    }
}

// Check authentication on protected pages
function requireAuth() {
    if (!sessionManager.isAuthenticated()) {
        alert('Ju duhet të kyçeni për të aksesuar këtë faqe');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Auto-logout on session expiry
function startSessionMonitor() {
    setInterval(() => {
        if (!sessionManager.isAuthenticated()) {
            alert('Sesioni juaj ka skaduar. Ju lutem kyçuni përsëri.');
            window.location.href = 'login.html';
        }
    }, 60000); // Check every minute
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('Të paktën 8 karaktere');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Një shkronjë të madhe');

    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Një shkronjë të vogël');

    if (/\d/.test(password)) strength++;
    else feedback.push('Një numër');

    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Një karakter special');

    const levels = ['Shumë i dobët', 'I dobët', 'Mesatar', 'I mirë', 'Shumë i mirë'];
    
    return {
        score: strength,
        level: levels[strength] || levels[0],
        feedback: feedback
    };
}

// Rate limiting for login attempts
class RateLimiter {
    constructor() {
        this.attempts = new Map();
        this.maxAttempts = 5;
        this.windowMs = 15 * 60 * 1000; // 15 minutes
    }

    isBlocked(identifier) {
        const record = this.attempts.get(identifier);
        if (!record) return false;

        // Clean old attempts
        const now = Date.now();
        record.attempts = record.attempts.filter(time => now - time < this.windowMs);

        return record.attempts.length >= this.maxAttempts;
    }

    recordAttempt(identifier) {
        const now = Date.now();
        const record = this.attempts.get(identifier) || { attempts: [] };
        
        record.attempts.push(now);
        this.attempts.set(identifier, record);
    }

    getRemainingTime(identifier) {
        const record = this.attempts.get(identifier);
        if (!record || record.attempts.length === 0) return 0;

        const oldestAttempt = Math.min(...record.attempts);
        const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
        
        return Math.max(0, timeLeft);
    }
}

const rateLimiter = new RateLimiter();

// Enhanced login with rate limiting
async function handleLoginWithRateLimit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const clientIP = 'user_browser'; // In production, get real IP
    
    if (rateLimiter.isBlocked(clientIP)) {
        const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientIP) / 60000);
        showError(`Shumë tentativa të dështuara. Provoni përsëri pas ${remainingTime} minutash.`);
        return;
    }

    // Record this attempt
    rateLimiter.recordAttempt(clientIP);
    
    // Continue with normal login process
    await handleLogin(event);
}

// Export functions for use in other files
window.auth = {
    sessionManager,
    logout,
    requireAuth,
    startSessionMonitor,
    checkPasswordStrength
};