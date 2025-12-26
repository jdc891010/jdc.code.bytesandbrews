// Coffee Shop Data
export interface CoffeeShop {
  id: number | string;
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
  coordinates?: {
    lat: number;
    lng: number;
  };
}

import generatedPlaces from './generated_places.json';

export const popularCoffeeShops: CoffeeShop[] = [
  ...generatedPlaces as CoffeeShop[],
  // Keep original mock data if needed, or comment out
  /*
  {
    id: 1,
    name: "Urban Grind",
    ...
  }
  */
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
