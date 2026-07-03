import { newApiURL } from '@/config/site';
import type { ShopProduct } from './products';

/** Try several custom-field name variants from a raw Zoho item, including nested item_attributes. */
export function getCf(item: Record<string, unknown>, ...names: string[]): string | undefined {
  const attrs =
    item.item_attributes != null && typeof item.item_attributes === 'object'
      ? (item.item_attributes as Record<string, unknown>)
      : null;

  for (const name of names) {
    if (item[`cf_${name}`] != null && item[`cf_${name}`] !== '') return String(item[`cf_${name}`]);
    if (item[name] != null && item[name] !== '' && typeof item[name] !== 'object') return String(item[name]);
    if (attrs) {
      if (attrs[`cf_${name}`] != null && attrs[`cf_${name}`] !== '') return String(attrs[`cf_${name}`]);
      if (attrs[name] != null && attrs[name] !== '' && typeof attrs[name] !== 'object') return String(attrs[name]);
    }
    if (Array.isArray(item.custom_fields)) {
      const f = (item.custom_fields as Array<{ api_name?: string; label?: string; value?: unknown }>)
        .find((cf) => cf.api_name === `cf_${name}` || cf.label?.toLowerCase().replace(/ /g, '_') === name);
      if (f?.value != null && f.value !== '') return String(f.value);
    }
  }
  return undefined;
}

const METAL_ALIASES: Record<string, string> = {
  '18k yellow gold': '18K_YG', '18kyg': '18K_YG', '18k_yg': '18K_YG', 'yellow gold': '18K_YG', 'yg': '18K_YG',
  '18k white gold': '18K_WG', '18kwg': '18K_WG', '18k_wg': '18K_WG', 'white gold': '18K_WG', 'wg': '18K_WG',
  '18k rose gold': '18K_RG', '18k_rg': '18K_RG', 'rose gold': '18K_RG', 'rg': '18K_RG', 'pink gold': '18K_RG',
  '9k yellow gold': '9K_YG', '9kyg': '9K_YG', '9k_yg': '9K_YG',
  '9k white gold': '9K_WG', '9kwg': '9K_WG', '9k_wg': '9K_WG',
  'platinum': 'Pt950', 'pt': 'Pt950', 'pt950': 'Pt950',
};

function normaliseMetalCode(raw: string): string {
  return METAL_ALIASES[raw.toLowerCase().trim()] ?? raw.trim();
}

/** Combines a colour ("White Gold") and purity ("9 Kts") into a metal ID ("9K_WG"). */
function buildMetalCode(colour: string, purity: string): string | null {
  const c = colour.toLowerCase().trim();
  const p = purity.toLowerCase().trim();

  let karat = '';
  if (p.includes('22')) karat = '22K';
  else if (p.includes('18')) karat = '18K';
  else if (p.includes('9')) karat = '9K';
  else if (p.includes('pt') || p.includes('platinum')) return 'Pt950';

  if (!karat) return null;

  if (c.includes('yellow') || c === 'yg') return `${karat}_YG`;
  if (c.includes('white') || c === 'wg') return `${karat}_WG`;
  if (c.includes('rose') || c.includes('pink') || c === 'rg') return `${karat}_RG`;
  return null;
}

export function mapZohoToShopProduct(item: Record<string, unknown>, currency = '£'): ShopProduct {
  const metalColour = getCf(item, 'metal_colour', 'metal_color', 'metal_options', 'available_metals', 'metal_type', 'metal') ?? '';
  const metalPurity = getCf(item, 'metal_purity') ?? '';
  const metalOptions = metalColour
    ? metalColour.split(/[,;]/).map((raw) => {
        const combined = metalPurity ? buildMetalCode(raw, metalPurity) : null;
        return combined ?? normaliseMetalCode(raw);
      }).filter(Boolean)
    : [];

  const stock =
    typeof item.available_stock === 'number' ? item.available_stock :
      typeof item.actual_available_stock === 'number' ? item.actual_available_stock :
        undefined;

  const isFewLeft = stock !== undefined && stock > 0 && stock <= 3;
  const isNewArrival =
    item.isNewArrival === true ||
    getCf(item, 'is_new_arrival', 'new_arrival') === 'true' ||
    (() => {
      const t = typeof item.created_time === 'string' ? item.created_time : '';
      if (!t) return false;
      const created = new Date(t).getTime();
      return !isNaN(created) && (Date.now() - created < 45 * 24 * 60 * 60 * 1000);
    })();

  const badge: ShopProduct['badge'] =
    isFewLeft ? 'ONLY FEW LEFT' : isNewArrival ? 'NEW STOCK' : undefined;

  const rawStockType = getCf(item, 'stock_sub_cat', 'diamond_type', 'stock_type', 'stone_type') ?? 'Natural';
  const normalisedStockType = rawStockType.toLowerCase().includes('lab') ? 'Lab' : rawStockType;

  const caratRaw = getCf(item, 'carat_total') ?? '';
  const caratOptions = caratRaw
    ? caratRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  const sizeRaw = getCf(item, 'size_options', 'ring_size_options', 'ring_size', 'size') ?? '';
  const sizeOptions = sizeRaw
    ? sizeRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  const metalWeightRaw = getCf(item, 'metal_weight') ?? '';
  const metalWeightOptions = metalWeightRaw
    ? metalWeightRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : undefined;

  const stoneType =
    getCf(item, 'stone_type_description', 'stone_description') ??
    (normalisedStockType === 'Lab' ? 'Lab Created Diamond' :
      normalisedStockType === 'Natural' ? 'Natural Diamond' : undefined);

  const imageUrl = `${newApiURL}/products/${item.item_id}/image`;

  return {
    id: String(item.item_id ?? ''),
    sku: String(item.sku ?? ''),
    name: String(item.cf_description ?? item.name ?? ''),
    currency,
    category: getCf(item, 'sub_category', 'stock_category') ?? String(item.category_name ?? ''),
    subCategory: getCf(item, 'sub_category_type', 'collection', 'subcategory') ?? '',
    metal: metalOptions[0] ?? '',
    metalOptions,
    shape: getCf(item, 'diamond_shape', 'shape', 'stone_shape') ?? '',
    stockType: (['Natural', 'Lab'].includes(normalisedStockType) ? normalisedStockType : 'Natural') as 'Natural' | 'Lab',
    price: typeof item.rate === 'number' ? item.rate : 0,
    image: imageUrl,
    badge,
    description: String(item.description ?? ''),
    certificate: getCf(item, 'certificate_lab', 'certification', 'certificate', 'cert'),
    stock,
    caratOptions: caratOptions?.length ? caratOptions : undefined,
    sizeOptions:  sizeOptions?.length  ? sizeOptions  : undefined,
    stoneType:    stoneType  || undefined,
    colour:       getCf(item, 'colour', 'color', 'diamond_colour', 'stone_colour') || undefined,
    clarity:      getCf(item, 'clarity', 'diamond_clarity', 'stone_clarity')       || undefined,
    setting:      getCf(item, 'setting', 'setting_type', 'mount_type')             || undefined,
    goldWeight:   getCf(item, 'gold_weight')                                        || undefined,
    metalWeightOptions: metalWeightOptions?.length ? metalWeightOptions : undefined,
    totalWeight:  getCf(item, 'total_weight', 'total_carat_weight', 'carat_weight')|| undefined,
    caratWeight:  getCf(item, 'carat_total') || undefined,
    itemRef:      getCf(item, 'item_ref', 'reference', 'stock_ref', 'ref')         || String(item.sku ?? '') || undefined,
    images: [imageUrl],
  };
}
