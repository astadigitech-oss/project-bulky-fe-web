import type { BaseAuthResponse } from "@/services/auth/types";

// ─── Cart Item ─────────────────────────────────────────────────────────────────

export type CartItem = {
  id: string;
  image: string;
  name: { id: string; en: string };
  price: string;
  is_checked: boolean;
  is_sold: boolean;
};

export type CartData = {
  data: CartItem[];
  selected_product: number;
  total_price: string;
};

// ─── Cart Responses ────────────────────────────────────────────────────────────

export type GetCartResponse = BaseAuthResponse<CartData>;

export type AddToCartBody = {
  product_id: string;
};

export type AddToCartResponse = BaseAuthResponse<null>;

// PATCH /carts/check
// is_bulk=true → toggle select all (item_id omitted)
// is_bulk=false → toggle single item (item_id required)
export type CheckItemBody = {
  is_bulk: boolean;
  item_id?: string;
};

export type CheckItemResponse = BaseAuthResponse<null>;

// DELETE /carts/check/:id
export type DeleteItemParams = { id: string };
export type DeleteItemResponse = BaseAuthResponse<null>;

// POST /checkout (no body — backend uses server-side is_checked state)
export type CheckoutResponse = BaseAuthResponse<null>;

