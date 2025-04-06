// Function to ensure the talking points HTML structure is correct
function ensureTalkingPointsStructure() {
    // Check if the talking points section exists with proper structure
    const talkingPointsTitle = document.getElementById('talking-points-title');
    const dosList = document.getElementById('dos-list');
    const dontsList = document.getElementById('donts-list');

    // If any of these elements are missing, rebuild the structure
    if (!talkingPointsTitle || !dosList || !dontsList) {
        console.log("Rebuilding talking points structure...");

        // Find the content container
        const detailContent = document.querySelector('.detail-content');
        if (!detailContent) {
            console.error("Detail content container not found");
            return false;
        }

        // Remove existing talking points card if it exists
        const existingCard = talkingPointsTitle ?
            talkingPointsTitle.closest('.detail-card') :
            detailContent.querySelector('.detail-card:nth-last-child(2)');

        if (existingCard) {
            existingCard.remove();
        }

        // Create new talking points card with proper structure
        const talkingPointsCard = document.createElement('div');
        talkingPointsCard.className = 'detail-card';
        talkingPointsCard.innerHTML = `
        <h3 class="section-title" id="talking-points-title">Talking Points with Code Conjurers</h3>
        <div class="talking-points" id="talking-points" style="display: flex; flex-direction: row; justify-content: space-between;">
          <div class="dos-section" style="width: 49%; margin-right: 1%;">
            <h4 class="sub-section-title">Do's:</h4>
            <ul class="talking-points-list" id="dos-list"></ul>
          </div>
          <div class="donts-section" style="width: 50%;">
            <h4 class="sub-section-title">Don'ts:</h4>
            <ul class="talking-points-list" id="donts-list"></ul>
          </div>
        </div>
      `;

        // Find comments section to insert before it, or append to detail content
        const commentsSection = detailContent.querySelector('.detail-card:last-child');
        if (commentsSection) {
            detailContent.insertBefore(talkingPointsCard, commentsSection);
        } else {
            detailContent.appendChild(talkingPointsCard);
        }

        console.log("Talking points structure rebuilt");
        return true;
    }

    return false;
}

// Make the function available globally
window.ensureTalkingPointsStructure = ensureTalkingPointsStructure;