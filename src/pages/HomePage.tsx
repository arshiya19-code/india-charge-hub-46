
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Station, LocationCoords } from '@/types';
import GoogleMap from '@/components/GoogleMap';
import StationCard from '@/components/StationCard';
import LocationPermission from '@/components/LocationPermission';
import { fetchNearbyStations, calculateHaversineDistance } from '@/services/stationService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

const HomePage = () => {
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const navigate = useNavigate();

  const handleLocationGranted = (location: LocationCoords) => {
    setUserLocation(location);
  };

  const fetchStations = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const { stations: nearbyStations, error } = await fetchNearbyStations(userLocation);
      
      if (error) {
        toast.error(error);
      } else {
        setStations(nearbyStations);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast.error('Failed to load charging stations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchStations();
    }
  }, [userLocation]);

  const handleMarkerClick = (station: Station) => {
    navigate(`/station/${station.place_id}`, { state: { from: '/' } });
  };

  // Calculate distance between user and station using Haversine formula
  const calculateDistance = (stationLoc: LocationCoords): number => {
    if (!userLocation) return 0;
    return calculateHaversineDistance(
      userLocation.lat, userLocation.lng,
      stationLoc.lat, stationLoc.lng
    );
  };

  if (!userLocation) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LocationPermission onLocationGranted={handleLocationGranted} />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      <h1 className="text-2xl font-heading font-bold mb-4">
        EV Charging Stations Near You
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          <Card className="overflow-hidden">
            <GoogleMap 
              stations={stations}
              userLocation={userLocation}
              onMarkerClick={handleMarkerClick}
            />
          </Card>
          
          {/* Horizontally scrollable list of stations below the map */}
          {stations.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Nearby Stations</h2>
              <div className="overflow-x-auto scrollbar-hidden -mx-4 px-4">
                <div className="flex space-x-4 pb-4">
                  {stations.map(station => (
                    <div key={station.place_id} className="min-w-[300px] max-w-[300px]">
                      <StationCard 
                        station={station} 
                        distance={calculateDistance(station.geometry.location)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse-light">Loading stations...</div>
            </div>
          ) : stations.length > 0 ? (
            <div className="space-y-4">
              {stations
                .sort((a, b) => 
                  calculateDistance(a.geometry.location) - calculateDistance(b.geometry.location)
                )
                .map(station => (
                  <StationCard 
                    key={station.place_id} 
                    station={station}
                    distance={calculateDistance(station.geometry.location)}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-8">
              <p>No charging stations found nearby.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
