import React from 'react'
import Navbar from './components/Nabar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Analytics from './pages/Analytics/Analytics'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const URl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : window.location.origin;

  return (
    <div>
      <ToastContainer />
      <Navbar/>
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add URl={URl}/>}/>
          <Route path='/list' element={<List URl={URl}/>}/>
          <Route path='/orders' element={<Orders URl={URl}/>}/>
          <Route path='/analytics' element={<Analytics />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
