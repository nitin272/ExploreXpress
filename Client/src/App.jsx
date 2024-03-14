import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './components/Login';


const App = () => {
  return (
    <div>
    <AuthForm />
    </div>
  );
}

export default App;
