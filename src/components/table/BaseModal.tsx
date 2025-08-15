import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from "@mui/material";

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
};

export const BaseModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
}: BaseModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        // 外側クリック・ESCキーでは閉じさせない
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      maxWidth={maxWidth}
      fullWidth
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
