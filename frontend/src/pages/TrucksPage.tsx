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
  Avatar,
} from "@mui/material";
import { Search as SearchIcon, VisibilityOutlined } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { trucksApi } from "../api";
import { StatusChip } from "../components/StatusChip";
import { TableSkeleton } from "../components/TableSkeleton";
import { AVAILABILITIES, BRANDS, CATEGORIES, formatAED } from "../utils/format";

type Order = "asc" | "desc";

export function TrucksPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [ordering, setOrdering] = useState("brand");
  const [order, setOrder] = useState<Order>("asc");

  const { data, isLoading } = useQuery({
    queryKey: ["trucks", page, pageSize, search, brand, category, availability, ordering, order],
    queryFn: async () =>
      (
        await trucksApi.list({
          page: page + 1,
          page_size: pageSize,
          search: search || undefined,
          brand: brand || undefined,
          category: category || undefined,
          availability: availability || undefined,
          ordering: order === "asc" ? ordering : `-${ordering}`,
        })
      ).data,
  });

  const handleSort = (field: string) => {
    if (ordering === field) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setOrdering(field);
      setOrder("asc");
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Truck Catalog
          </Typography>
          <Typography color="text.secondary">
            Chinese heavy trucks imported for UAE businesses
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search VIN, brand, model…"
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
            <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  label="Brand"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {BRANDS.map((b) => (
                    <MenuItem key={b} value={b}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(0);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  label="Availability"
                  value={availability}
                  onChange={(e) => {
                    setAvailability(e.target.value);
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
          <TableContainer sx={{ maxHeight: "70vh" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Truck</TableCell>
                  <TableCell sortDirection={ordering === "year" ? order : false}>
                    <TableSortLabel
                      active={ordering === "year"}
                      direction={ordering === "year" ? order : "asc"}
                      onClick={() => handleSort("year")}
                    >
                      Year
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell sortDirection={ordering === "horsepower" ? order : false}>
                    <TableSortLabel
                      active={ordering === "horsepower"}
                      direction={ordering === "horsepower" ? order : "asc"}
                      onClick={() => handleSort("horsepower")}
                    >
                      HP
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Drive</TableCell>
                  <TableCell>VIN</TableCell>
                  <TableCell sortDirection={ordering === "price" ? order : false}>
                    <TableSortLabel
                      active={ordering === "price"}
                      direction={ordering === "price" ? order : "asc"}
                      onClick={() => handleSort("price")}
                    >
                      Price
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.results.map((t) => (
                  <TableRow key={t.id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/trucks/${t.id}`)}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          variant="rounded"
                          src={t.image_url}
                          sx={{ width: 44, height: 32, bgcolor: "action.hover" }}
                        />
                        <Box>
                          <Typography fontWeight={700} fontSize={14}>
                            {t.brand} {t.model}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t.emission} · {t.fuel}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{t.year}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{t.category_display || t.category}</TableCell>
                    <TableCell>{t.horsepower}</TableCell>
                    <TableCell>{t.drive_type}</TableCell>
                    <TableCell>
                      <Typography fontFamily="monospace" fontSize={12}>
                        {t.vin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>{formatAED(t.price)}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={t.availability} label={t.availability_display} />
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="small"
                        startIcon={<VisibilityOutlined />}
                        onClick={() => navigate(`/trucks/${t.id}`)}
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
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}
    </Box>
  );
}
