
export interface Station {
  id: string;
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: { photo_reference: string }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  opening_hours?: {
    open_now: boolean;
  };
  available?: boolean; // For real-time availability
  price_level?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
}

export interface LocationCoords {
  lat: number;
  lng: number;
}
