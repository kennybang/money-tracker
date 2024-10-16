import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Summary.css';
import DateFilters from './DateFilters';

const Summary = () => {
    const [result, setResult] = useState({ income: 0, expense: 0 });
    const [categorySummaries, setCategorySummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
            setCategorySummaries(categoryResponse.data);
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
