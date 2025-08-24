import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Brews and Bytes</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="min-h-screen w-full flex items-center justify-center bg-soft-cream py-12 px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {/* Shy and surprised coffee cup SVG */}
            <div className="relative mx-auto w-64 h-64 mb-8">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Coffee cup */}
                <path 
                  d="M50,100 Q50,50 100,50 Q150,50 150,100 Q150,150 100,150 Q50,150 50,100 Z" 
                  fill="#4A2C2A" 
                  stroke="#2A1A18" 
                  strokeWidth="2"
                />
                
                {/* Coffee liquid */}
                <path 
                  d="M60,100 Q60,70 100,70 Q140,70 140,100 Q140,130 100,130 Q60,130 60,100 Z" 
                  fill="#8B4513" 
                  opacity="0.8"
                />
                
                {/* Cup handle */}
                <path 
                  d="M150,90 Q170,90 170,110 Q170,130 150,130" 
                  fill="none" 
                  stroke="#4A2C2A" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                />
                
                {/* Shy/surprised eyes - one open, one closed */}
                <ellipse cx="85" cy="90" rx="5" ry="8" fill="#F5E8C7" />
                <ellipse cx="115" cy="90" rx="5" ry="2" fill="#F5E8C7" />
                
                {/* Blushing cheeks */}
                <circle cx="70" cy="110" r="6" fill="#FF6B6B" opacity="0.6" />
                <circle cx="130" cy="110" r="6" fill="#FF6B6B" opacity="0.6" />
                
                {/* Small surprised mouth */}
                <path 
                  d="M90,125 Q100,135 110,125" 
                  fill="none" 
                  stroke="#F5E8C7" 
                  strokeWidth="2"
                />
                
                {/* Steam with surprised/exclamation effect */}
                <path 
                  d="M90,60 C95,55 105,55 110,60 C115,65 105,70 100,70 C95,70 85,65 90,60 Z" 
                  fill="#F5E8C7" 
                  opacity="0.7"
                />
                <path 
                  d="M100,45 L100,55" 
                  stroke="#F5E8C7" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <circle cx="100" cy="40" r="2" fill="#F5E8C7" />
              </svg>
            </div>
            
            <motion.h1 
              className="font-montserrat font-bold text-4xl md:text-5xl text-coffee-brown mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              404
            </motion.h1>
            
            <motion.p 
              className="font-montserrat text-xl text-coffee-brown mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Nothing to see here!
            </motion.p>
            
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Oops! The page you're looking for seems to have vanished into the coffee mist.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link href="/">
              <Button className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 brand-btn mx-auto">
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Button>
            </Link>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/features">
                <Button variant="outline" className="border-tech-blue text-tech-blue hover:bg-tech-blue hover:bg-opacity-10 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                  <i className="fas fa-wifi mr-2"></i>
                  Explore Features
                </Button>
              </Link>
              <Link href="/coffee-shops">
                <Button variant="outline" className="border-coffee-brown text-coffee-brown hover:bg-coffee-brown hover:bg-opacity-10 font-bold py-2 px-6 rounded-lg transition-all duration-300">
                  <i className="fas fa-mug-hot mr-2"></i>
                  Find Coffee Shops
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}