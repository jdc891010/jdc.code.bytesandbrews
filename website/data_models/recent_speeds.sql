SELECT 
    l.name, 
    s.download_speed, 
    s.upload_speed, 
    s.ping,
    s.test_timestamp
FROM speed_tests s
JOIN locations l ON s.location_id = l.location_id
ORDER BY s.test_timestamp DESC
LIMIT 20;