
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-echoes-light py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-gradient">Echoes Beyond</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/how-it-works" className="text-foreground/80 hover:text-echoes-purple transition-colors">
            How It Works
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-echoes-purple transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-echoes-purple transition-colors">
            About Us
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-echoes-purple text-echoes-purple hover:bg-echoes-light">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-echoes-purple hover:bg-echoes-accent text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 animate-fade-in">
          <div className="flex flex-col p-6 space-y-6">
            <Link 
              to="/how-it-works" 
              className="text-lg text-foreground/80 hover:text-echoes-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className="text-lg text-foreground/80 hover:text-echoes-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-lg text-foreground/80 hover:text-echoes-purple transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="flex flex-col gap-4 pt-4 border-t border-echoes-light/30">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-echoes-purple text-echoes-purple">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-echoes-purple hover:bg-echoes-accent text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
