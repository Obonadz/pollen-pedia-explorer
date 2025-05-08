
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Upload, X } from 'lucide-react';
import { usePollen } from '@/context/PollenContext';

interface ImageUploaderProps {
  onImageAdded: (imageId: string) => void;
  onImageRemoved?: () => void;
  existingImage?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageAdded, 
  onImageRemoved,
  existingImage,
  className = ''
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { saveImageToDB, getImageFromDB } = usePollen();

  // Load existing image if provided
  React.useEffect(() => {
    if (existingImage) {
      const loadExistingImage = async () => {
        const imageData = await getImageFromDB(existingImage);
        if (imageData) {
          setPreview(imageData);
        }
      };
      loadExistingImage();
    }
  }, [existingImage, getImageFromDB]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Save to IndexedDB
      const imageId = await saveImageToDB(file);
      onImageAdded(imageId);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className={`${className}`}>
      {!preview ? (
        <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">Click to upload or drag and drop</p>
          <Button 
            variant="outline" 
            disabled={isLoading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {isLoading ? 'Uploading...' : 'Select Image'}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-40 object-cover rounded-md" 
          />
          <Button 
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
