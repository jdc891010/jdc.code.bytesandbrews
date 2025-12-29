import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WifiSpeedBar from "@/components/WifiSpeedBar";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import LeafletMapComponent from "@/components/LeafletMapComponent";
import { getCoffeeShopsWithCache } from "@/services/coffeeShopApi";

const Features = () => {
  const [mapLocations, setMapLocations] = useState<any[]>([]);
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getCoffeeShopsWithCache();
        if (response.success) {
          const locations = response.coffeeShops.map(shop => ({
            name: shop.name,
            lat: parseFloat(shop.latitude || "-34.0789"),
            lng: parseFloat(shop.longitude || "18.8429"),
            description: shop.description || "A great place to work.",
            wifiSpeed: shop.wifiSpeed || Math.floor(Math.random() * 40) + 15,
            imageUrl: shop.imageUrl || "https://placehold.co/400x300/E8D4B2/6F4E37?text=Coffee+Shop",
            onViewDetails: () => console.log(`View details for ${shop.name}`)
          }));
          setMapLocations(locations);
        }
      } catch (error) {
        console.error("Failed to fetch shops for map:", error);
      } finally {
        setLoadingMap(false);
      }
    };
    
    fetchShops();
  }, []);

  const [wifiShops] = useState([
    {
      name: "Coffee Culture",
      imageUrl: "https://picsum.photos/400/300?random=30",
      tribe: "Code Conjurers",
      speed: 45,
      vibe: "Focus Factory",
      updated: "2 hours ago"
    },
    {
      name: "Brew Haven",
      imageUrl: "https://picsum.photos/400/300?random=31",
      tribe: "Word Weavers",
      speed: 32,
      vibe: "Quiet Zen",
      updated: "Yesterday"
    }
  ]);

  const vibeCategories = [
    { name: "Quiet Zen", description: "Peaceful atmosphere, minimal noise, perfect for focused work" },
    { name: "Chatty Buzz", description: "Lively environment with conversation, good for creative thinking" },
    { name: "Creative Chaos", description: "Energetic space with lots of activity, inspirational setting" },
    { name: "Focus Factory", description: "Designed for productivity with minimal distractions" }
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Brews and Bytes Features - Find Your Perfect Workspace</title>
        <meta name="description" content="Explore the features of Brews and Bytes, including real-time Wi-Fi speed tests, vibe ratings, creature tribes, and an interactive map of coffee shops." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-16 bg-tech-blue bg-opacity-5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              className="font-bold text-4xl text-coffee-brown mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Where Coffee Meets Code
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover the powerful features of Brews and Bytes that help remote workers find their ideal workspace
            </motion.p>
          </div>
        </div>
      </section>

      {/* Feature Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="wifi" className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <TabsList className="mb-8">
                <TabsTrigger value="wifi" className="text-lg px-6">Wi-Fi Speed Tests</TabsTrigger>
                <TabsTrigger value="vibes" className="text-lg px-6">Vibe Ratings</TabsTrigger>
                <TabsTrigger value="tribes" className="text-lg px-6">Creature Tribes</TabsTrigger>
                <TabsTrigger value="maps" className="text-lg px-6">Map Integration</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="wifi" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-bold text-3xl text-coffee-brown mb-4">Real-time Wi-Fi Checks</h2>
                  <p className="mb-4">Never get stuck with slow internet again. Our users regularly submit speed test results so you can find cafés that can handle your video calls, uploads, and downloads.</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Crowdsourced speed test data from multiple users</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Filter coffee shops by minimum speed requirements</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>View historical speed data to spot consistency</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Submit your own speed tests to help the community</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 italic">Because 40 Mbps beats 4 Mbps every time.</p>
                </div>
                <div className="bg-soft-cream p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-4">Speed Demo</h3>
                  <div className="space-y-6">
                    {wifiShops.map((shop, index) => (
                      <WifiSpeedBar key={index} coffeeShop={shop} />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vibes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-bold text-3xl text-coffee-brown mb-4">Find Your Perfect Vibe</h2>
                  <p className="mb-4">Different work requires different environments. Our vibe rating system helps you find the perfect atmosphere for your workflow.</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>User-categorized atmosphere ratings</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Filter by your preferred working environment</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Time-based vibe data (morning vs. afternoon)</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Add your own vibe assessments</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 italic">Because sometimes you need buzz, and sometimes you need zen.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vibeCategories.map((vibe, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-pacifico text-lg text-coffee-brown mb-2">{vibe.name}</h3>
                      <p className="text-sm">{vibe.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tribes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-bold text-3xl text-coffee-brown mb-4">Connect With Your Tribe</h2>
                  <p className="mb-4">Find like-minded professionals and see where they like to work. Our creature tribes help you connect with others in your field.</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Join a tribe based on your profession</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>See which coffee shops are popular with your tribe</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Connect with other professionals in your area</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Share tips and resources with your tribe</span>
                    </li>
                  </ul>
                  <Link href="/tribes">
                    <Button className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-2 px-4 rounded-lg transition-all duration-300 brand-btn">
                      Explore Creature Tribes
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-lg flex flex-col items-center shadow-md border border-tech-blue/20 hover:shadow-lg transition-shadow h-[160px]">
                    <div className="h-24 w-24 relative overflow-hidden tribe-icon-container bg-tech-blue/5 rounded-full p-1">
                      <img src="/icons/tribes/code-conjurer.svg" alt="Code Conjurer" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-tech-blue opacity-0 transition-opacity hover:opacity-10 rounded-full"></div>
                    </div>
                    <h3 className="font-pacifico text-lg text-tech-blue mt-2">Code Conjurer</h3>
                    <p className="text-sm text-center text-gray-700">Software Developers</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg flex flex-col items-center shadow-md border border-vibe-yellow/20 hover:shadow-lg transition-shadow h-[160px]">
                    <div className="h-24 w-24 relative overflow-hidden tribe-icon-container bg-vibe-yellow/5 rounded-full p-1">
                      <img src="/icons/tribes/pixel-pixie.svg" alt="Pixel Pixie" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-vibe-yellow opacity-0 transition-opacity hover:opacity-10 rounded-full"></div>
                    </div>
                    <h3 className="font-pacifico text-lg text-vibe-yellow mt-2">Pixel Pixie</h3>
                    <p className="text-sm text-center text-gray-700">Graphic Designers</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg flex flex-col items-center shadow-md border border-coffee-brown/20 hover:shadow-lg transition-shadow h-[160px]">
                    <div className="h-24 w-24 relative overflow-hidden tribe-icon-container bg-coffee-brown/5 rounded-full p-1">
                      <img src="/icons/tribes/word-weaver.svg" alt="Word Weaver" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-coffee-brown opacity-0 transition-opacity hover:opacity-10 rounded-full"></div>
                    </div>
                    <h3 className="font-pacifico text-lg text-coffee-brown mt-2">Word Weaver</h3>
                    <p className="text-sm text-center text-gray-700">Copywriters</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg flex flex-col items-center shadow-md border border-tech-blue/20 hover:shadow-lg transition-shadow h-[160px]">
                    <div className="h-24 w-24 relative overflow-hidden tribe-icon-container bg-tech-blue/5 rounded-full p-1">
                      <img src="/icons/tribes/buzz-beast.svg" alt="Buzz Beast" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-tech-blue opacity-0 transition-opacity hover:opacity-10 rounded-full"></div>
                    </div>
                    <h3 className="font-pacifico text-lg text-tech-blue mt-2">Buzz Beast</h3>
                    <p className="text-sm text-center text-gray-700">Digital Marketers</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maps" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 h-[400px] w-full rounded-lg overflow-hidden shadow-md">
                  <LeafletMapComponent 
                    locations={mapLocations}
                    center={{ lat: -34.0722, lng: 18.8439 }} // Somerset West
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="font-bold text-3xl text-coffee-brown mb-4">Interactive Map</h2>
                  <p className="mb-4">Find coffee shops near you with our interactive map. Filter by speed, vibe, or amenities to find your perfect workspace.</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>See real-time Wi-Fi speeds on the map</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Filter by amenities like power outlets and parking</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>Get directions to your chosen workspace</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-tech-blue mt-1 mr-2"></i>
                      <span>View popular times and busy hours</span>
                    </li>
                  </ul>
                  <Button className="bg-tech-blue hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                    Open Full Map
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Detailed Coffee Shop Information</h2>
            <p className="text-lg max-w-2xl mx-auto">Discover the perfect workspace for your remote work needs in Somerset West</p>
          </div>
          
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-tech-blue/10 to-vibe-yellow/10 rounded-xl shadow-lg p-8 border border-tech-blue/20">
            
            {/* Place Card Example */}
            <div className="mt-8 mb-8">
              <h3 className="text-2xl font-bold text-coffee-brown text-center mb-6">Coffee Shop Card Breakdown</h3>
              <p className="text-center max-w-3xl mx-auto mb-8">Every detail on our coffee shop cards is designed to help you make the best decision for your work needs</p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Example card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md hover:shadow-xl transition-all duration-300">
                  {/* Header with close button */}
                  <div className="relative p-4 bg-soft-cream border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-vibe-yellow text-xl">🍺</span>
                        <h3 className="text-xl font-bold text-coffee-brown">Bootlegger, Somerset West</h3>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">A sleek, modern coffee shop on Bright Street with perfect lighting for laptop work and plenty of outlets.</p>
                  </div>
                  
                  {/* Location info */}
                  <div className="p-4 border-b">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-gray-500 mt-1"><i className="fas fa-map-marker-alt"></i></div>
                      <div>
                        <p className="font-medium">123 Bright Street</p>
                        <p className="text-gray-500 text-sm">Somerset West, South Africa</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gray-500"><i className="fas fa-phone"></i></div>
                      <p className="text-gray-700">+27 21 555 6789</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gray-500"><i className="fas fa-globe"></i></div>
                      <a href="#" className="text-tech-blue hover:underline">www.example.com</a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-gray-500"><i className="fas fa-envelope"></i></div>
                      <a href="#" className="text-tech-blue hover:underline">info@example.com</a>
                    </div>
                  </div>
                  
                  {/* Direction buttons */}
                  <div className="grid grid-cols-4 border-b">
                    <a href="#" className="flex flex-col items-center justify-center p-3 text-xs text-tech-blue hover:bg-tech-blue/10 transition-colors">
                      <i className="fas fa-map mb-1"></i>
                      <span>Google Maps</span>
                    </a>
                    <a href="#" className="flex flex-col items-center justify-center p-3 text-xs text-tech-blue hover:bg-tech-blue/10 transition-colors">
                      <i className="fab fa-apple mb-1"></i>
                      <span>Apple Maps</span>
                    </a>
                    <a href="#" className="flex flex-col items-center justify-center p-3 text-xs text-tech-blue hover:bg-tech-blue/10 transition-colors">
                      <i className="fas fa-location-arrow mb-1"></i>
                      <span>Waze</span>
                    </a>
                    <a href="#" className="flex flex-col items-center justify-center p-3 text-xs bg-black text-white">
                      <i className="fas fa-car mb-1"></i>
                      <span>Uber</span>
                    </a>
                  </div>
                  
                  {/* Usage Heatmap */}
                  <div className="p-4 border-b">
                    <h4 className="font-bold text-vibe-yellow mb-3 flex items-center">
                      <i className="fas fa-fire-flame-curved mr-2"></i>
                      Usage Heatmap
                    </h4>
                    
                    <div className="mb-3">
                      <div className="flex border-b mb-2">
                        <button className="px-3 py-2 text-sm font-medium border-b-2 border-tech-blue text-tech-blue">Internet Speeds</button>
                        <button className="px-3 py-2 text-sm font-medium text-gray-500">Parking Availability</button>
                        <button className="px-3 py-2 text-sm font-medium text-gray-500">Noise Levels</button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="p-1"></th>
                              <th className="p-1 text-center">7:00</th>
                              <th className="p-1 text-center">8:00</th>
                              <th className="p-1 text-center">9:00</th>
                              <th className="p-1 text-center">10:00</th>
                              <th className="p-1 text-center">11:00</th>
                              <th className="p-1 text-center">12:00</th>
                              <th className="p-1 text-center">13:00</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-gray-50">
                              <td className="p-1 font-medium">Monday</td>
                              <td className="p-1 bg-green-500"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-orange-400"></td>
                              <td className="p-1 bg-orange-400"></td>
                              <td className="p-1 bg-green-500"></td>
                              <td className="p-1 bg-green-500"></td>
                            </tr>
                            <tr>
                              <td className="p-1 font-medium">Tuesday</td>
                              <td className="p-1 bg-green-500"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-orange-400"></td>
                              <td className="p-1 bg-green-500"></td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="p-1 font-medium">Wednesday</td>
                              <td className="p-1 bg-green-500"></td>
                              <td className="p-1 bg-green-500"></td>
                              <td className="p-1 bg-green-500"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-orange-400"></td>
                              <td className="p-1 bg-yellow-400"></td>
                              <td className="p-1 bg-green-500"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-1 mt-3 text-xs">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                          <span>Excellent</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-lime-500 mr-1 rounded-sm"></div>
                          <span>Great</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-400 mr-1 rounded-sm"></div>
                          <span>Good</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-400 mr-1 rounded-sm"></div>
                          <span>Fair</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
                          <span>Poor</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tribe and recommendations */}
                  <div className="p-4 border-b">
                    <h4 className="font-bold text-vibe-yellow mb-3 flex items-center">
                      <i className="fas fa-users mr-2"></i>
                      Most Common Tribe: Code Conjurers
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="text-green-700 font-medium mb-1 text-sm">Dos:</h5>
                        <ul className="list-disc pl-4 text-xs space-y-1">
                          <li>Come early (before 9am) to snag the prime window-facing tables</li>
                          <li>Try their 'Byte Booster' specialty coffee - a house favorite</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h5 className="text-red-700 font-medium mb-1 text-sm">Don'ts:</h5>
                        <ul className="list-disc pl-4 text-xs space-y-1">
                          <li>Don't hog the large tables if you're working solo during busy hours</li>
                          <li>Be aware that noon to 2pm gets LOUD with the lunch crowd</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Composite Score */}
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-tech-blue">Composite Score</h4>
                        <p className="text-xs text-gray-500 mt-1">Based on 42 community ratings</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-tech-blue">4.2</div>
                        <div className="flex text-yellow-400 text-xs">
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star-half-alt"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card explanation */}
                <div className="max-w-md space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-tech-blue mb-2"><i className="fas fa-star mr-2"></i>Detailed Coffee Shop Information</h4>
                    <p className="text-sm">Get comprehensive information about each location including contact details, precise address, and easy access to multiple navigation options.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-green-600 mb-2"><i className="fas fa-calendar-alt mr-2"></i>Day & Time Heatmap</h4>
                    <p className="text-sm">See the best and worst times to visit based on WiFi speed, noise levels, and parking availability data collected from community members.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-vibe-yellow mb-2"><i className="fas fa-users mr-2"></i>Creature Tribe Insights</h4>
                    <p className="text-sm">Identify which work personality types frequent each location, with specific recommendations for making the most of your visit based on real experiences.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h4 className="font-bold text-coffee-brown mb-2"><i className="fas fa-chart-simple mr-2"></i>Composite Rating System</h4>
                    <p className="text-sm">Our algorithm combines WiFi performance, amenities, atmosphere, and tribe compatibility to generate an overall score for each location.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/">
                <Button className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 brand-btn">
                  Explore Somerset West Coffee Shops
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
