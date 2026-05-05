# Levantamento de Requisitos de Software
## HydroLembre — PWA de Hidratação Pessoal
**Versão:** 1.0  
**Data:** 05/05/2026  
**Stack:** Next.js (App Router) · Dexie.js (IndexedDB) · PWA · Sem Backend

---

## 1. Visão Geral do Produto

### 1.1 Descrição
HydroLembre é um Progressive Web App (PWA) offline-first para controle e incentivo da ingestão diária de água. O sistema roda inteiramente no dispositivo do usuário — sem servidor, sem banco de dados remoto, sem autenticação online. Toda persistência é feita via IndexedDB com Dexie.js.

### 1.2 Objetivo Principal
Auxiliar o usuário a atingir sua meta diária de ingestão de água por meio de lembretes periódicos (Web Notifications API), registro rápido de consumo e acompanhamento visual do progresso.

### 1.3 Público-Alvo
Qualquer pessoa adulta que deseja monitorar a ingestão de água pelo celular ou desktop, sem precisar criar conta em serviço externo.

### 1.4 Plataformas-Alvo
- Mobile (Android Chrome / Samsung Internet)
- Desktop (Chrome, Edge, Firefox)
- iOS Safari (com limitações de notificação — ver RNF-07)

---

## 2. Requisitos Funcionais

### RF-01 — Configuração do Perfil de Hidratação
**Prioridade:** Alta  
O usuário deve poder configurar seu perfil de hidratação, informando:
- Nome (opcional, para personalização)
- Peso corporal (kg) — usado para calcular meta automática (35 ml/kg)
- Meta diária personalizada (ml) — pode sobrescrever o cálculo automático
- Volume do recipiente padrão (ml) — ex.: copo de 200 ml, garrafa de 500 ml

**Regra:** Se o peso for informado e nenhuma meta manual for definida, o sistema calcula a meta como `peso × 35 ml`. O usuário pode editar a meta a qualquer momento.

---

### RF-02 — Registro de Consumo de Água
**Prioridade:** Alta  
O usuário deve poder registrar a ingestão de água de forma rápida.  
Formas de registro:
- **Botão rápido:** adiciona o volume do recipiente padrão com um toque
- **Botão com volume personalizado:** permite informar quantidade específica em ml (campo numérico)
- **Atalhos pré-definidos:** botões de volume fixo (ex.: 150 ml, 200 ml, 300 ml, 500 ml)

Cada registro deve armazenar: `id`, `volume_ml`, `timestamp`, `data_ref` (YYYY-MM-DD).

---

### RF-03 — Visualização do Progresso Diário
**Prioridade:** Alta  
A tela principal deve exibir:
- Total consumido no dia atual (ml e %)
- Meta diária (ml)
- Barra ou indicador visual de progresso
- Quantidade restante para atingir a meta
- Número de registros feitos no dia

---

### RF-04 — Histórico de Consumo
**Prioridade:** Alta  
O usuário deve visualizar histórico de consumo com:
- Listagem por dia (mais recente primeiro)
- Total diário consumido vs. meta
- Indicador visual de sucesso/falha da meta do dia
- Filtro por período: últimos 7 dias, últimos 30 dias, mês atual, intervalo customizado

---

### RF-05 — Gráfico de Evolução
**Prioridade:** Média  
Exibir gráfico de barras ou de linha com a evolução da ingestão diária no período selecionado (mínimo 7 dias). Destacar visualmente os dias em que a meta foi atingida.

---

### RF-06 — Configuração de Lembretes (Notificações)
**Prioridade:** Alta  
O usuário deve poder configurar lembretes periódicos para beber água:
- Ativar/desativar lembretes
- Intervalo entre lembretes (opções: 30 min, 1h, 1h30, 2h, ou customizado em minutos)
- Horário de início do lembrete (ex.: 07:00)
- Horário de fim do lembrete (ex.: 22:00) — sistema não notifica fora desse intervalo
- Mensagem personalizada do lembrete (opcional)

**Implementação:** Web Notifications API + `setInterval` enquanto o app estiver aberto, ou Service Worker com Periodic Background Sync (onde suportado).

---

### RF-07 — Gerenciamento de Registros
**Prioridade:** Média  
O usuário deve poder:
- Visualizar todos os registros do dia atual em lista cronológica
- Excluir um registro individualmente (com confirmação)
- Editar o volume de um registro existente

---

### RF-08 — Metas Diárias por Dia da Semana (Opcional / Fase 2)
**Prioridade:** Baixa  
Permitir metas diferentes por dia da semana (ex.: dias de treino = meta maior).

---

### RF-09 — Estatísticas Gerais
**Prioridade:** Média  
Exibir painel com estatísticas agregadas:
- Melhor sequência (streak) de dias com meta atingida
- Sequência atual
- Média de consumo diário (últimos 30 dias)
- Dia com maior consumo registrado
- Total de dias monitorados

---

### RF-10 — Exportação de Dados
**Prioridade:** Baixa  
Permitir exportar histórico em formato CSV ou JSON para que o usuário mantenha cópia dos próprios dados.

---

### RF-11 — Importação de Dados
**Prioridade:** Baixa  
Permitir importar arquivo JSON previamente exportado para restaurar dados em outro dispositivo.

---

### RF-12 — Reset Diário Automático
**Prioridade:** Alta  
O sistema deve detectar automaticamente a virada do dia (meia-noite local) e resetar o contador do dia atual para zero, sem apagar o histórico anterior.

---

### RF-13 — Onboarding
**Prioridade:** Alta  
Na primeira execução, exibir fluxo de boas-vindas guiado para:
1. Informar o nome (opcional)
2. Informar peso ou meta manual
3. Definir volume do recipiente padrão
4. Configurar horário e intervalo de lembretes
5. Solicitar permissão de notificação

---

### RF-14 — Tema Visual (Claro/Escuro)
**Prioridade:** Média  
Suportar tema claro e escuro. Detectar preferência do sistema (`prefers-color-scheme`) e permitir alternância manual.

---

### RF-15 — Suporte Offline Completo
**Prioridade:** Alta  
O aplicativo deve funcionar integralmente sem conexão com a internet após a instalação como PWA. Todos os dados e lógica residem no cliente.

---

## 3. Requisitos Não-Funcionais

### RNF-01 — Performance
- Tempo de carregamento inicial (LCP): < 2,5 s em conexão 4G
- Interações principais (registro de consumo): feedback visual em < 100 ms
- Consultas ao Dexie.js: < 50 ms para operações típicas do dia atual

### RNF-02 — Usabilidade
- Interface deve ser operável com uma mão no mobile
- O botão de registro rápido deve ser o elemento mais proeminente da tela principal
- Deve ser possível registrar consumo em no máximo 2 toques a partir de qualquer tela

### RNF-03 — Confiabilidade dos Dados
- Nenhum dado deve ser perdido por falha de navegação ou fechamento do app
- Todas as escritas no Dexie.js devem usar transações (`db.transaction`)
- Não deve haver corrupção de dados em caso de fechamento abrupto do navegador

### RNF-04 — Privacidade
- Nenhum dado do usuário deve ser enviado a servidores externos
- Nenhuma telemetria, analytics ou rastreamento deve ser implementado
- Dados ficam exclusivamente no IndexedDB local do dispositivo

### RNF-05 — Compatibilidade de Navegadores
- Chrome 90+ (Android e Desktop)
- Edge 90+
- Firefox 90+
- Safari 15+ (iOS — com restrições de notificação)
- Samsung Internet 14+

### RNF-06 — Responsividade
- Layout deve ser fluido e utilizável em telas de 320 px a 1920 px de largura
- Design mobile-first

### RNF-07 — Limitações iOS / Safari
- No iOS, notificações Web Push só são suportadas a partir do iOS 16.4 com app instalado na home screen
- O app deve informar ao usuário essa limitação quando detectar Safari/iOS sem suporte
- Deve oferecer alternativa: lembrete visual ao abrir o app ("Você bebeu água hoje?")

### RNF-08 — Acessibilidade
- Seguir nível AA das WCAG 2.1
- Todos os elementos interativos devem ter label acessível (`aria-label`)
- Suporte a navegação por teclado
- Contraste mínimo de 4.5:1 para texto normal

### RNF-09 — Manutenibilidade
- Código organizado em módulos por feature (Feature-First)
- Camada de acesso ao Dexie.js isolada em repositórios (`/lib/db/`)
- Nenhum acesso direto ao IndexedDB fora da camada de repositório

### RNF-10 — Tamanho do Bundle
- Bundle JS inicial: < 200 KB gzipped
- Utilizar lazy loading para telas secundárias (histórico, estatísticas, configurações)

---

## 4. Requisitos de PWA

### RPWA-01 — Web App Manifest
O arquivo `manifest.json` deve conter:
- `name`: "HydroLembre"
- `short_name`: "HydroLembre"
- `start_url`: "/"
- `display`: "standalone"
- `background_color` e `theme_color` alinhados ao design
- Ícones em: 192×192, 384×384, 512×512 (PNG + maskable)
- `screenshots` para prompt de instalação enriquecido (Chrome)

### RPWA-02 — Service Worker
- Estratégia de cache: **Cache First** para assets estáticos (JS, CSS, fontes, ícones)
- Estratégia: **Network First** com fallback para cache em rotas de página
- Implementado com **Workbox** (via `next-pwa` ou configuração manual)
- O SW deve ser atualizado automaticamente quando nova versão for publicada
- Exibir banner de "Nova versão disponível — Atualizar" ao detectar SW atualizado

### RPWA-03 — Instalabilidade
- Atender a todos os critérios de instalabilidade do Chrome (HTTPS, manifest, SW registrado)
- Exibir banner de instalação customizado no primeiro uso (após 30 segundos de uso ou após 1 registro)
- Não exibir novamente por 7 dias se o usuário dispensar

### RPWA-04 — HTTPS
- O app deve ser servido exclusivamente sobre HTTPS em produção

### RPWA-05 — Ícone Maskable
- Pelo menos um ícone com `purpose: "maskable"` para adaptação ao shape do dispositivo

---

## 5. Modelo de Dados (Dexie.js / IndexedDB)

### 5.1 Schema do Banco

```javascript
// db.js — Dexie schema
const db = new Dexie('hydrolembre');

db.version(1).stores({
  profile:    '++id, createdAt',
  records:    '++id, date, timestamp',
  goals:      '++id, date',
  settings:   '++id, key',
  streaks:    '++id, updatedAt',
});
```

---

### 5.2 Tabela: `profile`
Armazena o perfil único do usuário.

| Campo            | Tipo    | Obrigatório | Descrição                             |
|------------------|---------|-------------|---------------------------------------|
| id               | number  | Sim (auto)  | Chave primária                        |
| name             | string  | Não         | Nome opcional do usuário              |
| weight_kg        | number  | Não         | Peso em kg                            |
| daily_goal_ml    | number  | Sim         | Meta diária em ml                     |
| default_cup_ml   | number  | Sim         | Volume padrão do copo/recipiente      |
| onboarding_done  | boolean | Sim         | Flag de onboarding concluído          |
| createdAt        | Date    | Sim         | Data de criação do perfil             |
| updatedAt        | Date    | Sim         | Data da última atualização            |

---

### 5.3 Tabela: `records`
Cada linha representa um registro de ingestão de água.

| Campo      | Tipo   | Obrigatório | Descrição                              |
|------------|--------|-------------|----------------------------------------|
| id         | number | Sim (auto)  | Chave primária                         |
| volume_ml  | number | Sim         | Quantidade ingerida em ml              |
| date       | string | Sim         | Data de referência (YYYY-MM-DD)        |
| timestamp  | Date   | Sim         | Data/hora exata do registro            |
| note       | string | Não         | Observação opcional                    |

**Índices:** `date` (para queries por dia), `timestamp` (para ordenação)

---

### 5.4 Tabela: `settings`
Armazena configurações chave-valor (apenas 1 registro de settings por chave).

| Chave                  | Tipo    | Descrição                                       |
|------------------------|---------|-------------------------------------------------|
| reminders_enabled      | boolean | Lembretes ativos ou não                         |
| reminder_interval_min  | number  | Intervalo entre lembretes em minutos            |
| reminder_start_time    | string  | Horário início dos lembretes (HH:MM)            |
| reminder_end_time      | string  | Horário fim dos lembretes (HH:MM)               |
| reminder_message       | string  | Mensagem personalizada do lembrete              |
| theme                  | string  | "light" \| "dark" \| "system"                  |
| notification_permission| string  | "granted" \| "denied" \| "not_asked"            |
| quick_volumes          | number[]| Array de volumes rápidos customizados (ml)      |

---

### 5.5 Tabela: `goals`
Permite sobrescrever a meta para um dia específico (ex.: dia de treino).

| Campo     | Tipo   | Obrigatório | Descrição                      |
|-----------|--------|-------------|--------------------------------|
| id        | number | Sim (auto)  | Chave primária                 |
| date      | string | Sim         | Data (YYYY-MM-DD)              |
| goal_ml   | number | Sim         | Meta do dia em ml              |

---

### 5.6 Tabela: `streaks` (cache de estatísticas)
Cache de estatísticas calculadas para evitar recalcular a cada abertura.

| Campo           | Tipo   | Obrigatório | Descrição                          |
|-----------------|--------|-------------|------------------------------------|
| id              | number | Sim (auto)  | Chave primária                     |
| current_streak  | number | Sim         | Sequência atual de dias com meta   |
| best_streak     | number | Sim         | Melhor sequência histórica         |
| last_date       | string | Sim         | Último dia calculado               |
| updatedAt       | Date   | Sim         | Quando foi recalculado             |

---

## 6. Telas e Fluxos

### T-01 — Tela de Onboarding (first-time only)
**Fluxo:** Step 1 (nome) → Step 2 (peso/meta) → Step 3 (recipiente) → Step 4 (lembretes) → Step 5 (permissão de notificação)  
**Componentes:** Stepper, campos de entrada, botão "Próximo", botão "Pular"

---

### T-02 — Tela Principal (Dashboard)
**Seções:**
- Header: nome do usuário, data atual
- Indicador de progresso (circular ou barra) com % e ml
- Botão principal "Beber Água" (volume padrão)
- Grade de atalhos de volume rápido
- Campo para volume personalizado
- Mini-lista dos últimos 3 registros do dia com botão "ver todos"
- Status do lembrete (próximo em X minutos)

---

### T-03 — Tela de Histórico
**Seções:**
- Seletor de período (7d / 30d / mês atual / customizado)
- Gráfico de barras de consumo diário
- Lista de dias com: data, total ml, ícone de meta atingida/não atingida
- Ao expandir um dia: lista dos registros individuais com opção de exclusão

---

### T-04 — Tela de Estatísticas
**Seções:**
- Streak atual e melhor streak (com ícone de chama/troféu)
- Média diária (últimos 30 dias)
- Total acumulado histórico (litros)
- Dia com maior consumo
- Gráfico de tendência

---

### T-05 — Tela de Configurações
**Seções:**
- Perfil: nome, peso, meta diária, recipiente padrão
- Lembretes: toggle, intervalo, horário início/fim, mensagem
- Volumes rápidos: adicionar/remover/reordenar
- Aparência: tema claro/escuro/sistema
- Dados: exportar CSV, exportar JSON, importar JSON, limpar todos os dados
- Sobre: versão do app, informações de privacidade

---

### T-06 — Tela de Detalhe do Dia
Acessada a partir do histórico. Exibe todos os registros de um dia com opção de editar ou excluir cada um.

---

## 7. Regras de Negócio

### RN-01 — Cálculo da Meta
- Meta automática = peso_kg × 35 (arredondado para múltiplo de 50 mais próximo)
- Meta mínima aceita: 500 ml
- Meta máxima aceita: 6.000 ml
- Se o usuário editar a meta manualmente, a meta calculada é descartada

### RN-02 — Virada do Dia
- O "dia" é determinado pelo horário local do dispositivo
- A troca de dia é detectada comparando `new Date().toLocaleDateString('sv')` com a data do último registro
- Nenhum dado é apagado na virada; o contador do dia atual começa do zero

### RN-03 — Streak
- Um dia conta para o streak somente se `total_consumido_ml >= meta_do_dia_ml`
- O streak atual é incrementado se o dia anterior (ontem) também foi bem-sucedido
- Se o usuário não registrou nada ontem, o streak atual é quebrado e volta a 0 (exceto se hoje ainda for o mesmo dia corrente)
- O streak é recalculado ao abrir o app e ao registrar consumo

### RN-04 — Lembretes
- Lembretes só disparam dentro da janela de horário configurada (RF-06)
- Se a permissão de notificação for "denied", o sistema oferece alternativa visual
- O intervalo mínimo entre lembretes é de 15 minutos
- Lembretes param quando a meta diária é atingida (comportamento configurável: pode continuar ou parar)

### RN-05 — Exclusão de Dados
- A limpeza total de dados (settings → "Limpar tudo") exige confirmação dupla (modal + digitar "CONFIRMAR")
- A exclusão de registros individuais exige confirmação simples (snackbar com desfazer por 5 segundos)
- O perfil e as configurações são preservados na exclusão do histórico (ação separada)

### RN-06 — Volume de Registro
- Volume mínimo por registro: 1 ml
- Volume máximo por registro: 2.000 ml
- Se o usuário tentar registrar 0 ou negativo, exibir erro de validação

### RN-07 — Importação de Dados
- Ao importar, o sistema deve validar o schema do JSON antes de gravar
- Conflitos de `id` devem ser resolvidos por reinserção com novo auto-id
- O usuário escolhe entre "Mesclar" (mantém dados existentes + importados) ou "Substituir" (apaga tudo e importa)

---

## 8. Arquitetura Técnica (Alto Nível)

```
/app                        ← Next.js App Router
  /(onboarding)/            ← Rota de onboarding
  /(main)/
    page.tsx                ← Dashboard (T-02)
    historico/page.tsx      ← Histórico (T-03)
    estatisticas/page.tsx   ← Estatísticas (T-04)
    configuracoes/page.tsx  ← Configurações (T-05)
  layout.tsx

/lib
  /db
    index.ts                ← Instância Dexie (singleton)
    schema.ts               ← Definição de versões do schema
    /repositories
      profileRepository.ts
      recordRepository.ts
      settingsRepository.ts
      goalRepository.ts
      streakRepository.ts

/hooks
  useHydration.ts           ← Lógica principal do dia
  useReminders.ts           ← Controle de notificações
  useStreak.ts              ← Cálculo de streaks
  useSettings.ts            ← Acesso reativo às configurações

/components
  /ui                       ← Componentes genéricos
  /features
    /dashboard
    /history
    /stats
    /settings
    /onboarding

/public
  manifest.json
  sw.js (gerado pelo Workbox)
  /icons

next.config.js              ← Configuração next-pwa / Workbox
```

---

## 9. Dependências Principais

| Pacote           | Versão Mínima | Finalidade                              |
|------------------|---------------|-----------------------------------------|
| next             | 14.x          | Framework React com App Router          |
| react            | 18.x          | UI                                      |
| dexie            | 3.x           | Wrapper IndexedDB                       |
| dexie-react-hooks| 1.x           | Hooks reativos para Dexie               |
| next-pwa         | 5.x           | Service Worker + PWA com Workbox        |
| recharts         | 2.x           | Gráficos de histórico e estatísticas    |
| tailwindcss      | 3.x           | Estilização                             |
| date-fns         | 3.x           | Manipulação de datas                    |
| lucide-react     | latest        | Ícones                                  |

---

## 10. Restrições e Premissas

### Restrições
- **Sem backend:** nenhuma chamada de API externa a serviços de dados; somente o app Next.js estático + IndexedDB local
- **Sem autenticação:** sem login, sem conta, sem sincronização multi-dispositivo
- **Sem sincronização:** dados ficam no dispositivo; não há mecanismo de backup automático na nuvem
- **Notificações iOS:** limitadas; documentar claramente ao usuário
- **IndexedDB storage:** sujeito a limpeza pelo navegador se o storage não for marcado como persistente (`navigator.storage.persist()`) — o app deve solicitar persistência

### Premissas
- O usuário utiliza um único dispositivo principal
- O navegador suporta IndexedDB versão 2+
- O app será hospedado em servidor estático (Vercel, Netlify, GitHub Pages) com HTTPS
- A versão inicial (MVP) não inclui RF-08 (metas por dia da semana), RF-10 e RF-11 (exportação/importação) — essas funcionalidades são Fase 2

---

## 11. Critérios de Aceitação do MVP

| ID   | Critério                                                                          |
|------|-----------------------------------------------------------------------------------|
| CA-01| O usuário consegue completar o onboarding e ter uma meta definida                 |
| CA-02| O usuário consegue registrar água em no máximo 2 toques                           |
| CA-03| O progresso do dia é exibido corretamente após cada registro                      |
| CA-04| Os dados persistem após fechar e reabrir o navegador                              |
| CA-05| O app funciona offline após primeira visita                                        |
| CA-06| O app pode ser instalado na home screen (Android Chrome)                          |
| CA-07| Lembretes são disparados no intervalo configurado quando o app está aberto        |
| CA-08| O histórico dos últimos 7 dias é exibido corretamente                             |
| CA-09| O streak atual é calculado e exibido corretamente                                 |
| CA-10| É possível excluir um registro com opção de desfazer                              |

---

*Documento gerado em 05/05/2026. Revisar antes do início do desenvolvimento.*
