// Helper function to fetch data from the server
async function fetchData(endpoint, elementId) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch from ${endpoint}`);
        }
        const data = await response.json();
        updateStatus(elementId, data);
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        document.getElementById(elementId).querySelector('p:nth-child(2) span').textContent = 'Error';
        document.getElementById(elementId).querySelector('p:nth-child(2) span').className = 'error';
    }
}

// Function to update the HTML with the fetched data
function updateStatus(elementId, data) {
    const element = document.getElementById(elementId);

    if (elementId === 'discord-status') {
        element.querySelector('p:nth-child(2) span').textContent = data.status;
        element.querySelector('p:nth-child(2) span').className = data.status === 'online' ? 'online' : 'offline';
        element.querySelector('p:nth-child(3) span').textContent = data.activity || 'N/A';
        element.querySelector('p:nth-child(3) span').className = data.activity ? 'playing' : '';
    } else if (elementId === 'steam-status') {
        element.querySelector('p:nth-child(2) span').textContent = data.online ? 'Online' : 'Offline';
        element.querySelector('p:nth-child(2) span').className = data.online ? 'online' : 'offline';
        element.querySelector('p:nth-child(3) span').textContent = data.game || 'N/A';
        element.querySelector('p:nth-child(3) span').className = data.game ? 'playing' : '';
    } else if (elementId === 'spotify-status') {
        element.querySelector('p:nth-child(2) span').textContent = data.song || 'N/A';
        element.querySelector('p:nth-child(3) span').textContent = data.artist || 'N/A';
    } else if (elementId === 'soundcloud-status') {
        element.querySelector('p:nth-child(2) span').textContent = data.track || 'N/A';
        element.querySelector('p:nth-child(3) span').textContent = data.artist || 'N/A';
    }
}

// Fetch data on page load and every 5 seconds
fetchData('/discord', 'discord-status');
setInterval(() => fetchData('/discord', 'discord-status'), 5000);

fetchData('/steam', 'steam-status');
setInterval(() => fetchData('/steam', 'steam-status'), 5000);

fetchData('/spotify', 'spotify-status');
setInterval(() => fetchData('/spotify', 'spotify-status'), 5000);

fetchData('/soundcloud', 'soundcloud-status');
setInterval(() => fetchData('/soundcloud', 'soundcloud-status'), 5000);
 