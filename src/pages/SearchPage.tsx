
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search as SearchIcon } from 'lucide-react';
import { Station, LocationCoords } from '@/types';
import StationCard from '@/components/StationCard';
import { fetchNearbyStations, calculateHaversineDistance } from '@/services/stationService';
import { toast } from '@/components/ui/sonner';

const popularCities = [
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchQuery && !activeCity) {
      toast.error('Please enter a search term or select a city');
      return;
    }

    setLoading(true);
    try {
      // Get location based on selected city
      let location: LocationCoords;
      
      if (activeCity) {
        const city = popularCities.find(city => city.name === activeCity);
        if (city) {
          location = { lat: city.lat, lng: city.lng };
          setUserLocation(location);
        } else {
          location = { lat: 17.3850, lng: 78.4867 }; // Default to Hyderabad
          setUserLocation(location);
        }
      } else {
        // Default to Hyderabad if no city selected
        location = { lat: 17.3850, lng: 78.4867 };
        setUserLocation(location);
      }
      
      const { stations } = await fetchNearbyStations(location);
      
      // If we have a search query, filter the results by name
      const filteredStations = searchQuery
        ? stations.filter(station => 
            station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.vicinity.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : stations;
        
      setSearchResults(filteredStations);
      
      if (filteredStations.length === 0) {
        toast.info('No charging stations found for your search');
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error('Error performing search');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setActiveCity(activeCity === city ? null : city);
    setSearchQuery('');
    
    // If a city was selected, perform search immediately
    if (activeCity !== city) {
      setTimeout(() => {
        handleSearch();
      }, 100);
    } else {
      setSearchResults([]);
    }
  };

  // Calculate distance between selected location and station
  const calculateDistance = (stationLoc: LocationCoords): number => {
    if (!userLocation) return 0;
    return calculateHaversineDistance(
      userLocation.lat, userLocation.lng,
      stationLoc.lat, stationLoc.lng
    );
  };

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-heading font-bold mb-4">Search EV Stations</h1>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name or location" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Major Indian Cities</h3>
          <div className="flex flex-wrap gap-2">
            {popularCities.map(city => (
              <Button
                key={city.name}
                variant={activeCity === city.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCitySelect(city.name)}
              >
                {city.name}
              </Button>
            ))}
          </div>
        </div>
      </form>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse-light">Searching for stations...</div>
        </div>
      ) : (
        <>
          {/* Show search results */}
          {searchResults.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Search Results {activeCity && `in ${activeCity}`}
              </h2>
              <div className="space-y-3">
                {searchResults.map(station => (
                  <StationCard 
                    key={station.place_id} 
                    station={station} 
                    distance={calculateDistance(station.geometry.location)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Show helpful message when no results and no search yet */}
          {searchResults.length === 0 && !loading && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Find EV Charging Stations</h3>
              <p className="text-muted-foreground mb-4">
                Search for charging stations by name or location, 
                or select a popular city from above.
              </p>
              <div className="flex justify-center">
                <SearchIcon size={64} className="text-muted-foreground/30" />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
