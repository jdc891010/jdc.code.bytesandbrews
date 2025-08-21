import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SignUpForm from "@/components/SignUpForm";
import { fadeIn, staggerContainer, fadeInUp } from "@/lib/animations";
import { Helmet } from "react-helmet-async";

const Download = () => {
  const [showAppFeatures, setShowAppFeatures] = useState(true);
  
  const appFeatures = [
    {
      title: "Wi-Fi Speed Testing",
      description: "Check real-time speeds and view historical data for any coffee shop in our database.",
      icon: "fas fa-wifi"
    },
    {
      title: "Atmosphere Ratings",
      description: "Find spaces that match your vibe preferences from 'Quiet Zen' to 'Creative Chaos'.",
      icon: "fas fa-heart"
    },
    {
      title: "Community Insights",
      description: "See which professionals frequent each location and connect with your tribe.",
      icon: "fas fa-users"
    },
    {
      title: "Workspace Details",
      description: "Power outlet availability, seating comfort, lighting quality, and more.",
      icon: "fas fa-plug"
    },
    {
      title: "Favorite Spots",
      description: "Save your go-to workspaces for quick reference and get notified about speed changes.",
      icon: "fas fa-star"
    },
    {
      title: "Offline Access",
      description: "Download coffee shop details for access even when you're offline.",
      icon: "fas fa-cloud-download-alt"
    }
  ];

  const testimonials = [
    {
      quote: "I increased my productivity by 40% after finding my perfect workspace through Brews and Bytes.",
      author: "James K., Freelance Developer"
    },
    {
      quote: "As someone who travels constantly, this app has been life-changing for finding reliable workspaces.",
      author: "Leila M., Digital Nomad"
    },
    {
      quote: "The tribe feature connected me with other creative professionals in my city. We now meet weekly!",
      author: "Carlos R., Graphic Designer"
    }
  ];

  return (
    <div className="pt-20">
      <Helmet>
        <title>Download the Brews and Bytes App</title>
        <meta name="description" content="Download the Brews and Bytes app to find the best coffee shops for remote work. Available on the App Store and Google Play." />
      </Helmet>
      {/* Hero Section */}
      <section className="py-16 bg-coffee-brown text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeIn("right")}>
              <h1 className="font-bold text-4xl mb-4">Get Brewing</h1>
              <p className="text-lg mb-6 opacity-90">Join our community of remote workers and start finding your perfect workspace today.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="#" className="flex items-center justify-center bg-black hover:bg-opacity-80 rounded-lg px-5 py-3 transition-all">
                  <i className="fab fa-apple text-2xl mr-3"></i>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center justify-center bg-black hover:bg-opacity-80 rounded-lg px-5 py-3 transition-all">
                  <i className="fab fa-google-play text-2xl mr-3"></i>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-vibe-yellow">50K+</div>
                  <div className="text-sm opacity-80">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vibe-yellow">10K+</div>
                  <div className="text-sm opacity-80">Coffee Shops</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vibe-yellow">8</div>
                  <div className="text-sm opacity-80">Creature Tribes</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn("left")}
              className="relative hidden md:block"
            >
              <div className="relative z-10 bg-white p-2 rounded-3xl shadow-xl rotate-3 transform">
                <img 
                  src="https://placehold.co/800x400/E8D4B2/6F4E37?text=App+Screenshot" 
                  alt="App screenshot" 
                  className="rounded-2xl" 
                />
              </div>
              <div className="absolute top-10 -right-5 w-60 h-60 bg-tech-blue rounded-full filter blur-3xl opacity-20 z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-vibe-yellow rounded-full filter blur-3xl opacity-20 z-0"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* App Features */}
      <section className="py-16 bg-soft-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Why You'll Love Brews and Bytes</h2>
            <p className="text-lg max-w-2xl mx-auto">Our app is packed with features designed specifically for remote workers and digital nomads</p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                className={`px-4 py-2 ${showAppFeatures ? 'bg-coffee-brown text-white' : 'bg-white text-coffee-brown'}`}
                onClick={() => setShowAppFeatures(true)}
              >
                App Features
              </button>
              <button
                className={`px-4 py-2 ${!showAppFeatures ? 'bg-coffee-brown text-white' : 'bg-white text-coffee-brown'}`}
                onClick={() => setShowAppFeatures(false)}
              >
                User Testimonials
              </button>
            </div>
          </div>

          {showAppFeatures ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {appFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    custom={index * 0.1}
                    className="bg-white rounded-xl p-6 shadow-md"
                  >
                    <div className="bg-tech-blue bg-opacity-10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <i className={`${feature.icon} text-tech-blue text-xl`}></i>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    custom={index * 0.1}
                    className="bg-white rounded-xl p-6 shadow-md"
                  >
                    <div className="flex items-start">
                      <div className="text-5xl text-tech-blue opacity-20 mr-4">
                        <i className="fas fa-quote-left"></i>
                      </div>
                      <div>
                        <p className="text-lg italic mb-4">{testimonial.quote}</p>
                        <p className="font-medium text-gray-600">{testimonial.author}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">The Brews and Bytes Difference</h2>
            <p className="text-lg max-w-2xl mx-auto">See how we compare to traditional coffee shop discovery methods</p>
          </div>

          <div className="overflow-x-auto max-w-6xl mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-coffee-brown text-white">
                  <th className="p-4 text-left">Features</th>
                  <th className="p-4 text-center">Brews and Bytes</th>
                  <th className="p-4 text-center">Regular Review Sites</th>
                  <th className="p-4 text-center">Social Media</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Real-time Wi-Fi Speeds</td>
                  <td className="p-4 text-center text-green-500"><i className="fas fa-check-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Profession-based Recommendations</td>
                  <td className="p-4 text-center text-green-500"><i className="fas fa-check-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                  <td className="p-4 text-center text-yellow-500"><i className="fas fa-minus-circle"></i></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Workspace-specific Details</td>
                  <td className="p-4 text-center text-green-500"><i className="fas fa-check-circle"></i></td>
                  <td className="p-4 text-center text-yellow-500"><i className="fas fa-minus-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-medium">Connect with Similar Professionals</td>
                  <td className="p-4 text-center text-green-500"><i className="fas fa-check-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                  <td className="p-4 text-center text-yellow-500"><i className="fas fa-minus-circle"></i></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Time-based Atmosphere Data</td>
                  <td className="p-4 text-center text-green-500"><i className="fas fa-check-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                  <td className="p-4 text-center text-red-500"><i className="fas fa-times-circle"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 bg-tech-blue bg-opacity-5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Join Our Waiting List</h2>
            <p className="text-lg max-w-2xl mx-auto">Be the first to know when we launch in your city or join our beta program</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-bold text-2xl text-coffee-brown mb-4">Coming Soon to Your City</h3>
              <p className="mb-6">We're rapidly expanding to new locations around the world. Sign up to be notified when Brews and Bytes launches in your area.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-tech-blue rounded-full p-1 text-white mt-1 mr-3">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold">Get Early Access</h4>
                    <p className="text-sm">Beta testers get premium features free for 6 months</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-tech-blue rounded-full p-1 text-white mt-1 mr-3">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold">Priority Support</h4>
                    <p className="text-sm">Direct line to our development team</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-tech-blue rounded-full p-1 text-white mt-1 mr-3">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-bold">Shape the Future</h4>
                    <p className="text-sm">Your feedback will help build the next features</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-1"></i> New York
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-1"></i> San Francisco
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-1"></i> London
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-1"></i> Berlin
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-spinner fa-spin text-tech-blue mr-1"></i> Toronto
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-spinner fa-spin text-tech-blue mr-1"></i> Sydney
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  <i className="fas fa-spinner fa-spin text-tech-blue mr-1"></i> Tokyo
                </div>
                <div className="bg-white border border-gray-200 rounded-full py-1 px-3 text-sm">
                  + 15 more coming soon
                </div>
              </div>
            </div>
            
            <SignUpForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl text-coffee-brown mb-4">Frequently Asked Questions</h2>
            <p className="text-lg max-w-2xl mx-auto">Everything you need to know about Brews and Bytes</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-soft-cream rounded-lg p-6">
                <h3 className="font-bold text-xl mb-2">Is Brews and Bytes free to use?</h3>
                <p>The basic version of Brews and Bytes is completely free. We also offer a premium tier with advanced features like offline access, reservation capabilities, and detailed analytics.</p>
              </div>
              
              <div className="bg-soft-cream rounded-lg p-6">
                <h3 className="font-bold text-xl mb-2">How accurate are the Wi-Fi speed tests?</h3>
                <p>Our Wi-Fi data is crowdsourced from real users in real-time. We display the average of the most recent tests, usually from the last 7 days, to ensure accuracy.</p>
              </div>
              
              <div className="bg-soft-cream rounded-lg p-6">
                <h3 className="font-bold text-xl mb-2">Can I add a coffee shop that's not listed?</h3>
                <p>Absolutely! We encourage users to add new locations. Simply use the "Add New Spot" feature in the app and provide basic details. You'll earn community points for your contribution.</p>
              </div>
              
              <div className="bg-soft-cream rounded-lg p-6">
                <h3 className="font-bold text-xl mb-2">What is a "Creature Tribe"?</h3>
                <p>Creature Tribes are our fun way of categorizing different types of remote workers. Joining a tribe helps you find workspaces that are popular with people in your profession and connect with like-minded professionals.</p>
              </div>
              
              <div className="bg-soft-cream rounded-lg p-6">
                <h3 className="font-bold text-xl mb-2">I'm a coffee shop owner. How can I get listed?</h3>
                <p>Visit our "For Coffee Shops" section in the app or <Link href="/contact"><a className="text-tech-blue underline">contact us</a></Link> directly. We offer free listings with the option for premium features to attract more remote workers to your location.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-coffee-brown text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-3xl mb-4">Ready to Find Your Perfect Workspace?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Download Brews and Bytes today and join thousands of remote workers who've found their ideal coffee shop workspaces.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="flex items-center justify-center bg-black hover:bg-opacity-80 rounded-lg px-5 py-3 transition-all">
              <i className="fab fa-apple text-2xl mr-3"></i>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </a>
            <a href="#" className="flex items-center justify-center bg-black hover:bg-opacity-80 rounded-lg px-5 py-3 transition-all">
              <i className="fab fa-google-play text-2xl mr-3"></i>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Download;
