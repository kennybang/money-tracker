import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TransactionList.css';
import DateFilters from './DateFilters';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    // Fetch transactions from the backend
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transactions',
                {
                    params: { startDate, endDate },
                });
            setTransactions(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch transactions');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    // Set default date range
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split('T')[0];
        setStartDate(monthAgo);
        setEndDate(today);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const filteredTransactions = transactions.filter(transaction => {
        // Search description
        const matchesDescription = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Search amount 
        const matchesAmount = transaction.amount.toString().includes(searchQuery);

        // Search category 
        const matchesCategory = transaction.categories.some(category =>
            category.categoryId.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return matchesDescription || matchesAmount || matchesCategory;
    });


    return (
        <div>
            <h2>Transaction List</h2>
            <Link to="/add-transaction">
                <button>Add Transaction</button>
            </Link>
            <DateFilters
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />
            <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Categories</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.type}</td>
                            <td>
                                <div>
                                    {transaction.categories.map((category, index) => (
                                        <div key={index}>
                                            {category.categoryId.name}: {category.amount}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <Link to={`/edit-transaction/${transaction._id}`}>
                                    <button>Edit</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default TransactionList;
