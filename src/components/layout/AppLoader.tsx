
import React from 'react';
import { usePollen } from '@/context/PollenContext';
import { Loader2 } from 'lucide-react';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const { isLoading } = usePollen();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading PollenPedia...</h2>
        <p className="text-muted-foreground mt-2">This may take a moment while we load your data.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoader;
