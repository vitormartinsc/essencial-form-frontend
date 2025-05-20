import React, { useState } from 'react';
import { Container, Typography, Box, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import idFrente from './assets/id_frente.svg';
import idVerso from './assets/id_verso.svg';
import cnhImage from './assets/cnh.svg';

const LoanApplyStep3 = ({ formData, setFormData, showValidationErrors, errors = {} }) => {
  const [documentType, setDocumentType] = useState('RG');

  // Estados locais para arquivos
  const [documentFront, setDocumentFront] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);

  // Função utilitária para validar imagem
  const isValidImage = (file) => {
    if (!file) return false;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return validTypes.includes(file.type);
  };

  // Atualiza formData global sempre que arquivos mudam
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      documentFront,
      documentBack,
      documentType,
    }));
  }, [documentFront, documentBack, documentType, setFormData]);

  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
    // Limpa arquivos ao trocar tipo
    setDocumentFront(null);
    setDocumentBack(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: '#0056FF',
          fontWeight: 'bold',
          textAlign: 'center',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        Envie seu RG ou sua CNH
      </Typography>

      <RadioGroup
        row
        value={formData.documentType || documentType}
        onChange={handleDocumentTypeChange}
        sx={{ justifyContent: 'center', mb: 4, gap: 2 }}
      >
        <FormControlLabel
          value="RG"
          control={<Radio sx={{ color: '#0056FF' }} />}
          label="Vou enviar meu RG"
          sx={{ color: '#0056FF', fontWeight: '500' }}
        />
        <FormControlLabel
          value="CNH"
          control={<Radio sx={{ color: '#0056FF' }} />}
          label="Vou enviar minha CNH"
          sx={{ color: '#0056FF', fontWeight: '500' }}
        />
      </RadioGroup>

      {formData.documentType === 'RG' || documentType === 'RG' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2, alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto da frente da Identidade</Typography>
            <img
              src={idFrente}
              alt="Foto do RG (Frente)"
              style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
            />
            {!documentFront ? (
              <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
                Enviar arquivo
                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                  const file = e.target.files[0];
                  if (isValidImage(file)) {
                    setDocumentFront(file);
                  } else if (file) {
                    alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                  }
                }} />
              </Button>
            ) : (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
                <a
                  href={URL.createObjectURL(documentFront)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Inter, Roboto, Arial, sans-serif',
                    color: '#0056FF',
                    fontWeight: 500,
                    fontSize: 15,
                    letterSpacing: 0.2,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginRight: 8,
                    userSelect: 'text',
                  }}
                >
                  {documentFront.name}
                </a>
                <CloseIcon
                  sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 20, ml: 0.5 }}
                  onClick={() => setDocumentFront(null)}
                />
              </Box>
            )}
            {!documentFront && errors.documentFront && (
              <Typography variant="caption" color="error" sx={{ mt: 1, mb: 1, display: 'block' }}>{errors.documentFront}</Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto do verso da Identidade</Typography>
            <img
              src={idVerso}
              alt="Foto do RG (Verso)"
              style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
            />
            {!documentBack ? (
              <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
                Enviar arquivo
                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                  const file = e.target.files[0];
                  if (isValidImage(file)) {
                    setDocumentBack(file);
                  } else if (file) {
                    alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                  }
                }} />
              </Button>
            ) : (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
                <a
                  href={URL.createObjectURL(documentBack)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Inter, Roboto, Arial, sans-serif',
                    color: '#0056FF',
                    fontWeight: 500,
                    fontSize: 15,
                    letterSpacing: 0.2,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginRight: 8,
                    userSelect: 'text',
                  }}
                >
                  {documentBack.name}
                </a>
                <CloseIcon
                  sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 20, ml: 0.5 }}
                  onClick={() => setDocumentBack(null)}
                />
              </Box>
            )}
            {!documentBack && errors.documentBack && (
              <Typography variant="caption" color="error" sx={{ mt: 1, mb: 1, display: 'block' }}>{errors.documentBack}</Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto da CNH</Typography>
          <img
            src={cnhImage}
            alt="Foto da CNH"
            style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
          />
          {!documentFront ? (
            <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
              Enviar arquivo
              <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                const file = e.target.files[0];
                if (isValidImage(file)) {
                  setDocumentFront(file);
                } else if (file) {
                  alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                }
              }} />
            </Button>
          ) : (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
              <a
                href={URL.createObjectURL(documentFront)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Inter, Roboto, Arial, sans-serif',
                  color: '#0056FF',
                  fontWeight: 500,
                  fontSize: 15,
                  letterSpacing: 0.2,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginRight: 8,
                  userSelect: 'text',
                }}
              >
                {documentFront.name}
              </a>
              <CloseIcon
                sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 20, ml: 0.5 }}
                onClick={() => setDocumentFront(null)}
              />
            </Box>
          )}
          {!documentFront && errors.documentFront && (
            <Typography variant="caption" color="error" sx={{ mt: 1, mb: 1, display: 'block' }}>{errors.documentFront}</Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

// Validation logic for required files
export function validateLoanStep3(formData) {
  const errors = {};
  if (formData.documentType === 'RG') {
    if (!formData.documentFront) errors.documentFront = 'Obrigatório enviar a frente do RG';
    if (!formData.documentBack) errors.documentBack = 'Obrigatório enviar o verso do RG';
  } else if (formData.documentType === 'CNH') {
    if (!formData.documentFront) errors.documentFront = 'Obrigatório enviar a foto da CNH';
  }
  return errors;
}

export default LoanApplyStep3;


