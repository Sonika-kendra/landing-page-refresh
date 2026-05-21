// Mapped Zoho Inventory item — returned by GET /products and GET /products/:id.
// Raw Zoho fields are preserved alongside clean aliases and CF.* expansions.
export interface ZohoProduct {
  // ── Core Zoho fields ──────────────────────────────────────────────────────
  item_id: string;
  id: string;            // alias for item_id
  name: string;
  sku: string;
  rate: number;
  price: number;         // alias for rate / selling_price
  selling_price?: number;
  category_name: string | null;
  categoryName: string | null;  // alias for category_name
  status: string | null;
  stock_on_hand?: number;
  currency_code?: string;
  barcode: string | null;

  // ── CF.* custom fields ────────────────────────────────────────────────────
  productType: string | null;
  stockCategory: string | null;
  parentCategory: string | null;
  subCategory: string | null;
  description: string | null;
  lab: string | null;
  certNo: string | null;
  stockCodeNumber: string | null;
  caratsTotal: string | null;
  size: string | null;
  shape: string | null;
  colour: string | null;
  clarity: string | null;
  mp4Url: string | null;
  video360Url: string | null;
  pictureLink: string | null;
  onHandLink: string | null;
  certLink: string | null;
  certComments: string | null;
  metalColour: string | null;
  metalWeight: string | null;
  sideStonesWeight: string | null;
  gemstoneWeight: string | null;
  itemType: string | null;
  metalPurity: string | null;
  totalDiamondWeight: string | null;
  diamondShapes: string | null;
  stockCode: string | null;
  centreDiamondWeight: string | null;
  fancyColourIntensity: string | null;
  growthMethod: string | null;
  fancyColourOvertones: string | null;
  styleId: string | null;

  // ── MongoDB-computed flags (present when served from Stock cache) ──────────
  isBestseller?: boolean;
  isNewArrival?: boolean;
}
