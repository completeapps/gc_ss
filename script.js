// Saint Series SS - Map + Cache Management

let mapCollapsed = false;
let caches = [];

// Load caches from localStorage
function loadCaches() {
    const saved = localStorage.getItem('saintSeriesCaches');
    if (saved) {
        caches = JSON.parse(saved);
        renderCaches();
    }
}

// Save caches to localStorage
function saveCaches() {
    localStorage.setItem('saintSeriesCaches', JSON.stringify(caches));
    renderCaches();
}

// Render cache grid
function renderCaches() {
    const grid = document.getElementById('cache-grid');
    document.getElementById('cache-count').textContent = caches.length;
    
    if (caches.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No caches added yet</h3>
                <p>Click "+ Add Cache" to add your first Saint Series cache!</p>
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
                <button class="btn btn-small btn-secondary" onclick="editCache(${cache.id})">Edit</button>
                <button class="btn btn-small btn-secondary" onclick="deleteCache(${cache.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Show/hide add form
function showAddForm() {
    document.getElementById('add-form').classList.remove('hidden');
}

function hideAddForm() {
    document.getElementById('add-form').classList.add('hidden');
    document.getElementById('cache-form').reset();
}

// Add cache form
document.getElementById('cache-form').addEventListener('submit', function(e) {
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
    hideAddForm();
});

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
    document.getElementById('cache-notes').value = cache.notes || '';
    
    showAddForm();
}

// Delete cache
function deleteCache(id) {
    if (!confirm('Delete this cache?')) return;
    caches = caches.filter(c => c.id !== id);
    saveCaches();
}

// Map toggle
document.addEventListener('DOMContentLoaded', function() {
    loadCaches();
    
    const map = L.map('map').setView([41.5247, -90.5681], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
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
        
        setTimeout(() => map.invalidateSize(), 300);
    });
});
