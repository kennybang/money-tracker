const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    description: String,
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    categories: [{
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to the Category model
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        }
    }]
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
