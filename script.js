// Ready for future geocaching API integration
console.log('Geocaching website loaded!');

// Example: Add more cache cards dynamically
function addCache(cacheData) {
    const cacheList = document.getElementById('cache-list');
    const cacheCard = document.createElement('div');
    cacheCard.className = 'cache-card';
    cacheCard.innerHTML = `
        <h3>${cacheData.name}</h3>
        <p><strong>Type:</strong> ${cacheData.type}</p>
        <p><strong>Location:</strong> ${cacheData.location}</p>
        <p><strong>Found:</strong> ${cacheData.found}</p>
        <p><strong>Difficulty:</strong> ${'⭐'.repeat(cacheData.difficulty)}</p>
    `;
    cacheList.appendChild(cacheCard);
}
