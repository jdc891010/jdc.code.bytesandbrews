const Logo = ({ className = "", size = "regular" }: { className?: string, size?: "small" | "regular" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    regular: "w-10 h-10"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} mr-2`}>
        {/* Coffee cup logo with wifi waves */}
        <div className="absolute inset-0 bg-vibe-yellow rounded-b-3xl rounded-t-sm transform rotate-12"></div>
        <div className="absolute inset-0 bg-tech-blue rounded-b-3xl rounded-t-sm transform -rotate-12 opacity-80"></div>
        <div className="absolute inset-1 bg-cream-white rounded-b-3xl rounded-t-sm flex items-center justify-center">
          <i className={`fas fa-coffee text-coffee-brown ${size === "small" ? "text-xs" : "text-lg"}`}></i>
        </div>
        <div className={`absolute top-0 right-0 ${size === "small" ? "w-3 h-3" : "w-4 h-4"} flex items-center justify-center`}>
          <i className={`fas fa-wifi text-tech-blue ${size === "small" ? "text-xxs" : "text-xs"} transform rotate-45`}></i>
        </div>
      </div>
      <span className={`font-pacifico text-cream-white ${size === "small" ? "text-lg" : "text-xl"}`}>Brews and Bytes</span>
    </div>
  );
};

export default Logo;
