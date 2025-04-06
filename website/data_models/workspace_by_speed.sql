SELECT l.name, l.address, m.avg_internet_speed, m.review_count
FROM locations l
JOIN location_metrics m ON l.location_id = m.location_id
WHERE m.review_count >= 3  -- Only consider locations with enough reviews
ORDER BY m.avg_internet_speed DESC
LIMIT 10;

