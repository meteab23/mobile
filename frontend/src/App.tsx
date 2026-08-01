import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./contexts/AuthContext";
import { AppThemeProvider } from "./contexts/ThemeModeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TrucksPage } from "./pages/TrucksPage";
import { TruckDetailPage } from "./pages/TruckDetailPage";
import { CustomersPage } from "./pages/CustomersPage";
import { CustomerDetailPage } from "./pages/CustomerDetailPage";
import { QuotationsPage } from "./pages/QuotationsPage";
import { QuotationDetailPage } from "./pages/QuotationDetailPage";
import { QuotationFormPage } from "./pages/QuotationFormPage";
import { InventoryPage } from "./pages/InventoryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <SnackbarProvider maxSnack={4} autoHideDuration={3500} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="trucks" element={<TrucksPage />} />
                    <Route path="trucks/:id" element={<TruckDetailPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="customers/:id" element={<CustomerDetailPage />} />
                    <Route path="quotations" element={<QuotationsPage />} />
                    <Route path="quotations/new" element={<QuotationFormPage />} />
                    <Route path="quotations/:id" element={<QuotationDetailPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
