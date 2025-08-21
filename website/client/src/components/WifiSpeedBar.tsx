import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WifiSpeedBarProps {
  coffeeShop: {
    name: string;
    imageUrl: string;
    tribe: string;
    speed: number;
    vibe: string;
    updated: string;
    // Extended statistics
    p10?: number;
    p90?: number;
    confidence?: number;
    testCount?: number;
    wifiName?: string;
    testDevice?: string;
    area?: string;
  };
  animate?: boolean;
  showDetails?: boolean;
}

const WifiSpeedBar = ({ coffeeShop, animate = false, showDetails = false }: WifiSpeedBarProps) => {
  const [animationComplete, setAnimationComplete] = useState(!animate);
  const [displayedSpeed, setDisplayedSpeed] = useState(animate ? 0 : coffeeShop.speed);
  const [expanded, setExpanded] = useState(showDetails);
  
  // For animation effect when speed updates
  useEffect(() => {
    if (animate) {
      const timeout = setTimeout(() => {
        setDisplayedSpeed(coffeeShop.speed);
        setAnimationComplete(true);
      }, 600);
      
      return () => clearTimeout(timeout);
    }
  }, [animate, coffeeShop.speed]);
  
  // Determine speed level classification
  const getSpeedLevel = (speed: number) => {
    if (speed >= 30) return { 
      className: "bg-green-500",
      text: "Fast"
    };
    if (speed >= 15) return { 
      className: "bg-tech-blue",
      text: "Decent"
    };
    return { 
      className: "bg-amber-500",
      text: "Basic"
    };
  };
  
  const speedLevel = getSpeedLevel(coffeeShop.speed);
  
  return (
    <div className="bg-soft-cream p-4 rounded-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <img 
            src={coffeeShop.imageUrl} 
            alt={coffeeShop.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
            <div>
              <h4 className="font-medium text-sm lg:text-base">{coffeeShop.name}</h4>
              <div className="flex flex-wrap text-xs text-gray-500">
                <span className="mr-2">
                  <i className="fas fa-users mr-1"></i>
                  {coffeeShop.tribe}
                </span>
                <span>
                  <i className="fas fa-music mr-1"></i>
                  {coffeeShop.vibe}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <div className="font-bold text-lg lg:text-xl">
                {displayedSpeed} <span className="text-xs font-normal">Mbps</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 justify-start sm:justify-end">
                <span className="mr-2">Updated {coffeeShop.updated}</span>
                {(coffeeShop.testCount || coffeeShop.wifiName) && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-tech-blue hover:underline focus:outline-none"
                  >
                    {expanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className={`absolute top-0 left-0 h-full ${speedLevel.className}`}
              initial={{ width: animate ? "0%" : `${coffeeShop.speed}%` }}
              animate={{ width: `${displayedSpeed}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
      
      {/* Extended statistics information */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {/* Test statistics */}
          {coffeeShop.testCount && (
            <div className="mb-3">
              <h5 className="text-sm font-medium mb-2">Test Statistics</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-xs text-gray-500">Tests Run</div>
                  <div className="font-medium">{coffeeShop.testCount}</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-xs text-gray-500">P10</div>
                  <div className="font-medium">{coffeeShop.p10 || '-'} Mbps</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-xs text-gray-500">P90</div>
                  <div className="font-medium">{coffeeShop.p90 || '-'} Mbps</div>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <div className="text-xs text-gray-500">Confidence</div>
                  <div className="font-medium">{coffeeShop.confidence || '-'}%</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Connection details */}
          {(coffeeShop.wifiName || coffeeShop.testDevice) && (
            <div>
              <h5 className="text-sm font-medium mb-2">Connection Details</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coffeeShop.wifiName && (
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xs text-gray-500">WiFi Network</div>
                    <div className="font-medium">{coffeeShop.wifiName}</div>
                  </div>
                )}
                {coffeeShop.testDevice && (
                  <div className="bg-white p-2 rounded shadow-sm">
                    <div className="text-xs text-gray-500">Last Tested On</div>
                    <div className="font-medium">{coffeeShop.testDevice}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WifiSpeedBar;