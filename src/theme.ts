// src/theme.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// reateTheme({ typography: { tableHeader: { fontSize: '14px' } } }) が型エラーなく書けるようにするために追加
// https://mui.com/material-ui/customization/typography/#adding-amp-removing-variants
declare module "@mui/material/styles" {
  interface TypographyVariants {
    tableHeader: React.CSSProperties;
    tableBody: React.CSSProperties;
  }

  // variant propに追加したいとき
  interface TypographyVariantsOptions {
    tableHeader?: React.CSSProperties;
    tableBody?: React.CSSProperties;
  }
}

// Typographyのvariant prop拡張
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    tableHeader: true;
    tableBody: true;
  }
}

const theme = createTheme({
  typography: {
    fontSize: 20,
    tableHeader: {
      fontSize: "0.875rem", // ≒14px（基準が20pxなので14/20 = 0.7）
      fontWeight: 600,
    },
    tableBody: {
      fontSize: "0.8125rem", // ≒13px
      fontWeight: 400,
    },
  },
});

export default responsiveFontSizes(theme);
