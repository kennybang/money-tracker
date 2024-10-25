import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryManager.css';
import Button from '../components/Button';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null); // Track the category being edited
    const [editedCategory, setEditedCategory] = useState({ name: '', description: '' });
    const [newCategory, setNewCategory] = useState({ name: '', description: '' }); // New category state

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle editing a category
    const handleEditCategory = (category) => {
        setEditingCategoryId(category._id); // Set the category being edited
        setEditedCategory({ name: category.name, description: category.description });
    };

    // Save updated category
    const handleSaveCategory = async (categoryId) => {
        try {
            await axios.put(`http://localhost:5000/api/categories/${categoryId}`, editedCategory);
            setEditingCategoryId(null); // Exit editing mode
            fetchCategories(); // Refresh the list after editing
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    // delete category
    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${categoryId}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    // Handle changes in the input fields for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCategory((prev) => ({ ...prev, [name]: value }));
    };

    // Add category
    const handleAddCategory = async () => {
        try {
            await axios.post('http://localhost:5000/api/categories', newCategory);
            setNewCategory({ name: '', description: '' }); // Clear the input fields
            fetchCategories(); // Refresh the list
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    // Handle changes in the input fields for adding
    const handleNewCategoryChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h2>Category Manager</h2>
            <div>
                <h4>Add New Category</h4>
                <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    className="inline-input"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Category Description"
                    value={newCategory.description}
                    onChange={handleNewCategoryChange}
                    className="inline-input"
                />
                <Button text='Add Category' onClick={handleAddCategory} />
            </div>
            <h4>Categories</h4>
            <ul className='category-list'>
                {categories.map((category) => (
                    <li key={category._id} className="category-item">
                        {editingCategoryId === category._id ? (
                            <>
                                {/* Input fields to edit the category */}
                                <input
                                    type="text"
                                    name="name"
                                    value={editedCategory.name}
                                    onChange={handleInputChange}
                                    className="inline-input"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={editedCategory.description}
                                    onChange={handleInputChange}
                                    className="inline-input"
                                />
                                <Button text='Save' onClick={() => handleSaveCategory(category._id)} />
                                <Button text='Cancel' onClick={() => setEditingCategoryId(null)} />
                            </>
                        ) : (
                            <>
                                {/* Display the category details */}
                                <span className="inline-text"><strong>{category.name}:</strong></span>
                                <span className="inline-text">{category.description}</span>
                                {category.name !== 'Uncategorized' && (
                                    <>
                                        {/* Conditionally render Edit and Delete buttons only if the category is not "Uncategorized" */}
                                        <Button text='Edit' onClick={() => handleEditCategory(category)} />
                                        <Button text='Delete' onClick={() => handleDeleteCategory(category._id)} />
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryManager;
