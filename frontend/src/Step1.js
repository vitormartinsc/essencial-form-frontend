import { TextField, Button, Box } from '@mui/material';
import React from 'react';

// Função para formatar CPF
const formatCpf = (value) => {
  const onlyDigits = value.replace(/\D/g, '').slice(0, 11); // Remove tudo que não é número e limita a 11 dígitos
  return onlyDigits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Função para formatar RG
const formatRg = (value) => {
  const onlyDigits = value.replace(/\D/g, '').slice(0, 9); // Remove tudo que não é número e limita a 9 dígitos
  return onlyDigits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})$/, '$1-$2');
};

// Função para formatar telefone
const formatPhone = (value) => {
  const onlyDigits = value.replace(/\D/g, '').slice(0, 11); // Remove tudo que não é número e limita a 11 dígitos
  return onlyDigits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1$2');
};

// Função para validar os campos obrigatórios
const isStepValid = (formData) => {
  const requiredFields = [
    'fullName',
    'phone',
    'cpf',
    'rg',
    'email',
    'birthDate',
    'gender',
    'maritalStatus',
    'nationality',
  ];

  return requiredFields.every((field) => formData[field] && formData[field].toString().trim() !== '');
};

const Step1 = ({ formData, handleChange, onNext, onSave, toSnakeCase }) => {
  const [errors, setErrors] = React.useState({});

  // Garante que sempre pega o valor mais recente do input
  const handleInputChange = (e) => {
    handleChange(e); // Atualiza o estado global imediatamente
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleNextClick = async () => {
    const newErrors = {};
    ['fullName', 'phone', 'cpf', 'rg', 'email', 'birthDate', 'gender', 'maritalStatus', 'nationality'].forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // Debug: veja o que está sendo enviado para o backend
      const dataToSend = toSnakeCase ? toSnakeCase(formData) : formData;
      console.log('DEBUG dados enviados para o backend:', dataToSend);
      if (onSave) await onSave(dataToSend);
      onNext();
    }
  };

  return (
    <>
      <TextField
        fullWidth
        label="Nome Completo"
        name="fullName"
        value={formData.fullName}
        onChange={handleInputChange}
        error={!!errors.fullName}
        helperText={errors.fullName}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Telefone"
        name="phone"
        value={formData.phone || ''}
        onChange={(e) => {
          handleInputChange({ target: { name: 'phone', value: formatPhone(e.target.value) } });
        }}
        error={!!errors.phone}
        helperText={errors.phone}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="CPF"
        name="cpf"
        value={formData.cpf || ''}
        onChange={(e) => {
          handleChange({ target: { name: 'cpf', value: formatCpf(e.target.value) } });
          setErrors((prev) => ({ ...prev, cpf: '' }));
        }}
        error={!!errors.cpf}
        helperText={errors.cpf}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="RG"
        name="rg"
        value={formData.rg || ''}
        onChange={(e) => {
          handleChange({ target: { name: 'rg', value: formatRg(e.target.value) } });
          setErrors((prev) => ({ ...prev, rg: '' }));
        }}
        error={!!errors.rg}
        helperText={errors.rg}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Endereço de e-mail"
        name="email"
        value={formData.email}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Data de nascimento"
        name="birthDate"
        type="date"
        InputLabelProps={{ shrink: true, sx: { backgroundColor: '#fff' } }}
        value={formData.birthDate}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, birthDate: '' }));
        }}
        error={!!errors.birthDate}
        helperText={errors.birthDate}
        sx={{ flex: '1 1 45%' }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Gênero"
        name="gender"
        value={formData.gender}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, gender: '' }));
        }}
        select
        SelectProps={{ native: true }}
        error={!!errors.gender}
        helperText={errors.gender}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
      >
        <option value=""></option>
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
      </TextField>
      <TextField
        fullWidth
        label="Estado Civil"
        name="maritalStatus"
        value={formData.maritalStatus}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, maritalStatus: '' }));
        }}
        select
        SelectProps={{ native: true }}
        error={!!errors.maritalStatus}
        helperText={errors.maritalStatus}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
      >
        <option value=""></option>
        <option value="Solteiro(a)">Solteiro(a)</option>
        <option value="Casado(a)">Casado(a)</option>
        <option value="Divorciado(a)">Divorciado(a)</option>
        <option value="Viúvo(a)">Viúvo(a)</option>
      </TextField>
      <TextField
        fullWidth
        label="Nacionalidade"
        name="nationality"
        value={formData.nationality}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, nationality: '' }));
        }}
        error={!!errors.nationality}
        helperText={errors.nationality}
        sx={{ flex: '1 1 45%' }}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
      />
      <button onClick={handleNextClick} style={{ display: 'none' }}></button>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextClick}
          sx={{
            width: '100%',
            height: '48px',
            backgroundColor: '#0033ff',
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: 18,
            mt: 2,
            boxShadow: 'none',
            borderRadius: 2,
            alignSelf: 'center',
            '&:hover': {
              backgroundColor: '#0022aa',
            },
          }}
        >
          Próximo
        </Button>
      </Box>
    </>
  );
};

export default Step1;
