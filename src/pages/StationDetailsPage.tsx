
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Navigation, Star, Clock, Phone, Info } from 'lucide-react';
import { getStationDetails } from '@/services/stationService';
import { Station } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { toast } from '@/components/ui/sonner';

const StationDetailsPage = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!stationId) return;
      
      setLoading(true);
      try {
        const details = await getStationDetails(stationId);
        if (details) {
          setStation(details);
        } else {
          toast.error('Failed to load station details');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching station details:', error);
        toast.error('Failed to load station details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStationDetails();
  }, [stationId]);

  const handleFavorite = async () => {
    if (!station || !currentUser) return;
    
    try {
      if (isFavorite(station.place_id)) {
        await removeFromFavorites(station.place_id);
      } else {
        await addToFavorites(station);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleNavigate = () => {
    if (!station) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.geometry.location.lat},${station.geometry.location.lng}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse-light">Loading station details...</div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="text-center py-8">
        <p>Station not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-48 bg-gradient-to-r from-secondary to-primary rounded-lg overflow-hidden mb-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h1 className="text-2xl font-bold">{station.name}</h1>
          <p className="text-white/90">{station.vicinity}</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1"
          onClick={handleNavigate}
        >
          <Navigation size={18} className="mr-2" /> Navigate
        </Button>
        
        {currentUser && (
          <Button 
            variant={isFavorite(station.place_id) ? "destructive" : "outline"} 
            className="flex-1"
            onClick={handleFavorite}
          >
            <Heart size={18} className="mr-2" /> 
            {isFavorite(station.place_id) ? 'Remove' : 'Favorite'}
          </Button>
        )}
      </div>
      
      {/* Station Info */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Info size={20} className="text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Station Information</h3>
                <p className="text-sm text-muted-foreground">Details and amenities</p>
              </div>
            </div>
            
            <Badge variant={station.available ? "default" : "destructive"}>
              {station.available ? 'Available' : 'Busy'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <Star size={16} className="text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Rating</p>
                <p>
                  {station.rating ? (
                    <span className="font-medium">{station.rating} / 5</span>
                  ) : (
                    <span>No ratings yet</span>
                  )}
                  {station.user_ratings_total && (
                    <span className="text-sm text-muted-foreground ml-1">
                      ({station.user_ratings_total} reviews)
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <Clock size={16} className="text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Hours</p>
                <p className="font-medium">
                  {station.opening_hours?.open_now ? 'Open Now' : 'Closed'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <Phone size={16} className="text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <path d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
                  <path d="M17 14h.01M17 10h.01"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted-foreground">Payment</p>
                <p className="font-medium">Credit Card, UPI</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charger Types */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Available Chargers</h3>
          
          <div className="space-y-3">
            {/* These are mock charger types */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.5">
                    <path d="M7 7h10v10H7z"></path>
                    <path d="M7 19h10M7 5h10"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">CCS</p>
                  <p className="text-xs text-muted-foreground">50-150 kW</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">2 Available</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                    <path d="M5 5v14M19 5v14M5 5a5 5 0 015 5M19 5a5 5 0 00-5 5"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">CHAdeMO</p>
                  <p className="text-xs text-muted-foreground">50 kW</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">1 Available</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6f00" strokeWidth="2.5">
                    <path d="M14 5l7 7-7 7M5 5l7 7-7 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Type 2 AC</p>
                  <p className="text-xs text-muted-foreground">22 kW</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">Busy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Price Info */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Pricing Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>DC Fast Charging</span>
              <span className="font-medium">₹18/kWh</span>
            </div>
            <div className="flex justify-between">
              <span>AC Charging</span>
              <span className="font-medium">₹12/kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Parking Fee</span>
              <span className="font-medium">₹20/hour after 60 mins</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Methods</span>
              <span className="font-medium">Credit Card, UPI, RFID</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StationDetailsPage;
