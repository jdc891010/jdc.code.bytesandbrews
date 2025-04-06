document.addEventListener('DOMContentLoaded', function() {
    // Setup non-map event listeners
    setupEventListeners();
    
    // Initialize tab content
    loadTabContent();
    
    // Initialize the rating sliders
    initRatingSliders();
    
    // Listen for location detection events
    document.addEventListener('locationDetectionStart', showLocationDetection);
    document.addEventListener('locationDetectionEnd', hideLocationDetection);
    
    // Initialize Spotify banner functionality
    initSpotifyBanner();
});

// Setup all non-map event listeners
function setupEventListeners() {
    // Category tabs for top spots
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Update active button
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    // Location dropdown in review form
    const locationSelect = document.getElementById('location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                document.getElementById('new-location-fields').classList.remove('hidden');
            } else {
                document.getElementById('new-location-fields').classList.add('hidden');
            }
        });
    }
    
    // Review form submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const nav = document.querySelector('nav ul');
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// Initialize the rating sliders
function initRatingSliders() {
    const ratingSliders = document.querySelectorAll('.rating-slider');
    
    ratingSliders.forEach(slider => {
        // Add event listener to each slider
        slider.addEventListener('input', updateRatingFeedback);
        
        // Initialize with current value
        updateRatingFeedback.call(slider);
    });
}

// Function to update the rating feedback (value and description)
function updateRatingFeedback() {
    // Get the parent rating item
    const ratingItem = this.closest('.rating-item');
    if (!ratingItem) return;
    
    // Get the current value
    const value = parseInt(this.value);
    
    // Update the numeric value display
    const valueDisplay = ratingItem.querySelector('.rating-value');
    if (valueDisplay) {
        valueDisplay.textContent = `${value}/5`;
    }
    
    // Debug: Log the raw data-descriptions
    console.log('Slider ID:', this.id);
    console.log('Raw descriptions attribute:', this.getAttribute('data-descriptions'));
    
    // Update the text description
    const descriptionDisplay = ratingItem.querySelector('.rating-description');
    if (descriptionDisplay) {
        try {
            // Get the attribute directly rather than using dataset
            const descriptionsAttr = this.getAttribute('data-descriptions');
            
            // Only try to parse if we actually have a value
            if (descriptionsAttr && descriptionsAttr.trim()) {
                const descriptions = JSON.parse(descriptionsAttr);
                if (descriptions && descriptions.length > value) {
                    descriptionDisplay.textContent = descriptions[value];
                }
            } else {
                console.warn('No descriptions attribute found for', this.id);
            }
        } catch (error) {
            console.error('Error parsing descriptions for ' + this.id + ':', error);
            console.error('Raw value:', this.getAttribute('data-descriptions'));
        }
    }
}

// Initialize Spotify banner functionality
function initSpotifyBanner() {
    const closeButton = document.querySelector('.close-banner');
    const spotifyBanner = document.querySelector('.spotify-banner');
    
    if (closeButton && spotifyBanner) {
        // Check if user has previously closed the banner
        const bannerClosed = localStorage.getItem('spotifyBannerClosed');
        
        if (bannerClosed === 'true') {
            spotifyBanner.style.display = 'none';
        }
        
        closeButton.addEventListener('click', function() {
            spotifyBanner.style.display = 'none';
            // Save the state in localStorage
            localStorage.setItem('spotifyBannerClosed', 'true');
        });
    }
}

// Functions for location detection indicator
function showLocationDetection() {
    const detectingElem = document.getElementById('location-detecting');
    if (detectingElem) {
        detectingElem.classList.remove('hidden');
    }
}

function hideLocationDetection() {
    const detectingElem = document.getElementById('location-detecting');
    if (detectingElem) {
        detectingElem.classList.add('hidden');
    }
}

// Placeholder for tab content loading
function loadTabContent() {
    // This would be implemented based on your specific requirements
    console.log('Tab content would be loaded here');
}

// Placeholder for review submission
function submitReview(event) {
    event.preventDefault();
    // Get form data
    const form = document.getElementById('review-form');
    
    // Example of getting form data - with null checks to prevent errors
    const locationElement = document.getElementById('location');
    const commentsElement = document.getElementById('comments');
    
    // const location = locationElement ? locationElement.value : '';
    // const comments = commentsElement ? commentsElement.value : '';
    
    // Get all rating values
    const ratings = {};
    document.querySelectorAll('.rating-slider').forEach(slider => {
        ratings[slider.id] = slider.value;
    });
    
    // You would normally send this data to your server
    console.log('Review submitted:', { location, ratings, comments });
    
    // Only show confirmation message if this was called from the form submit event
    if (event && event.type === 'submit') {
        alert('Thank you for your review!');
        
        // Reset form
        form.reset();
        
        // Hide new location fields
        const newLocationFields = document.getElementById('new-location-fields');
        if (newLocationFields) {
            newLocationFields.classList.add('hidden');
        }
    }
}

function initMap() {
    console.log('Google Maps API loaded successfully');
    // This will be called when Google Maps is fully loaded
    // Now it's safe to use Google Maps functionality
    
    // If you have geo-places.js functionality, initialize it here
    if (typeof initLocationBasedSuggestions === 'function') {
      initLocationBasedSuggestions();
    }
}

// Sample data for testing - replace with actual data from your database

// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const refreshCaptcha = document.querySelector('.refresh-captcha');
    
    if (contactForm) {
        // Form submission handler
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate CAPTCHA (in a real implementation, this would be server-side)
            const captchaInput = document.getElementById('captcha-input');
            const captchaValue = captchaInput.value.trim();
            
            // Validate message type selection
            const messageTypeSelect = document.getElementById('message-type');
            if (messageTypeSelect && messageTypeSelect.value === '') {
                showValidationMessage(messageTypeSelect, 'Please select a message type');
                return;
            }
            
            if (captchaValue === '') {
                showValidationMessage(captchaInput, 'Please enter the CAPTCHA code');
                return;
            }
            
            // Simulate form submission
            const submitButton = document.querySelector('.submit-button');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate an AJAX request with a timeout
            setTimeout(function() {
                // Success response
                showSuccessMessage();
                
                // Reset form
                contactForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
                
                // Reset CAPTCHA
                refreshCaptchaImage();
            }, 1500);
        });
    }
    
    // Refresh CAPTCHA button
    if (refreshCaptcha) {
        refreshCaptcha.addEventListener('click', function() {
            refreshCaptchaImage();
        });
    }
    
    // Functions
    function refreshCaptchaImage() {
        // In a real implementation, you would fetch a new CAPTCHA image
        // For this demo, we'll just add a timestamp to simulate a refresh
        const captchaImg = document.querySelector('.captcha-image img');
        if (captchaImg) {
            captchaImg.src = `https://via.placeholder.com/240x80?text=CAPTCHA&t=${Date.now()}`;
        }
    }
    
    function showValidationMessage(inputElement, message) {
        // Remove any existing error message
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and append error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e53e3e';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';
        
        inputElement.parentNode.appendChild(errorElement);
        
        // Highlight the input
        inputElement.style.borderColor = '#e53e3e';
        
        // Focus the input
        inputElement.focus();
    }
    
    function showSuccessMessage() {
        // Create success message element
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center;">
                <i class="fas fa-check-circle" style="color: #22c55e; font-size: 1.25rem; margin-right: 0.75rem;"></i>
                <span style="color: #15803d;">Your message has been sent successfully! We'll get back to you soon.</span>
            </div>
        `;
        
        // Insert at the beginning of the form
        contactForm.insertBefore(successElement, contactForm.firstChild);
        
        // Remove after 5 seconds
        setTimeout(function() {
            const message = document.querySelector('.success-message');
            if (message) {
                message.remove();
            }
        }, 5000);
    }
});