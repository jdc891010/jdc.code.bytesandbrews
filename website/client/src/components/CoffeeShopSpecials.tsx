import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionScrollButton from "@/components/SectionScrollButton";
import { fadeIn } from "@/lib/animations";
import { getSpecials, Special } from "@/services/coffeeShopApi";

const CoffeeShopSpecials = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        setLoading(true);
        const response = await getSpecials();
        
        if (response.success) {
          // Filter for active specials only
          const now = new Date();
          const activeSpecials = response.specials.filter((special: Special) => {
            const startDate = new Date(special.startDate);
            const endDate = new Date(special.endDate);
            return special.isActive && startDate <= now && endDate >= now;
          });
          
          setSpecials(activeSpecials.slice(0, 3)); // Show only first 3
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch specials:', err);
        setError('Failed to load specials');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-brown mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading specials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || specials.length === 0) {
    return null; // Don't show the section if there are no active specials
  }
  
  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="absolute top-4 right-4">
          <SectionScrollButton targetId="home" position="top" />
        </div>
        <div className="text-center mb-12">
          <motion.h2 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            variants={fadeIn("up")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            Coffee Shop Specials
          </motion.h2>
          <motion.p 
            className="text-lg max-w-2xl mx-auto"
            variants={fadeIn("up")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2 }}
          >
            Exclusive deals for remote workers at our partner locations
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {specials.map((special, index) => {
            const startDate = new Date(special.startDate);
            const endDate = new Date(special.endDate);
            const isExpiringSoon = (endDate.getTime() - Date.now()) < (7 * 24 * 60 * 60 * 1000); // 7 days
            
            return (
              <motion.div
                key={special.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                variants={fadeIn("up")}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={special.imageUrl || 'https://picsum.photos/500/300?random=' + special.id} 
                    alt={special.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-vibe-yellow text-coffee-brown py-1 px-3 m-2 rounded-full text-xs font-bold">
                    {isExpiringSoon ? 'Ending Soon!' : 'Active'}
                  </div>
                  {special.discountPercentage && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white py-1 px-3 m-2 rounded-full text-xs font-bold">
                      {special.discountPercentage}% OFF
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{special.title}</h3>
                    <span className="text-sm text-tech-blue">
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{special.description}</p>
                  {special.terms && (
                    <p className="text-xs text-gray-500 mb-2 italic">{special.terms}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-coffee-brown">
                      <i className="fas fa-store mr-2"></i>
                      <span className="font-medium">{special.placeName || 'Coffee Shop'}</span>
                    </div>
                    {special.originalPrice && special.discountedPrice && (
                      <div className="text-right">
                        <span className="text-gray-500 line-through text-sm">R{special.originalPrice}</span>
                        <span className="text-green-600 font-bold ml-2">R{special.discountedPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Temporarily removed "View All Specials" button for future use
        <div className="text-center mt-10">
          <Button className="bg-coffee-brown hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 brand-btn">
            View All Specials
          </Button>
        </div>
        */}
      </div>
    </section>
  );
};

export default CoffeeShopSpecials;