// Map implementation for Brews and Bytes workspace locations
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

let workspaceMap;
let markers = [];
let currentMetric = 'internet'; // Default metric to display

function initializeMap() {
    // Check if the map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Add event listeners to metric toggle buttons
    const metricButtons = document.querySelectorAll('.metric-btn');
    metricButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            metricButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update current metric
            currentMetric = this.dataset.metric;
            // Update markers on map
            updateMarkers();
        });
    });

    // Initialize map centered on Somerset West
    const somersetWestCenter = { lat: -34.0759, lng: 18.8431 };
    
    // Try to use Google Maps first, with fallback to Leaflet
    if (window.google && window.google.maps) {
        initGoogleMap(somersetWestCenter);
    } else {
        console.log('Google Maps not loaded, falling back to Leaflet');
        initLeafletMap(somersetWestCenter);
    }

    // Initial load of markers
    if (window.workspaceData) {
        loadWorkspaces(window.workspaceData);
    } else {
        console.error('Workspace data not available');
        // Mock data for testing if real data isn't available
        loadWorkspaces([
            {
                id: 'test-location',
                name: 'Test Location',
                address: '123 Test St, Somerset West',
                coordinates: somersetWestCenter,
                metrics: {
                    internet: { score: 4.5 },
                    video: { score: 4.0 },
                    vibe: { score: 3.8 },
                    wifi: { score: 4.2 },
                    power: { score: 3.5 }
                }
            }
        ]);
    }
}

function initGoogleMap(center) {
    // Create the map
    workspaceMap = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 14,
        styles: mapStyles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    // Add map loaded event
    google.maps.event.addListenerOnce(workspaceMap, 'tilesloaded', function() {
        console.log('Google Maps loaded successfully');
    });
}

function initLeafletMap(center) {
    // Create the map with Leaflet as fallback
    workspaceMap = L.map('map').setView([center.lat, center.lng], 14);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(workspaceMap);
}

function loadWorkspaces(workspaces) {
    // Clear existing markers
    clearMarkers();
    
    // Add markers for each workspace
    workspaces.forEach(workspace => {
        addMarker(workspace);
    });
}

function addMarker(workspace) {
    const position = workspace.coordinates;
    const score = getScoreForMetric(workspace, currentMetric);
    const markerColor = getColorForScore(score);
    
    // Create marker based on map type
    let marker;
    
    if (window.google && window.google.maps) {
        // Google Maps marker
        const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            scale: 12
        };
        
        marker = new google.maps.Marker({
            position: position,
            map: workspaceMap,
            title: workspace.name,
            icon: markerIcon,
            optimized: false,
            workspace: workspace
        });
        
        // Add click event
        marker.addListener('click', function() {
            openPlaceDetails(workspace);
        });
        
    } else {
        // Leaflet marker
        const markerIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        marker = L.marker([position.lat, position.lng], {
            icon: markerIcon,
            title: workspace.name
        }).addTo(workspaceMap);
        
        // Add workspace data to marker
        marker.workspace = workspace;
        
        // Add click event
        marker.on('click', function() {
            openPlaceDetails(workspace);
        });
    }
    
    // Add tooltip or label
    addMarkerLabel(marker, workspace);
    
    // Store marker for later reference
    markers.push(marker);
}

function addMarkerLabel(marker, workspace) {
    const score = getScoreForMetric(workspace, currentMetric);
    const formattedScore = score.toFixed(1);
    const metricLabel = getMetricLabel(currentMetric);
    
    if (window.google && window.google.maps) {
        // Google Maps InfoWindow
        const infoContent = `
            <div class="map-tooltip">
                <h3>${workspace.name}</h3>
                <div class="metric-score">
                    <span class="metric-label">${metricLabel}:</span>
                    <span class="score">${formattedScore}/5</span>
                </div>
            </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
            content: infoContent,
            pixelOffset: new google.maps.Size(0, -10)
        });
        
        // Show on hover
        marker.addListener('mouseover', function() {
            infoWindow.open(workspaceMap, marker);
        });
        
        marker.addListener('mouseout', function() {
            infoWindow.close();
        });
        
    } else {
        // Leaflet tooltip
        marker.bindTooltip(`
            <div class="map-tooltip">
                <h3>${workspace.name}</h3>
                <div class="metric-score">
                    <span class="metric-label">${metricLabel}:</span>
                    <span class="score">${formattedScore}/5</span>
                </div>
            </div>
        `, {
            permanent: false,
            direction: 'top',
            className: 'leaflet-tooltip'
        });
    }
}

function updateMarkers() {
    // Update marker colors based on the selected metric
    markers.forEach(marker => {
        const workspace = marker.workspace;
        const score = getScoreForMetric(workspace, currentMetric);
        const markerColor = getColorForScore(score);
        
        // Update marker color based on map type
        if (window.google && window.google.maps) {
            // Google Maps marker update
            const updatedIcon = {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 0.8,
                strokeWeight: 1,
                strokeColor: '#ffffff',
                scale: 12
            };
            
            marker.setIcon(updatedIcon);
            
        } else {
            // Leaflet marker update - recreate the icon
            const updatedIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            
            marker.setIcon(updatedIcon);
        }
        
        // Update tooltip/label
        addMarkerLabel(marker, workspace);
    });
}

function clearMarkers() {
    // Remove all markers from the map
    if (window.google && window.google.maps) {
        // Google Maps markers
        markers.forEach(marker => {
            marker.setMap(null);
        });
    } else {
        // Leaflet markers
        markers.forEach(marker => {
            workspaceMap.removeLayer(marker);
        });
    }
    
    // Clear markers array
    markers = [];
}

function getScoreForMetric(workspace, metric) {
    // Get the score for the selected metric from the workspace data
    return workspace.metrics[metric] ? workspace.metrics[metric].score : 3.0;
}

function getMetricLabel(metric) {
    // Return readable label for metric
    const labels = {
        'internet': 'Internet Speed',
        'video': 'Video Call Quality',
        'vibe': 'Vibe Check',
        'wifi': 'WiFi Coverage',
        'power': 'Power Availability'
    };
    
    return labels[metric] || metric;
}

function getColorForScore(score) {
    // Return color based on score (1-5 scale)
    if (score >= 4.5) return '#00AD5C'; // Excellent
    if (score >= 3.8) return '#7FB800'; // Good
    if (score >= 3.0) return '#FFB400'; // Average
    if (score >= 2.0) return '#FF7F00'; // Below Average
    return '#FF4F4F'; // Poor
}

function openPlaceDetails(workspace) {
    // Handle opening the place details overlay
    console.log('Opening details for:', workspace.name);
    
    // Check if place card connector function exists
    if (typeof showPlaceDetails === 'function') {
        showPlaceDetails(workspace.id);
    } else {
        // Fallback: create a simple alert
        alert(`
            ${workspace.name}
            Address: ${workspace.address}
            Internet Speed: ${workspace.metrics.internet.score.toFixed(1)}/5
            Vibe: ${workspace.metrics.vibe.score.toFixed(1)}/5
        `);
    }
}

// Customize map style for a coffee-themed look
const mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#6195a0"}]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"color": "#f2f2f2"}]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#f7f4ee"}]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#d1e6c9"}, {"visibility": "on"}]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{"saturation": -100}, {"lightness": 45}, {"visibility": "simplified"}]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{"visibility": "simplified"}]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#f5d6a6"}, {"visibility": "simplified"}]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [{"color": "#4e4e4e"}]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#787878"}]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"color": "#a5c4c7"}, {"visibility": "on"}]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#b9dceb"}]
    }
];