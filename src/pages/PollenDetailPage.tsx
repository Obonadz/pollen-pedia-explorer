
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePollen } from '@/context/PollenContext';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, ZoomIn, ZoomOut, Images } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import UAEMap from '@/components/map/UAEMap';

const PollenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPollenById, deletePollen } = usePollen();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const pollen = getPollenById(id || '');
  
  if (!pollen) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Pollen Not Found</h1>
          <p className="text-muted-foreground mb-8">The pollen type you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/database">Return to Database</Link>
          </Button>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1493962853295-0fd70327578a';
  const mainImage = pollen.images && pollen.images.length > 0 ? pollen.images[activeImageIndex] : defaultImage;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this pollen entry?')) {
      deletePollen(pollen.id);
      navigate('/database');
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 1));
  const resetZoom = () => setZoomLevel(1);
  
  const handleImageSelect = (index: number) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-nature-50/50 to-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/database">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Database
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{pollen.species}</h1>
          <p className="text-xl text-muted-foreground italic">{pollen.latinName}</p>
          {pollen.arabicName && (
            <p className="text-lg text-muted-foreground font-semibold" dir="rtl">{pollen.arabicName}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images */}
          <div className="lg:col-span-1">
            <Card className="bg-card/80 backdrop-blur-sm border-muted">
              <Dialog onOpenChange={resetZoom}>
                <DialogTrigger asChild>
                  <div className="aspect-square overflow-hidden cursor-pointer relative group">
                    <img 
                      src={mainImage} 
                      alt={pollen.species} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl p-0 bg-black/90 border-none">
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
                        src={mainImage} 
                        alt={pollen.species} 
                        className="transition-transform duration-200"
                        style={{ transform: `scale(${zoomLevel})` }}
                      />
                    </div>
                    <p className="text-white/80 mt-2">{pollen.species} - {activeImageIndex + 1}/{pollen.images?.length || 1}</p>
                  </div>
                </DialogContent>
              </Dialog>
              
              {pollen.images && pollen.images.length > 0 ? (
                <CardContent className="p-4">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {pollen.images.map((img, index) => (
                        <CarouselItem key={index} className="basis-1/4 md:basis-1/5 min-w-0">
                          <div 
                            className={`p-1 cursor-pointer transition-all`}
                            onClick={() => handleImageSelect(index)}
                          >
                            <img 
                              src={img} 
                              alt={`${pollen.species} view ${index + 1}`} 
                              className={`aspect-square rounded-md object-cover border-2 transition-all ${activeImageIndex === index ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-transparent hover:border-muted-foreground/50'}`}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {pollen.images.length > 4 && (
                      <>
                        <CarouselPrevious className="-left-3 bg-background/80" />
                        <CarouselNext className="-right-3 bg-background/80" />
                      </>
                    )}
                  </Carousel>
                </CardContent>
              ) : null}
              
              <div className="p-4 flex justify-between">
                <Button asChild variant="outline">
                  <Link to={`/edit/${pollen.id}`}><Edit className="h-4 w-4 mr-2" /> Edit</Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              </div>
            </Card>
            
            {/* Add UAE Map */}
            <div className="mt-6">
              <Card className="bg-card/80 backdrop-blur-sm border-muted p-4">
                <h3 className="font-medium text-lg mb-3">Plant Origin in UAE</h3>
                <UAEMap region={pollen.plantOrigin} className="w-full" />
              </Card>
            </div>
          </div>
          
          {/* Right column - Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-6 w-full bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="morphology" className="flex-1">Morphology</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card className="bg-card/80 backdrop-blur-sm border-muted">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-lg font-medium mb-4">Botanical Information</h2>
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Latin Name</dt>
                            <dd className="font-medium">{pollen.latinName}</dd>
                          </div>
                          {pollen.arabicName && (
                            <div className="flex flex-col">
                              <dt className="text-sm text-muted-foreground">Arabic Name</dt>
                              <dd className="font-medium" dir="rtl">{pollen.arabicName}</dd>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Species</dt>
                            <dd className="font-medium">{pollen.species}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Family</dt>
                            <dd className="font-medium">{pollen.family}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Plant Origin</dt>
                            <dd className="font-medium">{pollen.plantOrigin}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-medium mb-4">Measurements</h2>
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Polar View</dt>
                            <dd className="font-medium">{pollen.measurement.polar}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Equatorial View</dt>
                            <dd className="font-medium">{pollen.measurement.equatorial}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Added to Database</dt>
                            <dd className="font-medium">
                              {new Date(pollen.createdAt).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="morphology">
                <Card className="bg-card/80 backdrop-blur-sm border-muted">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-lg font-medium mb-4">Morphological Features</h2>
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Dispersal</dt>
                            <dd className="font-medium">{pollen.dispersal}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Aperture</dt>
                            <dd className="font-medium">{pollen.aperture}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-medium mb-4">Structural Information</h2>
                        <dl className="space-y-2">
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Morph Type</dt>
                            <dd className="font-medium">{pollen.morphType}</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm text-muted-foreground">Pattern</dt>
                            <dd className="font-medium">{pollen.pattern}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollenDetailPage;
