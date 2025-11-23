import { Routes, Route } from 'react-router-dom'
import Home from './componants/Home'
import Register from './componants/Register'
import Login from './componants/Login'
import Profile from './componants/Pofile'
import UpdateProfile from './componants/UpdateProfile'
import Dashboard from './componants/Dashboard'
import Navbar from './componants/NavBar'
import './App.css'


function App() {


  return (
    <>

    <Navbar/>
    <Routes>

      <Route path="/" element={< Home/>}/>
      <Route path="/auth/register" element={< Register/>}/>
      <Route path="/auth/login" element={< Login/>}/>
      <Route path="/profiles/:id" element={< Profile/>}/>
      <Route path="/profiles/:id/edit" element={<UpdateProfile/>}/>
      <Route path="/profiles/:id/stats" element={<Dashboard/>}/>


    </Routes>
       
    </>
  )
}

export default App
