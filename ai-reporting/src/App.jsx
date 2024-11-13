import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResultsPage from './pages/ResultsPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ResultsPage />} />
    </Routes>
  </Router>
);

export default App;
