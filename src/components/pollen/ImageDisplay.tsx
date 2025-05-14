
import React, { useState, useEffect } from 'react';
import { usePollen } from '@/context/PollenContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageDisplayProps {
  imageId: string;
  alt: string;
  className?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageId, alt, className = '' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { getImageFromDB } = usePollen();

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      setError(false);
      try {
        console.log(`Loading image: ${imageId}`);
        const data = await getImageFromDB(imageId);
        if (data) {
          setImageUrl(data);
          console.log(`Image ${imageId} loaded successfully`);
        } else {
          console.warn(`No data found for image: ${imageId}`);
          setError(true);
        }
      } catch (e) {
        console.error(`Failed to load image ${imageId}:`, e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      loadImage();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [imageId, getImageFromDB]);

  if (loading) {
    return <Skeleton className={`w-full h-40 ${className}`} />;
  }

  if (error || !imageUrl) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className} rounded-md`}>
        <span className="text-muted-foreground">Image not available</span>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      loading="lazy"
      onError={(e) => {
        console.error(`Error loading image: ${imageId}`);
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
};

export default ImageDisplay;
