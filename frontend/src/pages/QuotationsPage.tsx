import { useState } from "react";
import {
  Box,
  Button,
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
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Add, PictureAsPdf, Search as SearchIcon, VisibilityOutlined } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { quotationsApi } from "../api";
import { StatusChip } from "../components/StatusChip";
import { TableSkeleton } from "../components/TableSkeleton";
import { useAuth } from "../contexts/AuthContext";
import { formatAED, QUOTE_STATUSES } from "../utils/format";

export function QuotationsPage() {
  const navigate = useNavigate();
  const { canWrite } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [ordering, setOrdering] = useState("-date");

  const { data, isLoading } = useQuery({
    queryKey: ["quotations", page, pageSize, search, status, ordering],
    queryFn: async () =>
      (
        await quotationsApi.list({
          page: page + 1,
          page_size: pageSize,
          search: search || undefined,
          status: status || undefined,
          ordering,
        })
      ).data,
  });

  const openPdf = async (id: number, number: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const url = quotationsApi.pdfUrl(id);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("PDF failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank");
      enqueueSnackbar(`Opened ${number}.pdf`, { variant: "success" });
    } catch {
      enqueueSnackbar("Failed to generate PDF", { variant: "error" });
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Sales Quotations
          </Typography>
          <Typography color="text.secondary">
            Draft, send, approve, and convert truck quotations
          </Typography>
        </Box>
        {canWrite && (
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/quotations/new")}>
            New Quotation
          </Button>
        )}
      </Stack>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search quotation number or customer…"
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
                  {QUOTE_STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : (
        <Card>
          <TableContainer sx={{ maxHeight: "70vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={ordering.includes("quotation_number")}
                      direction={ordering.startsWith("-") ? "desc" : "asc"}
                      onClick={() =>
                        setOrdering(ordering === "quotation_number" ? "-quotation_number" : "quotation_number")
                      }
                    >
                      Number
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Salesperson</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={ordering.includes("date")}
                      direction={ordering === "date" ? "asc" : "desc"}
                      onClick={() => setOrdering(ordering === "-date" ? "date" : "-date")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={ordering.includes("grand_total")}
                      direction={ordering.startsWith("-") ? "desc" : "asc"}
                      onClick={() =>
                        setOrdering(ordering === "grand_total" ? "-grand_total" : "grand_total")
                      }
                    >
                      Total
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.results.map((q) => (
                  <TableRow
                    key={q.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/quotations/${q.id}`)}
                  >
                    <TableCell>
                      <Typography fontWeight={700}>{q.quotation_number}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {q.items_count} item(s)
                      </Typography>
                    </TableCell>
                    <TableCell>{q.customer_name}</TableCell>
                    <TableCell>{q.salesperson_name}</TableCell>
                    <TableCell>{q.date}</TableCell>
                    <TableCell>
                      <StatusChip status={q.status} label={q.status_display} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700}>{formatAED(q.grand_total)}</Typography>
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Button
                          size="small"
                          startIcon={<VisibilityOutlined />}
                          onClick={() => navigate(`/quotations/${q.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<PictureAsPdf />}
                          onClick={() => openPdf(q.id, q.quotation_number)}
                        >
                          PDF
                        </Button>
                      </Stack>
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
    </Box>
  );
}
