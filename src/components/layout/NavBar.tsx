
import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User as UserIcon, Settings } from 'lucide-react';
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
  const { user, logout } = useAuth();

  // We now use a simpler profile menu with just navigation options
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

          {user && (
          {user && (
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
          )}
 {user && (
            <Link
              to="/dashboard"
              className={`${
                location.pathname === '/dashboard'
                  ? 'text-echoes-purple'
                  : 'text-foreground/80' 
              } hover:text-echoes-purple transition-colors`}
            >Dashboard</Link>)}
          )}
          {user && (<DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt={user?.name || 'Guest'} />
                    <AvatarFallback src={user?.photoURL || '/public/ghost-icon.png'}>
                      {user?.name?.charAt(0) || 'G'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.name || 'Guest'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-echo')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Create Echo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  // Ensure logout is called correctly as a function and wait for it to complete
                  await logout();
                  // Close the mobile menu after signing out
                  setIsMenuOpen(false);
                  // Navigate after successful sign out
 navigate("/login");
 }}>Sign out</DropdownMenuItem>
 </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
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

            {user ? (
              <>
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
                {/* Optionally add mobile user menu items here if needed */}
                {/* For now, just showing a placeholder/close button */}
 <Button variant="ghost" className="w-full" onClick={async () => {
                  // Ensure logout is called correctly as a function and wait for it to complete
                  await logout();
                  // Close the mobile menu after signing out
                  setIsMenuOpen(false);
                  // Navigate after successful sign out
 navigate("/login"); }}>Sign out</Button>
             </>
            
            ) : (
              <>
                <Link to="/login" className="text-lg" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" className="text-lg" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
