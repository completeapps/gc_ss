// Saint Series SS Admin - 100% Free (No API Keys Needed)

let sidebarCollapsed = false;
let caches = [];
let logs = [];
let map;
let markers = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    loadCaches();
    loadLogs();
    initMap();
    setupForm();
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

// Load caches from localStorage (free!)
function loadCaches() {
    const saved = localStorage.getItem('saintSeriesCaches');
    if (saved) {
        caches = JSON.parse(saved);
        renderCaches();
        addMapMarkers();
    }
}

// Save caches to localStorage
function saveCaches() {
    localStorage.setItem('saintSeriesCaches', JSON.stringify(caches));
    renderCaches();
    updateMap();
}

// Load logs from localStorage
function loadLogs() {
    const saved = localStorage.getItem('saintSeriesLogs');
    if (saved) {
        logs = JSON.parse(saved);
        renderLogs();
    }
}

// Save log
function addLog(cacheId, message) {
    const cache = caches.find(c => c.id === cacheId);
    const log = {
        id: Date.now(),
        cacheId: cacheId,
        cacheName: cache.name,
        gcCode: cache.gc_code,
        message: message,
        date: new Date().toISOString()
    };
    
    logs.push(log);
    localStorage.setItem('saintSeriesLogs', JSON.stringify(logs));
    renderLogs();
}

// Render cache grid
function renderCaches() {
    const grid = document.getElementById('cache-grid');
    document.getElementById('cache-count').textContent = caches.length;
    
    if (caches.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No caches added yet</h3>
                <p>Click "Add Cache" in the sidebar to add your first Saint Series cache!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = caches.map(cache => `
        <div class="cache-card" data-id="${cache.id}">
            <div class="cache-header">
                <div>
                    <div class="cache-name">${cache.name}</div>
                    <div class="gc-code">${cache.gc_code}</div>
                </div>
                <div class="cache-status ${cache.status}">
                    ${cache.status.toUpperCase()}
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
            
            <div class="cache-actions">
                <button class="btn btn-outline-sm" onclick="editCache(${cache.id})">Edit</button>
                <button class="btn btn-outline-sm" onclick="deleteCache(${cache.id})">Delete</button>
                <button class="btn btn-outline-sm" onclick="addLog(${cache.id}, 'Manual update')">Log</button>
            </div>
        </div>
    `).join('');
}

// Render logs
function renderLogs() {
    const container = document.getElementById('logs-container');
    
    if (logs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No logs yet</h3>
                <p>Add logs when you place or update caches!</p>
            </div>
        `;
        return;
    }
    
    // Show newest logs first
    const recentLogs = logs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30);
    
    container.innerHTML = recentLogs.map(log => `
        <div class="log-card">
            <div class="log-header">
                <span class="log-cache-name">${log.cacheName}</span>
                <span class="log-time">${new Date(log.date).toLocaleString()}</span>
            </div>
            <div class="log-message">${log.message}</div>
        </div>
    `).join('');
}

// Setup add cache form
function setupForm() {
    const form = document.getElementById('add-cache-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cache = {
            id: Date.now(),
            name: document.getElementById('cache-name').value,
            gc_code: document.getElementById('cache-gc').value,
            type: document.getElementById('cache-type').value,
            status: document.getElementById('cache-status').value,
            latitude: parseFloat(document.getElementById('cache-lat').value),
            longitude: parseFloat(document.getElementById('cache-lon').value),
            notes: document.getElementById('cache-notes').value,
            last_logged: null
        };
        
        caches.push(cache);
        saveCaches();
        addLog(cache.id, 'Cache created');
        resetForm();
        
        // Show added section
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector('[data-section="caches"]').classList.add('active');
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById('section-caches').classList.add('active');
    });
}

// Reset form
function resetForm() {
    document.getElementById('add-cache-form').reset();
}

// Edit cache
function editCache(id) {
    const cache = caches.find(c => c.id === id);
    if (!cache) return;
    
    document.getElementById('cache-name').value = cache.name;
    document.getElementById('cache-gc').value = cache.gc_code;
    document.getElementById('cache-type').value = cache.type;
    document.getElementById('cache-status').value = cache.status;
    document.getElementById('cache-lat').value = cache.latitude;
    document.getElementById('cache-lon').value = cache.longitude;
    document.getElementById('cache-notes').value = cache.notes;
    
    // Show add section
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector('[data-section="add"]').classList.add('active');
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-add').classList.add('active');
}

// Delete cache
function deleteCache(id) {
    if (!confirm('Delete this cache?')) return;
    
    caches = caches.filter(c => c.id !== id);
    saveCaches();
    addLog(id, 'Cache deleted');
}

// Initialize OpenStreetMap (FREE!)
function initMap() {
    map = L.map('map').setView([41.5247, -90.5681], 12); // Bettendorf, Iowa
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    addMapMarkers();
}

// Add markers to map
function addMapMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    caches.forEach(cache => {
        const marker = L.marker([cache.latitude, cache.longitude])
            .addTo(map)
            .bindPopup(`
                <strong>${cache.name}</strong><br>
                ${cache.gc_code}<br>
                ${cache.type}<br>
                ${cache.status.toUpperCase()}
            `);
        
        markers.push(marker);
    });
}

// Update map
function updateMap() {
    addMapMarkers();
}

// Center map
function centerMap() {
    map.setView([41.5247, -90.5681], 12);
}

// Export data (save as JSON file)
function exportData() {
    const data = {
        caches: caches,
        logs: logs,
        exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saint-series-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                caches = data.caches || [];
                logs = data.logs || [];
                saveCaches();
                loadLogs();
                alert('Data imported successfully!');
            } catch (err) {
                alert('Error importing data: ' + err.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}
