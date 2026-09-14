export type FilterOption = { label: string; value: string };

export type FilterResponse = {
  success: boolean;
  message: string;
  data: {
    categories: FilterOption[];
    sources: FilterOption[];
    brands: FilterOption[];
    product_conditions: FilterOption[];
    package_conditions: FilterOption[];
    price: { low: number; high: number };
    banner: string[];
  };
};

export type ProductCard = {
  name: string;
  slug: string;
  price: { old_price: string; current_price: string };
  image: string;
  stock: number;
  warehouse: string;
  is_sold: boolean;
  is_sale: boolean;
};

export type ProductListResponse = {
  success: boolean;
  message: string;
  data: ProductCard[];
  meta: {
    first_page: number;
    last_page: number;
    current_page: number;
    total_items: number;
    per_page: number;
  };
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  is_qc_pass: boolean;
  price: {
    old_price: string;
    current_price: string;
  };
  detail: {
    id_cargo: string;
    category: string;
    stock: number;
    brand: string[];
    package_condition: string;
    product_condition: string;
    source: string;
    discrepancy: string;
    warehouse: string;
    panjang: number;
    lebar: number;
    tinggi: number;
    berat: number;
    volume: number;
    berat_volumetrik: number;
  };
  document?: string;
};

export type ProductDetailResponse = {
  success: boolean;
  message: string;
  data: ProductDetail;
};
