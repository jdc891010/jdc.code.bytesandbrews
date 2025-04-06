CREATE TABLE speed_tests (
    test_id INTEGER PRIMARY KEY,
    location_id INTEGER REFERENCES locations(location_id),
    download_speed DOUBLE,       -- in Mbps
    upload_speed DOUBLE,         -- in Mbps
    ping INTEGER,                -- in ms
    jitter DOUBLE,               -- in ms
    
    -- Additional LibreSpeed metrics
    latency INTEGER,             -- in ms
    packet_loss DOUBLE,          -- percentage
    
    -- Connection details
    ip_address VARCHAR,          -- can be hashed for privacy
    isp VARCHAR,                 -- Internet Service Provider
    server_name VARCHAR,         -- Test server used
    server_location VARCHAR,     -- Physical location of test server
    server_distance INTEGER,     -- Distance to server in km
    
    -- Client information
    user_agent VARCHAR,          -- Browser/device info
    browser VARCHAR,
    operating_system VARCHAR,
    device_type VARCHAR,         -- e.g., "mobile", "laptop"
    connection_type VARCHAR,     -- e.g., "wifi", "cellular", "ethernet"
    is_vpn BOOLEAN,              -- Detected VPN usage
    screen_resolution VARCHAR,   -- For reporting device capabilities
    
    -- Test details
    test_duration INTEGER,       -- How long the test took in seconds
    test_method VARCHAR,         -- Which test method was used
    test_grade VARCHAR,          -- Overall performance grade (A-F)
    
    -- Additional data points
    download_bandwidth INTEGER,  -- Raw measured bandwidth
    upload_bandwidth INTEGER,    -- Raw measured bandwidth
    download_bytes BIGINT,       -- Total bytes transferred during download test
    upload_bytes BIGINT,         -- Total bytes transferred during upload test
    download_elapsed INTEGER,    -- Time elapsed for download test in ms
    upload_elapsed INTEGER,      -- Time elapsed for upload test in ms
    
    -- Debugging and technical data
    download_progress TEXT,      -- JSON array of progress measurements
    upload_progress TEXT,        -- JSON array of progress measurements
    tcp_connection_info TEXT,    -- JSON with TCP connection stats
    
    -- Metadata
    test_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    test_uuid VARCHAR,           -- Unique identifier for test
    user_device_hash VARCHAR,    -- Pseudonymous identifier
    user_location_text VARCHAR,  -- User's description of their exact location within the venue
    test_notes TEXT              -- Any additional notes about the test
);

CREATE INDEX idx_speed_tests_location ON speed_tests(location_id);
CREATE INDEX idx_speed_tests_timestamp ON speed_tests(test_timestamp);
CREATE INDEX idx_speed_tests_speeds ON speed_tests(download_speed, upload_speed);