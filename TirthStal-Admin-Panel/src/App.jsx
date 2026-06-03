import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage       from "./Pages/MainPage/MainPage";
import AuthReceiver   from "./pages/AuthReceiver";
import ProtectedRoute from "./utils/ProtectedRoute";
import Dashboard      from "./Components/Dashboard/dashboard";
import Temple         from "./Components/Temple/temple";
import Dieties        from "./Components/Dieties/dieties";
import Festivals      from "./Components/Festivals/festivals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthReceiver />} />
        <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>}>
          <Route index            element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="temple"    element={<Temple />}    />
          <Route path="dieties"   element={<Dieties />}   />
          <Route path="festivals" element={<Festivals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;