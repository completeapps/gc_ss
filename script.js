// Saint Series SS Dashboard - Main Script

// Bettendorf, Iowa coordinates
const BETTENDORF_COORDS = [41.5247, -90.5681];

// Cache data storage
let caches = [];

// Initialize map
let map;
let markers = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    loadCaches();
    updateStats();
    setupFilterButtons();
});

// Initialize Leaflet Map
function initMap() {
    map = L.map('map').setView(BETTENDORF_COORDS, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Center map on Bettendorf
function centerMap() {
    map.setView(BETTENDORF_COORDS, 13);
}

// Add test cache
function addTestCache() {
    const testCache = {
        id: Date.now(),
        name: `Saint Cache #${caches.length + 1}`,
        type: 'Traditional',
        status: 'planned',
        coords: {
            lat: BETTENDORF_COORDS[0] + (Math.random() - 0.5) * 0.02,
            lon: BETTENDORF_COORDS[1] + (Math.random() - 0.5) * 0.02
        },
        difficulty: 3,
        notes: 'Test cache for Saint Series'
    };
    
    caches.push(testCache);
    saveCaches();
    renderCaches();
    addMarker(testCache);
    updateStats();
}

// Add marker to map
function addMarker(cache) {
    const marker = L.marker([cache.coords.lat, cache.coords.lon])
        .addTo(map)
        .bindPopup(`
            <strong>${cache.name}</strong><br>
            Type: ${cache.type}<br>
            Status: ${cache.status}
        `);
    
    markers.push(marker);
}

// Render cache list
function renderCaches(filter = 'all') {
    const cacheList = document.getElementById('cache-list');
    const filteredCaches = filter === 'all' 
        ? caches 
        : caches.filter(c => c.status === filter);
    
    if (filteredCaches.length === 0) {
        cacheList.innerHTML = `
            <div class="empty-state">
                <p>No caches ${filter !== 'all' ? filter : ''} yet. Add your first Saint Series cache!</p>
            </div>
        `;
        return;
    }
    
    cacheList.innerHTML = filteredCaches.map(cache => `
        <div class="cache-item" data-status="${cache.status}">
            <div class="cache-status ${cache.status}"></div>
            <div class="cache-info">
                <h3>${cache.name}</h3>
                <p><strong>Type:</strong> ${cache.type}</p>
                <p><strong>Location:</strong> Bettendorf, IA</p>
                <p><strong>Notes:</strong> ${cache.notes}</p>
            </div>
            <div class="cache-coords">
                N ${cache.coords.lat.toFixed(5)}<br>
                W ${Math.abs(cache.coords.lon).toFixed(5)}
            </div>
        </div>
    `).join('');
}

// Setup filter buttons
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCaches(this.dataset.filter);
        });
    });
}

// Update stats
function updateStats() {
    const total = caches.length;
    const placed = caches.filter(c => c.status === 'placed').length;
    const active = caches.filter(c => c.status === 'active').length;
    const completion = total > 0 ? Math.round((active / total) * 100) : 0;
    
    document.getElementById('total-caches').textContent = total;
    document.getElementById('placed-caches').textContent = placed;
    document.getElementById('active-caches').textContent = active;
    document.getElementById('completion').textContent = completion + '%';
}

// Save caches to localStorage
function saveCaches() {
    localStorage.setItem('saintSeriesCaches', JSON.stringify(caches));
}

// Load caches from localStorage
function loadCaches() {
    const saved = localStorage.getItem('saintSeriesCaches');
    if (saved) {
        caches = JSON.parse(saved);
        renderCaches();
        caches.forEach(cache => addMarker(cache));
    }
}

// Add new cache (future feature)
function addNewCache() {
    alert('Add New Cache form coming soon! This will let you input cache details, coordinates, and puzzle info.');
}

// Export GPX (future feature)
function exportData() {
    alert('GPX Export coming soon! This will generate a GPX file of all your Saint Series caches.');
}

// Import GPX (future feature)
function importData() {
    alert('GPX Import coming soon! This will let you upload GPX files to populate your dashboard.');
}

// Reset dashboard
function resetAll() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        caches = [];
        localStorage.removeItem('saintSeriesCaches');
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        renderCaches();
        updateStats();
    }
}
