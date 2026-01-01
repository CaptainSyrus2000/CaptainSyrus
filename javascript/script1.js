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

// Music Player Drawer Toggle
function toggleMusicPlayer() {
    const drawer = document.getElementById('music-drawer');
    if(drawer) {
        drawer.classList.toggle('open');
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
const themes = ['gamecube', 'notitg'];
let currentThemeIndex = 0; // Default: GameCube

function toggleTheme() {
    console.log("Button clicked. Toggling theme...");

    // 1. Trigger Refresh Animation (Visual flair)
    document.body.style.opacity = '0';

    setTimeout(() => {
        // 2. Cycle Theme
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];

        console.log("Switching to theme:", newTheme);

        // 3. Apply Theme to Body
        if (newTheme === 'gamecube') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', newTheme);
        }

        // 4. Update Shader
        // Dispatch custom event for bg-shader.js
        const event = new CustomEvent('themeChanged', { detail: { theme: newTheme } });
        window.dispatchEvent(event);

        // 5. Fade back in
        document.body.style.opacity = '1';
    }, 200);
}