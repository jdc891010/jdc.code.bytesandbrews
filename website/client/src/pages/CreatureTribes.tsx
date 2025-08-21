import { Button } from "@/components/ui/button";
import TribeCard from "@/components/TribeCard";
import TribeMatcher from "@/components/TribeMatcher";
import { motion } from "framer-motion";

const CreatureTribes = () => {
  const tribes = [
    {
      title: "Technology & IT",
      icon: "fas fa-laptop-code",
      colorClass: "bg-tech-blue",
      members: [
        { title: "Code Conjurer", description: "Software Developer" },
        { title: "Web Wizard", description: "Web Developer" },
        { title: "Cloud Commander", description: "DevOps Engineer" },
        { title: "Data Druid", description: "Data Scientist" }
      ]
    },
    {
      title: "Creative & Design",
      icon: "fas fa-paint-brush",
      colorClass: "bg-vibe-yellow",
      members: [
        { title: "Pixel Pixie", description: "Graphic Designer" },
        { title: "Frame Fiend", description: "Video Editor" },
        { title: "UI Unicorn", description: "UI/UX Designer" },
        { title: "Motion Mage", description: "Animator" }
      ]
    },
    {
      title: "Writing & Content",
      icon: "fas fa-feather-alt",
      colorClass: "bg-coffee-brown",
      members: [
        { title: "Word Weaver", description: "Copywriter" },
        { title: "Story Spinner", description: "Content Writer" },
        { title: "Blog Bard", description: "Blogger" },
        { title: "Script Sorcerer", description: "Screenwriter" }
      ]
    },
    {
      title: "Marketing & Sales",
      icon: "fas fa-bullhorn",
      colorClass: "bg-tech-blue bg-opacity-70",
      members: [
        { title: "Buzz Beast", description: "Digital Marketer" },
        { title: "Deal Driver", description: "Sales Rep" },
        { title: "Social Sage", description: "Social Media Manager" },
        { title: "Growth Guru", description: "Growth Hacker" }
      ]
    },
    {
      title: "Business & Finance",
      icon: "fas fa-chart-line",
      colorClass: "bg-coffee-brown bg-opacity-70",
      members: [
        { title: "Number Ninja", description: "Accountant" },
        { title: "Cash Conjurer", description: "Financial Analyst" },
        { title: "Plan Prophet", description: "Business Strategist" },
        { title: "Risk Ranger", description: "Consultant" }
      ]
    },
    {
      title: "Education & Coaching",
      icon: "fas fa-graduation-cap",
      colorClass: "bg-vibe-yellow bg-opacity-70",
      members: [
        { title: "Mind Mentor", description: "Teacher/Professor" },
        { title: "Wisdom Walker", description: "Coach" },
        { title: "Knowledge Knight", description: "Trainer" },
        { title: "Thought Thriver", description: "Course Creator" }
      ]
    },
    {
      title: "Health & Wellness",
      icon: "fas fa-heartbeat",
      colorClass: "bg-tech-blue bg-opacity-50",
      members: [
        { title: "Wellness Warlock", description: "Wellness Coach" },
        { title: "Fitness Fairy", description: "Personal Trainer" },
        { title: "Nutrition Nomad", description: "Nutritionist" },
        { title: "Mind Mender", description: "Therapist" }
      ]
    },
    {
      title: "Multimedia & Entertainment",
      icon: "fas fa-film",
      colorClass: "bg-coffee-brown bg-opacity-50",
      members: [
        { title: "Podcast Paladin", description: "Podcaster" },
        { title: "Stream Sovereign", description: "Streamer" },
        { title: "Sound Shaman", description: "Audio Producer" },
        { title: "Vlog Viking", description: "Video Creator" }
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="tribes" className="py-28 bg-soft-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 
            className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Your Fellow Creatures
          </motion.h1>
          <motion.p 
            className="text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect with like-minded professionals in your quirky tribe
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tribes.map((tribe, index) => (
            <motion.div key={index} variants={item} className="h-full">
              <div className="h-full">
                <TribeCard
                  title={tribe.title}
                  icon={tribe.icon}
                  colorClass={tribe.colorClass}
                  members={tribe.members}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tribe Benefits */}
        <div className="max-w-5xl mx-auto mt-20 bg-white rounded-xl shadow-lg p-8">
          <h2 className="font-bold text-2xl text-coffee-brown mb-6 text-center">Why Join a Creature Tribe?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-tech-blue w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3 className="font-bold text-xl mb-2">Find Your People</h3>
              <p>Connect with professionals who understand your specific work needs and challenges</p>
            </div>
            
            <div className="text-center">
              <div className="bg-vibe-yellow w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="font-bold text-xl mb-2">Discover Hidden Gems</h3>
              <p>Get recommendations for workspaces that are perfect for your profession</p>
            </div>
            
            <div className="text-center">
              <div className="bg-coffee-brown w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3 className="font-bold text-xl mb-2">Share Knowledge</h3>
              <p>Exchange tips, resources, and advice with others in your field</p>
            </div>
          </div>
        </div>

        {/* Tribe Matcher Quiz */}
        <TribeMatcher />
        
        {/* Tribe Events - To be added in the future 
        <div className="max-w-5xl mx-auto mt-20">
          <h2 className="font-bold text-2xl text-coffee-brown mb-6 text-center">Tribe Meetups & Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-tech-blue relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fas fa-laptop-code text-4xl mb-2"></i>
                    <h3 className="font-pacifico text-2xl">Code & Coffee</h3>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    <i className="far fa-calendar-alt mr-1"></i> Every Tuesday
                  </span>
                  <span className="text-sm bg-tech-blue bg-opacity-20 text-tech-blue py-1 px-2 rounded-full">
                    Code Conjurers
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2">Weekly Coding Meetup</h3>
                <p className="text-sm mb-4">Join fellow developers for a productive coding session with coffee, debugging help, and networking.</p>
                <Button className="w-full bg-tech-blue hover:bg-opacity-80 text-white font-bold py-2 rounded-lg transition-all duration-300 brand-btn">
                  Join Next Meetup
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-vibe-yellow relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <i className="fas fa-paint-brush text-4xl mb-2"></i>
                    <h3 className="font-pacifico text-2xl">Create & Caffeinate</h3>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    <i className="far fa-calendar-alt mr-1"></i> Monthly
                  </span>
                  <span className="text-sm bg-vibe-yellow bg-opacity-20 text-coffee-brown py-1 px-2 rounded-full">
                    Pixel Pixies
                  </span>
                </div>
                <h3 className="font-bold text-xl mb-2">Design Showcase Meetup</h3>
                <p className="text-sm mb-4">Monthly gathering for designers to share work, get feedback, and find inspiration over great coffee.</p>
                <Button className="w-full bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-2 rounded-lg transition-all duration-300 brand-btn">
                  See Upcoming Events
                </Button>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default CreatureTribes;
