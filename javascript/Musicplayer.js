const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const trackTitle = document.getElementById('track-title');
const playlistItems = document.querySelectorAll('#playlist li');

let currentTrackIndex = 0;
let isPlayerInitialized = false;

// Function to load a track
function loadTrack(index) {
    if (index >= 0 && index < playlistItems.length) {
        const item = playlistItems[index];
        audioPlayer.src = item.getAttribute('data-src');
        trackTitle.textContent = item.textContent;
        playlistItems.forEach(li => li.classList.remove('playing'));
        item.classList.add('playing');
        currentTrackIndex = index;
        isPlayerInitialized = true;
    }
}

// Function to handle the play/pause button click
function playPauseTrack() {
    // If the player hasn't been started, load the first track.
    if (!isPlayerInitialized) {
        loadTrack(0);
    }

    // Toggle play/pause
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

// Update the button icon based on the player's actual state
audioPlayer.addEventListener('play', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

audioPlayer.addEventListener('pause', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Function to play the next track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlistItems.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
}

// Function to play the previous track
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlistItems.length) % playlistItems.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
}

// Add event listeners to buttons
playPauseBtn.addEventListener('click', playPauseTrack);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// Go to the next song when the current one ends
audioPlayer.addEventListener('ended', nextTrack);

// Add event listeners to playlist items
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        loadTrack(index);
        audioPlayer.play();
    });
});
