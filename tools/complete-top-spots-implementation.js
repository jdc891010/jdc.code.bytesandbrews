// Complete the data for other categories
const additionalCategories = ['power', 'coffee', 'parking', 'stability'];
additionalCategories.forEach(category => {
    if (!spotsData[category]) {
        spotsData[category] = [
            {
                id: 100 + Math.floor(Math.random() * 100),
                name: "Example Spot 1",
                address: "123 Example Street, Somerset West",
                metricValue: "Sample Metric Value",
                dominantTribe: "Sample Tribe",
                coordinates: {
                    lat: -34.0465 + (Math.random() * 0.02),
                    lng: 18.8200 + (Math.random() * 0.02)
                },
                metrics: {
                    internet: { score: 4.2, value: "85 Mbps" },
                    video: { score: 4.5, value: "Excellent" },
                    vibe: { score: 4.7, value: "Great" },
                    wifi: { score: 4.3, value: "Strong" },
                    power: { score: 4.8, value: "Abundant" }
                },
                ratings: {
                    vibe: 4.0 + Math.random(),
                    noise: 4.0 + Math.random(),
                    power: 4.0 + Math.random(),
                    video: 4.0 + Math.random(),
                    coffee: 4.0 + Math.random(),
                    price: 4.0 + Math.random(),
                    staff: 4.0 + Math.random(),
                    parking: 4.0 + Math.random()
                }
            },
            {
                id: 100 + Math.floor(Math.random() * 100),
                name: "Example Spot 2",
                address: "456 Example Avenue, Somerset West",
                metricValue: "Sample Metric Value",
                dominantTribe: "Sample Tribe",
                coordinates: {
                    lat: -34.0465 + (Math.random() * 0.02),
                    lng: 18.8200 + (Math.random() * 0.02)
                },
                metrics: {
                    internet: { score: 3.5, value: "45 Mbps" },
                    video: { score: 3.8, value: "Good" },
                    vibe: { score: 3.9, value: "Nice" },
                    wifi: { score: 3.7, value: "Decent" },
                    power: { score: 3.6, value: "Available" }
                },
                ratings: {
                    vibe: 3.0 + Math.random(),
                    noise: 3.0 + Math.random(),
                    power: 3.0 + Math.random(),
                    video: 3.0 + Math.random(),
                    coffee: 3.0 + Math.random(),
                    price: 3.0 + Math.random(),
                    staff: 3.0 + Math.random(),
                    parking: 3.0 + Math.random()
                }
            },
            {
                id: 100 + Math.floor(Math.random() * 100),
                name: "Example Spot 3",
                address: "789 Example Road, Somerset West",
                metricValue: "Sample Metric Value",
                dominantTribe: "Sample Tribe",
                coordinates: {
                    lat: -34.0465 + (Math.random() * 0.02),
                    lng: 18.8200 + (Math.random() * 0.02)
                },
                metrics: {
                    internet: { score: 2.8, value: "25 Mbps" },
                    video: { score: 2.5, value: "Fair" },
                    vibe: { score: 2.9, value: "Okay" },
                    wifi: { score: 2.7, value: "Weak" },
                    power: { score: 2.4, value: "Limited" }
                },
                ratings: {
                    vibe: 2.0 + Math.random(),
                    noise: 2.0 + Math.random(),
                    power: 2.0 + Math.random(),
                    video: 2.0 + Math.random(),
                    coffee: 2.0 + Math.random(),
                    price: 2.0 + Math.random(),
                    staff: 2.0 + Math.random(),
                    parking: 2.0 + Math.random()
                }
            }
        ];
    }
});

// Get color based on rating
function getColorForRating(rating) {
    if (rating >= 4.5) return '#00AD5C'; // Excellent - Dark Green
    if (rating >= 3.5) return '#7FB800'; // Good - Light Green
    if (rating >= 2.5) return '#FFB400'; // Average - Yellow/Orange
    return '#FF4F4F';                    // Poor - Red
}

function updateRankings(spot) {
    if (!spot.rankingChanges) {
        spot.rankingChanges = {
            speed: Math.floor(Math.random() * 3) - 1,
            vibe: Math.floor(Math.random() * 3) - 1,
            parking: Math.floor(Math.random() * 3) - 1,
            noise: Math.floor(Math.random() * 3) - 1
        };
    }
    
    updateRankWithChange('speed-rank', spot.speedRank, spot.rankingChanges.speed);
    updateRankWithChange('vibe-rank', spot.vibeRank, spot.rankingChanges.vibe);
    updateRankWithChange('parking-rank', spot.parkingRank, spot.rankingChanges.parking);
    updateRankWithChange('noise-rank', spot.noiseRank || 2, spot.rankingChanges.noise);
}

// Generate HTML for dot rating
function generateDotRating(rating) {
    let dots = '';
    for (let i = 1; i <= 5; i++) {
        dots += `<span class="dot ${i <= rating ? 'filled' : ''}"></span>`;
    }
    return dots;
}

let spotCardTemplate = '';

// Load the template when the script loads
fetch('/templates/spot-card.html')
    .then(response => response.text())
    .then(template => {
        spotCardTemplate = template;
    })
    .catch(error => console.error('Error loading template:', error));

// Populate spots for a specific category
async function populateSpots(category) {
    // Get the container for this category
    const tabContent = document.getElementById(`${category}-tab`);
    if (!tabContent) return;
    
    const spotsGrid = tabContent.querySelector('.spots-grid');
    if (!spotsGrid) return;
    
    // Show loading state
    spotsGrid.innerHTML = '<div class="loading-indicator">Loading top spots...</div>';
    
    try {
        // Simulate API call
        const categorySpots = spotsData[category] || [];
        
        // Clear loading state
        spotsGrid.innerHTML = '';
        
        if (categorySpots.length === 0) {
            spotsGrid.innerHTML = '<div class="no-results">No spots found for this category.</div>';
            return;
        }
        
        // Populate top 3 spots with horizontal layout
        categorySpots.forEach((spot, index) => {
            // Create encoded address for Google Maps link
            const encodedAddress = encodeURIComponent(spot.address);
            
            // Replace template variables
            const spotHtml = spotCardTemplate
                .replace(/\${index \+ 1}/g, index + 1)
                .replace(/\${spot\.name}/g, spot.name)
                .replace(/\${spot\.address}/g, spot.address)
                .replace(/\${encodedAddress}/g, encodedAddress)
                .replace(/\${metricIcons\[category\]}/g, metricIcons[category])
                .replace(/\${spot\.metricValue}/g, spot.metricValue)
                .replace(/\${spot\.lastTestDate \|\| 'March 5, 2025'}/g, spot.lastTestDate || 'March 5, 2025')
                .replace(/\${spot\.testCount \|\| Math\.floor\(Math\.random\(\) \* 15\) \+ 5}/g, spot.testCount || Math.floor(Math.random() * 15) + 5)
                .replace(/\${generateConfidenceIndicator\(.*?\)}/g, generateConfidenceIndicator(spot.testCount || Math.floor(Math.random() * 15) + 5))
                .replace(/\${spot\.dominantTribe}/g, spot.dominantTribe);

            // Replace all rating-related placeholders
            ['vibe', 'noise', 'power', 'video', 'coffee', 'price', 'staff', 'parking'].forEach(rating => {
                spotHtml = spotHtml
                    .replace(new RegExp(`\\$\\{getColorForRating\\(spot\\.ratings\\.${rating}\\)\\}`, 'g'), getColorForRating(spot.ratings[rating]))
                    .replace(new RegExp(`\\$\\{generateDotRating\\(spot\\.ratings\\.${rating}\\)\\}`, 'g'), generateDotRating(spot.ratings[rating]));
            });
            
            spotsGrid.insertAdjacentHTML('beforeend', spotHtml);
        });

        // Add event listeners for spot links
        document.querySelectorAll('.spot-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const spotId = e.target.dataset.id;
                const spot = categorySpots.find(s => s.id === parseInt(spotId));
                if (spot) {
                    // Update overlay content
                    document.getElementById('detail-title').textContent = spot.name;
                    document.getElementById('address-text').textContent = spot.address;
                    document.getElementById('hours-text').textContent = `Hours: ${spot.hours || '7:00am - 6:00pm'}`;
                    document.getElementById('phone-text').textContent = spot.phone || '+27 21 000 0000';
                    document.getElementById('rating-value').textContent = `${spot.ratings.vibe.toFixed(1)}/5`;
                    document.getElementById('review-count').textContent = `(${Math.floor(Math.random() * 500) + 100} reviews)`;
                    
                    // Update rankings
                    document.getElementById('speed-rank').textContent = `#${spot.speedRank || 1}`;
                    document.getElementById('vibe-rank').textContent = `#${spot.vibeRank || 2}`;
                    document.getElementById('parking-rank').textContent = `#${spot.parkingRank || 3}`;
                    
                    // Update heatmap data and display
                    updateSpotData(spot);
                    
                    // Show overlay
                    document.getElementById('overlay').classList.remove('hidden');
                }
            });
        });

        // Add close button event listener
        document.getElementById('close-button').addEventListener('click', () => {
            document.getElementById('overlay').classList.add('hidden');
        });

        // Add metric button event listeners
        document.getElementById('speed-button').addEventListener('click', () => setActiveMetric('speed'));
        document.getElementById('vibe-button').addEventListener('click', () => setActiveMetric('vibe'));
        document.getElementById('parking-button').addEventListener('click', () => setActiveMetric('parking'));
    } catch (error) {
        console.error('Error populating spots:', error);
        spotsGrid.innerHTML = '<div class="error-message">Error loading spots. Please try again later.</div>';
    }
}

// Initialize tabs when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.category-tabs .tab-btn');
    
    // Add click event to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get category from data-tab attribute
            const category = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
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
            
            // Populate spots for this category
            populateSpots(category);
        });
    });
    
    // Initialize with the default category (internet)
    populateSpots('internet');
});