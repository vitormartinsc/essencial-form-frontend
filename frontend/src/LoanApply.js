import React, { useState, useEffect } from 'react';
import LoanApplyStep1, { validateLoanStep1 } from './LoanApplyStep1';
import LoanApplyStep2, { validateLoanStep2 } from './LoanApplyStep2';
import LoanApplyStep3, { validateLoanStep3 } from './LoanApplyStep3';
import LoanApplyStep4, { validateLoanStep4 } from './LoanApplyStep4';
import HomeIcon from '@mui/icons-material/Home';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authFetch } from './authFetch';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend-production.up.railway.app';

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
      // Função para converter camelCase para snake_case
      const toSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        let snakeKey = toSnakeCase(key);
        // Converter valores numéricos corretamente
        if (snakeKey === 'loan_amount' && typeof value === 'string') {
          value = parseFloat(value.replace(/\./g, '').replace(',', '.'));
        }
        if (snakeKey === 'available_limit' && typeof value === 'string') {
          value = parseFloat(value.replace(/\./g, '').replace(',', '.'));
        }
        if (snakeKey === 'installments' && typeof value === 'string') {
          value = parseInt(value, 10);
        }
        // Só adiciona arquivos se forem File
        if (value instanceof File) {
          formDataToSend.append(snakeKey, value);
        } else if (typeof value === 'string' && value.trim() !== '') {
          formDataToSend.append(snakeKey, value);
        } else if (typeof value === 'number' && !isNaN(value)) {
          formDataToSend.append(snakeKey, value);
        }
      });
      // Logando o conteúdo do formDataToSend para debug
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
      // Desabilitado temporariamente para testes sem servidor
      console.log('Solicitação de empréstimo enviada (simulação)');
      alert('Solicitação enviada com sucesso! (simulação)');
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
