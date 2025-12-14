import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Layout from './components/Layout';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Stats from './pages/Stats';
import Import from './pages/Import';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="spendly-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Stats />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="import" element={<Import />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
