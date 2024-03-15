import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home'; 

import AuthForm from './components/Login';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
