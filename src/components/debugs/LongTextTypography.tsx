import { forwardRef } from "react";
import { Tooltip, Typography, TypographyProps } from "@mui/material";

interface LongTextTypographyProps extends TypographyProps {
  children: React.ReactNode;
}

const LongTextTypography = forwardRef<HTMLDivElement, LongTextTypographyProps>(
  ({ maxWidth, children, ...rest }: LongTextTypographyProps, ref) => {
    return (
      <Tooltip title={children} arrow>
        <Typography
          ref={ref}
          {...rest}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            ...rest.sx,
          }}
        >
          {children}
        </Typography>
      </Tooltip>
    );
  }
);

export default LongTextTypography;
