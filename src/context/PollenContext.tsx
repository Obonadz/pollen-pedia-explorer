
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pollen, samplePollens } from '../types/Pollen';
import { toast } from '@/components/ui/use-toast';
import { savePollens, loadPollens, saveImage, getImage, fileToBase64, imageUrlToBase64 } from '../utils/indexedDB';

interface PollenContextProps {
  pollens: Pollen[];
  addPollen: (pollen: Omit<Pollen, 'id' | 'createdAt'>) => void;
  updatePollen: (id: string, pollen: Partial<Pollen>) => void;
  deletePollen: (id: string) => void;
  filteredPollens: Pollen[];
  setFilter: (filter: string) => void;
  getPollenById: (id: string) => Pollen | undefined;
  saveImageToDB: (file: File) => Promise<string>;
  getImageFromDB: (id: string) => Promise<string | null>;
  isLoading: boolean;
}

const PollenContext = createContext<PollenContextProps | undefined>(undefined);

export const PollenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollens, setPollens] = useState<Pollen[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load pollens from IndexedDB
  useEffect(() => {
    const fetchPollens = async () => {
      try {
        setIsLoading(true);
        const dbPollens = await loadPollens();
        
        if (dbPollens && dbPollens.length > 0) {
          // Convert all date strings back to Date objects
          const formattedPollens = dbPollens.map(pollen => ({
            ...pollen,
            createdAt: new Date(pollen.createdAt)
          }));
          
          setPollens(formattedPollens);
        } else {
          // If no pollens in IndexedDB, use sample data and save it
          // Also process any images in sample data
          const processedSamples = await Promise.all(samplePollens.map(async (pollen) => {
            // Process sample image URLs to base64 and save them
            const processedImages = await Promise.all(pollen.images.map(async (imageUrl, index) => {
              try {
                const imageId = `${pollen.id}-image-${index}`;
                const base64 = await imageUrlToBase64(imageUrl);
                await saveImage(imageId, base64);
                return imageId;
              } catch (error) {
                console.error('Error processing image:', error);
                return imageUrl; // Fall back to URL if conversion fails
              }
            }));
            
            return {
              ...pollen,
              images: processedImages
            };
          }));
          
          setPollens(processedSamples);
          savePollens(processedSamples);
        }
      } catch (error) {
        console.error('Error loading pollens from IndexedDB:', error);
        setPollens(samplePollens);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPollens();
  }, []);
  
  // Save pollens to IndexedDB whenever they change
  useEffect(() => {
    if (!isLoading && pollens.length > 0) {
      savePollens(pollens);
    }
  }, [pollens, isLoading]);
  
  const addPollen = async (newPollen: Omit<Pollen, 'id' | 'createdAt'>) => {
    const pollen: Pollen = {
      ...newPollen,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setPollens([...pollens, pollen]);
    toast({
      title: "Success",
      description: `${pollen.latinName} has been added to the database.`,
    });
  };
  
  const updatePollen = (id: string, updatedData: Partial<Pollen>) => {
    setPollens(
      pollens.map(pollen => 
        pollen.id === id ? { ...pollen, ...updatedData } : pollen
      )
    );
    toast({
      title: "Updated",
      description: "Pollen information has been updated.",
    });
  };
  
  const deletePollen = (id: string) => {
    const pollenToDelete = pollens.find(p => p.id === id);
    setPollens(pollens.filter(pollen => pollen.id !== id));
    toast({
      title: "Deleted",
      description: `${pollenToDelete?.latinName || 'Pollen'} has been removed from the database.`,
      variant: "destructive"
    });
  };
  
  const getPollenById = (id: string) => {
    return pollens.find(pollen => pollen.id === id);
  };
  
  // Save an image to IndexedDB and return the generated ID
  const saveImageToDB = async (file: File): Promise<string> => {
    try {
      const imageId = `image-${Date.now()}`;
      const base64Data = await fileToBase64(file);
      await saveImage(imageId, base64Data);
      return imageId;
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        title: "Error",
        description: "Failed to save image. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  // Retrieve an image from IndexedDB by ID
  const getImageFromDB = async (id: string): Promise<string | null> => {
    try {
      // If the id seems to be a URL, return it as is
      if (id.startsWith('http')) {
        return id;
      }
      return await getImage(id);
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  };
  
  // Filter pollens based on the search term
  const filteredPollens = pollens.filter(pollen => {
    const searchTerm = filter.toLowerCase();
    return (
      pollen.latinName.toLowerCase().includes(searchTerm) ||
      (pollen.arabicName && pollen.arabicName.includes(searchTerm)) ||
      pollen.species.toLowerCase().includes(searchTerm) ||
      pollen.family.toLowerCase().includes(searchTerm) ||
      pollen.plantOrigin.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <PollenContext.Provider 
      value={{ 
        pollens, 
        addPollen, 
        updatePollen, 
        deletePollen,
        filteredPollens,
        setFilter,
        getPollenById,
        saveImageToDB,
        getImageFromDB,
        isLoading
      }}
    >
      {children}
    </PollenContext.Provider>
  );
};

export const usePollen = () => {
  const context = useContext(PollenContext);
  if (context === undefined) {
    throw new Error('usePollen must be used within a PollenProvider');
  }
  return context;
};
