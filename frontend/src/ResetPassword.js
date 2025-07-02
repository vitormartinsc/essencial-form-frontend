import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend-production.up.railway.app';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
  const query = useQuery();
  const token = query.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reset_password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Senha redefinida com sucesso! Você pode fazer login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Não foi possível redefinir a senha.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#0056FF', fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Redefinir senha
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            sx={{ mt: 2, mb: 1 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirme a nova senha"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            sx={{ mt: 1, mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2, backgroundColor: '#0033ff', color: '#fff', fontWeight: 'bold', borderRadius: 2, height: '48px', boxShadow: 'none', textTransform: 'none', fontSize: 18, '&:hover': { backgroundColor: '#0022aa' } }}
          >
            {loading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : 'Redefinir senha'}
          </Button>
        </form>
        <Button onClick={() => navigate('/login')} sx={{ mt: 2, textTransform: 'none' }}>Voltar ao login</Button>
      </Box>
    </Container>
  );
}

export default ResetPassword;
