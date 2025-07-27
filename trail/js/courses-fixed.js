// Fixed courses loading functionality
document.addEventListener('DOMContentLoaded', async function() {
    await loadCourses();
});

async function loadCourses() {
    const coursesGrid = document.getElementById('courses-grid');
    
    if (!coursesGrid) {
        console.error('Courses grid not found');
        return;
    }
    
    try {
        // Show loading message
        coursesGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #666;"><i class="fas fa-spinner fa-spin"></i> Loading courses...</div>';
        
        // Try to load from server first
        let videos = [];
        let products = [];
        
        try {
            const videosResponse = await fetch('http://localhost:3000/api/videos');
            if (videosResponse.ok) {
                videos = await videosResponse.json();
            }
        } catch (error) {
            console.log('Server not available, using fallback data');
        }
        
        try {
            const productsResponse = await fetch('http://localhost:3000/api/products');
            if (productsResponse.ok) {
                products = await productsResponse.json();
            }
        } catch (error) {
            console.log('Server not available for products');
        }
        
        // Filter items marked for courses
        const courseVideos = videos.filter(video => video.addToCourse);
        const courseProducts = products.filter(product => product.addToCourse);
        
        // If no server data, use fallback courses
        if (courseVideos.length === 0 && courseProducts.length === 0) {
            displayFallbackCourses(coursesGrid);
            return;
        }
        
        // Display courses from server
        displayServerCourses(coursesGrid, courseVideos, courseProducts);
        
    } catch (error) {
        console.error('Error loading courses:', error);
        displayFallbackCourses(coursesGrid);
    }
}

function displayServerCourses(container, videos, products) {
    let coursesHTML = '';
    
    // Display videos as courses
    videos.forEach(video => {
        const thumbnailPath = video.thumbnail_path ? video.thumbnail_path.replace(/\\/g, '/') : 'https://img.youtube.com/vi/JwOmHKPNBRY/mqdefault.jpg';
        
        coursesHTML += `
            <div class="course-card">
                <div class="course-thumbnail">
                    <img src="${thumbnailPath}" alt="${video.title}" onerror="this.src='https://img.youtube.com/vi/JwOmHKPNBRY/mqdefault.jpg'">
                    <div class="course-level">Video</div>
                </div>
                <div class="course-info">
                    <h3>${video.title}</h3>
                    <div class="course-meta">
                        <div><i class="fas fa-clock"></i> ${video.duration}</div>
                        <div><i class="fas fa-tag"></i> ${video.category}</div>
                    </div>
                    <div class="course-description">
                        ${video.description}
                    </div>
                    <div class="course-topics">
                        <h4>Topics Covered:</h4>
                        <div class="topics-list">
                            <span class="topic-tag">${video.category}</span>
                            <span class="topic-tag">Step-by-step</span>
                            <span class="topic-tag">Practice</span>
                        </div>
                    </div>
                    <div class="course-price">
                        <span class="price-tag">$${parseFloat(video.price).toFixed(2)}</span>
                        <div class="payment-buttons">
                            <button class="btn-small" onclick="showPaymentModal('${video.title}', ${video.price}, 'card')">
                                <i class="fas fa-credit-card"></i>
                            </button>
                            <button class="btn-small" onclick="showPaymentModal('${video.title}', ${video.price}, 'paypal')">
                                <i class="fab fa-paypal"></i>
                            </button>
                        </div>
                    </div>
                    <div class="course-action">
                        <button class="btn btn-primary" onclick="showPaymentModal('${video.title}', ${video.price})">
                            <i class="fas fa-play"></i> Start Course
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Display products as courses
    products.forEach(product => {
        const imagePath = product.image_path ? product.image_path.replace(/\\/g, '/') : 'https://via.placeholder.com/300x200?text=Course';
        
        coursesHTML += `
            <div class="course-card">
                <div class="course-thumbnail">
                    <img src="${imagePath}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Course'">
                    <div class="course-level">Product</div>
                </div>
                <div class="course-info">
                    <h3>${product.name}</h3>
                    <div class="course-meta">
                        <div><i class="fas fa-box"></i> ${product.category}</div>
                        <div><i class="fas fa-star"></i> Premium</div>
                    </div>
                    <div class="course-description">
                        ${product.description}
                    </div>
                    <div class="course-topics">
                        <h4>What's Included:</h4>
                        <div class="topics-list">
                            <span class="topic-tag">${product.category}</span>
                            <span class="topic-tag">Digital Access</span>
                            <span class="topic-tag">Lifetime</span>
                        </div>
                    </div>
                    <div class="course-price">
                        <span class="price-tag">$${parseFloat(product.price).toFixed(2)}</span>
                        <div class="payment-buttons">
                            <button class="btn-small" onclick="showPaymentModal('${product.name}', ${product.price}, 'card')">
                                <i class="fas fa-credit-card"></i>
                            </button>
                            <button class="btn-small" onclick="showPaymentModal('${product.name}', ${product.price}, 'paypal')">
                                <i class="fab fa-paypal"></i>
                            </button>
                        </div>
                    </div>
                    <div class="course-action">
                        <button class="btn btn-primary" onclick="showPaymentModal('${product.name}', ${product.price})">
                            <i class="fas fa-shopping-cart"></i> Get Product
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (coursesHTML === '') {
        displayFallbackCourses(container);
    } else {
        container.innerHTML = coursesHTML;
    }
}

function displayFallbackCourses(container) {
    const fallbackCourses = [
        {
            title: "Algebra Mastery Course",
            image: "https://img.youtube.com/vi/LwCRRUa8yTU/mqdefault.jpg",
            level: "Beginner",
            duration: "8 hours",
            category: "Algebra",
            description: "Master the fundamentals of algebra with step-by-step explanations and practice problems.",
            topics: ["Linear Equations", "Quadratic Functions", "Polynomials", "Factoring"],
            price: 29.99
        },
        {
            title: "Calculus Fundamentals",
            image: "https://img.youtube.com/vi/HfACrKJ_Y2w/mqdefault.jpg",
            level: "Intermediate",
            duration: "12 hours",
            category: "Calculus",
            description: "Learn calculus from limits to integration with clear examples and applications.",
            topics: ["Limits", "Derivatives", "Integration", "Applications"],
            price: 39.99
        },
        {
            title: "Geometry Essentials",
            image: "https://img.youtube.com/vi/302eJ3TzJQU/mqdefault.jpg",
            level: "Beginner",
            duration: "6 hours",
            category: "Geometry",
            description: "Explore shapes, angles, and proofs in this comprehensive geometry course.",
            topics: ["Triangles", "Circles", "Proofs", "Area & Volume"],
            price: 24.99
        },
        {
            title: "Statistics & Probability",
            image: "https://img.youtube.com/vi/sxLdGjV-_yg/mqdefault.jpg",
            level: "Intermediate",
            duration: "10 hours",
            category: "Statistics",
            description: "Understand data analysis, probability, and statistical inference.",
            topics: ["Descriptive Stats", "Probability", "Distributions", "Hypothesis Testing"],
            price: 34.99
        },
        {
            title: "Trigonometry Complete Course",
            image: "https://img.youtube.com/vi/PUB0TaZ7bhA/mqdefault.jpg",
            level: "Intermediate",
            duration: "8 hours",
            category: "Trigonometry",
            description: "Master trigonometric functions, identities, and applications.",
            topics: ["Trig Functions", "Identities", "Graphs", "Applications"],
            price: 29.99
        },
        {
            title: "SAT Math Prep Course",
            image: "https://img.youtube.com/vi/RkWJUmQNvL0/mqdefault.jpg",
            level: "Test Prep",
            duration: "15 hours",
            category: "SAT Prep",
            description: "Comprehensive SAT math preparation with practice tests and strategies.",
            topics: ["Algebra", "Geometry", "Data Analysis", "Test Strategies"],
            price: 49.99
        }
    ];
    
    let coursesHTML = '';
    
    fallbackCourses.forEach(course => {
        coursesHTML += `
            <div class="course-card">
                <div class="course-thumbnail">
                    <img src="${course.image}" alt="${course.title}">
                    <div class="course-level">${course.level}</div>
                </div>
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <div class="course-meta">
                        <div><i class="fas fa-clock"></i> ${course.duration}</div>
                        <div><i class="fas fa-tag"></i> ${course.category}</div>
                    </div>
                    <div class="course-description">
                        ${course.description}
                    </div>
                    <div class="course-topics">
                        <h4>Topics Covered:</h4>
                        <div class="topics-list">
                            ${course.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                        </div>
                    </div>
                    <div class="course-price">
                        <span class="price-tag">$${course.price}</span>
                        <div class="payment-buttons">
                            <button class="btn-small" onclick="showPaymentModal('${course.title}', ${course.price}, 'card')">
                                <i class="fas fa-credit-card"></i>
                            </button>
                            <button class="btn-small" onclick="showPaymentModal('${course.title}', ${course.price}, 'paypal')">
                                <i class="fab fa-paypal"></i>
                            </button>
                        </div>
                    </div>
                    <div class="course-action">
                        <button class="btn btn-primary" onclick="showPaymentModal('${course.title}', ${course.price})">
                            <i class="fas fa-play"></i> Start Course
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = coursesHTML;
}