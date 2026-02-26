import { ImgHTMLAttributes, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageWithSkeletonProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  skeletonClassName?: string;
}

const ImageWithSkeleton = ({
  wrapperClassName,
  skeletonClassName,
  className,
  src,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...props
}: ImageWithSkeletonProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onError?.(event);
  };

  return (
    <div className={cn('relative', wrapperClassName)}>
      {!isLoaded && (
        <Skeleton className={cn('absolute inset-0 rounded-none', skeletonClassName)} />
      )}
      <img
        ref={imgRef}
        src={src}
        loading={loading}
        decoding={decoding}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;
