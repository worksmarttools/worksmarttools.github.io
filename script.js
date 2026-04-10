const API_URL = 'https://script.google.com/macros/s/AKfycbwmfa_qitTYgVA4oummscukjX7vXGFZCdbHPgZq7ZLnbffaaVhNbJvrHUVwfPOONufF/exec';

const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const loginFormElement = document.getElementById('loginFormElement');
const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeUsername = document.getElementById('welcomeUsername');

function checkSession() {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
        showDashboard(user);
        return true;
    }
    return false;
}

function showDashboard(username) {
    welcomeUsername.textContent = username;
    loginForm.classList.remove('active');
    dashboard.classList.add('active');
}

function showLoginForm() {
    loginForm.classList.add('active');
    dashboard.classList.remove('active');
}

function logout() {
    localStorage.removeItem('loggedInUser');
    showLoginForm();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        if (element.textContent === message) element.textContent = '';
    }, 3000);
}

async function authenticateUser(username, password) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showMessage(loginMessage, 'Enter username and password', 'error');
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    const result = await authenticateUser(username, password);
    
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
    
    if (result.success) {
        localStorage.setItem('loggedInUser', result.username);
        showMessage(loginMessage, result.message, 'success');
        setTimeout(() => showDashboard(result.username), 500);
    } else {
        showMessage(loginMessage, result.message, 'error');
    }
}

function handleLogout() {
    logout();
    showMessage(loginMessage, 'Logged out', 'success');
}

loginFormElement.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

if (!checkSession()) showLoginForm();
