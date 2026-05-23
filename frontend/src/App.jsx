import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RestaurantDetail from './pages/RestaurantDetail'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import OrderHistory from './pages/OrderHistory'
import OwnerDashboard from './pages/OwnerDashboard'
import RiderDashboard from './pages/RiderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/orders/:id/track" element={<OrderTracking />} />
      
      <Route path="/owner-dashboard" element={
        <ProtectedRoute allowedRoles={["owner"]}>
          <OwnerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/rider-dashboard" element={
        <ProtectedRoute allowedRoles={["deliveryBoy"]}>
          <RiderDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
