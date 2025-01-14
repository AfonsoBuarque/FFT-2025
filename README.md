# FFT Site 2025 - Sistema de Gestão para Igrejas

## Visão Geral
O FFT Site 2025 é uma aplicação web moderna desenvolvida para auxiliar igrejas na gestão de membros, visitantes e atividades. Construída com React, TypeScript e Vite, a aplicação oferece uma interface intuitiva e responsiva.

## Tecnologias Principais
- React 18.3
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Firebase
- React Router DOM
- React Hook Form
- Chart.js

## Funcionalidades Principais

### 1. Landing Page
- Header com navegação principal
- Seção de Features destacando principais funcionalidades
- Exibição de igrejas parceiras
- Demonstração de chat interativo
- Outros projetos relacionados
- Seção CTA (Call to Action)
- Chat integrado com Typebot

### 2. Área Administrativa
- Dashboard com métricas e visualizações
- Gestão completa de membros
  - Cadastro de novos membros
  - Listagem de membros
  - Edição de informações
  - Detalhes individuais de membros
- Sistema de visitantes
- Configurações do sistema

### 3. Gestão de Perfil
- Completar perfil
- Atualizar informações do perfil
- Autenticação segura

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── config/        # Configurações do projeto
├── contexts/      # Contextos React (ex: AuthContext)
├── hooks/         # Hooks personalizados
├── lib/           # Bibliotecas e utilidades
├── pages/         # Páginas principais
├── services/      # Serviços externos
└── utils/         # Funções utilitárias
```

## Requisitos do Sistema
- Node.js (versão LTS recomendada)
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
- Crie um arquivo `.env` baseado no `.env.example`
- Configure as credenciais necessárias (Supabase, Firebase, etc.)

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run lint`: Executa a verificação de linting
- `npm run preview`: Visualiza a build de produção localmente

## Segurança
- Rotas protegidas com autenticação
- Integração segura com Supabase e Firebase
- Validação de formulários com React Hook Form

## UI/UX
- Design responsivo com Tailwind CSS
- Componentes modernos e interativos
- Feedback visual através de toasts
- Background com efeito de ondas

## Integração com Serviços
- Supabase para banco de dados e autenticação
- Firebase para recursos adicionais
- Typebot para chat interativo
- Chart.js para visualizações de dados

## Manutenção e Suporte
- Sistema de ESLint configurado
- TypeScript para maior segurança e manutenibilidade
- Estrutura modular para fácil expansão

## Próximos Passos
1. Implementar testes automatizados
2. Adicionar mais integrações com serviços externos
3. Expandir funcionalidades do dashboard
4. Melhorar a documentação de API

---

Para mais informações ou suporte, entre em contato com a equipe de desenvolvimento.
