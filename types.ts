export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  DEALER = "DEALER",
  TECHNICIAN = "TECHNICIAN",
  FACTORY_MANAGER = "FACTORY_MANAGER",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  END_USER = "END_USER",
}

export enum ProductionStage {
  NEW = "NEW",
  CUTTING = "CUTTING",
  STITCHING = "STITCHING",
  QC_PASSED = "QC_PASSED",
  DISPATCHED = "DISPATCHED",
}

export enum ShippingCarrier {
  AIR_COURIER = "AIR_COURIER",
  SURFACE_CARGO = "SURFACE_CARGO",
  DEALER_FLEET = "DEALER_FLEET",
}

export interface Address {
  id: string;
  label: string;
  details: string;
  landmark: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface ShippingManifest {
  shipment_id: string;
  order_id: string;
  total_weight_kg: number;
  volumetric_weight: number;
  assigned_carrier: ShippingCarrier;
  tracking_number: string;
  status: "READY" | "PICKED_UP" | "TRANSIT" | "DELIVERED";
}

export interface ProductionLog {
  log_id: string;
  order_item_id: string; // Granular item tracking for bulk orders
  station_name: ProductionStage;
  started_at: string;
  completed_at?: string;
  operator_id: string;
  qc_status?: "PASSED" | "FAILED";
}

export interface OrderAnalytics {
  revenue_today: number;
  revenue_yesterday: number;
  pipeline: Record<ProductionStage, number>;
  hotspots: Array<{ city: string; count: number }>;
}

export interface LedgerEntry {
  date: string;
  order_id: string;
  commission: number;
  tax_deducted: number;
  net_payout: number;
  status: "PAID" | "PENDING";
}

export enum ServiceType {
  MEASURE = "MEASURE",
  REPAIR = "REPAIR",
  DISPOSAL = "DISPOSAL",
}

export enum RequestStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  ARRIVED = "ARRIVED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface ServiceRequest {
  request_id: string;
  user_id: string;
  service_type: ServiceType;
  status: RequestStatus;
  assigned_dealer_id?: string;
  scheduled_date: string;
  time_slot: string;
  measured_length?: number;
  measured_breadth?: number;
  service_fee: number;
  is_fee_adjusted: boolean;
  payment_transaction_id: string;
  sac_code: string;
  defect_image_url?: string;
}

export interface TaxBreakdown {
  base: number;
  gst_total: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  hsn_code: string;
}

// Added missing optional fields to fix masterPricing and pricingEngine errors
export interface PricingResult {
  product_id?: string;
  final_price: number;
  tax_breakdown: TaxBreakdown;
  basePrice: number;
  discountedPrice: number;
  taxAmount: number;
  totalPrice: number;
  invoiceType: "B2B_GST" | "B2C_RETAIL";
  surgeApplied: boolean;
  surgeAmount: number;
  appliedCoupon?: string;
  is_standard_size?: boolean;
  sku?: string;
  dealer_price_inr?: number;
  gst_percent?: number;
}

export interface MattressParams {
  product_id?: string;
  length: number;
  breadth: number;
  thickness: number;
  userType?: UserRole;
  materialRate?: number;
  demandLevel?: "LOW" | "NORMAL" | "PEAK";
  coupon_code?: string;
  dealer_auth_code?: string;
}

export interface BrandMetadata {
  id: string;
  name: string;
  type: string;
  baseRate: number;
  description: string;
  ai_tags: string[];
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface InvoicePayload {
  invoice_id: string;
  invoice_label: string;
  customer_name: string;
  customer_gstin?: string;
  items: Array<{
    description: string;
    hsn: string;
    qty: number;
    unit_price: number;
    taxable_value: number;
    gst_rate: number;
    total: number;
  }>;
  summary: {
    total_taxable: number;
    total_tax: number;
    total_payable: number;
  };
}

// Added PermissionMatrix for adminEngine
export interface PermissionMatrix {
  can_see_revenue: boolean;
  can_edit_pricing: boolean;
  can_see_manufacturing_cost: boolean;
  can_access_kanban: boolean;
  can_export_tax_reports: boolean;
}

// Added Cart for serviceConcierge and TechnicianPortal
export interface Cart {
  user_id: string;
  items: Array<{
    product_id: string;
    length: number;
    breadth: number;
    thickness: number;
    is_custom: boolean;
  }>;
  applied_service_credit: number;
}

// Added Profile interface for Supabase user profiles
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: UserRole; // Added role to profile
  updated_at?: string;
}

// New interface for Sleep Profile
export interface SleepProfile {
  id?: string; // Optional for new profiles
  user_id: string;
  sleep_position: "side" | "back" | "stomach" | "combination" | "";
  firmness_preference: "soft" | "medium" | "firm" | "very_firm" | "";
  body_type: "light" | "average" | "heavy" | "";
  sleep_temperature: "hot" | "cool" | "normal" | "";
  health_concerns: string[]; // e.g., ['back_pain', 'allergies']
  partner_disturbance: boolean;
  budget_preference: "economical" | "standard" | "luxury" | "";
  created_at?: string;
  updated_at?: string;
}

// Quiz-specific types
export type TagWeights = Record<string, number>;

export interface QuizOption {
  id: string;
  label: string;
  weights: TagWeights;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizAnswer {
  question_id: string;
  answer_id: string;
}

export interface QuizResult {
  id?: string;
  user_id?: string;
  anonymous_session_id?: string;
  answers: QuizAnswer[];
  tag_scores: TagWeights;
  top_tags: string[];
  recommended_type: string;
  recommended_models?: string[];
  created_at?: string;
}
