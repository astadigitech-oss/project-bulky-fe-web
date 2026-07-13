// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PROCESSING"
  | "READY"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID";
export type DeliveryType = "PICKUP" | "DELIVEREE" | "FORWARDER" | "FORWARDER_LCL";

export type Order = {
  id: string;
  kode: string;
  nama_produk: string;
  gambar_url: string | null;
  harga_sesudah_diskon_formatted: string;
  harga_sebelum_diskon_formatted: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_type: DeliveryType;
  delivery_status_label: string;
  tracking_url: string | null;
  payment_url: string | null;
};

export type OrderMeta = {
  halaman: number;
  per_halaman: number;
  total_data: number;
  total_halaman: number;
};

export type GetOrdersParams = {
  locale?: string;
  payment_status?: PaymentStatus;
  order_status?: OrderStatus;
  halaman?: number;
  per_halaman?: number;
};

export type GetOrdersResponse = {
  success: boolean;
  message: string;
  data: Order[];
  meta: OrderMeta;
};

export type MarkDoneResponse = {
  success: boolean;
  message: string;
  data: null;
};

// ─── Order Detail ─────────────────────────────────────────────────────────────

export type OrderStepperStep = {
  done: boolean;
  timestamp: string | null;
};

export type OrderStepper = {
  done: OrderStepperStep;
  ordered: OrderStepperStep;
  packed: OrderStepperStep;
  shipped: OrderStepperStep;
};

export type OrderStatusHistoryItem = {
  timestamp: string;
  label: string;
};

export type OrderDetailProduct = {
  id: string;
  order_item_id: string;
  name: string;
  image_url: string | null;
  original_price: number;
  original_price_formatted: string;
  subtotal: number;
  subtotal_formatted: string;
};

export type OrderDetailCost = {
  product_cost: number;
  product_cost_formatted: string;
  shipping_cost: number;
  shipping_cost_formatted: string;
  tax_cost: number;
  tax_cost_formatted: string;
  other_cost: number;
  other_cost_formatted: string;
  total: number;
  total_formatted: string;
};

export type OrderDetailShippingAddress = {
  recipient_name: string;
  recipient_phone: string;
  full_address: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
};

export type OrderDetail = {
  id: string;
  code: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_type: DeliveryType;
  deliveree_booking_id: string | null;
  forwarder_tracking_no: string | null;
  products: OrderDetailProduct[];
  cost: OrderDetailCost;
  shipping_address: OrderDetailShippingAddress | null;
  note: string | null;
  stepper: OrderStepper;
  status_history: OrderStatusHistoryItem[];
  payment_url: string | null;
  expired_at: string | null;
  created_at: string;
};

export type GetOrderDetailResponse = {
  success: boolean;
  message: string;
  data: OrderDetail;
};

// ─── Tracking ─────────────────────────────────────────────────────────────────

export type TrackingStatusHistoryItem = {
  status_date: string;
  status_name: string;
  status_time: string;
};

export type TrackingData = {
  delivery_type: string;
  tracking_url: string | null;
  delivery_status: string | null;
  booking_number: string | null;
  status_history: TrackingStatusHistoryItem[] | null;
};

export type GetTrackingResponse = {
  success: boolean;
  message: string;
  data: TrackingData;
};

// ─── Pickup Info ──────────────────────────────────────────────────────────────

export type PickupScheduleDay = {
  hari: number | string;
  jam_buka: string | null;
  jam_tutup: string | null;
  is_buka: boolean;
};

export type PickupInfoData = {
  id: string;
  nama: string;
  alamat: string;
  telepon: string;
  jadwal: PickupScheduleDay[];
};

export type GetPickupInfoResponse = {
  success: boolean;
  message: string;
  data: PickupInfoData;
};
