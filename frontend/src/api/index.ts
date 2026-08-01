import api from "./client";
import type {
  Customer,
  DashboardData,
  InventoryUnit,
  Paginated,
  Quotation,
  SearchResults,
  Truck,
  User,
} from "../types";

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ access: string; refresh: string; user: User; success: boolean }>(
      "/auth/login/",
      { username, password }
    ),
  me: () => api.get<User>("/auth/me/"),
  demoUsers: () =>
    api.get<{ username: string; role: string; role_display: string; full_name: string }[]>(
      "/auth/demo-users/"
    ),
};

export const dashboardApi = {
  get: () => api.get<DashboardData>("/dashboard/"),
};

export const trucksApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Truck>>("/trucks/", { params }),
  get: (id: number) => api.get<Truck>(`/trucks/${id}/`),
};

export const customersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Customer>>("/customers/", { params }),
  get: (id: number) => api.get<Customer>(`/customers/${id}/`),
  create: (data: Partial<Customer>) => api.post<Customer>("/customers/", data),
  update: (id: number, data: Partial<Customer>) =>
    api.patch<Customer>(`/customers/${id}/`, data),
};

export const quotationsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<Quotation>>("/quotations/", { params }),
  get: (id: number) => api.get<Quotation>(`/quotations/${id}/`),
  create: (data: unknown) => api.post<Quotation>("/quotations/", data),
  update: (id: number, data: unknown) => api.put<Quotation>(`/quotations/${id}/`, data),
  changeStatus: (id: number, status: string) =>
    api.post<Quotation>(`/quotations/${id}/change_status/`, { status }),
  pdfUrl: (id: number) => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    return `${base}/quotations/${id}/pdf/`;
  },
};

export const inventoryApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Paginated<InventoryUnit>>("/inventory/", { params }),
  summary: () => api.get("/inventory/summary/"),
  update: (id: number, data: Partial<InventoryUnit>) =>
    api.patch<InventoryUnit>(`/inventory/${id}/`, data),
};

export const searchApi = {
  search: (q: string) => api.get<SearchResults>("/search/", { params: { q } }),
};
