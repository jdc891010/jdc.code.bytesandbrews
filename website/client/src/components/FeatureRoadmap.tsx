import { motion } from "framer-motion";
import SectionScrollButton from "@/components/SectionScrollButton";

interface Feature {
  id: string;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
}

const features: Feature[] = [
  {
    id: "f1",
    title: "Wi-Fi Speed Testing",
    description: "Accurate measurements of download/upload speeds with historical data.",
    status: "completed"
  },
  {
    id: "f2",
    title: "Vibe Ratings",
    description: "Rate and review the atmosphere of coffee shops.",
    status: "completed"
  },
  {
    id: "f3",
    title: "Tribe Matching",
    description: "Connect with other professionals in your field.",
    status: "completed"
  },
  {
    id: "f4",
    title: "Google Maps Integration",
    description: "Find coffee shops near you with directions.",
    status: "in-progress"
  },
  {
    id: "f5",
    title: "User Profiles",
    description: "Personalized profiles with favorite spots and contributions.",
    status: "in-progress"
  },
  {
    id: "f6",
    title: "Coffee Shop Specials",
    description: "View current promotions and happy hour specials.",
    status: "in-progress"
  },
  {
    id: "f7",
    title: "Advanced Filtering",
    description: "Filter workspaces by multiple criteria.",
    status: "planned"
  },
  {
    id: "f8",
    title: "Offline Mode",
    description: "Access your saved coffee shops without internet.",
    status: "planned"
  },
  {
    id: "f9",
    title: "Group Bookings",
    description: "Reserve space for team meetings and co-working sessions.",
    status: "planned"
  }
];

const FeatureRoadmap = () => {
  const getFeaturesByStatus = (status: Feature["status"]) => {
    return features.filter(feature => feature.status === status);
  };

  const plannedFeatures = getFeaturesByStatus("planned");
  const inProgressFeatures = getFeaturesByStatus("in-progress");
  const completedFeatures = getFeaturesByStatus("completed");

  const featureVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const renderFeatureCard = (feature: Feature, index: number) => (
    <motion.div
      key={feature.id}
      custom={index}
      variants={featureVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-white rounded-lg shadow-md p-4 mb-3"
    >
      <h4 className="font-bold mb-1">{feature.title}</h4>
      <p className="text-sm text-gray-600">{feature.description}</p>
    </motion.div>
  );

  return (
    <section className="py-16 bg-soft-cream relative">
      <div className="container mx-auto px-4">
        <div className="absolute top-4 right-4">
          <SectionScrollButton targetId="home" position="top" />
        </div>
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-coffee-brown mb-4">Feature Roadmap</h2>
          <p className="text-lg max-w-2xl mx-auto">See what we're working on and what's coming next</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div>
            <div className="bg-yellow-50 rounded-t-lg p-4 border-b-4 border-vibe-yellow">
              <h3 className="font-bold text-xl flex items-center">
                <span className="bg-vibe-yellow text-white p-1 rounded-full w-7 h-7 flex items-center justify-center mr-2">
                  <i className="fas fa-lightbulb text-sm"></i>
                </span>
                Planned
              </h3>
            </div>
            <div className="bg-yellow-50 bg-opacity-50 rounded-b-lg p-4 h-full min-h-[300px]">
              {plannedFeatures.map((feature, index) => renderFeatureCard(feature, index))}
            </div>
          </div>

          <div>
            <div className="bg-blue-50 rounded-t-lg p-4 border-b-4 border-tech-blue">
              <h3 className="font-bold text-xl flex items-center">
                <span className="bg-tech-blue text-white p-1 rounded-full w-7 h-7 flex items-center justify-center mr-2">
                  <i className="fas fa-code-branch text-sm"></i>
                </span>
                In Progress
              </h3>
            </div>
            <div className="bg-blue-50 bg-opacity-50 rounded-b-lg p-4 h-full min-h-[300px]">
              {inProgressFeatures.map((feature, index) => renderFeatureCard(feature, index))}
            </div>
          </div>

          <div>
            <div className="bg-green-50 rounded-t-lg p-4 border-b-4 border-green-500">
              <h3 className="font-bold text-xl flex items-center">
                <span className="bg-green-500 text-white p-1 rounded-full w-7 h-7 flex items-center justify-center mr-2">
                  <i className="fas fa-check text-sm"></i>
                </span>
                Completed
              </h3>
            </div>
            <div className="bg-green-50 bg-opacity-50 rounded-b-lg p-4 h-full min-h-[300px]">
              {completedFeatures.map((feature, index) => renderFeatureCard(feature, index))}
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a feature idea? We'd love to hear it! Use the contact form below to suggest new features.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureRoadmap;