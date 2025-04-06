// Integrated Speed Test Script
// This script handles the integration between the location map and speed test

document.addEventListener('DOMContentLoaded', function() {
    // Variables to track state
    let selectedLocation = null;
    let speedTestResults = null;
    let testInProgress = false;
    
    // Variables to track test sequence
    let testSequenceInProgress = false;
    let currentTestNumber = 0;
    let totalTests = 3;
    let testResults = [];
    
    // Elements
    const startTestBtn = document.getElementById('start-test');
    const progressBar = document.querySelector('.progress-bar');
    const downloadSpeedEl = document.getElementById('download-speed');
    const uploadSpeedEl = document.getElementById('upload-speed');
    const pingEl = document.getElementById('ping');
    const statsContainer = document.getElementById('stats-container');
    
    // Listen for location selection events from geo-places.js
    document.addEventListener('placeSelected', function(event) {
        if (event.detail) {
            selectedLocation = event.detail;
            console.log('Location selected for speed test:', selectedLocation);
            
            // Enable the speed test button if it was disabled
            if (startTestBtn) {
                startTestBtn.disabled = false;
                startTestBtn.classList.remove('disabled');
            }
        }
    });
    
    // Initialize the speed test button
    if (startTestBtn) {
        // Initially disable the button if no location is selected
        if (!selectedLocation) {
            startTestBtn.disabled = true;
            startTestBtn.classList.add('disabled');
            startTestBtn.title = 'Please select a location first';
        }
        
        startTestBtn.addEventListener('click', function() {
            // Check if a location is selected
            if (!selectedLocation) {
                // Try to get the selected location from geo-places.js
                try {
                    if (typeof getSelectedLocation === 'function') {
                        selectedLocation = getSelectedLocation();
                    }
                } catch (e) {
                    console.error('Error getting selected location:', e);
                }
            }
            
            // Don't allow multiple simultaneous tests
            if (testSequenceInProgress) {
                return;
            }
            
            // Run the speed test sequence
            runSpeedTestSequence();
        });
    }
    
    /**
     * Simulate a speed test (would be replaced with actual speed test API)
     */
    function runSpeedTest(callback) {
        // Set state to in progress
        testInProgress = true;
        
        // Disable the button during the test
        if (startTestBtn) {
            startTestBtn.disabled = true;
        }
        
        // Reset progress bar
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Reset result displays
        if (downloadSpeedEl) downloadSpeedEl.textContent = '-- Mbps';
        if (uploadSpeedEl) uploadSpeedEl.textContent = '-- Mbps';
        if (pingEl) pingEl.textContent = '-- ms';
        
        // Simulate download test progress
        let progress = 0;
        const progressInterval = setInterval(function() {
            progress += 2;
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // Simulate some random test results
                const results = {
                    download: (Math.random() * 50 + 10).toFixed(1),
                    upload: (Math.random() * 30 + 5).toFixed(1),
                    ping: Math.floor(Math.random() * 50 + 15)
                };
                
                // Update the UI with results
                // showTestResults(results);
                
                // Store the results
                // speedTestResults = results;
                
                // Reset state
                testInProgress = false;
                
                // Call the callback with the results
                callback(results);
            }
        }, 100);
    }
    
    /**
     * Run a sequence of speed tests
     */
    function runSpeedTestSequence() {
        // Don't allow multiple sequences
        if (testSequenceInProgress) {
            return;
        }
        
        // Initialize sequence
        testSequenceInProgress = true;
        currentTestNumber = 0;
        testResults = [];
        
        // Update button state
        if (startTestBtn) {
            startTestBtn.disabled = true;
            startTestBtn.textContent = `Testing (1/${totalTests})...`;
        }
        
        // Start animations for coffee mug and WiFi icons
        const coffeeMugIcon = document.getElementById('coffee-mug-icon');
        const wifiIcon = document.getElementById('wifi-icon');
        
        if (coffeeMugIcon) {
            // Remove any existing animation class first
            coffeeMugIcon.classList.remove('bounce-animation');
            // Force a reflow to ensure the animation restarts properly
            void coffeeMugIcon.offsetWidth;
            // Add the animation class
            coffeeMugIcon.classList.add('bounce-animation');
        }
        
        if (wifiIcon) {
            // Remove any existing animation class first
            wifiIcon.classList.remove('pulse-animation');
            // Force a reflow to ensure the animation restarts properly
            void wifiIcon.offsetWidth;
            // Add the animation class
            wifiIcon.classList.add('pulse-animation');
        }
        
        // Start the first test
        runNextTest();
    }
    
    /**
     * Run the next test in the sequence
     */
    function runNextTest() {
        // Check if we've completed all tests
        if (currentTestNumber >= totalTests) {
            finalizeTestSequence();
            return;
        }
        
        // Increment test counter
        currentTestNumber++;
        
        // Update button text
        if (startTestBtn) {
            startTestBtn.textContent = `Testing (${currentTestNumber}/${totalTests})...`;
        }
        
        // Run the test
        runSpeedTest(function(results) {
            // Store this test's results
            testResults.push(results);
            
            // Run the next test after a short delay
            setTimeout(runNextTest, 500);
        });
    }
    
    /**
     * Finalize the test sequence by calculating averages
     */
    function finalizeTestSequence() {
        // Calculate average results
        const averageResults = {
            download: 0,
            upload: 0,
            ping: 0
        };
        
        // Sum up all test results
        testResults.forEach(result => {
            averageResults.download += parseFloat(result.download);
            averageResults.upload += parseFloat(result.upload);
            averageResults.ping += parseFloat(result.ping);
        });
        
        // Calculate averages
        averageResults.download = (averageResults.download / testResults.length).toFixed(1);
        averageResults.upload = (averageResults.upload / testResults.length).toFixed(1);
        averageResults.ping = Math.round(averageResults.ping / testResults.length);
        
        // Show the average results
        showTestResults(averageResults);
        
        // Store the results
        speedTestResults = averageResults;
        
        // Save the test results with the location
        saveTestResults(selectedLocation, averageResults);
        
        // Display box plot in stats container
        console.log('Stats container:', statsContainer);
        console.log('createSpeedTestBoxPlot function exists:', typeof createSpeedTestBoxPlot === 'function');
        console.log('Test results:', testResults);
        
        if (statsContainer && typeof createSpeedTestBoxPlot === 'function') {
            console.log('Calling createSpeedTestBoxPlot');
            createSpeedTestBoxPlot(statsContainer, testResults);
        } else {
            console.error('Cannot create box plot: statsContainer or createSpeedTestBoxPlot function is missing');
        }
        
        // Stop animations
        const coffeeMugIcon = document.getElementById('coffee-mug-icon');
        const wifiIcon = document.getElementById('wifi-icon');
        
        if (coffeeMugIcon) {
            coffeeMugIcon.classList.remove('bounce-animation');
        }
        
        if (wifiIcon) {
            wifiIcon.classList.remove('pulse-animation');
        }
        
        // Reset state
        testSequenceInProgress = false;
        if (startTestBtn) {
            startTestBtn.disabled = false;
            startTestBtn.textContent = 'Run Speed Test';
        }
        
        console.log(`Completed ${testResults.length} tests. Average results:`, averageResults);
    }
    
    /**
     * Display the test results in the UI
     */
    function showTestResults(results) {
        if (downloadSpeedEl) downloadSpeedEl.textContent = `${results.download} Mbps`;
        if (uploadSpeedEl) uploadSpeedEl.textContent = `${results.upload} Mbps`;
        if (pingEl) pingEl.textContent = `${results.ping} ms`;
        
        // Add the results to hidden form fields for submission
        addSpeedTestFields(results);
    }
    
    /**
     * Add speed test results to hidden form fields
     */
    function addSpeedTestFields(results) {
        // Add to hidden form fields if they exist
        const downloadField = document.getElementById('speed-test-download');
        const uploadField = document.getElementById('speed-test-upload');
        const pingField = document.getElementById('speed-test-ping');
        const timestampField = document.getElementById('speed-test-timestamp');
        
        if (downloadField) downloadField.value = results.download;
        if (uploadField) uploadField.value = results.upload;
        if (pingField) pingField.value = results.ping;
        if (timestampField) timestampField.value = new Date().toISOString();
    }
    
    /**
     * Save test results to the server (simulated)
     */
    function saveTestResults(location, results) {
        if (!location) {
            console.warn('No location selected, cannot save test results');
            return;
        }
        
        console.log(`Saving test results for location: ${location.name}`);
        console.log('Results:', results);
        
        // In a real implementation, this would send the data to a server
        // For now, we'll just simulate a successful save
        setTimeout(() => {
            console.log('Test results saved successfully');
        }, 500);
    }
});