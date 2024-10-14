import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Summary.css'; 

const Summary = () => {
    const [result, setResult] = useState({ income: 0, expense: 0 });
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);

    // Set default dates to the current month
    const getDefaultStartDate = () => {
        const date = new Date();
        date.setDate(1); // First day of the month
        return date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
    };

    const getDefaultEndDate = () => {
        const date = new Date();
        return date.toISOString().split('T')[0]; // Today's date
    };

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(getDefaultEndDate());

    // Fetch summary when startDate or endDate changes
    const fetchResult = async () => {
        if (!startDate || !endDate) {
            setError('Please provide both start and end dates');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/result`, {
                params: { startDate, endDate },
            });
            setResult(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch result');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResult();
    }, [startDate, endDate]);

    return (
        <>
            <div className="summary-container">
                <h2>Summary</h2>
                
                <div className="date-range">
                    <label>
                        Start Date:
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            required
                        />
                    </label>
                    <label>
                        End Date:
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            required
                        />
                    </label>
                </div>

                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}

                {!loading && !error && (
                    <>
                        <div className="summary-item">
                            <span>Income: </span>
                            <span>{result.income}</span>
                        </div>
                        <div className="summary-item">
                            <span>Expense: </span>
                            <span>{result.expense}</span>
                        </div>
                        <div className="summary-item">
                            <span>Result: </span>
                            <span>{result.income - result.expense}</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Summary;
