import { useState } from 'react';
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CoffeeShopDetails from "./CoffeeShopDetails";

interface VibeBadgeProps {
  name: string;
}

const VibeBadge = ({ name }: VibeBadgeProps) => (
  <Badge
    className="mr-1 mb-1 bg-tech-blue text-white hover:bg-tech-blue hover:bg-opacity-90 border-0"
  >
    {name}
  </Badge>
);

// Rating scale: 1-5 where 5 is best
type Rating = 1 | 2 | 3 | 4 | 5;

interface Amenities {
  wheelchairAccessible?: boolean;
  parkingRating?: Rating;
  videoCallRating?: Rating;
  powerAvailability?: Rating;
  coffeeQuality?: Rating;
}

interface CoffeeShopCardProps {
  name: string;
  wifiSpeed: number;
  description: string;
  vibes: string[];
  popularWith: string[];
  imageUrl: string;
  amenities?: Amenities;
  address?: string;
  city?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isFeatured?: boolean;
  featuredDescription?: string;
  priceLevel?: string;
  userRatingCount?: number;
  businessStatus?: string;
  googleMapsUri?: string;
  website?: string;
  phoneNumber?: string;
  id?: string;
}

const CoffeeShopCard = ({
  name,
  wifiSpeed,
  description,
  vibes,
  popularWith,
  imageUrl,
  amenities = {
    wheelchairAccessible: Math.random() > 0.5,
    parkingRating: Math.ceil(Math.random() * 5) as Rating,
    videoCallRating: Math.ceil(Math.random() * 5) as Rating,
    powerAvailability: Math.ceil(Math.random() * 5) as Rating,
    coffeeQuality: Math.ceil(Math.random() * 5) as Rating
  },
  address = "123 Bright Street",
  city = "Somerset West",
  country = "South Africa",
  coordinates = { lat: -34.0731, lng: 18.8433 },
  isFeatured = false,
  featuredDescription,
  priceLevel,
  userRatingCount,
  businessStatus,
  googleMapsUri,
  website,
  phoneNumber,
  id
}: CoffeeShopCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Determine Wi-Fi speed color and text
  const getWifiSpeedDetails = (speed: number) => {
    if (speed >= 40) {
      return {
        color: "text-green-500",
        text: "Blazing Fast",
      };
    } else if (speed >= 20) {
      return {
        color: "text-tech-blue",
        text: "Good Speed",
      };
    } else {
      return {
        color: "text-amber-500",
        text: "Basic Speed",
      };
    }
  };

  const wifiDetails = getWifiSpeedDetails(wifiSpeed);

  // Get dominant tribe (first in array)
  const dominantTribe = popularWith.length > 0 ? popularWith[0] : "Digital Nomads";

  return (
    <>
      <motion.div
        id={id}
        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${isFeatured ? 'ring-2 ring-amber-400 ring-opacity-50' : ''}`}
        whileHover={{ y: -5 }}
      >
        <div className="h-48 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />

          {/* Featured Spot Ribbon */}
          {isFeatured && (
            <div className="absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-2 px-4 m-2 rounded-lg text-xs font-bold flex items-center shadow-lg transform -rotate-3">
              <i className="fas fa-star mr-1 text-yellow-200"></i> Featured Spot
            </div>
          )}

          <div className="absolute top-0 right-0 bg-vibe-yellow text-coffee-brown py-1 px-3 m-2 rounded-full text-xs font-bold flex items-center">
            <i className="fas fa-wifi mr-1"></i> {wifiSpeed} Mbps
          </div>

          {amenities.wheelchairAccessible && (
            <div className="absolute bottom-0 left-0 bg-green-500 text-white py-1 px-3 m-2 rounded-full text-xs font-bold flex items-center">
              <i className="fas fa-wheelchair mr-1"></i> Accessible
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col min-h-[420px]">
          {/* Header - Fixed height */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-xl text-coffee-brown line-clamp-1 flex-1">{name}</h3>
              {isFeatured && (
                <div className="ml-2 flex items-center text-amber-600">
                  <i className="fas fa-star text-sm"></i>
                </div>
              )}
            </div>

            <p className={`text-sm ${wifiDetails.color} font-medium`}>
              <i className="fas fa-bolt mr-1"></i> {wifiDetails.text}
            </p>

            {isFeatured && featuredDescription && (
              <p className="text-xs text-amber-700 mt-1 italic">
                <i className="fas fa-crown mr-1"></i> {featuredDescription}
              </p>
            )}
          </div>

          {/* Description - Allow natural height with overflow */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

          {/* Amenities Rating Section - Fixed layout grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="w-16 flex items-center">
                <i className="fas fa-car text-gray-700 mr-1 w-4 text-center"></i>
                <span>Parking</span>
              </div>
              <div className="text-right">
                <span
                  className="bg-gray-100 rounded-full px-2 py-0.5 font-medium text-tech-blue cursor-pointer hover:bg-tech-blue hover:text-white transition-colors duration-200"
                  title="Parking availability rating"
                >
                  {amenities.parkingRating}/5
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-16 flex items-center">
                <i className="fas fa-video text-gray-700 mr-1 w-4 text-center"></i>
                <span>Video</span>
              </div>
              <div className="text-right">
                <span
                  className="bg-gray-100 rounded-full px-2 py-0.5 font-medium text-tech-blue cursor-pointer hover:bg-tech-blue hover:text-white transition-colors duration-200"
                  title="Video call quality rating"
                >
                  {amenities.videoCallRating}/5
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-16 flex items-center">
                <i className="fas fa-plug text-gray-700 mr-1 w-4 text-center"></i>
                <span>Power</span>
              </div>
              <div className="text-right">
                <span
                  className="bg-gray-100 rounded-full px-2 py-0.5 font-medium text-tech-blue cursor-pointer hover:bg-tech-blue hover:text-white transition-colors duration-200"
                  title="Power outlet availability rating"
                >
                  {amenities.powerAvailability}/5
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-16 flex items-center">
                <i className="fas fa-coffee text-gray-700 mr-1 w-4 text-center"></i>
                <span>Coffee</span>
              </div>
              <div className="text-right">
                <span
                  className="bg-gray-100 rounded-full px-2 py-0.5 font-medium text-tech-blue cursor-pointer hover:bg-tech-blue hover:text-white transition-colors duration-200"
                  title="Coffee quality rating"
                >
                  {amenities.coffeeQuality}/5
                </span>
              </div>
            </div>
          </div>

          {/* Vibes section - No fixed height */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Vibes:</p>
            <div className="flex flex-wrap">
              {vibes.map((vibe) => (
                <VibeBadge key={vibe} name={vibe} />
              ))}
            </div>
          </div>

          {/* Popular with section - No fixed height */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Popular with:</p>
            <div className="flex flex-wrap">
              {popularWith.map((tribe) => (
                <Badge
                  key={tribe}
                  className="mr-1 mb-1 bg-coffee-brown text-white hover:bg-coffee-brown hover:bg-opacity-90 border-0"
                >
                  {tribe}
                </Badge>
              ))}
            </div>
          </div>

          {/* Button positioned at the bottom using mt-auto */}
          <div className="mt-auto">
            <Button
              className="w-full bg-coffee-brown hover:bg-coffee-brown hover:bg-opacity-90 text-white font-medium transition-all duration-300 transform hover:scale-105 view-details-trigger"
              onClick={() => setDetailsOpen(true)}
            >
              <i className="fas fa-mug-hot mr-2"></i> View Details
            </Button>
          </div>
        </div>
      </motion.div>

      <CoffeeShopDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        name={name}
        description={description}
        amenities={amenities}
        dominantTribe={dominantTribe}
        location={{
          address,
          city,
          country,
          coordinates
        }}
        priceLevel={priceLevel}
        userRatingCount={userRatingCount}
        businessStatus={businessStatus}
        googleMapsUri={googleMapsUri}
        website={website}
        phoneNumber={phoneNumber}
      />
    </>
  );
};

export default CoffeeShopCard;