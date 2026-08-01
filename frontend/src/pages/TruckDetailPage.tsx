import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { trucksApi } from "../api";
import { StatusChip } from "../components/StatusChip";
import { formatAED, formatAEDPrecise } from "../utils/format";

export function TruckDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: truck, isLoading } = useQuery({
    queryKey: ["truck", id],
    queryFn: async () => (await trucksApi.get(Number(id))).data,
    enabled: !!id,
  });

  if (isLoading || !truck) {
    return <Typography>Loading…</Typography>;
  }

  const specs: [string, string | number | undefined][] = [
    ["Brand", truck.brand],
    ["Model", truck.model],
    ["Year", truck.year],
    ["Category", truck.category_display || truck.category],
    ["Horsepower", `${truck.horsepower} HP`],
    ["Engine", truck.engine],
    ["Transmission", truck.transmission],
    ["Drive Type", truck.drive_type],
    ["Fuel", truck.fuel],
    ["Emission", truck.emission],
    ["Cab Type", truck.cab_type],
    ["Payload", truck.payload_kg ? `${truck.payload_kg.toLocaleString()} kg` : "—"],
    ["Gross Weight", truck.gross_weight_kg ? `${truck.gross_weight_kg.toLocaleString()} kg` : "—"],
    ["Wheelbase", truck.wheelbase_mm ? `${truck.wheelbase_mm} mm` : "—"],
    ["Dimensions", truck.dimensions],
    ["Fuel Tank", truck.fuel_tank_l ? `${truck.fuel_tank_l} L` : "—"],
    ["Tyre Size", truck.tyre_size],
    ["VIN", truck.vin],
    ["Engine Number", truck.engine_number],
    ["Color", truck.color],
    ["Warehouse", truck.warehouse],
    ["Warranty", truck.warranty],
  ];

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/trucks")} sx={{ mb: 2 }}>
        Back to catalog
      </Button>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ overflow: "hidden" }}>
            <Box
              component="img"
              src={truck.image_url}
              alt={truck.display_name}
              sx={{ width: "100%", height: 280, objectFit: "cover", bgcolor: "action.hover" }}
            />
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <StatusChip status={truck.availability} label={truck.availability_display} />
                <Chip size="small" label={truck.brand} />
              </Stack>
              <Typography variant="h5" fontWeight={800}>
                {truck.brand} {truck.model}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {truck.year} · {truck.horsepower} HP · {truck.drive_type} · {truck.emission}
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Selling Price
                  </Typography>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    {formatAED(truck.price)}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    Cost
                  </Typography>
                  <Typography fontWeight={600}>{formatAEDPrecise(truck.cost)}</Typography>
                </Box>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate("/quotations/new", { state: { truckId: truck.id } })}
              >
                Create Quotation
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Specifications
              </Typography>
              <Grid container spacing={1.5}>
                {specs.map(([label, value]) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={label}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                      {label}
                    </Typography>
                    <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                      {value || "—"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2.5 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Description
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {truck.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
