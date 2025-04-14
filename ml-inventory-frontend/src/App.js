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
import WarehouseList from "./Components/warehouses/WarehouseList";
import AddWarehouse from "./Components/warehouses/AddWarehouse";
import EditWarehouse from "./Components/warehouses/EditWarehouse";
import BeneficiaryList from "./Components/Beneficiaries/BeneficiaryList";
import AddBeneficiary from "./Components/Beneficiaries/AddBeneficiary";
import EditBeneficiary from "./Components/Beneficiaries/EditBeneficiary";
import CategoryList from "./Components/categories/CategoryList";
import AddCategory from "./Components/categories/AddCategory";
import EditCategory from "./Components/categories/EditCategory";

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

        {/* Products routes */}
        <Route path="/products/list" element={<ProductList />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />

        {/* Warehouses routes */}
        <Route path="/warehouses/list" element={<WarehouseList />} />
        <Route path="/warehouse/add" element={<AddWarehouse />} />
        <Route path="/warehouse/edit/:id" element={<EditWarehouse />} />

        {/* Beneficiaries routes */}
        <Route path="/beneficiaries/list" element={<BeneficiaryList />} />
        <Route path="/beneficiary/add" element={<AddBeneficiary />} />
        <Route path="/beneficiary/edit/:id" element={<EditBeneficiary />} />

        {/* Categories routes */}
        <Route path="/categories/list" element={<CategoryList />} />
        <Route path="/category/add" element={<AddCategory />} />
        <Route path="/category/edit/:id" element={<EditCategory />} />
      </Routes>
    </Router>
  );
}

export default App;