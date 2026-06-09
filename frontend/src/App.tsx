import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard.tsx';
import Sidebar from './components/sidebar/sidebar.tsx';
import Login from './pages/login/Login.tsx';
import Register from './pages/register/Register.tsx';
import Landing from './pages/landing/Landing.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sidebar" element={<Sidebar isCollapsed={false} onToggle={() => {}} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;