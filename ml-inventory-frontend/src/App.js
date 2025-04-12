import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
import Login from "./Components/Login";
import StoreKeeperDashboard from "./Components/StoreKeeperDashboard";
import SubAdminDashboard from "./Components/SubAdminDashboard";
import ProductList from "./Components/products/ProductList";
import AddProduct from "./Components/products/AddProduct";
import EditProduct from "./Components/products/EditProduct";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/subadmin-dashboard" element={<SubAdminDashboard />} />
        <Route path="/storekeeper-dashboard" element={<StoreKeeperDashboard />} />

        <Route path="/product/list" element={<ProductList />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
