import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="reports" element={<div className="p-8">Reports (Coming Soon)</div>} />
          <Route path="insights" element={<div className="p-8">Insights (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-8">Settings (UI Only)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
