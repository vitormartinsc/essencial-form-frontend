import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Solicita o token JWT
      const tokenResponse = await fetch(`${API_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.email, password: formData.password }),
      });
      const tokenData = await tokenResponse.json();
      if (tokenData.access) {
        localStorage.setItem('accessToken', tokenData.access);
        localStorage.setItem('refreshToken', tokenData.refresh);
        navigate('/menu');
      } else {
        alert(tokenData.detail || 'Credenciais inválidas');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Preencha seus dados
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          É necessário possuir um cartão de crédito para realizar o empréstimo.
        </Alert>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link href="#" underline="hover" sx={{ fontSize: 14 }} onClick={() => alert('Funcionalidade de recuperação de senha em breve!')}>
              Esqueci minha senha
            </Link>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Continuar
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'black' }}>
          Não possui uma conta? <Link href="/">Cadastre-se!</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;