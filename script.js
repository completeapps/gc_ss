// Saint Series SS - Map with Toggle

let mapCollapsed = false;

// Initialize OpenStreetMap
const map = L.map('map').setView([41.5247, -90.5681], 13); // Bettendorf, Iowa

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Toggle button
const toggleBtn = document.getElementById('mapToggle');

toggleBtn.addEventListener('click', function() {
    mapCollapsed = !mapCollapsed;
    
    if (mapCollapsed) {
        document.getElementById('map').classList.add('collapsed');
        this.textContent = '▲ Expand Map';
        document.body.classList.add('map-collapsed');
    } else {
        document.getElementById('map').classList.remove('collapsed');
        this.textContent = '▼ Collapse Map';
        document.body.classList.remove('map-collapsed');
    }
    
    // Trigger map resize after animation
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
});
