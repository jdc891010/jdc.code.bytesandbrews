// Coffee shop data - you can extend this with your actual data
const coffeeShops = [
  {
    id: "bean-there",
    name: "Bean There Café",
    description: "Quiet corner café with large tables and friendly staff.",
    location: [-34.075, 18.843],
    metrics: {
      internet: 4.5,
      video: 4.2,
      vibe: 4.0,
      wifi: 4.8,
      power: 3.9
    }
  },
  {
    id: "digital-brew",
    name: "Digital Brew House",
    description: "Tech-friendly space with dedicated workstations.",
    location: [-34.080, 18.848],
    metrics: {
      internet: 4.2,
      video: 4.0,
      vibe: 4.5,
      wifi: 4.1,
      power: 4.8
    }
  },
  // Add more coffee shops as needed
];

// Helper functions
function getMetricName(metric) {
  const names = {
    internet: "Internet Speed",
    video: "Video Call Quality",
    vibe: "Vibe Check",
    wifi: "WiFi Coverage",
    power: "Power Availability"
  };
  return names[metric] || metric;
}

function getMetricDisplay(metric, value) {
  if (metric === "internet") {
    return `${Math.round(value * 10)} Mbps`;
  }
  return `${value}/5`;
}

function getColorForMetric(metric, value) {
  // Colors from excellent to poor
  const colors = ['#00AD5C', '#7FB800', '#FFB400', '#FF4F4F'];
  
  // Normalize value to 0-1 range (assuming values are 0-5)
  const normalizedValue = value / 5;
  
  // Map to color index (3 = poor, 0 = excellent)
  const index = Math.min(3, Math.floor(3 * (1 - normalizedValue)));
  
  return colors[index];
}