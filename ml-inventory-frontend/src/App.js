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
import OrderItemList from "./Components/orderitems/OrderItemList";
import AddOrderItem from "./Components/orderitems/AddOrderItem";
import EditOrderItem from "./Components/orderitems/EditOrderItem";
import InventoryList from "./Components/inventories/InventoryList";
import AddInventory from "./Components/inventories/AddInventory";
import EditInventory from "./Components/inventories/EditInventory";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* Dashboard routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/subadmin-dashboard" element={<SubAdminDashboard />} />
        <Route path="/storekeeper-dashboard" element={<StoreKeeperDashboard />} />

        {/* Profile routes */}
        <Route path="/settings" element={<Profile />} />
        <Route path="/profile/edit" element={<UpdateProfileForm />} />
        <Route path="/profile/change-password" element={<ChangePasswordForm />} />


        {/* users routes */}
        <Route path="/users/list" element={<UserList />} />
        <Route path="/user/add" element={<AddUser />} />
        <Route path="/user/edit/:id" element={<EditUser />} />

        {/* Products routes */}
        <Route path="/products/list" element={<ProductList />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />
        <Route path="/product/details/:id" element={<ProductDetails />} />


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

        {/* Orders routes */}
        <Route path="/orders/list" element={<OrderList />} />
        <Route path="/order/add" element={<AddOrder />} />
        <Route path="/order/edit/:id" element={<EditOrder />} />

        {/* Order items routes */}
        <Route path="/order-items/list" element={<OrderItemList />} />
        <Route path="/order-item/add" element={<AddOrderItem />} />
        <Route path="/order-item/edit/:id" element={<EditOrderItem />} />

        {/* Inventory routes */}
        <Route path="/inventory/list" element={<InventoryList />} />
        <Route path="/inventory/add" element={<AddInventory />} />
        <Route path="/inventory/edit/:id" element={<EditInventory />} />

        {/* Reports routes */}
        <Route path="/reports/list" element={<ReportList />} />
        <Route path="/report/add" element={<AddReport />} />
        <Route path="/report/edit/:id" element={<EditReport />} />
        <Route path="/report/view/:id" element={<ViewReport />} />

        {/* Inboxes routes */}
        <Route path="/inboxes/list" element={<InboxList />} />
        <Route path="/inbox/add" element={<AddInbox />} />
        <Route path="/inbox/view/:id" element={<ViewInbox />} />

      </Routes>
    </Router>
  );
}

export default App;
