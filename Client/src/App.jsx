import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home'; // Adjust the path based on your project structure
import Hotel from './Pages/Hotel';
import AuthForm from './components/Login';
import Culture from './Pages/Culture';
import Places from './Pages/Places';
import Food from './Pages/Food';
import Train from './Pages/Train';

const App = () => {
  return (
    <div>
       <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path ="/Culture" element={<Culture />} />
          <Route path ="/Places" element={<Places />} />
          <Route path ="/Restaurent" element={<Food />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="Hotel" element={<Hotel />} />
          <Route path="/trains" element={<Train />} />
        </Routes>
      </Router> 
      
    </div>
  );
}

export default App;
