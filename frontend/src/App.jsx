import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Menu from './pages/Menu'
import Service from './pages/Service'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import TrackOrder from './pages/TrackOrder'
import ForgotPassword from './pages/ForgotPassword'
import OwnerDashboard from './pages/OwnerDashboard'
import RiderDashboard from './pages/RiderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar/>
    <div className="pt-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/about" element={<About />} />
        <Route path='/services' element={<Service/>}/>  
        <Route path="/menu" element={<Menu />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        
        <Route path="/track-order/:id" element={
          <ProtectedRoute>
            <TrackOrder />
          </ProtectedRoute>
        } />
        
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
    </div>
    </>
  )
}

export default App
