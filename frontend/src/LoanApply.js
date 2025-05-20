import React, { useState, useEffect } from 'react';
import LoanApplyStep1, { validateLoanStep1 } from './LoanApplyStep1';
import LoanApplyStep2, { validateLoanStep2 } from './LoanApplyStep2';
import LoanApplyStep3, { validateLoanStep3 } from './LoanApplyStep3';
import LoanApplyStep4, { validateLoanStep4 } from './LoanApplyStep4';
import HomeIcon from '@mui/icons-material/Home';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';

const LoanApply = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    installments: '12',
    availableLimit: '',
    receiveMethod: 'PIX',
    pixKeyType: '',
    pixKey: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardBrand: 'generic', // Garante valor default para não quebrar o cartão
    // Adicione todos os campos esperados pelos steps para garantir que nunca fiquem undefined
    // Isso evita sumiço do cartão e outros bugs visuais
  });

  const [loanAmountError, setLoanAmountError] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false); // Novo estado global
  const [allStepErrors, setAllStepErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleFinalizar = async () => {
      setShowValidationErrors(true); // Ativa exibição dos erros em todos os steps
      // Centralized validation for all steps
      const errors1 = validateLoanStep1(formData);
      const errors2 = validateLoanStep2(formData);
      const errors3 = validateLoanStep3(formData);
      // Pass selectedOption from formData for step 4 validation
      const errors4 = validateLoanStep4({ ...formData, selectedOption: formData.selectedOption || 'physical' });
      const allErrors = { ...errors1, ...errors2, ...errors3, ...errors4 };
      setAllStepErrors(allErrors);
      if (Object.keys(allErrors).length > 0) {
        setGlobalError('Por favor, preencha todos os campos obrigatórios antes de finalizar a solicitação.');
        return; // Block submission
      } else {
        setGlobalError('');
      }
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/loan-apply/`, {
          method: 'POST',
          body: formDataToSend,
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (response.ok) {
          alert('Solicitação enviada com sucesso!');
        } else {
          alert('Erro ao enviar solicitação.');
        }
      } catch (err) {
        alert('Erro ao conectar com o servidor.');
      }
    };
    const listener = () => handleFinalizar();
    window.addEventListener('finalizarSolicitacaoEmprestimo', listener);
    return () => window.removeEventListener('finalizarSolicitacaoEmprestimo', listener);
  }, [formData]);

  return (
    <Box>
      {globalError && (
        <Typography color="error" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          {globalError}
        </Typography>
      )}
      <LoanApplyStep1
        formData={formData}
        setFormData={setFormData}
        loanAmountError={loanAmountError}
        setLoanAmountError={setLoanAmountError}
        showValidationErrors={showValidationErrors}
        errors={allStepErrors}
      />
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ccc' }} />
      <LoanApplyStep2
        formData={formData}
        setFormData={setFormData}
        showValidationErrors={showValidationErrors}
        errors={allStepErrors}
      />
      <LoanApplyStep3
        formData={formData}
        setFormData={setFormData}
        showValidationErrors={showValidationErrors}
        errors={allStepErrors}
      />
      <LoanApplyStep4
        formData={formData}
        setFormData={setFormData}
        showValidationErrors={showValidationErrors}
        errors={allStepErrors}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/menu')}
          sx={{ 
            textTransform: 'none',
            backgroundColor: '#0033ff', fontWeight: 'bold', borderRadius: 2, '&:hover': { backgroundColor: '#1769aa' } }}
        >
          Voltar
        </Button>
      </div>
    </Box>
  );
};

export default LoanApply;
