import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export const productPath = (category: string, subCategory: string, id: string) => {
  const cat = category ? toSlug(category) : 'all';
  const sub = subCategory ? toSlug(subCategory) : 'all';
  return `/jewellery/${cat}/${sub}/${id}`;
};
