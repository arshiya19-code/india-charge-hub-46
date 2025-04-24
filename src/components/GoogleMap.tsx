
import { Station, LocationCoords } from '@/types';

interface GoogleMapProps {
  stations: Station[];
  userLocation: LocationCoords;
  onMarkerClick?: (station: Station) => void;
  className?: string;
}

const GoogleMap = ({ className = '' }: GoogleMapProps) => {
  return (
    <div className={`relative w-full h-[350px] rounded-lg overflow-hidden ${className}`}>
      <img 
        src="/lovable-uploads/f4ad4bd7-200d-4ffc-9fe2-1854e40db682.png"
        alt="EV Charging Stations Map"
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
