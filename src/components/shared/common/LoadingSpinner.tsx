import { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import loadingGif from '@/assets/loading-animation-HD_medium.gif';

interface LoadingSpinnerProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  size?: number;
}

const LoadingSpinner = ({ size = 24, className, ...props }: LoadingSpinnerProps) => (
  <img
    src={loadingGif}
    alt="Loading"
    width={size}
    height={size}
    className={cn('inline-block object-contain', className)}
    {...props}
  />
);

export default LoadingSpinner;
