# HydroLembre 💧

HydroLembre é um Progressive Web App (PWA) offline-first para controle e incentivo da ingestão diária de água. O sistema roda inteiramente no dispositivo do usuário — sem servidor, sem banco de dados remoto, sem autenticação online.

![screenshot]

## ✨ Funcionalidades

- **Onboarding Personalizado:** Cálculo de meta diária baseada no seu peso ou meta manual.
- **Registro Rápido:** Adicione água com apenas um toque usando atalhos de volume ou o botão principal.
- **Lembretes Inteligentes:** Notificações periódicas para você não esquecer de beber água (Web Notifications API).
- **Histórico e Gráficos:** Acompanhe seu consumo nos últimos 7 e 30 dias com visualizações claras.
- **Estatísticas e Streaks:** Mantenha sua sequência (streak) de dias atingindo a meta e veja suas médias.
- **Offline-First:** Funciona integralmente sem internet após a instalação.
- **Exportação/Importação:** Backup em JSON e exportação de registros em CSV para Excel.
- **Tema Escuro/Claro:** Suporte nativo a temas, respeitando as configurações do seu sistema.

## 🚀 Stack Tecnológica

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Persistência:** [Dexie.js](https://dexie.org/) (IndexedDB)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **PWA:** [next-pwa](https://github.com/shadowwalker/next-pwa) (Workbox)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Datas:** [date-fns](https://date-fns.org/)

## 🛠️ Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/hydro-lembre.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Build e Deploy

### Build para Produção
```bash
npm run build
```

### Deploy na Vercel
O HydroLembre é otimizado para a [Vercel](https://vercel.com/). Você pode fazer o deploy conectando seu repositório do GitHub ou usando o CLI da Vercel:
```bash
vercel
```

## 📁 Estrutura de Diretórios Resumida

```
src/
├── app/          # Rotas e layouts (Next.js App Router)
├── components/   # Componentes UI e Features
├── contexts/     # Contextos globais (Tema)
├── hooks/        # Hooks customizados e lógica de negócio
├── lib/          # Banco de dados, notificações e serviços
└── styles/       # Estilos globais e Tailwind
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido com 💧 por [Seu Nome]
