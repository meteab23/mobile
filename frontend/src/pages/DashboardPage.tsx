import {
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
} from "@mui/material";
import {
  LocalShippingOutlined,
  CheckCircleOutlined,
  BookmarkBorder,
  SellOutlined,
  AccountBalanceWalletOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { dashboardApi } from "../api";
import { StatCard } from "../components/StatCard";
import { StatusChip } from "../components/StatusChip";
import { TableSkeleton } from "../components/TableSkeleton";
import { formatAED } from "../utils/format";

const PIE_COLORS = ["#1e3a5f", "#0369a1", "#0ea5e9", "#38bdf8", "#64748b", "#94a3b8"];

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await dashboardApi.get()).data,
  });

  const stats = data?.stats;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 3 }}
        spacing={1}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Live overview of inventory, quotations, and UAE sales activity
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate("/quotations/new")}>
          New Quotation
        </Button>
      </Stack>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Total Trucks"
            value={stats?.total ?? "—"}
            icon={<LocalShippingOutlined />}
            color="#1e3a5f"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Available"
            value={stats?.available ?? "—"}
            icon={<CheckCircleOutlined />}
            color="#16a34a"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Reserved"
            value={stats?.reserved ?? "—"}
            icon={<BookmarkBorder />}
            color="#d97706"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Sold"
            value={stats?.sold ?? "—"}
            icon={<SellOutlined />}
            color="#64748b"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Inventory Value"
            value={formatAED(stats?.inventory_value)}
            icon={<AccountBalanceWalletOutlined />}
            color="#0369a1"
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Sales This Month"
            value={formatAED(stats?.sales_this_month)}
            icon={<TrendingUpOutlined />}
            color="#0ea5e9"
            loading={isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: 360 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Sales Trend (6 months)
              </Typography>
              {isLoading || !data ? (
                <Box sx={{ height: 280 }} />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={data.charts.monthly_sales.map((d) => ({ ...d, total: Number(d.total) }))}>
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0369a1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0369a1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.2)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip formatter={(v) => formatAED(Number(v))} />
                    <Area type="monotone" dataKey="total" stroke="#0369a1" fill="url(#salesFill)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
          <Card sx={{ height: 360 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Fleet by Brand
              </Typography>
              {data && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.charts.trucks_by_brand}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.2)" />
                    <XAxis dataKey="brand" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1e3a5f" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card sx={{ height: 320 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Quotations by Status
              </Typography>
              {data && (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.charts.quotations_by_status}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {data.charts.quotations_by_status.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                  Recent Quotations
                </Typography>
                <Button size="small" onClick={() => navigate("/quotations")}>
                  View all
                </Button>
              </Stack>
              {isLoading ? (
                <TableSkeleton rows={5} cols={5} />
              ) : (
                <TableContainer sx={{ maxHeight: 280 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Number</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.recent_quotations.map((q) => (
                        <TableRow
                          key={q.id}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/quotations/${q.id}`)}
                        >
                          <TableCell>
                            <Typography fontWeight={650} fontSize={13}>
                              {q.quotation_number}
                            </Typography>
                          </TableCell>
                          <TableCell>{q.customer_name}</TableCell>
                          <TableCell>
                            <StatusChip status={q.status} label={q.status_display} />
                          </TableCell>
                          <TableCell>{q.date}</TableCell>
                          <TableCell align="right">{formatAED(q.grand_total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Latest Customers
            </Typography>
            <Button size="small" onClick={() => navigate("/customers")}>
              View all
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {data?.latest_customers.map((c) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
                <PaperCustomer
                  name={c.company_name}
                  contact={c.contact_person}
                  city={c.city}
                  onClick={() => navigate(`/customers/${c.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

function PaperCustomer({
  name,
  contact,
  city,
  onClick,
}: {
  name: string;
  contact: string;
  city: string;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
      }}
    >
      <Typography fontWeight={700}>{name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {contact} · {city}
      </Typography>
    </Box>
  );
}
