import { Variants } from "framer-motion";

// Fade In animations
export const fadeIn = (direction: "up" | "down" | "left" | "right" = "up"): Variants => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
};

// Stagger container for children elements
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Fade up with custom delay (for lists)
export const fadeInUp: Variants = {
  hidden: {
    y: 40,
    opacity: 0
  },
  show: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.6,
      delay: i,
      ease: "easeOut"
    }
  })
};

// Zoom in animation
export const zoomIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Scale effect for hover states
export const scaleOnHover: Variants = {
  initial: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3
    }
  }
};

// Hero section text animations
export const heroTextAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Page transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Button hover effect
export const buttonHoverEffect: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};
