import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0056FF', fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Bem-vindo de volta!
        </Typography>

        <Alert severity="info" sx={{ mt: 2, mb: 2, background: '#e3f2fd', color: '#0056FF', border: '1px solid #b6d4fe', fontWeight: 500, textAlign: 'left', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
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
              sx: { backgroundColor: '#fff', fontSize: 17, fontWeight: 500, color: '#0056FF' },
              shrink: undefined // permite o label flutuar normalmente
            }}
            inputProps={{ style: { height: 48, padding: '16.5px 14px', fontSize: 17 } }}
            sx={{
              mt: 2,
              mb: 1,
              '& .MuiInputBase-root': {
                height: 56,
                borderRadius: 2,
                fontSize: 17,
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
              sx: { backgroundColor: '#fff', fontSize: 17, fontWeight: 500, color: '#0056FF' },
              shrink: undefined // permite o label flutuar normalmente
            }}
            inputProps={{ style: { height: 48, padding: '16.5px 14px', fontSize: 17 } }}
            sx={{
              mt: 2,
              mb: 1,
              '& .MuiInputBase-root': {
                height: 56,
                borderRadius: 2,
                fontSize: 17,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Link href="#" underline="hover" sx={{ fontSize: 14 }} onClick={e => { e.preventDefault(); navigate('/forgot-password'); }}>
              Esqueci minha senha
            </Link>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2, backgroundColor: '#0033ff', color: '#fff', fontWeight: 'bold', borderRadius: 2, height: '48px', boxShadow: 'none', textTransform: 'none', fontSize: 18, '&:hover': { backgroundColor: '#0022aa' } }}
          >
            {loading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : 'Continuar'}
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'black' }}>
          Não possui uma conta?{' '}
          <Link href="#" onClick={e => { e.preventDefault(); navigate('/register'); }}>
            Cadastre-se!
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;