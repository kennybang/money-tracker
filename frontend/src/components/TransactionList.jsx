import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TransactionList.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch transactions from the backend
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transactions');
            setTransactions(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch transactions');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Transaction List</h2>
            <Link to="/add-transaction">
                <button>Add Transaction</button>
            </Link>
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
                    {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.type}</td>
                            <td>
                                <div>
                                    {transaction.categories.map((category, index) => (
                                        <div key={index}>
                                            {category.name}: {category.amount}
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
