// --- NEW JAVASCRIPT for Draggable and Minimizable Sidebar ---
const sidebar = document.getElementById('sidebar');
const sidebarHeader = sidebar.querySelector('.sidebar-header');
const minimizeBtn = sidebar.querySelector('.minimize-btn');

let isDragging = false;
let offsetX, offsetY;

// Drag functionality
sidebarHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - sidebar.offsetLeft;
    offsetY = e.clientY - sidebar.offsetTop;
    sidebar.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // Constrain to viewport
    const maxX = window.innerWidth - sidebar.offsetWidth;
    const maxY = window.innerHeight - sidebar.offsetHeight;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > maxX) newX = maxX;
    if (newY > maxY) newY = maxY;

    sidebar.style.left = `${newX}px`;
    sidebar.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    sidebar.style.cursor = 'move';
});

// Minimize functionality
minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent drag from starting on button click
    sidebar.classList.toggle('minimized');
});