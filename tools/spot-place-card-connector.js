/**
 * Brews and Bytes - Spot Card to Place Card Connector
 * 
 * This file serves as a bridge between the spot cards in the main grid
 * and the detailed place card overlay. It handles:
 * - Setting up event listeners for spot cards
 * - Finding and preparing data for the place card
 * - Calling the appropriate functions in place-card.js
 */

// Function to set up event listeners for spot cards
function setupSpotCardListeners() {
    // Add click event to all spot cards
    document.querySelectorAll('.spot-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Only handle clicks on the card itself, not on links within the card
            if (e.target.closest('a[href]')) {
                return; // Don't handle clicks on links (like "Get Directions")
            }
            
            // Get the spot ID from the data attribute
            const spotId = this.getAttribute('data-id');
            if (spotId) {
                openBrewsAndBytesSpotDetail(spotId);
            }
        });
    });

    // Add click event to all "View Details" links
    document.querySelectorAll('.spot-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const spotId = this.getAttribute('data-id');
            openBrewsAndBytesSpotDetail(spotId);
        });
    });
}

/**
 * Function to find and prepare spot data, then call the place-card.js openBrewsAndBytesSpotDetail function
 * This serves as a bridge between the spot cards and the place-card detail view
 */
function openBrewsAndBytesSpotDetail(spotId) {
    // Convert ID to integer if it's a string
    const id = parseInt(spotId);
    
    // Find spot data across all categories
    let spot = null;
    
    // Loop through all categories in spotsData
    if (typeof spotsData !== 'undefined') {
        for (const category in spotsData) {
            if (spotsData.hasOwnProperty(category)) {
                // Find spot with matching ID in this category
                const foundSpot = spotsData[category].find(s => s.id === id);
                if (foundSpot) {
                    spot = foundSpot;
                    break;
                }
            }
        }
    }
    
    // If spot wasn't found, check placeCardSpotsData as fallback
    if (!spot && typeof placeCardSpotsData !== 'undefined') {
        spot = placeCardSpotsData.find(s => s.id === id);
    }
    
    if (!spot) {
        console.error(`Spot with ID ${id} not found`);
        return;
    }
    
    // Prepare spot data for the place card
    const preparedSpot = prepareSpotForPlaceCard(spot);
    
    // Try to use the function from place-card.js if available
    // Otherwise use our fallback method
    try {
        // First check if the function is available in the window scope
        if (typeof window.openPlaceCardDetail === 'function') {
            window.openPlaceCardDetail(preparedSpot);
        } else if (typeof openPlaceCardDetail === 'function') {
            // Try without window scope
            openPlaceCardDetail(preparedSpot);
        } else if (typeof window.openBrewsAndBytesSpotDetail === 'function') {
            // Try the alias that's exposed in place-card.js
            window.openBrewsAndBytesSpotDetail(preparedSpot);
        } else {
            // Use our fallback method
            console.log('Using fallback method to open detail view');
            fallbackOpenDetail(preparedSpot);
        }
    } catch (error) {
        console.log('Error opening detail view, using fallback', error);
        // Fallback to direct manipulation if there's an error
        fallbackOpenDetail(preparedSpot);
    }
}

/**
 * Fallback function to directly open the detail view if place-card.js function isn't available
 * This should only be used as a last resort
 */
function fallbackOpenDetail(spot) {
    // Get the overlay element
    const overlay = document.getElementById('overlay');
    if (!overlay) {
        console.error('Overlay element not found');
        return;
    }
    
    console.warn('Using fallback method to open detail view - place-card.js integration recommended');
    
    // Populate the place card with spot data
    populatePlaceCard(spot);
    
    // Show the overlay
    overlay.classList.remove('hidden');
}

// Function to prepare spot data for the place card
function prepareSpotForPlaceCard(spot) {
    // Create a spot object with all required fields for the place card
    const preparedSpot = {
        id: spot.id || 0,
        name: spot.name || "Unknown Coffee Shop",
        address: spot.address || "No address available",
        phone: spot.phone || "+27 21 000 0000",
        googleRating: spot.ratings?.vibe || spot.googleRating || 4.0,
        googleReviews: spot.googleReviews || Math.floor(Math.random() * 300) + 50,
        hours: {
            open: "07:00",
            close: "18:00"
        },
        tribes: spot.tribes || ["Code Conjurers", "Word Weavers"],
        dominantTribe: spot.dominantTribe || "Code Conjurers",
        speedRank: spot.speedRank || 1,
        vibeRank: spot.vibeRank || 2,
        parkingRank: spot.parkingRank || 3,
        comments: spot.comments || [
            { 
                user: "DefaultUser", 
                text: "This place has a great vibe and fast Wi-Fi!", 
                sentiment: "positive", 
                tribe: "Code Conjurer" 
            }
        ],
        // Add these properties for heatmap compatibility
        internetData: {},
        vibeData: {},
        parkingData: {}
    };
    
    // If spot has hours, use them, otherwise keep the defaults
    if (spot.hours && typeof spot.hours === 'object') {
        preparedSpot.hours = {
            open: spot.hours.open || "07:00",
            close: spot.hours.close || "18:00"
        };
    }
    
    // Copy any other properties that might be needed
    if (spot.internetData) preparedSpot.internetData = spot.internetData;
    if (spot.vibeData) preparedSpot.vibeData = spot.vibeData;
    if (spot.parkingData) preparedSpot.parkingData = spot.parkingData;
    
    return preparedSpot;
}

// Function to populate the place card with spot data
function populatePlaceCard(spot) {
    // Helper function to safely update element content
    function updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        } else {
            console.warn(`Element with ID "${id}" not found`);
        }
    }

    // Helper function to safely update element HTML
    function updateElementHTML(id, html) {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with ID "${id}" not found`);
        }
    }

    // Update title
    updateElement('detail-title', spot.name);
    
    // Update basic info
    updateElement('address-text', spot.address);
    updateElement('hours-text', `Hours: ${formatTime(spot.hours.open)} - ${formatTime(spot.hours.close)}`);
    updateElement('phone-text', spot.phone);
    
    // Update rating
    updateElement('rating-value', `${spot.googleRating.toFixed(1)}/5`);
    updateElement('review-count', `(${spot.googleReviews} reviews)`);
    
    // Generate stars
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = `star ${i <= Math.floor(spot.googleRating) ? '' : 'star-empty'}`;
            star.innerHTML = '★';
            starsContainer.appendChild(star);
        }
    }
    
    // Update tribes
    const tribesContainer = document.getElementById('tribes-container');
    if (tribesContainer) {
        tribesContainer.innerHTML = '';
        spot.tribes.forEach(tribe => {
            const tribeTag = document.createElement('span');
            tribeTag.className = `tribe-tag ${tribe === spot.dominantTribe ? 'dominant-tribe' : ''}`;
            tribeTag.textContent = tribe;
            tribesContainer.appendChild(tribeTag);
        });
    }
    
    // Update rankings
    updateElement('speed-rank', `#${spot.speedRank}`);
    updateElement('vibe-rank', `#${spot.vibeRank}`);
    updateElement('parking-rank', `#${spot.parkingRank}`);
    
    // Update talking points
    updateElement('talking-points-title', `Talking Points with ${spot.dominantTribe}`);
    
    // Get talking points for this tribe
    const talkingPoints = window.tribesTalkingPoints?.[spot.dominantTribe] || {
        dos: ["Ask about their work", "Share your favorite coffee spots", "Discuss remote work tips"],
        donts: ["Interrupt their workflow", "Make loud phone calls", "Ask to use their laptop"]
    };
    
    // Update do's list
    const dosList = document.getElementById('dos-list');
    if (dosList) {
        dosList.innerHTML = '';
        talkingPoints.dos.forEach(point => {
            const li = document.createElement('li');
            li.className = 'talking-point-item';
            li.innerHTML = `<span class="point-bullet">•</span><span>${point}</span>`;
            dosList.appendChild(li);
        });
    }
    
    // Update don'ts list
    const dontsList = document.getElementById('donts-list');
    if (dontsList) {
        dontsList.innerHTML = '';
        talkingPoints.donts.forEach(point => {
            const li = document.createElement('li');
            li.className = 'talking-point-item';
            li.innerHTML = `<span class="point-bullet">•</span><span>${point}</span>`;
            dontsList.appendChild(li);
        });
    }
    
    // Update comments with color-coded styling based on sentiment
    const commentsContainer = document.getElementById('comments-container');
    if (commentsContainer) {
        commentsContainer.innerHTML = '';
        
        // Sort comments by date (newest first)
        const sortedComments = [...spot.comments].sort((a, b) => {
            const dateA = new Date(a.date || a.timestamp || '2024-01-01');
            const dateB = new Date(b.date || b.timestamp || '2024-01-01');
            return dateB - dateA;
        });
        
        sortedComments.forEach(comment => {
            // Determine sentiment from comment data or rating
            let sentiment = comment.sentiment;
            if (!sentiment && comment.rating) {
                if (comment.rating >= 4) sentiment = 'positive';
                else if (comment.rating <= 2.5) sentiment = 'negative';
                else sentiment = 'neutral';
            } else if (!sentiment) {
                sentiment = 'neutral';
            }
            
            // Create comment element with color-coded styling
            const commentDiv = document.createElement('div');
            commentDiv.className = `comment-item ${sentiment}`;
            
            // Get user name
            const userName = comment.user || comment.userName || 'Anonymous';
            
            // Get tribe if available
            const tribe = comment.tribe || '';
            
            // Format date
            let dateText = '';
            if (comment.date || comment.timestamp) {
                const date = new Date(comment.date || comment.timestamp);
                if (!isNaN(date)) {
                    dateText = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                } else {
                    dateText = comment.date || comment.timestamp;
                }
            }
            
            // Format rating
            const rating = comment.rating || 0;
            const ratingStars = rating > 0 ? `<i class="fas fa-star"></i> ${rating.toFixed(1)}` : '';
            
            // Build comment HTML with the new structure
            commentDiv.innerHTML = `
                <div class="comment-header">
                    <span class="comment-user">${userName}</span>
                    ${tribe ? `<span class="comment-tribe">${tribe}</span>` : ''}
                </div>
                <p class="comment-text">${comment.text || ''}</p>
                <div class="comment-footer">
                    <span class="comment-date">${dateText}</span>
                    <span class="comment-rating">${ratingStars}</span>
                </div>
            `;
            
            commentsContainer.appendChild(commentDiv);
        });
    }
    

}

// Helper function to format time
function formatTime(time) {
    if (!time) return "N/A";
    
    const hour = parseInt(time.split(':')[0]);
    const minute = time.split(':')[1] || "00";
    return hour < 12 ? 
        (hour === 0 ? '12' : hour) + ":" + minute + "am" : 
        (hour === 12 ? 12 : hour - 12) + ":" + minute + "pm";
}

// Function to initialize the connector
function initSpotPlaceCardConnector() {
    // When DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof window.setupCloseButton === 'function') { window.setupCloseButton(); }
        
        // Check if we're using SpotsCarousel class
        if (typeof SpotsCarousel !== 'undefined') {
            // Extend the populateSpots method to add listeners after populating
            const originalPopulateSpots = SpotsCarousel.prototype.populateSpots;
            SpotsCarousel.prototype.populateSpots = function(spots) {
                // Call the original method
                originalPopulateSpots.call(this, spots);
                
                // Add event listeners to the newly created spot cards
                setupSpotCardListeners();
            };
        } else {
            // If not using the SpotsCarousel class, try to add listeners after a delay
            setTimeout(setupSpotCardListeners, 1000);
        }
    });
}

// Initialize the connector
initSpotPlaceCardConnector();