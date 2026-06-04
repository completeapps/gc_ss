// Saint Series SS - Map with Toggle

let mapCollapsed = false;

// Initialize OpenStreetMap
const map = L.map('map').setView([41.5247, -90.5681], 13); // Bettendorf, Iowa

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('mapToggle');
    
    toggleBtn.addEventListener('click', function() {
        mapCollapsed = !mapCollapsed;
        const mapEl = document.getElementById('map');
        
        if (mapCollapsed) {
            mapEl.style.height = '40vh';
            this.textContent = '▲ Expand Map';
        } else {
            mapEl.style.height = '100vh';
            this.textContent = '▼ Collapse Map';
        }
        
        // Trigger map resize after animation
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    });
});
