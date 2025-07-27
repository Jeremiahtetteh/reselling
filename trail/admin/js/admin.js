document.addEventListener('DOMContentLoaded', function() {
    // File handling functions
    function handleFileUpload(fileInput, isVideo = false) {
        return new Promise((resolve, reject) => {
            const file = fileInput.files[0];
            if (!file) {
                reject('No file selected');
                return;
            }
            
            // Check file size
            const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for videos, 5MB for images
            if (file.size > maxSize) {
                const sizeInMB = Math.round(file.size / (1024 * 1024));
                const maxSizeInMB = Math.round(maxSize / (1024 * 1024));
                reject(`File is too large (${sizeInMB}MB). Maximum size is ${maxSizeInMB}MB.`);
                return;
            }
            
            // For videos, just store the file name and create a URL
            if (isVideo) {
                // Create a unique filename
                const fileName = `video_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                
                // Store the file in a global variable for access
                if (!window.uploadedFiles) {
                    window.uploadedFiles = {};
                }
                
                // Store the file object
                window.uploadedFiles[fileName] = file;
                
                // Return the filename as reference
                resolve(fileName);
                return;
            }
            
            // For images, use data URL approach
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function() {
                reject('Error reading file');
            };
            reader.readAsDataURL(file);
        });
    }
    // Tab navigation
    const tabLinks = document.querySelectorAll('.sidebar a');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Initialize videos and products arrays in localStorage if they don't exist
    if (!localStorage.getItem('videos')) {
        localStorage.setItem('videos', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    
    // Tab switching
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab in sidebar
            document.querySelectorAll('.sidebar li').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Video form handling
    const videoForm = document.getElementById('video-form');
    const videoPreview = document.getElementById('video-preview');
    
    if (videoForm) {
        // Live preview as user types and file inputs change
        const videoTitleInput = document.getElementById('video-title');
        const videoFileInput = document.getElementById('video-file');
        const videoThumbnailInput = document.getElementById('video-thumbnail');
        const videoCategoryInput = document.getElementById('video-category');
        const videoDescriptionInput = document.getElementById('video-description');
        const videoDurationInput = document.getElementById('video-duration');
        const videoPriceInput = document.getElementById('video-price');
        
        // Update preview when text inputs change
        [videoTitleInput, videoCategoryInput, videoDescriptionInput, videoDurationInput, videoPriceInput].forEach(input => {
            input.addEventListener('input', updateVideoPreview);
        });
        
        // Update preview when file inputs change
        videoThumbnailInput.addEventListener('change', updateVideoPreview);
        
        // Form submission
        videoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Show loading notification
                showNotification('Processing video, please wait...', 'info');
                
                // Get form values
                const title = videoTitleInput.value;
                const category = videoCategoryInput.value;
                const description = videoDescriptionInput.value;
                const duration = videoDurationInput.value;
                const price = parseFloat(videoPriceInput.value);
                const addToCourse = document.getElementById('video-add-to-course').checked;
                
                // Create form data for file upload
                const formData = new FormData();
                formData.append('title', title);
                formData.append('category', category);
                formData.append('description', description);
                formData.append('duration', duration);
                formData.append('price', price);
                formData.append('addToCourse', addToCourse);
                formData.append('video', videoFileInput.files[0]);
                formData.append('thumbnail', videoThumbnailInput.files[0]);
                
                // Send to server
                const response = await fetch('http://localhost:3000/api/videos', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success notification
                    showNotification(`Video "${title}" has been added successfully!`, 'success');
                    
                    // Reset form
                    videoForm.reset();
                    videoPreview.innerHTML = `
                        <div class="placeholder-preview">
                            <i class="fas fa-video"></i>
                            <p>Video preview will appear here</p>
                        </div>
                    `;
                    
                    // Refresh manage content
                    loadManageContent();
                } else {
                    throw new Error(result.error || 'Unknown error');
                }
            } catch (error) {
                showNotification(`Error: ${error}`, 'error');
            }
        });
    }
    
    // Product form handling
    const productForm = document.getElementById('product-form');
    const productPreview = document.getElementById('product-preview');
    
    if (productForm) {
        // Live preview as user types
        const productNameInput = document.getElementById('product-name');
        const productImageInput = document.getElementById('product-image');
        const productCategoryInput = document.getElementById('product-category');
        const productDescriptionInput = document.getElementById('product-description');
        const productPriceInput = document.getElementById('product-price');
        
        // Update preview when text inputs change
        [productNameInput, productCategoryInput, productDescriptionInput, productPriceInput].forEach(input => {
            input.addEventListener('input', updateProductPreview);
        });
        
        // Update preview when file input changes
        productImageInput.addEventListener('change', updateProductPreview);
        
        // Form submission
        productForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Show loading notification
                showNotification('Processing product, please wait...', 'info');
                
                // Get form values
                const name = productNameInput.value;
                const category = productCategoryInput.value;
                const description = productDescriptionInput.value;
                const price = parseFloat(productPriceInput.value);
                const addToCourse = document.getElementById('product-add-to-course').checked;
                
                // Create form data for file upload
                const formData = new FormData();
                formData.append('name', name);
                formData.append('category', category);
                formData.append('description', description);
                formData.append('price', price);
                formData.append('addToCourse', addToCourse);
                formData.append('image', productImageInput.files[0]);
                
                // Send to server
                const response = await fetch('http://localhost:3000/api/products', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success notification
                    showNotification(`Product "${name}" has been added successfully!`, 'success');
                    
                    // Reset form
                    productForm.reset();
                    productPreview.innerHTML = `
                        <div class="placeholder-preview">
                            <i class="fas fa-shopping-bag"></i>
                            <p>Product preview will appear here</p>
                        </div>
                    `;
                    
                    // Refresh manage content
                    loadManageContent();
                } else {
                    throw new Error(result.error || 'Unknown error');
                }
            } catch (error) {
                showNotification(`Error: ${error}`, 'error');
            }
        });
    }
    
    // Load manage content
    loadManageContent();
    
    // Functions
    async function updateVideoPreview() {
        const title = document.getElementById('video-title').value || 'Video Title';
        const category = document.getElementById('video-category').value;
        const description = document.getElementById('video-description').value || 'Video description will appear here.';
        const duration = document.getElementById('video-duration').value || '00:00';
        const price = document.getElementById('video-price').value || '0.00';
        
        const thumbnailInput = document.getElementById('video-thumbnail');
        let thumbnailSrc = 'https://via.placeholder.com/300x200?text=Thumbnail+Preview';
        
        // If a thumbnail file is selected, use it
        if (thumbnailInput.files && thumbnailInput.files[0]) {
            try {
                thumbnailSrc = await handleFileUpload(thumbnailInput);
            } catch (error) {
                console.error('Error loading thumbnail preview:', error);
            }
        }
        
        const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1);
        
        videoPreview.innerHTML = `
            <div class="video-card-preview">
                <div class="video-thumbnail-preview">
                    <img src="${thumbnailSrc}" alt="${title}">
                    <span class="video-duration-preview">${duration}</span>
                    <span class="video-category-preview">${categoryFormatted}</span>
                </div>
                <div class="video-info-preview">
                    <h3 class="video-title-preview">${title}</h3>
                    <p class="video-description-preview">${description}</p>
                    <div class="video-price-preview">$${parseFloat(price).toFixed(2) || '0.00'}</div>
                </div>
            </div>
        `;
    }
    
    async function updateProductPreview() {
        const name = document.getElementById('product-name').value || 'Product Name';
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value || 'Product description will appear here.';
        const price = document.getElementById('product-price').value || '0.00';
        
        const productImageInput = document.getElementById('product-image');
        let imageSrc = 'https://via.placeholder.com/300x200?text=Product+Image';
        
        // If an image file is selected, use it
        if (productImageInput.files && productImageInput.files[0]) {
            try {
                imageSrc = await handleFileUpload(productImageInput);
            } catch (error) {
                console.error('Error loading image preview:', error);
            }
        }
        
        const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1);
        
        productPreview.innerHTML = `
            <div class="product-card-preview">
                <div class="product-image-preview">
                    <img src="${imageSrc}" alt="${name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                </div>
                <div class="product-info-preview">
                    <span class="product-category-preview">${categoryFormatted}</span>
                    <h3 class="product-title-preview">${name}</h3>
                    <p class="product-description-preview">${description}</p>
                    <div class="product-price-preview">$${parseFloat(price).toFixed(2) || '0.00'}</div>
                </div>
            </div>
        `;
    }
    
    // Function to create a video player element
    async function createVideoPlayer(videoId) {
        try {
            // Get the video blob from IndexedDB
            const videoBlob = await VideoStorage.getVideo(videoId);
            
            if (videoBlob) {
                // Create a blob URL for the file
                const blobUrl = URL.createObjectURL(videoBlob);
                
                return `
                    <video controls style="width: 100%; height: auto;">
                        <source src="${blobUrl}" type="${videoBlob.type || 'video/mp4'}">
                        Your browser does not support the video tag.
                    </video>
                `;
            } else {
                throw new Error('Video not found');
            }
        } catch (error) {
            console.error('Error creating video player:', error);
            return `
                <div style="padding: 20px; text-align: center; background: #f8f9fa;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ffc107; margin-bottom: 10px;"></i>
                    <p>Video file not available. Please reload the page or re-upload the video.</p>
                </div>
            `;
        }
    }
    
    async function loadManageContent() {
        const manageVideos = document.getElementById('manage-videos');
        const manageProducts = document.getElementById('manage-products');
        
        if (manageVideos) {
            try {
                // Show loading indicator
                manageVideos.innerHTML = '<p>Loading videos...</p>';
                
                // Fetch videos from Node.js API
                const response = await fetch('http://localhost:3000/api/videos');
                const videos = await response.json();
                
                if (!videos || videos.length === 0) {
                    manageVideos.innerHTML = '<p>No videos added yet.</p>';
                } else {
                    manageVideos.innerHTML = '';
                    
                    videos.forEach(video => {
                        const videoItem = document.createElement('div');
                        videoItem.className = 'manage-item';
                        videoItem.innerHTML = `
                            <div class="manage-item-header">
                                <div class="manage-item-title">${video.title}</div>
                                <div class="manage-item-actions">
                                    <button class="btn-edit" data-id="${video.id}" data-type="video"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="btn-delete" data-id="${video.id}" data-type="video"><i class="fas fa-trash"></i> Delete</button>
                                </div>
                            </div>
                            <div class="manage-item-content">
                                <div class="manage-item-info">
                                    <div class="manage-item-thumbnail">
                                        <img src="${video.thumbnail_path}" alt="${video.title}">
                                    </div>
                                    <div class="manage-item-details">
                                        <div class="manage-item-category">${video.category.charAt(0).toUpperCase() + video.category.slice(1)} • ${video.duration}</div>
                                        <div class="manage-item-price">$${parseFloat(video.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        manageVideos.appendChild(videoItem);
                    });
                    
                    // Add event listeners to edit and delete buttons
                    manageVideos.querySelectorAll('.btn-edit[data-type="video"]').forEach(button => {
                        button.addEventListener('click', function() {
                            editItem(this.getAttribute('data-id'), 'video');
                        });
                    });
                    
                    manageVideos.querySelectorAll('.btn-delete[data-type="video"]').forEach(button => {
                        button.addEventListener('click', function() {
                            deleteItem(this.getAttribute('data-id'), 'video');
                        });
                    });
                }
            } catch (error) {
                manageVideos.innerHTML = `<p>Error loading videos: ${error.message}</p>`;
                console.error('Error loading videos:', error);
            }
        }
        
        if (manageProducts) {
            try {
                // Show loading indicator
                manageProducts.innerHTML = '<p>Loading products...</p>';
                
                // Fetch products from Node.js API
                const response = await fetch('http://localhost:3000/api/products');
                const products = await response.json();
                
                if (!products || products.length === 0) {
                    manageProducts.innerHTML = '<p>No products added yet.</p>';
                } else {
                    manageProducts.innerHTML = '';
                    
                    products.forEach(product => {
                        const productItem = document.createElement('div');
                        productItem.className = 'manage-item';
                        productItem.innerHTML = `
                            <div class="manage-item-header">
                                <div class="manage-item-title">${product.name}</div>
                                <div class="manage-item-actions">
                                    <button class="btn-edit" data-id="${product.id}" data-type="product"><i class="fas fa-edit"></i> Edit</button>
                                    <button class="btn-delete" data-id="${product.id}" data-type="product"><i class="fas fa-trash"></i> Delete</button>
                                </div>
                            </div>
                            <div class="manage-item-content">
                                <div class="manage-item-info">
                                    <div class="manage-item-thumbnail">
                                        <img src="${product.image_path}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/80x60?text=Image+Not+Found'">
                                    </div>
                                    <div class="manage-item-details">
                                        <div class="manage-item-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                                        <div class="manage-item-price">$${parseFloat(product.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        manageProducts.appendChild(productItem);
                    });
                    
                    // Add event listeners to edit and delete buttons
                    manageProducts.querySelectorAll('.btn-edit[data-type="product"]').forEach(button => {
                        button.addEventListener('click', function() {
                            editItem(this.getAttribute('data-id'), 'product');
                        });
                    });
                    
                    manageProducts.querySelectorAll('.btn-delete[data-type="product"]').forEach(button => {
                        button.addEventListener('click', function() {
                            deleteItem(this.getAttribute('data-id'), 'product');
                        });
                    });
                }
            } catch (error) {
                manageProducts.innerHTML = `<p>Error loading products: ${error.message}</p>`;
                console.error('Error loading products:', error);
            }
        }
    }
    
    function editItem(id, type) {
        if (type === 'video') {
            const videos = JSON.parse(localStorage.getItem('videos')) || [];
            const video = videos.find(v => v.id === id);
            
            if (video) {
                // Switch to videos tab
                document.querySelectorAll('.sidebar li').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector('.sidebar li a[data-tab="videos-tab"]').parentElement.classList.add('active');
                
                tabContents.forEach(tab => {
                    tab.classList.remove('active');
                });
                document.getElementById('videos-tab').classList.add('active');
                
                // Fill form with video data
                document.getElementById('video-title').value = video.title;
                document.getElementById('video-category').value = video.category;
                document.getElementById('video-description').value = video.description;
                document.getElementById('video-duration').value = video.duration;
                document.getElementById('video-price').value = video.price;
                document.getElementById('video-add-to-course').checked = video.addToCourse !== undefined ? video.addToCourse : true;
                
                // Note: We can't pre-fill file inputs for security reasons
                // Show a message to the user
                showNotification('Please select video and thumbnail files again', 'info');
                
                // Update preview
                updateVideoPreview();
                
                // Change form submit behavior
                const videoForm = document.getElementById('video-form');
                const originalSubmitHandler = videoForm.onsubmit;
                
                videoForm.onsubmit = async function(e) {
                    e.preventDefault();
                    
                    try {
                        // Get form values
                        const title = document.getElementById('video-title').value;
                        const category = document.getElementById('video-category').value;
                        const description = document.getElementById('video-description').value;
                        const duration = document.getElementById('video-duration').value;
                        const price = parseFloat(document.getElementById('video-price').value);
                        
                        // Get file data
                        const videoFileInput = document.getElementById('video-file');
                        const thumbnailInput = document.getElementById('video-thumbnail');
                        
                        // Create updated video object
                        const updatedVideo = {
                            id: video.id,
                            title,
                            category,
                            description,
                            duration,
                            price,
                            addToCourse: document.getElementById('video-add-to-course').checked
                        };
                        
                        // Only update file data if new files are selected
                        if (videoFileInput.files && videoFileInput.files[0]) {
                            updatedVideo.videoFile = await handleFileUpload(videoFileInput, true); // true indicates it's a video file
                        } else {
                            updatedVideo.videoFile = video.videoFile; // Keep existing file
                        }
                        
                        if (thumbnailInput.files && thumbnailInput.files[0]) {
                            updatedVideo.thumbnail = await handleFileUpload(thumbnailInput);
                        } else {
                            updatedVideo.thumbnail = video.thumbnail; // Keep existing thumbnail
                        }
                        
                        const videos = JSON.parse(localStorage.getItem('videos')) || [];
                        const index = videos.findIndex(v => v.id === id);
                        
                        if (index !== -1) {
                            videos[index] = updatedVideo;
                            localStorage.setItem('videos', JSON.stringify(videos));
                            
                            // Show success notification
                            showNotification(`Video "${updatedVideo.title}" has been updated successfully!`, 'success');
                            
                            // Reset form
                            videoForm.reset();
                            videoPreview.innerHTML = `
                                <div class="placeholder-preview">
                                    <i class="fas fa-video"></i>
                                    <p>Video preview will appear here</p>
                                </div>
                            `;
                            
                            // Restore original submit handler
                            videoForm.onsubmit = originalSubmitHandler;
                            
                            // Refresh manage content
                            loadManageContent();
                        }
                    } catch (error) {
                        showNotification(`Error: ${error}`, 'error');
                    }
                };
            }
        } else if (type === 'product') {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === id);
            
            if (product) {
                // Switch to products tab
                document.querySelectorAll('.sidebar li').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector('.sidebar li a[data-tab="products-tab"]').parentElement.classList.add('active');
                
                tabContents.forEach(tab => {
                    tab.classList.remove('active');
                });
                document.getElementById('products-tab').classList.add('active');
                
                // Fill form with product data
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-category').value = product.category;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-add-to-course').checked = product.addToCourse !== undefined ? product.addToCourse : true;
                
                // Note: We can't pre-fill file inputs for security reasons
                // Show a message to the user
                showNotification('Please select product image again', 'info');
                
                // Update preview
                updateProductPreview();
                
                // Change form submit behavior
                const productForm = document.getElementById('product-form');
                const originalSubmitHandler = productForm.onsubmit;
                
                productForm.onsubmit = async function(e) {
                    e.preventDefault();
                    
                    try {
                        // Get form values
                        const name = document.getElementById('product-name').value;
                        const category = document.getElementById('product-category').value;
                        const description = document.getElementById('product-description').value;
                        const price = parseFloat(document.getElementById('product-price').value);
                        
                        // Get file data
                        const productImageInput = document.getElementById('product-image');
                        
                        // Create updated product object
                        const updatedProduct = {
                            id: product.id,
                            name,
                            category,
                            description,
                            price,
                            addToCourse: document.getElementById('product-add-to-course').checked
                        };
                        
                        // Only update image if a new file is selected
                        if (productImageInput.files && productImageInput.files[0]) {
                            updatedProduct.image = await handleFileUpload(productImageInput);
                        } else {
                            updatedProduct.image = product.image; // Keep existing image
                        }
                        
                        const products = JSON.parse(localStorage.getItem('products')) || [];
                        const index = products.findIndex(p => p.id === id);
                        
                        if (index !== -1) {
                            products[index] = updatedProduct;
                            localStorage.setItem('products', JSON.stringify(products));
                            
                            // Show success notification
                            showNotification(`Product "${updatedProduct.name}" has been updated successfully!`, 'success');
                            
                            // Reset form
                            productForm.reset();
                            productPreview.innerHTML = `
                                <div class="placeholder-preview">
                                    <i class="fas fa-shopping-bag"></i>
                                    <p>Product preview will appear here</p>
                                </div>
                            `;
                            
                            // Restore original submit handler
                            productForm.onsubmit = originalSubmitHandler;
                            
                            // Refresh manage content
                            loadManageContent();
                        }
                    } catch (error) {
                        showNotification(`Error: ${error}`, 'error');
                    }
                };
            }
        }
    }
    
    async function deleteItem(id, type) {
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                const formData = new FormData();
                formData.append('id', id);
                
                let response;
                
                if (type === 'video') {
                    // Delete from MongoDB database
                    response = await fetch(`http://localhost:3000/api/videos/${id}`, {
                        method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (!result.success) {
                        throw new Error(result.error || 'Failed to delete video');
                    }
                    
                    // Show success notification
                    showNotification(`Video has been deleted successfully!`, 'success');
                } else if (type === 'product') {
                    // Delete from MongoDB database
                    response = await fetch(`http://localhost:3000/api/products/${id}`, {
                        method: 'DELETE'
                    });
                    
                    const result = await response.json();
                    
                    if (!result.success) {
                        throw new Error(result.error || 'Failed to delete product');
                    }
                    
                    // Show success notification
                    showNotification(`Product has been deleted successfully!`, 'success');
                }
                
                // Refresh manage content
                loadManageContent();
            } catch (error) {
                showNotification(`Error deleting item: ${error}`, 'error');
            }
        }
    }
});