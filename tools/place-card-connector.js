// Dynamically load and inject the place-card overlay from place-card.html
(async function() {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('place-card.html');
      const html = await res.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const overlay = wrapper.querySelector('#overlay');
      if (!overlay) {
        console.error('Overlay markup (#overlay) not found in place-card.html');
        return;
      }
      document.body.appendChild(overlay);
      // Initialize place card once overlay is in DOM
      if (typeof initializePlaceCard === 'function') {
        initializePlaceCard();
      }
    } catch (err) {
      console.error('Failed to load place-card.html:', err);
    }

    // Bind "View Details" buttons to open overlay
    document.querySelectorAll('.view-spot-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const spotId = btn.getAttribute('data-id');
        if (typeof openSpotDetail === 'function') {
          openSpotDetail(spotId);
        }
      });
    });
  });
})();
