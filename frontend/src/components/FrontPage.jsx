import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TransactionList from './components/TransactionList';
//import './FrontPage.css'; 

const FrontPage = () => {



    return (
        <div>
            <div className='list'>
                <TransactionList />
            </div>
            <div className='summary'>

            </div>
        </div>
    );
    
};

export default FrontPage;
