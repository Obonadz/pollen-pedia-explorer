
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import PollenCard from '@/components/pollen/PollenCard';
import { usePollen } from '@/context/PollenContext';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatabasePage: React.FC = () => {
  const { filteredPollens, setFilter } = usePollen();
  const [sortOption, setSortOption] = useState('name');

  const handleSearchChange = (term: string) => {
    setFilter(term);
  };

  // Extract unique families for the filter
  const families = Array.from(new Set(filteredPollens.map(p => p.family)));

  // Sort the pollens based on the selected option
  const sortedPollens = [...filteredPollens].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.latinName.localeCompare(b.latinName);
      case 'family':
        return a.family.localeCompare(b.family);
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearchChange={handleSearchChange} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Pollen Database</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="family">Sort by Family</SelectItem>
                <SelectItem value="recent">Sort by Most Recent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button asChild>
              <Link to="/add"><Plus className="h-4 w-4 mr-2" /> Add New Pollen</Link>
            </Button>
          </div>
        </div>
        
        {filteredPollens.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {sortedPollens.map(pollen => (
                <PollenCard key={pollen.id} pollen={pollen} />
              ))}
            </div>
            
            <p className="text-center text-muted-foreground">
              Showing {filteredPollens.length} pollen {filteredPollens.length === 1 ? 'type' : 'types'}
            </p>
          </>
        ) : (
          <div className="text-center p-12 bg-muted rounded-lg">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-2">No pollen types found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or add new pollen types to your database.
            </p>
            <Button asChild>
              <Link to="/add">Add New Pollen</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabasePage;
