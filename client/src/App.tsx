import "./App.css";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <h1>Admin Page</h1>
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
