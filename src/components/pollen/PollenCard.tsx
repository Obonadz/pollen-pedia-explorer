
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Pollen } from '@/types/Pollen';

interface PollenCardProps {
  pollen: Pollen;
}

const PollenCard: React.FC<PollenCardProps> = ({ pollen }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1493962853295-0fd70327578a';
  const imageUrl = pollen.images && pollen.images.length > 0 ? pollen.images[0] : defaultImage;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 pollen-card">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={pollen.species} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <h3 className="font-medium text-lg">{pollen.species}</h3>
        <p className="text-sm text-muted-foreground italic">{pollen.latinName}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm"><span className="font-medium">Family:</span> {pollen.family}</p>
        <p className="text-sm"><span className="font-medium">Origin:</span> {pollen.plantOrigin}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="default" className="w-full">
          <Link to={`/pollen/${pollen.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollenCard;
