import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from './features/auth/authApi';
import { setUser } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account/Account';
import Login from './pages/Account/Login';
import Register from './pages/Account/Register';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/ProductManager';
import AdminOrders from './pages/admin/OrderManager';
import AdminCategories from './pages/admin/CategoryManager';
import AdminUsers from './pages/admin/UserManager';
import AdminRoles from './pages/admin/RoleManager';
import AdminCoupons from './pages/admin/CouponManager';
import AdminBanners from './pages/admin/BannerManager';
import AdminGoldRate from './pages/admin/GoldRateManager';

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('accessToken');
  const { data, isSuccess } = useGetMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      dispatch(setUser(data.data.user));
    }
  }, [isSuccess, data, dispatch]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="gold-rate" element={<AdminGoldRate />} />
      </Route>
    </Routes>
  );
}

export default App;
