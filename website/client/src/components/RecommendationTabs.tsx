import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoffeeShopCard from "@/components/CoffeeShopCard";
import CoffeeShopDetails from "@/components/CoffeeShopDetails";
import SectionScrollButton from "@/components/SectionScrollButton";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { popularCoffeeShops } from "@/lib/data";

// Extended coffee shop data with recommendation categories
interface RecommendedShop {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  wifiSpeed: number;
  vibes: string[];
  popularWith: string[];
  categories: Array<"safe" | "surprise" | "upcoming" | "fresh">;
}

const recommendedShops: RecommendedShop[] = [
  {
    id: 1,
    name: "Bootlegger, Somerset West",
    description: "A sleek, modern coffee shop on Bright Street with perfect lighting for laptop work and plenty of outlets.",
    imageUrl: "https://picsum.photos/500/300?random=10",
    wifiSpeed: 35,
    vibes: ["Quiet Zen", "Focus Factory"],
    popularWith: ["Code Conjurers", "Word Weavers"],
    categories: ["safe", "fresh"]
  },
  {
    id: 2,
    name: "Nom Nom, Somerset Mall",
    description: "Cozy café in Somerset Mall with rustic charm, comfortable seating and excellent espresso drinks.",
    imageUrl: "https://picsum.photos/500/300?random=11",
    wifiSpeed: 28,
    vibes: ["Chatty Buzz", "Creative Chaos"],
    popularWith: ["Pixel Pixies", "Buzz Beasts"],
    categories: ["upcoming", "surprise"]
  },
  {
    id: 3,
    name: "Slug & Lettuce, Waterstone",
    description: "Spacious venue with comfortable seating, reliable Wi-Fi and a diverse menu at Waterstone Village.",
    imageUrl: "https://picsum.photos/500/300?random=12",
    wifiSpeed: 42,
    vibes: ["Focus Factory", "Quiet Zen"],
    popularWith: ["Web Wizards", "Story Spinners"],
    categories: ["safe", "fresh"]
  },
  {
    id: 4,
    name: "Blue Waters Café, Beach Road",
    description: "Beachfront café with a relaxed atmosphere, good Wi-Fi, and inspiring ocean views.",
    imageUrl: "https://picsum.photos/500/300?random=13",
    wifiSpeed: 32,
    vibes: ["Beach Vibes", "Relaxed"],
    popularWith: ["Code Conjurers", "Data Druids"],
    categories: ["upcoming"]
  },
  {
    id: 5,
    name: "Seattle Coffee Co, Paardevlei",
    description: "Modern workspace with good networking opportunities and a variety of seating options.",
    imageUrl: "https://picsum.photos/500/300?random=14",
    wifiSpeed: 38,
    vibes: ["Creative Chaos", "Tech Haven"],
    popularWith: ["Web Wizards", "Pixel Pixies"],
    categories: ["surprise", "fresh"]
  },
  {
    id: 6,
    name: "Craft Burger Bar, Helderberg",
    description: "Not just burgers - they offer a surprisingly good workspace with excellent Wi-Fi and charging stations.",
    imageUrl: "https://picsum.photos/500/300?random=15",
    wifiSpeed: 45,
    vibes: ["Focus Factory", "Collaborative"],
    popularWith: ["Deal Drivers", "Buzz Beasts"],
    categories: ["surprise", "upcoming"]
  }
];

interface CategoryTab {
  id: string;
  label: string;
  description: string;
}

const categoryTabs: CategoryTab[] = [
  {
    id: "safe", 
    label: "Safe Options", 
    description: "Reliable workspaces with consistent Wi-Fi and great amenities"
  },
  {
    id: "surprise", 
    label: "Surprise Me", 
    description: "Unique spaces with unexpected perks and interesting vibes"
  },
  {
    id: "upcoming", 
    label: "Up and Coming", 
    description: "New locations gaining popularity in the community"
  },
  {
    id: "fresh", 
    label: "Fresh For Real", 
    description: "Recently reviewed locations with the latest updates"
  }
];

const RecommendationTabs = () => {
  const [activeTab, setActiveTab] = useState("safe");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<RecommendedShop | null>(null);

  const getShopsByCategory = (category: string) => {
    return recommendedShops.filter(shop => 
      shop.categories.includes(category as "safe" | "surprise" | "upcoming" | "fresh")
    ).slice(0, 3);
  };
  
  const openShopDetails = (shop: RecommendedShop) => {
    setSelectedShop(shop);
    setDetailsOpen(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-tech-blue/5 to-soft-cream/60 relative">
      <div className="container mx-auto px-4">
        <div className="absolute top-4 right-4">
          <SectionScrollButton targetId="home" position="top" />
        </div>
        <div className="text-center mb-14">
          <motion.span 
            className="inline-block px-4 py-1 bg-tech-blue/10 text-tech-blue rounded-full text-sm font-semibold mb-4"
            variants={fadeIn("up")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            CURATED SELECTION
          </motion.span>
          <motion.h2 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            variants={fadeIn("up")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            Find Your Perfect Workspace
          </motion.h2>
          <motion.p 
            className="text-lg max-w-2xl mx-auto text-gray-600"
            variants={fadeIn("up")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2 }}
          >
            Somerset West's best-rated coffee shops for remote work, tailored to your needs
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <Tabs defaultValue="safe" onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar for tabs on desktop */}
              <div className="md:w-1/4 bg-soft-cream/30">
                <TabsList className="flex flex-row md:flex-col h-auto md:h-full w-full rounded-none p-0">
                  {categoryTabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id}
                      value={tab.id}
                      className="flex-1 md:flex-none w-full rounded-none border-b md:border-b-0 md:border-r border-gray-200
                        py-4 px-4 data-[state=active]:bg-white data-[state=active]:text-tech-blue data-[state=active]:border-l-4 
                        md:data-[state=active]:border-l-tech-blue data-[state=active]:border-l-tech-blue
                        data-[state=active]:font-semibold justify-start text-left transition-all"
                    >
                      <div className="flex flex-col items-start">
                        <span>{tab.label}</span>
                        <span className="hidden md:block text-xs text-gray-500 mt-1 font-normal">
                          {getShopsByCategory(tab.id).length} locations
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Content area */}
              <div className="md:w-3/4 p-6 md:p-8">
                {categoryTabs.map(tab => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0 focus:outline-none">
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-coffee-brown">
                          {tab.label}
                        </h3>
                        <p className="text-gray-600 mt-1">{tab.description}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-2 text-tech-blue">
                        <button className="p-2 rounded-full hover:bg-tech-blue/10 transition-colors">
                          <i className="fas fa-sort-amount-down text-sm"></i>
                        </button>
                        <button className="p-2 rounded-full hover:bg-tech-blue/10 transition-colors">
                          <i className="fas fa-th-large text-sm"></i>
                        </button>
                        <button className="p-2 rounded-full hover:bg-tech-blue/10 transition-colors">
                          <i className="fas fa-list text-sm"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {getShopsByCategory(tab.id).map((shop) => (
                        <motion.div
                          key={shop.id}
                          variants={fadeIn("up")}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                        >
                          <div className="md:w-1/3 h-48 md:h-auto relative">
                            <img 
                              src={shop.imageUrl} 
                              alt={shop.name}
                              className="w-full h-full object-cover absolute inset-0"
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex flex-wrap justify-between items-start mb-2">
                              <h3 className="font-bold text-xl text-coffee-brown">{shop.name}</h3>
                              <div className="flex items-center bg-soft-cream px-3 py-1 rounded-full">
                                <i className="fas fa-wifi text-tech-blue mr-2"></i>
                                <span className="font-semibold">{shop.wifiSpeed} Mbps</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{shop.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {shop.vibes.map(vibe => (
                                <span key={vibe} className="bg-vibe-yellow/10 text-coffee-brown px-3 py-1 rounded-full text-sm">
                                  {vibe}
                                </span>
                              ))}
                              {shop.popularWith.map(tribe => (
                                <span key={tribe} className="bg-tech-blue/10 text-tech-blue px-3 py-1 rounded-full text-sm">
                                  {tribe}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center">
                                <div className="flex -space-x-2">
                                  <div className="w-8 h-8 rounded-full bg-tech-blue flex items-center justify-center text-white text-xs">
                                    <i className="fas fa-user"></i>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-vibe-yellow flex items-center justify-center text-coffee-brown text-xs">
                                    <i className="fas fa-user"></i>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-coffee-brown flex items-center justify-center text-white text-xs">
                                    <i className="fas fa-user"></i>
                                  </div>
                                </div>
                                <span className="ml-3 text-gray-500 text-sm">28 checked in today</span>
                              </div>
                              
                              <button 
                                className="text-tech-blue hover:bg-tech-blue/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                onClick={() => openShopDetails(shop)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="text-center mt-8">
                      <button className="inline-flex items-center justify-center gap-2 text-tech-blue hover:text-tech-blue/80 font-medium transition-colors">
                        See all workspaces
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      {selectedShop && (
        <CoffeeShopDetails
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          name={selectedShop.name}
          description={selectedShop.description}
          amenities={{
            wheelchairAccessible: true,
            parkingRating: 4,
            videoCallRating: 4,
            powerAvailability: 5,
            coffeeQuality: 4
          }}
          dominantTribe={selectedShop.popularWith[0] || "Code Conjurers"}
          location={{
            address: "123 Main Street",
            city: "Somerset West",
            country: "South Africa",
            coordinates: {
              lat: -34.0789,
              lng: 18.8429
            }
          }}
        />
      )}
    </section>
  );
};

export default RecommendationTabs;