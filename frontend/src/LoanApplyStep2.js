import React from 'react';
import { Container, Typography, TextField, Box } from '@mui/material';

// Função para formatar o número do cartão
const formatCardNumber = (value) => {
  const onlyDigits = value.replace(/\D/g, ''); // Remove caracteres não numéricos
  return onlyDigits
    .slice(0, 16) // Limita a 16 dígitos
    .replace(/(.{4})/g, '$1 ') // Adiciona espaços a cada 4 dígitos
    .trim();
};

// Função para formatar o nome impresso no cartão
const formatCardName = (value) => {
  return value.toUpperCase(); // Converte para letras maiúsculas
};

// Função para formatar a data de vencimento do cartão
const formatCardExpiry = (value) => {
  const onlyDigits = value.replace(/\D/g, ''); // Remove caracteres não numéricos
  return onlyDigits
    .slice(0, 4) // Limita a 4 dígitos
    .replace(/(\d{2})(\d)/, '$1/$2'); // Adiciona a barra no formato MM/AA
};

// Função para detectar a bandeira do cartão
const detectCardBrand = (cardNumber) => {
  const firstDigits = cardNumber.replace(/\D/g, '').slice(0, 6); // Pega os 6 primeiros dígitos
  if (/^4/.test(firstDigits)) return 'visa';
  if (/^5[1-5]/.test(firstDigits)) return 'mastercard';
  if (/^3[47]/.test(firstDigits)) return 'amex';
  if (/^6(?:011|5)/.test(firstDigits)) return 'discover';
  if (/^3(?:0[0-5]|[68])/.test(firstDigits)) return 'diners';
  if (/^35/.test(firstDigits)) return 'jcb';
  if (/^636/.test(firstDigits)) return 'elo';
  if (/^38|^60/.test(firstDigits)) return 'hipercard';
  return 'generic'; // Caso não corresponda a nenhuma bandeira
};

// Validation logic for required fields
export function validateLoanStep2(formData) {
  const errors = {};
  if (!formData.cardNumber) errors.cardNumber = 'Campo obrigatório';
  if (!formData.cardName) errors.cardName = 'Campo obrigatório';
  if (!formData.cardExpiry) errors.cardExpiry = 'Campo obrigatório';
  return errors;
}

const LoanApplyStep2 = ({ formData, setFormData, showValidationErrors, errors = {} }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="body2" gutterBottom>
        Informe os números, validade e nome impresso do seu cartão, respectivamente:
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: '320px',
            height: '200px',
            background: 'linear-gradient(135deg, #0056FF, #003D99)', // Gradiente azul
            color: '#fff',
            borderRadius: '15px', // Bordas arredondadas
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Sombra para dar profundidade
            position: 'relative',
          }}
        >
          {/* Chip do cartão */}
          <Box
            sx={{
              width: '50px',
              height: '35px',
              backgroundColor: '#ccc',
              borderRadius: '5px',
              position: 'absolute',
              top: '20px',
              left: '20px',
            }}
          />

          {/* Logo da bandeira */}
          <Box
            sx={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#fff', // Fundo branco para a logo
              borderRadius: '50%', // Deixa o fundo arredondado
              padding: '5px', // Espaçamento interno para a logo
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Sombra para destacar a logo
            }}
          >
            {formData.cardBrand && formData.cardBrand !== 'generic' ? (
              <img
                src={require(`./assets/${formData.cardBrand.toLowerCase().replace(' ', '_')}.svg`)}
                alt={formData.cardBrand}
                style={{ width: '40px', height: 'auto' }}
              />
            ) : (
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#fff', // Fundo branco
                  borderRadius: '50%',
                }}
              />
            )}
          </Box>

          {/* Número do cartão */}
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              letterSpacing: '0.2em',
              fontSize: '1.4rem',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '60px',
            }}
          >
            {(formData.cardNumber.replace(/\D/g, '').padEnd(16, '•')
              .replace(/(.{4})/g, '$1 ')
              .trim()) || '•••• •••• •••• ••••'}
          </Typography>

          {/* Nome do titular e validade */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Typography variant="body2" sx={{ color: '#fff', textTransform: 'uppercase' }}>
              {formData.cardName || 'NOME IMPRESSO'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              {formData.cardExpiry || 'MM/AA'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <TextField
        fullWidth
        label="Número do cartão"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={(e) => {
          const value = formatCardNumber(e.target.value);
          const brand = detectCardBrand(value);
          setFormData((prev) => ({ ...prev, cardNumber: value, cardBrand: brand }));
        }}
        margin="normal"
        inputProps={{ maxLength: 19 }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }} // Fundo branco para o rótulo
        autoComplete="off"
        error={!!errors.cardNumber}
        helperText={errors.cardNumber}
      />
      <TextField
        fullWidth
        label="Nome impresso"
        name="cardName"
        value={formData.cardName}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, cardName: formatCardName(e.target.value) }));
        }}
        margin="normal"
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        error={!!errors.cardName}
        helperText={errors.cardName}
      />
      <TextField
        fullWidth
        label="MM/AA"
        name="cardExpiry"
        value={formData.cardExpiry}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, cardExpiry: formatCardExpiry(e.target.value) }));
        }}
        margin="normal"
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        error={!!errors.cardExpiry}
        helperText={errors.cardExpiry}
      />
    </Container>
  );
};

export default LoanApplyStep2;
