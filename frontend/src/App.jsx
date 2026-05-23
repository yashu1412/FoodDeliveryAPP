import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Menu from './pages/Menu'
import Service from './pages/Service'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/about" element={<About />} />
        <Route path='/services' element={<Service/>}/>  
        <Route path="/menu" element={<Menu />} />
        <Route path='/contact' element={<Contact/>}/>
      </Routes>
    </>
  )
}

export default App
