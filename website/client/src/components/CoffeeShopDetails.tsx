import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  TooltipProps
} from 'recharts';

// Location interface
interface Location {
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Review interface
interface Review {
  id: number;
  author: string;
  date: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  rating: number;
}

// Dos and Don'ts
interface GuideTip {
  do: string[];
  dont: string[];
}

// Time data for heatmap
interface TimeData {
  day: string;
  data: {
    time: string;
    wifiSpeed: {
      p10: number;
      p50: number;
      p90: number;
    };
    parking: {
      p10: number;
      p50: number;
      p90: number;
    };
    noise: {
      p10: number;
      p50: number;
      p90: number;
    };
  }[];
}

// Amenities type
type Rating = 1 | 2 | 3 | 4 | 5;

interface Amenities {
  wheelchairAccessible?: boolean;
  parkingRating?: Rating;
  videoCallRating?: Rating;
  powerAvailability?: Rating;
  coffeeQuality?: Rating;
}

// Mock data generator helpers
const generateHeatMapData = (): TimeData[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 14 }, (_, i) => `${i + 7}:00`); // 7am to 8pm
  
  return days.map(day => ({
    day,
    data: hours.flatMap(hour => {
      // Generate two 30-minute blocks per hour
      const hourNum = parseInt(hour.split(':')[0]);
      return [
        {
          time: `${hour}`,
          wifiSpeed: {
            p10: Math.floor(Math.random() * 20) + 5,
            p50: Math.floor(Math.random() * 30) + 20,
            p90: Math.floor(Math.random() * 20) + 50
          },
          parking: {
            p10: Math.floor(Math.random() * 2) + 1,
            p50: Math.floor(Math.random() * 2) + 2,
            p90: Math.floor(Math.random() * 2) + 3
          },
          noise: {
            p10: Math.floor(Math.random() * 2) + 1,
            p50: Math.floor(Math.random() * 2) + 2,
            p90: Math.floor(Math.random() * 2) + 3
          }
        },
        {
          time: `${hourNum}:30`,
          wifiSpeed: {
            p10: Math.floor(Math.random() * 20) + 5,
            p50: Math.floor(Math.random() * 30) + 20,
            p90: Math.floor(Math.random() * 20) + 50
          },
          parking: {
            p10: Math.floor(Math.random() * 2) + 1,
            p50: Math.floor(Math.random() * 2) + 2,
            p90: Math.floor(Math.random() * 2) + 3
          },
          noise: {
            p10: Math.floor(Math.random() * 2) + 1,
            p50: Math.floor(Math.random() * 2) + 2,
            p90: Math.floor(Math.random() * 2) + 3
          }
        }
      ];
    })
  }));
};

// Detailed Coffee Shop sample data
const mockReviews: Review[] = [
  {
    id: 1,
    author: "Sarah J.",
    date: "2023-09-15",
    text: "Perfect spot for focused work! The Wi-Fi never dropped once during my 3-hour coding session. Staff was super friendly and didn't mind me camping out at one table.",
    sentiment: "positive",
    rating: 5
  },
  {
    id: 2,
    author: "Mike T.",
    date: "2023-08-22",
    text: "Great coffee, but the Wi-Fi was spotty during lunch hours. Had to switch to my phone's hotspot for a video call.",
    sentiment: "neutral",
    rating: 3
  },
  {
    id: 3,
    author: "Lisa R.",
    date: "2023-10-01",
    text: "Too noisy for focused work. People kept moving chairs and tables around me. The coffee was good though.",
    sentiment: "negative",
    rating: 2
  },
  {
    id: 4,
    author: "Jordan P.",
    date: "2023-09-28",
    text: "Found my new favorite work spot! Plenty of outlets, fast Wi-Fi, and the background music is at just the right volume.",
    sentiment: "positive",
    rating: 5
  },
  {
    id: 5,
    author: "Alex M.",
    date: "2023-08-10",
    text: "Not bad, but could use more tables with power outlets. Had to wait 30 minutes to get a spot near an outlet.",
    sentiment: "neutral",
    rating: 3
  }
];

// Mock tips data
const mockTips: GuideTip = {
  do: [
    "Come early (before 9am) to snag the prime window-facing tables",
    "Try their 'Byte Booster' specialty coffee - a house favorite among coders!",
    "The baristas love hearing about your latest tech projects - don't be shy to chat!",
    "Order something every 2 hours to keep your 'table rent' paid up"
  ],
  dont: [
    "Don't hog the large tables if you're working solo during busy hours",
    "Be aware that noon to 2pm gets LOUD with the lunch crowd",
    "Never ask for the Wi-Fi password on weekends - it's a local taboo",
    "Don't bring outside food - the staff notices and remembers!"
  ]
};

// Navigation buttons for maps and ridesharing
const NavigationButtons = ({ location }: { location: Location }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${location.coordinates.lat},${location.coordinates.lng}`;
  const wazeUrl = `https://www.waze.com/ul?ll=${location.coordinates.lat},${location.coordinates.lng}&navigate=yes`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${location.coordinates.lat}&dropoff[longitude]=${location.coordinates.lng}`;
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-100">
          <i className="fas fa-map-marker-alt text-red-500"></i> Google Maps
        </Button>
      </a>
      <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-100">
          <i className="fab fa-apple text-gray-800"></i> Apple Maps
        </Button>
      </a>
      <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-100">
          <i className="fab fa-waze text-blue-500"></i> Waze
        </Button>
      </a>
      <a href={uberUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-gray-100">
          <i className="fab fa-uber text-black"></i> Uber
        </Button>
      </a>
    </div>
  );
};

// Helper function to get color based on value
const getHeatColor = (value: number, max: number) => {
  // Convert to a value between 0 and 1
  const normalized = value / max;
  
  if (normalized < 0.2) {
    return '#22c55e'; // Bright green
  } else if (normalized < 0.4) {
    return '#84cc16'; // Lime green
  } else if (normalized < 0.6) {
    return '#facc15'; // Yellow
  } else if (normalized < 0.8) {
    return '#fb923c'; // Orange
  } else {
    return '#ef4444'; // Red
  }
};

// Review card component
const ReviewCard = ({ review }: { review: Review }) => {
  const getBgColor = () => {
    switch (review.sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'neutral':
        return 'bg-yellow-50 border-yellow-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg mb-3 border ${getBgColor()}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{review.author}</div>
        <div className="text-sm text-gray-500">{review.date}</div>
      </div>
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <i 
            key={i} 
            className={`fas fa-star text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
      <p className="text-sm text-gray-700">{review.text}</p>
    </div>
  );
};

interface CoffeeShopDetailsProps {
  open: boolean;
  onClose: () => void;
  name: string;
  description: string;
  amenities: Amenities;
  dominantTribe: string;
  // Location data
  location: Location;
}

const CoffeeShopDetails = ({ 
  open, 
  onClose, 
  name, 
  description, 
  amenities, 
  dominantTribe,
  location
}: CoffeeShopDetailsProps) => {
  const [activeTab, setActiveTab] = useState("wifi");
  const timeData = generateHeatMapData();
  
  // Get current day and time to highlight
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date();
  const currentDay = days[currentDate.getDay()];
  const currentHour = currentDate.getHours();
  
  // Calculate composite score (average of all amenities + 4.2 for wifi)
  const scores = [
    4.2, // WiFi
    amenities.parkingRating || 3,
    amenities.videoCallRating || 3,
    amenities.powerAvailability || 3,
    amenities.coffeeQuality || 4,
    3.8, // Ambience
    4.0 // Table Space
  ];
  
  const compositeScore = (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[95vh] bg-soft-cream coffee-shop-dialog p-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-6">
        <DialogTitle className="text-2xl font-bold text-coffee-brown flex items-center">
          <i className="fas fa-mug-hot mr-2 text-vibe-yellow"></i>
          {name}
        </DialogTitle>
        
        <div className="text-gray-700 mt-2 mb-4">
          <p>{description}</p>
          
          <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <i className="fas fa-map-marker-alt text-coffee-brown mr-2"></i>
              <div>
                <p className="text-sm font-medium">{location.address}</p>
                <p className="text-sm text-gray-500">{location.city}, {location.country}</p>
              </div>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center mb-1">
                <i className="fas fa-phone text-coffee-brown mr-2"></i>
                <p className="text-sm">+27 21 555 6789</p>
              </div>
              
              <div className="flex items-center mb-1">
                <i className="fas fa-globe text-coffee-brown mr-2"></i>
                <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" className="text-sm text-tech-blue hover:underline">www.example.com</a>
              </div>
              
              <div className="flex items-center">
                <i className="fas fa-envelope text-coffee-brown mr-2"></i>
                <a href="mailto:info@example.com" className="text-sm text-tech-blue hover:underline">info@example.com</a>
              </div>
            </div>
          </div>
          
          <NavigationButtons location={location} />
          
          {/* Heatmap Section */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-coffee-brown mb-4 flex items-center">
              <i className="fas fa-fire-flame-curved mr-2 text-vibe-yellow"></i>
              Usage Heatmap
            </h3>
            
            <Tabs defaultValue="wifi" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 bg-soft-cream rounded-md">
                <TabsTrigger value="wifi">Internet Speeds</TabsTrigger>
                <TabsTrigger value="parking">Parking Availability</TabsTrigger>
                <TabsTrigger value="noise">Noise Levels</TabsTrigger>
              </TabsList>
              
              <TabsContent value="wifi" className="pt-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border"></th>
                        {Array.from({ length: 14 }).map((_, i) => (
                          <th key={i} className="p-2 border text-center" colSpan={2}>
                            {i + 7}:00
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeData.map((day) => (
                        <tr key={day.day} className={day.day === currentDay ? 'bg-gray-100' : ''}>
                          <td className="p-2 border font-medium">{day.day}</td>
                          {day.data.map((timeSlot, i) => {
                            const hour = parseInt(timeSlot.time.split(':')[0]);
                            const isCurrentTimeSlot = day.day === currentDay && 
                              ((hour === currentHour) || 
                              (hour === currentHour && timeSlot.time.includes('30')));
                            
                            return (
                              <td 
                                key={i} 
                                className={`p-2 border text-center ${isCurrentTimeSlot ? 'ring-2 ring-tech-blue' : ''}`}
                                style={{ 
                                  backgroundColor: getHeatColor(timeSlot.wifiSpeed.p50, 70),
                                  cursor: 'pointer'
                                }}
                                title={`Time: ${timeSlot.time}
                                  10%: ${timeSlot.wifiSpeed.p10} Mbps
                                  50%: ${timeSlot.wifiSpeed.p50} Mbps 
                                  90%: ${timeSlot.wifiSpeed.p90} Mbps`}
                              >
                                &nbsp;
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div>
                    <span>Excellent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-lime-500 mr-2 rounded-sm"></div>
                    <span>Great</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 mr-2 rounded-sm"></div>
                    <span>Good</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-400 mr-2 rounded-sm"></div>
                    <span>Fair</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>
                    <span>Poor</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parking" className="pt-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border"></th>
                        {Array.from({ length: 14 }).map((_, i) => (
                          <th key={i} className="p-2 border text-center" colSpan={2}>
                            {i + 7}:00
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeData.map((day) => (
                        <tr key={day.day} className={day.day === currentDay ? 'bg-gray-100' : ''}>
                          <td className="p-2 border font-medium">{day.day}</td>
                          {day.data.map((timeSlot, i) => {
                            const hour = parseInt(timeSlot.time.split(':')[0]);
                            const isCurrentTimeSlot = day.day === currentDay && 
                              ((hour === currentHour) || 
                              (hour === currentHour && timeSlot.time.includes('30')));
                            
                            return (
                              <td 
                                key={i} 
                                className={`p-2 border text-center ${isCurrentTimeSlot ? 'ring-2 ring-tech-blue' : ''}`}
                                style={{ 
                                  backgroundColor: getHeatColor(timeSlot.parking.p50, 5),
                                  cursor: 'pointer'
                                }}
                                title={`Time: ${timeSlot.time}
                                  10%: ${timeSlot.parking.p10}/5
                                  50%: ${timeSlot.parking.p50}/5 
                                  90%: ${timeSlot.parking.p90}/5`}
                              >
                                &nbsp;
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div>
                    <span>Very Easy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-lime-500 mr-2 rounded-sm"></div>
                    <span>Easy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 mr-2 rounded-sm"></div>
                    <span>Average</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-400 mr-2 rounded-sm"></div>
                    <span>Difficult</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>
                    <span>Very Difficult</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="noise" className="pt-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border"></th>
                        {Array.from({ length: 14 }).map((_, i) => (
                          <th key={i} className="p-2 border text-center" colSpan={2}>
                            {i + 7}:00
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeData.map((day) => (
                        <tr key={day.day} className={day.day === currentDay ? 'bg-gray-100' : ''}>
                          <td className="p-2 border font-medium">{day.day}</td>
                          {day.data.map((timeSlot, i) => {
                            const hour = parseInt(timeSlot.time.split(':')[0]);
                            const isCurrentTimeSlot = day.day === currentDay && 
                              ((hour === currentHour) || 
                              (hour === currentHour && timeSlot.time.includes('30')));
                            
                            return (
                              <td 
                                key={i} 
                                className={`p-2 border text-center ${isCurrentTimeSlot ? 'ring-2 ring-tech-blue' : ''}`}
                                style={{ 
                                  backgroundColor: getHeatColor(timeSlot.noise.p50, 5),
                                  cursor: 'pointer'
                                }}
                                title={`Time: ${timeSlot.time}
                                  10%: ${timeSlot.noise.p10}/5
                                  50%: ${timeSlot.noise.p50}/5 
                                  90%: ${timeSlot.noise.p90}/5`}
                              >
                                &nbsp;
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mt-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2 rounded-sm"></div>
                    <span>Silent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-lime-500 mr-2 rounded-sm"></div>
                    <span>Quiet</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 mr-2 rounded-sm"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-400 mr-2 rounded-sm"></div>
                    <span>Noisy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>
                    <span>Very Noisy</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-coffee-brown mb-2 flex items-center">
              <i className="fas fa-users mr-2 text-vibe-yellow"></i>
              Most Common Tribe: {dominantTribe}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-green-700 font-medium mb-2">Dos:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {mockTips.do.map((item, idx) => (
                    <li key={`do-${idx}`} className="mb-1">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-red-700 font-medium mb-2">Don'ts:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {mockTips.dont.map((item, idx) => (
                    <li key={`dont-${idx}`} className="mb-1">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Composite Score and Radar Chart */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-coffee-brown mb-4 flex items-center">
              <i className="fas fa-chart-radar mr-2 text-vibe-yellow"></i>
              Composite Score
            </h3>
            
            <div className="flex flex-col items-center mb-3">
              <div className="text-3xl font-bold text-tech-blue">{compositeScore}</div>
              <div className="text-sm text-gray-500">Overall Rating</div>
            </div>
            
            <div className="h-72 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  outerRadius={90} 
                  data={[
                    { category: 'Wi-Fi', value: 4.2 },
                    { category: 'Parking', value: amenities.parkingRating || 3 },
                    { category: 'Video Calls', value: amenities.videoCallRating || 3 },
                    { category: 'Power', value: amenities.powerAvailability || 3 },
                    { category: 'Coffee', value: amenities.coffeeQuality || 4 },
                    { category: 'Ambience', value: 3.8 },
                    { category: 'Table Space', value: 4.0 }
                  ]}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#1e40af"
                    fillOpacity={0.6}
                  />
                  <RechartsTooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-sm text-center italic mt-2 text-gray-600">
              Composite score based on 42 reviews and WiFi tests
            </p>
          </div>
          
          {/* Reviews Section with Scrollable Area */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-coffee-brown mb-4 flex items-center">
              <i className="fas fa-comments mr-2 text-vibe-yellow"></i>
              Reviews
            </h3>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">
                <span className="text-tech-blue">4.1</span> 
                <span className="text-gray-500 text-sm ml-1">(42 reviews)</span>
              </div>
              
              <div className="flex items-center">
                <BarChart width={140} height={40} data={[
                  { name: 'Positive', value: mockReviews.filter(r => r.sentiment === 'positive').length, color: '#4ade80' },
                  { name: 'Neutral', value: mockReviews.filter(r => r.sentiment === 'neutral').length, color: '#facc15' },
                  { name: 'Negative', value: mockReviews.filter(r => r.sentiment === 'negative').length, color: '#ef4444' }
                ]}>
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {mockReviews.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          index === 0 ? '#4ade80' : 
                          index === 1 ? '#facc15' : 
                          '#ef4444'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
            
            <ScrollArea className="h-60 rounded-md border p-2">
              {mockReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </ScrollArea>
          </div>
        </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CoffeeShopDetails;