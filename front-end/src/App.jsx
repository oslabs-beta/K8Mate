import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Home from './pages/Home/Home';
import Alerts from './pages/Alerts/Alerts';
import Dashboard from './pages/Dashboard/Dashboard';
import Tree from './pages/Tree/Tree';
import Notfound from './pages/Notfound/Notfound';
import Flow from './pages/Flow/Flow';

import { ApplicationLayout } from './components/application-layout'


function App(props) {
  const [showSidebar, setShowSidebar] = useState(false);

  console.log(props)
  // Helper function to wrap a component with ApplicationLayout
  const withLayout = (Component) => {
    return (
      <ApplicationLayout showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
        <Component />
      </ApplicationLayout>
    );
  };

  return (
    <div className="App">
      <Routes>
        {/* Use the helper function to apply the layout */}
        <Route path="/" element={withLayout(Home)} />
        <Route path="/alerts" element={withLayout(Alerts)} />
        <Route path="/dashboard" element={withLayout(Dashboard)} />
        <Route path="/tree" element={withLayout(Tree)} />

        {/* TO BE REMOVED */}
        <Route path="/flow" element={withLayout(Flow)} />

        {/* Catch-all route without the layout */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  )
}

export default App

