import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
// Importing components
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
import UserList from "./Components/users/UserList";
import AddUser from "./Components/users/AddUser";
import EditUser from "./Components/users/EditUser";
import OrderList from "./Components/orders/OrderList";
import AddOrder from "./Components/orders/AddOrder";
import EditOrder from "./Components/orders/EditOrder";
import InventoryList from "./Components/inventories/InventoryList";
import ReportList from "./Components/reports/ReportList";
import AddReport from "./Components/reports/AddReport";
import EditReport from "./Components/reports/EditReport";
import ViewReport from "./Components/reports/ViewReport";
import InboxList from "./Components/inboxes/InboxList";
import AddInbox from "./Components/inboxes/AddInbox";
import ViewInbox from "./Components/inboxes/ViewInbox";
import Profile from "./Components/settings/Profile";
import UpdateProfileForm from "./Components/settings/UpdateProfileForm";
import ChangePasswordForm from "./Components/settings/ChangePasswordForm";
import Logout from "./Components/Logout";
import ResetPassword from "./Components/ResetPassword";
import ProductDetails from "./Components/products/ProductDetails";
import UserDetails from "./Components/users/UserDetails";
import DetailsOrder from "./Components/orders/DetailsOrder";
import BeneficiaryDetails from "./Components/Beneficiaries/BeneficiaryDetails";
import DashboardHome from "./Components/dashboards/DashboardHome";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />}/>

          {/* Profile routes */}
          <Route path="settings" element={<Profile />} />
          <Route path="settings/profile/edit" element={<UpdateProfileForm />} />
          <Route
            path="settings/profile/change-password"
            element={<ChangePasswordForm />}
          />

          {/* Users routes */}
          <Route path="users/list" element={<UserList />} />
          <Route path="users/details/:id" element={<UserDetails />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />

          {/* Products routes */}
          <Route path="products/list" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/details/:id" element={<ProductDetails />} />

          {/* Warehouses routes */}
          <Route path="warehouses/list" element={<WarehouseList />} />
          <Route path="warehouses/add" element={<AddWarehouse />} />
          <Route path="warehouses/edit/:id" element={<EditWarehouse />} />

          {/* Beneficiaries routes */}
          <Route path="beneficiaries/list" element={<BeneficiaryList />} />
          <Route path="beneficiaries/add" element={<AddBeneficiary />} />
          <Route path="beneficiaries/edit/:id" element={<EditBeneficiary />} />
          <Route path="beneficiaries/details/:id" element={<BeneficiaryDetails />} />

          {/* Categories routes */}
          <Route path="categories/list" element={<CategoryList />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          {/* Orders routes */}
          <Route path="orders/list" element={<OrderList />} />
          <Route path="orders/add" element={<AddOrder />} />
          <Route path="orders/edit/:id" element={<EditOrder />} />
          <Route path="orders/details/:id" element={<DetailsOrder />} />

          {/* Inventory routes */}
          <Route path="inventory/list" element={<InventoryList />} />

          {/* Reports routes */}
          <Route path="reports/list" element={<ReportList />} />
          <Route path="reports/add" element={<AddReport />} />
          <Route path="reports/edit/:id" element={<EditReport />} />
          <Route path="reports/view/:id" element={<ViewReport />} />

          {/* Inboxes routes */}
          <Route path="inboxes/list" element={<InboxList />} />
          <Route path="inboxes/add" element={<AddInbox />} />
          <Route path="inboxes/view/:id" element={<ViewInbox />} />
        </Route>

        {/* Other dashboards */}
        <Route path="/subadmin-dashboard" element={<SubAdminDashboard />}>
          <Route index element={<div></div>} />
          {/* Profile routes */}
          <Route path="settings" element={<Profile />} />
          <Route path="settings/profile/edit" element={<UpdateProfileForm />} />
          <Route
            path="settings/profile/change-password"
            element={<ChangePasswordForm />}
          />

          {/* Products routes */}
          <Route path="products/list" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/details/:id" element={<ProductDetails />} />

          {/* Categories routes */}
          <Route path="categories/list" element={<CategoryList />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          {/* Warehouses routes */}
          <Route path="warehouses/list" element={<WarehouseList />} />
          <Route path="warehouses/add" element={<AddWarehouse />} />
          <Route path="warehouses/edit/:id" element={<EditWarehouse />} />

          {/* Orders routes */}
          <Route path="orders/list" element={<OrderList />} />
          <Route path="orders/add" element={<AddOrder />} />
          <Route path="orders/edit/:id" element={<EditOrder />} />

          {/* Inventory routes */}
          <Route path="inventory/list" element={<InventoryList />} />

          {/* Reports routes */}
          <Route path="reports/list" element={<ReportList />} />
          <Route path="reports/add" element={<AddReport />} />
          <Route path="reports/edit/:id" element={<EditReport />} />
          <Route path="reports/view/:id" element={<ViewReport />} />

          {/* Inboxes routes */}
          <Route path="inboxes/list" element={<InboxList />} />
          <Route path="inboxes/add" element={<AddInbox />} />
          <Route path="inboxes/view/:id" element={<ViewInbox />} />
        </Route>

        <Route path="/storekeeper-dashboard" element={<StoreKeeperDashboard />}>
          <Route index element={<div></div>} />
          {/* Profile routes */}
          <Route path="settings" element={<Profile />} />
          <Route path="settings/profile/edit" element={<UpdateProfileForm />} />
          <Route
            path="settings/profile/change-password"
            element={<ChangePasswordForm />}
          />

          <Route path="products/list" element={<ProductList />} />
          <Route path="warehouses/list" element={<WarehouseList />} />
          <Route path="categories/list" element={<CategoryList />} />
          <Route path="orders/list" element={<OrderList />} />

          {/* Inventory routes */}
          <Route path="inventory/list" element={<InventoryList />} />

          {/* Reports routes */}
          <Route path="reports/list" element={<ReportList />} />
          <Route path="reports/add" element={<AddReport />} />
          <Route path="reports/edit/:id" element={<EditReport />} />
          <Route path="reports/view/:id" element={<ViewReport />} />

          {/* Inboxes routes */}
          <Route path="inboxes/list" element={<InboxList />} />
          <Route path="inboxes/add" element={<AddInbox />} />
          <Route path="inboxes/view/:id" element={<ViewInbox />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
