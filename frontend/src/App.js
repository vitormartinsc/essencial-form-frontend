import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Form from './Form';
import Menu from './Menu';
import LoanApply from './LoanApply';
import './App.css';
import { ReactComponent as ReguaH1 } from './assets/Barra header.svg';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 36, // Reduzido de 48 para 36
          paddingLeft: 20, // Padding menor
          paddingRight: 20,
          borderRadius: 12,
          fontSize: 15, // Reduzido de 16 para 15
          fontWeight: 'bold',
          boxSizing: 'border-box',
          '@media (max-width:600px)': {
            width: '100%',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <header className="App-header-full">
        <div className="App-header-container">
          <ReguaH1 className="App-header-ruler" />
        </div>
      </header>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
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
            <Route path="/" element={<Menu />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
