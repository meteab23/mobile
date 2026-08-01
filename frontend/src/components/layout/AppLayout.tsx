import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  ClickAwayListener,
  Paper,
  ListItem,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  DashboardOutlined,
  LocalShippingOutlined,
  PeopleOutlined,
  DescriptionOutlined,
  Inventory2Outlined,
  Menu as MenuIcon,
  Search as SearchIcon,
  DarkModeOutlined,
  LightModeOutlined,
  LogoutOutlined,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeMode } from "../../contexts/ThemeModeContext";
import { searchApi } from "../../api";

const DRAWER_WIDTH = 260;

const NAV = [
  { label: "Dashboard", path: "/", icon: <DashboardOutlined /> },
  { label: "Truck Catalog", path: "/trucks", icon: <LocalShippingOutlined /> },
  { label: "Customers", path: "/customers", icon: <PeopleOutlined /> },
  { label: "Quotations", path: "/quotations", icon: <DescriptionOutlined /> },
  { label: "Inventory", path: "/inventory", icon: <Inventory2Outlined /> },
];

export function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 280);
    return () => clearTimeout(t);
  }, [query]);

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: async () => (await searchApi.search(debounced)).data,
    enabled: debounced.length >= 2,
  });

  const results = useMemo(() => {
    if (!searchData) return [];
    return [
      ...searchData.results.trucks,
      ...searchData.results.customers,
      ...searchData.results.quotations,
    ];
  }, [searchData]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            GH
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
              Gulf Heavy Trucks
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dealership ERP
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV.map((item) => {
          const selected =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: (t) =>
                    t.palette.mode === "dark" ? "rgba(96,165,250,0.15)" : "rgba(30,58,95,0.08)",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: selected ? 700 : 500, fontSize: 14 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 1.5, bgcolor: "action.hover", border: "none", boxShadow: "none" }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            UAE Demo Environment
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Al Quoz · Dubai · AED · VAT 5%
          </Typography>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1.5 }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          {!isMobile && <Box sx={{ width: DRAWER_WIDTH - 24 }} />}

          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <Box sx={{ position: "relative", flex: 1, maxWidth: 520 }}>
              <TextField
                fullWidth
                placeholder="Search VIN, truck, customer, quotation…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: query ? (
                    <InputAdornment position="end">
                      {isFetching ? (
                        <CircularProgress size={16} />
                      ) : (
                        <IconButton size="small" onClick={() => setQuery("")}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ) : undefined,
                  sx: { bgcolor: "background.default", borderRadius: 2.5 },
                }}
              />
              {searchOpen && debounced.length >= 2 && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    maxHeight: 360,
                    overflow: "auto",
                    p: 1,
                  }}
                >
                  {results.length === 0 && !isFetching && (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      No results for “{debounced}”
                    </Typography>
                  )}
                  <List dense>
                    {results.map((hit) => (
                      <ListItem key={`${hit.type}-${hit.id}`} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                            if (hit.type === "truck") navigate(`/trucks/${hit.id}`);
                            else if (hit.type === "customer") navigate(`/customers/${hit.id}`);
                            else navigate(`/quotations/${hit.id}`);
                          }}
                        >
                          <ListItemText
                            primary={hit.label}
                            secondary={`${hit.type} · ${hit.subtitle}`}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
            <IconButton onClick={toggleMode}>
              {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
          </Tooltip>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: user?.avatar_color || "primary.main",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {(user?.full_name || user?.username || "?").slice(0, 2).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
              <Typography fontWeight={700}>{user?.full_name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role_display} · {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                logout();
                navigate("/login");
              }}
            >
              <ListItemIcon>
                <LogoutOutlined fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
