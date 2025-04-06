document.addEventListener('DOMContentLoaded', function() {
    initToggleRatings();
    
    // Form submission listener
    const submitButton = document.querySelector('#submit-ratings');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            const allRatings = collectRatings();
            console.log('Collected Ratings:', allRatings);
            
            // Here you would send the ratings to your server
            // fetch('/api/submit-ratings', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(allRatings),
            // })
            // .then(response => response.json())
            // .then(data => console.log('Success:', data))
            // .catch(error => console.error('Error:', error));
        });
    }
});

// Initialize all toggle rating widgets
function initToggleRatings() {
    const toggleRatings = document.querySelectorAll('.toggle-rating');
    
    toggleRatings.forEach(widget => {
        const toggles = widget.querySelectorAll('.toggle-btn');
        const ratingValue = widget.querySelector('.rating-value');
        const ratingDescription = widget.querySelector('.rating-description span');
        
        // Get quirky descriptions from the hidden element
        let descriptions = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"]; // Default fallback
        const descriptionsElement = widget.querySelector('.hidden-descriptions');
        
        if (descriptionsElement && descriptionsElement.getAttribute('data-descriptions')) {
            try {
                descriptions = JSON.parse(descriptionsElement.getAttribute('data-descriptions'));
            } catch (e) {
                console.error('Error parsing descriptions JSON:', e);
            }
        }
        
        // Set initial description based on active button
        const activeToggle = widget.querySelector('.toggle-btn.active');
        if (activeToggle) {
            const activeIndex = parseInt(activeToggle.getAttribute('data-value')) - 1;
            if (descriptions[activeIndex]) {
                ratingDescription.textContent = descriptions[activeIndex];
            }
        }
        
        // Add event listeners to toggle buttons
        toggles.forEach((toggle) => {
            toggle.addEventListener('click', () => {
                // Update visual state
                toggles.forEach((t) => {
                    t.classList.remove('active');
                });
                toggle.classList.add('active');
                
                // Update rating value
                const rating = parseInt(toggle.getAttribute('data-value'));
                ratingValue.textContent = `${rating}/5`;
                
                // Update description with quirky label
                const descIndex = rating - 1;
                if (descriptions[descIndex]) {
                    ratingDescription.textContent = descriptions[descIndex];
                }
                
                // Additional event to notify of rating change
                widget.dispatchEvent(new CustomEvent('ratingChanged', { 
                    detail: { rating, type: 'toggle' } 
                }));
            });
        });
        
        // Make interactive if not in read-only mode
        if (!widget.classList.contains('readonly')) {
            widget.classList.add('interactive');
        }
    });
}

// Function to collect all ratings for form submission
function collectRatings() {
    const ratings = {};
    
    // Collect toggle ratings
    document.querySelectorAll('.toggle-rating').forEach(widget => {
        const ratingId = widget.getAttribute('data-rating-id');
        if (!ratingId) return; // Skip if no ID
        
        const activeToggle = widget.querySelector('.toggle-btn.active');
        if (activeToggle) {
            ratings[ratingId] = parseInt(activeToggle.getAttribute('data-value'));
        }
    });
    
    return ratings;
}