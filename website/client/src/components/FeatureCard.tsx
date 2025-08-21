import { ReactNode } from 'react';
import { motion } from "framer-motion";
import { Wifi, Coffee, Users, MapPin } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  colorClass: string;
  iconType?: "wifi" | "coffee" | "users" | "map";
}

const FeatureCard = ({ icon, title, description, colorClass, iconType }: FeatureCardProps) => {
  const getIcon = () => {
    if (iconType) {
      switch (iconType) {
        case "wifi":
          return <Wifi size={32} className="text-white" strokeWidth={2} />;
        case "coffee":
          return <Coffee size={32} className="text-white" strokeWidth={2} />;
        case "users":
          return <Users size={32} className="text-white" strokeWidth={2} />;
        case "map":
          return <MapPin size={32} className="text-white" strokeWidth={2} />;
        default:
          return icon;
      }
    }
    return icon;
  };

  return (
    <motion.div 
      className="feature-card bg-white rounded-xl p-6 shadow-md"
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        y: -5
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300,
        damping: 15
      }}
    >
      <div className={`${colorClass} w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transform transition-transform duration-300 hover:rotate-12`}>
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
