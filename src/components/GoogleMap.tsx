
import { Station, LocationCoords } from '@/types';

interface GoogleMapProps {
  stations: Station[];
  userLocation: LocationCoords;
  onMarkerClick?: (station: Station) => void;
  className?: string;
}

const GoogleMap = ({ stations, userLocation, onMarkerClick, className = '' }: GoogleMapProps) => {
  return (
    <div className={`relative w-full h-[350px] rounded-lg overflow-hidden ${className}`}>
      <img 
        src="/lovable-uploads/3fb41468-ec12-48a1-9d14-4d3a6862a26c.png"
        alt="EV Charging Stations Map (Hyderabad)"
        className="w-full h-full object-cover"
      />
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button className="bg-white rounded-md shadow-md w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100">
          +
        </button>
        <button className="bg-white rounded-md shadow-md w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100">
          -
        </button>
      </div>
    </div>
  );
};

export default GoogleMap;
