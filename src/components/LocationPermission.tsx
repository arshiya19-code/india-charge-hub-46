
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { LocationCoords } from '@/types';

interface LocationPermissionProps {
  onLocationGranted: (location: LocationCoords) => void;
}

// Hyderabad coordinates
const HYDERABAD_LOCATION: LocationCoords = {
  lat: 17.3850,
  lng: 78.4867
};

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
        useHyderabadLocation();
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      // Use Hyderabad as fallback
      useHyderabadLocation();
    }
  };

  const getLocation = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          // Always use Hyderabad's location regardless of actual position
          useHyderabadLocation();
        },
        error => {
          console.error("Error getting location:", error);
          // Use Hyderabad as fallback
          useHyderabadLocation();
        }
      );
    } catch (error) {
      console.error("Error in getLocation:", error);
      useHyderabadLocation();
    }
  };

  const useHyderabadLocation = () => {
    onLocationGranted(HYDERABAD_LOCATION);
    setPermissionStatus('granted');
    toast.success("Location set to Hyderabad");
  };

  useEffect(() => {
    checkPermission();
  }, []);

  const handleAllowLocation = () => {
    getLocation();
  };

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
        We need your location to show EV charging stations in Hyderabad.
      </p>
      <Button 
        onClick={handleAllowLocation} 
        className="w-full"
      >
        Allow Location Access
      </Button>
    </Card>
  );
};

export default LocationPermission;
