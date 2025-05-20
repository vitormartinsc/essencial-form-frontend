import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Box, MenuItem, InputAdornment } from '@mui/material';
import { Info } from '@mui/icons-material';

const LoanApplyStep1 = ({ formData, setFormData, loanAmountError, setLoanAmountError, showValidationErrors, errors = {} }) => {
  const calcularLimite = (valorSolicitado, parcelas) => {
    const taxas = {
      1: 23.00, 2: 66.86, 3: 68.93, 4: 70.48, 5: 71.00,
      6: 71.48, 7: 71.78, 8: 72.24, 9: 72.62, 10: 72.90,
      11: 73.25, 12: 73.64, 13: 75.11, 14: 77.80, 15: 78.50,
      16: 80.80, 17: 81.90, 18: 83.60
    };

    const taxa = taxas[parcelas] || 0;
    return (valorSolicitado * (1 + taxa / 100)).toFixed(2);
  };

  const handleLoanAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters
    const numericValue = parseFloat(value) / 100;

    setFormData((prev) => ({
      ...prev,
      loanAmount: numericValue ? numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''
    }));

    // Validate the value
    if (numericValue < 200 || numericValue > 100000) {
      setLoanAmountError(true);
    } else {
      setLoanAmountError(false);
    }
  };

  useEffect(() => {
    const valorSolicitado = parseFloat((formData.loanAmount || '').replace(/\./g, '').replace(',', '.')) || 0;
    const parcelas = parseInt(formData.installments, 10) || 1;
    const limiteDisponivel = calcularLimite(valorSolicitado, parcelas);

    setFormData((prevData) => ({
      ...prevData,
      availableLimit: limiteDisponivel,
    }));
  }, [formData.loanAmount, formData.installments, setFormData]);

  // Funções de máscara para cada tipo de chave PIX
  function maskPixKey(value, type) {
    if (type === 'cpf') {
      // Remove tudo que não é número e limita a 11 dígitos
      let v = value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return v;
    }
    if (type === 'phone') {
      // Remove tudo que não é número e limita a 11 dígitos
      let v = value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{2})(\d)/, '($1) $2');
      v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
      return v;
    }
    // E-mail e aleatória: sem máscara
    return value;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: '#0033ff',
          fontWeight: 'bold',
          textAlign: 'center',
          textTransform: 'uppercase',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        Dados do Empréstimo
      </Typography>
      <TextField
        fullWidth
        label="Valor do empréstimo"
        name="loanAmount"
        value={formData.loanAmount}
        onChange={handleLoanAmountChange}
        onBlur={handleLoanAmountChange}
        margin="normal"
        error={!!errors.loanAmount}
        helperText={errors.loanAmount || 'Digite um valor de R$ 200,00 até R$ 100.000,00'}
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
        InputLabelProps={{
          sx: {backgroundColor: '#fff'},
        }}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '& .Mui-focused': {
            borderColor: '#0033ff',
          },
        }}
      />
      <TextField
        fullWidth
        select
        label="Quantidade de parcelas"
        name="installments"
        value={formData.installments}
        onChange={(e) => setFormData((prev) => ({ ...prev, installments: e.target.value }))}
        margin="normal"
        error={!!errors.installments}
        helperText={errors.installments}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {Array.from({ length: 18 }, (_, i) => (
          <MenuItem key={i + 1} value={i + 1}>{`${i + 1}x`}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        label="Tipo de chave PIX"
        name="pixKeyType"
        value={formData.pixKeyType || ''}
        onChange={e => setFormData(prev => ({ ...prev, pixKeyType: e.target.value, pixKey: '' }))}
        margin="normal"
        helperText="Selecione o tipo de chave PIX para receber o valor"
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        sx={{
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <MenuItem value="cpf">CPF</MenuItem>
        <MenuItem value="phone">Telefone</MenuItem>
        <MenuItem value="email">E-mail</MenuItem>
        <MenuItem value="random">Chave aleatória</MenuItem>
      </TextField>
      {formData.pixKeyType && (
        <TextField
          key={formData.pixKeyType}
          fullWidth
          label={`Chave PIX (${formData.pixKeyType === 'cpf' ? 'CPF' : formData.pixKeyType === 'phone' ? 'Telefone' : formData.pixKeyType === 'email' ? 'E-mail' : 'Aleatória'})`}
          name="pixKey"
          value={formData.pixKey || ''}
          onChange={e => setFormData(prev => ({ ...prev, pixKey: maskPixKey(e.target.value, formData.pixKeyType) }))}
          error={!!errors.pixKey}
          helperText={
            errors.pixKey ||
            (formData.pixKeyType === 'cpf' ? 'Digite o CPF cadastrado como chave PIX'
            : formData.pixKeyType === 'phone' ? 'Digite o telefone com DDD (apenas números)'
            : formData.pixKeyType === 'email' ? 'Digite o e-mail cadastrado como chave PIX'
            : 'Cole ou digite a chave aleatória')
          }
          InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
          sx={{
            mt: 2,
            backgroundColor: '#fff',
            borderRadius: '5px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#e6eaff',
          color: '#0033ff',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Info sx={{ marginRight: '10px', color: '#0033ff' }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          É necessário ter <strong>R$ {formData.availableLimit || '-'}</strong> de limite disponível em seu cartão.
        </Typography>
      </Box>
    </Container>
  );
};

export function validateLoanStep1(formData) {
  const errors = {};
  if (!formData.loanAmount) errors.loanAmount = 'Campo obrigatório';
  else {
    const value = parseFloat((formData.loanAmount || '').replace(/\./g, '').replace(',', '.'));
    if (isNaN(value) || value < 200 || value > 100000) errors.loanAmount = 'Digite um valor de R$ 200,00 até R$ 100.000,00';
  }
  if (!formData.installments) errors.installments = 'Campo obrigatório';
  return errors;
}

export default LoanApplyStep1;
