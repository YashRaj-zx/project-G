
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User as UserIcon, Plus } from 'lucide-react';
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

const NavBar = () => { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 md:bg-background/80 bg-background backdrop-blur-md border-b border-echoes-light py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-gradient">Echoes Beyond</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`${
              location.pathname === '/' 
                ? 'text-echoes-purple' 
                : 'text-foreground/80'
            } hover:text-echoes-purple transition-colors`}
          >
            Home
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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar>
                    <AvatarImage src={user?.photoURL || '/ghost-icon.png'} alt={user?.name || 'Guest'} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'G'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end"> 
                <DropdownMenuLabel>{user?.name || 'Guest'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-echo')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Echo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await logout();
                  setIsMenuOpen(false);
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

        {/* Mobile menu toggle or user avatar */}
        <div className="md:hidden">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar>
                    <AvatarImage src={user?.photoURL || '/ghost-icon.png'} alt={user?.name || 'Guest'} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || 'G'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end"> 
                <DropdownMenuLabel>{user?.name || 'Guest'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/create-echo')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Echo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await logout();
                  navigate("/login");
                }}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && !user && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 animate-fade-in">
          <div className="flex flex-col p-6 space-y-6">
            <Link 
              to="/" 
              className={`text-lg ${
                location.pathname === '/' 
                  ? 'text-echoes-purple' 
                  : 'text-foreground/80'
              } hover:text-echoes-purple transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className={`text-lg ${
                location.pathname === '/login' 
                  ? 'text-echoes-purple' 
                  : 'text-foreground/80'
              } hover:text-echoes-purple transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className={`text-lg ${
                location.pathname === '/signup' 
                  ? 'text-echoes-purple' 
                  : 'text-foreground/80'
              } hover:text-echoes-purple transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
