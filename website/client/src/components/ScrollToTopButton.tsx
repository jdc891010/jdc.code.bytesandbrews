import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ScrollToTopButtonProps {
  scrollThreshold?: number;
  className?: string;
}

const ScrollToTopButton = ({ 
  scrollThreshold = 300,
  className = ""
}: ScrollToTopButtonProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > scrollThreshold) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 rounded-full w-12 h-12 flex items-center justify-center bg-tech-blue text-white shadow-lg opacity-90 transition-all duration-300 ${
        visible ? "translate-y-0" : "translate-y-20"
      } ${className}`}
      aria-label="Scroll to top"
    >
      <i className="fas fa-arrow-up"></i>
    </Button>
  );
};

export default ScrollToTopButton;