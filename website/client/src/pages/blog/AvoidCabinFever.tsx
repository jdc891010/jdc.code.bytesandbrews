import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const AvoidCabinFever = () => {
  return (
    <section className="py-28 bg-vibe-yellow bg-opacity-10 page-section">
      <Helmet>
        <title>How to Avoid Cabin Fever When You Work from Home - Brews and Bytes</title>
        <meta name="description" content="Working from home can be isolating. Here are some tips to help you avoid cabin fever and stay connected." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Escaping the Cabin: A Remote Worker's Guide to Staying Sane
          </motion.h1>
          <motion.p 
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Don't let the walls close in. Here's how to stay fresh and motivated.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>The freedom of remote work is a double-edged sword. While you have the flexibility to work from anywhere, you can also easily fall into a routine of isolation, leading to the dreaded cabin fever. Here are some practical tips to keep your mind and body sharp.</p>
            
            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">1. The Third Place</h2>
            <p>The concept of a "third place" – a public place that is not home or work – is crucial for remote workers. This could be a coffee shop, a library, or a co-working space. Spending a few hours in a third place can break the monotony of your home office and provide a much-needed change of scenery.</p>
            <p>Brews & Bytes is designed to help you find the perfect third place. With our database of coffee shops and co-working spaces, you can find a spot that fits your needs and your vibe.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">2. Get Moving</h2>
            <p>Physical activity is a powerful antidote to cabin fever. Make time for exercise every day, whether it's a walk in the park, a yoga session in your living room, or a trip to the gym. The key is to get your body moving and your blood flowing.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">3. Connect with Humans</h2>
            <p>It's easy to go a whole day without speaking to another person when you work from home. Make a conscious effort to connect with friends, family, and colleagues. Schedule video calls, meet up for lunch, or join a local meetup group.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">4. Learn Something New</h2>
            <p>Engage your mind in something other than work. Take an online course, learn a new language, or pick up a new hobby. This will help you to stay mentally stimulated and prevent you from feeling bored and restless.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">5. Explore Your City</h2>
            <p>Be a tourist in your own city. Visit a museum, check out a new restaurant, or simply wander around a neighborhood you've never been to before. This will help you to feel more connected to your community and less confined to your home.</p>

            <p className="mt-8">By incorporating these habits into your routine, you can combat cabin fever and thrive as a remote worker. Remember, the key is to be proactive and intentional about your well-being.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvoidCabinFever;
