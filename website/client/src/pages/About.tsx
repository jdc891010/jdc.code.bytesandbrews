import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="py-28 bg-vibe-yellow bg-opacity-10 page-section">
      <Helmet>
        <title>About Brews and Bytes - Our Story</title>
        <meta name="description" content="Learn about the story behind Brews and Bytes. We're a community-driven platform dedicated to helping remote workers find the best coffee shops with reliable Wi-Fi." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Story
          </motion.h1>
          <motion.p 
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Born from the frustration of unreliable café Wi-Fi and the quest for the perfect remote work environment
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://placehold.co/1000x600/E8D4B2/6F4E37?text=Our+Story" 
              alt="Team working in coffee shop" 
              className="rounded-xl shadow-lg w-full" 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-montserrat font-bold text-3xl text-coffee-brown mb-6">Why We Started</h2>
            <p className="mb-6 text-gray-700">
              After countless hours spent in coffee shops with terrible Wi-Fi, uncomfortable seating, and 
              unpredictable noise levels, we realized there had to be a better way to find the perfect 
              remote work spot.
            </p>
            <p className="mb-6 text-gray-700">
              We built Brews & Bytes to solve this problem for the entire remote work community. 
              By crowdsourcing real data from actual users, we create a reliable resource that helps 
              everyone find their ideal workspace.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-vibe-yellow rounded-full p-2 text-coffee-brown mt-1 mr-3">
                  <i className="fas fa-wifi text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-coffee-brown">Data-driven decisions</h4>
                  <p className="text-sm text-gray-600">Real speed tests and user reviews guide your choices</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-tech-blue rounded-full p-2 text-white mt-1 mr-3">
                  <i className="fas fa-users text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-coffee-brown">Community-powered</h4>
                  <p className="text-sm text-gray-600">Built by remote workers, for remote workers</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-coffee-brown rounded-full p-2 text-white mt-1 mr-3">
                  <i className="fas fa-chart-line text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-coffee-brown">Productivity-focused</h4>
                  <p className="text-sm text-gray-600">We enable great work through great spaces</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-tech-blue rounded-full p-2 text-white mt-1 mr-3">
                  <i className="fas fa-coffee text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-coffee-brown">Caffeine-powered</h4>
                  <p className="text-sm text-gray-600">Our love for great coffee shops drives everything we do</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coffee Personalities */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl text-coffee-brown mb-4">Coffee Personalities</h2>
            <p className="text-lg max-w-2xl mx-auto">Find your perfect brew companion for your coding session</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.0 }}
            >
              <div className="h-64 overflow-hidden bg-gradient-to-b from-[#4A2C2A] to-[#2c1a19]">
                <div className="h-full w-full flex items-center justify-center">
                  <svg className="w-40 h-40" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="40" fill="#4A2C2A" />
                    <circle cx="60" cy="40" r="15" fill="#2c1a19" />
                    <path d="M30,60 C30,40 90,40 90,60" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
                    <path d="M35,70 C35,55 85,55 85,70" stroke="white" strokeWidth="2" opacity="0.3" fill="none" />
                  </svg>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-montserrat font-bold text-xl text-coffee-brown">Espresso</h3>
                <p className="text-tech-blue mb-1 font-medium">The Power Player</p>
                <p className="text-sm mb-3 italic text-vibe-yellow">"Intense & Efficient"</p>
                <p className="text-sm text-gray-600">Quick, powerful, and straight to the point. Perfect for those who need maximum energy in minimal time. Loves difficult coding challenges.</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="h-64 overflow-hidden bg-gradient-to-b from-[#8C6F60] to-[#4A2C2A]">
                <div className="h-full w-full flex items-center justify-center">
                  <svg className="w-40 h-40" viewBox="0 0 120 120">
                    <path d="M40,40 L80,40 L75,80 L45,80 Z" fill="#8C6F60" />
                    <ellipse cx="60" cy="40" rx="20" ry="5" fill="white" opacity="0.6" />
                    <path d="M45,60 C45,55 75,55 75,60" stroke="white" strokeWidth="1" opacity="0.4" fill="none" />
                    <path d="M80,50 L90,60 L90,70 L80,70" stroke="#4A2C2A" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-montserrat font-bold text-xl text-coffee-brown">Cappuccino</h3>
                <p className="text-tech-blue mb-1 font-medium">The Balanced Artist</p>
                <p className="text-sm mb-3 italic text-vibe-yellow">"Creative & Structured"</p>
                <p className="text-sm text-gray-600">Perfect balance of intensity and creativity with a smooth finish. Ideal for both focused work and creative problem-solving sessions.</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="h-64 overflow-hidden bg-gradient-to-b from-[#C8A780] to-[#8C6F60]">
                <div className="h-full w-full flex items-center justify-center">
                  <svg className="w-40 h-40" viewBox="0 0 120 120">
                    <path d="M35,40 L85,40 L85,80 C85,90 35,90 35,80 Z" fill="#C8A780" />
                    <ellipse cx="60" cy="40" rx="25" ry="5" fill="white" opacity="0.5" />
                    <path d="M40,50 C40,45 80,45 80,50" stroke="white" strokeWidth="1" opacity="0.3" fill="none" />
                    <rect x="65" y="40" width="15" height="25" fill="#8C6F60" />
                  </svg>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-montserrat font-bold text-xl text-coffee-brown">Latte</h3>
                <p className="text-tech-blue mb-1 font-medium">The Smooth Collaborator</p>
                <p className="text-sm mb-3 italic text-vibe-yellow">"Friendly & Approachable"</p>
                <p className="text-sm text-gray-600">Creamy, smooth, and easy to work with. The perfect companion for long team coding sessions and casual meetings with clients.</p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="h-64 overflow-hidden bg-gradient-to-b from-[#362419] to-[#241911]">
                <div className="h-full w-full flex items-center justify-center">
                  <svg className="w-40 h-40" viewBox="0 0 120 120">
                    <path d="M40,50 L80,50 L80,90 L40,90 Z" fill="#362419" />
                    <path d="M45,50 L75,50 L78,43 L42,43" fill="#241911" stroke="#362419" strokeWidth="1" />
                    <path d="M40,70 C40,65 80,65 80,70" stroke="#4A2C2A" strokeWidth="1" opacity="0.4" />
                    <path d="M55,43 L55,35 C55,30 65,30 65,35 L65,43" stroke="#4A2C2A" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-montserrat font-bold text-xl text-coffee-brown">Cold Brew</h3>
                <p className="text-tech-blue mb-1 font-medium">The Marathon Coder</p>
                <p className="text-sm mb-3 italic text-vibe-yellow">"Smooth & Long-lasting"</p>
                <p className="text-sm text-gray-600">Low acidity with a smooth caffeine release for all-day focus. Ideal for developers tackling long debugging sessions and complex projects.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Join Us CTA */}
        <motion.section 
          className="py-20 bg-gradient-to-r from-coffee-brown via-tech-blue to-coffee-brown text-white text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.h2 
              className="font-montserrat text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Ready to Find Your Perfect Coffee Match?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Join thousands of coffee lovers who've discovered their ideal workspace companion through our personalized recommendations.
            </motion.p>
            <motion.button 
              className="bg-vibe-yellow text-coffee-brown px-10 py-4 rounded-full font-montserrat font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
            >
              Start Your Coffee Journey
            </motion.button>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default About;
