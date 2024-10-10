import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransactionPage';
import EditTransaction from './components/EditTransaction';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TransactionList />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
                <Route path="/edit-transaction/:id" element={<EditTransaction />} />
            </Routes>
        </Router>
    );
}

export default App;
