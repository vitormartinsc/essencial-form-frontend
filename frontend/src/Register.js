import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';
console.log(API_URL);
function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Máscara para telefone celular brasileiro
  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  }

  // Validação simples de email
  function isValidEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone) newErrors.phone = 'Celular/WhatsApp é obrigatório';
    else if (formData.phone.replace(/\D/g, '').length <= 10) newErrors.phone = 'Celular deve ter 11 dígitos';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 8) newErrors.password = 'A senha deve ter no mínimo 8 caracteres';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirme sua senha';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email, // username obrigatório para o backend
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });
      const data = await response.json();
      if (data.message) {
        // Login automático via JWT após registro
        const tokenRes = await fetch(`${API_URL}/api/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.email,
            password: formData.password
          })
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          localStorage.setItem('accessToken', tokenData.access);
          localStorage.setItem('refreshToken', tokenData.refresh);
          navigate('/form');
        } else {
          alert('Cadastro realizado, mas não foi possível autenticar automaticamente. Faça login.');
          navigate('/login');
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Preencha seus dados
        </Typography>
        <Alert severity="warning" sx={{ mt: 2 }}>
          É necessário possuir um cartão de crédito para realizar o empréstimo.
        </Alert>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nome completo"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
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
            label="Celular/WhatsApp"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone || 'Formato: (99) 99999-9999'}
            inputProps={{ maxLength: 15, style: { height: 48, padding: '16.5px 14px', fontSize: 17 } }}
            InputLabelProps={{
              sx: { backgroundColor: '#fff', fontSize: 17, fontWeight: 500, color: '#0056FF' },
              shrink: undefined // permite o label flutuar normalmente
            }}
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
            error={!!errors.password}
            helperText={errors.password || 'Mínimo 8 caracteres'}
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
            label="Confirme a senha"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, backgroundColor: '#0033ff', color: '#fff', fontWeight: 'bold', borderRadius: 2, height: '48px', boxShadow: 'none', textTransform: 'none', fontSize: 18, alignSelf: 'center', '&:hover': { backgroundColor: '#0022aa' } }}
          >
            Continuar
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'black' }}>
          Já possui uma conta? <Link href="/login">Faça login!</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Register;