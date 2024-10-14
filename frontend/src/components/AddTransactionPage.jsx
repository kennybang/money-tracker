import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TransactionPage.css';

const AddTransactionPage = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('expense');
    const [categories, setCategories] = useState([{ name: '', amount: '' }]);

    const handleAddCategory = () => {
        setCategories([...categories, { name: '', amount: '' }]);
    };

    const handleCategoryChange = (index, field, value) => {
        const newCategories = [...categories];
        newCategories[index][field] = value;
        setCategories(newCategories);
    };

    const handleDeleteCategory = (index) => {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const transaction = {
            amount: Number(amount),
            description,
            date,
            type,
            categories,
        };

        try {
            await axios.post('http://localhost:5000/api/transactions', transaction);
            setAmount('');
            setDescription('');
            setDate('');
            setCategories([{ name: '', amount: '' }]);
            navigate('/transaction-list');
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <div>
            <h2>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
                <div className='transaction-info'>
                    <label className='info-row'>
                        Amount:
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </label>
                    <label className='info-row'>
                        Description:
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <label className='info-row'>
                        Date:
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </label>
                    <label className='info-row'>
                        Type:
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </label>
                </div>
                <h3>Categories</h3>
                <div className="categories-container">
                    <div className="category-row header">
                        <span>Category</span>
                        <span>Amount</span>
                    </div>
                    {categories.map((category, index) => (
                        <div className="category-row" key={index}>
                            <input
                                type="text"
                                value={category.name}
                                onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                                required
                                placeholder="Category Name"
                            />
                            <input
                                type="number"
                                value={category.amount}
                                onChange={(e) => handleCategoryChange(index, 'amount', e.target.value)}
                                required
                                placeholder="Amount"
                            />
                            {categories.length > 1 && (
                                <button type="button" onClick={() => handleDeleteCategory(index)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" onClick={handleAddCategory}>
                    Add Category
                </button>
                <button type="submit">Submit</button>
            </form>
            <button onClick={() => navigate('/transaction-list')}>Back to Transaction List</button>
        </div>
    );
};

export default AddTransactionPage;
