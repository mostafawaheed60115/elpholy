export interface StoreFeatures {
  price: boolean;
  description: boolean;
  salePrice: boolean;
  stock: boolean;
  checkout: boolean;
  coupons: boolean;
}

export interface StoreLimits {
  products: number;
  imagesPerProduct: number;
}

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string;
  isActive: boolean;
  configType: string;
  limits: StoreLimits;
  features: StoreFeatures;
  checkoutMode: 'external' | 'internal' | string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  parentId: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  title: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number | null;
  isActive: boolean;
  images: ProductImage[];
}

export interface Catalog {
  categories: Category[];
  products: Product[];
}

export interface StoreConfiguration {
  schemaVersion: number;
  generatedAt: string;
  store: StoreInfo;
  catalog: Catalog;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  recommendedDish?: string;
}
