
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-echoes-light py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-gradient">Echoes Beyond</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/how-it-works" 
            className={`${
              location.pathname === '/how-it-works' 
                ? 'text-echoes-purple' 
                : 'text-foreground/80'
            } hover:text-echoes-purple transition-colors`}
          >
            How It Works
          </Link>
          <Link 
            to="/pricing" 
            className={`${
              location.pathname === '/pricing' 
                ? 'text-echoes-purple' 
                : 'text-foreground/80'
            } hover:text-echoes-purple transition-colors`}
          >
            Pricing
          </Link>
          <Link 
            to="/create-echo" 
            className={`${
              location.pathname === '/create-echo' 
                ? 'text-echoes-purple' 
                : 'text-foreground/80'
            } hover:text-echoes-purple transition-colors`}
          >
            Create Echo
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className={`${
                  location.pathname === '/dashboard' 
                    ? 'text-echoes-purple' 
                    : 'text-foreground/80'
                } hover:text-echoes-purple transition-colors`}
              >
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={user?.name || 'User'} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user?.name || 'User'}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
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
          )}
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
              className={`text-lg ${
                location.pathname === '/how-it-works' 
                  ? 'text-echoes-purple' 
                  : 'text-foreground/80'
              } hover:text-echoes-purple transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`text-lg ${
                location.pathname === '/pricing' 
                  ? 'text-echoes-purple' 
                  : 'text-foreground/80'
              } hover:text-echoes-purple transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/create-echo" 
              className={`text-lg ${
                location.pathname === '/create-echo' 
                  ? 'text-echoes-purple' 
                  : 'text-foreground/80'
              } hover:text-echoes-purple transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Create Echo
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-lg ${
                    location.pathname === '/dashboard' 
                      ? 'text-echoes-purple' 
                      : 'text-foreground/80'
                  } hover:text-echoes-purple transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex flex-col gap-4 pt-4 border-t border-echoes-light/30">
                  <Button 
                    variant="outline" 
                    className="w-full border-echoes-purple text-echoes-purple"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
