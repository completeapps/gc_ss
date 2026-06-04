// Saint Series SS Admin - Load from Geocaching.com

let sidebarCollapsed = false;
let caches = [];
let map;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    loadCachesFromGeocaching();
    initMap();
});

// Sidebar toggle
function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    toggle.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebarCollapsed = !sidebarCollapsed;
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
        toggle.querySelector('.toggle-icon').textContent = sidebarCollapsed ? '▶' : '◀';
    });
    
    // Nav navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.dataset.section;
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${section}`).classList.add('active');
        });
    });
}

// Load caches from Geocaching.com API
function loadCachesFromGeocaching() {
    // TODO: Replace with your Geocaching.com API key
    const API_KEY = 'YOUR_GEOCACHING_API_KEY';
    const USER_ID = 'your_username';
    
    // Geocaching.com API endpoint for your found caches
    fetch(`https://api.geocaching.com/v1/caches/user/${USER_ID}?key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            caches = data.caches;
            renderCaches();
            renderLogs();
            addMapMarkers();
        })
        .catch(error => {
            console.error('Error loading from Geocaching:', error);
            document.getElementById('cache-grid').innerHTML = 
                '<p style="color: var(--text-muted);">Error loading caches from Geocaching.com. Check API key.</p>';
        });
}

// Refresh caches
function refreshCaches() {
    loadCachesFromGeocaching();
}

// Render cache grid
function renderCaches() {
    const grid = document.getElementById('cache-grid');
    
    grid.innerHTML = caches.map(cache => `
        <div class="cache-card">
            <div class="cache-header">
                <div>
                    <div class="cache-name">${cache.name}</div>
                    <div class="gc-code">${cache.gc_code}</div>
                </div>
                <div class="cache-status ${cache.enabled ? 'enabled' : 'disabled'}">
                    ${cache.enabled ? 'ENABLED' : 'DISABLED'}
                </div>
            </div>
            
            <div class="cache-info">
                <div class="cache-info-row">
                    <span class="cache-info-label">Type</span>
                    <span class="cache-info-value cache-type">${cache.type}</span>
                </div>
                <div class="cache-info-row">
                    <span class="cache-info-label">Coordinates</span>
                    <span class="cache-info-value">${cache.latitude} ${cache.longitude}</span>
                </div>
                <div class="cache-info-row">
                    <span class="cache-info-label">Last Logged</span>
                    <span class="cache-info-value last-logged">${cache.last_logged || 'Never'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render recent logs
function renderLogs() {
    const container = document.getElementById('logs-container');
    
    const recentLogs = caches
        .filter(cache => cache.last_log)
        .sort((a, b) => new Date(b.last_log.date) - new Date(a.last_log.date))
        .slice(0, 20);
    
    container.innerHTML = recentLogs.map(cache => `
        <div class="log-card">
            <div class="log-header">
                <span class="log-cache-name">${cache.name}</span>
                <span class="log-time">${cache.last_log.date}</span>
            </div>
            <div class="log-message">${cache.last_log.message}</div>
        </div>
    `).join('');
}

// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.5247, lng: -90.5681 }, // Bettendorf, Iowa
        zoom: 12,
        styles: [
            {
                featureType: 'all',
                elements: 'all',
                stylers: [
                    { saturation: -100 },
                    { lightness: -20 }
                ]
            }
        ]
    });
    
    addMapMarkers();
}

// Add markers to map
function addMapMarkers() {
    caches.forEach(cache => {
        new google.maps.Marker({
            position: { lat: cache.latitude, lng: cache.longitude },
            map: map,
            title: cache.name,
            icon: {
                url: cache.enabled ? 
                    'http://maps.google.com/mapfiles/ms/icons/green.png' : 
                    'http://maps.google.com/mapfiles/ms/icons/red.png'
            }
        });
    });
}

// Center map
function centerMap() {
    map.setCenter({ lat: 41.5247, lng: -90.5681 });
    map.setZoom(12);
}
