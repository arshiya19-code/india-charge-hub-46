
import { Home, Search, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavbar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: Heart, path: '/favorites', label: 'Favorites' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-10">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <IconComponent size={20} />
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-1 bg-primary rounded-t-md" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
