require('dotenv').config();

const transactionController = require('./controllers/transactionController');
const categoryController = require('./controllers/categoryController');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Category = require('./models/category'); // Import Category model

const app = express();
const PORT = process.env.PORT || 5000; //fallback option
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker'; //fallback option

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    
    // Initialize the 'uncategorized' category after connecting to MongoDB
    await initializeUncategorizedCategory();

    // Start the server after category initialization
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error(err));

// Transaction Routes
app.get('/api/transactions/result', transactionController.getResult);
app.get('/api/transactions/summaries', transactionController.getCategorySummaries);
app.post('/api/transactions', transactionController.createTransaction);
app.get('/api/transactions', transactionController.getTransactions);
app.get('/api/transactions/:id', transactionController.getTransactionById);
app.put('/api/transactions/:id', transactionController.updateTransaction);
app.delete('/api/transactions/:id', transactionController.deleteTransaction);

app.get('/api/categories', categoryController.getCategories);
app.post('/api/categories', categoryController.addCategory);
app.put('/api/categories/:id', categoryController.updateCategory);
app.delete('/api/categories/:id', categoryController.deleteCategory);

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Expense Tracker API');
});

// Function to initialize the uncategorized category
const initializeUncategorizedCategory = async () => {
  const uncategorizedExists = await Category.findOne({ name: 'uncategorized' });
  if (!uncategorizedExists) {
    const uncategorizedCategory = new Category({
      name: 'Uncategorized',
    });
    await uncategorizedCategory.save();
    console.log('Uncategorized category created');
  } else {
    console.log('Uncategorized category already exists');
  }
};
