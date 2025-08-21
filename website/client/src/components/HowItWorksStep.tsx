interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const HowItWorksStep = ({ number, title, description, isLast = false }: HowItWorksStepProps) => {
  return (
    <div className="text-center relative">
      {/* Connection line before this element */}
      {number > 1 && (
        <div className="hidden md:block absolute top-8 left-0 h-1 bg-coffee-brown bg-opacity-30" style={{ width: '50%', zIndex: 1 }}></div>
      )}
      
      {/* Connection line after this element */}
      {!isLast && (
        <div className="hidden md:block absolute top-8 right-0 h-1 bg-coffee-brown bg-opacity-30" style={{ width: '50%', zIndex: 1 }}></div>
      )}
      
      <div className="relative mb-6 mx-auto" style={{ zIndex: 2, position: 'relative' }}>
        <div 
          className="bg-coffee-brown text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:bg-tech-blue hover:shadow-lg"
          onClick={() => alert(`Step ${number}: ${title}`)}
          title={`Click to learn more about ${title}`}
        >
          {number}
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default HowItWorksStep;