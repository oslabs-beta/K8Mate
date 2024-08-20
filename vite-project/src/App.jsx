import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './pages/Home/Home';
import Alerts from './pages/Alerts/Alerts';
import Dashboard from './pages/Dashboard/Dashboard';
import Tree from './pages/Tree/Tree';


import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';



function App() {
  const [count, setCount] = useState(0)

  return (
    
    <div className="App">
      <Navbar/>
        <div className="content">
          <Routes>
            <>
              <Route path="/" element= {<Home />}/>
              <Route path="/alerts" element= {<Alerts />}/>
              <Route path="/dashboard" element= {<Dashboard />}/>
              <Route path="/tree" element= {<Tree />}/>
            </>
          </Routes>
        </div>
      <Footer/>
    </div>
  )
}

export default App

