export type UserRole = "admin" | "sales_manager" | "salesperson" | "viewer";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  role_display: string;
  phone: string;
  job_title: string;
  avatar_color: string;
  is_active: boolean;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Truck {
  id: number;
  brand: string;
  model: string;
  display_name?: string;
  year: number;
  category: string;
  category_display?: string;
  horsepower: number;
  engine?: string;
  transmission?: string;
  drive_type: string;
  fuel: string;
  emission: string;
  cab_type?: string;
  payload_kg?: number;
  gross_weight_kg?: number;
  wheelbase_mm?: number;
  dimensions?: string;
  fuel_tank_l?: number;
  tyre_size?: string;
  vin: string;
  engine_number?: string;
  color: string;
  price: string;
  cost: string;
  stock_quantity: number;
  availability: string;
  availability_display?: string;
  image_url: string;
  description?: string;
  warranty?: string;
  warehouse: string;
  margin?: string;
  created_at?: string;
}

export interface Customer {
  id: number;
  company_name: string;
  trade_license: string;
  vat_number: string;
  address: string;
  city: string;
  emirate: string;
  phone: string;
  email: string;
  contact_person: string;
  contact_title: string;
  payment_terms: string;
  payment_terms_display?: string;
  credit_limit: string;
  notes: string;
  is_active: boolean;
  quotations_count?: number;
  created_at?: string;
}

export interface QuotationItem {
  id?: number;
  truck: number;
  truck_name?: string;
  truck_vin?: string;
  truck_brand?: string;
  description: string;
  quantity: number;
  unit_price: string;
  discount_percent: string;
  line_total?: string;
  sort_order?: number;
}

export interface Quotation {
  id: number;
  quotation_number: string;
  customer: number;
  customer_name?: string;
  customer_detail?: Partial<Customer>;
  salesperson: number;
  salesperson_name?: string;
  date: string;
  validity_days?: number;
  valid_until: string;
  currency: string;
  discount_percent?: string;
  discount_amount: string;
  vat_rate?: string;
  notes: string;
  terms_and_conditions?: string;
  status: string;
  status_display?: string;
  subtotal: string;
  vat_amount: string;
  grand_total: string;
  items_count?: number;
  items?: QuotationItem[];
  created_at?: string;
}

export interface InventoryUnit {
  id: number;
  truck: number;
  truck_name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  vin: string;
  engine_number: string;
  purchase_cost: string;
  selling_price: string;
  status: string;
  status_display: string;
  warehouse: string;
  location_bay: string;
  arrival_date: string | null;
  notes: string;
  updated_at: string;
}

export interface DashboardData {
  stats: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
    in_transit: number;
    inventory_value: string;
    inventory_cost: string;
    sales_this_month: string;
    customers_count: number;
    quotations_count: number;
    open_quotations: number;
  };
  charts: {
    quotations_by_status: { status: string; count: number; value: string | null }[];
    trucks_by_brand: { brand: string; count: number }[];
    trucks_by_category: { category: string; count: number }[];
    monthly_sales: { month: string; total: string }[];
  };
  recent_quotations: Quotation[];
  latest_customers: Customer[];
}

export interface SearchResults {
  query: string;
  results: {
    trucks: SearchHit[];
    customers: SearchHit[];
    quotations: SearchHit[];
  };
}

export interface SearchHit {
  id: number;
  type: string;
  label: string;
  subtitle: string;
  brand?: string;
  model?: string;
  vin?: string;
  status?: string;
}
