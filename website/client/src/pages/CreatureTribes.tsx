import { Button } from "@/components/ui/button";
import TribeCard from "@/components/TribeCard";
import TribeMatcher from "@/components/TribeMatcher";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Profession, TalkingPoint } from "@shared/schema";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const groupMeta: Record<string, { icon: string, colorClass: string }> = {
  "Technology & IT": { icon: "fas fa-laptop-code", colorClass: "bg-tech-blue" },
  "Creative & Design": { icon: "fas fa-paint-brush", colorClass: "bg-vibe-yellow" },
  "Writing & Content Creation": { icon: "fas fa-feather-alt", colorClass: "bg-coffee-brown" },
  "Marketing & Sales": { icon: "fas fa-bullhorn", colorClass: "bg-tech-blue bg-opacity-70" },
  "Business & Administration": { icon: "fas fa-chart-line", colorClass: "bg-coffee-brown bg-opacity-70" },
  "Education & Training": { icon: "fas fa-graduation-cap", colorClass: "bg-vibe-yellow bg-opacity-70" },
  "Consulting & Freelance Expertise": { icon: "fas fa-user-tie", colorClass: "bg-tech-blue bg-opacity-50" },
  "Media & Entertainment": { icon: "fas fa-film", colorClass: "bg-coffee-brown bg-opacity-50" },
};

const CreatureTribes = () => {
  const { data: professionsResponse, isLoading } = useQuery<{ success: boolean, professions: Profession[] }>({
    queryKey: ["/api/professions"],
  });

  const { data: talkingPointsResponse, isLoading: isLoadingTPs } = useQuery<{ success: boolean, talkingPoints: TalkingPoint[] }>({
    queryKey: ["/api/talking-points"],
  });

  const professions = professionsResponse?.professions || [];
  const allTalkingPoints = talkingPointsResponse?.talkingPoints || [];

  const [activeGroup, setActiveGroup] = useState<string>("Technology & IT");

  // Filter talking points for specific professions in the active group
  const starters = useMemo(() => {
    const groupProfs = professions.filter(p => p.mainGroup === activeGroup);
    const profIds = groupProfs.map(p => p.id);
    const groupTPs = allTalkingPoints.filter(tp => profIds.includes(tp.professionId!));

    // Get some "Try These" and some "Avoid These"
    const tryThese = groupTPs.filter(tp => tp.tryThese).slice(0, 3);
    const avoidThese = groupTPs.filter(tp => tp.avoidThese).slice(0, 3);

    return { tryThese, avoidThese };
  }, [activeGroup, professions, allTalkingPoints]);

  // Group professions by mainGroup
  const groupedProfessions = professions.reduce((acc, prof) => {
    if (!acc[prof.mainGroup]) {
      acc[prof.mainGroup] = [];
    }
    acc[prof.mainGroup].push({
      title: prof.funLabel,
      description: prof.secondaryLabel
    });
    return acc;
  }, {} as Record<string, { title: string, description: string }[]>);

  const tribes = Object.entries(groupedProfessions).map(([group, members]) => ({
    title: group,
    icon: groupMeta[group]?.icon || "fas fa-users",
    colorClass: groupMeta[group]?.colorClass || "bg-gray-500",
    members: members.slice(0, 4) // Show top 4 for the card layout
  }));

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
      <Helmet>
        <title>Creature Tribes - Find Your Fellow Remote Workers</title>
        <meta name="description" content="Discover your remote work tribe at Brews and Bytes. Connect with like-minded professionals, from Code Conjurers to Word Weavers." />
      </Helmet>
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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-brown"></div>
          </div>
        ) : (
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
        )}

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

        {/* Networking Starters Section */}
        <div className="max-w-5xl mx-auto mt-20">
          <h2 className="font-bold text-2xl text-coffee-brown mb-6 text-center">Networking Starters</h2>
          <p className="text-center mb-8 text-gray-600">Break the ice with these profession-specific conversation starters (and avoid these common pitfalls!)</p>

          <Tabs defaultValue="Technology & IT" onValueChange={setActiveGroup} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white p-1 border border-gray-100 shadow-sm flex-wrap h-auto">
                {Object.keys(groupMeta).map(group => (
                  <TabsTrigger key={group} value={group} className="data-[state=active]:bg-tech-blue data-[state=active]:text-white px-4 py-2">
                    {group}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-green-100 bg-green-50/30">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-green-700 mb-4 flex items-center">
                    <i className="fas fa-check-circle mr-2"></i> Try These Starters
                  </h3>
                  <div className="space-y-4">
                    {isLoadingTPs ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-coffee-brown"></div>
                      </div>
                    ) : starters.tryThese.length > 0 ? starters.tryThese.map((tp, idx) => {
                      const profName = professions.find(p => p.id === tp.professionId)?.secondaryLabel;
                      return (
                        <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-green-50">
                          <Badge variant="outline" className="mb-2 text-green-600 border-green-200">{profName}</Badge>
                          <p className="text-gray-800 italic">"{tp.text}"</p>
                        </div>
                      );
                    }) : (
                      <p className="text-gray-500 italic p-4 text-center">
                        Gathering more starters for the {activeGroup} tribe...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100 bg-red-50/30">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-red-700 mb-4 flex items-center">
                    <i className="fas fa-times-circle mr-2"></i> Avoid These (Unless you want to be ignored)
                  </h3>
                  <div className="space-y-4">
                    {isLoadingTPs ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-coffee-brown"></div>
                      </div>
                    ) : starters.avoidThese.length > 0 ? starters.avoidThese.map((tp, idx) => {
                      const profName = professions.find(p => p.id === tp.professionId)?.secondaryLabel;
                      return (
                        <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-red-50">
                          <Badge variant="outline" className="mb-2 text-red-600 border-red-200">{profName}</Badge>
                          <p className="text-gray-800 italic">"{tp.text}"</p>
                        </div>
                      );
                    }) : (
                      <p className="text-gray-500 italic p-4 text-center">
                        Stay friendly! No common pitfalls recorded for {activeGroup} yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>

        {/* Tribe Events - To be added in the future */}
      </div>
    </section>
  );
};

export default CreatureTribes;
