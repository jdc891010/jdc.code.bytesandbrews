// Brews and Bytes - "Where should I go today?" Suggestions Implementation

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the suggestions section
  renderSuggestions();
  
  // Make sure suggestions are still visible after map is loaded
  document.addEventListener('mapLoaded', renderSuggestions);
});

// Render the suggestions section
function renderSuggestions() {
  const suggestionsData = window.mockSuggestions || [];
  if (suggestionsData.length === 0) {
      console.warn('No suggestions data available');
      return;
  }
  
  const container = document.getElementById('suggestions-container');
  if (!container) {
      console.warn('Suggestions container not found');
      return;
  }

  // Create the HTML for the suggestions section  
  container.innerHTML = `
      <div class="section-header">
          <h2>Where should I go today?</h2>
          <p>Find the perfect workspace based on your mood and needs</p>
      </div>
    
      <div class="suggestions-wrapper">
          <div class="suggestions-tabs">
              ${suggestionsData.map((suggestion, index) => `
                  <button class="suggestion-tab ${index === 0 ? 'active' : ''}" 
                          data-tab="${suggestion.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                      ${suggestion.category}
                  </button>
              `).join('')}
          </div>
      
          <div class="suggestions-content">
              ${suggestionsData.map((suggestion, index) => `
                  <div class="suggestion-panel ${index === 0 ? 'active' : ''}" 
                      id="${suggestion.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-panel">
                      <div class="suggestion-description">
                          <p><i class="fas fa-info-circle"></i> ${suggestion.description}</p>
                      </div>
                      <div class="suggested-spots">
                          ${renderSuggestedSpots(suggestion.shops)}
                      </div>
                  </div>
              `).join('')}
          </div>
      </div>
  `;
  
  // Add event listeners for tabs
  document.querySelectorAll('.suggestion-tab').forEach(tab => {
      tab.addEventListener('click', function() {
          // Remove active class from all tabs and panels
          document.querySelectorAll('.suggestion-tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.suggestion-panel').forEach(p => p.classList.remove('active'));
          
          // Add active class to clicked tab
          this.classList.add('active');
          
          // Show corresponding panel
          const panelId = this.getAttribute('data-tab') + '-panel';
          document.getElementById(panelId).classList.add('active');
      });
  });
  
  // Add event listeners for spot cards
  document.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', function() {
          const shopId = this.getAttribute('data-shop-id');
          if (shopId) {
              openSpotDetails(parseInt(shopId, 10));
          }
      });
  });
  
  // Add event listeners to all suggestion-view-btn buttons
  setTimeout(() => {
      document.querySelectorAll('.suggestion-view-btn').forEach(button => {
          button.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation(); // Prevent the card click event
              const shopId = this.getAttribute('data-id');
              openSpotDetails(shopId);
          });
      });
  }, 100);
}

// Helper function to render suggested spots
// Helper function to render suggested spots with consistent highlight grid
function renderSuggestedSpots(shops) {
  if (!shops || shops.length === 0) {
      return '<div class="no-suggestions">No spots available in this category yet.</div>';
  }
  
  // Display at most 3 spots for a cleaner UI
  const spotsToShow = shops.slice(0, 3);
  
  // Define the possible highlight types we want to display in a consistent order
  const highlightTypes = [
      { key: 'wifi', threshold: 4.5, icon: 'fas fa-bolt', label: 'Fast Wi-Fi', class: 'fast-wifi' },
      { key: 'vibe', threshold: 4.5, icon: 'fas fa-heart', label: 'Great Vibes', class: 'great-vibe' },
      { key: 'parking', threshold: 4.5, icon: 'fas fa-car', label: 'Easy Parking', class: 'easy-parking' },
      { key: 'noise', threshold: 2.5, icon: 'fas fa-volume-off', label: 'Quiet', class: 'quiet', isLowerBetter: true }
  ];
  
  return spotsToShow.map(shop => `
      <div class="suggestion-card" data-shop-id="${shop.id}">
          <div class="suggestion-card-header">
              <h3>${shop.name}</h3>
              <div class="suggestion-rating">
                  <i class="fas fa-wifi"></i> 
                  <span class="rating-value">${shop.ratings.wifi.toFixed(1)}</span>
              </div>
          </div>
          
          <div class="suggestion-meta">
              <span class="tribe-badge">
                  <i class="fas fa-users"></i> ${shop.dominantTribe}
              </span>
          </div>
          
          <p class="suggestion-desc">${shop.description}</p>
          
          <div class="suggestion-highlights">
              ${createConsistentHighlightGrid(shop.ratings, highlightTypes)}
          </div>
          
          <button class="suggestion-view-btn" data-id="${shop.id}">
              <i class="fas fa-arrow-right"></i> View Details
          </button>
      </div>
  `).join('');
}

// Create a consistent highlight grid with placeholders for missing highlights
function createConsistentHighlightGrid(ratings, highlightTypes) {
  return highlightTypes.map(type => {
      const rating = ratings[type.key];
      const meetsThreshold = type.isLowerBetter 
          ? (rating <= type.threshold)
          : (rating >= type.threshold);
          
      if (meetsThreshold) {
          return `<span class="highlight-badge ${type.class}"><i class="${type.icon}"></i> ${type.label}</span>`;
      } else {
          // Return an empty placeholder with the same height to maintain grid alignment
          return `<span class="highlight-badge-placeholder"></span>`;
      }
  }).join('');
}

// Create highlight badges based on ratings
function createHighlightBadges(ratings) {
  const highlights = [];
  
  if (ratings.wifi >= 4.5) {
      highlights.push('<span class="highlight-badge fast-wifi"><i class="fas fa-bolt"></i> Fast Wi-Fi</span>');
  }
  
  if (ratings.vibe >= 4.5) {
      highlights.push('<span class="highlight-badge great-vibe"><i class="fas fa-heart"></i> Great Vibes</span>');
  }
  
  if (ratings.parking >= 4.5) {
      highlights.push('<span class="highlight-badge easy-parking"><i class="fas fa-car"></i> Easy Parking</span>');
  }
  
  if (ratings.noise <= 2.5) {
      highlights.push('<span class="highlight-badge quiet"><i class="fas fa-volume-off"></i> Quiet</span>');
  }
  
  return highlights.join('');
}

// Function to handle opening spot details
// This connects to the existing place-card implementation
// function openSpotDetails(shopId) {
//   console.log(`Opening spot details for shop #${shopId}`);
  
//   // Find the shop by ID
//   const shop = window.mockCoffeeShops.find(s => s.id === shopId);
  
//   if (!shop) {
//       console.error(`Shop with ID ${shopId} not found from openSpotDetails`);
//       return;
//   }
  
//   // If we have a custom implementation defined in place-card.js, use it
//   if (typeof window.openBrewsAndBytesSpotDetail === 'function') {
//       // Make sure we pass the numeric ID, not the shop object
//       window.openBrewsAndBytesSpotDetail(parseInt(shop.id));
//   } else {
//       // Fallback implementation
//       console.log('Using fallback spot details implementation');
      
//       // Show the overlay
//       const overlay = document.getElementById('overlay');
//       if (overlay) {
//           overlay.classList.remove('hidden');
          
//           // Update content
//           const detailTitle = document.getElementById('detail-title');
//           if (detailTitle) detailTitle.textContent = shop.name;
          
//           const addressText = document.getElementById('address-text');
//           if (addressText) addressText.textContent = shop.address;
          
//           // Show other details as available
//           // This is just a basic implementation - extend as needed
//       }
//   }
// }

// Add CSS for the suggestions section
function addSuggestionStyles() {
  if (document.getElementById('suggestions-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'suggestions-styles';
  styleSheet.textContent = `
      /* Suggestions section */
      #suggestions-container {
          margin: 2rem auto;
          max-width: 1200px;
      }
      
      .suggestions-wrapper {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
      }
      
      .suggestions-tabs {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9f9fa;
      }
      
      .suggestions-tabs::-webkit-scrollbar {
          display: none;
      }
      
      .suggestion-tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
          position: relative;
      }
      
      .suggestion-tab:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background-color: #4A2C2A;
          transition: width 0.3s ease;
      }
      
      .suggestion-tab:hover {
          color: #1f2937;
      }
      
      .suggestion-tab.active {
          color: #4A2C2A;
          font-weight: 600;
      }
      
      .suggestion-tab.active:after {
          width: 100%;
      }
      
      .suggestions-content {
          padding: 1.5rem;
      }
      
      .suggestion-panel {
          display: none;
      }
      
      .suggestion-panel.active {
          display: block;
          animation: fadeIn 0.5s ease;
      }
      
      .suggestion-description {
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background-color: #f9f9fa;
          border-left: 4px solid #4A2C2A;
          border-radius: 0 4px 4px 0;
      }
      
      .suggestion-description p {
          margin: 0;
          color: #4b5563;
      }
      
      .suggestion-description i {
          color: #4A2C2A;
          margin-right: 0.5rem;
      }
      
      .suggested-spots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
      }
      
      .suggestion-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          position: relative;
          padding-bottom: 4rem; /* Make room for the button */
      }
      
      .suggestion-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          border-color: #00A1D6;
      }
      
      .suggestion-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
      }
      
      .suggestion-card h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #111827;
      }
      
      .suggestion-rating {
          display: inline-flex;
          align-items: center;
          color: #0288d1;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.875rem;
      }
      
      .suggestion-rating i {
          margin-right: 0.25rem;
      }
      
      .suggestion-meta {
          margin-bottom: 0.75rem;
      }
      
      /* Keep the original tribe-badge style but with a more specific selector */
      .suggestion-card .tribe-badge {
          display: inline-flex;
          align-items: center;
          background-color: #f0f4ff;
          color: #4361ee;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
      }
      
      .suggestion-card .tribe-badge i {
          margin-right: 0.25rem;
          font-size: 0.7rem;
      }
      
      .suggestion-desc {
          margin: 0.75rem 0;
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.5;
      }
      
      .suggestion-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
      }
      
      .highlight-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
      }
      
      .highlight-badge i {
          margin-right: 0.25rem;
      }
      
      .highlight-badge.fast-wifi {
          background-color: #e8f5e9;
          color: #2e7d32;
      }
      
      .highlight-badge.great-vibe {
          background-color: #fff8e1;
          color: #f57c00;
      }
      
      .highlight-badge.easy-parking {
          background-color: #e3f2fd;
          color: #1565c0;
      }
      
      .highlight-badge.quiet {
          background-color: #f3e5f5;
          color: #7b1fa2;
      }
      
      /* Changed class from view-spot-btn to suggestion-view-btn */
      .suggestion-view-btn {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          background-color: #4A2C2A;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 0.75rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
      }
      
      .suggestion-view-btn:hover {
          background-color: #00A1D6;
          transform: translateY(-2px);
      }
      
      .suggestion-view-btn:active {
          transform: translateY(0);
      }
      
      .suggestion-view-btn i {
          transition: transform 0.2s ease;
      }
      
      .suggestion-view-btn:hover i {
          transform: translateX(3px);
      }
      
      .no-suggestions {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
      }
      
      @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
          .suggestions-tabs {
              padding: 0 0.5rem;
          }
          
          .suggestion-tab {
              padding: 1rem 0.75rem;
              font-size: 0.875rem;
          }
          
          .suggestions-content {
              padding: 1rem;
          }
          
          .suggested-spots {
              grid-template-columns: 1fr;
          }
          
          .suggestion-view-btn {
              padding: 0.5rem 0.75rem;
              font-size: 0.875rem;
          }
      }
  `;
  
  document.head.appendChild(styleSheet);
}

// Add the styles when the page loads
document.addEventListener('DOMContentLoaded', addSuggestionStyles);