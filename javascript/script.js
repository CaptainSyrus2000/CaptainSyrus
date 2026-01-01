// Tab Switching
function switchTab(e, tabId) {
    // 1. Hide all content views
    const views = document.querySelectorAll('.content-view');
    views.forEach(view => view.classList.remove('active'));

    // 2. Show the target content view
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');

    // 3. Update active nav-box state
    const boxes = document.querySelectorAll('.nav-box');
    boxes.forEach(box => box.classList.remove('active'));

    // If triggered by click, update the clicked element
    if(e && e.currentTarget) {
        e.currentTarget.classList.add('active');
    } else if (tabId) {
        // Fallback for initial load
        const activeBox = document.getElementById('tab-' + tabId.substring(0, 4));
        if(activeBox) activeBox.classList.add('active');
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

// --- CALENDAR LOGIC ---
function buildCalendar() {
    const calGrid = document.getElementById('calendar-grid');
    const calMonthYear = document.getElementById('calendar-month-year');

    if (!calGrid || !calMonthYear) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.getDate();

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    calMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    calGrid.innerHTML = '';

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    days.forEach(day => {
        const div = document.createElement('div');
        div.className = 'cal-day-name';
        div.textContent = day;
        calGrid.appendChild(div);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        calGrid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'cal-day';
        dayCell.textContent = d;
        if (d === today) {
            dayCell.classList.add('today');
        }
        calGrid.appendChild(dayCell);
    }
}
document.addEventListener('DOMContentLoaded', buildCalendar);

// --- TV LOGIC ---
const tvVideos = [
    "https://ia800500.us.archive.org/2/items/gamecube-commercials/Nintendo%20GameCube%20Commercial%20%28Launch%29.mp4",
    "https://ia800500.us.archive.org/2/items/gamecube-commercials/Luigi%27s%20Mansion%20Commercial.mp4",
    "https://ia800500.us.archive.org/2/items/gamecube-commercials/Super%20Smash%20Bros.%20Melee%20Commercial.mp4",
    "https://ia800500.us.archive.org/2/items/gamecube-commercials/Pikmin%20Commercial.mp4"
];
let currentVideoIndex = 0;
let isTVOn = false;

function toggleTVPower() {
    const screen = document.getElementById('tv-screen');
    const video = document.getElementById('tv-video');
    isTVOn = !isTVOn;

    if (isTVOn) {
        screen.classList.remove('tv-off');
        screen.classList.add('tv-on');
        video.play().catch(e => console.log("Auto-play prevented:", e));
    } else {
        screen.classList.remove('tv-on');
        screen.classList.add('tv-off');
        video.pause();
    }
}

function switchChannel() {
    if (!isTVOn) return;

    const video = document.getElementById('tv-video');
    const screen = document.getElementById('tv-screen');

    screen.classList.add('tv-static-active');

    setTimeout(() => {
        currentVideoIndex = (currentVideoIndex + 1) % tvVideos.length;
        video.src = tvVideos[currentVideoIndex];
        video.play();
        screen.classList.remove('tv-static-active');
    }, 300);
}