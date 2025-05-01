
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pollen, samplePollens } from '../types/Pollen';
import { toast } from '@/components/ui/use-toast';

interface PollenContextProps {
  pollens: Pollen[];
  addPollen: (pollen: Omit<Pollen, 'id' | 'createdAt'>) => void;
  updatePollen: (id: string, pollen: Partial<Pollen>) => void;
  deletePollen: (id: string) => void;
  filteredPollens: Pollen[];
  setFilter: (filter: string) => void;
  getPollenById: (id: string) => Pollen | undefined;
}

const PollenContext = createContext<PollenContextProps | undefined>(undefined);

export const PollenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load pollens from localStorage, or use sample data
  const loadPollens = (): Pollen[] => {
    try {
      const savedPollens = localStorage.getItem('pollens');
      return savedPollens ? JSON.parse(savedPollens) : samplePollens;
    } catch (error) {
      console.error('Error loading pollens from localStorage:', error);
      return samplePollens;
    }
  };

  const [pollens, setPollens] = useState<Pollen[]>(loadPollens());
  const [filter, setFilter] = useState('');
  
  // Save pollens to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pollens', JSON.stringify(pollens));
    } catch (error) {
      console.error('Error saving pollens to localStorage:', error);
    }
  }, [pollens]);
  
  const addPollen = (newPollen: Omit<Pollen, 'id' | 'createdAt'>) => {
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
  
  // Filter pollens based on the search term
  const filteredPollens = pollens.filter(pollen => {
    const searchTerm = filter.toLowerCase();
    return (
      pollen.latinName.toLowerCase().includes(searchTerm) ||
      (pollen.arabicName && pollen.arabicName.includes(searchTerm)) || // Added Arabic name search
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
        getPollenById
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
