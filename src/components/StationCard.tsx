
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Station } from '@/types';
import { Star, Navigation, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

interface StationCardProps {
  station: Station;
  distance?: number; // in meters
  showActions?: boolean;
}

const StationCard = ({ station, distance, showActions = true }: StationCardProps) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { currentUser } = useAuth();
  const isFav = isFavorite(station.place_id);
  
  const [isAdding, setIsAdding] = useState(false);

  const getPriceLevel = (level?: number) => {
    if (!level) return "₹";
    return "₹".repeat(level);
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return "";
    return meters < 1000 ? `${meters.toFixed(0)}m` : `${(meters/1000).toFixed(1)}km`;
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) return;
    
    setIsAdding(true);
    try {
      if (isFav) {
        await removeFromFavorites(station.place_id);
      } else {
        await addToFavorites(station);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const navigateToStation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.geometry.location.lat},${station.geometry.location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <Link to={`/station/${station.place_id}`}>
      <Card className="station-card animate-fade-in hover:bg-accent/5">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{station.name}</h3>
              <p className="text-muted-foreground text-sm">{station.vicinity}</p>
              
              <div className="flex items-center gap-1 mt-1">
                {station.rating && (
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm ml-1 font-medium">{station.rating}</span>
                    {station.user_ratings_total && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({station.user_ratings_total})
                      </span>
                    )}
                  </div>
                )}
                
                {station.price_level && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {getPriceLevel(station.price_level)}
                  </span>
                )}
                
                {distance && (
                  <span className="text-sm ml-2 bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                    {formatDistance(distance)}
                  </span>
                )}
              </div>

              <div className="flex items-center mt-2">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    station.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs">
                  {station.available ? 'Available now' : 'Currently busy'}
                </span>
              </div>
            </div>
            
            {showActions && (
              <div className="flex flex-col gap-2">
                {currentUser && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleFavoriteToggle}
                    disabled={isAdding}
                  >
                    <Heart
                      size={18}
                      className={isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}
                    />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={navigateToStation}
                >
                  <Navigation size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StationCard;
