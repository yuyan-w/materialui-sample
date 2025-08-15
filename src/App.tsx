import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

import SampleRoutes from "./components/pages/PageRoutes";
import DebugRoute from "./components/debugs/DebugRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/sample/*" element={<SampleRoutes />} />
          <Route path="/debug/*" element={<DebugRoute />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
