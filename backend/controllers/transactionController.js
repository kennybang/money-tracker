const Transaction = require('../models/transaction');
const Category = require('../models/category');

// Create a Transaction
exports.createTransaction = async (req, res) => {
    try {
        const { amount, description, date, type, categories } = req.body;

        // Ensure each category has a valid categoryId and amount
        const validCategories = categories.every(cat => cat.categoryId && cat.amount);

        if (!validCategories) {
            return res.status(400).json({ message: 'Invalid categories data' });
        }

        const newTransaction = new Transaction({
            amount,
            description,
            date,
            type,
            categories
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Read all Transactions (with optional date filtering and sorting)
exports.getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, sortBy = 'date', order = 'desc' } = req.query;

        let query = {}; // Default is no filtering

        // Apply date filtering if both startDate and endDate are provided
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Sort direction (1 for ascending, -1 for descending)
        const sortDirection = order === 'asc' ? 1 : -1;
        
        // Use `sortBy` and `sortDirection` to sort the transactions
        const transactions = await Transaction.find(query)
            .populate('categories.categoryId')
            .sort({ [sortBy]: sortDirection }); // Dynamic sort field and direction

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};



// Fetch a single transaction
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('categories.categoryId', 'name'); // Populating categoryId with category name
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const updatedTransactionData = req.body;

        // Fetch categories and include their details
        const categories = await Promise.all(
            updatedTransactionData.categories.map(async (cat) => {
                const category = await Category.findById(cat.categoryId); // Use categoryId
                if (!category) {
                    throw new Error(`Category with ID ${cat.categoryId} not found`);
                }
                return { categoryId: category, amount: cat.amount }; // Return the full category object
            })
        );

        // Update the transaction with the full categories
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            {
                ...updatedTransactionData,
                categories, // Use the full categories array
            },
            { new: true } // Return the updated transaction
        );

        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategorySummaries = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide both startDate and endDate' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const summaries = await Transaction.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end }  // Filter transactions by date range
                }
            },
            {
                $unwind: "$categories"  // Unwind categories array
            },
            {
                $lookup: {
                    from: "categories", // Use the categories collection
                    localField: "categories.categoryId",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"  // Unwind the resulting categoryDetails array
            },
            {
                $group: {
                    _id: {
                        category: "$categoryDetails.name", // Group by the category name
                        type: "$type"  // Group by income/expense
                    },
                    total: { $sum: "$categories.amount" }  // Sum the category amounts
                }
            },
            {
                $group: {
                    _id: "$_id.category",  // Group by category name
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    category: "$_id",  // Project the category name
                    income: 1,
                    expense: 1,
                    _id: 0  // Exclude the _id field
                }
            }
        ]);

        res.json(summaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get sum of incomes and expenses within a date range
exports.getResult = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Validate dates
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide both startDate and endDate' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // MongoDB AGGRERGATION to filter by date and calculate sums
        const result = await Transaction.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end }  // Match transactions between the dates
                }
            },
            {
                $group: {
                    _id: "$type",  // Group by 'type' (income or expense)
                    totalAmount: { $sum: "$amount" }  // Sum the 'amount' field for each type
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        // Assign values for income and expense
        result.forEach(group => {
            if (group._id === 'income') {
                income = group.totalAmount;
            } else if (group._id === 'expense') {
                expense = group.totalAmount;
            }
        });

        // Return the totals
        res.json({ income, expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
