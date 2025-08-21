import { Button } from "@/components/ui/button";

interface SectionScrollButtonProps {
  targetId: string;
  position?: "top" | "bottom";
  className?: string;
}

const SectionScrollButton = ({ 
  targetId, 
  position = "bottom",
  className = ""
}: SectionScrollButtonProps) => {
  
  const scrollToSection = () => {
    if (position === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      onClick={scrollToSection}
      className={`rounded-full w-10 h-10 flex items-center justify-center bg-tech-blue text-white shadow-md opacity-80 hover:opacity-100 transition-all duration-300 ${className}`}
      aria-label={position === "top" ? "Scroll to top" : `Scroll to ${targetId}`}
    >
      <i className={`fas fa-arrow-${position === "top" ? "up" : "down"}`}></i>
    </Button>
  );
};

export default SectionScrollButton;