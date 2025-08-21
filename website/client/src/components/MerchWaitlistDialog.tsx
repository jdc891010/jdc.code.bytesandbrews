import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ThankYouAnimation from "./ThankYouAnimation";

// Define the schema for the merch waitlist form
const merchWaitlistSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }),
  captchaVerified: z.boolean().refine(val => val === true, {
    message: "Please verify that you're human."
  }),
});

type MerchWaitlistValues = z.infer<typeof merchWaitlistSchema>;

interface MerchWaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MerchWaitlistDialog = ({ open, onOpenChange }: MerchWaitlistDialogProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<number | null>(null);
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState<string>('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const form = useForm<MerchWaitlistValues>({
    resolver: zodResolver(merchWaitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      captchaVerified: false,
    },
  });

  // Generate a simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaValue(num1 + num2);
    return `${num1} + ${num2} = ?`;
  };

  // Check captcha answer
  const verifyCaptcha = () => {
    if (parseInt(userCaptchaAnswer) === captchaValue) {
      setIsCaptchaVerified(true);
      form.setValue("captchaVerified", true);
      return true;
    } else {
      setIsCaptchaVerified(false);
      form.setValue("captchaVerified", false);
      // Generate a new captcha question
      generateCaptcha();
      setUserCaptchaAnswer('');
      return false;
    }
  };

  // Handle form submission
  const onSubmit = async (data: MerchWaitlistValues) => {
    console.log("Merch waitlist form submitted:", data);
    
    // In a real application, this would be an API call to save the data
    // Here we're just simulating success
    setTimeout(() => {
      setIsSubmitted(true);
      
      // Reset form after a few seconds
      setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
        setIsCaptchaVerified(false);
        setCaptchaValue(null);
        setUserCaptchaAnswer('');
        onOpenChange(false);
      }, 3000);
    }, 1000);
  };

  // Initialize captcha when dialog opens
  useEffect(() => {
    if (open && !captchaValue) {
      generateCaptcha();
    }
  }, [open, captchaValue]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Join the Merch Waitlist</DialogTitle>
            <DialogDescription className="text-center">
              Be the first to know when our branded merch becomes available!
            </DialogDescription>
          </DialogHeader>

          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
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
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll only use this to notify you about merch availability.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Verify you're human</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white p-2 rounded border border-gray-200 font-medium">
                      {captchaValue ? `${Math.floor(Math.random() * 10) + 1} + ${Math.floor(Math.random() * 10) + 1} = ?` : "Loading..."}
                    </div>
                    <Input
                      type="text"
                      placeholder="Answer"
                      value={userCaptchaAnswer}
                      onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                      className="max-w-[100px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={verifyCaptcha}
                    >
                      Verify
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="captchaVerified"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="captchaVerified"
                            checked={isCaptchaVerified}
                            disabled={true} // This is controlled by the verify button
                          />
                          <label
                            htmlFor="captchaVerified"
                            className={`text-sm font-medium leading-none ${isCaptchaVerified ? 'text-green-600' : 'text-gray-600'}`}
                          >
                            {isCaptchaVerified ? 'Human verified ✓' : 'Verification required'}
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="mt-4">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown mt-4"
                    disabled={!isCaptchaVerified}
                  >
                    Join Waitlist
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="py-8">
              <ThankYouAnimation
                open={isSubmitted}
                message="Thanks for joining our merch waitlist! We'll notify you when items become available."
                onClose={() => {}}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MerchWaitlistDialog;