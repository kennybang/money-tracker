import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionList from './pages/TransactionList';
import AddTransaction from './pages/AddTransactionPage';
import EditTransaction from './pages/EditTransaction';
import MainLayout from './layout/MainLayout';
import Summary from './pages/Summary';
import CategoryManager from './pages/CategoryManager';
import ImportCSV from './pages/ImportCSV';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout><Summary /></MainLayout>} />
                <Route path="/add-transaction" element={<MainLayout><AddTransaction /></MainLayout>} />
                <Route path="/edit-transaction/:id" element={<MainLayout><EditTransaction /></MainLayout>} />
                <Route path="/transaction-list" element={<MainLayout><TransactionList /></MainLayout>} />
                <Route path="/category-manager" element={<MainLayout><CategoryManager /></MainLayout>} />
                <Route path="/import-csv" element={<MainLayout><ImportCSV /></MainLayout>} />

            </Routes>
            
        </Router>
    );
}

export default App;
