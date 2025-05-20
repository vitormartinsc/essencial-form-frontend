import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Form from './Form';
import Menu from './Menu';
import LoanApply from './LoanApply';
import './App.css';
import { ReactComponent as ReguaH1 } from './assets/Barra header.svg';

function App() {
  return (
    <>
      <header className="App-header-full">
        <div className="App-header-container">
          <ReguaH1 className="App-header-ruler" />
        </div>
      </header>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/form" element={<Form />} />
            <Route path="/menu" element={<Menu onNavigate={(view) => {
              if (view === 'dadosPessoais') {
                window.location.href = '/form';
              } else if (view === 'solicitarEmprestimo') {
                window.location.href = '/loan-apply';
              } else {
                console.log(`Navigate to: ${view}`);
              }
            }} />} />
            <Route path="/loan-apply" element={<LoanApply />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
