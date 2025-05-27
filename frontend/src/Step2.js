import React from 'react';
import { TextField, Box, Button } from '@mui/material';

const isStepValid = (formData) => {
  const requiredFields = ['cep', 'uf', 'city', 'neighborhood', 'street', 'number'];

  return requiredFields.every((field) => formData[field] && formData[field].toString().trim() !== '');
};

const Step2 = ({ formData, handleChange, handleCepChange, onNext, onBack, onSave, setFormData }) => {
  const [errors, setErrors] = React.useState({});
  const [cepError, setCepError] = React.useState('');

  const handleNextClick = async () => {
    const newErrors = {};
    ['cep', 'uf', 'city', 'neighborhood', 'street', 'number'].forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // Converte para snake_case antes de salvar
      const toSnakeCase = (obj) => {
        const newObj = {};
        for (const key in obj) {
          const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
          newObj[snakeKey] = obj[key];
        }
        return newObj;
      };
      if (onSave) await onSave(toSnakeCase(formData)); // Salva dados antes de avançar
      onNext();
    }
  };

  React.useEffect(() => {
    if (formData.cep && formData.cep.length === 9) {
      (async () => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${formData.cep.replace('-', '')}/json/`);
          const data = await response.json();
          if (data.erro) {
            setCepError('CEP não encontrado.');
          } else {
            // Só atualiza se algum campo mudou para evitar loop
            if (
              formData.uf !== (data.uf || '') ||
              formData.city !== (data.localidade || '') ||
              formData.neighborhood !== (data.bairro || '') ||
              formData.street !== (data.logradouro || '')
            ) {
              setCepError('');
              setTimeout(() => {
                setCepError('');
                setFormData((prev) => ({
                  ...prev,
                  uf: data.uf || '',
                  city: data.localidade || '',
                  neighborhood: data.bairro || '',
                  street: data.logradouro || '',
                }));
              }, 100);
            }
          }
        } catch (error) {
          setCepError('Erro ao buscar o CEP. Tente novamente.');
        }
      })();
    }
  }, [formData.cep]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <TextField
        fullWidth
        label="CEP"
        name="cep"
        value={formData.cep || ''}
        onChange={(e) => {
          handleCepChange(e);
          setErrors((prev) => ({ ...prev, cep: '' }));
        }}
        placeholder="12345-678"
        inputProps={{ maxLength: 10, style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
        error={!!errors.cep || !!cepError}
        helperText={errors.cep || cepError}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
      />
      <TextField
        fullWidth
        label="UF"
        name="uf"
        value={formData.uf || ''}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, uf: '' }));
        }}
        error={!!errors.uf}
        helperText={errors.uf}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Cidade"
        name="city"
        value={formData.city || ''}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, city: '' }));
        }}
        error={!!errors.city}
        helperText={errors.city}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Bairro"
        name="neighborhood"
        value={formData.neighborhood || ''}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, neighborhood: '' }));
        }}
        error={!!errors.neighborhood}
        helperText={errors.neighborhood}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Rua"
        name="street"
        value={formData.street || ''}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, street: '' }));
        }}
        error={!!errors.street}
        helperText={errors.street}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <TextField
        fullWidth
        label="Número"
        name="number"
        value={formData.number || ''}
        onChange={(e) => {
          handleChange(e);
          setErrors((prev) => ({ ...prev, number: '' }));
        }}
        error={!!errors.number}
        helperText={errors.number}
        InputLabelProps={{ sx: { backgroundColor: '#fff' } }}
        inputProps={{ style: { height: 48, boxSizing: 'border-box', padding: '0 14px' } }}
      />
      <Box sx={{ gridColumn: '1 / span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onBack}
          sx={{
            width: '100%',
            height: '48px',
            backgroundColor: '#0033ff',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#0022aa',
            },
          }}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextClick}
          sx={{
            width: '100%',
            height: '48px',
            textTransform: 'none',
            backgroundColor: '#0033ff',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            boxShadow: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#0022aa',
            },
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default Step2;
