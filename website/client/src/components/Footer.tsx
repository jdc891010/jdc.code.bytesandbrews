import { Link } from "wouter";
import Logo from "./Logo";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-coffee-brown text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Logo size="small" />
            </Link>
            <p className="text-sm opacity-80 mb-4">Find coffee shops where brews power bytes and vibes spark brilliance.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-vibe-yellow transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-vibe-yellow transition-colors" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-vibe-yellow transition-colors" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white hover:text-vibe-yellow transition-colors" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/tribes" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Creature Tribes
                </Link>
              </li>

            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">



              <li>
                <Link href="/features" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Wi-Fi Speed Test
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-sm opacity-80 mb-4">Subscribe to our newsletter for the latest updates and coffee shop finds.</p>
            <form className="flex" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-l-lg rounded-r-none focus:outline-none text-dark-brown w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="bg-vibe-yellow text-coffee-brown font-bold px-4 rounded-l-none rounded-r-lg hover:bg-opacity-80 transition-all"
                disabled={isSubmitting}
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-70">&copy; {new Date().getFullYear()} Brews and Bytes. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="/privacy-policy" className="text-xs opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-xs opacity-70 hover:opacity-100 transition-opacity">Terms of Service</Link>
            <a href="#" className="text-xs opacity-70 hover:opacity-100 transition-opacity">Cookie Policy</a>
            <Link href="/admin/login" className="text-xs opacity-70 hover:opacity-100 transition-opacity">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
