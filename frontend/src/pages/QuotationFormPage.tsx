import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, ArrowBack, DeleteOutline } from "@mui/icons-material";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { customersApi, quotationsApi, trucksApi } from "../api";
import { formatAEDPrecise } from "../utils/format";

const itemSchema = z.object({
  truck_id: z.coerce.number().min(1, "Select a truck"),
  quantity: z.coerce.number().min(1),
  unit_price: z.coerce.number().min(0),
  discount_percent: z.coerce.number().min(0).max(100),
  description: z.string().optional(),
});

const schema = z.object({
  customer_id: z.coerce.number().min(1, "Select a customer"),
  validity_days: z.coerce.number().min(1),
  discount_amount: z.coerce.number().min(0),
  notes: z.string().optional(),
  status: z.enum(["draft", "sent", "approved", "rejected", "converted"]),
  items: z.array(itemSchema).min(1, "Add at least one truck"),
});

type FormValues = z.infer<typeof schema>;

export function QuotationFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const prefill = (location.state || {}) as { truckId?: number; customerId?: number };

  const { data: customers } = useQuery({
    queryKey: ["customers-all"],
    queryFn: async () => (await customersApi.list({ page_size: 100 })).data.results,
  });

  const { data: trucks } = useQuery({
    queryKey: ["trucks-available"],
    queryFn: async () =>
      (await trucksApi.list({ page_size: 100, availability: "available" })).data.results,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      customer_id: prefill.customerId || 0,
      validity_days: 30,
      discount_amount: 0,
      notes: "",
      status: "draft",
      items: [
        {
          truck_id: prefill.truckId || 0,
          quantity: 1,
          unit_price: 0,
          discount_percent: 0,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");
  const discountAmount = watch("discount_amount");

  // Auto-fill unit price when truck selected
  useEffect(() => {
    watchedItems.forEach((item, idx) => {
      if (!item.truck_id || !trucks) return;
      const truck = trucks.find((t) => t.id === Number(item.truck_id));
      if (truck && Number(item.unit_price) === 0) {
        setValue(`items.${idx}.unit_price`, Number(truck.price));
      }
    });
  }, [watchedItems, trucks, setValue]);

  const preview = useMemo(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const gross = Number(item.unit_price || 0) * Number(item.quantity || 0);
      const disc = (gross * Number(item.discount_percent || 0)) / 100;
      return sum + (gross - disc);
    }, 0);
    const taxable = Math.max(0, subtotal - Number(discountAmount || 0));
    const vat = taxable * 0.05;
    return { subtotal, vat, grand: taxable + vat };
  }, [watchedItems, discountAmount]);

  const mutation = useMutation({
    mutationFn: (payload: FormValues) =>
      quotationsApi.create({
        customer_id: payload.customer_id,
        validity_days: payload.validity_days,
        discount_amount: payload.discount_amount,
        notes: payload.notes || "",
        status: payload.status,
        items: payload.items.map((i) => ({
          truck_id: i.truck_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
          discount_percent: i.discount_percent,
          description: i.description || "",
        })),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      enqueueSnackbar("Quotation created", { variant: "success" });
      navigate(`/quotations/${res.data.id}`);
    },
    onError: () => enqueueSnackbar("Failed to create quotation", { variant: "error" }),
  });

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/quotations")} sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        New Quotation
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Build a multi-truck quotation with UAE VAT
      </Typography>

      <Box component="form" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 2.5 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Customer"
                      defaultValue={prefill.customerId || ""}
                      error={!!errors.customer_id}
                      helperText={errors.customer_id?.message}
                      {...register("customer_id")}
                    >
                      <MenuItem value="">Select…</MenuItem>
                      {customers?.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.company_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Validity (days)"
                      {...register("validity_days")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField select fullWidth label="Status" defaultValue="draft" {...register("status")}>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Header Discount (AED)"
                      {...register("discount_amount")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth multiline minRows={2} label="Notes" {...register("notes")} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Line Items
                  </Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={() =>
                      append({
                        truck_id: 0,
                        quantity: 1,
                        unit_price: 0,
                        discount_percent: 0,
                        description: "",
                      })
                    }
                  >
                    Add truck
                  </Button>
                </Stack>

                {fields.map((field, index) => (
                  <Card key={field.id} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 5 }}>
                          <TextField
                            select
                            fullWidth
                            label="Truck"
                            defaultValue={field.truck_id || ""}
                            error={!!errors.items?.[index]?.truck_id}
                            helperText={errors.items?.[index]?.truck_id?.message}
                            {...register(`items.${index}.truck_id`)}
                          >
                            <MenuItem value="">Select…</MenuItem>
                            {trucks?.map((t) => (
                              <MenuItem key={t.id} value={t.id}>
                                {t.brand} {t.model} — {formatAEDPrecise(t.price)}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 4, md: 2 }}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Qty"
                            {...register(`items.${index}.quantity`)}
                          />
                        </Grid>
                        <Grid size={{ xs: 4, md: 2 }}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Unit Price"
                            {...register(`items.${index}.unit_price`)}
                          />
                        </Grid>
                        <Grid size={{ xs: 4, md: 2 }}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Disc %"
                            {...register(`items.${index}.discount_percent`)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 1 }}>
                          <IconButton
                            color="error"
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                {errors.items?.message && (
                  <Typography color="error" variant="body2">
                    {errors.items.message}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: "sticky", top: 88 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Totals Preview
                </Typography>
                <Stack spacing={1}>
                  <Row label="Subtotal" value={formatAEDPrecise(preview.subtotal)} />
                  <Row label="VAT 5%" value={formatAEDPrecise(preview.vat)} />
                  <Row label="Grand Total" value={formatAEDPrecise(preview.grand)} bold />
                </Stack>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving…" : "Create Quotation"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={bold ? 800 : 600} fontSize={bold ? 18 : 14}>
        {value}
      </Typography>
    </Stack>
  );
}
