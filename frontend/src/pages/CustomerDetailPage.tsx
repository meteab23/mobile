import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { customersApi } from "../api";
import { formatAED } from "../utils/format";

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => (await customersApi.get(Number(id))).data,
    enabled: !!id,
  });

  if (isLoading || !customer) return <Typography>Loading…</Typography>;

  const fields: [string, string | number][] = [
    ["Trade License", customer.trade_license],
    ["VAT Number", customer.vat_number],
    ["Address", customer.address],
    ["City", customer.city],
    ["Emirate", customer.emirate],
    ["Phone", customer.phone],
    ["Email", customer.email],
    ["Contact Person", customer.contact_person],
    ["Title", customer.contact_title || "—"],
    ["Payment Terms", customer.payment_terms_display || customer.payment_terms],
    ["Credit Limit", formatAED(customer.credit_limit)],
    ["Quotations", String(customer.quotations_count ?? 0)],
  ];

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/customers")} sx={{ mb: 2 }}>
        Back to customers
      </Button>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {customer.company_name}
              </Typography>
              <Typography color="text.secondary">
                {customer.contact_person} · {customer.city}, {customer.emirate}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate("/quotations/new", { state: { customerId: customer.id } })}
            >
              New Quotation
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {fields.map(([label, value]) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={label}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  {label}
                </Typography>
                <Typography fontWeight={600}>{value}</Typography>
              </Grid>
            ))}
          </Grid>
          {customer.notes && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Notes
              </Typography>
              <Typography>{customer.notes}</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
