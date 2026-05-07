import yellowGoldImg from '@/assets/shop/metal/18K9K yellow gold color.png';
import whiteGoldImg from '@/assets/shop/metal/18K9K white gold color.png';
import platinumImg from '@/assets/shop/metal/Platinum metal color.png';

export interface MetalType {
  id: string;
  label: string;   // short badge label e.g. "18K"
  name: string;    // full display name e.g. "18ct Yellow Gold"
  group: 'yellow-gold' | 'white-gold' | 'rose-gold' | 'platinum' | 'silver';
  bg: string;      // inline background color (fallback)
  color: string;   // inline text color
  image?: string;  // metal texture image
}

export const metalTypes: MetalType[] = [
  // Yellow Gold
  { id: '22K_YG', label: '22K', name: '22ct Yellow Gold', group: 'yellow-gold', bg: '#C9922A', color: '#000', image: yellowGoldImg },
  { id: '18K_YG', label: '18K', name: '18ct Yellow Gold', group: 'yellow-gold', bg: '#C5A028', color: '#000', image: yellowGoldImg },
  { id: '9K_YG',  label: '9K',  name: '9ct Yellow Gold',  group: 'yellow-gold', bg: '#C5A028', color: '#000', image: yellowGoldImg },

  // White Gold
  { id: '18K_WG', label: '18K', name: '18ct White Gold', group: 'white-gold', bg: '#B8B8C8', color: '#000', image: whiteGoldImg },
  { id: '9K_WG',  label: '9K',  name: '9ct White Gold',  group: 'white-gold', bg: '#B8B8C8', color: '#000', image: whiteGoldImg },

  // Rose Gold
  { id: '18K_RG', label: '18K', name: '18ct Rose Gold', group: 'rose-gold', bg: '#C08070', color: '#000' },
  { id: '9K_RG',  label: '9K',  name: '9ct Rose Gold',  group: 'rose-gold', bg: '#C08070', color: '#000' },

  // Platinum
  { id: 'Pt950', label: 'Pt', name: 'Platinum 950', group: 'platinum', bg: '#7A7A8E', color: '#000', image: platinumImg },
  { id: 'Pt900', label: 'Pt', name: 'Platinum 900', group: 'platinum', bg: '#7A7A8E', color: '#000', image: platinumImg },

  // Silver
  { id: 'Ag925', label: 'Ag', name: 'Sterling Silver', group: 'silver', bg: '#A0A0A0', color: '#000' },
];

export const metalTypeMap = Object.fromEntries(metalTypes.map((m) => [m.id, m])) as Record<string, MetalType>;

/** Resolves a metal ID from the DB to its config. Falls back gracefully. */
export function getMetalType(id: string): MetalType {
  return (
    metalTypeMap[id] ?? {
      id,
      label: id,
      name: id,
      group: 'yellow-gold',
      bg: '#C5A028',
      color: '#000',
    }
  );
}
