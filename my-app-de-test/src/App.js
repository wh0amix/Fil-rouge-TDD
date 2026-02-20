import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UsersProvider } from './UsersContext';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  return (
    <UsersProvider>
      <Router basename={process.env.PUBLIC_URL} future={{ v7_startTransition: true }}>
        <nav className="navbar">
          <Link to="/" className="nav-home" data-cy="nav-home">Accueil</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </UsersProvider>
  );
}

export default App;
