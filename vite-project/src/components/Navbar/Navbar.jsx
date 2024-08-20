import React from 'react'
import styles from './Navbar.module.css'
import { Link } from 'react-router-dom';


function Navbar (props) {

  return (
    <>
      <nav className={styles.navContainer}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/tree">Tree</Link>
          </li>
          <li>
            <Link to="/alerts">Alerts</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar