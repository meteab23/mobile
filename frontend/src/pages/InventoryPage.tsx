import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid2 as Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api";
import { StatCard } from "../components/StatCard";
import { StatusChip } from "../components/StatusChip";
import { TableSkeleton } from "../components/TableSkeleton";
import { AVAILABILITIES, formatAED } from "../utils/format";

export function InventoryPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", page, pageSize, search, status],
    queryFn: async () =>
      (
        await inventoryApi.list({
          page: page + 1,
          page_size: pageSize,
          search: search || undefined,
          status: status || undefined,
        })
      ).data,
  });

  const { data: summary } = useQuery({
    queryKey: ["inventory-summary"],
    queryFn: async () => (await inventoryApi.summary()).data,
  });

  const statusMap = Object.fromEntries(
    (summary?.by_status || []).map((s: { status: string; count: number }) => [s.status, s.count])
  );

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Inventory
        </Typography>
        <Typography color="text.secondary">
          Track available, reserved, sold, and in-transit units by VIN
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <StatCard title="Total Units" value={summary?.total_units ?? "—"} color="#1e3a5f" />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <StatCard title="Available" value={statusMap.available ?? 0} color="#16a34a" />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <StatCard title="Reserved" value={statusMap.reserved ?? 0} color="#d97706" />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <StatCard title="Sold" value={statusMap.sold ?? 0} color="#64748b" />
        </Grid>
        <Grid size={{ xs: 6, md: 2.4 }}>
          <StatCard title="In Transit" value={statusMap.in_transit ?? 0} color="#0284c7" />
        </Grid>
      </Grid>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search VIN, engine number, brand, warehouse…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {AVAILABILITIES.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={8} cols={8} />
      ) : (
        <Card>
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>VIN</TableCell>
                  <TableCell>Truck</TableCell>
                  <TableCell>Engine No.</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Bay</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Selling Price</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.results.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Typography fontFamily="monospace" fontSize={12} fontWeight={700}>
                        {u.vin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={650}>{u.truck_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {u.year} · {u.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontFamily="monospace" fontSize={12}>
                        {u.engine_number}
                      </Typography>
                    </TableCell>
                    <TableCell>{u.warehouse}</TableCell>
                    <TableCell>{u.location_bay || "—"}</TableCell>
                    <TableCell>{formatAED(u.purchase_cost)}</TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>{formatAED(u.selling_price)}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={u.status} label={u.status_display} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data?.count || 0}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Card>
      )}

      {summary?.by_warehouse && (
        <Card sx={{ mt: 2.5 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              By Warehouse
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {summary.by_warehouse.map(
                (w: { warehouse: string; count: number; value: string }) => (
                  <Box
                    key={w.warehouse}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      minWidth: 180,
                    }}
                  >
                    <Typography fontWeight={700}>{w.warehouse}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {w.count} units · {formatAED(w.value)}
                    </Typography>
                  </Box>
                )
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
