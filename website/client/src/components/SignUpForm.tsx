import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const signUpFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  tribe: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the Terms of Service and Privacy Policy"
  }),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const SignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      tribe: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/signup", data);
      
      toast({
        title: "Thank you for signing up!",
        description: "You've been added to our waitlist. We'll notify you when we launch in your city.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Sign-up failed",
        description: "There was an error processing your sign-up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-dark-brown rounded-xl p-6 shadow-lg">
      <h3 className="font-bold text-xl mb-4 text-center">Join the Waitlist</h3>
      <p className="text-sm mb-6 text-center">Be the first to know when we launch in your city or sign up for our beta program.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue" />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue" />
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
                <FormLabel>Your City</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tribe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Creature Tribe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-blue">
                      <SelectValue placeholder="Select your tribe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="code-conjurer">Code Conjurer</SelectItem>
                    <SelectItem value="web-wizard">Web Wizard</SelectItem>
                    <SelectItem value="pixel-pixie">Pixel Pixie</SelectItem>
                    <SelectItem value="frame-fiend">Frame Fiend</SelectItem>
                    <SelectItem value="word-weaver">Word Weaver</SelectItem>
                    <SelectItem value="story-spinner">Story Spinner</SelectItem>
                    <SelectItem value="buzz-beast">Buzz Beast</SelectItem>
                    <SelectItem value="deal-driver">Deal Driver</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms-of-service" className="text-tech-blue underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-tech-blue underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 brand-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Join Now'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
