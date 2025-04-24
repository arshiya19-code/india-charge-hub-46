
import { useEffect, useRef } from 'react';
import { Station, LocationCoords } from '@/types';

interface GoogleMapProps {
  stations: Station[];
  userLocation: LocationCoords;
  onMarkerClick?: (station: Station) => void;
  className?: string;
}

// Add Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap = ({ stations, userLocation, onMarkerClick, className = '' }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  useEffect(() => {
    // Load Google Maps script dynamically if needed
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDqZsZyzE2aUcf-GxcuD9N41dJaHt-TNsE&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    // Initialize the map
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Create the map instance
      const mapOptions = {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        }
      };
      
      mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions);
      
      // Add user location marker
      new google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapInstanceRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#1d4ed8',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
        title: 'Your Location'
      });
      
      // Add station markers
      markersRef.current = stations.map(station => {
        const marker = new google.maps.Marker({
          position: { 
            lat: station.geometry.location.lat, 
            lng: station.geometry.location.lng 
          },
          map: mapInstanceRef.current,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2">
                <path d="M19 7h-3V2H8v5H5l7 7 7-7zm-8 13v-2h2v2h-2zm-4 0v-2h2v2H7zm8 0v-2h2v2h-2z"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16)
          },
          title: station.name
        });
        
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-medium text-base">${station.name}</h3>
              <p class="text-sm text-gray-500">${station.vicinity}</p>
              ${station.rating ? `<p class="text-sm">⭐ ${station.rating}/5</p>` : ''}
            </div>
          `
        });
        
        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(station);
          } else {
            infoWindow.open(mapInstanceRef.current, marker);
          }
        });
        
        return marker;
      });
    };
    
    loadGoogleMapsScript();
    
    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (window.google && mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [stations, userLocation]);

  return (
    <div ref={mapRef} className={`map-container h-[350px] ${className}`}></div>
  );
};

export default GoogleMap;
