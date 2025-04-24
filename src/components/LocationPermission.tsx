
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { LocationCoords } from '@/types';

interface LocationPermissionProps {
  onLocationGranted: (location: LocationCoords) => void;
}

// Major Indian cities coordinates
const INDIAN_CITIES = {
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Chennai': { lat: 13.0827, lng: 80.2707 }
};

// Default to Hyderabad
const DEFAULT_LOCATION = INDIAN_CITIES['Hyderabad'];

const LocationPermission = ({ onLocationGranted }: LocationPermissionProps) => {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');

  const checkPermission = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      useDefaultLocation();
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
      
      if (permission.state === 'granted') {
        useDefaultLocation();
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      useDefaultLocation();
    }
  };

  const getLocation = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          // Check if the location is in India (rough boundaries)
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (lat >= 8.0 && lat <= 37.0 && lng >= 68.0 && lng <= 97.0) {
            // User's location is in India, but we'll still use the selected city
            useSelectedCityLocation();
          } else {
            // User is outside India, use Hyderabad as default
            useDefaultLocation();
          }
        },
        error => {
          console.error("Error getting location:", error);
          useDefaultLocation();
        }
      );
    } catch (error) {
      console.error("Error in getLocation:", error);
      useDefaultLocation();
    }
  };

  const useDefaultLocation = () => {
    onLocationGranted(DEFAULT_LOCATION);
    setPermissionStatus('granted');
    toast.success("Location set to Hyderabad");
  };
  
  const useSelectedCityLocation = () => {
    const location = INDIAN_CITIES[selectedCity as keyof typeof INDIAN_CITIES] || DEFAULT_LOCATION;
    onLocationGranted(location);
    setPermissionStatus('granted');
    toast.success(`Location set to ${selectedCity}`);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleAllowLocation = () => {
    getLocation();
  };

  useEffect(() => {
    checkPermission();
  }, []);

  if (permissionStatus === 'granted') {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto text-center animate-fade-in">
      <div className="mb-4 bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
        <MapPin size={32} className="text-primary" />
      </div>
      <h2 className="text-xl font-bold mb-2">Location Access Required</h2>
      <p className="text-muted-foreground mb-4">
        We need your location to show EV charging stations in India.
      </p>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Select a city:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.keys(INDIAN_CITIES).map(city => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "outline"}
              size="sm"
              onClick={() => handleCityChange(city)}
            >
              {city}
            </Button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleAllowLocation} 
        className="w-full"
      >
        Continue with {selectedCity}
      </Button>
    </Card>
  );
};

export default LocationPermission;
