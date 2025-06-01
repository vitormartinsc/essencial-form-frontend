import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link, Alert, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';
console.log(API_URL);
function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [step, setStep] = useState(1); // NOVO: controla a etapa do registro
  const [loading, setLoading] = useState(false);
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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone) newErrors.phone = 'Celular/WhatsApp é obrigatório';
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Celular deve ter o DDD mais, pelo menos, 8 dígitos';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 8) newErrors.password = 'A senha deve ter no mínimo 8 caracteres';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirme sua senha';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    return newErrors;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // Envia os dados parciais para o backend
      const response = await fetch(`${API_URL}/register/step1/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
      } else {
        // Exibe erro retornado pelo backend
        setErrors({ api: data.error || 'Erro ao validar dados. Tente novamente.' });
      }
    } catch (error) {
      setErrors({ api: 'Erro de conexão com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyCheckbox = (e) => setAcceptedPrivacy(e.target.checked);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStep2();
    if (!acceptedPrivacy) {
      validationErrors.acceptedPrivacy = 'É necessário aceitar a Política de Privacidade para continuar.';
    }
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
          navigate('/form', { replace: true }); // Usando replace para HashRouter
        } else {
          alert('Cadastro realizado, mas não foi possível autenticar automaticamente. Faça login.');
          navigate('/login', { replace: true }); // Usando replace para HashRouter
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
        <Alert severity="info" sx={{ mt: 2, mb: 2, background: '#e3f2fd', color: '#0056FF', border: '1px solid #b6d4fe', fontWeight: 500, textAlign: 'left', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
            <span>É necessário possuir um cartão de crédito com limite disponível para realizar o empréstimo.</span>
          </Box>
        </Alert>
        <form onSubmit={step === 1 ? handleNext : handleSubmit}>
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
          {step === 2 && (
            <>
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptedPrivacy}
                    onChange={handlePrivacyCheckbox}
                    color="primary"
                  />
                }
                label={<span>Li e aceito a <span style={{color:'#0056FF', cursor:'pointer', textDecoration:'underline'}} onClick={()=>setPrivacyOpen(true)}>Política de Privacidade</span></span>}
                sx={{ mt: 2, mb: 1 }}
              />
              {errors.acceptedPrivacy && (
                <Typography variant="caption" color="error">{errors.acceptedPrivacy}</Typography>
              )}
            </>
          )}
          <Dialog open={privacyOpen} onClose={()=>setPrivacyOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{fontWeight:700, color:'#0056FF'}}>Política de Privacidade – Essencial</DialogTitle>
            <DialogContent dividers sx={{maxHeight: '60vh'}}>
              <Typography variant="body2" sx={{whiteSpace:'pre-line'}}>
<strong>Bem-vindo à Essencial!</strong>

Sua privacidade é muito importante para nós. Por isso, queremos explicar de forma clara e transparente como tratamos seus dados:

<strong>Coleta e Uso de Dados</strong>
• Coletamos apenas as informações necessárias para oferecer nossos serviços e melhorar sua experiência.
• Seus dados são usados exclusivamente para cadastro, contato, análise de crédito e obrigações legais.

<strong>Segurança</strong>
• Armazenamos seus dados com segurança e adotamos medidas para protegê-los contra acessos não autorizados.
• Não compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei.

<strong>Seus Direitos</strong>
• Você pode solicitar a qualquer momento acesso, correção ou exclusão dos seus dados.
• Para dúvidas ou solicitações, entre em contato conosco pelo nosso canal de atendimento.

<strong>Cookies</strong>
• Utilizamos cookies para melhorar sua navegação, personalizar conteúdo e analisar o uso do site.
• Você pode desativar os cookies nas configurações do seu navegador, mas isso pode limitar algumas funcionalidades.

<strong>Compromisso do Usuário</strong>
• Utilize nossos serviços de forma ética, respeitando a legislação e os direitos de terceiros.

Esta política pode ser atualizada periodicamente. Recomendamos que você revise este documento sempre que utilizar nossos serviços.

<strong>Essencial – Cuidando da sua privacidade em cada etapa!</strong>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>setPrivacyOpen(false)} color="primary">Fechar</Button>
            </DialogActions>
          </Dialog>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="primary">Carregando...</Typography>
            </Box>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2, backgroundColor: '#0033ff', color: '#fff', fontWeight: 'bold', borderRadius: 2, height: '48px', boxShadow: 'none', textTransform: 'none', fontSize: 18, alignSelf: 'center', '&:hover': { backgroundColor: '#0022aa' } }}
          >
            {loading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : (step === 1 ? 'Próximo' : 'Continuar')}
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