import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import './styles/App.css';


function App() {
  return (
    <div className="App-container">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/activitypage" element={<ActivityPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
