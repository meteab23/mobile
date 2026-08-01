import { Chip } from "@mui/material";
import { STATUS_COLORS } from "../utils/format";

export function StatusChip({ status, label }: { status: string; label?: string }) {
  const color = STATUS_COLORS[status] || "default";
  return (
    <Chip
      size="small"
      color={color}
      label={label || status.replace(/_/g, " ")}
      sx={{ textTransform: "capitalize", fontWeight: 600 }}
    />
  );
}
