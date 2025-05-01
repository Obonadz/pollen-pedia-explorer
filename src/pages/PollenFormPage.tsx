import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { usePollen } from '@/context/PollenContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Image, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PollenFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPollenById, addPollen, updatePollen } = usePollen();
  
  const existingPollen = id ? getPollenById(id) : undefined;
  const isEditMode = !!existingPollen;
  
  const [form, setForm] = useState({
    latinName: existingPollen?.latinName || '',
    arabicName: existingPollen?.arabicName || '',
    species: existingPollen?.species || '',
    family: existingPollen?.family || '',
    plantOrigin: existingPollen?.plantOrigin || '',
    polarMeasurement: existingPollen?.measurement?.polar || '',
    equatorialMeasurement: existingPollen?.measurement?.equatorial || '',
    dispersal: existingPollen?.dispersal || '',
    aperture: existingPollen?.aperture || '',
    morphType: existingPollen?.morphType || '',
    pattern: existingPollen?.pattern || '',
    featured: existingPollen?.featured || false
  });
  
  const [images, setImages] = useState<string[]>(existingPollen?.images || []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // In a real app, we'd upload this to a server
      // For now, we'll use a URL.createObjectURL as a placeholder
      const imageUrl = URL.createObjectURL(file);
      setImages([...images, imageUrl]);
      
      toast({
        title: "Image added",
        description: "Your image has been added to the gallery."
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pollenData = {
        latinName: form.latinName,
        arabicName: form.arabicName,
        species: form.species,
        family: form.family,
        plantOrigin: form.plantOrigin,
        measurement: {
          polar: form.polarMeasurement,
          equatorial: form.equatorialMeasurement
        },
        dispersal: form.dispersal,
        aperture: form.aperture,
        morphType: form.morphType,
        pattern: form.pattern,
        images,
        featured: form.featured
      };
      
      if (isEditMode && id) {
        updatePollen(id, pollenData);
        navigate(`/pollen/${id}`);
      } else {
        addPollen(pollenData);
        navigate('/database');
      }
    } catch (error) {
      console.error('Error saving pollen:', error);
      toast({
        title: "Error",
        description: "There was an error saving the pollen data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to={isEditMode ? `/pollen/${id}` : '/database'}>
              <ArrowLeft className="h-4 w-4 mr-2" /> 
              {isEditMode ? 'Back to Pollen Details' : 'Back to Database'}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Pollen' : 'Add New Pollen'}</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Basic Info */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="latinName">Latin Name *</Label>
                    <Input
                      id="latinName"
                      name="latinName"
                      value={form.latinName}
                      onChange={handleChange}
                      placeholder="e.g., Helianthus annuus"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="arabicName">Arabic Name</Label>
                    <Input
                      id="arabicName"
                      name="arabicName"
                      value={form.arabicName}
                      onChange={handleChange}
                      placeholder="e.g., عباد الشمس"
                      dir="rtl"
                      className="text-right"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="species">Species Name *</Label>
                    <Input
                      id="species"
                      name="species"
                      value={form.species}
                      onChange={handleChange}
                      placeholder="e.g., Sunflower"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="family">Family *</Label>
                    <Input
                      id="family"
                      name="family"
                      value={form.family}
                      onChange={handleChange}
                      placeholder="e.g., Asteraceae"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plantOrigin">Plant Origin *</Label>
                    <Input
                      id="plantOrigin"
                      name="plantOrigin"
                      value={form.plantOrigin}
                      onChange={handleChange}
                      placeholder="e.g., Dubai, Abu Dhabi, Sharjah"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Feature this pollen</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Middle column - Measurements & Properties */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Measurements & Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="polarMeasurement">Polar Measurement (µm) *</Label>
                    <Input
                      id="polarMeasurement"
                      name="polarMeasurement"
                      value={form.polarMeasurement}
                      onChange={handleChange}
                      placeholder="e.g., 25-30 µm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="equatorialMeasurement">Equatorial Measurement (µm) *</Label>
                    <Input
                      id="equatorialMeasurement"
                      name="equatorialMeasurement"
                      value={form.equatorialMeasurement}
                      onChange={handleChange}
                      placeholder="e.g., 28-32 µm"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dispersal">Dispersal *</Label>
                    <Input
                      id="dispersal"
                      name="dispersal"
                      value={form.dispersal}
                      onChange={handleChange}
                      placeholder="e.g., Zoophilous"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aperture">Aperture *</Label>
                    <Input
                      id="aperture"
                      name="aperture"
                      value={form.aperture}
                      onChange={handleChange}
                      placeholder="e.g., Tricolporate"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="morphType">Morph Type *</Label>
                    <Input
                      id="morphType"
                      name="morphType"
                      value={form.morphType}
                      onChange={handleChange}
                      placeholder="e.g., Prolate spheroidal"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pattern">Pattern *</Label>
                    <Input
                      id="pattern"
                      name="pattern"
                      value={form.pattern}
                      onChange={handleChange}
                      placeholder="e.g., Echinate"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Right column - Images */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-dashed border-2 border-border rounded-lg p-6 text-center cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                    <Input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                      <Image className="h-10 w-10 mb-2 text-muted-foreground" />
                      <span className="font-medium mb-1">Add Images</span>
                      <span className="text-sm text-muted-foreground">Click to upload</span>
                    </Label>
                  </div>
                  
                  {images.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Uploaded Images ({images.length})</h3>
                      <div className="image-gallery">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={img} 
                              alt={`Pollen view ${index + 1}`} 
                              className="rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      No images uploaded yet. Images help with identification.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(isEditMode ? `/pollen/${id}` : '/database')}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-nature-600 hover:bg-nature-700">
              {isEditMode ? 'Update Pollen' : 'Add Pollen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PollenFormPage;
