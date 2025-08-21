import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

// Quiz questions
const questions = [
  {
    id: 1,
    question: "What do you enjoy most about your work?",
    options: [
      { value: "tech", label: "Solving complex problems and building things" },
      { value: "creative", label: "Expressing ideas visually and creating beautiful designs" },
      { value: "writing", label: "Crafting compelling stories and messages" },
      { value: "marketing", label: "Connecting with people and driving engagement" }
    ]
  },
  {
    id: 2,
    question: "How do you prefer your work environment?",
    options: [
      { value: "quiet", label: "Quiet and structured with minimal distractions" },
      { value: "vibrant", label: "Energetic and inspiring with some background activity" },
      { value: "collaborative", label: "Collaborative with opportunities to exchange ideas" },
      { value: "flexible", label: "Flexible and adaptable to my changing needs" }
    ]
  },
  {
    id: 3,
    question: "Which tool would you be most lost without?",
    options: [
      { value: "tech-tools", label: "Development environment or code editor" },
      { value: "design-tools", label: "Design software or digital art tools" },
      { value: "writing-tools", label: "Word processor or note-taking app" },
      { value: "analytics-tools", label: "Analytics dashboard or social media management" }
    ]
  }
];

// Results mapping
const tribeResults = {
  "tech": {
    tribe: "Code Conjurer",
    icon: "fas fa-laptop-code",
    color: "bg-tech-blue",
    description: "You love solving problems and creating digital solutions. Your ideal workspace has fast Wi-Fi and just the right amount of background noise."
  },
  "creative": {
    tribe: "Pixel Pixie",
    icon: "fas fa-paint-brush",
    color: "bg-vibe-yellow",
    description: "You thrive on visual expression and creative energy. You need a space that inspires creativity and has plenty of visual stimulation."
  },
  "writing": {
    tribe: "Word Weaver",
    icon: "fas fa-feather-alt",
    color: "bg-coffee-brown",
    description: "You craft compelling narratives and powerful messages. You value spaces with the perfect ambiance for concentration and inspiration."
  },
  "marketing": {
    tribe: "Buzz Beast",
    icon: "fas fa-bullhorn",
    color: "bg-tech-blue",
    description: "You excel at connecting with audiences and driving engagement. You need a vibrant environment where you can observe people and trends."
  }
};

const TribeMatcher = () => {
  const [stage, setStage] = useState<'start' | 'questions' | 'results'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [result, setResult] = useState<keyof typeof tribeResults>('tech');

  const handleStartQuiz = () => {
    setStage('questions');
  };

  const handleOptionSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const answerValues = Object.values(answers);
      
      // Count occurrences of each answer type
      const counts: Record<string, number> = {};
      answerValues.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
      });
      
      // Find the most common answer
      let maxCount = 0;
      let mostCommonAnswer = 'tech'; // Default
      
      for (const [answer, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          mostCommonAnswer = answer;
        }
      }
      
      setResult(mostCommonAnswer as keyof typeof tribeResults);
      setStage('results');
    }
  };

  const resetQuiz = () => {
    setStage('start');
    setCurrentQuestion(0);
    setAnswers({});
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="font-bold text-2xl text-coffee-brown">Not sure which tribe you belong to?</h3>
        <p className="mt-2">Take our quick quiz to discover your creature tribe!</p>
      </div>
      
      <AnimatePresence mode="wait">
        {stage === 'start' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Button 
              onClick={handleStartQuiz} 
              className="bg-tech-blue hover:bg-opacity-80 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 brand-btn"
            >
              <i className="fas fa-play-circle mr-2"></i> Start Tribe Matcher Quiz
            </Button>
          </motion.div>
        )}
        
        {stage === 'questions' && (
          <motion.div 
            key="questions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="quiz-question">
              <h4 className="font-bold text-xl mb-4">{questions[currentQuestion].question}</h4>
              <RadioGroup 
                value={answers[currentQuestion] || ""} 
                onValueChange={handleOptionSelect}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={handleNextQuestion} 
                disabled={!answers[currentQuestion]}
                className="bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            </div>
          </motion.div>
        )}
        
        {stage === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-6 rounded-xl"
            style={{ backgroundColor: `${tribeResults[result].color}10` }}
          >
            <div className={`w-20 h-20 mx-auto ${tribeResults[result].color} rounded-full flex items-center justify-center mb-4`}>
              <i className={`${tribeResults[result].icon} text-white text-3xl`}></i>
            </div>
            <h4 className={`font-pacifico text-2xl ${tribeResults[result].color === 'bg-tech-blue' ? 'text-tech-blue' : tribeResults[result].color === 'bg-vibe-yellow' ? 'text-vibe-yellow' : 'text-coffee-brown'} mb-2`}>
              You're a {tribeResults[result].tribe}!
            </h4>
            <p className="mb-4">{tribeResults[result].description}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                className={`${tribeResults[result].color} hover:bg-opacity-80 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 brand-btn`}
              >
                Find Your Perfect Spot
              </Button>
              <Button 
                onClick={resetQuiz}
                variant="outline" 
                className="border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg transition-all duration-300"
              >
                Retake Quiz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TribeMatcher;
