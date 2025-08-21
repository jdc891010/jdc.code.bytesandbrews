/**
 * Brews and Bytes - Coffee Shop Card 
 * Complete place-card.js with all fixes implemented
 * 
 * This script handles:
 * - Displaying coffee shop details
 * - Heatmap visualization
 * - Radar chart for score breakdown
 * - Talking points based on dominant tribe
 */

// Global state to track current place
let currentPlaceId = null;
let workspaceData = [];

// Initialize the card functionality once the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Brews and Bytes coffee shop card...');
  
  // Initialize card functionality
  initializePlaceCard();
  
  // Set up close button for the detail view
  setupCloseButton();
  
  // Set up metric button event listeners
  setupMetricButtons();
  
  // Enable radar chart toggle
  setupRadarToggle();
});

// Initialize the place card system
function initializePlaceCard() {
  console.log('Initializing place card system...');
  
  // Check if we already have workspace data
  if (!window.workspaceData && window.placeCardSpotsData) {
    console.log("Converting placeCardSpotsData to workspaceData format");
    window.workspaceData = convertPlaceCardData();
    workspaceData = window.workspaceData;
  } else if (window.workspaceData) {
    workspaceData = window.workspaceData;
  } else {
    // Create sample data if no data exists
    console.log("No workspace data found, creating sample data");
    workspaceData = createSampleWorkspaceData();
    window.workspaceData = workspaceData;
  }
}

// Immediately expose the functions globally so they're available before DOMContentLoaded
// This ensures they're available to other scripts that might load after this one
// Expose openSpotDetail as openPlaceCardDetail for connector integration
window.openPlaceCardDetail = openSpotDetail;

/**
 * Main function to open and populate the place card detail view
 * This is the primary entry point from the connector file
 * @param {Object} spot - The prepared spot data object
 */
function openPlaceCardDetail(spot) {
  // Store the current place ID
  currentPlaceId = spot.id;
  
  // Update the detail view title
  const detailTitle = document.getElementById('detail-title');
  if (detailTitle) {
    detailTitle.textContent = spot.name;
  }
  
  // Update basic information
  updateBasicInfo(spot);
  
  // Generate heatmap for the default metric (speed)
  generateHeatmap(spot.id, 'speed');
  
  // Populate talking points
  populateTalkingPoints(spot.id);
  
  // Populate comments section
  populateComments(spot.comments || []);
  
  // Show the overlay
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

/**
 * Update basic information in the detail view
 * @param {Object} spot - The spot data object
 */
function updateBasicInfo(spot) {
  // Helper function to safely update element text content
  function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }
  
  // Update address
  updateElementText('address-text', spot.address || 'Address not available');
  
  // Update hours
  if (spot.hours) {
    const openTime = formatTime(spot.hours.open);
    const closeTime = formatTime(spot.hours.close);
    updateElementText('hours-text', `Hours: ${openTime} - ${closeTime}`);
  }
  
  // Update phone
  updateElementText('phone-text', spot.phone || 'Phone not available');
  
  // Update Google rating
  updateElementText('rating-value', `${(spot.googleRating || 4.0).toFixed(1)}/5`);
  updateElementText('review-count', `(${spot.googleReviews || 0} reviews)`);
  
  // Update tribes
  const tribesContainer = document.getElementById('tribes-container');
  if (tribesContainer && spot.tribes && Array.isArray(spot.tribes)) {
    tribesContainer.innerHTML = '';
    spot.tribes.forEach(tribe => {
      const tribeTag = document.createElement('span');
      tribeTag.className = `tribe-tag ${tribe === spot.dominantTribe ? 'dominant-tribe' : ''}`;
      tribeTag.textContent = tribe;
      tribesContainer.appendChild(tribeTag);
    });
  }
  
  // Update rankings
  updateElementText('speed-rank', `#${spot.speedRank || 'N/A'}`);
  updateElementText('vibe-rank', `#${spot.vibeRank || 'N/A'}`);
  updateElementText('parking-rank', `#${spot.parkingRank || 'N/A'}`);
  updateElementText('noise-rank', `#${spot.noiseRank || 'N/A'}`);
  
  // Update talking points title
  updateElementText('talking-points-title', `Talking Points with ${spot.dominantTribe || 'Code Conjurers'}`);
}

// Set up the close button
function setupCloseButton() {
  const closeButton = document.getElementById('close-button');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }
    });
  }
  
  // Also allow clicking outside the detail container to close
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
      }
    });
  }
}

// Set up metric buttons for the heatmap
function setupMetricButtons() {
  const speedButton = document.getElementById('speed-button');
  const vibeButton = document.getElementById('vibe-button');
  const parkingButton = document.getElementById('parking-button');
  const noiseButton = document.getElementById('noise-button');
  
  const buttons = [speedButton, vibeButton, parkingButton, noiseButton];
  const metrics = ['speed', 'vibe', 'parking', 'noise'];
  
  // Function to handle metric button clicks
  const handleMetricButtonClick = function(clickedButton, metric) {
    // Remove active class from all buttons
    buttons.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (clickedButton) clickedButton.classList.add('active');
    
    // Generate heatmap with selected metric
    if (currentPlaceId) {
      generateHeatmap(currentPlaceId, metric);
    }
  };
  
  // Add click event listeners to each button
  buttons.forEach((button, index) => {
    if (button) {
      button.addEventListener('click', function() {
        handleMetricButtonClick(button, metrics[index]);
      });
    }
  });
}

// Set up radar chart toggle
function setupRadarToggle() {
  const radarToggleButton = document.getElementById('radar-toggle-button');
  const radarChartContainer = document.getElementById('radar-chart-container');
  
  if (radarToggleButton && radarChartContainer) {
    radarToggleButton.addEventListener('click', function() {
      // Toggle the collapsed class
      radarChartContainer.classList.toggle('collapsed');
      
      // Change the icon
      const icon = radarToggleButton.querySelector('i');
      if (icon) {
        if (radarChartContainer.classList.contains('collapsed')) {
          icon.className = 'fas fa-chevron-down';
        } else {
          icon.className = 'fas fa-chevron-up';
          // Generate the radar chart when expanded if not already generated
          if (!radarChartContainer.hasAttribute('data-generated')) {
            generateRadarChart();
            radarChartContainer.setAttribute('data-generated', 'true');
          }
        }
      }
    });
  }
}

// Function to set up event listeners for spot cards
function setupSpotCardListeners() {
  // Add click event to all spot cards
  document.querySelectorAll('.spot-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Only handle clicks on the card itself, not on links within the card
      if (e.target.closest('a[href]')) {
        return;
      }
      
      // Find the spot ID from data attribute or within this card
      const spotId = this.getAttribute('data-id') || 
                    this.querySelector('[data-id]')?.getAttribute('data-id');
      
      if (spotId) {
        openSpotDetail(spotId);
      }
    });
  });

  // Add click event to all "View Details" links
  document.querySelectorAll('.spot-link, .view-spot-btn').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const spotId = this.getAttribute('data-id');
      if (spotId) {
        openSpotDetail(spotId);
      }
    });
  });
}

// Function to open the spot detail overlay
function openSpotDetail(spotId) {
  try {
    console.log('Opening spot detail:', spotId);
    
    // Parse the ID if it's a string
    let id = spotId;
    if (typeof spotId === 'string') {
      id = parseInt(spotId, 10) || spotId;
    } else if (typeof spotId === 'object' && spotId !== null) {
      id = parseInt(spotId.id || spotId.spotId, 10) || spotId;
    }
    
    // Find the spot data
    let place = findPlaceById(id);
    
    if (!place) {
      console.error('No spot found with ID:', id);
      return;
    }
    
    // Store current place ID for reference
    currentPlaceId = id;
    
    // Populate the detail card
    populateDetailsCard(place);
    
    // Show the overlay
    showOverlay();
  } catch (error) {
    console.error('Error opening spot detail:', error);
  }
}

// Find a place by ID in the data sources
function findPlaceById(placeId) {
  // Try to find in workspaceData
  if (Array.isArray(workspaceData)) {
    const place = workspaceData.find(p => {
      return String(p.id) === String(placeId);
    });
    
    if (place) return place;
  }
  
  // Try to find in spotsData if available
  if (window.spotsData) {
    for (const category in window.spotsData) {
      if (window.spotsData.hasOwnProperty(category) && Array.isArray(window.spotsData[category])) {
        const foundSpot = window.spotsData[category].find(s => String(s.id) === String(placeId));
        if (foundSpot) {
          return convertSpotFormat(foundSpot);
        }
      }
    }
  }
  
  // Try to find in placeCardSpotsData as fallback
  if (window.placeCardSpotsData && Array.isArray(window.placeCardSpotsData)) {
    const foundSpot = window.placeCardSpotsData.find(s => String(s.id) === String(placeId));
    if (foundSpot) {
      return convertSpotFormat(foundSpot);
    }
  }
  
  return null;
}

// Populate the detail card with data
function populateDetailsCard(place) {
  try {
    // Set place name
    const titleElement = document.getElementById('detail-title');
    if (titleElement) {
      titleElement.textContent = place.name;
      titleElement.dataset.placeId = place.id;
    }
    
    // Set address
    const addressElement = document.getElementById('address-text');
    if (addressElement) {
      addressElement.textContent = place.address || 'Address not available';
    }
    
    // Set hours
    const hoursElement = document.getElementById('hours-text');
    if (hoursElement) {
      hoursElement.textContent = `Hours: ${place.hours || 'Not available'}`;
    }
    
    // Set phone
    const phoneElement = document.getElementById('phone-text');
    if (phoneElement) {
      phoneElement.textContent = place.phone || 'Phone not available';
    }
    
    // Set Google rating
    const ratingElement = document.getElementById('rating-value');
    if (ratingElement) {
      ratingElement.textContent = place.googleRating ? `${place.googleRating}/5` : 'N/A';
    }
    
    // Set review count
    const reviewCountElement = document.getElementById('review-count');
    if (reviewCountElement) {
      reviewCountElement.textContent = place.googleReviews ? `(${place.googleReviews} reviews)` : '';
    }
    
    // Generate stars
    generateStars(place.googleRating || 0);
    
    // Set tribes
    populateTribes(place.popularWithTribes || place.tribes || []);
    
    // Set rankings
    updateRankings(place);
    
    // Set talking points
    const dominantTribe = place.dominantTribe || 
                         (place.popularWithTribes && place.popularWithTribes[0]) || 
                         (place.tribes && place.tribes[0]) || 
                         'Digital Nomad';
    
    populateTalkingPoints(place.talkingPoints || [], dominantTribe);
    
    // Set overall score
    updateOverallScore(place);
    
    // Generate heatmap
    generateHeatmap(place.id, 'speed');
    
    // Update comments if they exist
    if (place.reviews || place.comments) {
      populateComments(place.reviews || place.comments);
    }
    
    // Update location-specific details if they exist
    updateLocationDetails(place);
    
    // Reset radar chart
    resetRadarChart();
  } catch (error) {
    console.error('Error populating details card:', error);
  }
}

// Generate star rating display
function generateStars(rating) {
  const starsContainer = document.getElementById('stars');
  if (!starsContainer) {
    return;
  }
  
  starsContainer.innerHTML = '';
  
  // Calculate full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement('i');
    star.className = 'fas fa-star star';
    star.style.color = '#fbbf24';
    starsContainer.appendChild(star);
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    const halfStar = document.createElement('i');
    halfStar.className = 'fas fa-star-half-alt star';
    halfStar.style.color = '#fbbf24';
    starsContainer.appendChild(halfStar);
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    const emptyStar = document.createElement('i');
    emptyStar.className = 'far fa-star star-empty';
    emptyStar.style.color = '#d1d5db';
    starsContainer.appendChild(emptyStar);
  }
}

// Populate tribes badges
function populateTribes(tribes) {
  const tribesContainer = document.getElementById('tribes-container');
  if (!tribesContainer) {
    return;
  }
  
  tribesContainer.innerHTML = '';
  
  if (!tribes || tribes.length === 0) {
    const noData = document.createElement('div');
    noData.className = 'text-gray-500 text-sm';
    noData.textContent = 'No tribe data available';
    tribesContainer.appendChild(noData);
    return;
  }
  
  // Get the dominant tribe (first in the list)
  const dominantTribe = tribes[0];
  
  // Add tribe badges
  tribes.forEach(tribe => {
    const tribeTag = document.createElement('div');
    tribeTag.className = 'tribe-tag';
    
    // Add dominant-tribe class if this is the dominant tribe
    if (tribe === dominantTribe) {
      tribeTag.classList.add('dominant-tribe');
    }
    
    tribeTag.textContent = tribe;
    tribesContainer.appendChild(tribeTag);
  });
}

// Update rankings with trend indicators
function updateRankings(place) {
  // Helper function to get random trend
  const getRandomTrend = () => Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  
  // Mock trend data or use real data if available
  const trends = place.trends || {
    wifi: getRandomTrend(),
    vibe: getRandomTrend(),
    parking: getRandomTrend(),
    noise: getRandomTrend()
  };
  
  // Helper function to get trend icon and class
  function getTrendHTML(trend) {
    let icon, cssClass;
    if (trend > 0) {
      icon = '↑'; // Up arrow
      cssClass = 'trend-up';
    } else if (trend < 0) {
      icon = '↓'; // Down arrow
      cssClass = 'trend-down';
    } else {
      icon = '→'; // Right arrow for neutral
      cssClass = 'trend-neutral';
    }
    return `<span class="ranking-trend ${cssClass}">${icon}</span>`;
  }
  
  // Helper function to update ranking elements
  function updateRankingElement(elementId, rankingKey, fallbackValue) {
    const element = document.getElementById(elementId);
    if (element) {
      let rankValue = fallbackValue;
      
      // Get the real ranking if available
      if (place.rankings && place.rankings[rankingKey] !== undefined) {
        rankValue = place.rankings[rankingKey];
      }
      
      const rankText = `#${rankValue}`;
      element.innerHTML = rankText + getTrendHTML(trends[rankingKey]);
    }
  }
  
  // Update all ranking elements
  updateRankingElement('speed-rank', 'wifi', '1');
  updateRankingElement('vibe-rank', 'vibe', '2');
  updateRankingElement('parking-rank', 'parking', '3');
  
  // Only update noise if it exists
  const noiseRankElement = document.getElementById('noise-rank');
  if (noiseRankElement) {
    updateRankingElement('noise-rank', 'noise', '2');
  }
}

// Update the overall score display
function updateOverallScore(place) {
  const overallScoreContainer = document.getElementById('overall-score-container');
  if (!overallScoreContainer) {
    return;
  }
  
  // Get or calculate overall score
  let overallScore = place.overallScore;
  
  if (overallScore === undefined && place.metrics) {
    // Calculate average from all metrics
    const scores = Object.values(place.metrics).map(metric => 
      typeof metric === 'object' ? metric.score : metric
    );
    
    if (scores.length > 0) {
      const sum = scores.reduce((total, score) => total + score, 0);
      overallScore = parseFloat((sum / scores.length).toFixed(1));
    }
  }
  
  // Default to 4.0 if we still don't have a score
  if (overallScore === undefined) {
    overallScore = 4.0;
  }
  
  // Update the display
  const scoreElement = overallScoreContainer.querySelector('.overall-score');
  if (scoreElement) {
    scoreElement.innerHTML = `${overallScore}<span class="score-unit">/5</span>`;
  } else {
    // Create the score element if it doesn't exist
    overallScoreContainer.innerHTML = `
      <h4 class="sub-section-title">Overall Workspace Score:</h4>
      <div class="overall-score">${overallScore}<span class="score-unit">/5</span></div>
      `;
  }
}

// Generate the heatmap
function generateHeatmap(placeId, metric = 'speed') {
  // Find the place
  const place = findPlaceById(placeId);
  if (!place) {
    console.error('Place not found for heatmap:', placeId);
    return;
  }
  
  // Make sure we have heatmap data
  if (!place.heatmapData) {
    place.heatmapData = createSampleHeatmapData();
  }
  
  // Get DOM elements
  const heatmapGrid = document.getElementById('heatmap-grid');
  const xAxisLabels = document.getElementById('x-axis-labels');
  
  if (!heatmapGrid || !xAxisLabels) {
    console.error('Heatmap containers not found');
    return;
  }
  
  // Make sure the containers are visible
  const heatmapContainer = document.querySelector('.heatmap-container');
  if (heatmapContainer) {
    heatmapContainer.style.visibility = 'visible';
    heatmapContainer.style.display = 'flex';
  }
  
  // Clear containers
  heatmapGrid.innerHTML = '';
  xAxisLabels.innerHTML = '';
  
  // Time slots for x-axis (columns)
  const timeSlots = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
  
  // Days for y-axis (rows)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Generate x-axis labels
  timeSlots.forEach(time => {
    const timeLabel = document.createElement('div');
    timeLabel.className = 'x-label';
    
    const labelText = document.createElement('div');
    labelText.className = 'x-label-text';
    labelText.textContent = time;
    
    timeLabel.appendChild(labelText);
    xAxisLabels.appendChild(timeLabel);
  });
  
  // Generate heatmap cells
  days.forEach(day => {
    // Create row container with day label
    const row = document.createElement('div');
    row.className = 'heatmap-row';
    
    const dayLabel = document.createElement('div');
    dayLabel.className = 'day-label';
    dayLabel.textContent = day.substring(0, 3); // Mon, Tue, etc.
    row.appendChild(dayLabel);
    
    // Create container for cells
    const dayCells = document.createElement('div');
    dayCells.className = 'day-cells';
    
    // Add cells for each time slot
    timeSlots.forEach((time, index) => {
      const cell = document.createElement('div');
      cell.className = 'time-cell ' + (index % 3 === 0 ? 'hour-mark' : '');
      
      // Get data value based on selected metric
      let value, colorClass, tooltipLabel;
      
      if (metric === 'speed' && place.heatmapData.speed && place.heatmapData.speed[day]) {
        value = place.heatmapData.speed[day][time] || 0;
        colorClass = getSpeedClass(value);
        tooltipLabel = `${value} Mbps`;
      } else if (metric === 'vibe' && place.heatmapData.vibe && place.heatmapData.vibe[day]) {
        value = place.heatmapData.vibe[day][time] || 0;
        colorClass = getVibeClass(value);
        tooltipLabel = `Rating: ${value.toFixed(1)}/5`;
      } else if (metric === 'parking' && place.heatmapData.parking && place.heatmapData.parking[day]) {
        value = place.heatmapData.parking[day][time] || 0;
        colorClass = getParkingClass(value);
        tooltipLabel = `Availability: ${value.toFixed(1)}/5`;
      } else if (metric === 'noise' && place.heatmapData.noise && place.heatmapData.noise[day]) {
        value = place.heatmapData.noise[day][time] || 0;
        colorClass = getNoiseClass(value);
        tooltipLabel = `Quietness: ${value.toFixed(1)}/5`;
      } else {
        colorClass = 'no-data-cell';
        tooltipLabel = 'No data available';
      }
      
      cell.classList.add(colorClass);
      
      // Add tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = `
        <div class="tooltip-title">${day}, ${time}</div>
        <div class="tooltip-stat">${tooltipLabel}</div>
      `;
      
      cell.appendChild(tooltip);
      dayCells.appendChild(cell);
    });
    
    row.appendChild(dayCells);
    heatmapGrid.appendChild(row);
  });
  
  // Update the metric title and description
  updateMetricDescription(metric);
  
  // Show the appropriate legend
  updateLegend(metric);
  
  // Update stats display
  updateStats(place, metric);
}

// Update the metric description based on the selected metric
function updateMetricDescription(metric) {
  const titleElement = document.getElementById('metric-title');
  const descElement = document.getElementById('metric-description');
  
  if (!titleElement || !descElement) {
    return;
  }
  
  if (metric === 'speed') {
    titleElement.textContent = 'Wi-Fi Speed Heatmap';
    descElement.textContent = 'Median Mbps by day and time';
  } else if (metric === 'vibe') {
    titleElement.textContent = 'Vibe Rating Heatmap';
    descElement.textContent = 'Average vibe rating by day and time';
  } else if (metric === 'parking') {
    titleElement.textContent = 'Parking Availability Heatmap';
    descElement.textContent = 'Average parking rating by day and time';
  } else if (metric === 'noise') {
    titleElement.textContent = 'Noise Level Heatmap';
    descElement.textContent = 'Average noise rating by day and time (higher is quieter)';
  }
}

// Update the legend based on the selected metric
function updateLegend(metric) {
  // Get legend elements
  const speedLegend = document.getElementById('speed-legend');
  const vibeLegend = document.getElementById('vibe-legend');
  const parkingLegend = document.getElementById('parking-legend');
  const noiseLegend = document.getElementById('noise-legend');
  const legendTitle = document.getElementById('legend-title');
  
  if (!speedLegend || !vibeLegend || !parkingLegend || !legendTitle) {
    return;
  }
  
  // Hide all legends
  speedLegend.classList.add('hidden');
  vibeLegend.classList.add('hidden');
  parkingLegend.classList.add('hidden');
  if (noiseLegend) noiseLegend.classList.add('hidden');
  
  // Show the selected legend
  if (metric === 'speed') {
    speedLegend.classList.remove('hidden');
    legendTitle.textContent = 'Speed legend (Mbps):';
  } else if (metric === 'vibe') {
    vibeLegend.classList.remove('hidden');
    legendTitle.textContent = 'Vibe legend (Rating):';
  } else if (metric === 'parking') {
    parkingLegend.classList.remove('hidden');
    legendTitle.textContent = 'Parking legend (Availability):';
  } else if (metric === 'noise' && noiseLegend) {
    noiseLegend.classList.remove('hidden');
    legendTitle.textContent = 'Noise legend (Quietness):';
  }
}

// Update stats display based on selected metric
function updateStats(place, metric) {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) {
    return;
  }
  
  // Clear container
  statsContainer.innerHTML = '';
  
  // Create stats based on metric
  if (metric === 'speed') {
    // Get or generate values
    const avgDownload = getMetricValue(place, 'internet.details.avgDownload', 'internetData.avgDownload', 40);
    const avgUpload = getMetricValue(place, 'internet.details.avgUpload', 'internetData.avgUpload', avgDownload / 2);
    const avgPing = getMetricValue(place, 'internet.details.avgPing', 'internetData.avgPing', 20);
    
    // Create stats cards
    statsContainer.innerHTML = `
      <div class="stat-card speed-stat">
        <div class="stat-value">${avgDownload} <span class="stat-unit">Mbps</span></div>
        <div class="stat-label">Avg. Download</div>
      </div>
      <div class="stat-card speed-stat">
        <div class="stat-value">${avgUpload} <span class="stat-unit">Mbps</span></div>
        <div class="stat-label">Avg. Upload</div>
      </div>
      <div class="stat-card speed-stat">
        <div class="stat-value">${avgPing} <span class="stat-unit">ms</span></div>
        <div class="stat-label">Avg. Ping</div>
      </div>
    `;
  } else if (metric === 'vibe') {
    // Get or generate values
    const atmosphere = getMetricValue(place, 'vibe.details.atmosphere', 'vibeData.atmosphere', 4.2);
    const busyness = getMetricValue(place, 'vibe.details.crowdedness', 'vibeData.busyness', 3.8);
    const music = getMetricValue(place, 'vibe.details.music', 'vibeData.music', 4.0);
    
    statsContainer.innerHTML = `
      <div class="stat-card vibe-stat">
        <div class="stat-value">${atmosphere.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Atmosphere</div>
      </div>
      <div class="stat-card vibe-stat">
        <div class="stat-value">${busyness.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Busyness</div>
      </div>
      <div class="stat-card vibe-stat">
        <div class="stat-value">${music.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Music</div>
      </div>
    `;
  } else if (metric === 'parking') {
    // Get or generate values
    const availability = getMetricValue(place, 'parking.details.availability', 'parkingData.availability', 3.5);
    const proximity = getMetricValue(place, 'parking.details.proximity', 'parkingData.proximity', 3.8);
    const cost = getMetricValue(place, 'parking.details.cost', 'parkingData.cost', 3.2);
    
    statsContainer.innerHTML = `
      <div class="stat-card parking-stat">
        <div class="stat-value">${availability.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Availability</div>
      </div>
      <div class="stat-card parking-stat">
        <div class="stat-value">${proximity.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Proximity</div>
      </div>
      <div class="stat-card parking-stat">
        <div class="stat-value">${cost.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Cost</div>
      </div>
    `;
  } else if (metric === 'noise') {
    // Get or generate values
    const morning = getMetricValue(place, 'vibe.details.noiseLevel', 'noiseData.morning', 3.8);
    const afternoon = getMetricValue(place, 'vibe.details.noiseLevel', 'noiseData.afternoon', 3.2);
    const evening = getMetricValue(place, 'vibe.details.noiseLevel', 'noiseData.evening', 3.5);
    
    statsContainer.innerHTML = `
      <div class="stat-card noise-stat">
        <div class="stat-value">${morning.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Morning Quietness</div>
      </div>
      <div class="stat-card noise-stat">
        <div class="stat-value">${afternoon.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Afternoon Quietness</div>
      </div>
      <div class="stat-card noise-stat">
        <div class="stat-value">${evening.toFixed(1)} <span class="stat-unit">/5</span></div>
        <div class="stat-label">Evening Quietness</div>
      </div>
    `;
  }
}

// Helper function to get a nested value from an object
function getMetricValue(place, mainPath, backupPath, defaultValue) {
  // Try the main path first
  if (place.metrics) {
    const parts = mainPath.split('.');
    let value = place.metrics;
    
    for (const part of parts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value !== undefined) {
      return value;
    }
  }
  
  // Try the backup path
  if (backupPath) {
    const parts = backupPath.split('.');
    let value = place;
    
    for (const part of parts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (value !== undefined) {
      return value;
    }
  }
  
  // Return default if no match found
  return defaultValue;
}

// Helper function to get CSS class for speed value
function getSpeedClass(speed) {
  if (speed >= 60) return 'speed-color-6';
  if (speed >= 40) return 'speed-color-5';
  if (speed >= 30) return 'speed-color-4';
  if (speed >= 20) return 'speed-color-3';
  if (speed >= 10) return 'speed-color-2';
  return 'speed-color-1';
}

// Helper function to get CSS class for vibe value
function getVibeClass(vibe) {
  if (vibe >= 4.5) return 'vibe-color-6';
  if (vibe >= 4.0) return 'vibe-color-5';
  if (vibe >= 3.5) return 'vibe-color-4';
  if (vibe >= 3.0) return 'vibe-color-3';
  if (vibe >= 2.5) return 'vibe-color-2';
  return 'vibe-color-1';
}

// Helper function to get CSS class for parking value
function getParkingClass(parking) {
  if (parking >= 4.5) return 'parking-color-6';
  if (parking >= 4.0) return 'parking-color-5';
  if (parking >= 3.5) return 'parking-color-4';
  if (parking >= 3.0) return 'parking-color-3';
  if (parking >= 2.5) return 'parking-color-2';
  return 'parking-color-1';
}

// Helper function to get CSS class for noise value (higher value = quieter)
function getNoiseClass(noise) {
  if (noise >= 4.5) return 'noise-color-6';
  if (noise >= 4.0) return 'noise-color-5';
  if (noise >= 3.5) return 'noise-color-4';
  if (noise >= 3.0) return 'noise-color-3';
  if (noise >= 2.5) return 'noise-color-2';
  return 'noise-color-1';
}

// Tribe-specific talking points data
const tribesTalkingPoints = {
  "Code Conjurer": {
    dos: [
      "Ask about their latest coding project",
      "Discuss programming languages and frameworks",
      "Share tech resources and tools",
      "Respect their focus time when they're in the zone"
    ],
    donts: [
      "Interrupt them during debugging sessions",
      "Ask them to fix your computer issues for free",
      "Make loud calls near their workspace",
      "Dismiss technical discussions as 'too nerdy'"
    ]
  },
  "Pixel Wizard": {
    dos: [
      "Compliment their design work",
      "Ask about their creative process",
      "Discuss design trends and tools",
      "Appreciate the aesthetics of the space"
    ],
    donts: [
      "Ask for free design work",
      "Criticize their color choices",
      "Interrupt them during focused design sessions",
      "Assume all designers use the same tools"
    ]
  },
  "Word Weaver": {
    dos: [
      "Discuss interesting books or articles",
      "Ask about their writing projects",
      "Share quiet spots for focused writing",
      "Respect their need for creative silence"
    ],
    donts: [
      "Interrupt their writing flow",
      "Make loud phone calls nearby",
      "Ask them to edit your work for free",
      "Dismiss writing as an 'easy' profession"
    ]
  },
  "Buzz Beast": {
    dos: [
      "Ask about marketing trends",
      "Discuss social media strategies",
      "Share interesting campaigns",
      "Network and exchange business cards"
    ],
    donts: [
      "Pitch your business ideas without context",
      "Expect free marketing advice",
      "Interrupt their client calls",
      "Dismiss the value of marketing work"
    ]
  },
  "Web Wizard": {
    dos: [
      "Discuss web development trends",
      "Ask about their favorite frameworks",
      "Share useful web tools and resources",
      "Respect their debugging sessions"
    ],
    donts: [
      "Ask them to build you a website for free",
      "Interrupt them during focused coding",
      "Make assumptions about their technical skills",
      "Dismiss web development as 'just making websites'"
    ]
  },
  "Story Spinner": {
    dos: [
      "Ask about their storytelling projects",
      "Discuss narrative techniques",
      "Share interesting stories or content",
      "Respect their creative process"
    ],
    donts: [
      "Interrupt them during creative sessions",
      "Ask for free content creation",
      "Make loud calls during their focus time",
      "Dismiss content creation as 'not real work'"
    ]
  },
  "Digital Nomad": {
    dos: [
      "Ask about their travel experiences",
      "Share remote work tips",
      "Discuss productivity tools",
      "Respect their workspace boundaries"
    ],
    donts: [
      "Make assumptions about their work habits",
      "Interrupt their focused work sessions",
      "Ask intrusive questions about their income",
      "Dismiss remote work as 'not a real job'"
    ]
  }
};

// Populate talking points with dos and don'ts
function populateTalkingPoints(points, dominantTribe) {
  console.log("Populating talking points for tribe:", dominantTribe);
  
  // First ensure the talking points structure exists
  if (typeof window.ensureTalkingPointsStructure === 'function') {
    window.ensureTalkingPointsStructure();
  }
  
  // Get the tribe name and update the title
  const tribeName = dominantTribe || 'Digital Nomad';
  const titleElement = document.getElementById('talking-points-title');
  if (titleElement) {
    titleElement.textContent = `Talking Points with ${tribeName}s`;
  }
  
  // Get tribe-specific talking points or use defaults
  const talkingPoints = tribesTalkingPoints[tribeName] || tribesTalkingPoints['Digital Nomad'];
  
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
}

// Populate comments section
function populateComments(comments) {
  const commentsContainer = document.getElementById('comments-container');
  if (!commentsContainer) {
    return;
  }
  
  commentsContainer.innerHTML = '';
  
  if (!Array.isArray(comments) || comments.length === 0) {
    commentsContainer.innerHTML = '<div class="text-gray-500 text-sm text-center">No comments available</div>';
    return;
  }
  
  // Add more mock data if there are fewer than 5 comments
  if (comments.length < 5) {
    const additionalComments = [
      { 
        user: "MikeT", 
        text: "The Wi-Fi speed is inconsistent during peak hours. Had to use my mobile hotspot twice.", 
        sentiment: "negative", 
        tribe: "Code Conjurer",
        rating: 2.5,
        date: "2024-09-15"
      },
      { 
        user: "AlexW", 
        text: "Perfect spot for a coding session. The baristas understand when you need to focus and don't disturb you.", 
        sentiment: "positive", 
        tribe: "Code Conjurer",
        rating: 4.9,
        date: "2024-09-18"
      },
      { 
        user: "SamanthaR", 
        text: "It's okay. The coffee is good but it gets too crowded in the afternoons.", 
        sentiment: "neutral", 
        tribe: "Word Weaver",
        rating: 3.2,
        date: "2024-09-20"
      },
      { 
        user: "JamesK", 
        text: "Too noisy for serious work. The music is way too loud and the tables are too close together.", 
        sentiment: "negative", 
        tribe: "Data Alchemist",
        rating: 1.8,
        date: "2024-09-14"
      },
      { 
        user: "EmilyP", 
        text: "Great atmosphere for creative work. The lighting is perfect and the staff is friendly.", 
        sentiment: "positive", 
        tribe: "Pixel Pixie",
        rating: 4.7,
        date: "2024-09-22"
      },
      { 
        user: "DavidM", 
        text: "The parking situation is a bit challenging, but once inside, it's a decent place to work.", 
        sentiment: "neutral", 
        tribe: "Code Conjurer",
        rating: 3.5,
        date: "2024-09-19"
      }
    ];
    
    // Add additional comments to the existing ones
    comments = [...comments, ...additionalComments];
  }
  
  // Sort comments by date (newest first)
  comments.sort((a, b) => {
    const dateA = new Date(a.date || a.timestamp || '2024-01-01');
    const dateB = new Date(b.date || b.timestamp || '2024-01-01');
    return dateB - dateA;
  });
  
  // Process each comment
  comments.forEach(comment => {
    // Determine sentiment from comment data or rating
    let sentiment = comment.sentiment;
    if (!sentiment && comment.rating) {
      if (comment.rating >= 4) sentiment = 'positive';
      else if (comment.rating <= 2.5) sentiment = 'negative';
      else sentiment = 'neutral';
    } else if (!sentiment) {
      sentiment = 'neutral';
    }
    
    // Create comment element
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
    
    // Build comment HTML
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

// Update location details if they exist
function updateLocationDetails(place) {
  // Internet limit
  const internetRow = document.getElementById('location-internet-row');
  const internetText = document.getElementById('location-internet-text');
  if (internetRow && internetText) {
    // Determine internet limit status
    let internetStatus = 'unknown';
    let internetStatusText = 'Internet: Unknown';
    
    if (place.internetLimit !== undefined) {
      if (place.internetLimit) {
        internetStatus = 'limited';
        internetStatusText = 'Internet: Limited';
      } else {
        internetStatus = 'unlimited';
        internetStatusText = 'Internet: Unlimited';
      }
    } else if (place.internet && place.internet.limit !== undefined) {
      if (place.internet.limit) {
        internetStatus = 'limited';
        internetStatusText = 'Internet: Limited';
      } else {
        internetStatus = 'unlimited';
        internetStatusText = 'Internet: Unlimited';
      }
    }
    
    internetText.className = `location-internet-text ${internetStatus}`;
    internetText.textContent = internetStatusText;
  }
  
  // Spending range
  const spendRow = document.getElementById('location-spend-row');
  const spendText = document.getElementById('location-spend-text');
  if (spendRow && spendText) {
    // Get spending data
    let spendRange = 'Average Spend: Unknown';
    if (place.spendRange) {
      spendRange = `Average Spend: ${place.spendRange}`;
    } else if (place.pricing && place.pricing.range) {
      spendRange = `Average Spend: ${place.pricing.range}`;
    } else if (place.price) {
      // Use a generic range based on price rating
      const priceValue = typeof place.price === 'object' ? place.price.score : place.price;
      if (priceValue <= 2) {
        spendRange = 'Average Spend: R25 - R50';
      } else if (priceValue <= 3.5) {
        spendRange = 'Average Spend: R45 - R75';
      } else {
        spendRange = 'Average Spend: R65+';
      }
    }
    
    spendText.textContent = spendRange;
  }
  
  // Handicapped access
  const handicappedRow = document.getElementById('location-handicapped-row');
  const handicappedText = document.getElementById('location-handicapped-text');
  if (handicappedRow && handicappedText) {
    // Determine handicapped access status
    let accessStatus = 'unknown';
    let accessText = 'Handicapped Access: Unknown';
    
    if (place.handicappedAccess !== undefined) {
      if (place.handicappedAccess) {
        accessStatus = 'accessible';
        accessText = 'Handicapped Access: Yes';
      } else {
        accessStatus = 'not-accessible';
        accessText = 'Handicapped Access: No';
      }
    } else if (place.accessibility && place.accessibility.handicapped !== undefined) {
      if (place.accessibility.handicapped) {
        accessStatus = 'accessible';
        accessText = 'Handicapped Access: Yes';
      } else {
        accessStatus = 'not-accessible';
        accessText = 'Handicapped Access: No';
      }
    }
    
    handicappedText.className = `location-handicapped-text ${accessStatus}`;
    handicappedText.textContent = accessText;
  }
}

// Generate radar chart using Chart.js
function generateRadarChart() {
  if (!window.Chart) {
    // Load Chart.js if it's not already loaded
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
    script.onload = function() {
      createRadarChart();
    };
    document.head.appendChild(script);
  } else {
    createRadarChart();
  }
}

// Reset radar chart container
function resetRadarChart() {
  const radarChartContainer = document.getElementById('radar-chart-container');
  if (radarChartContainer) {
    // Remove the generated flag so it will regenerate with new data
    radarChartContainer.removeAttribute('data-generated');
    radarChartContainer.classList.add('collapsed');
    
    // Update toggle button icon
    const toggleButton = document.getElementById('radar-toggle-button');
    if (toggleButton) {
      const icon = toggleButton.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-chevron-down';
      }
    }
  }
}

// Create the radar chart with Chart.js
function createRadarChart() {
  const container = document.getElementById('radar-chart-container');
  if (!container) return;
  
  // Clear any existing content
  container.innerHTML = '';
  
  // Create canvas for the chart
  const canvas = document.createElement('canvas');
  canvas.id = 'radar-chart';
  canvas.height = 300;
  container.appendChild(canvas);
  
  // Get current place data
  const place = findPlaceById(currentPlaceId);
  if (!place) {
    console.error('Place not found for radar chart:', currentPlaceId);
    return;
  }
  
  // Extract metrics for radar chart
  let metrics = {};
  if (place.metrics) {
    Object.entries(place.metrics).forEach(([key, value]) => {
      metrics[key.charAt(0).toUpperCase() + key.slice(1)] = 
        typeof value === 'object' ? value.score : value;
    });
  } else {
    // Default metrics if none available
    metrics = {
      'Wi-Fi': 4.8,
      'Vibe': 4.5,
      'Coffee': 4.7,
      'Power': 4.2,
      'Noise': 3.9,
      'Parking': 3.6,
      'Price': 3.8
    };
  }
  
  // Create the chart
  new Chart(canvas, {
    type: 'radar',
    data: {
      labels: Object.keys(metrics),
      datasets: [{
        label: 'Workspace Rating',
        data: Object.values(metrics),
        backgroundColor: 'rgba(74, 44, 42, 0.5)', // Coffee Brown with transparency
        borderColor: 'rgba(74, 44, 42, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
  
  // Add explanation
  const explanation = document.createElement('div');
  explanation.className = 'radar-explanation';
  explanation.innerHTML = `
    <p>This radar chart shows the workspace rating across key metrics, each scored on a scale of 0-5.</p>
    <ul class="weight-list">
      <li><strong>Wi-Fi:</strong> Speed and reliability</li>
      <li><strong>Vibe:</strong> Atmosphere and ambiance</li>
      <li><strong>Coffee:</strong> Quality of coffee and beverages</li>
      <li><strong>Power:</strong> Availability of outlets</li>
      <li><strong>Noise:</strong> Noise level (higher is quieter)</li>
      <li><strong>Parking:</strong> Ease of parking</li>
      <li><strong>Price:</strong> Value for money</li>
    </ul>
  `;
  
  container.appendChild(explanation);
}

// Show the overlay
function showOverlay() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    
    // Dispatch a custom event that other scripts can listen for
    document.dispatchEvent(new Event('showOverlay'));
  }
}

// Helper Functions for Data Conversion and Generation

// Convert a spot from place-card format to workspace format
function convertSpotFormat(spot) {
  if (!spot) return null;
  
  // Default coordinate values if not provided
  const coordinateValues = {
    1: { lat: -34.079835, lng: 18.821111 }, // Bootlegger
    2: { lat: -34.076241, lng: 18.849648 }, // Blue Crane
    3: { lat: -34.080505, lng: 18.805760 }  // Truth Coffee
  };
  
  // Get coordinates based on ID or use defaults
  const coordinates = spot.coordinates || coordinateValues[spot.id] || { 
    lat: -34.075, 
    lng: 18.845 
  };
  
  // Create metrics object
  const metrics = {
    wifi: { 
      score: getValueOrDefault(spot, 'ratings.speed', 4.0),
      details: {
        avgDownload: getValueOrDefault(spot, 'ratings.speed', 4.0) * 10,
        avgUpload: getValueOrDefault(spot, 'ratings.speed', 4.0) * 5,
        avgPing: 20,
        stability: getValueOrDefault(spot, 'ratings.stability', 4.0),
        coverage: getValueOrDefault(spot, 'ratings.coverage', 4.0)
      }
    },
    vibe: {
      score: getValueOrDefault(spot, 'ratings.vibe', 4.0),
      details: {
        noiseLevel: getValueOrDefault(spot, 'ratings.noise', 3.0),
        atmosphere: getValueOrDefault(spot, 'ratings.atmosphere', 4.0),
        crowdedness: 3.5,
        music: 4.0
      }
    },
    coffee: {
      score: getValueOrDefault(spot, 'ratings.coffee', 4.5)
    },
    power: {
      score: getValueOrDefault(spot, 'ratings.power', 4.0),
      details: {
        outlets: getValueOrDefault(spot, 'ratings.outlets', 4.0),
        accessibility: getValueOrDefault(spot, 'ratings.accessibility', 4.0),
        placement: 4.0
      }
    },
    parking: {
      score: getValueOrDefault(spot, 'ratings.parking', 3.5)
    },
    price: {
      score: getValueOrDefault(spot, 'ratings.price', 3.5)
    },
    noise: {
      score: getValueOrDefault(spot, 'ratings.noise', 3.5)
    }
  };
  
  // Calculate overall score (average of all metric scores)
  const overallScore = calculateOverallScore(metrics);
  
  // Convert tribes format
  const tribes = Array.isArray(spot.tribes) ? 
    spot.tribes.map(tribe => 
      tribe === "Code Conjurers" ? "Code Conjurer" : 
      tribe === "Pixel Pixies" ? "Pixel Wizard" : 
      tribe === "Word Weavers" ? "Word Weaver" : 
      tribe === "Buzz Beasts" ? "Buzz Beast" : 
      tribe === "Web Wizards" ? "Web Wizard" : 
      tribe === "Story Spinners" ? "Story Spinner" : tribe
    ) : 
    ["Digital Nomad"];
  
  // Convert comments to reviews format
  const reviews = Array.isArray(spot.comments) ? 
    spot.comments.map(comment => ({
      user: comment.user || "Anonymous",
      tribe: comment.tribe || "Digital Nomad",
      text: comment.text || "",
      sentiment: comment.sentiment || (comment.rating >= 4 ? "positive" : comment.rating <= 2 ? "negative" : "neutral"),
      metrics: {
        vibe: comment.rating || 4,
        noise: 3,
        power: 4,
        coffee: 4,
        staff: 4,
        parking: 3,
        price: 3
      },
      timestamp: comment.date || new Date().toISOString().slice(0, 10)
    })) : 
    [];
  
  // Format hours string
  let hoursString = "Mon-Fri: 7:00am - 6:00pm, Sat-Sun: 8:00am - 3:00pm";
  if (spot.hours) {
    const openTime = spot.hours.open || "07:00";
    const closeTime = spot.hours.close || "18:00";
    
    // Format times for display
    const openHour = parseInt(openTime.split(':')[0]);
    const openMin = openTime.split(':')[1] || "00";
    const closeHour = parseInt(closeTime.split(':')[0]);
    const closeMin = closeTime.split(':')[1] || "00";
    
    const formattedOpen = `${openHour > 12 ? openHour - 12 : openHour}:${openMin}${openHour >= 12 ? 'pm' : 'am'}`;
    const formattedClose = `${closeHour > 12 ? closeHour - 12 : closeHour}:${closeMin}${closeHour >= 12 ? 'pm' : 'am'}`;
    
    hoursString = `Mon-Fri: ${formattedOpen} - ${formattedClose}, Sat-Sun: 8:00am - 3:00pm`;
  }
  
  // Rankings
  const rankings = {
    wifi: spot.speedRank || 1,
    vibe: spot.vibeRank || 2,
    parking: spot.parkingRank || 3,
    noise: spot.noiseRank || 2
  };
  
  // Create heatmap data if needed
  const heatmapData = spot.heatmapData || createSampleHeatmapData();
  
  // Convert to workspace format
  return {
    id: spot.id,
    name: spot.name || "Unknown Coffee Shop",
    address: spot.address || "Somerset West, South Africa",
    coordinates: coordinates,
    googleRating: spot.googleRating || 4.5,
    googleReviews: spot.googleReviews || 200,
    hours: hoursString,
    phone: spot.phone || "+27 21 000 0000",
    website: spot.website || "https://example.com",
    metrics: metrics,
    overallScore: overallScore,
    popularWithTribes: tribes,
    tribes: tribes,
    dominantTribe: tribes[0],
    rankings: rankings,
    reviews: reviews,
    comments: reviews,
    heatmapData: heatmapData
  };
}

// Helper function to get a value from a nested object with a default
function getValueOrDefault(obj, path, defaultValue) {
  const parts = path.split('.');
  let value = obj;
  
  for (const part of parts) {
    if (value && value[part] !== undefined) {
      value = value[part];
    } else {
      return defaultValue;
    }
  }
  
  return value !== undefined ? value : defaultValue;
}

// Calculate overall score from metrics
function calculateOverallScore(metrics) {
  let total = 0;
  let count = 0;
  
  Object.values(metrics).forEach(metric => {
    const score = typeof metric === 'object' ? metric.score : metric;
    if (score !== undefined) {
      total += score;
      count++;
    }
  });
  
  return count > 0 ? parseFloat((total / count).toFixed(1)) : 4.0;
}

// Convert all placeCardSpotsData to workspaceData format
function convertPlaceCardData() {
  if (!window.placeCardSpotsData || !Array.isArray(window.placeCardSpotsData)) {
    return [];
  }
  
  return window.placeCardSpotsData.map(spot => convertSpotFormat(spot));
}

// Create sample workspace data if none exists
function createSampleWorkspaceData() {
  return [
    {
      id: 1,
      name: "Bootlegger Coffee Company",
      address: "12 Bright Street, Somerset West, Cape Town",
      coordinates: { lat: -34.079835, lng: 18.821111 },
      googleRating: 4.7,
      googleReviews: 356,
      hours: "Mon-Fri: 7:00am - 6:00pm, Sat-Sun: 8:00am - 3:00pm",
      phone: "+27 21 851 5555",
      website: "https://bootlegger.co.za",
      metrics: {
        wifi: { 
          score: 4.8,
          details: {
            avgDownload: 45,
            avgUpload: 22,
            avgPing: 18,
            stability: 4.5,
            coverage: 4.6
          }
        },
        vibe: {
          score: 4.5,
          details: {
            noiseLevel: 3.9,
            atmosphere: 4.6,
            crowdedness: 3.8,
            music: 4.2
          }
        },
        coffee: {
          score: 4.7
        },
        power: {
          score: 4.2,
          details: {
            outlets: 4.3,
            accessibility: 4.0,
            placement: 4.1
          }
        },
        parking: {
          score: 3.6
        },
        price: {
          score: 3.8
        },
        noise: {
          score: 3.9
        }
      },
      overallScore: 4.2,
      popularWithTribes: ["Code Conjurer", "Pixel Wizard", "Word Weaver"],
      tribes: ["Code Conjurer", "Pixel Wizard", "Word Weaver"],
      dominantTribe: "Code Conjurer",
      rankings: {
        wifi: 1,
        vibe: 2,
        parking: 3,
        noise: 2
      },
      reviews: [
        {
          user: "JakeD",
          tribe: "Code Conjurer",
          text: "Great Wi-Fi speeds and plenty of outlets. Perfect for coding sessions!",
          sentiment: "positive",
          metrics: {
            vibe: 4.5,
            noise: 4.0,
            power: 4.5,
            coffee: 4.8,
            wifi: 4.9
          },
          timestamp: "2024-09-12"
        },
        {
          user: "LisaM",
          tribe: "Pixel Wizard",
          text: "The lighting is perfect for design work, and the coffee is amazing.",
          sentiment: "positive",
          metrics: {
            vibe: 4.7,
            noise: 3.5,
            power: 4.0,
            coffee: 4.9,
            wifi: 4.6
          },
          timestamp: "2024-09-05"
        },
        {
          user: "MikeT",
          tribe: "Word Weaver",
          text: "Gets a bit noisy during lunch time, but mornings are perfect for writing.",
          sentiment: "neutral",
          metrics: {
            vibe: 3.8,
            noise: 2.5,
            power: 4.2,
            coffee: 4.5,
            wifi: 4.7
          },
          timestamp: "2024-08-28"
        }
      ],
      heatmapData: createSampleHeatmapData()
    },
    {
      id: 2,
      name: "Blue Crane Coffee",
      address: "25 Main Road, Somerset West",
      coordinates: { lat: -34.076241, lng: 18.849648 },
      googleRating: 4.4,
      googleReviews: 210,
      hours: "Mon-Fri: 7:30am - 5:30pm, Sat-Sun: 8:30am - 2:30pm",
      phone: "+27 21 852 6666",
      website: "https://bluecrane.co.za",
      metrics: {
        wifi: { 
          score: 4.2,
          details: {
            avgDownload: 35,
            avgUpload: 18,
            avgPing: 22,
            stability: 4.0,
            coverage: 4.1
          }
        },
        vibe: {
          score: 4.6,
          details: {
            noiseLevel: 4.2,
            atmosphere: 4.7,
            crowdedness: 4.4,
            music: 4.5
          }
        },
        coffee: {
          score: 4.5
        },
        power: {
          score: 3.8,
          details: {
            outlets: 3.5,
            accessibility: 3.9,
            placement: 4.0
          }
        },
        parking: {
          score: 4.1
        },
        price: {
          score: 3.5
        },
        noise: {
          score: 4.2
        }
      },
      overallScore: 4.1,
      popularWithTribes: ["Word Weaver", "Pixel Wizard", "Story Spinner"],
      tribes: ["Word Weaver", "Pixel Wizard", "Story Spinner"],
      dominantTribe: "Word Weaver",
      rankings: {
        wifi: 3,
        vibe: 1,
        parking: 2,
        noise: 1
      },
      reviews: [
        {
          user: "SarahJ",
          tribe: "Word Weaver",
          text: "Such a peaceful environment. The quiet corners are perfect for writing.",
          sentiment: "positive",
          metrics: {
            vibe: 4.8,
            noise: 4.7,
            power: 3.5,
            coffee: 4.6,
            wifi: 4.0
          },
          timestamp: "2024-09-10"
        },
        {
          user: "AlexK",
          tribe: "Pixel Wizard",
          text: "Great atmosphere but the Wi-Fi can be slow during busy hours.",
          sentiment: "neutral",
          metrics: {
            vibe: 4.5,
            noise: 4.3,
            power: 3.7,
            coffee: 4.4,
            wifi: 3.8
          },
          timestamp: "2024-09-01"
        }
      ],
      heatmapData: createSampleHeatmapData()
    },
    {
      id: 3,
      name: "Truth Coffee Roasting",
      address: "36 Buitenkant Street, Cape Town",
      coordinates: { lat: -34.080505, lng: 18.805760 },
      googleRating: 4.6,
      googleReviews: 410,
      hours: "Mon-Fri: 6:30am - 8:00pm, Sat-Sun: 8:00am - 6:00pm",
      phone: "+27 21 200 0440",
      website: "https://truth.co.za",
      metrics: {
        wifi: { 
          score: 4.5,
          details: {
            avgDownload: 40,
            avgUpload: 20,
            avgPing: 19,
            stability: 4.2,
            coverage: 4.3
          }
        },
        vibe: {
          score: 4.7,
          details: {
            noiseLevel: 3.5,
            atmosphere: 4.9,
            crowdedness: 3.6,
            music: 4.6
          }
        },
        coffee: {
          score: 4.9
        },
        power: {
          score: 4.3,
          details: {
            outlets: 4.4,
            accessibility: 4.2,
            placement: 4.3
          }
        },
        parking: {
          score: 3.2
        },
        price: {
          score: 3.4
        },
        noise: {
          score: 3.5
        }
      },
      overallScore: 4.1,
      popularWithTribes: ["Buzz Beast", "Web Wizard", "Story Spinner"],
      tribes: ["Buzz Beast", "Web Wizard", "Story Spinner"],
      dominantTribe: "Buzz Beast",
      rankings: {
        wifi: 2,
        vibe: 3,
        parking: 5,
        noise: 4
      },
      reviews: [
        {
          user: "EmmaP",
          tribe: "Buzz Beast",
          text: "Amazing steampunk vibe and the coffee is exceptional! Great for client meetings.",
          sentiment: "positive",
          metrics: {
            vibe: 4.9,
            noise: 3.6,
            power: 4.2,
            coffee: 5.0,
            wifi: 4.5
          },
          timestamp: "2024-09-15"
        },
        {
          user: "RyanT",
          tribe: "Web Wizard",
          text: "The Wi-Fi is reliable and the atmosphere is inspiring for coding.",
          sentiment: "positive",
          metrics: {
            vibe: 4.7,
            noise: 3.4,
            power: 4.4,
            coffee: 4.8,
            wifi: 4.6
          },
          timestamp: "2024-09-08"
        },
        {
          user: "NicoleH",
          tribe: "Story Spinner",
          text: "It can get quite busy and noisy, but the coffee makes up for it.",
          sentiment: "neutral",
          metrics: {
            vibe: 4.5,
            noise: 3.0,
            power: 4.3,
            coffee: 4.9,
            wifi: 4.4
          },
          timestamp: "2024-08-25"
        }
      ],
      heatmapData: createSampleHeatmapData()
    }
  ];
}

// Create sample heatmap data
function createSampleHeatmapData() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
  
  // Create empty data structure
  const heatmapData = {
    speed: {},
    vibe: {},
    parking: {},
    noise: {}
  };
  
  // Base patterns for each day (relative busyness factor)
  const dayPatterns = {
    'Monday': 0.9,    // Moderately busy
    'Tuesday': 0.85,  // Less busy than Monday
    'Wednesday': 1.0, // Busiest weekday
    'Thursday': 0.95, // Busy
    'Friday': 0.8,    // Less busy as people finish work
    'Saturday': 0.6,  // Weekend, many casual users
    'Sunday': 0.5     // Quietest day
  };
  
  // Time patterns (busyness by hour - lower means more people, slower wifi)
  const timePatterns = {
    '7am': 1.3,  // Very early, fewer people
    '8am': 1.0,  // Morning rush begins
    '9am': 0.7,  // Very busy morning rush
    '10am': 0.8, // Still busy but easing
    '11am': 0.9, // Pre-lunch lull
    '12pm': 0.6, // Lunch rush, busiest time
    '1pm': 0.7,  // Late lunch crowd
    '2pm': 1.0,  // Post-lunch lull
    '3pm': 0.9,  // Afternoon crowd picking up
    '4pm': 0.8,  // Busy afternoon
    '5pm': 0.7,  // End of workday rush
    '6pm': 0.9   // Evening slowdown
  };
  
  // Generate random data for each day and time slot
  days.forEach(day => {
    heatmapData.speed[day] = {};
    heatmapData.vibe[day] = {};
    heatmapData.parking[day] = {};
    heatmapData.noise[day] = {};
    
    timeSlots.forEach(time => {
      // Calculate factors
      const dayFactor = dayPatterns[day];
      const timeFactor = timePatterns[time];
      const combinedFactor = dayFactor * timeFactor;
      
      // Small random variation
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1
      
      // Speed: Higher factor means faster speed (inverse relationship with busyness)
      const baseSpeed = 40; // Base speed in Mbps
      const speedValue = Math.round(baseSpeed * combinedFactor * randomFactor);
      heatmapData.speed[day][time] = Math.min(Math.max(speedValue, 15), 65);
      
      // Vibe: Complex relationship, busier times can be more energetic but less focused
      const baseVibe = 4.0;
      const vibeFactor = (combinedFactor < 0.7) ? 0.9 : (combinedFactor > 1.2 ? 1.1 : 1.0);
      const vibeValue = baseVibe * vibeFactor * randomFactor;
      heatmapData.vibe[day][time] = parseFloat(Math.min(Math.max(vibeValue, 2.5), 4.8).toFixed(1));
      
      // Parking: Inversely related to busyness - busier times have worse parking
      const baseParking = 3.5;
      const parkingFactor = 1.5 - (combinedFactor * 0.5); // Inverse relationship
      const parkingValue = baseParking * parkingFactor * randomFactor;
      heatmapData.parking[day][time] = parseFloat(Math.min(Math.max(parkingValue, 2.0), 4.5).toFixed(1));
      
      // Noise: Inverse relationship with busyness - busier means noisier (lower score)
      const baseNoise = 3.5;
      const noiseFactor = 1.4 - (combinedFactor * 0.4); // Inverse relationship
      const noiseValue = baseNoise * noiseFactor * randomFactor;
      heatmapData.noise[day][time] = parseFloat(Math.min(Math.max(noiseValue, 2.0), 4.5).toFixed(1));
    });
  });
  
  return heatmapData;
}

/**
 * Main function to open and populate the place card detail view
 * This is the primary entry point from the connector file
 * @param {Object} spot - The prepared spot data object
 */
function openPlaceCardDetail(spot) {
  // Store the current place ID
  currentPlaceId = spot.id;
  
  // Update the detail view title
  const detailTitle = document.getElementById('detail-title');
  if (detailTitle) {
    detailTitle.textContent = spot.name;
  }
  
  // Update basic information
  updateBasicInfo(spot);
  
  // Generate heatmap for the default metric (speed)
  generateHeatmap(spot.id, 'speed');
  
  // Populate talking points
  populateTalkingPoints(spot.id);
  
  // Populate comments section
  populateComments(spot.comments || []);
  
  // Show the overlay
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
  }
}

// Initialize the place card functionality
initializePlaceCard();

// Explicitly expose key functions to the global scope
// For backward compatibility: alias to openSpotDetail
window.openBrewsAndBytesSpotDetail = openSpotDetail;

// Log that functions have been exposed
console.log('Place card functions have been exposed to the global scope');