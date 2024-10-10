const Transaction = require('../models/transaction');

// Create a Transaction
exports.createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Read all Transactions
exports.getTransactions = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let filter = {};

        // If both startDate and endDate are provided, filter by date range
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Fetch transactions with the applied filter (date range or no filter)
        const transactions = await Transaction.find(filter);
        
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Read a specific Transaction
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
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
    try {
        const summaries = await Transaction.aggregate([
            {
                $unwind: "$categories"  // UNWIND categories array
            },
            {
                $group: {
                    _id: {
                        category: "$categories.name",
                        type: "$type"  // 'type' field for income or expense
                    },
                    total: { $sum: "$amount" }  // Sum the amounts per category
                }
            },
            {
                $group: {
                    _id: "$_id.category",  // Group by category
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
                    category: "$_id",
                    income: 1,
                    expense: 1,
                    _id: 0
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
