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
      // In a real implementation this would submit to the backend
      console.log("Submitting vibe check:", data);
      
      toast({
        title: "Vibe Check Submitted!",
        description: "Thank you for contributing to our community data.",
      });
      
      // Show thank you animation
      setShowThankYou(true);
      
      // Reset form
      form.reset();
      setCurrentStep(1);
      setWifiTestStatus("idle");
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

  const renderRatingSlider = (name: keyof VibeCheckFormValues, label: string, description: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <div className="flex justify-between">
            <FormLabel>{label}</FormLabel>
            <span className="font-medium">{field.value}/5</span>
          </div>
          <FormControl>
            <Slider
              min={1}
              max={5}
              step={1}
              defaultValue={[3]}
              value={[field.value as number]}
              onValueChange={(vals) => field.onChange(vals[0])}
              className="py-4"
            />
          </FormControl>
          <FormDescription className="text-xs">{description}</FormDescription>
        </FormItem>
      )}
    />
  );

  return (
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
                <h3 className="text-lg font-medium">Step 3: Rate the Space</h3>
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
                  className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown ml-auto"
                >
                  Submit Vibe Check
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VibeCheckForm;