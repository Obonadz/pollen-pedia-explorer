
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearchChange?: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  return (
    <nav className="border-b border-border bg-card py-3 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <span className="inline-block bg-nature-500 w-8 h-8 rounded-full"></span>
          <Link to="/" className="font-bold text-2xl text-nature-700">PollenPedia</Link>
        </div>
        
        <div className="flex items-center w-full sm:w-auto space-x-4">
          <div className="relative flex-grow sm:w-64 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pollen..."
              className="pl-10 pr-4 py-2"
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
          <Button asChild variant="default">
            <Link to="/database">Database</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/add">Add New</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
