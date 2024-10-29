import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Summary.css';
import DateFilters from '../components/DateFilters';

const Summary = () => {
    const [result, setResult] = useState({ income: 0, expense: 0 });
    const [categorySummaries, setCategorySummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('expense'); // default sorting key
    const [order, setOrder] = useState('desc'); // default sorting order

    // Fetch overall income/expense summary and category summaries
    const fetchResult = async () => {
        setLoading(true);
        setError(null);
        try {
            const resultResponse = await axios.get('http://localhost:5000/api/transactions/result', {
                params: { startDate, endDate },
            });
            setResult(resultResponse.data);

            // Fetch category summaries
            const categoryResponse = await axios.get('http://localhost:5000/api/transactions/summaries', {
                params: { startDate, endDate },
            });
            setCategorySummaries(sortedData(categoryResponse.data, sortBy, order)); // Set & sort
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch result');
            setLoading(false);
        }
    };

    // Fetch summary on mount or date change
    useEffect(() => {
        if (startDate && endDate) {
            fetchResult();
        }
    }, [startDate, endDate]);

    // Set default date range
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split('T')[0];
        setStartDate(monthAgo);
        setEndDate(today);
    }, []);

    const handleSortChange = (event) => {
        const [sort, sortOrder] = event.target.value.split('-');
        setSortBy(sort);
        setOrder(sortOrder);

        // Update category summaries on new sorting rule
        setCategorySummaries(sortedData(categorySummaries, sortBy, sortOrder));
    };

    const sortedData = (data, sortBy, order) => {
        return [...data].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (order === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    };

    // loading and error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Summary</h2>

            <DateFilters
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />

            <div className="summary-section">
                <h3>Overall</h3>
                <p>Income: {result.income}</p>
                <p>Expense: {result.expense}</p>
                <p>Result: {result.income - result.expense}</p>
            </div>

            <div className="category-summary-section">
                <h3>Category Summaries</h3>
                <select
                    name="sort"
                    id="sort"
                    onChange={handleSortChange}
                    style={{
                        fontSize: 'var(--font-size-base)',
                    }}
                >
                    <option value="expense-desc">Expense (Desc)</option>
                    <option value="expense-asc">Expense (Asc)</option>
                    <option value="income-desc">Income (Desc)</option>
                    <option value="income-asc">Income (Asc)</option>
                </select>
                {categorySummaries.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Income</th>
                                <th>Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorySummaries.map((summary, index) => (
                                <tr key={index}>
                                    <td>{summary.category}</td>
                                    <td>{summary.income}</td>
                                    <td>{summary.expense}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No category data available for the selected date range.</p>
                )}
            </div>
        </div>
    );
};

export default Summary;
