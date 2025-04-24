
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-2">
          <MapPin size={36} className="text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold font-heading">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! This charging station doesn't exist</p>
        <Button asChild size="lg">
          <Link to="/">Find Stations Nearby</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
