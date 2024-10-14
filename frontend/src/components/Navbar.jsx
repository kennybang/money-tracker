import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; 
import  '../layout/MainLayout.css';


const Navbar = () => {
  return (
    <nav className="vertical-navbar">
      <ul>
        <li>
          <NavLink to="/" activeClassName="active-link">Summary</NavLink>
        </li>
        <li>
          <NavLink to="/transaction-list" activeClassName="active-link">Transaction List</NavLink>
        </li>
      </ul>
    </nav>

  );
};

export default Navbar;
