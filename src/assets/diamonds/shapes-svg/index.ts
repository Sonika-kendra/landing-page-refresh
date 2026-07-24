import asscher from './asscher.svg?raw';
import cushion from './cushion.svg?raw';
import emerald from './emerald.svg?raw';
import heart from './heart.svg?raw';
import marquise from './marquise.svg?raw';
import oval from './oval.svg?raw';
import pear from './pear.svg?raw';
import princess from './princess.svg?raw';
import radiant from './radiant.svg?raw';
import round from './round.svg?raw';
import trilliant from './trilliant.svg?raw';

// Icons available for a subset of shape names; unmatched shapes fall back to text-only.
export const shapeIcons: Record<string, string> = {
  asscher, cushion, emerald, heart, marquise, oval, pear, princess, radiant, round, trilliant,
};

export const getShapeIcon = (shapeName: string): string | undefined =>
  shapeIcons[shapeName.trim().toLowerCase()];
