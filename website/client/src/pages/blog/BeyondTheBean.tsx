
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const BeyondTheBean = () => {
  return (
    <section className="py-28 bg-vibe-yellow bg-opacity-10 page-section">
      <Helmet>
        <title>Beyond the Bean: Natural Ways to Boost Your Energy and Focus - Brews and Bytes</title>
        <meta name="description" content="Looking for ways to boost your energy without caffeine? Here are some natural methods to help you stay focused and productive." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Beyond the Bean: Natural Ways to Boost Your Energy and Focus
          </motion.h1>
          <motion.p 
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Energize your day, naturally.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>While we love a good cup of coffee, sometimes you need an energy boost without the caffeine. Whether you're looking to reduce your caffeine intake or simply want to explore other options, here are some natural ways to enhance your focus and productivity.</p>
            
            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">1. The Power of Movement</h2>
            <p>A short walk, a quick yoga session, or even just a few stretches can do wonders for your energy levels. Exercise increases blood flow to the brain, which can help you think more clearly and feel more alert. If you're feeling sluggish, get up and move your body for a few minutes.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">2. Fuel Your Brain</h2>
            <p>The food you eat has a direct impact on your energy levels. Opt for a balanced diet rich in fruits, vegetables, and whole grains. Avoid sugary snacks and processed foods, which can lead to energy crashes. And don't forget to stay hydrated by drinking plenty of water throughout the day.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">3. The Magic of Mindfulness</h2>
            <p>Meditation and deep breathing exercises can help to calm your mind and improve your focus. When you're feeling overwhelmed or distracted, take a few minutes to sit in a quiet space and focus on your breath. This can help you to clear your mind and return to your work with renewed focus.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">4. The Power of a Change of Scenery</h2>
            <p>Sometimes, all you need is a change of environment to feel more energized. If you're feeling stuck in a rut, pack up your laptop and head to a new location. A different coffee shop, a park, or even just a different room in your house can help to stimulate your mind and boost your creativity.</p>
            <p>Brews & Bytes can help you find the perfect change of scenery. With our database of coffee shops and co-working spaces, you can find a spot that will help you to feel refreshed and inspired.</p>

            <p className="mt-8">By incorporating these natural energy boosters into your routine, you can stay focused and productive without relying on caffeine. Give them a try and see what works best for you.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeyondTheBean;
