// This script prevents the form from submitting when rating buttons are clicked
document.addEventListener('DOMContentLoaded', function() {
    // Get all the toggle buttons in the rating widgets
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    // Add event listeners to prevent form submission
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent the click from bubbling up to parent elements
            event.stopPropagation();
            
            // Prevent any default behavior (like form submission)
            event.preventDefault();
            
            // Get the parent container and rating ID
            const ratingWidget = this.closest('.toggle-rating');
            if (!ratingWidget) return;
            
            const ratingId = ratingWidget.getAttribute('data-rating-id');
            const ratingValue = this.getAttribute('data-value');
            
            // Get all buttons in this widget and remove active class
            const allButtons = ratingWidget.querySelectorAll('.toggle-btn');
            allButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to the clicked button
            this.classList.add('active');
            
            // Update the rating value display
            const ratingValueDisplay = ratingWidget.querySelector('.rating-value');
            if (ratingValueDisplay) {
                ratingValueDisplay.textContent = `${ratingValue}/5`;
            }
            
            // Update the description text
            updateRatingDescription(ratingWidget, ratingValue);
            
            // Log for debugging
            console.log(`Rating ${ratingId} changed to ${ratingValue}`);
        });
    });
    
    // Function to update the description text
    function updateRatingDescription(ratingWidget, ratingValue) {
        const descriptionElement = ratingWidget.querySelector('.rating-description span');
        if (!descriptionElement) return;
        
        // Get descriptions from the hidden element
        const descriptionsElement = ratingWidget.querySelector('.hidden-descriptions');
        if (descriptionsElement && descriptionsElement.getAttribute('data-descriptions')) {
            try {
                const descriptions = JSON.parse(descriptionsElement.getAttribute('data-descriptions'));
                const descIndex = parseInt(ratingValue) - 1;
                if (descriptions && descriptions[descIndex]) {
                    descriptionElement.textContent = descriptions[descIndex];
                }
            } catch (error) {
                console.error('Error parsing descriptions:', error);
            }
        }
    }
    
    // Enable Run Speed Test button when location is confirmed
    function setupLocationConfirmationListener() {
        // Listen for changes to the location-confirmation container
        const locationConfirmation = document.getElementById('location-confirmation');
        if (locationConfirmation) {
            // Create a MutationObserver to watch for changes to the location confirmation
            const observer = new MutationObserver(function(mutations) {
                // Check if location has been confirmed
                if (locationConfirmation.innerHTML.trim() !== '') {
                    // Enable the speed test button
                    const startTestButton = document.getElementById('start-test');
                    if (startTestButton) {
                        startTestButton.removeAttribute('disabled');
                        startTestButton.classList.remove('disabled');
                        startTestButton.style.backgroundColor = '#DAA520'; // Dark gold/yellow
                        startTestButton.style.color = '#333'; // Dark text for contrast
                    }
                }
            });
            
            // Start observing the location confirmation container
            observer.observe(locationConfirmation, { childList: true, subtree: true, characterData: true });
        }
    }
    
    // Set up direct event listener for location selection
    document.addEventListener('locationSelected', function(e) {
        // Enable the speed test button when location is selected
        const startTestButton = document.getElementById('start-test');
        if (startTestButton) {
            startTestButton.removeAttribute('disabled');
            startTestButton.classList.remove('disabled');
            startTestButton.style.backgroundColor = '#DAA520'; // Dark gold/yellow
            startTestButton.style.color = '#333'; // Dark text for contrast
        }
    });
    
    // Initialize location confirmation listener
    setupLocationConfirmationListener();
    
    // Add styling for active speed test button
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #start-test:not([disabled]):not(.disabled) {
            background-color: #DAA520 !important; /* Dark gold/yellow */
            color: #000 !important; /* Black text when active */
            cursor: pointer;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Handle form submission properly
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(event) {
            // You can add validation logic here if needed
            // For now, just prevent default to check if it fixes the issue
            // event.preventDefault();
            
            console.log('Form submission handled properly');
            // Uncomment the line below to let the form submit normally when ready
            // return true;
        });
    }
});