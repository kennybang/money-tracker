import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './TransactionPage.css';

const EditTransaction = () => {
    const [transaction, setTransaction] = useState({
        amount: '',
        categories: [{ categoryId: '', amount: '' }], // Updated to use categoryId
        description: '',
        date: '',
        type: 'expense', // Default type
    });
    const [allCategories, setAllCategories] = useState([]); // To store fetched categories
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    // Fetch categories and transaction data on component mount
    useEffect(() => {
        const fetchTransactionAndCategories = async () => {
            try {
                const categoryResponse = await axios.get('http://localhost:5000/api/categories'); // Fetch all categories
                setAllCategories(categoryResponse.data);

                const transactionResponse = await axios.get(`http://localhost:5000/api/transactions/${id}`);
                setTransaction(transactionResponse.data);
            } catch (err) {
                setError('Failed to fetch transaction or category data');
            }
        };

        fetchTransactionAndCategories();
    }, [id]);

    // Handle changes in the transaction form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction((prev) => ({ ...prev, [name]: value }));
    };

    // Handle category changes
    const handleCategoryChange = (index, field, value) => {
        const newCategories = [...transaction.categories];
        newCategories[index] = { ...newCategories[index], [field]: value };
        setTransaction((prev) => ({ ...prev, categories: newCategories }));
    };

    // Add a new category row
    const addCategory = () => {
        setTransaction((prev) => ({
            ...prev,
            categories: [...prev.categories, { categoryId: '', amount: '' }],
        }));
    };

    // Delete a category row
    const handleDeleteCategory = (index) => {
        if (transaction.categories.length > 1) {
            const newCategories = transaction.categories.filter((_, i) => i !== index);
            setTransaction((prev) => ({ ...prev, categories: newCategories }));
        } else {
            alert("You must have at least one category.");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTransaction = {
        amount: Number(transaction.amount),
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
        categories: transaction.categories.map(cat => ({
            categoryId: cat.categoryId._id, // Only include the ID here
            amount: Number(cat.amount),
        })),
    };

    console.log(updatedTransaction); // Log the transaction object

    try {
        await axios.put(`http://localhost:5000/api/transactions/${id}`, updatedTransaction);
        navigate('/transaction-list');
    } catch (err) {
        console.error('Error updating transaction:', err.response.data); // Log the error response
        setError('Failed to update transaction');
    }
};


    // Handle transaction deletion
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:5000/api/transactions/${id}`);
                navigate('/transaction-list'); // Redirect after deletion
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
                <div className='transaction-info'>
                    <label className='info-row'>
                        <label>Amount:</label>
                        <input
                            type="number"
                            name="amount"
                            value={transaction.amount}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className='info-row'>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={transaction.description}
                            onChange={handleChange}
                        />
                    </label>
                    <label className='info-row'>
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={transaction.date.split('T')[0]} // Format for date input
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className='info-row'>
                        <label>Type:</label>
                        <select name="type" value={transaction.type} onChange={handleChange}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </label>
                </div>
                <h4>Categories</h4>
                <div className="categories-container">
                    <div className="category-row header">
                        <span>Category</span>
                        <span>Amount</span>
                    </div>
                    {transaction.categories.map((category, index) => (
                        <div className="category-row" key={index}>
                            <select
                                name="categoryId"
                                value={category.categoryId._id}

                                onChange={(e) => handleCategoryChange(index, 'categoryId', e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {allCategories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                name="amount"
                                value={category.amount}
                                onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                                required
                            />
                            {transaction.categories.length > 1 && (
                                <button type="button" onClick={() => handleDeleteCategory(index)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addCategory}>Add Category</button>
                <button type="submit">Update Transaction</button>
            </form>
            <button onClick={() => navigate('/transaction-list')}>Cancel</button> {/* Back/Cancel button */}
            <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Delete Transaction</button> {/* Delete button */}
        </div>
    );
};

export default EditTransaction;
