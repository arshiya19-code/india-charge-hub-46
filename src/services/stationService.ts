
import { Station, LocationCoords } from '../types';

interface StationsResponse {
  stations: Station[];
  error?: string;
}

// This is a mock service until we have the actual Google Places API key
export const fetchNearbyStations = async (
  location: LocationCoords,
  radius: number = 5000
): Promise<StationsResponse> => {
  try {
    // Mock data for now - In real implementation, this would call Google Places API
    const mockStations: Station[] = [
      {
        id: '1',
        place_id: 'place123',
        name: 'Tata Power EV Charging Station',
        vicinity: '123 MG Road, Bangalore',
        rating: 4.5,
        user_ratings_total: 120,
        geometry: {
          location: {
            lat: location.lat + 0.01,
            lng: location.lng + 0.01,
          },
        },
        available: true,
        price_level: 2,
      },
      {
        id: '2',
        place_id: 'place456',
        name: 'BPCL EV Charging Hub',
        vicinity: '456 Outer Ring Road, Delhi',
        rating: 4.2,
        user_ratings_total: 85,
        geometry: {
          location: {
            lat: location.lat - 0.008,
            lng: location.lng + 0.005,
          },
        },
        available: false,
        price_level: 1,
      },
      {
        id: '3',
        place_id: 'place789',
        name: 'Ather Grid',
        vicinity: '789 Anna Salai, Chennai',
        rating: 4.7,
        user_ratings_total: 210,
        geometry: {
          location: {
            lat: location.lat + 0.005,
            lng: location.lng - 0.007,
          },
        },
        available: true,
        price_level: 3,
      },
      {
        id: '4',
        place_id: 'place012',
        name: 'Reliance EV Charging Park',
        vicinity: '10 Marine Drive, Mumbai',
        rating: 4.0,
        user_ratings_total: 95,
        geometry: {
          location: {
            lat: location.lat - 0.01,
            lng: location.lng - 0.01,
          },
        },
        opening_hours: {
          open_now: true,
        },
        available: true,
        price_level: 2,
      },
      {
        id: '5',
        place_id: 'place345',
        name: 'IOCL Fast Charger',
        vicinity: '22 Rajpath, New Delhi',
        rating: 3.9,
        user_ratings_total: 65,
        geometry: {
          location: {
            lat: location.lat + 0.015,
            lng: location.lng - 0.003,
          },
        },
        opening_hours: {
          open_now: true,
        },
        available: true,
        price_level: 1,
      },
    ];

    return { stations: mockStations };
  } catch (error) {
    console.error('Error fetching nearby stations:', error);
    return { stations: [], error: 'Failed to fetch nearby stations' };
  }
};

export const getStationDetails = async (stationId: string): Promise<Station | null> => {
  try {
    // In real implementation, this would call Google Places API for details
    // Mocking a single station detail for now
    const mockDetail: Station = {
      id: stationId,
      place_id: `place_${stationId}`,
      name: 'Tata Power EV Charging Station',
      vicinity: '123 MG Road, Bangalore',
      rating: 4.5,
      user_ratings_total: 120,
      geometry: {
        location: {
          lat: 12.9716,
          lng: 77.5946,
        },
      },
      available: true,
      price_level: 2,
      opening_hours: {
        open_now: true
      },
      photos: [
        { photo_reference: 'mock_photo_ref_1' },
        { photo_reference: 'mock_photo_ref_2' }
      ]
    };

    return mockDetail;
  } catch (error) {
    console.error('Error fetching station details:', error);
    return null;
  }
};
