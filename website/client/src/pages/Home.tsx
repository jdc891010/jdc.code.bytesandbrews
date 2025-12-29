import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import FeatureCard from "@/components/FeatureCard";
import HowItWorksStep from "@/components/HowItWorksStep";
import WifiSpeedBar from "@/components/WifiSpeedBar";
import TestimonialCard from "@/components/TestimonialCard";
import CoffeeShopCard from "@/components/CoffeeShopCard";
import VibeCheckForm from "@/components/VibeCheckFormNew";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SectionScrollButton from "@/components/SectionScrollButton";
import MerchWaitlistDialog from "@/components/MerchWaitlistDialog";
import ThankYouAnimation from "@/components/ThankYouAnimation";
import FeatureRoadmap from "@/components/FeatureRoadmap";
import CoffeeShopSpecials from "@/components/CoffeeShopSpecials";
import RecommendationTabs from "@/components/RecommendationTabs";
import ContactFormSimple from "@/components/ContactFormSimple";
import LeafletMapComponent from "@/components/LeafletMapComponent";
import SpeedTestAnimation from "@/components/SpeedTestAnimation";
import NotificationForm from "@/components/NotificationForm";
import { useSpeedTest } from "@/hooks/useSpeedTest";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCoffeeShops, getFeaturedSpots } from "@/services/coffeeShopApi";

const Home = () => {
  const [speedTestDialogOpen, setSpeedTestDialogOpen] = useState(false);
  const [selectedCoffeeShop, setSelectedCoffeeShop] = useState<string | null>(null);
  const [newCoffeeShopName, setNewCoffeeShopName] = useState<string>("");
  const [testingNewPlace, setTestingNewPlace] = useState(false);
  const { runTest, isRunning, progress, results, averageSpeed, error } = useSpeedTest();
  
  // Featured spots state
  const [featuredSpots, setFeaturedSpots] = useState<any[]>([]);
  const [featuredSpotsLoading, setFeaturedSpotsLoading] = useState(true);
  
  // WiFi test additional information
  const [wifiName, setWifiName] = useState("");
  const [testDevice, setTestDevice] = useState("");
  const [selectedArea, setSelectedArea] = useState("Somerset West");
  
  // Review dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewOccupation, setReviewOccupation] = useState('');
  const [reviewCoffeeType, setReviewCoffeeType] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  // Waitlist dialog state
  const [showJoinWaitlist, setShowJoinWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  
  // Fetch featured spots on component mount
  useEffect(() => {
    const fetchFeaturedSpots = async () => {
      try {
        const response = await getFeaturedSpots();
        if (response.success) {
          const activeSpots = response.featuredSpots.filter(spot => spot.isActive);
          setFeaturedSpots(activeSpots);
        }
      } catch (error) {
        console.error('Failed to fetch featured spots:', error);
      } finally {
        setFeaturedSpotsLoading(false);
      }
    };
    
    fetchFeaturedSpots();
  }, []);
  
  // Define extended coffee shop model with test statistics
  const [coffeeShops, setCoffeeShops] = useState<any[]>([]);
  const [isLoadingCoffeeShops, setIsLoadingCoffeeShops] = useState(true);

  // Fetch coffee shops from database
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setIsLoadingCoffeeShops(true);
        const response = await getCoffeeShops();
        if (response.success) {
          const formattedShops = response.coffeeShops.map(shop => {
            let parsedAmenities: any = {};
            try {
              if (shop.amenities) {
                parsedAmenities = JSON.parse(shop.amenities);
              }
            } catch (e) {
              console.error("Failed to parse amenities for shop:", shop.name, e);
            }

            return {
              name: shop.name,
              imageUrl: shop.imageUrl || "https://placehold.co/400x300/E8D4B2/6F4E37?text=Coffee+Shop",
              thumbnailUrl: shop.thumbnailUrl || shop.imageUrl,
              tribe: shop.tribe || "Code Conjurers",
              speed: shop.wifiSpeed || Math.floor(Math.random() * 40) + 15,
              p10: 10,
              p90: 50,
              confidence: 90,
              testCount: Math.floor(Math.random() * 10) + 2,
              wifiName: "Guest_WiFi",
              testDevice: "Unknown",
              area: shop.city || "Somerset West",
              vibe: shop.vibe || "Quiet Zen",
              updated: "Recently",
              lat: parseFloat(shop.latitude || "-34.0789"), 
              lng: parseFloat(shop.longitude || "18.8429"),
              description: shop.description || "A great place to work.",
              amenities: {
                wheelchairAccessible: parsedAmenities.wheelchairAccessible ?? true,
                parkingRating: parsedAmenities.parkingRating ?? (Math.floor(Math.random() * 2) + 3),
                videoCallRating: parsedAmenities.videoCallRating ?? (Math.floor(Math.random() * 3) + 2),
                powerAvailability: parsedAmenities.powerAvailability ?? (Math.floor(Math.random() * 3) + 2),
                coffeeQuality: parsedAmenities.coffeeQuality ?? (Math.floor(Math.random() * 2) + 3)
              }
            };
          });
          setCoffeeShops(formattedShops);
        }
      } catch (error) {
        console.error("Failed to fetch coffee shops:", error);
      } finally {
        setIsLoadingCoffeeShops(false);
      }
    };
    
    fetchShops();
  }, []);

  const refreshWifiSpeeds = () => {
    // Open the speed test dialog instead of immediately refreshing
    setSpeedTestDialogOpen(true);
  };
  
  // Thank you animation dialog state
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState("");
  
  const handleSpeedTestComplete = () => {
    // Update coffee shop speeds with the test results
    if (averageSpeed !== null) {
      if (testingNewPlace && newCoffeeShopName) {
        // Add the new coffee shop to the list with extended statistics
        const newShop = {
          name: newCoffeeShopName,
          imageUrl: "https://placehold.co/400x300/E8D4B2/6F4E37?text=New+Shop",
          tribe: "Digital Nomad",
          speed: averageSpeed,
          p10: Math.floor(averageSpeed * 0.8), // Estimate p10 as 80% of average
          p90: Math.floor(averageSpeed * 1.2), // Estimate p90 as 120% of average
          confidence: 80,
          testCount: results.length,
          wifiName: wifiName || "Unknown",
          testDevice: testDevice || "Not specified",
          area: "Somerset West", // Default to Somerset West
          vibe: "New Discovery",
          updated: "Just now",
          lat: -34.0789 + (Math.random() * 0.01 - 0.005), // Random location near Somerset West
          lng: 18.8429 + (Math.random() * 0.01 - 0.005),
          description: `A newly discovered workspace in Somerset West with a measured WiFi speed of ${averageSpeed} Mbps.`
        };
        
        setCoffeeShops(prevShops => [...prevShops, newShop]);
      } else if (selectedCoffeeShop) {
        // Update existing coffee shop with new statistics
        setCoffeeShops(prevShops => {
          return prevShops.map(shop => {
            if (shop.name === selectedCoffeeShop) {
              // Calculate new p10 and p90 based on existing and new results
              const newP10 = Math.floor((shop.p10 || (shop.speed * 0.8) + averageSpeed * 0.8) / 2);
              const newP90 = Math.floor((shop.p90 || (shop.speed * 1.2) + averageSpeed * 1.2) / 2);
              const newTestCount = (shop.testCount || 1) + 1;
              
              return {
                ...shop,
                speed: averageSpeed,
                p10: newP10,
                p90: newP90,
                testCount: newTestCount,
                confidence: Math.min(95, 75 + (newTestCount * 5)), // Increases with more tests
                wifiName: wifiName || shop.wifiName || "Unknown",
                testDevice: testDevice || shop.testDevice || "Not specified",
                updated: "Just now"
              };
            }
            return shop;
          });
        });
      }
    }
    
    // Reset speed test states
    setSpeedTestDialogOpen(false);
    setSelectedCoffeeShop(null);
    setNewCoffeeShopName("");
    setTestingNewPlace(false);
    setWifiName("");
    setTestDevice("");
    
    // Show thank you animation
    setThankYouMessage("Thanks for submitting your speed test! You're awesome!");
    setShowThankYouDialog(true);
    
    // Auto close thank you dialog after 3 seconds
    setTimeout(() => {
      setShowThankYouDialog(false);
    }, 3000);
  };
  
  const handleReviewSubmit = () => {
    // Here you would typically send the review data to your backend
    console.log('Review submitted:', {
      name: reviewName,
      email: reviewEmail,
      occupation: reviewOccupation,
      coffeeType: reviewCoffeeType,
      rating: reviewRating,
      comment: reviewComment
    });
    
    // Reset the form and close the dialog
    setReviewName('');
    setReviewEmail('');
    setReviewOccupation('');
    setReviewCoffeeType('');
    setReviewRating(5);
    setReviewComment('');
    setReviewDialogOpen(false);
    
    // Show thank you animation
    setThankYouMessage("Thanks for your review! Your feedback helps other remote workers!");
    setShowThankYouDialog(true);
    
    // Auto close thank you dialog after 3 seconds
    setTimeout(() => {
      setShowThankYouDialog(false);
    }, 3000);
  };
  
  // This function is no longer needed as the MerchWaitlistDialog component handles form submission internally
  // const handleWaitlistSubmit = () => {
  //   console.log('Waitlist email submitted:', waitlistEmail);
  //   setWaitlistEmail('');
  //   setShowJoinWaitlist(false);
    
  // Note: MerchWaitlistDialog now handles the thank you animation internally

  return (
    <>
      <Helmet>
        <title>Brews and Bytes - Sip, Surf, Succeed</title>
        <meta name="description" content="Find the best coffee shops for remote work and studying in Somerset West. Brews and Bytes helps you discover locations with great coffee, reliable Wi-Fi, and a productive atmosphere." />
      </Helmet>
      {/* Hero Section */}
      <section id="home" className="relative h-[70vh] flex items-center page-section">
        <div className="absolute inset-0 z-0">
          <img 
            src="/bytesbrews_hero.avif" 
            alt="Coffee shop atmosphere" 
            className="w-full h-full object-cover filter brightness-50" 
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1 
            className="font-pacifico text-4xl md:text-6xl text-cream-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Sip, Surf, Succeed
          </motion.h1>
          <motion.p 
            className="font-montserrat text-xl md:text-2xl text-cream-white mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Find coffee shops where brews power bytes and vibes spark brilliance
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="#coffee-shops">
              <Button className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 brand-btn">
                Discover Coffee Shops
              </Button>
            </a>
            <a href="#speed-test">
              <Button className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 brand-btn">
                Submit Speed Test
              </Button>
            </a>
            <a href="#features">
              <Button className="bg-coffee-brown hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 brand-btn">
                Explore Features
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Spotify Playlist Ribbon */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-4 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="flex items-center gap-4 mb-2 md:mb-0">
              <div className="bg-white/20 p-2 rounded-full">
                <i className="fab fa-spotify text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">🎵 Coffee Shop Vibes Playlist</h3>
                <p className="text-sm opacity-90">Perfect background music for your remote work sessions</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://open.spotify.com/playlist/67Qq5C4QdSDs76aWdb64ry?si=ULIHQNjmTIWugIoMgN5aEQ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-green-600 hover:bg-gray-100 font-bold py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2"
              >
                <i className="fab fa-spotify"></i>
                Listen Now
              </a>
              <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 border border-white/30">
                Add Your Favorites
              </button>
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-16 bg-soft-cream page-section relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4">
            <SectionScrollButton targetId="home" position="top" />
          </div>
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">Speed-Tested, Vibe-Approved</h2>
            <p className="text-lg max-w-2xl mx-auto">Find your perfect remote workspace with features designed for digital nomads and remote workers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<i className="fas fa-wifi text-tech-blue text-2xl"></i>}
              iconType="wifi"
              title="Speed Tests"
              description="Real-time Wi-Fi checks—because 40 Mbps beats 4 Mbps every time."
              colorClass="bg-tech-blue"
            />
            <FeatureCard 
              icon={<i className="fas fa-heart text-vibe-yellow text-2xl"></i>}
              iconType="coffee"
              title="Vibe Ratings"
              description="User-submitted vibes (e.g., 'Chatty Buzz,' 'Quiet Zen') for the perfect match."
              colorClass="bg-vibe-yellow"
            />
            <FeatureCard 
              icon={<i className="fas fa-users text-coffee-brown text-2xl"></i>}
              iconType="users"
              title="Creature Tribes"
              description="Connect with like-minded 'Code Conjurers,' 'Word Weavers,' and more!"
              colorClass="bg-coffee-brown"
            />
            <FeatureCard 
              icon={<i className="fas fa-map-marker-alt text-tech-blue text-2xl"></i>}
              iconType="map"
              title="Coffee Shop Finder"
              description="Find your perfect spot with our interactive map of Somerset West coffee shops."
              colorClass="bg-tech-blue"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white page-section relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4">
            <SectionScrollButton targetId="home" position="top" />
          </div>
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">How It Works</h2>
            <p className="text-lg max-w-2xl mx-auto">Three simple steps to finding your perfect workspace companion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep 
              number={1}
              title="Select your hangout"
              description="Browse coffee shops in Somerset West and find potential spots to work from."
            />
            <HowItWorksStep 
              number={2}
              title="Submit Vibe Checks"
              description="Rate Wi-Fi speeds and workspace features at coffee shops you visit."
            />
            <HowItWorksStep 
              number={3}
              title="Find perfect spots"
              description="Discover workspaces that match your needs using our crowdsourced data."
              isLast={true}
            />
          </div>
          
          <div className="text-center mt-12">
            <a href="#speed-test">
              <Button className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 brand-btn mx-2">
                Run Speed Test
              </Button>
            </a>
            <a href="#coffee-shops">
              <Button 
                onClick={() => {
                  // First scroll to the coffee shops section
                  document.getElementById('coffee-shops')?.scrollIntoView({ behavior: 'smooth' });
                  // After a short delay, find the "Add Vibe Check" button and click it
                  setTimeout(() => {
                    const vibeCheckButtons = document.querySelectorAll('.brand-btn');
                    // Convert NodeList to Array before using for...of
                    Array.from(vibeCheckButtons).forEach(btn => {
                      if (btn.textContent?.includes('Add Vibe Check')) {
                        (btn as HTMLElement).click();
                        return; // Early return instead of break
                      }
                    });
                  }, 1000);
                }} 
                className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-6 rounded-lg transition-all duration-300 brand-btn mx-2"
              >
                Submit Vibe Check
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Coffee Shop Showcase */}
      <section id="coffee-shops" className="py-16 bg-soft-cream page-section relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4">
            <SectionScrollButton targetId="home" position="top" />
          </div>
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">Featured Coffee Shops</h2>
            <p className="text-lg max-w-2xl mx-auto">Popular coffee shops perfect for remote work</p>
          </div>

          {/* Coffee Shop Map */}
          <div className="max-w-6xl mx-auto mb-10 bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="h-64 md:h-96 relative z-0">
              <LeafletMapComponent 
                locations={coffeeShops.map(shop => ({
                  name: shop.name,
                  lat: shop.lat,
                  lng: shop.lng,
                  description: shop.description,
                  wifiSpeed: shop.speed,
                  imageUrl: shop.imageUrl
                }))} 
                center={{ lat: -34.0789, lng: 18.8429 }} // Center of Somerset West
                zoom={13}
              />
            </div>
          </div>

          {/* Featured Coffee Shops */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoadingCoffeeShops ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-brown"></div>
                <p className="mt-4 text-gray-500">Loading coffee shops...</p>
              </div>
            ) : coffeeShops.length > 0 ? (
              coffeeShops.map((shop, index) => (
                <CoffeeShopCard
                  key={index}
                  name={shop.name}
                  wifiSpeed={shop.speed}
                  description={shop.description}
                  vibes={[shop.vibe, "Productive"]}
                  popularWith={[shop.tribe]}
                  imageUrl={shop.thumbnailUrl || shop.imageUrl}
                  amenities={shop.amenities}
                  isFeatured={featuredSpots.some(spot => spot.placeName === shop.name)}
                  featuredDescription={featuredSpots.find(spot => spot.placeName === shop.name)?.description}
                  priceLevel={shop.priceLevel}
                  userRatingCount={shop.userRatingCount}
                  businessStatus={shop.businessStatus}
                  googleMapsUri={shop.googleMapsUri}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No coffee shops found.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <VibeCheckForm />
          </div>
        </div>
      </section>
      
      {/* Wi-Fi Speed Demo */}
      <section id="speed-test" className="py-16 bg-tech-blue bg-opacity-5 page-section relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4">
            <SectionScrollButton targetId="home" position="top" />
          </div>
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">Brews Up, Lag Down</h2>
            <p className="text-lg max-w-2xl mx-auto">Compare real-time Wi-Fi speeds at local coffee shops</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Area filter selector */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Area
                </label>
                <div className="relative">
                  <select
                    id="area-filter"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={true} // Currently locked to Somerset West
                  >
                    <option value="Somerset West">Somerset West</option>
                    <option value="Stellenbosch" disabled>Stellenbosch (Coming Soon)</option>
                    <option value="Cape Town" disabled>Cape Town (Coming Soon)</option>
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">Locked</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <i className="fas fa-info-circle mr-2 text-tech-blue"></i>
                <span>Showing {coffeeShops.length} places in Somerset West</span>
              </div>
            </div>
            
            {/* WiFi speed bars in scrollable container */}
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1 mb-4">
              {coffeeShops.map((shop, index) => (
                <WifiSpeedBar 
                  key={shop.name} 
                  coffeeShop={shop}
                  animate={shop.speed === 0}
                  showDetails={index === 0} // Show details for the first item by default
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button 
                onClick={refreshWifiSpeeds}
                className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn"
              >
                <i className="fas fa-sync-alt mr-2"></i> Submit New Speed Test
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-coffee-brown text-white page-section relative">
        <div className="container mx-auto px-4">
          <div className="absolute top-4 right-4">
            <SectionScrollButton targetId="home" position="top" />
          </div>
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">What Remote Workers Say</h2>
            <p className="text-lg max-w-2xl mx-auto opacity-80">Remote workers who found their perfect spot</p>
          </div>

          <div className="testimonial-slider max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah K."
                tribe="Word Weaver"
                quote="As a copywriter, finding the perfect vibe is essential. Bootlegger in Somerset West has become my go-to workspace!"
                imageUrl="https://placehold.co/100x100/E8D4B2/6F4E37?text=SK"
              />
              <TestimonialCard
                name="Johan V."
                tribe="Code Conjurer"
                quote="Slug & Lettuce at Waterstone has the perfect background noise level and Wi-Fi speeds for development work."
                imageUrl="https://placehold.co/100x100/E8D4B2/6F4E37?text=JV"
              />
              <TestimonialCard
                name="Priya M."
                tribe="Pixel Pixie"
                quote="Nom Nom at Somerset Mall has the creative atmosphere I need for design work, plus their pastries are amazing!"
                imageUrl="https://placehold.co/100x100/E8D4B2/6F4E37?text=PM"
              />
            </div>
            
            <div className="text-center mt-10">
              <Button 
                onClick={() => setReviewDialogOpen(true)}
                className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-6 rounded-lg transition-all duration-300 brand-btn"
              >
                Submit Your Review
              </Button>
            </div>
          </div>

          {/* We already have a review button above, so this section is removed */}
        </div>
      </section>

      {/* Recommendation Tabs Section */}
      <RecommendationTabs />

      {/* Coffee Shop Specials Section */}
      <CoffeeShopSpecials />

      {/* Feature Roadmap Section */}
      <FeatureRoadmap />

      {/* Speed Test Dialog */}
      <Dialog open={speedTestDialogOpen} onOpenChange={setSpeedTestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Wi-Fi Speed Test</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {!selectedCoffeeShop && !testingNewPlace && !isRunning && (
              <div className="space-y-6">
                <div>
                  <p className="text-center font-medium mb-4">Previously tested places</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {coffeeShops.map(shop => (
                      <button
                        key={shop.name}
                        className={`w-full py-3 px-4 flex justify-between items-center rounded-lg border ${
                          selectedCoffeeShop === shop.name
                            ? 'bg-tech-blue/10 border-tech-blue'
                            : 'hover:bg-tech-blue/5 border-gray-200'
                        }`}
                        onClick={() => setSelectedCoffeeShop(shop.name)}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={shop.imageUrl} 
                              alt={shop.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{shop.name}</p>
                            <p className="text-sm text-gray-500">{shop.vibe}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-tech-blue font-medium mr-2">{shop.speed} Mbps</span>
                          <i className="fas fa-wifi text-tech-blue"></i>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Or add a new workspace</p>
                  <Button 
                    onClick={() => setTestingNewPlace(true)}
                    className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn"
                  >
                    Test New Workspace
                  </Button>
                </div>
              </div>
            )}
            
            {testingNewPlace && !isRunning && !averageSpeed && (
              <div className="space-y-4">
                <p className="text-center">Enter details for the new workspace</p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Workspace Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="workspace-name"
                      type="text"
                      value={newCoffeeShopName}
                      onChange={(e) => setNewCoffeeShopName(e.target.value)}
                      placeholder="Cafe name (e.g., Cafe Lekker, Somerset West)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="wifi-name" className="block text-sm font-medium text-gray-700 mb-1">
                      WiFi Network Name <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="wifi-name"
                      type="text"
                      value={wifiName}
                      onChange={(e) => setWifiName(e.target.value)}
                      placeholder="e.g. CafeName_Guest"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="test-device" className="block text-sm font-medium text-gray-700 mb-1">
                      Device Used <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="test-device"
                      type="text"
                      value={testDevice}
                      onChange={(e) => setTestDevice(e.target.value)}
                      placeholder="e.g. MacBook Pro, iPhone 13, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setTestingNewPlace(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={runTest}
                      disabled={!newCoffeeShopName.trim()}
                      className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn flex-1"
                    >
                      Start Test
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {selectedCoffeeShop && !isRunning && !averageSpeed && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p>Ready to test Wi-Fi speed at <span className="font-semibold">{selectedCoffeeShop}</span>?</p>
                  <p className="text-sm text-gray-500">This will run a quick speed test on your current connection.</p>
                </div>
                
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div>
                    <label htmlFor="wifi-name-existing" className="block text-sm font-medium text-gray-700 mb-1">
                      WiFi Network Name <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="wifi-name-existing"
                      type="text"
                      value={wifiName}
                      onChange={(e) => setWifiName(e.target.value)}
                      placeholder="e.g. CafeName_Guest"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="test-device-existing" className="block text-sm font-medium text-gray-700 mb-1">
                      Device Used <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="test-device-existing"
                      type="text"
                      value={testDevice}
                      onChange={(e) => setTestDevice(e.target.value)}
                      placeholder="e.g. MacBook Pro, iPhone 13, etc."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCoffeeShop(null)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={runTest}
                    className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn flex-1"
                  >
                    Start Test
                  </Button>
                </div>
              </div>
            )}
            
            {isRunning && (
              <div className="space-y-6">
                <SpeedTestAnimation isActive={isRunning} />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Testing download speed...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <p className="text-center text-sm text-gray-500">Please don't close this window during the test</p>
              </div>
            )}
            
            {!isRunning && averageSpeed && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-tech-blue/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-tech-blue">{averageSpeed}</div>
                    <div className="text-xs">Mbps</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2">Results</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {results.map((result, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>Test {i + 1}:</span>
                          <span className="font-medium">{result.downloadSpeed} {result.unit}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Average:</span>
                        <span>{averageSpeed} Mbps</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    onClick={handleSpeedTestComplete}
                    className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn"
                  >
                    Submit Results
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <DialogFooter className="sm:justify-center">
            {!isRunning && !averageSpeed && (
              <Button
                variant="outline"
                onClick={() => setSpeedTestDialogOpen(false)}
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merchandise Section */}
      <section id="merchandise" className="py-16 bg-tech-blue bg-opacity-5 page-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">Brews & Bytes Merch</h2>
            <p className="text-lg max-w-2xl mx-auto">Show off your remote worker style with our quirky coffee and tech-themed gear</p>
          </div>
          
          {/* Carousel of t-shirts with navigation arrows */}
          <div className="relative max-w-5xl mx-auto mb-12 overflow-hidden">
            {/* Left navigation arrow */}
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-coffee-brown text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => {
                const container = document.querySelector('.merch-carousel');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {/* Right navigation arrow */}
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-coffee-brown text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => {
                const container = document.querySelector('.merch-carousel');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            
            <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory modern-horizontal-scroll px-4 merch-carousel">
              {/* T-Shirt 1 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/i_dont_byte_tee.svg"
                    alt="I Don't Byte Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">I Don't Byte Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">Premium black t-shirt for the developer with a sense of humor.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>

              {/* T-Shirt 2 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/cool_down_for_a_bit_tee.svg"
                    alt="Cool Down For a BIT Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Cool Down For a BIT Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">For those who take their coffee & coding with patience.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* T-Shirt 3 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/u_int_cooler_tee.svg"
                    alt="U-INT Cooler Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">U-INT Cooler Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">When your variable types are as cool as your coffee.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>

              {/* T-Shirt 4 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/my_brew_my_python_tee.svg"
                    alt="My Brew, My Python Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">My Brew, My Python Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">When you're as passionate about coffee as your code.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* T-Shirt 5 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/will_code_for_wifi_tee.svg"
                    alt="Will Code For WiFi Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Will Code For WiFi Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">The essential uniform for remote work warriors everywhere.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>

              {/* T-Shirt 6 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/no_brew_400_tee.svg"
                    alt="No Brew == 400 Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">No Brew == 400 Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">For when the coffee is as essential as the code.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* T-Shirt 7 */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 shrink-0 w-full max-w-xs snap-center">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <img
                    src="/merch/status_418_tee.svg"
                    alt="Status 418 Tee"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Status 418 Tee</h3>
                  <p className="text-sm text-gray-600 mb-3">For the developer who appreciates HTTP humor.</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-vibe-yellow">Coming Soon</span>
                    <Button onClick={() => setShowJoinWaitlist(true)} className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown text-sm py-1 px-3 rounded-lg">
                      Join Waitlist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            

          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">All merchandise will be available for purchase soon. Join our waiting list to be notified!</p>
            <Button 
              onClick={() => setShowJoinWaitlist(true)}
              className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 brand-btn"
            >
              Join Merch Waitlist
            </Button>
          </div>
        </div>
      </section>

      {/* Community Notifications Section */}
      <section id="community-notifications" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 page-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">
              Community Notifications
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-700">
              Share important updates with the coffee community. Report WiFi issues, special offers, or other relevant information.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <NotificationForm 
              onSubmit={(data) => {
                console.log('Notification submitted:', data);
                // Handle successful submission
              }}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-soft-cream page-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">Get In Touch</h2>
            <p className="text-lg max-w-2xl mx-auto">Have a question or suggestion? We'd love to hear from you!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-tech-blue bg-opacity-5 rounded-xl p-6 md:p-8">
              <h3 className="font-bold text-xl text-coffee-brown mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-envelope text-tech-blue mr-3 text-xl w-8"></i>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">hello@brewsandbytes.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-tech-blue mr-3 text-xl w-8"></i>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">Somerset West, South Africa</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-comments text-tech-blue mr-3 text-xl w-8"></i>
                  <div>
                    <p className="font-medium">Social Media</p>
                    <div className="flex mt-2 space-x-4">
                      <a href="#" className="text-tech-blue hover:text-opacity-80 transition-colors">
                        <i className="fab fa-twitter text-xl"></i>
                      </a>
                      <a href="#" className="text-tech-blue hover:text-opacity-80 transition-colors">
                        <i className="fab fa-instagram text-xl"></i>
                      </a>
                      <a href="#" className="text-tech-blue hover:text-opacity-80 transition-colors">
                        <i className="fab fa-linkedin-in text-xl"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">For Coffee Shop Owners</h3>
                <p className="text-gray-600 mb-4">Own a coffee shop and want to be featured on Brews and Bytes? We'd love to partner with you!</p>
                <a href="/contact">
                  <Button className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-2 px-4 rounded-lg transition-all duration-300">
                    Partner With Us
                  </Button>
                </a>
              </div>
            </div>
            
            <ContactFormSimple />
          </div>
        </div>
      </section>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Share Your Feedback</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-5">
            <p className="text-center text-sm text-gray-600">
              Tell us about your experience with Brews & Bytes and how it has helped you find great workspaces
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="occupation" className="block text-sm font-medium">
                    Your Occupation/Tribe
                  </label>
                  <select
                    id="occupation"
                    value={reviewOccupation}
                    onChange={(e) => setReviewOccupation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                  >
                    <option value="">Select your tribe</option>
                    <option value="Code Conjurer">Code Conjurer</option>
                    <option value="Word Weaver">Word Weaver</option>
                    <option value="Pixel Pixie">Pixel Pixie</option>
                    <option value="Data Wizard">Data Wizard</option>
                    <option value="Buzz Beast">Buzz Beast</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="coffeeType" className="block text-sm font-medium">
                    Favorite Coffee Type
                  </label>
                  <select
                    id="coffeeType"
                    value={reviewCoffeeType}
                    onChange={(e) => setReviewCoffeeType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                  >
                    <option value="">Select coffee type</option>
                    <option value="Espresso">Espresso</option>
                    <option value="Cappuccino">Cappuccino</option>
                    <option value="Latte">Latte</option>
                    <option value="Americano">Americano</option>
                    <option value="Mocha">Mocha</option>
                    <option value="Flat White">Flat White</option>
                    <option value="Filter Coffee">Filter Coffee</option>
                    <option value="Tea">I prefer tea!</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="rating" className="block text-sm font-medium">
                  How would you rate your experience with Brews & Bytes? (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl ${
                        star <= reviewRating ? 'text-vibe-yellow' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {reviewRating === 1 && "Needs improvement"}
                    {reviewRating === 2 && "Okay"}
                    {reviewRating === 3 && "Good"}
                    {reviewRating === 4 && "Great"}
                    {reviewRating === 5 && "Excellent!"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us how Brews & Bytes has helped you find great workspaces..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between flex-col sm:flex-row space-y-2 sm:space-y-0">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={!reviewName || !reviewOccupation || !reviewComment}
              className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn"
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Thank you animation */}
      <ThankYouAnimation 
        open={showThankYouDialog}
        message={thankYouMessage}
        onClose={() => setShowThankYouDialog(false)}
      />
      
      {/* Merch waitlist dialog */}
      <MerchWaitlistDialog 
        open={showJoinWaitlist}
        onOpenChange={setShowJoinWaitlist}
      />
      
      {/* Global scroll to top button */}
      <ScrollToTopButton />
    </>
  );
};

export default Home;
