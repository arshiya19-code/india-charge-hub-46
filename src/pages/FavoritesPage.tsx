
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import StationCard from '@/components/StationCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { currentUser } = useAuth();
  const { favorites } = useFavorites();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Heart size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Sign in to view favorites</h2>
        <p className="text-muted-foreground text-center max-w-xs">
          Create an account or sign in to save and view your favorite charging stations
        </p>
        <div className="flex gap-4 mt-4">
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-heading font-bold mb-4">Your Favorites</h1>
      
      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map(station => (
            <StationCard key={station.place_id} station={station} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-4">
            Find and save your favorite charging stations to access them quickly
          </p>
          <Button asChild>
            <Link to="/">Find Stations</Link>
          </Button>
        </Card>
      )}
    </div>
  );
};

export default FavoritesPage;
