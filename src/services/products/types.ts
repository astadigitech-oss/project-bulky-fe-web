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
