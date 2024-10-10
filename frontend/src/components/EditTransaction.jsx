import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditTransaction = () => {
    const [transaction, setTransaction] = useState({
        amount: '',
        categories: [{ name: '', amount: '' }],
        description: '',
        date: '',
        type: 'expense', // Default type
    });
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/transactions/${id}`);
                setTransaction(response.data);
            } catch (err) {
                setError('Failed to fetch transaction data');
            }
        };

        fetchTransaction();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (index, e) => {
        const { name, value } = e.target;
        const newCategories = [...transaction.categories];
        newCategories[index] = { ...newCategories[index], [name]: value };
        setTransaction((prev) => ({ ...prev, categories: newCategories }));
    };

    const addCategory = () => {
        setTransaction((prev) => ({
            ...prev,
            categories: [...prev.categories, { name: '', amount: '' }],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/transactions/${id}`, transaction);
            navigate('/');
        } catch (err) {
            setError('Failed to update transaction');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:5000/api/transactions/${id}`);
                navigate('/'); // Redirect to the transaction list after deletion
            } catch (err) {
                setError('Failed to delete transaction');
            }
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Edit Transaction</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={transaction.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={transaction.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={transaction.date.split('T')[0]} // Formatting for input
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select name="type" value={transaction.type} onChange={handleChange}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <h4>Categories</h4>
                {transaction.categories.map((category, index) => (
                    <div key={index}>
                        <label>Category Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={category.name}
                            onChange={(e) => handleCategoryChange(index, e)}
                            required
                        />
                        <label>Amount:</label>
                        <input
                            type="number"
                            name="amount"
                            value={category.amount}
                            onChange={(e) => handleCategoryChange(index, e)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addCategory}>Add Category</button>
                <button type="submit">Update Transaction</button>
            </form>
            <button onClick={() => navigate('/')}>Cancel</button> {/* Back/Cancel button */}
            <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Delete Transaction</button> {/* Delete button */}
        </div>
    );
};

export default EditTransaction;
