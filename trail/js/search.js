// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add search bar to header
    const nav = document.querySelector('nav');
    if (nav) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="search-input" placeholder="Search videos, courses...">
                <button id="search-btn"><i class="fas fa-search"></i></button>
            </div>
            <div id="search-results" class="search-results"></div>
        `;
        
        nav.appendChild(searchContainer);
        
        // Add search styles
        if (!document.getElementById('search-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'search-styles';
            styleEl.textContent = `
                .search-container {
                    position: relative;
                    margin-left: 2rem;
                }
                
                .search-box {
                    display: flex;
                    align-items: center;
                    background-color: var(--light-bg);
                    border-radius: 25px;
                    padding: 0.5rem 1rem;
                    min-width: 250px;
                }
                
                #search-input {
                    border: none;
                    background: none;
                    outline: none;
                    flex: 1;
                    padding: 0.3rem;
                    font-size: 0.9rem;
                }
                
                #search-btn {
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: var(--text-color);
                    padding: 0.3rem;
                }
                
                .search-results {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: var(--background-color);
                    border-radius: 8px;
                    box-shadow: var(--shadow);
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1000;
                    display: none;
                }
                
                .search-result-item {
                    padding: 0.8rem;
                    border-bottom: 1px solid var(--light-bg);
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .search-result-item:hover {
                    background-color: var(--light-bg);
                }
                
                .search-result-title {
                    font-weight: 500;
                    margin-bottom: 0.3rem;
                }
                
                .search-result-type {
                    font-size: 0.8rem;
                    color: #666;
                }
                
                @media (max-width: 768px) {
                    .search-container {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const searchResults = document.getElementById('search-results');
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
        
        async function performSearch(query) {
            try {
                // Search videos and products
                const [videosResponse, productsResponse] = await Promise.all([
                    fetch('http://localhost:3000/api/videos'),
                    fetch('http://localhost:3000/api/products')
                ]);
                
                const videos = await videosResponse.json();
                const products = await productsResponse.json();
                
                // Filter results
                const videoResults = videos.filter(video => 
                    video.title.toLowerCase().includes(query.toLowerCase()) ||
                    video.description.toLowerCase().includes(query.toLowerCase()) ||
                    video.category.toLowerCase().includes(query.toLowerCase())
                );
                
                const productResults = products.filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())
                );
                
                displaySearchResults([...videoResults, ...productResults], query);
            } catch (error) {
                console.error('Search error:', error);
            }
        }
        
        function displaySearchResults(results, query) {
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="search-result-item">
                        <div class="search-result-title">No results found</div>
                        <div class="search-result-type">Try different keywords</div>
                    </div>
                `;
            } else {
                searchResults.innerHTML = results.slice(0, 5).map(item => {
                    const isVideo = item.hasOwnProperty('title');
                    return `
                        <div class="search-result-item" onclick="goToItem('${isVideo ? 'video' : 'product'}', '${item._id}')">
                            <div class="search-result-title">${isVideo ? item.title : item.name}</div>
                            <div class="search-result-type">${isVideo ? 'Video' : 'Product'} • ${item.category}</div>
                        </div>
                    `;
                }).join('');
            }
            
            searchResults.style.display = 'block';
        }
        
        // Navigate to item
        window.goToItem = function(type, id) {
            if (type === 'video') {
                window.location.href = 'videos.html';
            } else {
                window.location.href = 'courses.html';
            }
            searchResults.style.display = 'none';
            searchInput.value = '';
        };
    }
});