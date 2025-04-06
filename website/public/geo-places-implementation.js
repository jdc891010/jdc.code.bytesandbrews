// Add these functions to the geo-places-implementation.js file

// Function to show and hide the loading indicator
function updateLocationDetectionStatus(isLoading) {
    // Dispatch custom events to notify about detection status
    const eventName = isLoading ? 'locationDetectionStart' : 'locationDetectionEnd';
    document.dispatchEvent(new Event(eventName));
}

// Update the main function to use the loading indicator
function initLocationBasedSuggestions() {
    const locationSelect = document.getElementById('location');
    
    if (!locationSelect) {
        console.error('Location select element not found');
        return;
    }
    
    // Show loading indicator
    updateLocationDetectionStatus(true);
    
    // Get user's location in the background
    getUserLocation()
        .then(location => {
            // Only continue if Google Maps Places API is available
            if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
                console.error('Google Maps Places API not loaded');
                throw new Error('Google Maps Places API not loaded');
            }
            
            return getNearbyPlaces(location);
        })
        .then(places => {
            if (!places || !places.length) {
                console.log('No nearby places found');
                return;
            }
            
            // Sort places by priority
            const sortedPlaces = sortPlacesByPriority(places);
            
            // Populate the dropdown
            populatePlacesDropdown(sortedPlaces, locationSelect);
        })
        .catch(error => {
            console.error('Error in location-based suggestions:', error);
        })
        .finally(() => {
            // Hide loading indicator regardless of success or failure
            updateLocationDetectionStatus(false);
        });
    
    // Event handler code remains the same
    // ...
}

// Helper function to handle the case when a user selects a place from Google Places
function handlePlaceSelection(placeData) {
    // Store the place data in a hidden field for form submission
    let hiddenPlaceDataField = document.getElementById('selected-place-data');
    
    if (!hiddenPlaceDataField) {
        // Create a hidden field if it doesn't exist
        hiddenPlaceDataField = document.createElement('input');
        hiddenPlaceDataField.type = 'hidden';
        hiddenPlaceDataField.id = 'selected-place-data';
        hiddenPlaceDataField.name = 'selected-place-data';
        document.getElementById('review-form').appendChild(hiddenPlaceDataField);
    }
    
    // Store the place data as JSON
    hiddenPlaceDataField.value = JSON.stringify(placeData);
    
    // Pre-fill the new location fields with the place data
    const newLocationNameField = document.getElementById('new-location-name');
    const newLocationAddressField = document.getElementById('new-location-address');
    
    if (newLocationNameField) {
        newLocationNameField.value = placeData.name;
    }
    
    if (newLocationAddressField) {
        newLocationAddressField.value = placeData.address;
    }
    
    // Show the new location fields
    const newLocationFields = document.getElementById('new-location-fields');
    if (newLocationFields) {
        newLocationFields.classList.remove('hidden');
    }
}

// Ensure spotsData is defined before using it
const spotsData = {
    internet: [
        {
            id: 1,
            name: "Digital Brew House",
            address: "456 Oak Avenue, Somerset West",
            metricValue: "85.2 Mbps",
            dominantTribe: "Code Conjurers",
            ratings: {
                vibe: 4.5,
                noise: 3.2,
                power: 5.0,
                video: 4.8,
                coffee: 4.0,
                price: 3.5,
                staff: 4.2,
                parking: 3.8
            }
        },
        // ... other spots
    ],
    vibes: [
        // ... spots for vibes category
    ]
};

// Ensure the event listener is added after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const locationSelect = document.getElementById('location');
    if (!locationSelect) {
        console.error('Location select element not found');
        return;
    }
    
    // Add event listener for location selection
    locationSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        
        // Check if a Google Place was selected (value starts with 'place_')
        if (selectedOption.value.startsWith('place_')) {
            // We need to handle this place data
            const placeData = {
                name: selectedOption.text,
                placeId: selectedOption.dataset.placeId,
                address: selectedOption.dataset.address,
                location: {
                    lat: parseFloat(selectedOption.dataset.lat),
                    lng: parseFloat(selectedOption.dataset.lng)
                },
                types: JSON.parse(selectedOption.dataset.types || '[]')
            };
            
            handlePlaceSelection(placeData);
        } else if (selectedOption.value === 'other') {
            // Show the new location fields
            const newLocationFields = document.getElementById('new-location-fields');
            if (newLocationFields) {
                newLocationFields.classList.remove('hidden');
            }
            
            // Clear any previously entered values
            const newLocationNameField = document.getElementById('new-location-name');
            const newLocationAddressField = document.getElementById('new-location-address');
            
            if (newLocationNameField) {
                newLocationNameField.value = '';
            }
            
            if (newLocationAddressField) {
                newLocationAddressField.value = '';
            }
        }
    });
});