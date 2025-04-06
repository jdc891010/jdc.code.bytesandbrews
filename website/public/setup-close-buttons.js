// Function to set up close buttons
function setupCloseButtons() {
  const closeButton = document.getElementById('close-button');
  if (closeButton) {
    closeButton.addEventListener('click', closeOverlay);
  }

  // Also set up click event on the overlay background to close when clicking outside
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', function(event) {
      // Only close if clicking directly on the overlay (not its children)
      if (event.target === overlay) {
        closeOverlay();
      }
    });
  }
}
