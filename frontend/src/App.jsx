import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransactionPage';
import EditTransaction from './components/EditTransaction';
import MainLayout from './layout/MainLayout';
import Summary from './components/Summary';
import CategoryManager from './components/CategoryManager';
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
            </Routes>
            
        </Router>
    );
}

export default App;
