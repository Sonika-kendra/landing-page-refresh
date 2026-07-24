import { getShapeIcon } from '@/assets/diamonds/shapes-svg';

const ShapeIcon = ({ shape, className = 'h-4 w-4' }: { shape: string; className?: string }) => {
  const icon = getShapeIcon(shape);
  if (!icon) return null;
  return <span className={`inline-block shrink-0 ${className}`} dangerouslySetInnerHTML={{ __html: icon }} />;
};

export default ShapeIcon;
