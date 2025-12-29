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
            {/* Animated shy coffee cup SVG */}
            <div className="relative mx-auto w-64 h-64 mb-8">
              <motion.svg 
                viewBox="0 0 200 200" 
                className="w-full h-full"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, -2, 0, 2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                {/* Steam */}
                <motion.g
                  animate={{ opacity: [0.4, 0.7, 0.4], y: [-2, -8, -2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path d="M85 40 Q 95 30, 105 40 T 125 40" fill="none" stroke="#D4A574" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                  <path d="M75 55 Q 85 45, 95 55 T 115 55" fill="none" stroke="#D4A574" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
                </motion.g>

                {/* Cup Body */}
                <path
                  d="M60 80 L 60 150 Q 60 180, 100 180 Q 140 180, 140 150 L 140 80 Z"
                  fill="#FFFFFF"
                  stroke="#4A2C2A"
                  strokeWidth="4"
                />
                
                {/* Coffee Liquid Surface */}
                <ellipse cx="100" cy="80" rx="40" ry="10" fill="#6F4E37" />
                
                {/* Handle */}
                <path
                  d="M140 100 Q 170 100, 170 130 Q 170 150, 140 150"
                  fill="none"
                  stroke="#4A2C2A"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Shy Face */}
                <g transform="translate(0, 10)">
                  {/* Eyes looking sideways */}
                  <circle cx="90" cy="120" r="3" fill="#2A1A18" />
                  <circle cx="120" cy="120" r="3" fill="#2A1A18" />
                  
                  {/* Blush */}
                  <motion.circle 
                    cx="80" cy="130" r="6" fill="#FFB7B2" opacity="0.6"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.circle 
                    cx="130" cy="130" r="6" fill="#FFB7B2" opacity="0.6"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Small nervous mouth */}
                  <path d="M102 135 Q 105 132, 108 135" fill="none" stroke="#2A1A18" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Sweat drop */}
                  <motion.path
                    d="M135 100 Q 135 110, 138 110 Q 141 110, 141 100 Q 141 90, 138 90 Q 135 90, 135 100"
                    fill="#E0F7FA"
                    stroke="#4FC3F7"
                    strokeWidth="1"
                    animate={{ y: [0, 5, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </g>
              </motion.svg>
            </div>
            
            <motion.h1 
              className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              This is not where I parked my car
            </motion.h1>
            
            <motion.p
              className="text-text-secondary mb-8 max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Looks like you've wandered into the wrong cafe. Let's get you back to the main menu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link href="/">
                <Button size="lg" className="bg-coffee-brown hover:bg-coffee-bean text-cream">
                  Take Me Home
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}