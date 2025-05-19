import React, { useState } from 'react';
import { Container, Typography, Box, Radio, RadioGroup, FormControlLabel, Button, Checkbox, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import cartaoFrente from './assets/cartao_fisico_frente.svg';
import cartaoVerso from './assets/cartao_fisico_verso.svg';
import limiteDisponivelIcon from './assets/limite_disponivel_cartao_fisico.svg';
import cartaoVirtual from './assets/cartao_virtual.svg';
import limiteDisponivelVirtualIcon from './assets/limite_disponivel_cartao_virtual.svg';

const LoanApplyStep4 = ({ formData, setFormData, showValidationErrors, errors = {} }) => {
  const [selectedOption, setSelectedOption] = useState(formData.selectedOption || 'physical');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Estados para arquivos
  const [cardFront, setCardFront] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [cardLimit, setCardLimit] = useState(null);
  const [virtualCard, setVirtualCard] = useState(null);
  const [virtualLimit, setVirtualLimit] = useState(null);

  // Função utilitária para validar imagem
  const isValidImage = (file) => {
    if (!file) return false;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return validTypes.includes(file.type);
  };

  // Atualiza formData no LoanApply.js sempre que arquivos mudam
  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      cardFront,
      cardBack,
      cardLimit,
      virtualCard,
      virtualLimit,
    }));
  }, [cardFront, cardBack, cardLimit, virtualCard, virtualLimit, setFormData]);

  // Sincroniza selectedOption com formData
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedOption }));
  }, [selectedOption, setFormData]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleConfirmationChange = (event) => {
    setIsConfirmed(event.target.checked);
  };

  const handleFinalizarClick = () => {
    if (isConfirmed && typeof window !== 'undefined') {
      const event = new CustomEvent('finalizarSolicitacaoEmprestimo');
      window.dispatchEvent(event);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
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
        Comprove Titularidade do Cartão de Crédito e Limite Disponível
      </Typography>

      <Typography variant="body1" gutterBottom sx={{ color: '#555', textAlign: 'center', mb: 2 }}>
        Precisamos que você envie alguns documentos para continuar o processo. Siga as instruções abaixo para garantir que tudo esteja correto.
      </Typography>

      <Typography variant="body2" gutterBottom sx={{ color: '#777', textAlign: 'center', mb: 3 }}>
        Escolha se você enviará imagens de um cartão físico ou virtual.
      </Typography>

      <RadioGroup value={selectedOption} onChange={handleOptionChange} sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <FormControlLabel
          value="physical"
          control={<Radio />}
          label={<Typography sx={{ color: '#333', fontWeight: '500' }}>Vou usar meu cartão físico.</Typography>}
        />
        <FormControlLabel
          value="virtual"
          control={<Radio />}
          label={<Typography sx={{ color: '#333', fontWeight: '500' }}>Vou usar meu cartão virtual.</Typography>}
        />
      </RadioGroup>

      {/* --- VIRTUAL CARD --- */}
      {selectedOption === 'virtual' && (
        <Box sx={{ mb: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto do cartão virtual</Typography>
          <img
            src={cartaoVirtual}
            alt="Cartão Virtual"
            style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
          />
          {!virtualCard ? (
            <Button
              variant="contained"
              component="label"
              sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}
            >
              Enviar arquivo
              <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                const file = e.target.files[0];
                if (isValidImage(file)) {
                  setVirtualCard(file);
                } else if (file) {
                  alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                }
              }} />
            </Button>
          ) : (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
              <a
                href={URL.createObjectURL(virtualCard)}
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
                {virtualCard.name}
              </a>
              <CloseIcon
                sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 18, ml: 2 }}
                onClick={() => setVirtualCard(null)}
              />
            </Box>
          )}
          {!virtualCard && showValidationErrors && errors.virtualCard && (
            <Typography variant="caption" color="error" sx={{ mt: 1, mb: 1, display: 'block' }}>{errors.virtualCard}</Typography>
          )}
          <Box sx={{ mt: 3, backgroundColor: '#f0f8ff', borderRadius: '12px', p: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto do limite disponível (Opcional)</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#777', textAlign: 'center' }}>
              Enviar esta foto é opcional, mas pode ajudar a acelerar o processo.
            </Typography>
            <img
              src={limiteDisponivelVirtualIcon}
              alt="Limite Disponível Virtual"
              style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
            />
            {!virtualLimit ? (
              <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
                Enviar arquivo
                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                  const file = e.target.files[0];
                  if (isValidImage(file)) {
                    setVirtualLimit(file);
                  } else if (file) {
                    alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                  }
                }} />
              </Button>
            ) : (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
                <a
                  href={URL.createObjectURL(virtualLimit)}
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
                  {virtualLimit.name}
                </a>
                <CloseIcon
                  sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 18, ml: 2 }}
                  onClick={() => setVirtualLimit(null)}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* --- FÍSICO --- */}
      {selectedOption === 'physical' && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '8px', padding: '15px', mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#856404', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>⚠️</span>
              Atenção: Certifique-se de que o CVV esteja coberto na imagem do verso do cartão.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto da frente do cartão</Typography>
              <img
                src={cartaoFrente}
                alt="Cartão Frente"
                style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
              />
              {!cardFront ? (
                <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
                  Enviar arquivo
                  <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                    const file = e.target.files[0];
                    if (isValidImage(file)) {
                      setCardFront(file);
                    } else if (file) {
                      alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                    }
                  }} />
                </Button>
              ) : (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
                  <a
                    href={URL.createObjectURL(cardFront)}
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
                    {cardFront.name}
                  </a>
                  <CloseIcon
                    sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 18, ml: 2 }}
                    onClick={() => setCardFront(null)}
                  />
                </Box>
              )}
              {!cardFront && showValidationErrors && errors.cardFront && (
                <Typography variant="caption" color="error" sx={{ mt: 1, mb: 1, display: 'block' }}>{errors.cardFront}</Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto do verso do cartão</Typography>
              <img
                src={cartaoVerso}
                alt="Cartão Verso"
                style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
              />
              {!cardBack ? (
                <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
                  Enviar arquivo
                  <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                    const file = e.target.files[0];
                    if (isValidImage(file)) {
                      setCardBack(file);
                    } else if (file) {
                      alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                    }
                  }} />
                </Button>
              ) : (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
                  <a
                    href={URL.createObjectURL(cardBack)}
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
                    {cardBack.name}
                  </a>
                  <CloseIcon
                    sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 18, ml: 2 }}
                    onClick={() => setCardBack(null)}
                  />
                </Box>
              )}
              {!cardBack && showValidationErrors && errors.cardBack && (
                <Typography variant="caption" color="error" sx={{ mt: 1, mb: 1, display: 'block' }}>{errors.cardBack}</Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f8ff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', mt: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#0056FF', fontWeight: 'bold' }}>Foto do limite disponível (Opcional)</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#777', textAlign: 'center' }}>
              Enviar esta foto é opcional, mas pode ajudar a acelerar o processo.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={limiteDisponivelIcon}
                alt="Limite Disponível"
                style={{ width: '60px', height: 'auto', marginBottom: '18px', marginTop: '2px' }}
              />
              {!cardLimit ? (
                <Button variant="contained" component="label" sx={{ backgroundColor: '#0056FF', color: '#fff', fontWeight: 'bold', textTransform: 'none', borderRadius: '8px', '&:hover': { backgroundColor: '#003f8a' } }}>
                  Enviar arquivo
                  <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" hidden onChange={e => {
                    const file = e.target.files[0];
                    if (isValidImage(file)) {
                      setCardLimit(file);
                    } else if (file) {
                      alert('Por favor, selecione uma imagem válida (PNG, JPG, JPEG, WEBP).');
                    }
                  }} />
                </Button>
              ) : (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, background: '#f5f7fa', borderRadius: '6px', px: 2, py: 0.5, width: '100%' }}>
                  <a
                    href={URL.createObjectURL(cardLimit)}
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
                    {cardLimit.name}
                  </a>
                  <CloseIcon
                    sx={{ cursor: 'pointer', color: '#b71c1c', fontSize: 18, ml: 2 }}
                    onClick={() => setCardLimit(null)}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <Checkbox checked={isConfirmed} onChange={handleConfirmationChange} />
        <Typography variant="body2" sx={{ color: '#333' }}>
          Confirmo que meu limite disponível é maior ou igual a{' '}
          <Typography component="span" color="error">
            {formData.availableLimit ? `R$ ${Number(formData.availableLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ -'}
          </Typography>.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        disabled={!isConfirmed}
        sx={{ mt: 3, fontWeight: 'bold', borderRadius: 2, fontSize: 18, px: 4, py: 1.5, letterSpacing: 1, textTransform: 'none', background: '#0056FF', '&:hover': { background: '#003f8a' } }}
        onClick={handleFinalizarClick}
      >
        Finalizar solicitação
      </Button>
    </Container>
  );
};

// Validation logic for required files
export function validateLoanStep4(formData) {
  const errors = {};
  if (formData.selectedOption === 'virtual') {
    if (!formData.virtualCard) errors.virtualCard = 'Obrigatório enviar a foto do cartão virtual';
  } else {
    if (!formData.cardFront) errors.cardFront = 'Obrigatório enviar a foto da frente do cartão';
    if (!formData.cardBack) errors.cardBack = 'Obrigatório enviar a foto do verso do cartão';
  }
  // cardLimit and virtualLimit are optional
  return errors;
}

export default LoanApplyStep4;
