import { Routes, Route } from "react-router-dom";
import TimerPage from "./TimerPage";
import CallbackPage from "./CallbackPage";

export default function SampleRoutes() {
  return (
    <Routes>
      <Route path="/timer" element={<TimerPage />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
}
