import { createTheme, type PaletteMode } from "@mui/material";

const brand = {
  primary: "#1e3a5f",
  primaryLight: "#2e5a8f",
  secondary: "#0ea5e9",
  accent: "#0369a1",
};

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#60a5fa" : brand.primary,
        light: isDark ? "#93c5fd" : brand.primaryLight,
        dark: isDark ? "#3b82f6" : "#0f2744",
        contrastText: "#ffffff",
      },
      secondary: {
        main: brand.secondary,
      },
      background: {
        default: isDark ? "#0b1220" : "#f1f5f9",
        paper: isDark ? "#111827" : "#ffffff",
      },
      text: {
        primary: isDark ? "#e2e8f0" : "#0f172a",
        secondary: isDark ? "#94a3b8" : "#64748b",
      },
      divider: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.08)",
      success: { main: "#16a34a" },
      warning: { main: "#d97706" },
      error: { main: "#dc2626" },
      info: { main: "#0284c7" },
    },
    typography: {
      fontFamily: '"IBM Plex Sans", "Segoe UI", Helvetica, Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 650 },
      h6: { fontWeight: 650 },
      button: { textTransform: "none", fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    shadows: [
      "none",
      "0 1px 2px rgba(15,23,42,0.04)",
      "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
      "0 4px 12px rgba(15,23,42,0.06)",
      "0 8px 24px rgba(15,23,42,0.08)",
      "0 12px 32px rgba(15,23,42,0.1)",
      ...Array(19).fill("0 12px 32px rgba(15,23,42,0.1)"),
    ] as unknown as ReturnType<typeof createTheme>["shadows"],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? "radial-gradient(ellipse at top left, rgba(30,58,95,0.35), transparent 50%), radial-gradient(ellipse at bottom right, rgba(14,165,233,0.08), transparent 45%)"
              : "radial-gradient(ellipse at top left, rgba(30,58,95,0.06), transparent 50%), radial-gradient(ellipse at bottom right, rgba(14,165,233,0.05), transparent 45%)",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
          contained: {
            backgroundImage: isDark
              ? "linear-gradient(135deg, #3b82f6, #0ea5e9)"
              : "linear-gradient(135deg, #1e3a5f, #0369a1)",
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.06)"}`,
            boxShadow: isDark
              ? "0 4px 24px rgba(0,0,0,0.25)"
              : "0 4px 20px rgba(15,23,42,0.04)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.06)"}`,
            backgroundImage: isDark
              ? "linear-gradient(180deg, #0f172a 0%, #111827 100%)"
              : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backdropFilter: "blur(12px)",
            backgroundColor: isDark ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.85)",
            color: isDark ? "#e2e8f0" : "#0f172a",
            borderBottom: `1px solid ${isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.06)"}`,
            boxShadow: "none",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-head": {
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              backgroundColor: isDark ? "#0f172a" : "#f8fafc",
              color: isDark ? "#94a3b8" : "#64748b",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
    },
  });
}
