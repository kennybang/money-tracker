import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import axios from 'axios';

const ImportCSV = () => {
    const navigate = useNavigate();
    const [csvTransactions, setCsvTransactions] = useState([]);
    const [uncategorizedCategoryId, setUncategorizedCategoryId] = useState('');  // To store uncategorized ID

    // Fetch "Uncategorized" _id from the backend
    useEffect(() => {
        const fetchUncategorizedId = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                const uncategorized = response.data.find(cat => cat.name === 'Uncategorized');
                setUncategorizedCategoryId(uncategorized._id);  // unique ID of "Uncategorized"
            } catch (error) {
                console.error('Error fetching uncategorized _id:', error);
            }
        };

        fetchUncategorizedId();
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        Papa.parse(file, {
            //Skip the first line
            header: true,
            skipEmptyLines: true,
            beforeFirstChunk: (chunk) => {
                const lines = chunk.split('\n');
                return lines.slice(1).join('\n');
            },
            complete: (result) => {
                const parsedData = result.data.map((row) => ({
                    amount: parseFloat(row['Belopp']),
                    description: row['Beskrivning'],
                    date: row['Transaktionsdag'],
                    type: row['Belopp'] >= 0 ? 'income' : 'expense',
                    categories: [
                        {
                            categoryId: uncategorizedCategoryId,
                            amount: parseFloat(row['Belopp'])
                        }
                    ]
                }));
                setCsvTransactions(parsedData);
                console.log(parsedData);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
            }
        });
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent file from being opened on dragndrop
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileUpload({ target: { files: [file] } });
        }
    };

    const renderCsvPreview = () => (
        <div>
            <h3>CSV Transactions Preview</h3>
            <ul>
                {csvTransactions.map((transaction, index) => (
                    <li key={index}>
                        {transaction.date} - {transaction.description} - {transaction.amount} - {transaction.type}
                    </li>
                ))}
            </ul>
        </div>
    );

    const handleBulkSubmit = async () => {
        try {
            for (const transaction of csvTransactions) {
                await axios.post('http://localhost:5000/api/transactions/', transaction);
            }
            setCsvTransactions([]);  // Clear after submission
            navigate('/transaction-list');
        } catch (error) {
            console.error('Error submitting CSV transactions:', error);
        }
    };

    const handleReset = () => {
        setCsvTransactions([]);  // Clear the csvTransactions
        document.getElementById('file-input').value = ''; // Clear the file input value
    };

    return (
        <div>
            <div 
                onDragOver={handleDragOver} 
                onDrop={handleDrop} 
                onClick={() => document.getElementById('file-input').click()} 
                style={{
                    border: '2px dashed #00bbbb',
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    backgroundColor: '#fafafa',
                    margin: '20px 0'
                }}
            >
                <input 
                    id="file-input"
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} // Hide actual file input
                />
                
                {csvTransactions.length > 0 && renderCsvPreview()}
                {csvTransactions.length === 0 && 
                    <div>
                        <p>Drag and drop a file here or click to select a file</p>
                    </div>
                }
            </div>
            
            {csvTransactions.length > 0 && 
                <>
                    <button onClick={handleBulkSubmit} style={{ marginRight: '10px' }}>
                        Submit CSV Transactions
                    </button>
                    <button onClick={handleReset} style={{ marginRight: '10px' }}>
                        Reset CSV
                    </button>
                </>
            }

            <button onClick={() => navigate('/transaction-list')}>
                Back to Transaction List
            </button>
        </div>
    );
}

export default ImportCSV;
