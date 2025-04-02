import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Admin from './pages/Admin';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
