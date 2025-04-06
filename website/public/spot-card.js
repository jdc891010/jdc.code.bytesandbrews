// Import spotsData from spots-data.js if needed
// const spotsData is already defined in spots-data.js

// Check if metricIcons is already defined (from spots-data.js)
if (typeof window.metricIcons === 'undefined') {
    window.metricIcons = {
        internet: 'fas fa-wifi',
        vibes: 'fas fa-heart',
        power: 'fas fa-plug',
        coffee: 'fas fa-coffee',
        parking: 'fas fa-parking',
        stability: 'fas fa-signal'
    };
}

// Use existing helper functions if available, otherwise define them
if (typeof window.generateConfidenceIndicator === 'undefined') {
    window.generateConfidenceIndicator = function(testCount) {
        // Define confidence levels
        let confidence = 'low';
        if (testCount >= 20) {
            confidence = 'high';
        } else if (testCount >= 10) {
            confidence = 'medium';
        }
        
        // Generate HTML for confidence indicator
        return `<div class="confidence ${confidence}" title="${testCount} tests recorded">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>`;
    };
}

if (typeof window.getColorForRating === 'undefined') {
    window.getColorForRating = function(rating) {
        if (rating >= 4.5) return '#10b981'; // Green
        if (rating >= 3.5) return '#3b82f6'; // Blue
        if (rating >= 2.5) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };
}

if (typeof window.generateDotRating === 'undefined') {
    window.generateDotRating = function(rating) {
        const fullDots = Math.floor(rating);
        const halfDot = rating % 1 >= 0.5;
        const emptyDots = 5 - fullDots - (halfDot ? 1 : 0);
        
        return `${'<span class="dot full"></span>'.repeat(fullDots)}
                ${halfDot ? '<span class="dot half"></span>' : ''}
                ${'<span class="dot empty"></span>'.repeat(emptyDots)}`;
    };
}

if (typeof window.getRankClass === 'undefined') {
    window.getRankClass = function(index) {
        switch (index) {
            case 0: return 'gold';
            case 1: return 'silver';
            case 2: return 'bronze';
            default: return 'regular';
        }
    };
}

// Default ratings for spots that don't have ratings
if (typeof window.defaultRatings === 'undefined') {
    window.defaultRatings = {
        vibe: 3.5,
        noise: 3.0,
        power: 3.0,
        video: 3.0,
        coffee: 3.5,
        price: 3.0,
        staff: 3.5,
        parking: 3.0
    };
}

// Simplified spot card population
class SpotsCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeCategory = null;
        this.activeIndex = 0;
        this.totalSpots = 0;
        this.slideWidth = 0;
        this.row = null;
    }
    
    init(category) {
        this.activeCategory = category;
        this.activeIndex = 0;
        this.render();
    }
    
    render() {
        if (!this.activeCategory) {
            console.error("No active category set");
            return;
        }
        
        const tabContent = document.getElementById(`${this.activeCategory}-tab`);
        if (!tabContent) {
            console.error(`Tab content for ${this.activeCategory} not found`);
            return;
        }
        
        // Show loading state
        tabContent.innerHTML = '<div class="loading-indicator">Loading top spots...</div>';
        
        // Simulate API call
        setTimeout(() => {
            // Make sure spotsData is defined and has the category
            if (!window.spotsData) {
                console.error("spotsData is not defined");
                tabContent.innerHTML = '<div class="error-message">Error: Data not available</div>';
                return;
            }
            
            const spots = window.spotsData[this.activeCategory] || [];
            this.totalSpots = spots.length;
            
            console.log(`Found ${this.totalSpots} spots for ${this.activeCategory}`);
            
            if (spots.length === 0) {
                tabContent.innerHTML = '<div class="no-results">No spots found for this category.</div>';
                return;
            }
            
            // Create slider structure
            const sliderHTML = `
                <div class="spots-slider">
                    <div class="spots-row"></div>
                </div>
            `;
            
            tabContent.innerHTML = sliderHTML;
            
            // Get row and populate with spots
            this.row = tabContent.querySelector('.spots-row');
            if (!this.row) {
                console.error("Could not find spots-row element");
                return;
            }
            
            // Add dummy ratings to spots if needed
            const enhancedSpots = spots.map(spot => {
                // If spot doesn't have ratings, add default ratings
                if (!spot.ratings) {
                    return {
                        ...spot,
                        ratings: {...window.defaultRatings}
                    };
                }
                return spot;
            });
            
            this.populateSpots(enhancedSpots);
            
            // Get slide width for animations
            if (this.row.children.length > 0) {
                this.slideWidth = this.row.children[0].offsetWidth + 
                                 parseInt(getComputedStyle(this.row.children[0]).marginRight);
                console.log(`Slide width calculated: ${this.slideWidth}px`);
            } else {
                console.error("No slides were created");
            }
        }, 500);
    }
    
    populateSpots(spots) {
        spots.forEach((spot, index) => {
            if (!spot || typeof spot !== 'object') {
                console.error("Invalid spot data", spot);
                return;
            }
            
            const encodedAddress = encodeURIComponent(spot.address || "");
            
            // Ensure metricValue exists
            let metricValue = "";
            if (this.activeCategory === 'internet' || this.activeCategory === 'stability') {
                metricValue = `${spot.metricValue || "40"} Mbps`;
            } else {
                metricValue = `${spot.metricValue || "4.0"}/5`;
            }
            
            const cardHTML = `
                <div class="spot-card">
                    <!-- Left side - Info and links -->
                    <div class="spot-card-left">
                       <div class="spot-rank ${window.getRankClass(index)}">${index + 1}</div>
                        <div class="spot-header">
                            <h3 class="spot-name">${spot.name || "Unknown Location"}</h3>
                        </div>
                        <div class="spot-address">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${spot.address || "Address unavailable"}</span>
                        </div>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodedAddress}" 
                           target="_blank" class="directions-link">
                            <i class="fas fa-directions"></i> Get Directions
                        </a>
                        <div class="spot-metric">
                            <i class="${window.metricIcons[this.activeCategory] || 'fas fa-info-circle'}"></i>
                            <span class="spot-metric-value">${metricValue}</span>
                        </div>
                        <div class="speed-test-meta">
                            <div class="timestamp">Last tested: ${spot.lastTestDate || 'March 5, 2025'}</div>
                            <div class="test-count">
                                <i class="fas fa-chart-bar"></i>
                                <span>${spot.testCount || Math.floor(Math.random() * 15) + 5} data points</span>
                                <div class="confidence-indicator">
                                    ${window.generateConfidenceIndicator(spot.testCount || Math.floor(Math.random() * 15) + 5)}
                                </div>
                            </div>
                        </div>
                        <div class="tribe-badge">
                            <i class="fas fa-users"></i> Ruled by ${spot.dominantTribe || "Digital Nomads"}
                        </div>
                        ${spot.handicappedFacilities !== undefined ? `
                        <div class="handicapped-facilities-badge ${spot.handicappedFacilities ? 'accessible' : 'not-accessible'}">
                            <i class="fas fa-wheelchair"></i> ${spot.handicappedFacilities ? 'Handicapped Accessible' : 'Not Handicapped Accessible'}
                        </div>` : `
                        <div class="handicapped-facilities-badge unknown">
                            <i class="fas fa-wheelchair"></i> Handicapped Accessibility Unknown
                        </div>`}
                        
                        ${spot.limitedInternet !== undefined ? `
                        <div class="internet-limit-badge ${spot.limitedInternet ? 'limited' : 'unlimited'}">
                            <i class="fas fa-wifi"></i> ${spot.limitedInternet ? 'Limited Internet' : 'Unlimited Internet'}
                        </div>` : `
                        <div class="internet-limit-badge unknown">
                            <i class="fas fa-wifi"></i> Internet Limit Unknown
                        </div>`}
                        
                        ${spot.averageSpend ? `
                        <div class="average-spend-badge">
                            <i class="fas fa-money-bill-wave"></i> Average Spend: ${spot.averageSpend}
                        </div>` : `
                        <div class="average-spend-badge unknown">
                            <i class="fas fa-money-bill-wave"></i> Average Spend: Unknown
                        </div>`}
                    </div>
                    
                    <!-- Right side - Ratings -->
                    <div class="spot-card-right">
                        <div class="ratings-section">
                            <div class="rating-grid">
                                <div class="rating-item">
                                    <span class="rating-label">Vibe:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.vibe || 3.5)};">
                                        ${window.generateDotRating(spot.ratings?.vibe || 3.5)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Noise:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.noise || 3.0)};">
                                        ${window.generateDotRating(spot.ratings?.noise || 3.0)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Power:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.power || 3.0)};">
                                        ${window.generateDotRating(spot.ratings?.power || 3.0)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Video:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.video || 3.0)};">
                                        ${window.generateDotRating(spot.ratings?.video || 3.0)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Coffee:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.coffee || 3.5)};">
                                        ${window.generateDotRating(spot.ratings?.coffee || 3.5)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Price:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.price || 3.0)};">
                                        ${window.generateDotRating(spot.ratings?.price || 3.0)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Staff:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.staff || 3.5)};">
                                        ${window.generateDotRating(spot.ratings?.staff || 3.5)}
                                    </div>
                                </div>
                                <div class="rating-item">
                                    <span class="rating-label">Parking:</span>
                                    <div class="dot-rating" style="--rating-color: ${window.getColorForRating(spot.ratings?.parking || 3.0)};">
                                        ${window.generateDotRating(spot.ratings?.parking || 3.0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="view-spot-btn" data-id="${spot.id}">
                        <i class="fas fa-external-link-alt"></i> View Details
                    </button>
                </div>
            `;
            
            this.row.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        // Add event listeners to the View Details buttons
        document.querySelectorAll('.view-spot-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const spotId = parseInt(button.getAttribute('data-id'));
                if (typeof window.openBrewsAndBytesSpotDetail === 'function') {
                    try {
                        window.openBrewsAndBytesSpotDetail(spotId);
                    } catch (error) {
                        console.error('Error opening spot detail:', error);
                    }
                } else {
                    console.log(`View details for spot ${spotId}, but openBrewsAndBytesSpotDetail function is not available`);
                }
            });
        });
    }
    
    // Navigation functions
    generateNavButtons() {
        let buttons = '';
        for (let i = 0; i < this.totalSpots; i++) {
            buttons += `<button class="slider-btn${i === 0 ? ' active' : ''}" data-index="${i}">${i + 1}</button>`;
        }
        return buttons;
    }
    
    initNavButtons() {
        const buttons = document.querySelectorAll('.slider-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
    }
    
    updateActiveButton() {
        const buttons = document.querySelectorAll('.slider-btn');
        buttons.forEach((button, index) => {
            if (index === this.activeIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSpots) return;
        
        this.activeIndex = index;
        
        // Animate the row
        if (this.row) {
            this.row.style.transform = `translateX(-${this.slideWidth * this.activeIndex}px)`;
        }
        
        // Update nav buttons
        this.updateActiveButton();
    }
    
    next() {
        if (this.activeIndex < this.totalSpots - 1) {
            this.goToSlide(this.activeIndex + 1);
        }
    }
    
    prev() {
        if (this.activeIndex > 0) {
            this.goToSlide(this.activeIndex - 1);
        }
    }
    
    changeCategory(category) {
        this.activeCategory = category;
        this.activeIndex = 0;
        this.render();
    }
}

// Initialize carousel and tab switching
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing carousel");
    
    // Check if container exists
    const container = document.getElementById('spots-container');
    if (!container) {
        console.error("Container 'spots-container' not found");
        return;
    }
    
    // Check if spotsData is defined
    if (typeof spotsData === 'undefined' || !spotsData) {
        console.error("spotsData is not defined");
        // Create dummy data if needed
        window.spotsData = {
            internet: [
                { 
                    id: 1, 
                    name: "Bootlegger Coffee Company", 
                    address: "12 Bright Street, Somerset West, Cape Town",
                    ratings: window.defaultRatings,
                    dominantTribe: "Code Conjurers"
                }
            ],
            vibes: [],
            power: [],
            coffee: [],
            parking: [],
            stability: []
        };
    }
    
    // Create carousel instance
    const carousel = new SpotsCarousel('spots-container');
    
    // Add click event to each tab button
    const tabButtons = document.querySelectorAll('.category-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get category from data-tab attribute
            const category = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to current tab and content
            this.classList.add('active');
            const activeContent = document.getElementById(`${category}-tab`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
            
            // Change carousel category
            carousel.changeCategory(category);
        });
    });
    
    // Initialize with the default category (internet)
    console.log("Initializing carousel with 'internet' category");
    carousel.init('internet');
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            carousel.next();
        } else if (event.key === 'ArrowLeft') {
            carousel.prev();
        }
    });
    
    // Add swipe navigation for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const minSwipeDistance = 50;
        if (touchEndX < touchStartX - minSwipeDistance) {
            // Swiped left
            carousel.next();
        }
        
        if (touchEndX > touchStartX + minSwipeDistance) {
            // Swiped right
            carousel.prev();
        }
    }
});