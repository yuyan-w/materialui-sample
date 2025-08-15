import { Routes, Route } from "react-router-dom";
import FormPage from "./FormPage";
import { SamplePage } from "./SamplePage";
import { UserPage } from "./UserPage";

export default function DebugRoute() {
  return (
    <Routes>
      <Route path="/form" element={<FormPage />} />
      <Route path="/sample" element={<SamplePage />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
  );
}
