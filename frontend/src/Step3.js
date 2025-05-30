import { Typography, TextField, Select, MenuItem, FormControlLabel, Checkbox, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Função para formatar valores monetários
const formatCurrency = (value) => {
  const onlyDigits = value.replace(/\D/g, ''); // Remove tudo que não é número
  const formatted = (Number(onlyDigits) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formatted.replace('R$', 'R$ '); // Garante o espaço após o símbolo
};

const Step3 = ({ formData, handleChange, handleCheckboxChange, onBack, onSubmit, onSave }) => {
  const [errors, setErrors] = React.useState({});
  const navigate = useNavigate();

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    const newErrors = {};
    ['limiteDisponivel', 'valorEmprestimo', 'bandeiraCartao', 'confirmacao'].forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      if (onSave) await onSave(formData); // Salva dados antes de avançar
      if (onSubmit) {
        await onSubmit();
      }
      navigate('/loan-apply');
    }
  };

  return (
    <>
      <Typography variant="body1" color="error" gutterBottom sx={{ mt: 2 }}>
        ⚠️ É necessário possuir um cartão de crédito para realizar o empréstimo.
      </Typography>
      <TextField
        fullWidth
        label="Limite disponível (R$)"
        name="limiteDisponivel"
        value={formData.limiteDisponivel || ''}
        onChange={(e) => handleChange({ target: { name: 'limiteDisponivel', value: formatCurrency(e.target.value) } })}
        error={!!errors.limiteDisponivel}
        helperText={errors.limiteDisponivel}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Valor do Empréstimo Desejado (R$)"
        name="valorEmprestimo"
        value={formData.valorEmprestimo || ''}
        onChange={(e) => handleChange({ target: { name: 'valorEmprestimo', value: formatCurrency(e.target.value) } })}
        error={!!errors.valorEmprestimo}
        helperText={errors.valorEmprestimo}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <Select
        fullWidth
        margin="normal"
        name="bandeiraCartao"
        value={formData.bandeiraCartao}
        onChange={handleChange}
        displayEmpty
        error={!!errors.bandeiraCartao}
      >
        <MenuItem value="" disabled>
          Selecione a bandeira
        </MenuItem>
        <MenuItem value="Visa">Visa</MenuItem>
        <MenuItem value="MasterCard">MasterCard</MenuItem>
        <MenuItem value="Elo">Elo</MenuItem>
      </Select>
      {errors.bandeiraCartao && (
        <Typography variant="body2" color="error">
          {errors.bandeiraCartao}
        </Typography>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.confirmacao}
            onChange={handleCheckboxChange}
            name="confirmacao"
          />
        }
        label="Afirmo que possuo um cartão de crédito com limite disponível para realizar meu empréstimo."
      />
      {errors.confirmacao && (
        <Typography variant="body2" color="error">
          {errors.confirmacao}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onBack}
        startIcon={<span style={{ display: 'flex', alignItems: 'center', fontSize: 22, marginRight: 4 }}>&larr;</span>}
        sx={{
          mt: 2,
          fontWeight: 'bold',
          borderRadius: 2,
          fontSize: 16,
          boxShadow: 'none',
          background: '#0033ff',
          color: '#fff',
          textTransform: 'none',
          px: 4,
          py: 1.5,
          letterSpacing: 1,
          height: '48px', // Garante altura igual ao outro botão
          minHeight: '48px',
          '&:hover': {
            background: '#0022aa',
          },
        }}
      >
        Voltar
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleFinalSubmit}
        sx={{
          mt: 2,
          fontWeight: 'bold',
          borderRadius: 2,
          boxShadow: 4,
          background: '#0033ff',
          color: '#fff',
          fontSize: 18,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          letterSpacing: 1,
          '&:hover': {
            background: '#0022aa',
            boxShadow: 6,
          },
        }}
      >
        Solicitar Empréstimo
      </Button>
    </>
  );
};

export default Step3;
