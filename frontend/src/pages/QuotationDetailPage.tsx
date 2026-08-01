import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid2 as Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, PictureAsPdf } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { quotationsApi } from "../api";
import { StatusChip } from "../components/StatusChip";
import { useAuth } from "../contexts/AuthContext";
import { formatAEDPrecise, QUOTE_STATUSES } from "../utils/format";
import { useState } from "react";

export function QuotationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canWrite } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", id],
    queryFn: async () => (await quotationsApi.get(Number(id))).data,
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) => quotationsApi.changeStatus(Number(id), newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotation", id] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      enqueueSnackbar("Status updated", { variant: "success" });
    },
    onError: () => enqueueSnackbar("Failed to update status", { variant: "error" }),
  });

  const openPdf = async () => {
    if (!quotation) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(quotationsApi.pdfUrl(quotation.id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch {
      enqueueSnackbar("Failed to generate PDF", { variant: "error" });
    }
  };

  if (isLoading || !quotation) return <Typography>Loading…</Typography>;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/quotations")} sx={{ mb: 2 }}>
        Back to quotations
      </Button>

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h4" fontWeight={800}>
              {quotation.quotation_number}
            </Typography>
            <StatusChip status={quotation.status} label={quotation.status_display} />
          </Stack>
          <Typography color="text.secondary">
            {quotation.customer_name} · {quotation.date} · Valid until {quotation.valid_until}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={openPdf}>
            Download PDF
          </Button>
          {canWrite && (
            <>
              <TextField
                select
                size="small"
                label="Change status"
                value={status || quotation.status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                {QUOTE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                disabled={!status || status === quotation.status || statusMutation.isPending}
                onClick={() => statusMutation.mutate(status)}
              >
                Update
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Customer
              </Typography>
              <Typography fontWeight={750}>{quotation.customer_detail?.company_name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {quotation.customer_detail?.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {quotation.customer_detail?.contact_person} · {quotation.customer_detail?.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                VAT {quotation.customer_detail?.vat_number}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Salesperson
              </Typography>
              <Typography fontWeight={750}>{quotation.salesperson_name}</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={0.5}>
                <Row label="Currency" value={quotation.currency} />
                <Row label="Subtotal" value={formatAEDPrecise(quotation.subtotal)} />
                <Row label="Discount" value={formatAEDPrecise(quotation.discount_amount)} />
                <Row label="VAT" value={formatAEDPrecise(quotation.vat_amount)} />
                <Row label="Grand Total" value={formatAEDPrecise(quotation.grand_total)} bold />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Line Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Disc %</TableCell>
                    <TableCell align="right">Line Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quotation.items?.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Typography fontWeight={700} fontSize={13}>
                          {item.truck_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">{formatAEDPrecise(item.unit_price)}</TableCell>
                      <TableCell align="right">{item.discount_percent}%</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700}>{formatAEDPrecise(item.line_total)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {quotation.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" whiteSpace="pre-wrap">
                    {quotation.notes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={bold ? 800 : 600} fontSize={bold ? 16 : 14}>
        {value}
      </Typography>
    </Stack>
  );
}
