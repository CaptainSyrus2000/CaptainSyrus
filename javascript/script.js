// Tab Switching
function switchTab(tabId) {
    const views = document.querySelectorAll('.content-view');
    views.forEach(view => view.classList.remove('active'));

    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    const clockEl = document.getElementById('clock');
    if(clockEl) clockEl.innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- THEME SWITCHER LOGIC ---
const themes = ['retro', 'gamecube'];
let currentThemeIndex = 0; // Default is retro (index 0)

function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];

    // Set data attribute on body for CSS
    if (newTheme === 'retro') {
        document.body.removeAttribute('data-theme'); // Default style
    } else {
        document.body.setAttribute('data-theme', newTheme);
    }
}