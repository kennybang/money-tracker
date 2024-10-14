import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; 
import  '../layout/MainLayout.css';


const Navbar = () => {
  return (
    <nav className="vertical-navbar">
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-class')}>Summary</NavLink>
        </li>
        <li>
          <NavLink to="/transaction-list" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-class')}>Transaction List</NavLink>
        </li>
      </ul>
    </nav>

  );
};

export default Navbar;
