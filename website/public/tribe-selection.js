document.addEventListener('DOMContentLoaded', function() {
    // This event is dispatched after the tribe selection HTML is loaded into the DOM
    document.addEventListener('tribeSelectionLoaded', initTribeSelection);
    
    // If the HTML is already in the page (not loaded via AJAX), initialize directly
    if (document.querySelector('.tribe-categories')) {
        initTribeSelection();
    }
});

function initTribeSelection() {
    // Get all primary tribe category radio buttons
    const tribeCategories = document.querySelectorAll('input[name="tribe-category"]');
    
    // Get all subcategory containers
    const subcategories = document.querySelectorAll('.tribe-subcategory');
    
    // Get all "Other" option inputs
    const otherRoleInputs = document.querySelectorAll('.custom-role');
    
    // Function to show the selected subcategory and hide others
    function showSelectedSubcategory(categoryValue) {
        // Hide all subcategories first
        subcategories.forEach(subcategory => {
            subcategory.classList.add('hidden');
        });
        
        // Show the selected subcategory
        const selectedSubcategory = document.getElementById(`${categoryValue}-roles`);
        if (selectedSubcategory) {
            selectedSubcategory.classList.remove('hidden');
            
            // Check if there are any pre-selected radio buttons in this subcategory
            const hasCheckedOption = selectedSubcategory.querySelector('input[type="radio"]:checked');
            if (!hasCheckedOption && selectedSubcategory.querySelector('input[type="radio"]')) {
                // If none are selected, select the first one by default
                selectedSubcategory.querySelector('input[type="radio"]').checked = true;
            }
        }
    }
    
    // Function to toggle the custom text input for "Other" options
    function toggleCustomInput(radioInput) {
        if (!radioInput) return;
        
        // Find the category this role belongs to
        const categoryId = radioInput.closest('.tribe-subcategory').id;
        const category = categoryId.replace('-roles', '');
        
        // Hide all custom inputs first
        otherRoleInputs.forEach(input => {
            input.classList.add('hidden');
        });
        
        // Check if this is an "other" option
        if (radioInput.value.endsWith('-other')) {
            const customInputId = `custom-${category}-role`;
            const customInput = document.getElementById(customInputId);
            
            if (customInput) {
                customInput.classList.remove('hidden');
                // Set focus on the input after a short delay (to allow for UI update)
                setTimeout(() => customInput.focus(), 50);
            }
        }
    }
    
    // Add event listeners to primary category radio buttons
    tribeCategories.forEach(radio => {
        radio.addEventListener('change', function() {
            showSelectedSubcategory(this.value);
        });
    });
    
    // Add event listeners to all role radio buttons
    document.querySelectorAll('input[name="tribe-role"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleCustomInput(this);
        });
    });
    
    // Show the default category on page load (the first one that's checked)
    const defaultCategory = document.querySelector('input[name="tribe-category"]:checked');
    if (defaultCategory) {
        showSelectedSubcategory(defaultCategory.value);
    } else if (tribeCategories.length > 0) {
        // If none are checked, check the first one
        tribeCategories[0].checked = true;
        showSelectedSubcategory(tribeCategories[0].value);
    }
    
    // Form submission to collect both the category and role
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(event) {
            // This just collects the data but doesn't interfere with existing submission
            const selectedCategory = document.querySelector('input[name="tribe-category"]:checked');
            const selectedRole = document.querySelector('input[name="tribe-role"]:checked');
            
            if (selectedCategory && selectedCategory.value === 'other') {
                // Get the custom "other" occupation
                const otherOccupation = document.getElementById('custom-other-role').value;
                console.log('Other occupation:', otherOccupation);
                // Store in a hidden field that will be submitted with the form
                createOrUpdateHiddenField('occupation-category', 'other');
                createOrUpdateHiddenField('occupation-role', otherOccupation);
            } else if (selectedRole && selectedRole.value.endsWith('-other')) {
                // Get the subcategory and the custom role
                const category = selectedCategory.value;
                const customRoleInput = document.getElementById(`custom-${category}-role`);
                if (customRoleInput) {
                    console.log(`${category} custom role:`, customRoleInput.value);
                    // Store in hidden fields
                    createOrUpdateHiddenField('occupation-category', category);
                    createOrUpdateHiddenField('occupation-role', customRoleInput.value);
                }
            } else if (selectedCategory && selectedRole) {
                // Store standard selections
                createOrUpdateHiddenField('occupation-category', selectedCategory.value);
                createOrUpdateHiddenField('occupation-role', selectedRole.value);
            }
        });
    }
    
    // Helper function to create or update hidden fields for form submission
    function createOrUpdateHiddenField(name, value) {
        let field = document.querySelector(`input[name="${name}"]`);
        if (!field) {
            field = document.createElement('input');
            field.type = 'hidden';
            field.name = name;
            reviewForm.appendChild(field);
        }
        field.value = value;
    }
}