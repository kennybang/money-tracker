import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TransactionPage.css';
import Button from '../components/Button';

const AddTransactionPage = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('expense');
    const [categories, setCategories] = useState([{ categoryId: '', amount: '' }]);
    const [categoriesList, setCategoriesList] = useState([]);

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategoriesList(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        setCategories([...categories, { categoryId: '', amount: '' }]);
    };

    const handleCategoryChange = (index, field, value) => {
        const newCategories = [...categories];
        newCategories[index][field] = value;
        setCategories(newCategories);

        // Update the totalt Amount by summing up category Amounts
        let sum = 0;
        newCategories.forEach(category => {
            sum += parseFloat(category.amount) || 0;
        });

        setAmount(sum);

    };

    const handleCategoryIdChange = (index, value) => {
        const newCategories = [...categories];
        newCategories[index].categoryId = value;
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
            categories: categories.map(cat => ({
                categoryId: cat.categoryId,  // Store category ID instead of name
                amount: Number(cat.amount),
            })),
        };
        console.log(transaction)
        try {
            await axios.post('http://localhost:5000/api/transactions', transaction);
            setAmount('');
            setDescription('');
            setDate('');
            setCategories([{ categoryId: '', amount: '' }]);
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
                        <span className='row-text'>Description:</span>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='description'
                        />
                    </label>
                    <label className='info-row'>
                    <span className='row-text'>Amount:</span>
                    <span>{amount}</span>
                    </label>

                    <label className='info-row'>
                        <span className='row-text'>Date:</span>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                    <label className='info-row'>
                        <span className='row-text'>Type:</span>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
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
                            <select
                                value={category.categoryId}
                                onChange={(e) => handleCategoryIdChange(index, e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categoriesList.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
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
                <Button text='Add Category' onClick={handleAddCategory} />
                <div className='primary-buttons'>
                    <button className='custom-button' type="submit">Submit</button>
                    <Button text='Cancel' to={'/transaction-list'} />
                </div>
            </form>
        </div>
    );
};

export default AddTransactionPage;
