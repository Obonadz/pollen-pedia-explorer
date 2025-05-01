
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import PollenCard from '@/components/pollen/PollenCard';
import { Button } from '@/components/ui/button';
import { usePollen } from '@/context/PollenContext';
import { Search, Plus } from 'lucide-react';

const HomePage: React.FC = () => {
  const { filteredPollens, setFilter } = usePollen();
  const [searchTerm, setSearchTerm] = useState('');
  
  const featuredPollens = filteredPollens.filter(pollen => pollen.featured);
  const recentPollens = [...filteredPollens]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setFilter(term);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearchChange={handleSearchChange} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-nature-100 to-nature-50 rounded-lg p-8 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-nature-900 mb-4">PollenPedia Explorer</h1>
            <p className="text-xl text-nature-800 mb-6">
              The comprehensive database for pollen identification and classification.
              Explore detailed information, high-quality images, and scientific data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-nature-600 hover:bg-nature-700 text-white">
                <Link to="/database">Explore Database</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-nature-600 text-nature-600">
                <Link to="/add"><Plus className="h-4 w-4 mr-2" /> Add New Pollen</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Pollen Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Featured Pollen Types</h2>
            <Button asChild variant="outline">
              <Link to="/database">View All</Link>
            </Button>
          </div>
          
          {featuredPollens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {featuredPollens.map(pollen => (
                <PollenCard key={pollen.id} pollen={pollen} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-lg">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No featured pollen types found</h3>
              <p className="text-muted-foreground mb-4">
                There are no featured pollen types in the database yet.
              </p>
              <Button asChild>
                <Link to="/add">Add New Pollen</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Recent Additions Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Recent Additions</h2>
          </div>
          
          {recentPollens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPollens.map(pollen => (
                <PollenCard key={pollen.id} pollen={pollen} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-lg">
              <h3 className="text-xl font-medium mb-2">No pollen types in database</h3>
              <p className="text-muted-foreground mb-4">
                Start adding pollen types to your database.
              </p>
              <Button asChild>
                <Link to="/add">Add New Pollen</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
      
      <footer className="bg-muted py-8 mt-16 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            PollenPedia Explorer &copy; {new Date().getFullYear()} - Your comprehensive pollen database
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
