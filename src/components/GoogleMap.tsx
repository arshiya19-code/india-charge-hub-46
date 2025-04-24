
import { useEffect, useRef } from 'react';
import { Station, LocationCoords } from '@/types';

interface GoogleMapProps {
  stations: Station[];
  userLocation: LocationCoords;
  onMarkerClick?: (station: Station) => void;
  className?: string;
}

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

  // Setup map when component mounts
  useEffect(() => {
    // Mock function for now - in real app we'd use the actual Google Maps API
    const mockInitializeMap = () => {
      if (!mapRef.current) return;

      // Create a div to simulate the map
      const mockMap = document.createElement('div');
      mockMap.style.width = '100%';
      mockMap.style.height = '100%';
      mockMap.style.backgroundColor = '#eef2f6';
      mockMap.style.position = 'relative';
      mockMap.style.borderRadius = '0.75rem';
      mockMap.style.overflow = 'hidden';

      // Clear existing content
      while (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild);
      }

      mapRef.current.appendChild(mockMap);

      // Add user location marker
      const userMarker = document.createElement('div');
      userMarker.style.position = 'absolute';
      userMarker.style.width = '20px';
      userMarker.style.height = '20px';
      userMarker.style.backgroundColor = '#1d4ed8';
      userMarker.style.borderRadius = '50%';
      userMarker.style.border = '3px solid white';
      userMarker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      userMarker.style.left = '50%';
      userMarker.style.top = '50%';
      userMarker.style.transform = 'translate(-50%, -50%)';
      userMarker.style.zIndex = '10';
      mockMap.appendChild(userMarker);

      // Create pulsing effect
      const pulseRing = document.createElement('div');
      pulseRing.style.position = 'absolute';
      pulseRing.style.width = '40px';
      pulseRing.style.height = '40px';
      pulseRing.style.backgroundColor = 'rgba(29, 78, 216, 0.2)';
      pulseRing.style.borderRadius = '50%';
      pulseRing.style.left = '50%';
      pulseRing.style.top = '50%';
      pulseRing.style.transform = 'translate(-50%, -50%)';
      pulseRing.style.zIndex = '5';
      pulseRing.style.animation = 'pulse 2s infinite';
      mockMap.appendChild(pulseRing);

      // Add station markers at random positions
      stations.forEach((station, index) => {
        const stationMarker = document.createElement('div');
        stationMarker.style.position = 'absolute';
        stationMarker.style.width = '30px';
        stationMarker.style.height = '30px';
        stationMarker.style.backgroundColor = 'white';
        stationMarker.style.borderRadius = '50%';
        stationMarker.style.display = 'flex';
        stationMarker.style.alignItems = 'center';
        stationMarker.style.justifyContent = 'center';
        stationMarker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        stationMarker.style.cursor = 'pointer';
        
        // Position markers randomly around center
        const randomOffsetX = (Math.random() - 0.5) * 200;
        const randomOffsetY = (Math.random() - 0.5) * 200;
        stationMarker.style.left = `calc(50% + ${randomOffsetX}px)`;
        stationMarker.style.top = `calc(50% + ${randomOffsetY}px)`;
        
        // Add EV icon
        stationMarker.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><path d="M19 7h-3V2H8v5H5l7 7 7-7zm-8 13v-2h2v2h-2zm-4 0v-2h2v2H7zm8 0v-2h2v2h-2z"/></svg>`;
        
        // Add station name tooltip
        stationMarker.title = station.name;
        
        stationMarker.onclick = () => {
          if (onMarkerClick) onMarkerClick(station);
        };
        
        mockMap.appendChild(stationMarker);
      });

      // Add a "mock" info message
      const infoMessage = document.createElement('div');
      infoMessage.style.position = 'absolute';
      infoMessage.style.bottom = '10px';
      infoMessage.style.left = '10px';
      infoMessage.style.backgroundColor = 'rgba(255,255,255,0.8)';
      infoMessage.style.padding = '8px 12px';
      infoMessage.style.borderRadius = '4px';
      infoMessage.style.fontSize = '12px';
      infoMessage.innerText = '⚠️ Mock map (Google Maps API integration required)';
      mockMap.appendChild(infoMessage);

      // Add a style tag for the pulse animation
      const styleTag = document.createElement('style');
      styleTag.innerHTML = `
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          70% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(styleTag);
    };

    mockInitializeMap();
  }, [stations]);

  return (
    <div ref={mapRef} className={`map-container ${className}`}></div>
  );
};

export default GoogleMap;
