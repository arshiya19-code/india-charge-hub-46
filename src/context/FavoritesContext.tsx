
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

interface Station {
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
}

interface FavoritesContextProps {
  favorites: Station[];
  addToFavorites: (station: Station) => Promise<void>;
  removeFromFavorites: (stationId: string) => Promise<void>;
  isFavorite: (stationId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setFavorites([]);
        return;
      }

      try {
        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const favoritesList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data.station
          } as Station;
        });
        
        setFavorites(favoritesList);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const addToFavorites = async (station: Station) => {
    if (!currentUser) {
      toast.error('Please log in to save favorites');
      return;
    }

    try {
      const favoritesRef = collection(db, 'favorites');
      await addDoc(favoritesRef, {
        userId: currentUser.uid,
        station,
        createdAt: new Date()
      });
      
      setFavorites([...favorites, station]);
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (stationId: string) => {
    if (!currentUser) return;

    try {
      const favoriteToRemove = favorites.find(fav => fav.place_id === stationId);
      if (!favoriteToRemove) return;

      const docRef = doc(db, 'favorites', favoriteToRemove.id);
      await deleteDoc(docRef);
      
      setFavorites(favorites.filter(fav => fav.place_id !== stationId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(station => station.place_id === stationId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
