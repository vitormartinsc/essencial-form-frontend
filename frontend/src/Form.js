import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel, Button, Alert } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import './MobileInputs.css';
// import { authFetch } from './authFetch';

// const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend-production.up.railway.app';

function formatCep(value) {
  // Remove tudo que não for número
  value = value.replace(/\D/g, '');

  // Adiciona o traço no formato 12345-678
  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5, 8);
  }

  return value;
}

// Utilitário para converter camelCase para snake_case
// function toSnakeCase(obj) {
//   const newObj = {};
//   for (const key in obj) {
//     const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
//     newObj[snakeKey] = obj[key];
//   }
//   return newObj;
// }

function Form() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cpf: '',
    rg: '',
    email: '',
    birthDate: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    cep: '',
    uf: '',
    cidade: '',
    endereco: '',
    numero: '',
    bairro: '',
    complemento: '',
    tipoResidencia: '',
    tempoResidencia: '',
    limiteDisponivel: '',
    valorEmprestimo: '',
    bandeiraCartao: '',
    confirmacao: false,
    availableLimit: '',
    requestedAmount: '',
  });

  const [cepError, setCepError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Desabilitado temporariamente para testes sem servidor
    // const fetchPersonalData = async () => {
    //   try {
    //     const response = await authFetch(`${API_URL}/personal-data/get/`, {
    //       method: 'GET',
    //     });
    //     if (response && response.ok) {
    //       const data = await response.json();
    //       if (!data.error) {
    //         // Normaliza para camelCase e remove snake_case do formData
    //         setFormData((prev) => {
    //           const cleanPrev = { ...prev };
    //           // Remove possíveis campos snake_case antigos
    //           Object.keys(cleanPrev).forEach((k) => {
    //             if (k.includes('_')) delete cleanPrev[k];
    //           });
    //           return {
    //             ...cleanPrev,
    //             fullName: data.fullName || data.full_name || data.nome_completo || '',
    //             phone: data.phone || '',
    //             cpf: data.cpf || '',
    //             rg: data.rg || '',
    //             email: data.email || '',
    //             birthDate: data.birthDate || data.birth_date || data.data_nascimento || '',
    //             gender: data.gender || '',
    //             maritalStatus: data.maritalStatus || data.marital_status || data.estado_civil || '',
    //             nationality: data.nationality || '',
    //             cidade: data.city || data.cidade || '',
    //             endereco: data.street || data.endereco || '',
    //             numero: data.number || data.numero || '',
    //             bairro: data.neighborhood || data.bairro || '',
    //             uf: data.uf || '',
    //             cep: data.cep || '',
    //             complemento: data.complement || data.complemento || '',
    //           };
    //         });
    //       }
    //     }
    //   } catch (error) {
    //     // Silencie erro de usuário sem dados
    //   }
    // };
    // fetchPersonalData();
  }, []);

  const steps = ['Informações Pessoais', 'Dados de Endereço', 'Finalizar'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, confirmacao: e.target.checked });
  };

  const handleCepChange = async (e) => {
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const formattedCep = formatCep(input.value);
    setFormData((prevData) => {
      const updatedData = { ...prevData, cep: formattedCep };

      // Reposiciona o cursor corretamente
      const diff = formattedCep.length - input.value.length;
      input.setSelectionRange(start + diff, end + diff);

      return updatedData;
    });

    // Valida o formato do CEP
    if (formattedCep.length === 9 && !/^\d{5}-\d{3}$/.test(formattedCep)) {
      setCepError('CEP inválido. Use o formato 12345-678.');
      return;
    } else {
      setCepError('');
    }

    // Busca informações do CEP se o formato for válido
    if (formattedCep.length === 9) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${formattedCep.replace('-', '')}/json/`);
        if (response.data.erro) {
          setCepError('CEP não encontrado.');
        } else {
          const { logradouro, bairro, localidade, uf } = response.data;
          setFormData((prevData) => ({
            ...prevData,
            endereco: logradouro || '',
            bairro: bairro || '',
            cidade: localidade || '',
            uf: uf || '',
          }));
        }
      } catch (error) {
        setCepError('Erro ao buscar o CEP. Tente novamente.');
        console.error('Erro ao buscar o CEP:', error);
      }
    }
  };

  // Função para salvar dados parciais a cada avanço de etapa
  const savePartialData = async (partialData) => {
    // Desabilitado temporariamente para testes sem servidor
    console.log('DEBUG savePartialData (parcial):', partialData);
    console.log('Dados salvos localmente (simulação)');
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // Desabilitado temporariamente para testes sem servidor
    console.log('DEBUG handleSubmit (final):', formData);
    alert('Dados enviados com sucesso! (simulação)');
  };

  return (
    <>
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', px: 2 }}>
        <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'white', width: '100%', maxWidth: '900px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Stepper
                activeStep={activeStep}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: { xs: '90vw', sm: '100%' },
                  maxWidth: { xs: 220, sm: 500 },
                  minWidth: { xs: 0, sm: 400 },
                  px: { xs: 0, sm: 2 },
                  mx: { xs: 'auto', sm: 0 },
                  mb: { xs: 2, sm: 3 },
                  '& .MuiStepConnector-root': {
                    minHeight: 20,
                  },
                  '& .MuiStepLabel-label': {
                    fontSize: { xs: 0, sm: 16 },
                    display: { xs: 'none', sm: 'inline' },
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: { xs: 22, sm: 28 },
                    color: '#b0b8c1',
                    background: '#fff',
                    borderRadius: '50%',
                    border: '2px solid #e0e0e0',
                    boxSizing: 'border-box',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: '#fff',
                    background: '#0033ff',
                    border: '3px solid #0033ff',
                    fontWeight: 'bold',
                    fontSize: { xs: 28, sm: 36 },
                    boxShadow: '0 0 0 6px #e6eaff, 0 0 12px #0033ff55',
                    transform: 'scale(1.18)',
                    zIndex: 2,
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: '#0033ff',
                    background: '#e6eaff',
                    border: '2px solid #0033ff',
                  },
                }}
              >
                {steps.map((label, idx) => (
                  <Step key={label}>
                    <StepLabel>{window.innerWidth < 600 ? '' : label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Typography variant="h5" component="h1" gutterBottom sx={{ mt: 3, textAlign: 'center', width: '100%' }}>
                {steps[activeStep]}
              </Typography>
            </Box>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {activeStep === 0 && <Step1 formData={formData} handleChange={handleChange} onNext={handleNext} onSave={savePartialData} />}
              {activeStep === 1 && (
                <Step2
                  formData={formData}
                  setFormData={setFormData} // <-- Adicionado para permitir atualização global
                  handleChange={handleChange}
                  handleCepChange={handleCepChange}
                  cepError={cepError}
                  onNext={handleNext}
                  onBack={handleBack}
                  onSave={savePartialData}
                />
              )}
              {activeStep === 2 && (
                <Step3
                  formData={formData}
                  handleChange={handleChange}
                  handleCheckboxChange={handleCheckboxChange}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  onSave={savePartialData}
                />
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/menu')}
                startIcon={<HomeIcon sx={{ color: '#0033ff' }} />}
                sx={{
                  mt: 2,
                  color: '#0033ff',
                  borderColor: '#0033ff',
                  background: 'none',
                  boxShadow: 'none',
                  fontWeight: 'bold',
                  fontSize: 18,
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '48px',
                  alignSelf: 'center',
                  '&:hover': {
                    background: 'none',
                    borderColor: '#0033ff',
                    color: '#0033ff',
                    textDecoration: 'underline',
                  },
                }}
              >
                Voltar
              </Button>
            </form>
            <Alert severity="info" sx={{ mt: 2, mb: 2, background: '#e3f2fd', color: '#0056FF', border: '1px solid #b6d4fe', fontWeight: 500, textAlign: 'left', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'center' } }}>
                <span>É necessário possuir um cartão de crédito válido para realizar o empréstimo.</span>
              </Box>
            </Alert>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            </Box>
          </Box>
        </Container>
    </>
  );
}

export default Form;