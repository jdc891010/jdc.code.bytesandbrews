import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Link } from "wouter";

const LaunchCampaign = () => {
  return (
    <section className="py-28 bg-vibe-yellow bg-opacity-10 page-section">
      <Helmet>
        <title>Launch Campaign - Brews and Bytes</title>
        <meta name="description" content="Join the Brews and Bytes launch campaign! We're partnering with coffee shops and co-working spaces to build a community of remote workers." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Launch Campaign
          </motion.h1>
          <motion.p 
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Powering the future of remote work, one coffee shop at a time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://placehold.co/1000x600/E8D4B2/6F4E37?text=Launch+Campaign" 
              alt="Launch campaign" 
              className="rounded-xl shadow-lg w-full" 
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-montserrat font-bold text-3xl text-coffee-brown mb-6">Join Our Launch</h2>
            <p className="mb-6 text-gray-700">
              Brews & Bytes is on a mission to connect remote workers with the best coffee shops and co-working spaces. Our success depends on a thriving community of users and partners.
            </p>
            <p className="mb-6 text-gray-700">
              We're launching a campaign to bring together the best of the best. Here's how we're doing it and how you can be a part of it.
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl text-coffee-brown mb-12 text-center">Our Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.0 }}
            >
              <h3 className="font-montserrat font-bold text-xl text-coffee-brown mb-4">Influencers</h3>
              <p className="text-sm text-gray-600">We're partnering with local influencers and tech personalities to spread the word about Brews & Bytes. They'll be sharing their favorite spots and experiences on social media.</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-montserrat font-bold text-xl text-coffee-brown mb-4">Events</h3>
              <p className="text-sm text-gray-600">We'll be hosting launch events at partner coffee shops and co-working spaces. These events will be a great opportunity to network, enjoy great coffee, and learn more about our platform.</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-montserrat font-bold text-xl text-coffee-brown mb-4">Specials</h3>
              <p className="text-sm text-gray-600">Partner venues will be offering exclusive specials to Brews & Bytes users. This is our way of saying thank you for being a part of our community.</p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-coffee-brown/10 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-montserrat font-bold text-xl text-coffee-brown mb-4">Coupons</h3>
              <p className="text-sm text-gray-600">We'll be distributing coupons for free coffees and discounts at our partner locations. It's a win-win for both our users and our partners.</p>
            </motion.div>
          </div>
        </div>

        <motion.section 
          className="py-20 mt-20 bg-gradient-to-r from-coffee-brown via-tech-blue to-coffee-brown text-white text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.h2 
              className="font-montserrat text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Ready to Join the Movement?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Whether you're a remote worker looking for your next favorite spot or a coffee shop owner who wants to attract new customers, we want to hear from you.
            </motion.p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <motion.div
                  className="bg-vibe-yellow text-coffee-brown px-10 py-4 rounded-full font-montserrat font-semibold text-lg hover:bg-yellow-400 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Partner With Us
                </motion.div>
              </Link>
              <Link href="/#find-your-spot">
                <motion.div
                  className="bg-white text-coffee-brown px-10 py-4 rounded-full font-montserrat font-semibold text-lg hover:bg-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find a Spot
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default LaunchCampaign;
