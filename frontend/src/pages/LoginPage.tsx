import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalShippingOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../api";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const DEMO_PASSWORDS: Record<string, string> = {
  admin: "admin123",
  manager: "manager123",
  sales1: "sales123",
  sales2: "sales123",
  viewer: "viewer123",
};

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [demoUsers, setDemoUsers] = useState<
    { username: string; role_display: string; full_name: string }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "admin", password: "admin123" },
  });

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    authApi.demoUsers().then((res) => setDemoUsers(res.data)).catch(() => undefined);
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await login(values.username, values.password);
      enqueueSnackbar("Welcome to Gulf Heavy Trucks ERP", { variant: "success" });
      navigate("/", { replace: true });
    } catch {
      enqueueSnackbar("Invalid username or password", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background: (t) =>
          t.palette.mode === "dark"
            ? "radial-gradient(ellipse at 20% 20%, rgba(30,58,95,0.5), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(14,165,233,0.15), transparent 45%), #0b1220"
            : "radial-gradient(ellipse at 15% 10%, rgba(30,58,95,0.12), transparent 45%), radial-gradient(ellipse at 85% 90%, rgba(14,165,233,0.1), transparent 40%), linear-gradient(180deg, #e8eef5, #f8fafc)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 960 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="stretch"
        >
          <Card sx={{ flex: 1.1, overflow: "hidden" }}>
            <Box
              sx={{
                p: 4,
                minHeight: 280,
                background: "linear-gradient(145deg, #0f2744 0%, #1e3a5f 45%, #0369a1 100%)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.15)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <LocalShippingOutlined />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Gulf Heavy Trucks
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    Trading LLC · Dubai, UAE
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: "-0.02em" }}>
                  Dealership ERP
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 360 }}>
                  Import · Inventory · Quotations · Sales — Chinese heavy trucks for UAE businesses.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: "wrap", gap: 1 }}>
                {["Shacman", "HOWO", "FAW", "Dongfeng", "Foton", "JAC"].map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "#fff" }}
                  />
                ))}
              </Stack>
            </Box>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={800} gutterBottom>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Use a demo account to explore role-based access.
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <TextField
                    label="Username"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    {...register("username")}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password")}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                  >
                    {submitting ? "Signing in…" : "Sign in"}
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Quick demo users
              </Typography>
              <Stack spacing={1}>
                {demoUsers.map((u) => (
                  <Button
                    key={u.username}
                    variant="outlined"
                    color="inherit"
                    sx={{ justifyContent: "space-between", textAlign: "left" }}
                    onClick={() => {
                      setValue("username", u.username);
                      setValue("password", DEMO_PASSWORDS[u.username] || "demo");
                    }}
                  >
                    <span>
                      <strong>{u.full_name}</strong>
                      <Typography component="span" variant="caption" color="text.secondary" display="block">
                        {u.username} · {DEMO_PASSWORDS[u.username]}
                      </Typography>
                    </span>
                    <Chip size="small" label={u.role_display} />
                  </Button>
                ))}
              </Stack>
              <Alert severity="info" sx={{ mt: 2 }}>
                Data is pre-seeded: 30 trucks · 20 customers · 15 quotations
              </Alert>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
