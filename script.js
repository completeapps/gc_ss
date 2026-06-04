// Saint Series SS - Just Map

// Initialize OpenStreetMap
const map = L.map('map').setView([41.5247, -90.5681], 13); // Bettendorf, Iowa

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);
