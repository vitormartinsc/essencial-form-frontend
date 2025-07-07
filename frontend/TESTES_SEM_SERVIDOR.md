# Alterações Temporárias para Testes sem Servidor

Este arquivo documenta as alterações feitas temporariamente para permitir testes do frontend sem o backend.

## Alterações Realizadas:

### 1. ProtectedRoute.js
- Desabilitado a verificação de token
- Todas as rotas agora são acessíveis

### 2. Login.js
- Substituído o login real por uma simulação
- Gera tokens fake para não quebrar outras funções

### 3. Register.js
- Substituído registro real por simulação
- Desabilitado handleNext que valida step 1 no servidor

### 4. Form.js
- Desabilitado fetchPersonalData no useEffect
- Desabilitado savePartialData (salva apenas no console)
- Desabilitado handleSubmit real (apenas mostra alert de sucesso)

### 5. Menu.js
- Desabilitado fetchPersonalData
- Permite navegação livre entre páginas

### 6. LoanApply.js
- Desabilitado envio real da solicitação
- Mostra apenas alert de sucesso

## Para Reativar o Servidor:

1. Remover ou comentar as linhas que dizem "Desabilitado temporariamente para testes sem servidor"
2. Descomentar o código original em cada arquivo
3. Reativar a verificação de token no ProtectedRoute.js
4. Configurar a URL do backend no arquivo .env

## Arquivos Alterados:
- src/ProtectedRoute.js
- src/Login.js
- src/Register.js
- src/Form.js
- src/Menu.js
- src/LoanApply.js
