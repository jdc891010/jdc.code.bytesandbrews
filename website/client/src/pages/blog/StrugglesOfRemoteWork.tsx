import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const StrugglesOfRemoteWork = () => {
  return (
    <section className="py-28 bg-vibe-yellow bg-opacity-10 page-section">
      <Helmet>
        <title>The Struggles of Remote Work - Brews and Bytes</title>
        <meta name="description" content="Remote work is not always easy. Learn about the common struggles and how to overcome them." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Unseen Struggles of Remote Work
          </motion.h1>
          <motion.p 
            className="text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            And how to conquer them.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>Remote work offers incredible freedom and flexibility, but it's not without its challenges. While the idea of working from your couch is appealing, the reality can sometimes be a struggle against loneliness, distraction, and the blurring lines between work and life.</p>
            
            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">The Battle with Loneliness</h2>
            <p>One of the most common complaints from remote workers is the sense of isolation. The casual conversations and camaraderie of an office environment are replaced by silence. This can lead to feelings of loneliness and detachment from your team.</p>
            <p><strong>Solution:</strong> Be intentional about social interaction. Schedule virtual coffee breaks with colleagues, join online communities, and make an effort to work from a coffee shop or co-working space a few times a week. Brews & Bytes can help you find a spot with the right vibe for you.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">The Distraction Dilemma</h2>
            <p>At home, you're surrounded by distractions. The laundry needs to be done, the dog needs to be walked, and your personal projects are always calling your name. It can be tough to stay focused on work when your personal life is just a few feet away.</p>
            <p><strong>Solution:</strong> Create a dedicated workspace. This doesn't have to be a separate room, but it should be a space that is reserved for work. Set clear boundaries with family members and roommates, and use tools and techniques like the Pomodoro Technique to stay on track.</p>

            <h2 className="font-montserrat font-bold text-2xl text-coffee-brown mt-8 mb-4">The Never-Ending Workday</h2>
            <p>When your home is your office, it can be difficult to switch off. The lines between work and personal life become blurred, and you may find yourself working longer hours than you would in a traditional office setting. This can lead to burnout and a poor work-life balance.</p>
            <p><strong>Solution:</strong> Set a strict schedule and stick to it. Define your work hours and make sure to take regular breaks. At the end of the day, shut down your computer and do something to signal the end of your workday, like going for a walk or a workout.</p>

            <p className="mt-8">Remote work is a journey, not a destination. By acknowledging the challenges and taking proactive steps to address them, you can create a fulfilling and productive remote work life. And remember, you're not alone in this. The Brews & Bytes community is here to support you every step of the way.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrugglesOfRemoteWork;
