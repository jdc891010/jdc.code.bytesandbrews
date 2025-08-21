interface TribeCardProps {
  title: string;
  icon: string;
  colorClass: string;
  members: Array<{
    title: string;
    description: string;
  }>;
}

const TribeCard = ({ title, icon, colorClass, members }: TribeCardProps) => {
  return (
    <div className="tribe-card bg-white rounded-xl shadow-md overflow-hidden transition duration-300 h-full flex flex-col">
      <div className={`h-32 ${colorClass} flex items-center justify-center`}>
        <i className={`${icon} text-white text-5xl`}></i>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className={`font-pacifico text-xl ${colorClass === 'bg-tech-blue' ? 'text-tech-blue' : colorClass === 'bg-vibe-yellow' ? 'text-vibe-yellow' : 'text-coffee-brown'} mb-3`}>
          {title}
        </h3>
        <ul className="space-y-2">
          {members.map((member, index) => (
            <li key={index} className="flex items-start">
              <span className={`w-2 h-2 ${colorClass === 'bg-tech-blue' ? 'bg-tech-blue' : colorClass === 'bg-vibe-yellow' ? 'bg-vibe-yellow' : 'bg-coffee-brown'} rounded-full mr-2 mt-2`}></span>
              <div className="flex flex-col">
                <span className="font-bold">{member.title}</span>
                <span className="text-sm text-gray-600">{member.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TribeCard;
