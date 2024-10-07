const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  categories: [
    {
      name: {
        type: String,  //"Food", "Transport"
        required: true,
      },
      amount: {
        type: Number, 
        required: true,
      },
    },
  ],
  description: {
    type: String,  // Optional description
  },
  date: {
    type: Date,
    required: true,  // Date of the transaction
  },
  type: {
    type: String,
    enum: ['income', 'expense'],  // 'income' or 'expense'
    required: true,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
