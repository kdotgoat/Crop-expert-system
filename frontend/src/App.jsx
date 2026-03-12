import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiagnosisPage from './pages/diagnosisPage.jsx';
import AdminPage from './pages/adminPage.jsx';
import './styles/components.css';

export default function App() {
  return (
    <Router>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans selection:bg-green-200 dark:selection:bg-green-700 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<DiagnosisPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}