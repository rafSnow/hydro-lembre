# Roadmap — HydroLembre PWA
**Versão:** 1.0 | **Data:** 05/05/2026  
**Metodologia:** Sprints de 1 semana | **Total:** 10 Sprints

---

## Visão Geral das Fases

| Fase | Sprints | Foco |
|------|---------|------|
| Fase 1 — Fundação | 1–3 | Setup, banco de dados, estrutura base |
| Fase 2 — Core | 4–6 | Dashboard, registro de água, notificações |
| Fase 3 — Enriquecimento | 7–8 | Histórico, estatísticas, gráficos |
| Fase 4 — Polimento | 9–10 | Configurações completas, PWA, exportação, ajustes finais |

---

## Fase 1 — Fundação

### Sprint 1 — Setup do Projeto e Estrutura Base
**Duração:** 1 semana  
**Objetivo:** Projeto Next.js funcionando com roteamento, Tailwind e estrutura de diretórios definida.

**Entregáveis:**
- [ ] Projeto Next.js 14 (App Router) criado com TypeScript
- [ ] Tailwind CSS configurado com tema personalizado (variáveis de cor, dark mode por classe)
- [ ] Estrutura de diretórios conforme arquitetura (`/app`, `/lib`, `/hooks`, `/components`)
- [ ] Rotas definidas: `/onboarding`, `/dashboard`, `/historico`, `/estatisticas`, `/configuracoes`
- [ ] Layout raiz (`layout.tsx`) com metadados PWA básicos (viewport, theme-color)
- [ ] BottomNav component (navegação inferior, mobile-first)
- [ ] AppShell component (wrapper de layout com área de conteúdo)
- [ ] Página placeholder para cada rota
- [ ] Lint (ESLint) e formatação (Prettier) configurados
- [ ] Repositório Git inicializado com `.gitignore` adequado

**Critério de aceite:** App roda localmente, navega entre as 5 rotas, layout mobile responsivo visível.

---

### Sprint 2 — Banco de Dados e Camada de Repositórios
**Duração:** 1 semana  
**Objetivo:** Dexie.js configurado com schema completo e todos os repositórios implementados e testados manualmente.

**Entregáveis:**
- [ ] Dexie.js e dexie-react-hooks instalados e configurados
- [ ] `db/index.ts` — instância singleton da HydroLembreDB
- [ ] `db/schema.ts` — schema v1 com as 5 tabelas (`profile`, `records`, `settings`, `goals`, `streaks`)
- [ ] `db/types.ts` — interfaces TypeScript para todas as entidades
- [ ] `profileRepository.ts` — CRUD de perfil (get, create, update)
- [ ] `recordRepository.ts` — CRUD de registros (add, getToday, getByDate, getByPeriod, delete, update)
- [ ] `settingsRepository.ts` — get/set por chave, getAll, upsert
- [ ] `goalRepository.ts` — get/set meta por data
- [ ] `streakRepository.ts` — get/update cache de streak
- [ ] `storageUtils.ts` — `requestPersistentStorage()` chamado na inicialização
- [ ] Teste manual via DevTools: popular banco e verificar dados persistindo

**Critério de aceite:** É possível gravar e recuperar dados das 5 tabelas via DevTools > Application > IndexedDB.

---

### Sprint 3 — Onboarding
**Duração:** 1 semana  
**Objetivo:** Fluxo de onboarding completo com 5 etapas, salvando perfil e configurações no Dexie.

**Entregáveis:**
- [ ] `useOnboarding.ts` — hook de controle de steps (step atual, avançar, voltar, pular)
- [ ] `OnboardingShell.tsx` — wrapper com stepper visual (indicador de progresso)
- [ ] `StepName.tsx` — campo de nome (opcional, com skip)
- [ ] `StepGoal.tsx` — campo de peso + cálculo automático de meta + campo de meta manual
- [ ] `StepCup.tsx` — seleção de volume padrão do recipiente (opções pré-definidas + customizado)
- [ ] `StepReminders.tsx` — toggle de lembrete, intervalo, horário início/fim
- [ ] `StepPermission.tsx` — solicita permissão de notificação, trata denied, explica limitação iOS
- [ ] Ao concluir: salva `profile` e `settings` no Dexie, seta `onboarding_done = true`
- [ ] Redirect automático de `/` para `/onboarding` se `onboarding_done = false`
- [ ] Redirect de `/onboarding` para `/dashboard` se já concluído
- [ ] Validações de formulário (meta mínima 500 ml, máxima 6000 ml)

**Critério de aceite:** Usuário novo completa onboarding em menos de 2 minutos. Dados aparecem no IndexedDB após conclusão.

---

## Fase 2 — Core

### Sprint 4 — Dashboard e Registro Rápido
**Duração:** 1 semana  
**Objetivo:** Tela principal funcional com registro de água e feedback visual de progresso.

**Entregáveis:**
- [ ] `useHydration.ts` — total do dia, meta, progresso %, restante, goalReached; `addWater(ml)`
- [ ] `HydrationRing.tsx` — anel circular animado com % e ml no centro
- [ ] `QuickAddButton.tsx` — botão principal que adiciona volume padrão do perfil
- [ ] `VolumeShortcuts.tsx` — grade de botões de volume rápido (150, 200, 300, 500 ml + customizados)
- [ ] `CustomVolumeInput.tsx` — campo numérico + botão "Adicionar" para volume personalizado
- [ ] `TodayRecordsList.tsx` — lista dos últimos 3 registros do dia com horário e volume
- [ ] Animação/feedback visual ao registrar (incremento suave no anel)
- [ ] Toast/Snackbar com volume adicionado e opção de "Desfazer" (5 segundos)
- [ ] Mensagem motivacional que muda conforme progresso (0%, 25%, 50%, 75%, 100%)
- [ ] Exibição de "Meta atingida! 🎉" quando goalReached = true
- [ ] Detecção de virada de dia (comparar data atual com data do último registro)

**Critério de aceite:** Registrar água em 1 toque, progresso atualiza instantaneamente, desfazer funciona, dados persistem ao fechar e reabrir.

---

### Sprint 5 — Notificações e Lembretes
**Duração:** 1 semana  
**Objetivo:** Sistema de lembretes funcionando com janela de horário, respeitando permissão e detecção de iOS.

**Entregáveis:**
- [ ] `notificationManager.ts` — solicita permissão, verifica estado, dispara notificação
- [ ] `reminderScheduler.ts` — classe com `start()`, `stop()`, verificação de janela de horário
- [ ] `useReminders.ts` — hook que inicia/para scheduler conforme settings do Dexie
- [ ] Scheduler iniciado no `layout.tsx` (ou em `_app`) após verificar permissão
- [ ] Detecção de iOS sem suporte: banner "Instale o app na home screen para receber lembretes"
- [ ] Quando meta é atingida: opção de pausar lembretes do dia automaticamente
- [ ] Ícone na BottomNav ou header indicando se lembretes estão ativos
- [ ] Próximo lembrete exibido no Dashboard ("Próximo lembrete em X minutos")
- [ ] Notificação com ação de "Já bebi!" (NotificationAction) — onde suportado
- [ ] Tratamento de "denied": exibe aviso claro + como reativar nas configurações do browser

**Critério de aceite:** Notificação dispara no intervalo correto, respeita horário início/fim, não dispara quando meta atingida (se configurado).

---

### Sprint 6 — Gerenciamento de Registros e Configurações de Perfil
**Duração:** 1 semana  
**Objetivo:** Edição e exclusão de registros, e tela de configurações de perfil e lembretes funcionais.

**Entregáveis:**
- [ ] Tela de detalhe do dia (`/historico/[date]`) com lista completa de registros
- [ ] Swipe-to-delete (mobile) e botão de deletar (desktop) com confirmação via Snackbar + Desfazer
- [ ] Modal de edição de volume de registro individual
- [ ] `useSettings.ts` — leitura/escrita reativa de configurações no Dexie
- [ ] `ProfileSection.tsx` — editar nome, peso, meta diária, recipiente padrão
- [ ] `RemindersSection.tsx` — toggle, intervalo, horário início/fim, mensagem customizada
- [ ] `QuickVolumesSection.tsx` — adicionar, remover e reordenar volumes rápidos
- [ ] Ao salvar settings: atualiza scheduler de lembretes imediatamente
- [ ] Validações em todos os campos de configuração
- [ ] Botão "Salvar" com feedback visual de sucesso

**Critério de aceite:** Editar e excluir registros reflete imediatamente no dashboard. Mudança de configurações de lembrete aplicada sem reiniciar o app.

---

## Fase 3 — Enriquecimento

### Sprint 7 — Histórico e Gráficos
**Duração:** 1 semana  
**Objetivo:** Tela de histórico completa com seletor de período, gráfico de barras e lista de dias.

**Entregáveis:**
- [ ] `useHistory.ts` — agrega registros por dia, calcula total e status de meta por período
- [ ] `PeriodSelector.tsx` — toggle: 7 dias / 30 dias / mês atual / customizado (date range picker)
- [ ] `HydrationChart.tsx` — gráfico de barras (Recharts) com barra colorida por meta atingida/não
- [ ] `DayListItem.tsx` — linha de dia: data, total ml, barra de progresso mini, ícone ✅/❌
- [ ] Scroll infinito ou paginação na lista de dias (30 por página)
- [ ] Empty state para período sem registros
- [ ] Tela de detalhe do dia acessível via tap em DayListItem
- [ ] Formatação de datas em pt-BR (ex.: "Seg, 05 mai")
- [ ] Indicador de média do período no topo do gráfico

**Critério de aceite:** Histórico de 30 dias renderiza sem travar. Gráfico diferencia visualmente dias com e sem meta atingida.

---

### Sprint 8 — Estatísticas e Streak
**Duração:** 1 semana  
**Objetivo:** Painel de estatísticas com streak, médias e tendência.

**Entregáveis:**
- [ ] `useStreak.ts` — calcula streak atual e best streak com cache no Dexie (`streaks` table)
- [ ] Lógica de recálculo de streak na virada do dia e ao registrar água
- [ ] `StreakCard.tsx` — streak atual (com animação de chama 🔥) e melhor streak (troféu 🏆)
- [ ] `AverageCard.tsx` — média diária últimos 7 dias e últimos 30 dias
- [ ] Card de total acumulado histórico (em litros)
- [ ] Card de dia com maior consumo (data + volume)
- [ ] Card de total de dias monitorados
- [ ] `TrendChart.tsx` — gráfico de linha (Recharts) com tendência de 30 dias + linha da meta
- [ ] Empty state para menos de 3 dias de dados
- [ ] Animação de entrada nos cards ao abrir a tela

**Critério de aceite:** Streak calculado corretamente mesmo com dias sem registro. Estatísticas batem com o histórico.

---

## Fase 4 — Polimento

### Sprint 9 — PWA Completo, Tema e Acessibilidade
**Duração:** 1 semana  
**Objetivo:** App instalável como PWA, tema claro/escuro, acessibilidade e performance.

**Entregáveis:**
- [ ] `manifest.json` completo (ícones, screenshots, shortcuts, display standalone)
- [ ] Ícones maskable gerados (192, 384, 512)
- [ ] next-pwa + Workbox configurados com estratégias de cache definitivas
- [ ] Banner customizado de instalação ("Instale o HydroLembre") com lógica de 7 dias de supressão
- [ ] Banner de "Nova versão disponível — Atualizar" ao detectar SW atualizado
- [ ] `ThemeContext.tsx` — tema claro/escuro/sistema + persistência no Dexie
- [ ] `AppearanceSection.tsx` nas configurações com seletor de tema
- [ ] Todos os componentes interativos com `aria-label` e navegação por teclado
- [ ] Contraste verificado (mínimo 4.5:1) em ambos os temas
- [ ] Lazy loading das rotas secundárias (histórico, estatísticas, configurações)
- [ ] Lighthouse PWA score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 90

**Critério de aceite:** App instalável no Android Chrome. Funciona 100% offline. Tema escuro sem flicker. Score Lighthouse ≥ 90 em PWA e Acessibilidade.

---

### Sprint 10 — Exportação, Importação, QA Final e Deploy
**Duração:** 1 semana  
**Objetivo:** Exportação/importação de dados, DataSection completa, QA completo e deploy em produção.

**Entregáveis:**
- [ ] `exportService.ts` — exporta histórico como CSV e JSON para download
- [ ] `importService.ts` — valida schema JSON, resolve conflitos de ID, opções mesclar/substituir
- [ ] `DataSection.tsx` — botões exportar CSV, exportar JSON, importar JSON, limpar histórico, limpar tudo
- [ ] Modal de confirmação dupla para "Limpar tudo" (digitar "CONFIRMAR")
- [ ] Testes manuais de todos os fluxos críticos (ver CAs do LRS)
- [ ] Teste em: Chrome Android, Chrome Desktop, Edge, Firefox, Safari iOS 16.4+
- [ ] Correção de bugs encontrados no QA
- [ ] `robots.txt` e `sitemap.xml` básicos
- [ ] Deploy em produção (Vercel ou Netlify) com HTTPS
- [ ] Verificação final do Lighthouse (todas as categorias)
- [ ] README do projeto atualizado com instruções de desenvolvimento e deploy

**Critério de aceite:** Todos os 10 critérios de aceitação do LRS validados. App publicado em HTTPS. Exportação e importação de dados funcionando.

---

## Resumo de Entregáveis por Sprint

| Sprint | Nome | Principais Entregáveis |
|--------|------|------------------------|
| 1 | Setup e Estrutura | Next.js, Tailwind, rotas, BottomNav, AppShell |
| 2 | Banco de Dados | Dexie schema, 5 repositórios, tipos TypeScript |
| 3 | Onboarding | 5 steps, validações, salvamento de perfil |
| 4 | Dashboard | Anel de progresso, registro rápido, atalhos, desfazer |
| 5 | Notificações | Scheduler, janela de horário, suporte iOS, ações |
| 6 | Gerenciamento | Editar/excluir registros, configurações de perfil e lembretes |
| 7 | Histórico | Gráfico de barras, lista de dias, filtro de período |
| 8 | Estatísticas | Streak, médias, acumulado, gráfico de tendência |
| 9 | PWA e Polimento | Manifest, SW, tema, acessibilidade, Lighthouse |
| 10 | Finalização | Exportação, importação, QA, deploy |

---

## Dependências entre Sprints

```
Sprint 1 ──► Sprint 2 ──► Sprint 3 ──► Sprint 4
                                            │
                                       Sprint 5
                                            │
                                       Sprint 6
                                       /       \
                               Sprint 7       Sprint 8
                                       \       /
                                       Sprint 9
                                            │
                                       Sprint 10
```

---

*Roadmap gerado em 05/05/2026. Ajustar prioridades conforme feedback de cada sprint review.*
