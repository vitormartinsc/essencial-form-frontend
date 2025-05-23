import React from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useState } from 'react';
import { authFetch } from './authFetch';

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';

const Menu = ({ onNavigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPersonalDataWarning, setShowPersonalDataWarning] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
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
    if (!personalData || !isPersonalDataComplete(personalData)) {
      setShowPersonalDataWarning(true);
      return;
    }
    setShowPersonalDataWarning(false);
    setActionLoading(true);
    // Pequeno delay para garantir renderização do spinner antes da navegação
    setTimeout(() => {
      window.location.href = '/loan-apply';
    }, 150);
  };

  React.useEffect(() => {
    // Busca os dados pessoais do usuário ao abrir o menu
    const fetchPersonalData = async () => {
      try {
        const response = await authFetch(`${API_URL}/personal-data/get/`, {
          method: 'GET',
        });
        if (response && response.ok) {
          const data = await response.json();
          if (!data.error) {
            setPersonalData({
              ...data,
              fullName: data.fullName || data.full_name || data.nome_completo || '',
              birthDate: data.birthDate || data.birth_date || data.data_nascimento || '',
              maritalStatus: data.maritalStatus || data.marital_status || data.estado_civil || '',
              cidade: data.city || data.cidade || '',
              endereco: data.street || data.endereco || '',
              numero: data.number || data.numero || '',
              bairro: data.neighborhood || data.bairro || '',
              uf: data.uf || '',
              cep: data.cep || '',
              complemento: data.complement || data.complemento || '',
            });
          }
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
    <Box sx={{
      background: 'linear-gradient(135deg, #0033ff 0%, #0033ff 100%)',
      width: '100%',
      minHeight: '100vh',
      left: 0,
      top: 0,
      zIndex: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      py: 4,
    }}>
      <Box sx={{
        background: '#fff',
        borderRadius: 3,
        boxShadow: 4,
        width: '100%',
        maxWidth: 700,
        minHeight: 500,
        p: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        mx: 'auto',
      }}>
        <Box sx={{ background: '#0033ff', py: 3, px: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1, mb: 0 }}>
             <span style={{ fontWeight: 700, fontSize: 22 }}>Bem Vindo a Essencial</span>
          </Typography>
        </Box>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="body2" sx={{ color: '#333', mb: 2, textAlign: 'left' }}>
            Aqui você pode editar seus dados pessoai e solicitar um novo empréstimos com segurança.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                setShowPersonalDataWarning(false);
                onNavigate('dadosPessoais');
              }}
              sx={{
                minHeight: '48px',
                px: 3,
                borderRadius: '12px',
                fontSize: 16,
                fontWeight: 'bold',
                width: { xs: '100%', sm: '100%' },
                boxSizing: 'border-box',
                justifyContent: 'flex-start',
                background: '#fff',
                borderColor: '#0033ff',
                color: '#0033ff',
                touchAction: 'manipulation',
                textTransform: 'none', // Remove caixa alta
                '@media (hover: hover)': {
                  '&:hover': {
                    background: '#e6eaff',
                    borderColor: '#0022aa',
                    color: '#0022aa',
                  },
                },
              }}
            >
              Meus Dados
            </Button>
            {showPersonalDataWarning && !loading && (!personalData || !isPersonalDataComplete(personalData)) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: '#fff3e0', border: '1.5px solid #ffa726', borderRadius: 2, p: 1.2, mb: 1, ml: 0.5, width: 'fit-content', maxWidth: '90%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ReportProblemIcon sx={{ color: '#ff9800', fontSize: 22, mr: 1 }} />
                  <Typography variant="subtitle2" color="#b26a00" sx={{ fontWeight: 500 }}>
                    Para solicitar empréstimo, clique primeiro em <b>Meus Dados</b> e preencha todos os campos obrigatórios.
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
              variant="contained"
              startIcon={<AttachMoneyIcon />}
              onClick={handleLoanClick}
              disabled={loading || actionLoading}
              sx={{
                minHeight: '48px',
                px: 3,
                borderRadius: '12px',
                fontSize: 16,
                fontWeight: 'bold',
                width: { xs: '100%', sm: '100%' },
                boxSizing: 'border-box',
                justifyContent: 'flex-start',
                background: '#0033ff',
                color: '#fff',
                opacity: loading || actionLoading ? 0.5 : 1,
                touchAction: 'manipulation',
                textTransform: 'none',
                '&:hover': {
                  background: '#0022aa',
                  color: '#fff',
                },
              }}
            >
              {actionLoading ? <CircularProgress size={26} sx={{ color: '#fff' }} /> : 'Novo Empréstimo'}
            </Button>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                minHeight: '48px',
                px: 3,
                borderRadius: '12px',
                fontSize: 16,
                fontWeight: 'bold',
                width: { xs: '100%', sm: '100%' },
                boxSizing: 'border-box',
                justifyContent: 'flex-start',
                background: '#fff',
                borderColor: '#e0e0e0',
                color: '#888',
                mt: 6,
                alignSelf: 'flex-end',
                touchAction: 'manipulation',
                textTransform: 'none',
                '&:hover': {
                  background: '#f5f5f5',
                  borderColor: '#bdbdbd',
                  color: '#b71c1c',
                },
              }}
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
