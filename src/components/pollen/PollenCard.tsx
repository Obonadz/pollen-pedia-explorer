
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Pollen } from '@/types/Pollen';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ZoomIn, ZoomOut, Image } from 'lucide-react';

interface PollenCardProps {
  pollen: Pollen;
}

const PollenCard: React.FC<PollenCardProps> = ({ pollen }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1493962853295-0fd70327578a';
  const imageUrl = pollen.images && pollen.images.length > 0 ? pollen.images[0] : defaultImage;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 1));
  const resetZoom = () => setZoomLevel(1);

  return (
    <Card className="overflow-hidden transition-all duration-300 pollen-card">
      <div className="aspect-square relative overflow-hidden">
        <Dialog onOpenChange={resetZoom}>
          <DialogTrigger asChild>
            <img 
              src={imageUrl} 
              alt={pollen.species} 
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition-all"
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl p-0 bg-black/90 border-none">
            <div className="relative flex flex-col items-center p-4">
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-black/50 text-white border-white/30 hover:bg-white/20">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-black/50 text-white border-white/30 hover:bg-white/20">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
              <div className="overflow-auto w-full h-[70vh] flex items-center justify-center">
                <img 
                  src={pollen.images?.[currentImageIndex] || defaultImage} 
                  alt={pollen.species} 
                  className="transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>
              <p className="text-white/80 mt-2">{pollen.species} - {currentImageIndex + 1}/{pollen.images?.length || 1}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {pollen.images && pollen.images.length > 1 && (
        <div className="px-4 pt-4">
          <Carousel className="w-full">
            <CarouselContent>
              {pollen.images.map((image, index) => (
                <CarouselItem key={index} className="basis-1/3 min-w-0">
                  <div className="p-1 h-16 aspect-square">
                    <img 
                      src={image} 
                      alt={`${pollen.species} ${index + 1}`} 
                      className={`h-full w-full rounded-md object-cover border-2 cursor-pointer ${index === 0 ? 'border-primary' : 'border-transparent'}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <h3 className="font-medium text-lg">{pollen.species}</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <p className="text-sm text-muted-foreground italic">{pollen.latinName}</p>
          {pollen.arabicName && (
            <p className="text-sm text-muted-foreground" dir="rtl">{pollen.arabicName}</p>
          )}
        </div>
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
