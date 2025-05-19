import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';

const Menu = ({ onNavigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPersonalDataWarning, setShowPersonalDataWarning] = React.useState(false);

  const handleLogout = () => {
    fetch(`${API_URL}/logout/`, {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      window.location.href = '/login';
    });
  };

  // Função para checar se todos os dados pessoais obrigatórios estão preenchidos
  const requiredFields = [
    { key: 'fullName', label: 'Nome completo' },
    { key: 'phone', label: 'Telefone' },
    { key: 'cpf', label: 'CPF' },
    { key: 'rg', label: 'RG' },
    { key: 'email', label: 'E-mail' },
    { key: 'birthDate', label: 'Data de nascimento' },
    { key: 'gender', label: 'Gênero' },
    { key: 'maritalStatus', label: 'Estado civil' },
    { key: 'nationality', label: 'Nacionalidade' },
    { key: 'cep', label: 'CEP' },
    { key: 'uf', label: 'UF' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'bairro', label: 'Bairro' },
  ];

  const isPersonalDataComplete = (data) => {
    return requiredFields.every(({ key }) => data[key] && data[key].toString().trim() !== '');
  };

  const getMissingFields = (data) => {
    return requiredFields.filter(({ key }) => !data[key] || data[key].toString().trim() === '').map(f => f.label);
  };

  const [personalData, setPersonalData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const handleLoanClick = () => {
    console.log(personalData)

    if (!personalData || !isPersonalDataComplete(personalData)) {
      setShowPersonalDataWarning(true);
      return;
    }
    setShowPersonalDataWarning(false);
    window.location.href = '/loan-apply';
  };

  React.useEffect(() => {
    // Busca os dados pessoais do usuário ao abrir o menu
    const fetchPersonalData = async () => {
      try {
        const response = await fetch(`${API_URL}/personal-data/get/`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPersonalData(data);
        } else {
          setPersonalData(null);
        }
      } catch (error) {
        setPersonalData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonalData();
  }, []);

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0033ff 0%, #0033ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', py: 4, minHeight: 'auto' }}>
      <Box sx={{ background: '#fff', borderRadius: 3, boxShadow: 4, width: '80vw', maxWidth: 700, minHeight: 500, p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ background: '#0033ff', py: 3, px: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1, mb: 0 }}>
             <span style={{ fontWeight: 700, fontSize: 22 }}>Bem Vindo a Essencial</span>
          </Typography>
        </Box>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="body2" sx={{ color: '#333', mb: 2 }}>
            Aqui você pode editar seus dados pessoais, solicitar empréstimos e sair da sua conta com segurança.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                setShowPersonalDataWarning(false);
                onNavigate('dadosPessoais');
              }}
              sx={{ justifyContent: 'flex-start', width: '100%', fontWeight: 'bold', borderRadius: 2, fontSize: 16, background: '#fff', borderColor: '#0033ff', color: '#0033ff', '&:hover': { background: '#e6eaff', borderColor: '#0022aa', color: '#0022aa' } }}
            >
              Editar Dados Pessoais
            </Button>
            {showPersonalDataWarning && !loading && (!personalData || !isPersonalDataComplete(personalData)) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: '#fff3e0', border: '1.5px solid #ffa726', borderRadius: 2, p: 1.2, mb: 1, ml: 0.5, width: 'fit-content', maxWidth: '90%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReportProblemIcon sx={{ color: '#ff9800', fontSize: 22, mr: 1 }} />
                  <Typography variant="subtitle2" color="#b26a00" sx={{ fontWeight: 500 }}>
                    Para solicitar empréstimo, clique primeiro em <b>Editar Dados Pessoais</b> e preencha todos os campos obrigatórios.
                  </Typography>
                </Box>
                {personalData && getMissingFields(personalData).length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" color="#b26a00" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Campos faltando:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {getMissingFields(personalData).map((field, idx) => (
                        <li key={idx} style={{ fontSize: 14, color: '#b26a00' }}>{field}</li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            )}
            <Button
              color="primary"
              variant="outlined"
              startIcon={<AttachMoneyIcon />}
              onClick={handleLoanClick}
              disabled={loading}
              sx={{ justifyContent: 'flex-start', width: '100%', fontWeight: 'bold', borderRadius: 2, fontSize: 16, background: '#fff', borderColor: '#0033ff', color: '#0033ff', opacity: loading ? 0.5 : 1, '&:hover': { background: '#e6eaff', borderColor: '#0022aa', color: '#0022aa' } }}
            >
              Solicitar Empréstimo
            </Button>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ justifyContent: 'flex-start', width: '100%', fontWeight: 'bold', borderRadius: 2, fontSize: 16, background: '#fff', borderColor: '#0033ff', color: '#0033ff', '&:hover': { background: '#e6eaff', borderColor: '#0022aa', color: '#0022aa' } }}
            >
              Sair da Conta
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Menu;
