# Controle de Gastos

Aplicação web para registrar, visualizar e analisar gastos por categoria e data, com foco em uma UI moderna e fácil de entender até para usuário leigo.

Construído com **React + TypeScript + Vite + Tailwind CSS + Recharts**.

---

## 🎯 Objetivo

Ser um painel simples, mas com “cara de sistema”, para:

- Cadastrar gastos do dia a dia
- Visualizar onde o dinheiro está indo
- Ter um resumo rápido em cards e gráficos

É um projeto pensado tanto para uso pessoal quanto para **portfólio de desenvolvimento front-end**.

---

## 🧰 Stack técnica

- **React** (com Vite)
- **TypeScript**
- **Tailwind CSS** (estilização e componentes utilitários)
- **Recharts** (gráfico de gastos por categoria)
- **uuid** (geração de IDs únicos para os lançamentos)
- **Node / npm** para gerenciamento de dependências

---

## ⚙️ Funcionalidades

- Cadastro de gastos com:
  - Data
  - Descrição
  - Valor
  - Categoria
- Listagem de lançamentos em tabela
  - Ações de remoção por linha
- Filtros:
  - Por data
  - Por categoria
- Categorias personalizáveis
  - Lista inicial com categorias padrão
  - Campo para criar novas categorias
- Cards de resumo:
  - Total geral de gastos
  - Total filtrado conforme filtros ativos
  - Quantidade de lançamentos
  - Categoria com maior soma de gastos
- Gráfico:
  - Gastos por categoria, usando **Recharts (BarChart)**
- UI:
  - Layout em estilo dashboard
  - Cards com sombra, bordas arredondadas
  - Inputs e selects estilizados com Tailwind
  - Scrollbar customizada

---

## 🏗 Estrutura básica do projeto

```bash
Controle-de-Gastos
├─ src
│  ├─ assets/          # Imagens e recursos estáticos (se houver)
│  ├─ components/      # Componentes reutilizáveis (inputs, buttons, etc.)
│  ├─ App.tsx          # Componente principal / dashboard
│  ├─ main.tsx         # Ponto de entrada do React
│  └─ index.css        # Tailwind + estilos globais/componentes
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
