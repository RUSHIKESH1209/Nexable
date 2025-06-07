import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Connections from './pages/Connections'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Login from './pages/Login'
import CreateProfile from './pages/Createprofile'
import Navbar from './components/Navbar'
import Chat from './pages/Chat'

const App = () => {
  return (
    <>
      <Navbar></Navbar>

      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/createprofile' element={<CreateProfile></CreateProfile>}></Route>
        <Route path='/home' element={<Home></Home>}></Route>
        <Route path='/connections' element={<Connections></Connections>}></Route>
        <Route path='/notifications' element={<Notifications></Notifications>}></Route>
        <Route path='/profile' element={<Profile></Profile>}></Route>
        <Route path="/chat/:receiverId" element={<Chat/>} />
      </Routes>
    </>

  )
}

export default App