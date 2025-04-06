// Configuration parameters
const SEARCH_RADIUS = 50; // Search radius in meters
const PLACE_TYPES_PRIORITY = ['cafe', 'bakery', 'restaurant', 'bar', 'book_store']; // Priority order
let googleMapsApiKey = null; // Will store the API key once fetched
let map = null; // Global map object
let selectedPlaceMarker = null; // Selected place marker
let searchAreaMarker = null; // Marker for the area selected by user
let selectedLocation = null; // Store currently selected location data
let nearbyPlaces = []; // Store nearby places

// Somerset West default center coordinates
const SOMERSET_WEST_CENTER = {
    lat: -34.080,
    lng: 18.845
};

// Define the greater Somerset West area including Strand
const GREATER_SOMERSET_AREA = {
    north: -33.880, // Northern boundary
    south: -34.230, // Southern boundary 
    west: 18.650,   // Western boundary
    east: 19.030    // Eastern boundary
};

/**
 * Checks if a location is within Somerset West boundaries
 * @param {Object} location - The location with lat and lng properties
 * @returns {boolean} - True if location is within Somerset West
 */
function isWithinSomersetWest(location) {
    // For debugging purposes, log the location being checked
    console.log('Checking location:', location);
    
    const result = (
        location.lat >= GREATER_SOMERSET_AREA.south &&
        location.lat <= GREATER_SOMERSET_AREA.north &&
        location.lng >= GREATER_SOMERSET_AREA.west &&
        location.lng <= GREATER_SOMERSET_AREA.east
    );
    
    console.log('Is within Somerset West:', result);
    return result;
}

/**
 * Sorts places based on priority types
 */
function sortPlacesByPriority(places) {
    // First, organize places by type
    const placesByType = {};
    const otherPlaces = [];
    
    // Categorize places
    places.forEach(place => {
        let categorized = false;
        
        // Places can have multiple types
        if (place.types) {
            // Check if place falls into any of our priority categories
            for (const priorityType of PLACE_TYPES_PRIORITY) {
                if (place.types.includes(priorityType)) {
                    if (!placesByType[priorityType]) {
                        placesByType[priorityType] = [];
                    }
                    placesByType[priorityType].push(place);
                    categorized = true;
                    break; // If a place fits multiple categories, use the highest priority one
                }
            }
        }
        
        // If not in any of our priority categories
        if (!categorized) {
            otherPlaces.push(place);
        }
    });
    
    // Create final sorted list
    let sortedPlaces = [];
    
    // Add priority types in order
    PLACE_TYPES_PRIORITY.forEach(type => {
        if (placesByType[type]) {
            sortedPlaces = sortedPlaces.concat(placesByType[type]);
        }
    });
    
    // Add remaining places
    sortedPlaces = sortedPlaces.concat(otherPlaces);
    
    return sortedPlaces;
}

function updateMapStatus(message, type = 'info') {
    const statusEl = document.getElementById('location-validation-status');
    if (statusEl) {
        statusEl.textContent = message;
        
        // Reset classes
        statusEl.className = 'location-validation-status';
        
        // Add appropriate class based on type
        if (type === 'error') {
            statusEl.classList.add('error');
        } else if (type === 'success') {
            statusEl.classList.add('success');
        } else {
            statusEl.classList.add('info');
        }
    }
    console.log(`Map status (${type}):`, message);
}

/**
 * Securely loads Google Maps by fetching API key from the server
 */
function loadGoogleMapsApiSecurely() {
    // Update API status indicator if it exists
    const statusEl = document.getElementById('api-status');
    if (statusEl) {
        statusEl.textContent = 'API Status: Loading Google Maps...';
    }
    
    console.log('Loading Google Maps directly for testing...');
    
    // Use a temporary API key for testing
    // Replace this with your actual Google Maps API key
    const apiKey = 'AIzaSyDPEBZvSbVV6imnrW36PuyCJP5LbJDH1IM';
    googleMapsApiKey = apiKey;
    
    // Load Google Maps with the API key
    loadGoogleMaps(apiKey);
    
    // Dispatch an event to notify other scripts that the API key is available
    document.dispatchEvent(new CustomEvent('googleApiKeyReady', { detail: apiKey }));
}

/**
 * Loads Google Maps API script with the provided key
 */
function loadGoogleMaps(apiKey) {
    // Remove any existing Google Maps script
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
        document.head.removeChild(existingScript);
    }
    
    // Create the global callback
    window.initGoogleMapsCallback = function() {
        console.log('Google Maps API loaded successfully');
        
        // Update status if element exists
        const statusEl = document.getElementById('api-status');
        if (statusEl) {
            statusEl.textContent = 'API Status: Google Maps loaded successfully';
            statusEl.style.backgroundColor = '#d4edda';
        }
        
        // Initialize map with Somerset West center
        initSomersetWestMap();
    };
    
    // Create the script element with Places library and marker beta
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&callback=initGoogleMapsCallback&loading=async&v=beta`;
    script.async = true;
    script.defer = true;
    
    // Add error handling
    script.onerror = function() {
        console.error('Google Maps script failed to load');
        
        // Update status if element exists
        const statusEl = document.getElementById('api-status');
        if (statusEl) {
            statusEl.textContent = 'API Status: Google Maps failed to load';
            statusEl.style.backgroundColor = '#fff3cd';
        }
    };
    
    // Add script to document
    document.head.appendChild(script);
    
    // Use a fallback if Google Maps doesn't load within a reasonable time
    const loadTimeout = setTimeout(function() {
        const statusEl = document.getElementById('api-status');
        if (statusEl && statusEl.textContent.includes('Fetching Google Maps API key')) {
            console.warn('Google Maps API load timed out');
            statusEl.textContent = 'API Status: Google Maps API load timed out, showing fallback map';
            statusEl.style.backgroundColor = '#fff3cd';
            
            // Try to use fallback map solution
            const mapElement = document.getElementById('location-map');
            if (mapElement) {
                try {
                    // Try to use Leaflet instead if it's available
                    if (typeof L !== 'undefined') {
                        // Initialize a basic Leaflet map of Somerset West
                        const leafletMap = L.map(mapElement).setView([SOMERSET_WEST_CENTER.lat, SOMERSET_WEST_CENTER.lng], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: ' OpenStreetMap contributors'
                        }).addTo(leafletMap);
                        
                        updateMapStatus('Map loaded using alternative provider. Click anywhere to select a location.', 'success');
                    } else {
                        // If neither Google Maps nor Leaflet is available, show a message
                        mapElement.innerHTML = '<div style="padding: 20px; text-align: center;"><p>Map loading failed. Please try refreshing the page or search for a location by name.</p></div>';
                        updateMapStatus('Map loading failed. Please try refreshing the page or type a location name in the search box.', 'error');
                    }
                } catch (e) {
                    console.error('Fallback map failed:', e);
                    mapElement.innerHTML = '<div style="padding: 20px; text-align: center;"><p>Map loading failed. Please try refreshing the page or search for a location by name.</p></div>';
                }
            }
        }
    }, 15000); // 15-second timeout
    
    // Clear the timeout if Google Maps loads successfully
    window.initGoogleMapsCallback = function() {
        clearTimeout(loadTimeout);
        console.log('Google Maps API loaded successfully');
        
        // Update status if element exists
        const statusEl = document.getElementById('api-status');
        if (statusEl) {
            statusEl.textContent = 'API Status: Google Maps loaded successfully';
            statusEl.style.backgroundColor = '#d4edda';
        }
        
        // Initialize map with Somerset West center
        initSomersetWestMap();
    };
}

/**
 * Gets nearby places using Google Places API
 */
async function getNearbyPlaces(location) {
    if (!map) return;
    
    const service = new google.maps.places.PlacesService(map);
    
    // Create a combined promise to fetch all place types
    const placeTypes = ['cafe', 'bakery', 'restaurant'];
    const placePromises = placeTypes.map(type => {
        return new Promise((resolve, reject) => {
            const request = {
                location: location,
                radius: SEARCH_RADIUS,
                type: type
            };
            
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    resolve([]);
                } else {
                    reject(new Error(`Failed to fetch ${type} places: ${status}`));
                }
            });
        });
    });
    
    try {
        // Wait for all place type searches to complete
        const placeResults = await Promise.all(placePromises);
        
        // Combine all results and remove duplicates (by place_id)
        const combinedPlaces = [];
        const placeIds = new Set();
        
        placeResults.flat().forEach(place => {
            if (!placeIds.has(place.place_id)) {
                placeIds.add(place.place_id);
                
                // Calculate distance from clicked location
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                    location,
                    place.geometry.location
                );
                
                // Add distance property to place object
                place.distance = distance;
                combinedPlaces.push(place);
            }
        });
        
        // Sort places by distance (closest first)
        combinedPlaces.sort((a, b) => a.distance - b.distance);
        
        // Update the global nearbyPlaces array
        nearbyPlaces = combinedPlaces;
        
        // Update the dropdown with the sorted places
        updateLocationDropdown(nearbyPlaces);
        
        return nearbyPlaces;
    } catch (error) {
        console.error('Error fetching nearby places:', error);
        throw error;
    }
}

/**
 * Updates the location dropdown with nearby places
 */
function updateLocationDropdown(places) {
    const locationSelect = document.getElementById('location');
    if (!locationSelect) return;
    
    // Clear existing options except the default and "Add new location"
    while (locationSelect.options.length > 2) {
        locationSelect.remove(1);
    }
    
    // Add nearby places to the dropdown with distance information
    places.forEach(place => {
        const option = document.createElement('option');
        option.value = place.place_id;
        
        // Format distance to be user-friendly
        const distanceText = place.distance < 1000 ? 
            `${Math.round(place.distance)}m` : 
            `${(place.distance / 1000).toFixed(1)}km`;
            
        // Add place type icon based on types
        let typeIcon = '☕'; // Default to coffee cup
        if (place.types.includes('bakery')) {
            typeIcon = '🥐';
        } else if (place.types.includes('restaurant')) {
            typeIcon = '🍽️';
        }
        
        // Format the option text with name, type icon and distance
        option.textContent = `${typeIcon} ${place.name} (${distanceText})`;
        
        // Insert before the "Add new location" option
        locationSelect.insertBefore(option, locationSelect.lastChild);
    });
    
    // Enable the dropdown
    locationSelect.disabled = false;
}

/**
 * Initialize the map centered on Somerset West
 */
function initSomersetWestMap() {
    const mapElement = document.getElementById('location-map');
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    // Create the map centered on Somerset West
    map = new google.maps.Map(mapElement, {
        center: SOMERSET_WEST_CENTER,
        zoom: 13, // Show the whole Somerset West area
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        mapId: '8f348d49eec0a9be', // Required for Advanced Markers
        styles: [
            {
                // Style to highlight coffee shops and cafes
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "on" }
                ]
            },
            {
                // Make coffeeshops and cafes more prominent
                featureType: "poi.business",
                elementType: "labels.text",
                stylers: [
                    { weight: 1 },
                    { color: "#6F4E37" }
                ]
            }
        ]
    });
    
    // Add Somerset West boundary overlay for visual reference
    const somersetWestBounds = [
        {lat: GREATER_SOMERSET_AREA.north, lng: GREATER_SOMERSET_AREA.west}, // Northwest
        {lat: GREATER_SOMERSET_AREA.north, lng: GREATER_SOMERSET_AREA.east}, // Northeast
        {lat: GREATER_SOMERSET_AREA.south, lng: GREATER_SOMERSET_AREA.east}, // Southeast
        {lat: GREATER_SOMERSET_AREA.south, lng: GREATER_SOMERSET_AREA.west}  // Southwest
    ];
    
    const somersetWestArea = new google.maps.Polygon({
        paths: somersetWestBounds,
        strokeColor: "#4285F4",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#4285F4",
        fillOpacity: 0.05
    });
    
    somersetWestArea.setMap(map);
    
    // Add a label for Somerset West
    const mapLabelElement = document.createElement('div');
    mapLabelElement.className = 'map-label';
    mapLabelElement.textContent = 'Somerset West';
    mapLabelElement.style.fontWeight = 'bold';
    mapLabelElement.style.fontSize = '16px';
    mapLabelElement.style.color = '#333';
    
    const mapLabel = new google.maps.marker.AdvancedMarkerElement({
        position: SOMERSET_WEST_CENTER,
        map: map,
        content: mapLabelElement
    });
    
    // Initialize the search box
    initializeSearchBox(map);
    
    // Update map status with instructions
    updateMapStatus('Click anywhere on the map to see nearby coffee shops and workspaces.', 'info');
    
    // Add click listener to map for location selection
    map.addListener('click', function(event) {
        handleMapClick(event.latLng);
    });
    
    // Dispatch event to notify that map is initialized
    document.dispatchEvent(new Event('mapInitialized'));
}

/**
 * Handle map clicks
 */
function handleMapClick(clickedLocation) {
    if (!isWithinSomersetWest(clickedLocation)) {
        updateMapStatus('Please select a location within Somerset West.', 'error');
        showLocationRestrictionOverlay();
        return;
    }
    
    updateMapStatus('Searching for nearby places...', 'info');
    
    // Clear existing markers
    if (searchAreaMarker) {
        searchAreaMarker.setMap(null);
    }
    
    // Create a new marker at the clicked location
    const searchMarkerElement = document.createElement('div');
    searchMarkerElement.className = 'search-area-marker';
    searchMarkerElement.style.width = '20px';
    searchMarkerElement.style.height = '20px';
    searchMarkerElement.style.borderRadius = '50%';
    searchMarkerElement.style.backgroundColor = '#4285F4';
    searchMarkerElement.style.border = '2px solid #FFFFFF';
    
    searchAreaMarker = new google.maps.marker.AdvancedMarkerElement({
        position: clickedLocation,
        map: map,
        content: searchMarkerElement
    });
    
    // Get nearby places
    getNearbyPlaces(clickedLocation)
        .then(() => {
            updateMapStatus('Select a location from the dropdown below', 'success');
        })
        .catch(error => {
            updateMapStatus('Failed to find nearby places. Please try again.', 'error');
            console.error('Error fetching nearby places:', error);
        });
}

/**
 * Handle location dropdown change
 */
function handleLocationSelect(event) {
    const selectedId = event.target.value;
    if (selectedId === '') return;
    
    if (selectedId === 'other') {
        // Handle "Add new location" option
        document.getElementById('new-location-fields').classList.remove('hidden');
        return;
    }
    
    // Find the selected place
    const selectedPlace = nearbyPlaces.find(place => place.place_id === selectedId);
    if (!selectedPlace) return;
    
    // Check if the selected place is within Somerset West
    const location = {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng()
    };
    
    if (!isWithinSomersetWest(location)) {
        updateMapStatus('Selected location is outside Somerset West. Please choose a location within Somerset West.', 'error');
        showLocationRestrictionOverlay();
        return;
    }
    
    // Show confirmation in Step 2
    showLocationConfirmation(selectedPlace);
}

/**
 * Show location confirmation in Step 2
 */
function showLocationConfirmation(place) {
    const confirmationContainer = document.getElementById('location-confirmation');
    if (!confirmationContainer) return;
    
    // Add styles for the buttons
    const style = document.createElement('style');
    style.textContent = `
        .location-confirmation-container {
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            border-radius: 8px;
            background-color: #f8f8f8;
            margin: 15px 0;
        }
        .selected-place-info {
            text-align: center;
            padding: 15px;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
            margin: 10px 0;
        }
        .confirmation-buttons {
            display: flex;
            gap: 15px;
            margin-top: 15px;
            justify-content: center;
        }
        .place-confirm-btn, .place-cancel-btn {
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Quicksand', sans-serif;
            font-weight: 600;
            border: none;
            transition: all 0.3s ease;
            min-width: 140px;
        }
        .place-confirm-btn {
            background-color: #6F4E37;
            color: white;
        }
        .place-confirm-btn:hover {
            background-color: #5a3f2c;
            transform: translateY(-1px);
        }
        .place-cancel-btn {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
        }
        .place-cancel-btn:hover {
            background-color: #e5e5e5;
            transform: translateY(-1px);
        }
        .confirmation-message {
            font-family: 'Work Sans', sans-serif;
            color: #333;
            margin-bottom: 20px;
            font-size: 1.2em;
            font-weight: 500;
        }
        .selected-place-info strong {
            display: block;
            margin-bottom: 5px;
            color: #6F4E37;
        }
    `;
    document.head.appendChild(style);
    
    confirmationContainer.innerHTML = `
        <div class="location-confirmation-container">
            <div class="confirmation-message">
                Do you want to select "${place.name}"?
            </div>
            <div class="confirmation-buttons">
                <button id="confirm-place-btn" class="place-confirm-btn">Yes, select this place</button>
                <button id="cancel-place-btn" class="place-cancel-btn">No, continue searching</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('confirm-place-btn').addEventListener('click', () => {
        confirmPlaceSelection(place);
    });
    
    document.getElementById('cancel-place-btn').addEventListener('click', () => {
        // Reset the dropdown
        document.getElementById('location').value = '';
        confirmationContainer.innerHTML = '';
    });
}

/**
 * Confirms the place selection
 */
function confirmPlaceSelection(place) {
    // Check if the place is within Somerset West
    const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };
    
    if (!isWithinSomersetWest(location)) {
        updateMapStatus('Selected location is outside Somerset West. Please choose a location within Somerset West.', 'error');
        showLocationRestrictionOverlay();
        return;
    }
    
    // Store the selected location
    selectedLocation = {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address || place.vicinity || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };
    
    // Update the map marker
    if (selectedPlaceMarker) {
        selectedPlaceMarker.map = null;
    }
    
    const placeMarkerElement = document.createElement('div');
    placeMarkerElement.className = 'selected-place-marker';
    placeMarkerElement.style.width = '24px';
    placeMarkerElement.style.height = '24px';
    placeMarkerElement.style.backgroundColor = '#34A853'; // Google green
    placeMarkerElement.style.borderRadius = '50%';
    placeMarkerElement.style.border = '2px solid white';
    placeMarkerElement.title = place.name;
    
    // Add a ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '100%';
    ripple.style.height = '100%';
    ripple.style.borderRadius = '50%';
    ripple.style.boxShadow = '0 0 0 rgba(52, 168, 83, 0.4)';
    ripple.style.animation = 'ripple 1.5s infinite';
    placeMarkerElement.appendChild(ripple);
    
    selectedPlaceMarker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.geometry.location,
        content: placeMarkerElement
    });
    
    // Center the map on the selected place
    map.setCenter(place.geometry.location);
    
    // Enable the speed test button
    const speedTestButton = document.getElementById('start-test');
    if (speedTestButton) {
        speedTestButton.disabled = false;
        speedTestButton.classList.remove('disabled'); // Remove disabled class
    }
    
    // Enable the rest of the form
    enableReviewForm();
    
    // Update status
    updateMapStatus(`You've selected "${place.name}". Please complete the review form below.`, 'success');
    
    // Clear the confirmation UI
    document.getElementById('location-confirmation').innerHTML = `
        <div class="selected-place-info">
            <strong>${place.name}</strong><br>
            ${place.vicinity || place.formatted_address}
        </div>
    `;
}

/**
 * Enable the review form
 */
function enableReviewForm() {
    // Enable all form inputs after the location section
    const form = document.getElementById('review-form');
    if (!form) return;
    
    const locationSection = document.querySelector('.map-selection');
    let enableInputs = false;
    
    Array.from(form.elements).forEach(element => {
        if (element.closest('.map-selection')) {
            return; // Skip elements in the map selection section
        }
        if (element.closest('#new-location-fields')) {
            return; // Skip new location fields
        }
        element.disabled = false;
    });
}

/**
 * Initialize the search box for finding places on the map
 */
function initializeSearchBox(map) {
    const input = document.getElementById('address-search');
    if (!input) {
        console.error('Search input element not found');
        return;
    }
    
    // Create the search box
    const searchBox = new google.maps.places.SearchBox(input);
    
    // Bias the search box results towards current map bounds
    map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
    });
    
    // Listen for the event fired when the user selects a prediction
    searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        
        if (places.length === 0) {
            return;
        }
        
        // For each place, get the icon, name and location
        const bounds = new google.maps.LatLngBounds();
        const place = places[0]; // Taking the first place for simplicity
        
        if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
        }
        
        // Handle the place directly if it's found in search
        handleSearchResultPlace(place);
        
        // Fit the map to the selected place
        if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        
        map.fitBounds(bounds);
        map.setZoom(16); // Set a reasonable zoom level
    });
}

/**
 * Handle a place selected from the search box
 */
function handleSearchResultPlace(place) {
    // Check if the place is within Somerset West
    const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };
    
    if (!isWithinSomersetWest(location)) {
        updateMapStatus('Selected location is outside Somerset West. Please choose a location within Somerset West.', 'error');
        showLocationRestrictionOverlay();
        return;
    }
    
    // Clear previous markers
    if (searchAreaMarker) {
        searchAreaMarker.setMap(null);
    }
    
    if (selectedPlaceMarker) {
        selectedPlaceMarker.setMap(null);
    }
    
    // Create a marker for the selected place
    const placeMarkerElement = document.createElement('div');
    placeMarkerElement.className = 'selected-place-marker';
    placeMarkerElement.style.width = '24px';
    placeMarkerElement.style.height = '24px';
    placeMarkerElement.style.backgroundColor = '#34A853'; // Google green
    placeMarkerElement.style.borderRadius = '50%';
    placeMarkerElement.style.border = '2px solid white';
    placeMarkerElement.title = place.name;
    
    // Add a ripple effect
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '100%';
    ripple.style.height = '100%';
    ripple.style.borderRadius = '50%';
    ripple.style.boxShadow = '0 0 0 rgba(52, 168, 83, 0.4)';
    ripple.style.animation = 'ripple 1.5s infinite';
    placeMarkerElement.appendChild(ripple);
    
    selectedPlaceMarker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: place.geometry.location,
        content: placeMarkerElement
    });
    
    // Confirm with the user
    confirmPlaceSelection(place);
}

/**
 * Starts the speed test
 */
function startSpeedTest() {
    // Reset previous results
    resetSpeedTestUI();
    
    // Start the speed test
    runSpeedTest();
}

/**
 * Handles speed test results
 */
function handleSpeedTestResults(results) {
    if (!selectedLocation) return;
    
    // Add location data to speed test results
    const testData = {
        ...results,
        location: {
            id: selectedLocation.id,
            name: selectedLocation.name,
            coordinates: {
                lat: selectedLocation.lat,
                lng: selectedLocation.lng
            }
        },
        timestamp: new Date().toISOString()
    };
    
    // Save to database
    saveSpeedTestResult(testData);
    
    // Update UI with results
    document.getElementById('download-speed').textContent = `${results.download} Mbps`;
    document.getElementById('upload-speed').textContent = `${results.upload} Mbps`;
    document.getElementById('ping').textContent = `${results.ping} ms`;
    
    // Update hidden inputs
    document.getElementById('speed-test-download').value = results.download;
    document.getElementById('speed-test-upload').value = results.upload;
    document.getElementById('speed-test-ping').value = results.ping;
    document.getElementById('speed-test-timestamp').value = testData.timestamp;
}

/**
 * Shows the location restriction overlay
 */
function showLocationRestrictionOverlay() {
    const overlay = document.getElementById('location-restriction-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Set up event listeners for the overlay
        setupRestrictionOverlayListeners();
    }
}

/**
 * Sets up event listeners for the location restriction overlay
 */
function setupRestrictionOverlayListeners() {
    // Close button
    const closeButton = document.getElementById('close-restriction-button');
    if (closeButton) {
        closeButton.addEventListener('click', hideLocationRestrictionOverlay);
    }
    
    // Return to map button
    const returnButton = document.getElementById('return-to-map');
    if (returnButton) {
        returnButton.addEventListener('click', hideLocationRestrictionOverlay);
    }
    
    // Subscribe button
    const subscribeButton = document.getElementById('restriction-subscribe');
    if (subscribeButton) {
        subscribeButton.addEventListener('click', handleAreaSubscription);
    }
}

/**
 * Hides the location restriction overlay
 */
function hideLocationRestrictionOverlay() {
    const overlay = document.getElementById('location-restriction-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Handles the area expansion subscription
 */
function handleAreaSubscription() {
    const emailInput = document.getElementById('restriction-email');
    if (!emailInput || !emailInput.value) {
        // Show validation message if email is empty
        const subscriptionNote = document.querySelector('.subscription-note');
        if (subscriptionNote) {
            subscriptionNote.textContent = 'Please enter a valid email address.';
            subscriptionNote.style.color = '#ff4d4f';
        }
        return;
    }
    
    // Basic email validation
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const subscriptionNote = document.querySelector('.subscription-note');
        if (subscriptionNote) {
            subscriptionNote.textContent = 'Please enter a valid email address.';
            subscriptionNote.style.color = '#ff4d4f';
        }
        return;
    }
    
    // In a real implementation, you would send this to your backend
    console.log('Subscription email:', email);
    
    // Show success message
    const subscriptionForm = document.querySelector('.restriction-subscription');
    if (subscriptionForm) {
        subscriptionForm.innerHTML = `
            <div class="subscription-success">
                <i class="fas fa-check-circle"></i>
                <span>Thank you! We'll notify you when we expand to more areas.</span>
            </div>
        `;
    }
    
    // Update note
    const subscriptionNote = document.querySelector('.subscription-note');
    if (subscriptionNote) {
        subscriptionNote.textContent = 'You can now close this message or return to the map.';
        subscriptionNote.style.color = '#52c41a';
    }
}

// Initialize the map when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if the map container exists
    if (document.getElementById('location-map')) {
        console.log('Map container found, initializing map...');
        loadGoogleMapsApiSecurely();
    } else {
        console.error('Map container not found');
    }
    
    // Add event listener to the location dropdown if it exists
    const locationDropdown = document.getElementById('location');
    if (locationDropdown) {
        locationDropdown.addEventListener('change', handleLocationSelect);
    }
});