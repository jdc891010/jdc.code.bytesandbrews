import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionScrollButton from "@/components/SectionScrollButton";
import { fadeIn } from "@/lib/animations";

interface Special {
  id: string;
  shopName: string;
  title: string;
  description: string;
  day: string;
  time: string;
  imageUrl: string;
}

const specials: Special[] = [
  {
    id: "s1",
    shopName: "Bootlegger, Somerset West",
    title: "Happy Hour Coffee",
    description: "50% off any specialty coffee from 2-4 PM. Perfect afternoon boost!",
    day: "Monday-Friday",
    time: "2:00 PM - 4:00 PM",
    imageUrl: "https://picsum.photos/500/300?random=1"
  },
  {
    id: "s2",
    shopName: "Nom Nom, Somerset Mall",
    title: "Remote Worker Special",
    description: "Buy a daily pass for R150 and get unlimited refills and guaranteed seating.",
    day: "Monday-Thursday",
    time: "8:00 AM - 2:00 PM",
    imageUrl: "https://picsum.photos/500/300?random=2"
  },
  {
    id: "s3",
    shopName: "Slug & Lettuce, Waterstone",
    title: "Developer Breakfast",
    description: "Breakfast sandwich + large coffee combo for R120 - fuel your morning coding.",
    day: "Every day",
    time: "7:00 AM - 11:00 AM",
    imageUrl: "https://picsum.photos/500/300?random=3"
  },
  {
    id: "s4",
    shopName: "Blue Waters Café, Beach Road",
    title: "Meeting Room Special",
    description: "Book the private meeting room for 1 hour, get the 2nd hour free.",
    day: "Tuesday & Thursday",
    time: "All day",
    imageUrl: "https://picsum.photos/500/300?random=4"
  }
];

const CoffeeShopSpecials = () => {
  // Filter specials for "today" - in a real implementation, this would check actual day
  const todaySpecials = specials.slice(0, 3);
  
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
          {todaySpecials.map((special, index) => (
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
                  src={special.imageUrl} 
                  alt={special.shopName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-vibe-yellow text-coffee-brown py-1 px-3 m-2 rounded-full text-xs font-bold">
                  {special.day}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">{special.title}</h3>
                  <span className="text-sm text-tech-blue">{special.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{special.description}</p>
                <div className="flex items-center mt-4">
                  <div className="text-coffee-brown">
                    <i className="fas fa-store mr-2"></i>
                    <span className="font-medium">{special.shopName}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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