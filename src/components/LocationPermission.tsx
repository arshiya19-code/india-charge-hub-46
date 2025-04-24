
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { LocationCoords } from '@/types';

interface LocationPermissionProps {
  onLocationGranted: (location: LocationCoords) => void;
}

const LocationPermission = ({ onLocationGranted }: LocationPermissionProps) => {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const checkPermission = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
      
      if (permission.state === 'granted') {
        getLocation();
      }
    } catch (error) {
      console.error("Error checking permission:", error);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Check if the location is within India's rough bounding box
        const indiaBox = {
          north: 35.5,  // Northern boundary of India
          south: 6.5,   // Southern boundary of India
          east: 97.5,   // Eastern boundary of India
          west: 68.0    // Western boundary of India
        };
        
        if (
          location.lat >= indiaBox.south && 
          location.lat <= indiaBox.north && 
          location.lng >= indiaBox.west && 
          location.lng <= indiaBox.east
        ) {
          onLocationGranted(location);
          setPermissionStatus('granted');
          toast.success("Location access granted");
        } else {
          toast.error("This app only works within India");
        }
      },
      error => {
        setPermissionStatus('denied');
        toast.error("Location access denied");
        console.error("Error getting location:", error);
      }
    );
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
        We need your location to show EV charging stations near you in India.
      </p>
      <Button 
        onClick={getLocation} 
        className="w-full"
      >
        Allow Location Access
      </Button>
    </Card>
  );
};

export default LocationPermission;
