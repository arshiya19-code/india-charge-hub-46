
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, User, Heart, Map, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import MobileNavbar from './MobileNavbar';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const showBackButton = location.pathname !== '/' && location.pathname !== '/search' && 
                         location.pathname !== '/profile' && location.pathname !== '/favorites';
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {showBackButton ? (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" asChild>
                <Link to={location.state?.from || '/'}>
                  <ArrowLeft size={20} />
                </Link>
              </Button>
              <h1 className="font-heading font-semibold ml-2">
                {location.pathname.includes('/station/') ? 'Station Details' :
                 location.pathname.includes('/auth') ? 'Authentication' :
                 'Back'}
              </h1>
            </div>
          ) : (
            <Link to="/" className="flex items-center">
              <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center mr-2">
                <Map size={20} className="text-primary-foreground" />
              </div>
              <h1 className="font-heading font-bold text-lg hidden sm:block">India Charge Hub</h1>
            </Link>
          )}
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {!location.pathname.includes('/auth') && (
              <Link to="/profile">
                <Button size="icon" variant="ghost">
                  <User size={20} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile navbar (only show on specific routes) */}
      {!location.pathname.includes('/auth') && (
        <MobileNavbar />
      )}
    </div>
  );
};

export default Layout;
