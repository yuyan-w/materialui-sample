import { Routes, Route } from "react-router-dom";
import FormPage from "./FormPage";
import { SamplePage } from "./SamplePage";
import { UserPage } from "./UserPage";
import { UserDetailPage } from "./UserDetail";
import { SelectDemoPage } from "./SelectDemo";

export default function DebugRoute() {
  return (
    <Routes>
      <Route path="/form" element={<FormPage />} />
      <Route path="/sample" element={<SamplePage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/detail" element={<UserDetailPage />} />
      <Route path="/select" element={<SelectDemoPage />} />
    </Routes>
  );
}
