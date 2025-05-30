import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const response = await fetch(`${API_URL}/password_reset_request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.');
      } else {
        setError(data.error || 'Não foi possível enviar o e-mail de redefinição.');
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
          Esqueci minha senha
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Informe seu e-mail cadastrado para receber o link de redefinição de senha.
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            InputLabelProps={{
              sx: { backgroundColor: '#fff', fontSize: 17, fontWeight: 500, color: '#0056FF' },
              shrink: undefined
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
            disabled={loading}
            sx={{ mt: 2, backgroundColor: '#0033ff', color: '#fff', fontWeight: 'bold', borderRadius: 2, height: '48px', boxShadow: 'none', textTransform: 'none', fontSize: 18, '&:hover': { backgroundColor: '#0022aa' } }}
          >
            {loading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : 'Enviar link de redefinição'}
          </Button>
        </form>
        <Button onClick={() => navigate('/login')} sx={{ mt: 2, textTransform: 'none' }}>Voltar ao login</Button>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
