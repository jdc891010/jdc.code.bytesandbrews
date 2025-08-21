import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  tribe: string;
  quote: string;
  imageUrl: string;
}

const TestimonialCard = ({ name, tribe, quote, imageUrl }: TestimonialCardProps) => {
  return (
    <motion.div 
      className="bg-coffee-brown bg-opacity-80 p-6 rounded-xl"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 mr-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-vibe-yellow"
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <div className="text-sm text-cream-white opacity-70">{tribe}</div>
        </div>
      </div>
      
      <div className="relative">
        <i className="fas fa-quote-left absolute -top-2 -left-1 text-vibe-yellow opacity-30 text-xl"></i>
        <p className="relative text-cream-white leading-relaxed">
          {quote}
        </p>
        <i className="fas fa-quote-right absolute -bottom-2 -right-1 text-vibe-yellow opacity-30 text-xl"></i>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;