import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simple contact form schema
const contactFormSimpleSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(2, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  captcha: z.string().min(1, { message: "Please complete the captcha verification" }),
});

type ContactFormSimpleValues = z.infer<typeof contactFormSimpleSchema>;

const ContactFormSimple = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const { toast } = useToast();
  
  // Generate a simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`What is ${num1} + ${num2}?`);
    setCaptchaAnswer(String(num1 + num2));
  };

  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  
  // Initialize captcha on component mount
  useState(() => {
    generateCaptcha();
  });
  
  const form = useForm<ContactFormSimpleValues>({
    resolver: zodResolver(contactFormSimpleSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      captcha: "",
    },
  });

  const onSubmit = async (data: ContactFormSimpleValues) => {
    setIsSubmitting(true);
    
    // Verify captcha
    if (data.captcha !== captchaAnswer) {
      form.setError("captcha", { 
        type: "manual", 
        message: "Incorrect answer. Please try again." 
      });
      setIsSubmitting(false);
      generateCaptcha();
      return;
    }
    
    try {
      await apiRequest("POST", "/api/contact", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      
      toast({
        title: "Message sent!",
        description: "Thank you for your feedback. We'll get back to you soon.",
      });
      
      form.reset();
      generateCaptcha();
    } catch (error) {
      toast({
        title: "Message failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h3 className="font-bold text-xl text-coffee-brown mb-4">Send Us a Message</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="feature-request">Feature Request</SelectItem>
                    <SelectItem value="bug-report">Report a Bug</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                    <SelectItem value="coffee-shop-owner">I'm a Coffee Shop Owner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[120px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Simple Captcha */}
          <FormField
            control={form.control}
            name="captcha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verify you're human: {captchaQuestion}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your answer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 transition-all duration-300 brand-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactFormSimple;