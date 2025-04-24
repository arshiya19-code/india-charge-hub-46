
import { Station, LocationCoords } from '../types';

interface StationsResponse {
  stations: Station[];
  error?: string;
}

// Major Indian cities coordinates
const INDIAN_CITIES = {
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Chennai': { lat: 13.0827, lng: 80.2707 }
};

// This is a mock service until we have the actual Google Places API key
export const fetchNearbyStations = async (
  location: LocationCoords,
  radius: number = 5000
): Promise<StationsResponse> => {
  try {
    // Determine which city's data to return based on proximity to known cities
    const closestCity = findClosestCity(location);
    const stations = getMockStationsForCity(closestCity);
    
    return { stations };
  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    return { stations: [], error: 'Failed to fetch nearby stations' };
  }
};

// Find closest city to the given location
const findClosestCity = (location: LocationCoords): string => {
  let closestCity = 'Hyderabad';
  let minDistance = Number.MAX_VALUE;
  
  Object.entries(INDIAN_CITIES).forEach(([city, coords]) => {
    const distance = calculateHaversineDistance(
      location.lat, location.lng,
      coords.lat, coords.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  });
  
  return closestCity;
};

// Calculate distance between two coordinates using Haversine formula (in meters)
export const calculateHaversineDistance = (
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180; 
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distance in meters
};

// Get mock stations data based on city
const getMockStationsForCity = (city: string): Station[] => {
  const cityCoords = INDIAN_CITIES[city as keyof typeof INDIAN_CITIES] || INDIAN_CITIES['Hyderabad'];
  
  // Create stations with realistic offsets from city center
  const stationData: {[key: string]: Station[]} = {
    'Hyderabad': [
      createMockStation('1', 'Tata Power EV Charging Station', 'Hitech City', cityCoords, 0.01, 0.01, 4.5, 120, true, 2),
      createMockStation('2', 'BPCL EV Charging Hub', 'Banjara Hills', cityCoords, -0.008, 0.005, 4.2, 85, false, 1),
      createMockStation('3', 'Ather Grid', 'Jubilee Hills', cityCoords, 0.005, -0.007, 4.7, 210, true, 3),
      createMockStation('4', 'Reliance EV Charging Park', 'Gachibowli', cityCoords, -0.01, -0.01, 4.0, 95, true, 2),
      createMockStation('5', 'IOCL Fast Charger', 'Secunderabad', cityCoords, 0.015, -0.003, 3.9, 65, true, 1),
    ],
    'Bangalore': [
      createMockStation('6', 'Tata Power EV Zone', 'Whitefield', cityCoords, 0.012, 0.008, 4.6, 150, true, 2),
      createMockStation('7', 'BESCOM Charging Station', 'MG Road', cityCoords, -0.005, 0.01, 4.1, 95, true, 1),
      createMockStation('8', 'Ather Experience Center', 'Indiranagar', cityCoords, 0.007, -0.006, 4.8, 180, true, 3),
      createMockStation('9', 'Shell Recharge', 'Electronic City', cityCoords, -0.015, -0.012, 4.3, 110, false, 2),
      createMockStation('10', 'Hero Electric', 'Koramangala', cityCoords, 0.003, 0.014, 4.0, 75, true, 1),
    ],
    'New Delhi': [
      createMockStation('11', 'EESL Charging Hub', 'Connaught Place', cityCoords, 0.005, 0.007, 4.4, 130, true, 2),
      createMockStation('12', 'NDMC EV Station', 'Lutyens Delhi', cityCoords, -0.006, 0.003, 4.0, 90, true, 1),
      createMockStation('13', 'Fortum Charge & Drive', 'South Extension', cityCoords, 0.01, -0.009, 4.5, 160, false, 3),
      createMockStation('14', 'Tata Power Delhi', 'Dwarka', cityCoords, -0.018, -0.014, 4.2, 105, true, 2),
      createMockStation('15', 'Exicom Power', 'Nehru Place', cityCoords, 0.011, 0.004, 4.1, 85, true, 1),
    ],
    'Mumbai': [
      createMockStation('16', 'Adani Electricity', 'Bandra', cityCoords, 0.007, 0.009, 4.6, 140, true, 3),
      createMockStation('17', 'BEST EV Station', 'Dadar', cityCoords, -0.004, 0.006, 4.0, 80, false, 1),
      createMockStation('18', 'Tata Power Mumbai', 'Powai', cityCoords, 0.013, -0.005, 4.7, 170, true, 2),
      createMockStation('19', 'Magenta ChargeGrid', 'Worli', cityCoords, -0.009, -0.01, 4.3, 115, true, 2),
      createMockStation('20', 'Jio-bp pulse', 'Andheri', cityCoords, 0.016, 0.002, 4.4, 95, true, 3),
    ],
    'Chennai': [
      createMockStation('21', 'TANGEDCO Station', 'Anna Nagar', cityCoords, 0.008, 0.01, 4.2, 110, true, 1),
      createMockStation('22', 'Power Grid EV Hub', 'T Nagar', cityCoords, -0.007, 0.004, 4.3, 95, false, 2),
      createMockStation('23', 'Convergence Energy', 'Adyar', cityCoords, 0.011, -0.008, 4.5, 125, true, 3),
      createMockStation('24', 'Sun Mobility', 'Velachery', cityCoords, -0.013, -0.011, 4.1, 85, true, 2),
      createMockStation('25', 'IOCL e-Drive', 'Mount Road', cityCoords, 0.005, 0.015, 4.0, 70, true, 1),
    ]
  };
  
  return stationData[city] || stationData['Hyderabad'];
};

// Helper to create a consistent mock station
const createMockStation = (
  id: string,
  name: string,
  vicinity: string,
  cityCoords: LocationCoords,
  latOffset: number,
  lngOffset: number,
  rating: number,
  userRatings: number,
  available: boolean,
  priceLevel: number
): Station => {
  return {
    id,
    place_id: `place_${id}`,
    name,
    vicinity,
    rating,
    user_ratings_total: userRatings,
    geometry: {
      location: {
        lat: cityCoords.lat + latOffset,
        lng: cityCoords.lng + lngOffset,
      },
    },
    available,
    price_level: priceLevel,
    opening_hours: {
      open_now: Math.random() > 0.2 // 80% chance of being open
    }
  };
};

export const getStationDetails = async (stationId: string): Promise<Station | null> => {
  try {
    // In a real implementation, this would call Google Places API for details
    let idNumber = parseInt(stationId.replace('place_', ''));
    if (isNaN(idNumber)) idNumber = 1;
    
    // Determine which city's station this is
    let matchingStation: Station | null = null;
    
    for (const city of Object.keys(INDIAN_CITIES)) {
      const stations = getMockStationsForCity(city);
      const found = stations.find(station => station.id === stationId || station.place_id === stationId);
      if (found) {
        matchingStation = found;
        break;
      }
    }
    
    if (!matchingStation) {
      // Default to the first Hyderabad station if no match
      matchingStation = getMockStationsForCity('Hyderabad')[0];
    }
    
    // Add details that weren't in the list view
    return {
      ...matchingStation,
      photos: [
        { photo_reference: `mock_photo_ref_${stationId}_1` },
        { photo_reference: `mock_photo_ref_${stationId}_2` }
      ]
    };
  } catch (error) {
    console.error('Error fetching station details:', error);
    return null;
  }
};
