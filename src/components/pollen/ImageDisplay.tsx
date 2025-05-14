
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
  const { getImageFromDB } = usePollen();

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      try {
        const data = await getImageFromDB(imageId);
        setImageUrl(data);
      } catch (error) {
        console.error('Failed to load image:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageId, getImageFromDB]);

  if (loading) {
    return <Skeleton className={`w-full h-40 ${className}`} />;
  }

  if (!imageUrl) {
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
        e.currentTarget.src = '/placeholder.svg';
      }}
    />
  );
};

export default ImageDisplay;
