import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
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
import { Search as SearchIcon, VisibilityOutlined } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { customersApi } from "../api";
import { TableSkeleton } from "../components/TableSkeleton";
import { formatAED } from "../utils/format";

export function CustomersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("company_name");
  const [orderAsc, setOrderAsc] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, pageSize, search, ordering, orderAsc],
    queryFn: async () =>
      (
        await customersApi.list({
          page: page + 1,
          page_size: pageSize,
          search: search || undefined,
          ordering: orderAsc ? ordering : `-${ordering}`,
        })
      ).data,
  });

  const toggleSort = (field: string) => {
    if (ordering === field) setOrderAsc((v) => !v);
    else {
      setOrdering(field);
      setOrderAsc(true);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Customers
          </Typography>
          <Typography color="text.secondary">
            UAE B2B accounts — transport, construction, and logistics
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search company, license, VAT, contact…"
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
                  <TableCell sortDirection={ordering === "company_name" ? (orderAsc ? "asc" : "desc") : false}>
                    <TableSortLabel
                      active={ordering === "company_name"}
                      direction={orderAsc ? "asc" : "desc"}
                      onClick={() => toggleSort("company_name")}
                    >
                      Company
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Payment Terms</TableCell>
                  <TableCell sortDirection={ordering === "credit_limit" ? (orderAsc ? "asc" : "desc") : false}>
                    <TableSortLabel
                      active={ordering === "credit_limit"}
                      direction={orderAsc ? "asc" : "desc"}
                      onClick={() => toggleSort("credit_limit")}
                    >
                      Credit Limit
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.results.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/customers/${c.id}`)}
                  >
                    <TableCell>
                      <Typography fontWeight={700}>{c.company_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.trade_license} · VAT {c.vat_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {c.contact_person}
                      {c.contact_title ? (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {c.contact_title}
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.payment_terms_display || c.payment_terms}</TableCell>
                    <TableCell>{formatAED(c.credit_limit)}</TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="small"
                        startIcon={<VisibilityOutlined />}
                        onClick={() => navigate(`/customers/${c.id}`)}
                      >
                        View
                      </Button>
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
