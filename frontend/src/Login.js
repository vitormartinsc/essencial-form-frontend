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
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0056FF', fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Bem-vindo de volta!
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#0033ff', fontWeight: 500, textAlign: 'center', mb: 2, fontSize: 20 }}>
          Acesse sua conta para solicitar seu empréstimo de forma rápida e segura.
        </Typography>
        <Alert severity="info" sx={{ mt: 2, mb: 2, background: '#e3f2fd', color: '#0056FF', border: '1px solid #b6d4fe', fontWeight: 500, justifyContent: 'center', alignItems: 'center', textAlign: 'center', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <span>É necessário possuir um cartão de crédito válido para realizar o empréstimo.</span>
          </Box>
        </Alert>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{
              sx: { backgroundColor: '#fff', fontSize: 17, fontWeight: 500, color: '#0056FF', top: 0 },
              shrink: true
            }}
            inputProps={{ style: { height: 28, padding: '16.5px 14px', fontSize: 17 } }}
            sx={{
              mt: 2,
              mb: 1,
              '& .MuiInputBase-root': {
                height: 56,
                borderRadius: 2,
                fontSize: 17,
              },
              '& .MuiInputLabel-root': {
                top: 0,
                left: 0,
                transform: 'none',
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{
              sx: { backgroundColor: '#fff', fontSize: 17, fontWeight: 500, color: '#0056FF', top: 0 },
              shrink: true
            }}
            inputProps={{ style: { height: 28, padding: '16.5px 14px', fontSize: 17 } }}
            sx={{
              mt: 2,
              mb: 1,
              '& .MuiInputBase-root': {
                height: 56,
                borderRadius: 2,
                fontSize: 17,
              },
              '& .MuiInputLabel-root': {
                top: 0,
                left: 0,
                transform: 'none',
              },
            }}
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
            sx={{ mt: 2, backgroundColor: '#0033ff', color: '#fff', fontWeight: 'bold', borderRadius: 2, height: '48px', boxShadow: 'none', textTransform: 'none', fontSize: 18, '&:hover': { backgroundColor: '#0022aa' } }}
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