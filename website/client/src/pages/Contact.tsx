import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const Contact = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-coffee-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="font-bold text-4xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Get in Touch
            </motion.h1>
            <motion.p 
              className="text-xl mb-6 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Have questions or want to partner with us? Drop us a line!
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
          >
            {/* Contact Form */}
            <motion.div variants={fadeIn("right")}>
              <ContactForm />
            </motion.div>
            
            {/* Contact Info & Coffee Shop Owners */}
            <motion.div variants={fadeIn("left")}>
              <h2 className="font-bold text-xl mb-6">Coffee Shop Owners</h2>
              <p className="mb-6">Want your coffee shop to be featured on Brews and Bytes? We'd love to have you! Being Brews and Bytes certified can bring new customers to your door.</p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-tech-blue rounded-full p-2 text-white mt-1 mr-4">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <h3 className="font-bold">Increase Foot Traffic</h3>
                    <p className="text-sm">Remote workers stay longer and spend more on average</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-tech-blue rounded-full p-2 text-white mt-1 mr-4">
                    <i className="fas fa-wifi"></i>
                  </div>
                  <div>
                    <h3 className="font-bold">Showcase Your Wi-Fi</h3>
                    <p className="text-sm">If you've invested in great internet, let workers know!</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-tech-blue rounded-full p-2 text-white mt-1 mr-4">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <h3 className="font-bold">Build Community</h3>
                    <p className="text-sm">Become a hub for creatives and professionals in your area</p>
                  </div>
                </div>
              </div>
              
              <Button className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-6 rounded-lg transition-all duration-300 brand-btn">
                Partner With Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Our Office</h2>
            <p className="text-lg max-w-2xl mx-auto">Where coffee meets code - our virtual headquarters</p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-soft-cream rounded-xl overflow-hidden shadow-md">
              <div className="h-64 bg-coffee-brown relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white opacity-80 font-mono tracking-wide leading-loose">
                    <pre className="text-xs md:text-sm">
                      ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕<br />
                      ☕   B R E W S   ☕<br />
                      ☕    A N D      ☕<br />
                      ☕   B Y T E S   ☕<br />
                      ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕<br />
                    </pre>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-coffee-brown/80"></div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">Somerset West HQ</h3>
                <p className="mb-3">Somerset West<br />South Africa</p>
                <p className="text-sm text-tech-blue">
                  <i className="fas fa-envelope mr-2"></i> hello@brewsandbytes.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-tech-blue bg-opacity-5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Frequently Asked Questions</h2>
            <p className="text-lg max-w-2xl mx-auto">Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-2">How quickly do you respond to inquiries?</h3>
                <p>We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate in the subject line.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-2">How can I contribute Wi-Fi speed data?</h3>
                <p>Visit one of our listed coffee shops and use our rating system to submit your experience. Accurate, recent data helps the entire community!</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-xl mb-2">How can I submit my coffee shop for inclusion?</h3>
                <p>Coffee shop owners can use the contact form (select "I'm a Coffee Shop Owner" as the subject) to have your location featured on our platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-coffee-brown text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-3xl mb-4">Stay Updated</h2>
            <p className="mb-8 opacity-90">Subscribe to our newsletter for the latest coffee shop recommendations and remote work tips from Somerset West.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-lg focus:outline-none text-dark-brown w-full sm:w-auto flex-grow max-w-md"
              />
              <Button className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-3 px-8 rounded-lg transition-all duration-300 brand-btn">
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-70">We send one newsletter per month. No spam, just great content.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
