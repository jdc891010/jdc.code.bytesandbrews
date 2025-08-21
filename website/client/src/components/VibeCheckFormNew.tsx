import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { creatureTribes } from "@/lib/data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import CoffeeShopAutocomplete from "@/components/CoffeeShopAutocomplete";
import { useSpeedTest } from "@/hooks/useSpeedTest";
import SpeedTestAnimation from "@/components/SpeedTestAnimation";

const vibeCheckSchema = z.object({
  locationName: z.string().min(2, { message: "Please enter a valid location name" }),
  city: z.string().min(2, { message: "Please enter a valid city" }),
  vibeRating: z.number().min(1).max(5),
  noiseLevel: z.number().min(1).max(5),
  powerOutlets: z.number().min(1).max(5),
  coffeeQuality: z.number().min(1).max(5),
  staffFriendliness: z.number().min(1).max(5),
  parking: z.number().min(1).max(5),
  affordability: z.number().min(1).max(5),
  videoCallQuality: z.number().min(1).max(5),
  privacy: z.number().min(1).max(5),
  accessibility: z.number().min(1).max(5),
  comments: z.string().optional(),
  tribe: z.string().min(1, { message: "Please select your tribe" }),
  subProfession: z.string().min(1, { message: "Please specify your profession" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  wifiSpeed: z.number().min(0).default(0),
});

type VibeCheckFormValues = z.infer<typeof vibeCheckSchema>;

const VibeCheckForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [wifiTestStatus, setWifiTestStatus] = useState<"idle" | "testing" | "complete">("idle");
  const [showThankYou, setShowThankYou] = useState(false);
  // Track which ratings have been interacted with
  const [touchedRatings, setTouchedRatings] = useState<Record<string, boolean>>({});
  // Track badge level based on ratings completed
  const [badgeLevel, setBadgeLevel] = useState<"none" | "bronze" | "silver" | "gold">("none");
  // Track if the quirky hint should be shown
  const [showRatingHint, setShowRatingHint] = useState(false);
  const { toast } = useToast();
  
  // Use our custom speed test hook
  const { 
    runTest, 
    isRunning, 
    progress: testProgress, 
    results: speedTestResults, 
    averageSpeed,
    error: speedTestError 
  } = useSpeedTest();

  const form = useForm<VibeCheckFormValues>({
    resolver: zodResolver(vibeCheckSchema),
    defaultValues: {
      locationName: "",
      city: "",
      vibeRating: 3,
      noiseLevel: 3,
      powerOutlets: 3,
      coffeeQuality: 3,
      staffFriendliness: 3,
      parking: 3,
      affordability: 3,
      videoCallQuality: 3,
      privacy: 3,
      accessibility: 3,
      comments: "",
      tribe: "",
      subProfession: "",
      email: "",
      wifiSpeed: 0,
    },
  });
  
  // Handle speed test results
  useEffect(() => {
    if (averageSpeed !== null) {
      form.setValue("wifiSpeed", averageSpeed);
      setWifiTestStatus("complete");
    }
  }, [averageSpeed, form]);
  
  // Handle speed test errors
  useEffect(() => {
    if (speedTestError) {
      toast({
        title: "Speed Test Error",
        description: speedTestError,
        variant: "destructive",
      });
    }
  }, [speedTestError, toast]);
  
  // Update test status based on running state
  useEffect(() => {
    if (isRunning) {
      setWifiTestStatus("testing");
    }
  }, [isRunning]);

  const runWifiSpeedTest = () => {
    setWifiTestStatus("testing");
    runTest();
  };

  const nextStep = () => {
    if (currentStep === 1) {
      const locationValid = form.trigger(["locationName", "city"]);
      if (!locationValid) return;
    }
    
    if (currentStep === 2 && wifiTestStatus !== "complete") {
      toast({
        title: "Please complete the Wi-Fi speed test",
        description: "Run the speed test before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: VibeCheckFormValues) => {
    try {
      // Filter out ratings that weren't interacted with
      const ratingFields = [
        "vibeRating", "noiseLevel", "privacy", "powerOutlets", 
        "parking", "accessibility", "coffeeQuality", 
        "staffFriendliness", "affordability", "videoCallQuality"
      ];
      
      const filteredData = { ...data };
      
      // For each rating field, set to undefined if it wasn't touched
      ratingFields.forEach(field => {
        if (!touchedRatings[field]) {
          // TypeScript workaround for dynamic property access
          (filteredData as any)[field] = undefined;
        }
      });
      
      // In a real implementation this would submit to the backend
      console.log("Submitting vibe check:", filteredData);
      
      // Show special messages based on completion level
      if (badgeLevel === "gold") {
        toast({
          title: "🏆 Perfect Vibe Check!",
          description: "You're a true community hero! Your complete rating will help countless remote workers.",
        });
      } else if (badgeLevel === "silver") {
        toast({
          title: "🥈 Vibe Check Submitted!",
          description: "Impressive contribution! Your detailed feedback is super valuable.",
        });
      } else if (badgeLevel === "bronze") {
        toast({
          title: "🥉 Vibe Check Submitted!",
          description: "Thanks for your contribution! Every rating helps our community.",
        });
      } else {
        toast({
          title: "Vibe Check Submitted!",
          description: "Thank you for contributing to our community data.",
        });
      }
      
      // Show thank you animation
      setShowThankYou(true);
      
      // Reset form and state
      form.reset();
      setCurrentStep(1);
      setWifiTestStatus("idle");
      setTouchedRatings({});
      setBadgeLevel("none");
      setShowRatingHint(false);
      setIsOpen(false);
      
      // Auto close thank you dialog after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your vibe check. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate badge level based on number of touched ratings
  const calculateBadgeLevel = (touched: Record<string, boolean>) => {
    const touchedCount = Object.values(touched).filter(Boolean).length;
    const totalRatings = 10; // Total number of rating sliders
    
    if (touchedCount >= totalRatings) return "gold";
    if (touchedCount >= Math.floor(totalRatings * 0.7)) return "silver";
    if (touchedCount >= Math.floor(totalRatings * 0.4)) return "bronze";
    return "none";
  };
  
  // Update touched ratings and badge level
  useEffect(() => {
    const newBadgeLevel = calculateBadgeLevel(touchedRatings);
    if (newBadgeLevel !== badgeLevel) {
      setBadgeLevel(newBadgeLevel);
      
      // Show toast notification for badge achievements
      if (newBadgeLevel === "bronze" && badgeLevel === "none") {
        toast({
          title: "🥉 Bronze Reviewer Badge Earned!",
          description: "You're off to a great start! Keep rating to level up.",
        });
      } else if (newBadgeLevel === "silver" && badgeLevel !== "silver" && badgeLevel !== "gold") {
        toast({
          title: "🥈 Silver Reviewer Badge Earned!",
          description: "Impressive progress! Just a few more ratings to go.",
        });
      } else if (newBadgeLevel === "gold" && badgeLevel !== "gold") {
        toast({
          title: "🥇 Gold Reviewer Badge Earned!",
          description: "Wow! You've rated everything. You're a Vibe Check Champion!",
        });
      }
    }
  }, [touchedRatings, badgeLevel, toast]);
  
  // Show a hint if user tries to proceed without interacting with any sliders
  useEffect(() => {
    if (currentStep === 3 && Object.keys(touchedRatings).length === 0) {
      setShowRatingHint(true);
      
      // Auto-hide hint after 5 seconds
      const timer = setTimeout(() => {
        setShowRatingHint(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, touchedRatings]);

  const renderRatingSlider = (name: keyof VibeCheckFormValues, label: string, description: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <div className="flex justify-between">
            <FormLabel className="flex items-center">
              {label}
              {touchedRatings[name] && (
                <span className="ml-2 text-green-500 text-xs">
                  <i className="fas fa-check-circle"></i>
                </span>
              )}
            </FormLabel>
            <span className="font-medium">{field.value}/5</span>
          </div>
          <FormControl>
            <Slider
              min={1}
              max={5}
              step={1}
              defaultValue={[3]}
              value={[field.value as number]}
              onValueChange={(vals) => {
                field.onChange(vals[0]);
                // Mark this rating as touched
                const wasAlreadyTouched = touchedRatings[name];
                setTouchedRatings(prev => ({...prev, [name]: true}));
                
                // Only show quirky messages for first interaction with each slider
                if (!wasAlreadyTouched) {
                  // Random quirky messages
                  const quirkMessages = [
                    "Coffee spill avoided! Your rating powers have increased! ☕",
                    "You're like the Indiana Jones of coffee shop rating! 🏺",
                    "Achievement unlocked: Rating Wizard! 🧙‍♂️",
                    "That rating was so smooth, even your coffee is jealous! ✨",
                    "Another rating! You're on fire! 🔥 (Not literally, don't spill your coffee)",
                    "Keyboard warriors get coffee breaks too! Keep rating! ⚔️",
                    "Your feedback makes our data-loving hearts skip a beat! 💓",
                    "Ten out of ten coffee beans approve of your rating style! 👍",
                    "Rating like a boss! Your productivity level just increased by 42%! 📈",
                    "Remote work hero status: INCREASING! ⭐"
                  ];
                  
                  // Show a random message
                  const randomMessage = quirkMessages[Math.floor(Math.random() * quirkMessages.length)];
                  
                  // Show toast with random timing (to make it feel more playful)
                  setTimeout(() => {
                    toast({
                      title: "Rating Progress",
                      description: randomMessage,
                    });
                  }, Math.floor(Math.random() * 500) + 100); // Random delay between 100-600ms
                }
              }}
              className={`py-4 ${!touchedRatings[name] ? 'animate-pulse' : ''}`}
            />
          </FormControl>
          <FormDescription className="text-xs">{description}</FormDescription>
        </FormItem>
      )}
    />
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-6 rounded-lg transition-all duration-300 brand-btn">
            <i className="fas fa-wifi mr-2"></i> Add Vibe Check
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-coffee-brown">Add a Vibe Check</DialogTitle>
            <DialogDescription>
              Share your experience and help other remote workers find great places to work.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Step 1: Location Information</h3>
                  <FormField
                    control={form.control}
                    name="locationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coffee Shop Name</FormLabel>
                        <FormControl>
                          <CoffeeShopAutocomplete 
                            value={field.value} 
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Somerset West" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-tech-blue bg-opacity-5 p-4 rounded-lg">
                    <p className="text-sm">
                      <i className="fas fa-info-circle mr-2 text-tech-blue"></i>
                      In the next steps, you'll rate various aspects of this location and test the Wi-Fi speed.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Step 2: Wi-Fi Speed Test</h3>
                  <div className="bg-soft-cream p-6 rounded-lg">
                    <div className="text-center mb-4">
                      <div className="inline-flex rounded-lg bg-white p-2 shadow-sm mb-4">
                        <div className="text-4xl font-bold text-tech-blue">
                          {wifiTestStatus === "complete" 
                            ? `${form.getValues("wifiSpeed")}` 
                            : wifiTestStatus === "testing" ? "..." : "?"} 
                          <span className="text-sm font-normal">Mbps</span>
                        </div>
                      </div>
                      <p className="text-sm mb-3">
                        {wifiTestStatus === "idle" && "Run the test to measure the current Wi-Fi speed"}
                        {wifiTestStatus === "testing" && "Testing in progress..."}
                        {wifiTestStatus === "complete" && "Test complete! Results are an average of 3 measurements."}
                      </p>
                      
                      <SpeedTestAnimation isActive={wifiTestStatus === "testing"} />
                      
                      {wifiTestStatus === "testing" && (
                        <Progress value={testProgress} className="mb-4 h-2" />
                      )}
                      
                      {wifiTestStatus === "complete" && (
                        <div className="flex justify-center gap-4 mb-4">
                          {speedTestResults.map((result, index) => (
                            <div key={index} className="text-center">
                              <div className="text-sm font-medium">Test {index + 1}</div>
                              <div className="font-bold text-tech-blue">{result.downloadSpeed} Mbps</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button 
                        type="button"
                        onClick={runWifiSpeedTest}
                        className="bg-tech-blue hover:bg-opacity-80 text-white py-2 px-4 rounded-lg transition-all duration-300"
                        disabled={wifiTestStatus === "testing"}
                      >
                        {wifiTestStatus === "idle" && <><i className="fas fa-wifi mr-2"></i> Run Speed Test</>}
                        {wifiTestStatus === "testing" && <><i className="fas fa-spinner fa-spin mr-2"></i> Testing...</>}
                        {wifiTestStatus === "complete" && <><i className="fas fa-redo mr-2"></i> Run Again</>}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-tech-blue bg-opacity-5 p-4 rounded-lg">
                    <p className="text-sm">
                      <i className="fas fa-info-circle mr-2 text-tech-blue"></i>
                      This test measures download speed. For the most accurate results, make sure you're not running other bandwidth-intensive applications.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h3 className="text-lg font-medium">Step 3: Rate the Space</h3>
                    
                    {/* Badge display */}
                    {badgeLevel !== "none" && (
                      <div className="flex items-center mt-2 sm:mt-0 bg-soft-cream rounded-full px-3 py-1 text-sm">
                        <span className="mr-2">
                          {badgeLevel === "bronze" && "🥉"}
                          {badgeLevel === "silver" && "🥈"}
                          {badgeLevel === "gold" && "🥇"}
                        </span>
                        <span className="font-medium">
                          {badgeLevel === "bronze" && "Bronze Reviewer"}
                          {badgeLevel === "silver" && "Silver Reviewer"}
                          {badgeLevel === "gold" && "Gold Reviewer"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gamification hint */}
                  {showRatingHint && (
                    <div className="bg-vibe-yellow bg-opacity-20 p-3 rounded-lg mb-3 animate-pulse">
                      <p className="text-sm font-medium flex items-center">
                        <span className="text-xl mr-2">🧙‍♂️</span>
                        <span>Psst! Move the sliders to earn reviewer badges. Each rating helps others find their perfect workspace!</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Progress bar showing rating completion */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Rating progress</span>
                      <span>{Object.values(touchedRatings).filter(Boolean).length}/10 completed</span>
                    </div>
                    <Progress 
                      value={Object.values(touchedRatings).filter(Boolean).length * 10} 
                      className="h-2"
                    />
                  </div>
                  
                  <Tabs defaultValue="atmosphere" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="atmosphere">Atmosphere</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="atmosphere" className="space-y-4">
                      {renderRatingSlider("vibeRating", "Overall Vibe", "How's the general atmosphere for working?")}
                      {renderRatingSlider("noiseLevel", "Noise Level", "1 = Very noisy, 5 = Perfect quiet")}
                      {renderRatingSlider("privacy", "Privacy", "How suitable for private conversations?")}
                    </TabsContent>
                    
                    <TabsContent value="amenities" className="space-y-4">
                      {renderRatingSlider("powerOutlets", "Power Outlets", "Availability of power outlets")}
                      {renderRatingSlider("parking", "Parking", "Ease and availability of parking")}
                      {renderRatingSlider("accessibility", "Accessibility", "How accessible is it for people with disabilities?")}
                    </TabsContent>
                    
                    <TabsContent value="experience" className="space-y-4">
                      {renderRatingSlider("coffeeQuality", "Coffee Quality", "How good are the drinks?")}
                      {renderRatingSlider("staffFriendliness", "Staff Friendliness", "How friendly is the staff to remote workers?")}
                      {renderRatingSlider("affordability", "Affordability", "1 = Expensive, 5 = Great value")}
                      {renderRatingSlider("videoCallQuality", "Video Call Quality", "How suitable for video meetings?")}
                    </TabsContent>
                  </Tabs>
                  
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Comments</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share any additional insights about this location..." 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Step 4: About You</h3>
                  <FormField
                    control={form.control}
                    name="tribe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Tribe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your tribe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {creatureTribes.map((tribe) => (
                              <SelectItem key={tribe.id} value={tribe.id}>
                                {tribe.title} ({tribe.description})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subProfession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Full-stack Developer, Copywriter, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          We'll only use this to notify you when this location gets updates.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-tech-blue bg-opacity-5 p-4 rounded-lg">
                    <p className="text-sm">
                      <i className="fas fa-info-circle mr-2 text-tech-blue"></i>
                      Your vibe check helps the entire community find great places to work. Thank you for contributing!
                    </p>
                  </div>
                </div>
              )}

              <DialogFooter className="flex justify-between">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="mr-auto"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-tech-blue hover:bg-opacity-80 text-white ml-auto"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold ml-auto"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Vibe Check"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Thank you animation */}
      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center relative">
            <h3 className="text-2xl font-bold text-coffee-brown mb-4">Thank You!</h3>
            <p className="mb-4">Your vibe check helps our community find the perfect workspaces!</p>
            
            <div className="mb-6">
              <a href="#speed-test" onClick={() => setShowThankYou(false)}>
                <Button 
                  type="button"
                  className="bg-tech-blue hover:bg-opacity-80 text-white"
                  onClick={() => {
                    setShowThankYou(false);
                    // Allow time for animation to close before scrolling
                    setTimeout(() => {
                      document.getElementById('speed-test')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <i className="fas fa-wifi mr-2"></i> Run a Wi-Fi Speed Test Next
                </Button>
              </a>
            </div>
            
            <div className="flex justify-center mb-4">
              {/* High five and fist bump SVG animation */}
              <svg width="160" height="100" viewBox="0 0 160 100">
                <g className="high-five">
                  <path d="M40,80 C30,75 25,65 25,50 C25,40 30,35 35,35 C40,35 45,40 45,50 C45,60 42,70 40,80 Z" fill="#f8d7c9" />
                  <path d="M40,40 L40,60 L45,63 L50,60 L50,40 L45,37 Z" fill="#f8d7c9" />
                  <path d="M50,40 L50,60 L55,63 L60,60 L60,40 L55,37 Z" fill="#f8d7c9" />
                  <path d="M60,40 L60,60 L65,63 L70,60 L70,40 L65,37 Z" fill="#f8d7c9" />
                  <path d="M70,40 L70,60 L75,63 L80,60 L80,40 L75,37 Z" fill="#f8d7c9" />
                  <path d="M80,80 C90,75 95,65 95,50 C95,40 90,35 85,35 C80,35 75,40 75,50 C75,60 78,70 80,80 Z" fill="#f8d7c9" />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="30 0"
                    dur="0.5s"
                    begin="0s"
                    fill="freeze"
                  />
                </g>
                
                <g className="fist-bump">
                  <path d="M120,60 C125,55 130,50 130,40 C130,30 125,25 120,25 C115,25 110,30 110,40 C110,50 115,55 120,60 Z" fill="#f8d7c9" />
                  <path d="M100,50 C95,45 90,40 90,30 C90,20 95,15 100,15 C105,15 110,20 110,30 C110,40 105,45 100,50 Z" fill="#f8d7c9" />
                  <rect x="100" y="40" width="20" height="20" rx="10" fill="#f8d7c9" />
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    from="0 0"
                    to="-30 0"
                    dur="0.5s"
                    begin="0s"
                    fill="freeze"
                  />
                </g>
                
                {/* Impact starburst */}
                <g opacity="0">
                  <path d="M80,50 L85,40 L90,50 L100,45 L95,55 L105,60 L95,65 L100,75 L90,70 L85,80 L80,70 L70,75 L75,65 L65,60 L75,55 L70,45 Z" fill="#FFD700" />
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.1s"
                    begin="0.5s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="opacity"
                    from="1"
                    to="0"
                    dur="0.5s"
                    begin="0.7s"
                    fill="freeze"
                  />
                </g>
              </svg>
            </div>
            
            <p className="text-sm text-gray-500">Closing automatically...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default VibeCheckForm;