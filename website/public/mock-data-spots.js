// Somerset West Coffee Shop Mock Data
// This file provides structured mock data for Brews and Bytes

const mockCoffeeShops = [
    {
      id: 1,
      name: "Bootlegger Coffee Company",
      address: "12 Bright Street, Somerset West, 7130",
      coordinates: { lat: -34.07923, lng: 18.84379 },
      ratings: {
        wifi: 4.7,
        vibe: 4.2,
        coffee: 4.8,
        power: 3.9,
        parking: 4.0,
        noise: 3.2
      },
      categories: ["Safe", "Up-and-comer"],
      dominantTribe: "Code Conjurers",
      description: "A trendy spot with excellent coffee and reliable Wi-Fi, perfect for focused coding sessions.",
      isProfiled: true
    },
    {
      id: 2,
      name: "Blue Crane Coffee Company",
      address: "Lourensford Rd, Somerset West, 7130",
      coordinates: { lat: -34.07459, lng: 18.84612 },
      ratings: {
        wifi: 4.3,
        vibe: 4.8,
        coffee: 4.9,
        power: 4.2,
        parking: 4.7,
        noise: 3.8
      },
      categories: ["New Space", "Adventurous"],
      dominantTribe: "Word Weavers",
      description: "Spacious setting with garden views and creative atmosphere, perfect for writers and content creators.",
      isProfiled: true
    },
    {
      id: 3,
      name: "The Daily Coffee Café",
      address: "Waterstone Village, R44 & De Beers Avenue, Somerset West, 7130",
      coordinates: { lat: -34.07881, lng: 18.82822 },
      ratings: {
        wifi: 3.8,
        vibe: 4.0,
        coffee: 4.2,
        power: 3.5,
        parking: 4.5,
        noise: 3.0
      },
      categories: ["Safe", "Stranger Danger"],
      dominantTribe: "Pixel Pixies",
      description: "Mall location with good connectivity and plenty of parking, ideal for design sessions between errands.",
      isProfiled: true
    },
    {
      id: 4,
      name: "The Perfect Blend",
      address: "Southey St & Main Road, Somerset West, 7130",
      coordinates: { lat: -34.07711, lng: 18.84365 },
      ratings: {
        wifi: 4.1,
        vibe: 4.4,
        coffee: 4.7,
        power: 3.6,
        parking: 3.2,
        noise: 4.2
      },
      categories: ["New Space", "Up-and-comer"],
      dominantTribe: "Buzz Beasts",
      description: "Cozy spot with excellent pastries and a lively atmosphere, great for creative marketing brainstorms.",
      isProfiled: true
    },
    {
      id: 5,
      name: "Ou Meul Bakkery",
      address: "Somerset Mall, Somerset West, 7130",
      coordinates: { lat: -34.08119, lng: 18.82066 },
      ratings: {
        wifi: 3.2,
        vibe: 3.7,
        coffee: 4.5,
        power: 2.8,
        parking: 4.8,
        noise: 2.5
      },
      categories: ["Safe", "Stranger Danger"],
      dominantTribe: "Web Wizards",
      description: "Mall bakery with surprising web capabilities, attracting a diverse crowd of digital professionals.",
      isProfiled: true
    },
    {
      id: 6,
      name: "Treehouse Café",
      address: "Audacia Estate, R44, Somerset West, 7130",
      coordinates: { lat: -33.98722, lng: 18.84523 },
      ratings: {
        wifi: 3.9,
        vibe: 4.9,
        coffee: 4.0,
        power: 3.0,
        parking: 4.6,
        noise: 4.5
      },
      categories: ["Adventurous", "New Space"],
      dominantTribe: "Story Spinners",
      description: "Unique venue with natural surroundings and creative energy, perfect for storytellers and content creators.",
      isProfiled: true
    },
    {
      id: 7,
      name: "Schoon Cafe",
      address: "Somerset West Mall, Somerset West, 7130",
      coordinates: { lat: -34.08104, lng: 18.81985 },
      ratings: {
        wifi: 4.0,
        vibe: 4.3,
        coffee: 4.8,
        power: 3.4,
        parking: 4.7,
        noise: 3.1
      },
      categories: ["Safe", "Up-and-comer"],
      dominantTribe: "Code Conjurers",
      description: "Artisanal bakery and café with reliable connectivity and excellent pastries for coding fuel.",
      isProfiled: true
    },
    {
      id: 8,
      name: "Vida e Caffè",
      address: "Waterstone Village, Somerset West, 7130",
      coordinates: { lat: -34.07892, lng: 18.82795 },
      ratings: {
        wifi: 3.5,
        vibe: 3.8,
        coffee: 4.2,
        power: 3.3,
        parking: 4.4,
        noise: 2.9
      },
      categories: ["Safe"],
      dominantTribe: "Web Wizards",
      description: "Popular chain with consistent Wi-Fi and a bustling atmosphere for quick work sessions.",
      isProfiled: true
    },
    {
      id: 9,
      name: "La Belle Cafe",
      address: "Lourensford Wine Estate, Somerset West, 7130",
      coordinates: { lat: -34.02861, lng: 18.88694 },
      ratings: {
        wifi: 3.7,
        vibe: 4.8,
        coffee: 4.5,
        power: 3.2,
        parking: 4.9,
        noise: 3.8
      },
      categories: ["Adventurous", "Stranger Danger"],
      dominantTribe: "Pixel Pixies",
      description: "Scenic winery setting with Instagram-worthy views, attracting designers and visual creators.",
      isProfiled: true
    },
    {
      id: 10,
      name: "Simply Wholesome Somerset",
      address: "54 Mainstream Shopping Centre, Main Rd, Somerset West, 7130",
      coordinates: { lat: -34.07507, lng: 18.84407 },
      ratings: {
        wifi: 3.5,
        vibe: 4.5,
        coffee: 4.0,
        power: 3.1,
        parking: 3.8,
        noise: 3.5
      },
      categories: ["New Space", "Up-and-comer"],
      dominantTribe: "Word Weavers",
      description: "Health-focused café with mindful atmosphere, perfect for focused writing and editorial work.",
      isProfiled: true
    },
    // Unprofiled shops - candidates for future profiling
    {
      id: 11,
      name: "Taste Bistro",
      address: "Helderberg Village, Somerset West, 7130",
      coordinates: { lat: -34.06722, lng: 18.85278 },
      isProfiled: false
    },
    {
      id: 12,
      name: "Village Roast",
      address: "4 Bright St, Somerset West, 7130",
      coordinates: { lat: -34.07847, lng: 18.84327 },
      isProfiled: false
    },
    {
      id: 13,
      name: "Merkava Coffee",
      address: "Oude Molen Centre, Somerset West, 7130",
      coordinates: { lat: -34.07523, lng: 18.84291 },
      isProfiled: false
    },
    {
      id: 14,
      name: "Folk Coffee Anthropology",
      address: "Audacia Road, Stellenbosch, 7600",
      coordinates: { lat: -33.98903, lng: 18.84667 },
      isProfiled: false
    },
    {
      id: 15,
      name: "Coffee Corner",
      address: "Somerset West Mall, Somerset West, 7130",
      coordinates: { lat: -34.08162, lng: 18.81911 },
      isProfiled: false
    },
    {
      id: 16,
      name: "The Coffee Station",
      address: "Stelleridge Boutique Centre, Somerset West, 7130",
      coordinates: { lat: -34.05278, lng: 18.83611 },
      isProfiled: false
    }
  ];
  
  // Suggestions categories for "Where should I go today" section
  const mockSuggestions = [
    {
      category: "Call me boring, but this is safe",
      description: "Reliable Wi-Fi, good coffee, and a quiet atmosphere for getting work done.",
      shops: mockCoffeeShops.filter(shop => shop.categories && shop.categories.includes("Safe"))
    },
    {
      category: "Let's try a new space",
      description: "Recently added spots with promising reviews from the community.",
      shops: mockCoffeeShops.filter(shop => shop.categories && shop.categories.includes("New Space"))
    },
    {
      category: "Adventurous",
      description: "Unique locations with character, stunning views, or unusual settings.",
      shops: mockCoffeeShops.filter(shop => shop.categories && shop.categories.includes("Adventurous"))
    },
    {
      category: "Stranger Danger",
      description: "Off the beaten path locations with interesting quirks - results may vary!",
      shops: mockCoffeeShops.filter(shop => shop.categories && shop.categories.includes("Stranger Danger"))
    },
    {
      category: "Up-and-comer",
      description: "Spots gaining popularity with consistent improvements in ratings.",
      shops: mockCoffeeShops.filter(shop => shop.categories && shop.categories.includes("Up-and-comer"))
    }
  ];
  
  // Export the data for use in other modules
  // For the mock-up, you can access this data via window.mockCoffeeShops and window.mockSuggestions
  window.mockCoffeeShops = mockCoffeeShops;
  window.mockSuggestions = mockSuggestions;