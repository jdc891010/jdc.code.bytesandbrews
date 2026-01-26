import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Tribes", path: "/tribes" },
    { name: "Merch", path: "/merch" },
    { name: "Launch Campaign", path: "/launch-campaign" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`fixed w-full bg-coffee-brown z-50 shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <nav className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-cream-white hover:text-vibe-yellow font-medium transition-colors ${isActive(link.path) ? 'text-vibe-yellow' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <NotificationPanel className="ml-2" />
          <a href="/#coffee-shops">
            <Button className="ml-4 bg-vibe-yellow hover:bg-opacity-80 text-coffee-brown font-bold transition-all duration-300 brand-btn">
              Find Coffee Shops
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cream-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-coffee-brown transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-cream-white hover:text-vibe-yellow font-medium py-2 transition-colors ${isActive(link.path) ? 'text-vibe-yellow' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
