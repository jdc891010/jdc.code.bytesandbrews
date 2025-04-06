// This file connects spot cards with the place-card overlay

// Function to set up event listeners for spot cards
function setupSpotCardListeners() {
    // Add click event to all spot cards
    document.querySelectorAll('.spot-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Only handle clicks on the card itself, not on links within the card
            if (e.target.closest('a[href]')) {
                return; // Don't handle clicks on links (like "Get Directions")
            }
            
            // Find the spot ID from the "View Details" link inside this card
            const detailLink = this.querySelector('.spot-link');
            if (detailLink) {
                const spotId = detailLink.getAttribute('data-id');
                openSpotDetail(spotId);
            }
        });
    });

    // Add click event to all "View Details" links
    document.querySelectorAll('.spot-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const spotId = this.getAttribute('data-id');
            openSpotDetail(spotId);
        });
    });
}

// Function to open the spot detail overlay
function openSpotDetail(spotId) {
    // Convert ID to integer if it's a string
    const id = parseInt(spotId);
    
    // Find spot data across all categories
    let spot = null;
    
    // Loop through all categories in spotsData
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
    
    // If spot wasn't found, check placeCardSpotsData as fallback
    if (!spot && typeof placeCardSpotsData !== 'undefined') {
        spot = placeCardSpotsData.find(s => s.id === id);
    }
    
    if (!spot) {
        console.error(`Spot with ID ${id} not found`);
        return;
    }
    
    // Get the overlay element
    const overlay = document.getElementById('overlay');
    if (!overlay) {
        console.error('Overlay element not found');
        return;
    }
    
    // Prepare spot data for the place card
    const preparedSpot = prepareSpotForPlaceCard(spot);
    
    // Populate the place card with spot data
    populatePlaceCard(preparedSpot);
    
    // Show the overlay
    overlay.classList.remove('hidden');
    
    // Set up the close button
    setupCloseButton();
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
    const talkingPoints = tribesTalkingPoints[spot.dominantTribe] || {
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
    
    // Update comments
    const commentsContainer = document.getElementById('comments-container');
    if (commentsContainer) {
        commentsContainer.innerHTML = '';
        spot.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            
            let sentimentClass = '';
            let sentimentText = '';
            let sentimentIcon = '';
            
            if (comment.sentiment === 'positive') {
                sentimentClass = 'sentiment-positive';
                sentimentText = 'Positive';
                sentimentIcon = '<i class="fas fa-thumbs-up sentiment-positive sentiment-icon"></i>';
            } else if (comment.sentiment === 'negative') {
                sentimentClass = 'sentiment-negative';
                sentimentText = 'Negative';
                sentimentIcon = '<i class="fas fa-thumbs-down sentiment-negative sentiment-icon"></i>';
            } else {
                sentimentClass = 'sentiment-neutral';
                sentimentText = 'Neutral';
                sentimentIcon = '<div class="sentiment-neutral sentiment-icon" style="width:16px;height:2px;background-color:#9ca3af;border-radius:9999px;"></div>';
            }
            
            commentDiv.innerHTML = `
                <div class="comment-header">
                    <div class="comment-user">
                        <div class="user-avatar">${comment.user.charAt(0)}</div>
                        <div class="user-info">
                            <div class="user-name">${comment.user}</div>
                            <div class="user-tribe">${comment.tribe}</div>
                        </div>
                    </div>
                    <div class="comment-sentiment">
                        ${sentimentIcon}
                        <span class="sentiment-text">${sentimentText}</span>
                    </div>
                </div>
                <p class="comment-text">${comment.text}</p>
            `;
            
            commentsContainer.appendChild(commentDiv);
        });
    }
    
    // Check if updateSpotData function exists before calling it
    if (typeof updateSpotData === 'function') {
        // Generate heatmap data and initialize visualization
        updateSpotData(spot);
    } else {
        console.warn('updateSpotData function not found. Heatmap may not be initialized.');
    }
}

// Function to set up the close button
function setupCloseButton() {
    const closeButton = document.getElementById('close-button');
    if (closeButton) {
        // Remove any existing event listeners
        const newButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newButton, closeButton);
        
        // Add new event listener
        newButton.addEventListener('click', function() {
            document.getElementById('overlay').classList.add('hidden');
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
        // Setup close button for the overlay
        setupCloseButton();
        
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