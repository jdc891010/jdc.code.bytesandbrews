// Coffee Shop Data
export interface CoffeeShop {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  wifiSpeed: number;
  vibes: string[];
  popularWith: string[];
  address?: string;
  city?: string;
  country?: string;
  updated?: string;
}

export const popularCoffeeShops: CoffeeShop[] = [
  {
    id: 1,
    name: "Urban Grind",
    description: "A sleek, modern coffee shop with perfect lighting for laptop work and plenty of outlets.",
    imageUrl: "https://picsum.photos/500/300?random=60",
    wifiSpeed: 35,
    vibes: ["Quiet Zen", "Focus Factory"],
    popularWith: ["Code Conjurers", "Word Weavers"],
    city: "San Francisco",
    updated: "2 days ago"
  },
  {
    id: 2,
    name: "The Bean Connection",
    description: "Rustic charm meets modern convenience with comfortable seating and excellent espresso.",
    imageUrl: "https://picsum.photos/500/300?random=61",
    wifiSpeed: 22,
    vibes: ["Chatty Buzz", "Creative Chaos"],
    popularWith: ["Pixel Pixies", "Buzz Beasts"],
    city: "New York",
    updated: "Yesterday"
  },
  {
    id: 3,
    name: "Caffeine Code",
    description: "Tech-focused coffee shop with private booths, high-speed internet, and themed drinks.",
    imageUrl: "https://picsum.photos/500/300?random=62",
    wifiSpeed: 42,
    vibes: ["Focus Factory", "Quiet Zen"],
    popularWith: ["Web Wizards", "Story Spinners"],
    city: "London",
    updated: "Today"
  },
  {
    id: 4,
    name: "Byte & Brew",
    description: "Digital nomad paradise with large tables, 24/7 access, and a supportive community of techies.",
    imageUrl: "https://picsum.photos/500/300?random=63",
    wifiSpeed: 48,
    vibes: ["Tech Haven", "Collaborative"],
    popularWith: ["Code Conjurers", "Data Druids"],
    city: "Berlin",
    updated: "3 days ago"
  }
];

// Vibe Categories
export interface VibeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const vibeCategories: VibeCategory[] = [
  {
    id: "quiet-zen",
    name: "Quiet Zen",
    description: "Peaceful atmosphere, minimal noise, perfect for focused work",
    icon: "fas fa-volume-mute"
  },
  {
    id: "chatty-buzz",
    name: "Chatty Buzz",
    description: "Lively environment with conversation, good for creative thinking",
    icon: "fas fa-comments"
  },
  {
    id: "creative-chaos",
    name: "Creative Chaos",
    description: "Energetic space with lots of activity, inspirational setting",
    icon: "fas fa-wind"
  },
  {
    id: "focus-factory",
    name: "Focus Factory",
    description: "Designed for productivity with minimal distractions",
    icon: "fas fa-bullseye"
  },
  {
    id: "digital-hub",
    name: "Digital Hub",
    description: "Tech-oriented atmosphere with like-minded digital workers",
    icon: "fas fa-laptop-code"
  },
  {
    id: "collaborative",
    name: "Collaborative",
    description: "Open and friendly environment, easy to meet others",
    icon: "fas fa-users"
  }
];

// Creature Tribes
export interface CreatureTribe {
  id: string;
  title: string;
  category: string;
  icon: string;
  colorClass: string;
  description: string;
}

export const creatureTribes: CreatureTribe[] = [
  {
    id: "code-conjurer",
    title: "Code Conjurer",
    category: "Technology & IT",
    icon: "fas fa-laptop-code",
    colorClass: "bg-tech-blue",
    description: "Software Developer"
  },
  {
    id: "web-wizard",
    title: "Web Wizard",
    category: "Technology & IT",
    icon: "fas fa-laptop-code",
    colorClass: "bg-tech-blue",
    description: "Web Developer"
  },
  {
    id: "pixel-pixie",
    title: "Pixel Pixie",
    category: "Creative & Design",
    icon: "fas fa-paint-brush",
    colorClass: "bg-vibe-yellow",
    description: "Graphic Designer"
  },
  {
    id: "frame-fiend",
    title: "Frame Fiend",
    category: "Creative & Design",
    icon: "fas fa-paint-brush",
    colorClass: "bg-vibe-yellow",
    description: "Video Editor"
  },
  {
    id: "word-weaver",
    title: "Word Weaver",
    category: "Writing & Content",
    icon: "fas fa-feather-alt",
    colorClass: "bg-coffee-brown",
    description: "Copywriter"
  },
  {
    id: "story-spinner",
    title: "Story Spinner",
    category: "Writing & Content",
    icon: "fas fa-feather-alt",
    colorClass: "bg-coffee-brown",
    description: "Content Writer"
  },
  {
    id: "buzz-beast",
    title: "Buzz Beast",
    category: "Marketing & Sales",
    icon: "fas fa-bullhorn",
    colorClass: "bg-tech-blue",
    description: "Digital Marketer"
  },
  {
    id: "deal-driver",
    title: "Deal Driver",
    category: "Marketing & Sales",
    icon: "fas fa-bullhorn",
    colorClass: "bg-tech-blue",
    description: "Sales Representative"
  }
];
