// JAVASCRIPT for Taskbar Dropdowns
const dropdownBtns = document.querySelectorAll('.dropdown-btn');

dropdownBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Close other open dropdowns
        document.querySelectorAll('.dropdown-content').forEach(content => {
            if (content !== this.nextElementSibling) {
                content.classList.remove('show');
            }
        });
        // Toggle the current one
        this.nextElementSibling.classList.toggle('show');
    });
});

// Close dropdowns if clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('show');
        });
    }
}