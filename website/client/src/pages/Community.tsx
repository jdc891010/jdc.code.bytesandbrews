import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoffeeShopCard from "@/components/CoffeeShopCard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Community = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Apps for Digital Nomads",
      excerpt: "Our top picks for productivity, organization, and finding the best workspaces around the world.",
      image: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Blog+Post",
      author: "Emma Rodriguez",
      authorImage: "https://placehold.co/100x100/E8D4B2/6F4E37?text=ER",
      date: "May 15, 2023",
      category: "productivity",
      featured: true
    },
    {
      id: 2,
      title: "How to Negotiate Free Wi-Fi Upgrades at Coffee Shops",
      excerpt: "The art of asking for better internet without being 'that customer' everyone dreads.",
      image: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Blog+Post",
      author: "Alex Thompson",
      authorImage: "https://placehold.co/100x100/E8D4B2/6F4E37?text=AT",
      date: "June 2, 2023",
      category: "tips"
    },
    {
      id: 3,
      title: "Coffee Shop Owner Spotlight: Bean There",
      excerpt: "How one small coffee shop became the favorite workspace for creative professionals.",
      image: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Blog+Post",
      author: "Maya Johnson",
      authorImage: "https://placehold.co/100x100/E8D4B2/6F4E37?text=MJ",
      date: "June 18, 2023",
      category: "stories"
    },
    {
      id: 4,
      title: "Setting Up the Perfect Mobile Office",
      excerpt: "From ergonomic laptop stands to noise-cancelling headphones, here's what you need for your mobile workspace.",
      image: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Blog+Post",
      author: "David Chen",
      authorImage: "https://placehold.co/100x100/E8D4B2/6F4E37?text=DC",
      date: "July 5, 2023",
      category: "tips"
    },
    {
      id: 5,
      title: "The Psychology of Productivity in Public Spaces",
      excerpt: "Why some people thrive in busy coffee shops while others need silence to focus.",
      image: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Blog+Post",
      author: "Emma Rodriguez",
      authorImage: "https://placehold.co/100x100/E8D4B2/6F4E37?text=ER",
      date: "July 22, 2023",
      category: "productivity"
    }
  ];

  const filteredPosts = activeFilter === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

  const handleSubscribe = () => {
    toast({
      title: "Notification",
      description: "This feature will be available soon!",
    });
  };

  const featuredCoffeeShops = [
    {
      name: "Digital Bean Cafe",
      wifiSpeed: 48,
      description: "A modern cafe with dedicated coworking space and bookable meeting rooms for remote workers.",
      vibes: ["Focus Factory", "Digital Hub"],
      popularWith: ["Code Conjurers", "Deal Drivers"],
      imageUrl: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Digital+Bean+Cafe"
    },
    {
      name: "Mug & Keyboard",
      wifiSpeed: 52,
      description: "Tech-oriented coffee shop with power outlets at every table and noise-dampening booths.",
      vibes: ["Tech Haven", "Quiet Zen"],
      popularWith: ["Web Wizards", "Data Druids"],
      imageUrl: "https://placehold.co/500x300/E8D4B2/6F4E37?text=Mug+&+Keyboard"
    }
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Brews and Bytes Community - Stories and Tips</title>
        <meta name="description" content="Join the Brews and Bytes community. Read stories from other remote workers, get tips for productivity, and find the best coffee shops for your needs." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-16 bg-coffee-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              className="font-bold text-4xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Community & Stories
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover tips, success stories, and updates from our community of remote workers
            </motion.p>
          </div>
        </div>
      </section>

      {/* Blog/Community Section */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <Tabs defaultValue="all" className="max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <TabsList>
                  <TabsTrigger 
                    value="all" 
                    onClick={() => setActiveFilter("all")}
                  >
                    All Posts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="productivity" 
                    onClick={() => setActiveFilter("productivity")}
                  >
                    Productivity
                  </TabsTrigger>
                  <TabsTrigger 
                    value="tips" 
                    onClick={() => setActiveFilter("tips")}
                  >
                    Remote Work Tips
                  </TabsTrigger>
                  <TabsTrigger 
                    value="stories" 
                    onClick={() => setActiveFilter("stories")}
                  >
                    Success Stories
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Featured Post */}
          {filteredPosts.find(post => post.featured) && activeFilter === "all" && (
            <div className="max-w-5xl mx-auto mb-12">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={blogPosts[0].image} 
                      alt={blogPosts[0].title} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="uppercase tracking-wide text-sm text-tech-blue font-semibold mb-1">Featured Post</div>
                    <h2 className="font-bold text-2xl mb-3">{blogPosts[0].title}</h2>
                    <p className="mb-4">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center mb-6">
                      <img 
                        src={blogPosts[0].authorImage} 
                        alt={blogPosts[0].author}
                        className="h-10 w-10 rounded-full mr-3" 
                      />
                      <div>
                        <p className="font-medium">{blogPosts[0].author}</p>
                        <p className="text-sm text-gray-600">{blogPosts[0].date}</p>
                      </div>
                    </div>
                    <Button className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn">
                      Read Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={post.authorImage} 
                          alt={post.author}
                          className="h-8 w-8 rounded-full mr-2" 
                        />
                        <span className="text-sm">{post.author}</span>
                      </div>
                      <span className="text-sm text-gray-600">{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Removed "View More Articles" button */}
        </div>
      </section>

      {/* Featured Coffee Shops */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">This Month's Featured Spaces</h2>
            <p className="text-lg max-w-2xl mx-auto">Exceptional coffee shops making waves in our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredCoffeeShops.map((shop, index) => (
              <CoffeeShopCard
                key={index}
                name={shop.name}
                wifiSpeed={shop.wifiSpeed}
                description={shop.description}
                vibes={shop.vibes}
                popularWith={shop.popularWith}
                imageUrl={shop.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community Events - To be added in the future 
      <section className="py-16 bg-tech-blue bg-opacity-5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Upcoming Community Events</h2>
            <p className="text-lg max-w-2xl mx-auto">Join remote workers in your area for networking and coworking</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-vibe-yellow text-coffee-brown text-sm font-bold py-1 px-3 rounded-full">Virtual</span>
                <span className="text-sm text-gray-600">July 15, 2023 • 2:00 PM EST</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Remote Work Productivity Masterclass</h3>
              <p className="mb-4">Learn top productivity techniques specifically designed for remote workers and digital nomads.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tech-blue">
                  <i className="fas fa-users mr-1"></i> 145 attending
                </span>
                <Button variant="outline" className="border-tech-blue text-tech-blue hover:bg-tech-blue hover:bg-opacity-10">
                  RSVP Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-coffee-brown text-white text-sm font-bold py-1 px-3 rounded-full">In-Person</span>
                <span className="text-sm text-gray-600">July 22, 2023 • 10:00 AM</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Coffee & Coworking Meetup</h3>
              <p className="mb-4">Join fellow remote workers at Caffeine Code for a day of productivity, networking, and great coffee.</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tech-blue">
                  <i className="fas fa-map-marker-alt mr-1"></i> Caffeine Code, Downtown
                </span>
                <Button variant="outline" className="border-tech-blue text-tech-blue hover:bg-tech-blue hover:bg-opacity-10">
                  RSVP Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Newsletter Section */}
      <section className="py-16 bg-coffee-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-3xl mb-4">Stay Connected</h2>
            <p className="mb-8 opacity-90">Subscribe to our weekly newsletter for the latest coffee shop recommendations, remote work tips, and community updates.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg focus:outline-none text-dark-brown w-full sm:w-auto flex-grow max-w-md"
              />
              <Button 
                onClick={handleSubscribe}
                className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-8 rounded-lg transition-all duration-300 brand-btn"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-70">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
