// Store test results globally to access them later
let speedTestResults = {
    timestamp: '',
    location: {
        latitude: null,
        longitude: null,
        accuracy: null,
        placeName: 'Unknown Location'
    },
    wifiInfo: {
        name: 'Unknown Network',
        signalStrength: null,
        frequency: null,
        downlinkMax: null
    },
    download: 0,
    upload: 0,
    ping: 0,
    jitter: 0,
    isp: '',
    testRuns: [] // Store results from each test run
};

// Track current test state
let currentTestRun = 0;
const totalTestRuns = 3;
let testRunsCompleted = 0;
let currentJokeIndex = 0;
let jokeInterval = null;

// Array of jokes about bad coffee and WiFi
const jokes = [
    "My WiFi is like my coffee - weak and inconsistent.",
    "I asked for strong WiFi, they gave me decaf.",
    "Loading... just like my morning without coffee.",
    "My internet connection is like instant coffee - disappointing.",
    "Error 404: Coffee and WiFi not found.",
    "This WiFi is slower than a Monday morning without caffeine.",
    "Buffering... just like my brain before coffee.",
    "My router and coffee maker have the same problem - they both need to be restarted daily.",
    "WiFi password is 'needmorecoffee' - both are essential for survival.",
    "This connection is so slow, my coffee went cold waiting for a webpage to load.",
    "My WiFi strength is inversely proportional to my coffee strength.",
    "I'm running on low battery and bad WiFi - send coffee!",
    "This internet is like drinking cold coffee - technically works but deeply unsatisfying.",
    "Trying to connect... like trying to function before coffee.",
    "The only thing worse than no WiFi is no coffee."
];

// Initialize the speed test functionality
function initSpeedTest() {
    console.log('Initializing speed test with 3 runs');
    
    // Add event listener to the speed test button
    const button = document.getElementById('start-test');
    if (button) {
        button.addEventListener('click', startSpeedTest);
    } else {
        console.error('Speed test button not found!');
    }
    
    // Initialize test results display
    const testResults = document.querySelector('.test-results');
    if (!testResults) return;
    
    // Create share button if it doesn't exist
    if (!document.getElementById('share-results')) {
        const shareButton = document.createElement('button');
        shareButton.id = 'share-results';
        shareButton.className = 'share-button';
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share Results';
        shareButton.addEventListener('click', shareTestResults);
        shareButton.style.display = 'none';
        
        // Insert the share button after the test results
        testResults.after(shareButton);
    }
}

// Set up the LibreSpeed test
function setupSpeedTest() {
    if (typeof LibreSpeed === 'undefined') {
        console.warn('LibreSpeed not found, will use mock test');
        return;
    }
    
    // Initialize LibreSpeed
    window.speedTest = new LibreSpeed({
        // Use multiple servers for better accuracy
        servers: [
            {
                name: 'Johannesburg',
                server: 'https://speedtest.wifibre.co.za/',
                dlURL: 'backend/garbage.php',
                ulURL: 'backend/empty.php',
                pingURL: 'backend/empty.php',
                getIpURL: 'backend/getIP.php'
            },
            {
                name: 'Cape Town',
                server: 'https://speedtest.webafrica.co.za/',
                dlURL: 'backend/garbage.php',
                ulURL: 'backend/empty.php',
                pingURL: 'backend/empty.php',
                getIpURL: 'backend/getIP.php'
            }
        ],
        // Test settings
        test_order: 'ping_jitter,download,upload',
        time_dl_max: 10, // 10 seconds max for download test
        time_ul_max: 10, // 10 seconds max for upload test
        count_ping: 10, // 10 pings for accuracy
        // Callbacks
        callbacks: {
            onIpInfoUpdate: function(data) {
                if (data && data.processedString) {
                    speedTestResults.isp = data.processedString;
                }
            },
            onStart: speedTestStart,
            onProgress: speedTestProgress,
            onEnd: speedTestEnd
        }
    });
    
    console.log('Speed test configured');
}

// Start the speed test and collect WiFi information
function startSpeedTest() {
    console.log('Starting speed test');
    
    const button = document.getElementById('start-test');
    const shareButton = document.getElementById('share-results');
    
    // Reset UI
    button.disabled = true;
    button.classList.add('disabled'); // Add disabled class
    button.textContent = 'Testing (1/3)...';
    if (shareButton) shareButton.style.display = 'none';
    
    // Clear coffee mugs
    const coffeeMugs = document.querySelector('.coffee-mugs');
    coffeeMugs.innerHTML = '';
    
    // Reset progress bars
    document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = '0%';
        bar.classList.remove('completed');
    });
    
    // Start coffee mug animation
    const coffeeMugIcon = document.getElementById('coffee-mug-icon');
    if (coffeeMugIcon) {
        // First remove any existing animation class
        coffeeMugIcon.classList.remove('bounce-animation');
        // Force a reflow to restart the animation
        void coffeeMugIcon.offsetWidth;
        // Add the animation class
        coffeeMugIcon.classList.add('bounce-animation');
        console.log('Coffee mug animation started');
    }
    
    // Reset results display
    document.getElementById('download-speed').textContent = '-- Mbps';
    document.getElementById('upload-speed').textContent = '-- Mbps';
    document.getElementById('ping').textContent = '-- ms';
    
    // Reset test state
    currentTestRun = 0;
    testRunsCompleted = 0;
    speedTestResults.testRuns = [];
    
    // Get the current timestamp
    speedTestResults.timestamp = new Date().toISOString();
    
    // Start the first test run
    startNextTestRun();
    
    // Start displaying jokes
    displayJoke();
}

// Start the next test run
function startNextTestRun() {
    if (currentTestRun < totalTestRuns) {
        currentTestRun++;
        console.log(`Starting test run ${currentTestRun}/${totalTestRuns}`);
        
        // Update button text
        const button = document.getElementById('start-test');
        button.textContent = `Testing (${currentTestRun}/${totalTestRuns})...`;
        
        // Reset the current progress bar
        const progressBar = document.querySelector(`.progress-bar[data-test='${currentTestRun}']`);
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Highlight the current test label
        highlightCurrentTest(currentTestRun);
        
        // Check if we have LibreSpeed available
        if (window.speedTest && typeof window.speedTest.start === 'function') {
            console.log(`Running LibreSpeed test ${currentTestRun}/${totalTestRuns}`);
            window.speedTest.start();
        } else {
            console.log(`Running mock test ${currentTestRun}/${totalTestRuns}`);
            runMockSpeedTest();
        }
    } else {
        console.log('All test runs completed');
        finalizeSpeedTest();
    }
}

// Highlight the current test label
function highlightCurrentTest(testNumber) {
    // Reset all labels
    document.querySelectorAll('.progress-label').forEach(label => {
        label.style.fontWeight = 'normal';
        label.style.color = '#666';
    });
    
    // Highlight current test label
    const currentLabel = document.querySelector(`.progress-bar-wrapper:nth-child(${testNumber}) .progress-label`);
    if (currentLabel) {
        currentLabel.style.fontWeight = 'bold';
        currentLabel.style.color = '#000';
    }
}

// Display a joke
function displayJoke() {
    const jokeContainer = document.querySelector('.joke-container');
    if (jokeContainer) {
        jokeContainer.textContent = jokes[currentJokeIndex];
        currentJokeIndex = (currentJokeIndex + 1) % jokes.length;
    }
    
    // Display next joke after a short delay
    clearTimeout(jokeInterval);
    jokeInterval = setTimeout(displayJoke, 5000);
}

// Called when the speed test starts
function speedTestStart() {
    console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Speed test started`);
}

// Called during the speed test to update progress
function speedTestProgress(data) {
    // Update the progress bar for the current test
    const progressBar = document.querySelector(`.progress-bar[data-test='${currentTestRun}']`);
    if (!progressBar) return;
    
    let progress = 0;
    
    if (data.testState === 1) { // Download test
        progress = Math.min(Math.round(data.dlProgress * 100), 100);
        console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Download progress: ${progress}%`);
    } else if (data.testState === 2) { // Upload test
        progress = Math.min(Math.round(data.ulProgress * 100), 100);
        console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Upload progress: ${progress}%`);
    } else if (data.testState === 3) { // Ping test
        progress = Math.min(Math.round(data.pingProgress * 100), 100);
        console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Ping progress: ${progress}%`);
    }
    
    progressBar.style.width = `${progress}%`;
}

// Called when the speed test ends
function speedTestEnd(data) {
    console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Test completed:`, data);
    
    // Store this test run's results
    const testRunResult = {
        download: parseFloat(data.dlStatus) || 0,
        upload: parseFloat(data.ulStatus) || 0,
        ping: parseFloat(data.pingStatus) || 0,
        jitter: parseFloat(data.jitterStatus) || 0
    };
    
    // Add to test runs array
    speedTestResults.testRuns.push(testRunResult);
    
    // Mark the current progress bar as completed
    const progressBar = document.querySelector(`.progress-bar[data-test='${currentTestRun}']`);
    if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.classList.add('completed');
    }
    
    // Add a coffee mug to the animation
    addCoffeeMug();
    
    // Update the current test results in the UI
    updateIntermediateResults(testRunResult, currentTestRun);
    
    // Increment completed test count
    testRunsCompleted++;
    console.log(`Test run ${currentTestRun} completed. Total completed: ${testRunsCompleted}/${totalTestRuns}`);
    
    // Start the next test run or finalize
    setTimeout(() => {
        if (testRunsCompleted < totalTestRuns) {
            startNextTestRun();
        } else {
            console.log('All tests completed, finalizing results');
            finalizeSpeedTest();
        }
    }, 1500); // Slightly longer delay between test runs for better visual feedback
}

// Update intermediate results in the UI
function updateIntermediateResults(results, testNumber) {
    // Show the current test's results temporarily
    const downloadEl = document.getElementById('download-speed');
    const uploadEl = document.getElementById('upload-speed');
    const pingEl = document.getElementById('ping');
    
    if (downloadEl) downloadEl.textContent = `${results.download} Mbps (Test ${testNumber})`;
    if (uploadEl) uploadEl.textContent = `${results.upload} Mbps (Test ${testNumber})`;
    if (pingEl) pingEl.textContent = `${results.ping} ms (Test ${testNumber})`;
}

// Add a coffee mug to the animation
function addCoffeeMug() {
    console.log(`Adding coffee mug for test run ${currentTestRun}`);
    const coffeeMugs = document.querySelector('.coffee-mugs');
    if (!coffeeMugs) return;
    
    const mug = document.createElement('i');
    mug.className = 'fas fa-mug-hot coffee-mug';
    coffeeMugs.appendChild(mug);
    
    // Trigger animation
    setTimeout(() => {
        mug.classList.add('show');
        console.log('Coffee mug animation triggered');
    }, 50);
}

// Fallback mock speed test for development or if LibreSpeed doesn't load
function runMockSpeedTest() {
    console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Running mock speed test`);
    
    const progressBar = document.querySelector(`.progress-bar[data-test='${currentTestRun}']`);
    let progress = 0;
    
    // Generate random test values based on test number
    // Each test will have slightly different values for realism
    const randomFactor = 0.8 + (Math.random() * 0.4); // Between 0.8 and 1.2
    
    // Base values that will be adjusted by the random factor
    const baseDownload = 25 + (Math.random() * 50); // Between 25 and 75 Mbps
    const baseUpload = 5 + (Math.random() * 20);    // Between 5 and 25 Mbps
    const basePing = 15 + (Math.random() * 60);     // Between 15 and 75 ms
    const baseJitter = 1 + (Math.random() * 9);     // Between 1 and 10 ms
    
    // Simulate progress updates
    const interval = setInterval(() => {
        progress += 2;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Mark the progress bar as completed
            if (progressBar) {
                progressBar.classList.add('completed');
            }
            
            // Create mock test results
            const mockResults = {
                dlStatus: (baseDownload * randomFactor).toFixed(2),
                ulStatus: (baseUpload * randomFactor).toFixed(2),
                pingStatus: Math.round(basePing * randomFactor),
                jitterStatus: (baseJitter * randomFactor).toFixed(2)
            };
            
            console.log(`[TEST ${currentTestRun}/${totalTestRuns}] Mock test completed with results:`, mockResults);
            
            // Call the end function with mock results
            speedTestEnd(mockResults);
        }
    }, 100);
}

// Share test results
function shareTestResults() {
    console.log('Sharing test results');
    
    // Create a shareable text
    const shareText = `I just tested my internet speed at Brews & Bytes:\n\nDownload: ${speedTestResults.download} Mbps\nUpload: ${speedTestResults.upload} Mbps\nPing: ${speedTestResults.ping} ms\n\nTested at: ${speedTestResults.location.placeName}\n\n#BrewsAndBytes #WiFiSpeed`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'My Internet Speed Test Results',
            text: shareText
        })
        .then(() => console.log('Successfully shared'))
        .catch((error) => {
            console.error('Error sharing:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback sharing method
function fallbackShare(text) {
    // Create a textarea element to hold the text
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textarea);
    
    // Notify the user
    alert('Results copied to clipboard! You can now paste them wherever you want to share.');
}

// Calculate average results and finalize the test
function finalizeSpeedTest() {
    console.log('FINALIZING SPEED TEST RESULTS');
    console.log(`Test runs completed: ${speedTestResults.testRuns.length}`);
    console.log('Individual test results:', speedTestResults.testRuns);
    
    // Calculate averages
    if (speedTestResults.testRuns.length > 0) {
        let totalDownload = 0;
        let totalUpload = 0;
        let totalPing = 0;
        let totalJitter = 0;
        
        speedTestResults.testRuns.forEach((run, index) => {
            console.log(`Run ${index + 1} results:`, run);
            totalDownload += run.download;
            totalUpload += run.upload;
            totalPing += run.ping;
            totalJitter += run.jitter;
        });
        
        const count = speedTestResults.testRuns.length;
        speedTestResults.download = (totalDownload / count).toFixed(2);
        speedTestResults.upload = (totalUpload / count).toFixed(2);
        speedTestResults.ping = Math.round(totalPing / count);
        speedTestResults.jitter = (totalJitter / count).toFixed(2);
        
        console.log('Final averaged results:', {
            download: speedTestResults.download,
            upload: speedTestResults.upload,
            ping: speedTestResults.ping,
            jitter: speedTestResults.jitter
        });
        
        // Update the UI with average results
        document.getElementById('download-speed').textContent = `${speedTestResults.download} Mbps`;
        document.getElementById('upload-speed').textContent = `${speedTestResults.upload} Mbps`;
        document.getElementById('ping').textContent = `${speedTestResults.ping} ms`;
    }
    
    // Re-enable the test button
    const button = document.getElementById('start-test');
    button.disabled = false;
    button.classList.remove('disabled'); // Remove disabled class
    button.textContent = 'Run Speed Test Again';
    console.log('Test button re-enabled');
    
    // Show the share button
    const shareButton = document.getElementById('share-results');
    if (shareButton) shareButton.style.display = 'inline-block';
    
    // Stop coffee mug animation
    const coffeeMugIcon = document.getElementById('coffee-mug-icon');
    if (coffeeMugIcon) {
        coffeeMugIcon.classList.remove('bounce-animation');
        console.log('Coffee mug animation stopped');
    }
    
    // Stop displaying jokes
    clearTimeout(jokeInterval);
    
    // Dispatch event that test is complete
    const event = new CustomEvent('speedTestComplete', { detail: speedTestResults });
    document.dispatchEvent(event);
    console.log('speedTestComplete event dispatched');
}

// Initialize the speed test when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing speed test');
    initSpeedTest();
    
    // Add LibreSpeed library to document
    const librespeedScript = document.createElement('script');
    librespeedScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/LibreSpeed/1.0.9/speedtest.min.js';
    document.head.appendChild(librespeedScript);

    // Once the library is loaded, set up the test
    librespeedScript.onload = function() {
        console.log('LibreSpeed library loaded');
        setupSpeedTest();
    };
    
    librespeedScript.onerror = function() {
        console.warn('Failed to load LibreSpeed library, will use mock test');
    };
});