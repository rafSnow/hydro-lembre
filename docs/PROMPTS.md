# Prompts por Sprint — HydroLembre PWA
**Versão:** 1.0 | **Data:** 05/05/2026  
**Stack:** Next.js 14 · Dexie.js · IndexedDB · Tailwind CSS · TypeScript · PWA

> **Como usar:** Cada prompt abaixo é autocontido. Cole-o diretamente na conversa do Claude no início de cada sprint. Os prompts de sprints avançados incluem contexto das decisões anteriores para manter consistência.

---

## Sprint 1 — Setup do Projeto e Estrutura Base

```
Você é um desenvolvedor sênior especialista em Next.js 14, TypeScript e PWA.
Vamos construir o HydroLembre, um PWA offline-first de lembrete de hidratação.
Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, Dexie.js (IndexedDB), sem backend.

**Objetivo deste sprint:** Configurar o projeto base com estrutura de diretórios,
roteamento, layout mobile-first e componentes de navegação.

**Crie ou implemente:**

1. Estrutura de diretórios seguindo esta arquitetura (Feature-First):
   src/app/(onboarding)/onboarding/page.tsx
   src/app/(app)/layout.tsx
   src/app/(app)/dashboard/page.tsx
   src/app/(app)/historico/page.tsx
   src/app/(app)/historico/[date]/page.tsx
   src/app/(app)/estatisticas/page.tsx
   src/app/(app)/configuracoes/page.tsx
   src/lib/db/ (vazio por ora, apenas o diretório)
   src/hooks/
   src/components/ui/
   src/components/layout/
   src/components/features/

2. tailwind.config.ts com:
   - darkMode: 'class'
   - Paleta de cores customizada:
     primary: azul-água (#0EA5E9)
     primary-dark: (#0284C7)
     success: (#22C55E)
     warning: (#F59E0B)
     surface: (#F0F9FF) para light, (#0F172A) para dark
   - Fonte padrão: Inter (Google Fonts)

3. src/app/layout.tsx com:
   - Metadados PWA: viewport, theme-color (#0EA5E9), apple-mobile-web-app-capable
   - Link para manifest.json
   - Classe "dark" dinâmica (deixar placeholder, será implementado no Sprint 9)
   - Import do globals.css

4. src/components/layout/BottomNav.tsx:
   - 4 abas: Dashboard (ícone gota), Histórico (ícone calendário), Estatísticas (ícone gráfico), Configurações (ícone engrenagem)
   - Indicador de aba ativa
   - Mobile-first, fixo na parte inferior
   - Ícones via lucide-react
   - Highlight da aba ativa com cor primary

5. src/components/layout/AppShell.tsx:
   - Wrapper que inclui BottomNav
   - Área de conteúdo com padding-bottom para não ficar atrás da nav
   - Header opcional com título da página

6. src/app/(app)/layout.tsx usando AppShell

7. Páginas placeholder para cada rota com título da seção visível

8. public/manifest.json básico:
   name: "HydroLembre"
   short_name: "HydroLembre"
   start_url: "/"
   display: "standalone"
   background_color: "#F0F9FF"
   theme_color: "#0EA5E9"
   (ícones serão adicionados no Sprint 9)

9. .eslintrc.json e .prettierrc configurados

**Regras:**
- Todo componente com tipagem TypeScript explícita
- 'use client' apenas onde necessário
- Nenhuma lógica de negócio nos componentes de layout
- Comentários em português

**Entregue:** O código completo de cada arquivo listado acima.
```

---

## Sprint 2 — Banco de Dados e Camada de Repositórios

```
Você é um desenvolvedor sênior especialista em Dexie.js e TypeScript.
Estamos construindo o HydroLembre — PWA de hidratação, Next.js 14, sem backend.
A estrutura do projeto já existe (Sprint 1 concluído).

**Objetivo deste sprint:** Implementar a camada completa de persistência com Dexie.js.

**Contexto:**
- Todas as operações de banco devem passar pelos repositórios — nenhum componente acessa db diretamente
- Usar transações Dexie para operações de escrita críticas
- Datas são armazenadas como string "YYYY-MM-DD" para facilitar queries

**Crie os seguintes arquivos:**

### src/lib/db/types.ts
Interfaces TypeScript para:
- Profile { id?, name?, weight_kg?, daily_goal_ml, default_cup_ml, onboarding_done, createdAt, updatedAt }
- WaterRecord { id?, volume_ml, date: string, timestamp: Date, note? }
- SettingEntry { id?, key: string, value: unknown }
- Goal { id?, date: string, goal_ml: number }
- StreakCache { id?, current_streak, best_streak, last_date: string, updatedAt }
- SettingsKeys (tipo union de todas as chaves válidas de settings)
- DefaultSettings (objeto com valores padrão de todas as settings)

### src/lib/db/schema.ts
Constante com a definição do schema Dexie v1:
{ profile: '++id, createdAt', records: '++id, date, timestamp', settings: '++id, key', goals: '++id, date', streaks: '++id, updatedAt' }

### src/lib/db/index.ts
Classe HydroLembreDB extends Dexie com as 5 tables tipadas.
Singleton exportado como `db`.
Aplicar schema do schema.ts.

### src/lib/utils/dateUtils.ts
Funções:
- toDateString(date: Date): string → "YYYY-MM-DD" usando sv-SE locale
- today(): string → data de hoje como "YYYY-MM-DD"
- yesterday(): string → ontem como "YYYY-MM-DD"
- parseDate(dateStr: string): Date
- formatDisplayDate(dateStr: string): string → "Seg, 05 mai" em pt-BR
- isToday(dateStr: string): boolean
- getDaysInRange(from: string, to: string): string[] → array de datas no intervalo
- getLast7Days(): string[]
- getLast30Days(): string[]

### src/lib/utils/storageUtils.ts
- requestPersistentStorage(): Promise<boolean> — chama navigator.storage.persist()
- getStorageEstimate(): Promise<{usage: number, quota: number}> — navigator.storage.estimate()

### src/lib/db/repositories/profileRepository.ts
- getProfile(): Promise<Profile | undefined>
- createProfile(data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<number>
- updateProfile(data: Partial<Profile>): Promise<void>
- isOnboardingDone(): Promise<boolean>
- setOnboardingDone(): Promise<void>

### src/lib/db/repositories/recordRepository.ts
- addRecord(volume_ml: number, note?: string): Promise<number>
- getTodayRecords(): Promise<WaterRecord[]>
- getRecordsByDate(date: string): Promise<WaterRecord[]>
- getRecordsByPeriod(from: string, to: string): Promise<WaterRecord[]>
- getTotalByDate(date: string): Promise<number>
- getTotalsByPeriod(from: string, to: string): Promise<Record<string, number>> → { "2026-05-01": 1800, ... }
- deleteRecord(id: number): Promise<void>
- updateRecord(id: number, volume_ml: number): Promise<void>
- getAllRecords(): Promise<WaterRecord[]> — para exportação
- clearAllRecords(): Promise<void>

### src/lib/db/repositories/settingsRepository.ts
- getSetting<T>(key: SettingsKeys): Promise<T | undefined>
- setSetting<T>(key: SettingsKeys, value: T): Promise<void>
- getAllSettings(): Promise<Partial<DefaultSettings>> — retorna objeto com todas as settings
- resetSettings(): Promise<void> — volta para valores padrão

### src/lib/db/repositories/goalRepository.ts
- getGoalForDate(date: string): Promise<number | undefined>
- setGoalForDate(date: string, goal_ml: number): Promise<void>
- getGoalsForPeriod(from: string, to: string): Promise<Record<string, number>>
- deleteGoalForDate(date: string): Promise<void>

### src/lib/db/repositories/streakRepository.ts
- getStreakCache(): Promise<StreakCache | undefined>
- updateStreakCache(data: Omit<StreakCache, 'id' | 'updatedAt'>): Promise<void>

**Regras:**
- Todas as funções async com tratamento de erro (try/catch) adequado
- Nenhum acesso a db fora dos repositórios
- JSDoc em cada função explicando o que faz
- Exportar objeto com todos os métodos (não classe)

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 3 — Onboarding

```
Você é um desenvolvedor sênior especialista em React, Next.js 14 e UX mobile.
Estamos construindo o HydroLembre — PWA de hidratação.
Sprints 1 e 2 concluídos: estrutura do projeto, Dexie.js e repositórios prontos.

**Objetivo deste sprint:** Fluxo de onboarding com 5 etapas, validações, salvamento no Dexie.

**Contexto de negócio:**
- Meta automática = peso_kg × 35 ml, arredondada para múltiplo de 50 mais próximo
- Meta mínima: 500 ml | máxima: 6000 ml
- Se o usuário pular nome e peso, usar meta padrão de 2000 ml
- Recipiente padrão sugerido: 200 ml

**Crie os seguintes arquivos:**

### src/hooks/useOnboarding.ts
Estado do fluxo:
- currentStep: 1 a 5
- formData: { name, weight_kg, daily_goal_ml, default_cup_ml, reminder_enabled, interval_min, start_time, end_time, reminder_message }
- Funções: nextStep(), prevStep(), skipStep(), updateField(), submit()
- submit() deve:
  1. Salvar perfil via profileRepository
  2. Salvar settings via settingsRepository (reminders, theme: 'system')
  3. Marcar onboarding_done = true
  4. Redirecionar para /dashboard via router.push
- Função calculateGoal(weight_kg: number): number — implementar cálculo com arredondamento

### src/components/features/onboarding/OnboardingShell.tsx
- Barra de progresso no topo (step atual / total)
- Botão "Voltar" (exceto step 1)
- Área de conteúdo centralizada
- Botões "Próximo" e "Pular" no rodapé
- Animação de transição entre steps (slide horizontal)
- Header com logo/ícone de gota d'água

### src/components/features/onboarding/StepName.tsx
- Título: "Como podemos te chamar?"
- Campo de texto para nome (opcional)
- Placeholder: "Seu nome (opcional)"
- Dica: "Usaremos para personalizar sua experiência"

### src/components/features/onboarding/StepGoal.tsx
- Título: "Qual é sua meta diária?"
- Campo de peso (kg) com label
- Exibição da meta calculada automaticamente em tempo real ("Meta recomendada: 2.450 ml")
- Toggle "Definir meta manualmente"
- Quando toggle ativo: campo numérico de meta em ml
- Validação: mínimo 500, máximo 6000
- Mensagem de erro inline

### src/components/features/onboarding/StepCup.tsx
- Título: "Qual é o seu copo ou recipiente?"
- Grid de opções pré-definidas:
  🥤 Copo pequeno — 150 ml
  ☕ Copo padrão — 200 ml
  🧃 Copo grande — 300 ml
  🍶 Garrafa pequena — 500 ml
  💧 Garrafa média — 750 ml
  🚰 Garrafa grande — 1000 ml
- Opção "Outro" com campo numérico
- Seleção visual (borda colorida na opção escolhida)

### src/components/features/onboarding/StepReminders.tsx
- Título: "Quando te lembramos?"
- Toggle de ativar/desativar lembretes
- Quando ativo:
  - Seletor de intervalo: 30min, 1h, 1h30, 2h (chips selecionáveis)
  - Horário início (time input)
  - Horário fim (time input)
  - Campo de mensagem personalizada (opcional, placeholder: "Hora de beber água! 💧")
- Valores padrão: ativo, 1h, 08:00–22:00

### src/components/features/onboarding/StepPermission.tsx
- Título: "Ativar notificações"
- Ícone grande de sino/notificação
- Explicação do benefício
- Botão "Ativar Notificações" — chama Notification.requestPermission()
- Tratamento de cada resultado:
  - granted → mostra "✅ Notificações ativadas!"
  - denied → mostra aviso + instrução de como reativar + botão "Continuar sem notificações"
  - iOS sem suporte → mostra instrução de instalar na home screen
- Botão "Pular por agora"

### src/app/(onboarding)/onboarding/page.tsx
- Usa useOnboarding e renderiza o step correto
- Verificação: se onboarding_done, redirect para /dashboard

### Lógica de redirect em src/app/page.tsx
- Verifica isOnboardingDone() via profileRepository
- Redirect para /onboarding ou /dashboard conforme resultado
- Loading state enquanto verifica

**Componentes UI necessários (criar em src/components/ui/):**
- Input.tsx — input estilizado com label, error message, helper text
- Button.tsx — variantes: primary, secondary, ghost, destructive; tamanhos: sm, md, lg
- Toggle.tsx — switch on/off acessível

**Regras:**
- Validação client-side em cada step antes de avançar
- Nenhum step bloqueia o usuário (todos têm "Pular")
- Animações suaves, sem travar em dispositivos lentos
- Acessível: todos os campos com labels e aria-describedby para erros
- 'use client' nos componentes interativos

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 4 — Dashboard e Registro Rápido

```
Você é um desenvolvedor sênior especialista em React, Next.js 14, Dexie.js e UX mobile.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–3 concluídos.

Repositórios disponíveis: profileRepository, recordRepository, settingsRepository.
Hook de onboarding concluído. Dexie configurado e funcionando.

**Objetivo deste sprint:** Tela principal (Dashboard) totalmente funcional.

**Contexto de negócio:**
- Volume mínimo: 1 ml | máximo: 2000 ml por registro
- Desfazer tem janela de 5 segundos (Snackbar)
- Virada de dia: detectar por comparação de data atual com data do último registro

**Crie os seguintes arquivos:**

### src/hooks/useHydration.ts
Usando useLiveQuery do dexie-react-hooks:
- todayRecords: WaterRecord[] — live query dos registros de hoje
- totalMl: number — soma dos volumes
- goalMl: number — meta do perfil (fallback 2000)
- progressPct: number — 0 a 100
- remainingMl: number — max(goal - total, 0)
- goalReached: boolean
- defaultCupMl: number — do perfil
- isLoading: boolean
- addWater(volume_ml: number): Promise<{id: number}> — retorna o id para possível desfazer
- removeWater(id: number): Promise<void> — para ação de desfazer
- checkDayRollover(): void — verifica se virou o dia e reseta estado visual

### src/components/features/dashboard/HydrationRing.tsx
Props: { totalMl, goalMl, progressPct, goalReached, size?: 'sm'|'md'|'lg' }
- SVG circular com stroke-dasharray animado
- Centro: progressPct% em grande, totalMl abaixo menor
- Cor muda conforme progresso: cinza (0%), azul (1–99%), verde (100%)
- Animação de preenchimento suave (CSS transition)
- Quando goalReached: animação de "pulso" celebratório
- Acessível: aria-label com "X ml de Y ml consumidos hoje"

### src/components/features/dashboard/QuickAddButton.tsx
Props: { volume_ml, onAdd, isLoading }
- Botão grande e proeminente: "＋ Beber Água" com volume abaixo
- Cor: primary (#0EA5E9)
- Loading state durante adição
- Haptic feedback via navigator.vibrate([50]) quando disponível
- Tamanho mínimo de toque: 56px de altura (acessibilidade)

### src/components/features/dashboard/VolumeShortcuts.tsx
Props: { shortcuts: number[], onSelect, disabled }
- Grid 2×3 de botões de volume
- Formato: "200 ml" com ícone de gota
- Destaque visual ao tocar (press state)
- Volumes padrão se não houver customizados: [150, 200, 300, 500, 750, 1000]

### src/components/features/dashboard/CustomVolumeInput.tsx
Props: { onAdd }
- Campo numérico tipo "ml" com label
- Botão "Adicionar"
- Validação: mínimo 1, máximo 2000
- Limpa o campo após adicionar com sucesso
- Teclado numérico no mobile (inputMode="numeric")

### src/components/features/dashboard/TodayRecordsList.tsx
Props: { records: WaterRecord[], onDelete, maxItems?: number }
- Lista dos últimos N registros (padrão: 3)
- Cada item: horário formatado (HH:mm), volume em ml, ícone de gota
- Botão de excluir com confirmação via Snackbar
- Link "Ver todos os registros" quando há mais que maxItems
- Empty state: "Nenhum registro ainda hoje"

### src/components/features/dashboard/MotivationalMessage.tsx
Props: { progressPct, name? }
Mensagens por faixa:
- 0%: "Bom dia, [nome]! Vamos começar a se hidratar? 💧"
- 1–24%: "Ótimo começo! Continue assim 🌊"
- 25–49%: "Você está indo bem! Já [X]% da meta 👍"
- 50–74%: "Metade do caminho! Você está arrasando 🚀"
- 75–99%: "Quase lá! Só mais [Yml] para completar 💪"
- 100%: "Meta atingida! Parabéns pela hidratação de hoje 🎉"

### src/components/ui/Snackbar.tsx
Props: { message, actionLabel?, onAction?, duration?, onDismiss }
- Aparece na parte inferior da tela (acima da BottomNav)
- Animação de slide up/down
- Timer de auto-dismiss configurável
- Botão de ação opcional (ex.: "Desfazer")
- Máximo 1 Snackbar visível por vez (fila)
- Hook useSnackbar() para gerenciar estado

### src/app/(app)/dashboard/page.tsx
Composição de todos os componentes acima.
Layout:
- Header: "Hoje" + data formatada + ícone de sino (status lembretes)
- HydrationRing centralizado
- MotivationalMessage
- QuickAddButton
- VolumeShortcuts em grid
- CustomVolumeInput em accordion/expandível
- TodayRecordsList
Usar useHydration e useSnackbar.
Lógica de Snackbar com desfazer: ao adicionar, mostrar "Xml adicionados" com "Desfazer" por 5s.
Ao virar o dia (checkDayRollover), mostrar mensagem "Novo dia! 🌅 Meta resetada."

**Componentes UI adicionais:**
- ProgressBar.tsx — barra horizontal simples com % e cores
- Badge.tsx — pill colorido com texto

**Regras:**
- Dashboard deve renderizar o estado do dia em < 100ms
- Nenhuma leitura síncrona do IndexedDB no render path
- useLiveQuery garante reatividade — não usar useState para dados do banco
- 'use client' em todos os componentes interativos

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 5 — Notificações e Lembretes

```
Você é um desenvolvedor sênior especialista em Web APIs, PWA e React.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–4 concluídos.
Dashboard funcionando, registro de água operacional, Dexie configurado.

**Objetivo deste sprint:** Sistema de lembretes com Web Notifications API.

**Contexto:**
- Sem Service Worker de notificações por ora (Periodic Background Sync não é amplamente suportado)
- Lembretes funcionam via setInterval enquanto o app está aberto
- iOS < 16.4 ou sem app instalado: notificações não disponíveis → fallback visual

**Crie os seguintes arquivos:**

### src/lib/notifications/notificationManager.ts
- checkSupport(): { supported: boolean, reason?: string } — verifica se browser suporta Notification API, detecta iOS
- getPermission(): NotificationPermission | 'unsupported'
- requestPermission(): Promise<NotificationPermission>
- sendNotification(title: string, options?: NotificationOptions): boolean — retorna false se não disponível
- isIOS(): boolean — detecta iOS via userAgent
- needsHomeScreenInstall(): boolean — iOS sem suporte detectado

### src/lib/notifications/reminderScheduler.ts
Classe ReminderScheduler:
- start(config: { intervalMin, startTime, endTime, message }): void
  - Para qualquer scheduler ativo
  - Inicia setInterval com o intervalo correto
  - A cada tick: verifica isWithinWindow() antes de enviar
- stop(): void — clearInterval
- restart(config): void — stop + start
- isActive(): boolean
- getNextReminderIn(): number — minutos até próximo lembrete (considerando janela de horário)
- isWithinWindow(startTime: string, endTime: string): boolean
- Private: timerId, config

Singleton exportado: export const reminderScheduler = new ReminderScheduler()

### src/hooks/useReminders.ts
Usando useLiveQuery para reagir a mudanças nas settings:
- isEnabled: boolean
- intervalMin: number
- startTime, endTime: string
- message: string
- permission: NotificationPermission | 'unsupported'
- isIOSWithoutSupport: boolean
- nextReminderIn: number — atualizado a cada minuto
- requestPermission(): Promise<void>
- toggleReminders(enabled: boolean): Promise<void>
- updateConfig(partial: Partial<ReminderConfig>): Promise<void>
- Efeito: reinicia scheduler quando settings mudam
- Efeito: atualiza nextReminderIn a cada 60 segundos

### src/components/features/dashboard/ReminderStatus.tsx
Props: { useReminders result }
- Badge no header do Dashboard
- "Próximo em Xmin" quando ativo e dentro da janela
- "Fora do horário" quando fora da janela configurada
- "Lembretes desativados" com link para configurações
- Ícone de sino ativo/cortado

### src/components/features/dashboard/IOSInstallBanner.tsx
- Exibido quando needsHomeScreenInstall() = true e usuário ainda não instalou
- Instrução passo-a-passo: "Toque em Compartilhar → Adicionar à Tela de Início"
- Ilustração simples com setas
- Botão "Entendi" para dispensar (salva em settings: ios_banner_dismissed = true)
- Não exibir novamente após dismissal

### src/components/features/dashboard/GoalReachedBanner.tsx
Props: { goalReached, isReminderEnabled, onPauseReminders }
- Exibido quando goalReached = true
- Mensagem de parabéns
- Botão "Pausar lembretes de hoje" (para o scheduler até meia-noite)
- Confetti ou animação celebratória via CSS puro

### Integrar em src/app/layout.tsx (ou src/app/(app)/layout.tsx):
- Inicializar ReminderScheduler na montagem do layout
- Usar useReminders para buscar config atual e iniciar scheduler
- Não iniciar se permission !== 'granted'
- Parar scheduler ao desmontar (cleanup)

### Integrar IOSInstallBanner e ReminderStatus no Dashboard

**Regras:**
- Sempre verificar suporte antes de usar Notification API (não assume que existe)
- Nunca lançar exceção silenciosamente — logar erro no console com contexto
- Cleanup obrigatório no useEffect (clearInterval)
- Detectar iOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 6 — Gerenciamento de Registros e Configurações

```
Você é um desenvolvedor sênior especialista em React, UX de formulários e Dexie.js.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–5 concluídos.
Dashboard funcionando, notificações implementadas, Dexie com todos os repositórios.

**Objetivo deste sprint:** Edição/exclusão de registros e tela de configurações completa.

**Crie os seguintes arquivos:**

### src/hooks/useSettings.ts
- profile: Profile | undefined (useLiveQuery)
- settings: DefaultSettings (useLiveQuery de todas as settings)
- isLoading: boolean
- updateProfile(data: Partial<Profile>): Promise<void>
- updateSetting<T>(key: SettingsKeys, value: T): Promise<void>
- resetAllData(): Promise<void> — limpa records e goals (preserva profile e settings)
- resetEverything(): Promise<void> — limpa tudo, volta ao onboarding
- calculateGoal(weight_kg: number): number

### src/components/features/settings/ProfileSection.tsx
Formulário com:
- Campo nome (text)
- Campo peso em kg (number, opcional)
- Meta diária calculada automaticamente exibida abaixo do campo peso
- Toggle "Definir meta manualmente"
- Campo meta manual em ml (condicional)
- Campo recipiente padrão em ml (number)
- Botão "Salvar Perfil"
- Feedback: toast de sucesso após salvar
- Validações: meta 500–6000ml

### src/components/features/settings/RemindersSection.tsx
- Toggle ativar/desativar lembretes (atualiza scheduler imediatamente)
- Chips de intervalo: 15min, 30min, 1h, 1h30, 2h
- Campo de intervalo customizado em minutos
- Time inputs para início e fim
- Campo de mensagem personalizada
- Preview: "Você receberá lembretes a cada X das HH:MM às HH:MM"
- Botão "Testar notificação" — envia notificação imediata para teste
- Seção visível apenas quando lembretes ativados

### src/components/features/settings/QuickVolumesSection.tsx
- Lista de volumes atuais com botão de remover cada um
- Campo + botão para adicionar novo volume (validação: 1–2000ml, máximo 8 volumes)
- Botão "Restaurar padrões" (150, 200, 300, 500)
- Reordenação drag-and-drop simples (ou setas cima/baixo para acessibilidade)

### src/components/features/settings/AppearanceSection.tsx
- Título "Aparência"
- 3 opções de tema com ícone: ☀️ Claro | 🌙 Escuro | 💻 Sistema
- Seleção visual (border highlight)
- Aplicação imediata ao selecionar (sem botão salvar)
- Salva em settings: theme

### src/components/features/settings/DataSection.tsx
(Exportação/Importação será implementada no Sprint 10 — deixar seção com placeholder)
- Título "Seus Dados"
- Estatística: "X registros armazenados desde DD/MM/YYYY"
- Botão "Exportar dados" — placeholder com "Em breve"
- Botão "Importar dados" — placeholder com "Em breve"
- Separador
- Botão "Limpar histórico" (apenas records) — vermelho outline
  Modal de confirmação: "Isso apagará todos os registros. Perfil e configurações serão mantidos."
- Botão "Apagar tudo" — vermelho sólido
  Modal de confirmação dupla: "Digite CONFIRMAR para apagar todos os dados"
  Input de confirmação com validação

### src/app/(app)/configuracoes/page.tsx
- Divide as seções com título e separador visual
- Ordem: Perfil → Lembretes → Volumes rápidos → Aparência → Dados → Sobre
- Seção "Sobre": versão do app (hardcoded v1.0.0), link para "Política de privacidade" (placeholder)

### src/app/(app)/historico/[date]/page.tsx
- Header: data formatada em extenso "Segunda-feira, 05 de maio de 2026"
- Total do dia vs meta com barra de progresso
- Lista completa de registros com horário e volume
- Cada item: swipe-left (mobile) para revelar botão excluir, botão ícone de lápis para editar
- Modal de edição: campo de volume com valor atual pré-preenchido, validação, salvar/cancelar
- Exclusão com Snackbar de desfazer (5 segundos)
- Empty state: "Nenhum registro neste dia"
- Botão "← Voltar" para /historico

**Componentes UI adicionais:**
- Modal.tsx — dialog acessível com overlay, foco armadilha, fechar com Esc
- SwipeableItem.tsx — wrapper para swipe-to-action no mobile

**Regras:**
- Qualquer mudança de settings deve ser refletida imediatamente (useLiveQuery já garante)
- Ação de "Apagar tudo" deve chamar resetEverything() e redirecionar para /onboarding
- Nenhum dado é apagado sem confirmação explícita
- Labels e aria-describedby em todos os campos de formulário

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 7 — Histórico e Gráficos

```
Você é um desenvolvedor sênior especialista em React, Recharts e visualização de dados.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–6 concluídos.
Todos os repositórios funcionando, dashboard e configurações concluídos.

**Objetivo deste sprint:** Tela de histórico com gráfico de barras, filtros e lista de dias.

**Instale:** recharts, date-fns

**Crie os seguintes arquivos:**

### src/hooks/useHistory.ts
Props: { from: string, to: string }
Usando useLiveQuery:
- dailyData: Array<{ date, totalMl, goalMl, records: WaterRecord[], goalReached, pct }>
  — agrega registros por dia, busca meta do dia (goalRepository || profile.daily_goal_ml)
- periodAverage: number — média diária no período
- daysWithGoal: number — dias em que meta foi atingida
- totalConsumed: number — total do período em ml
- isLoading: boolean

### src/components/features/history/PeriodSelector.tsx
Props: { value: Period, onChange }
type Period = '7d' | '30d' | 'current-month' | 'custom'
- 4 chips selecionáveis: "7 dias", "30 dias", "Este mês", "Personalizado"
- Quando "Personalizado": exibe dois date inputs (de / até)
- Validação: "até" deve ser >= "de", máximo 365 dias de intervalo
- Atualiza o período automaticamente ao selecionar

### src/components/features/history/HydrationChart.tsx
Props: { data: DailyData[], goalMl: number }
Usando Recharts BarChart:
- Eixo X: datas abreviadas (ex: "05/mai")
- Eixo Y: volume em ml
- Barra: azul (#0EA5E9) quando meta atingida, cinza (#CBD5E1) quando não
- Linha horizontal tracejada indicando a meta
- Tooltip customizado: "DD/MM | Xml | Meta: Yml | ✅/❌"
- Responsive: usa ResponsiveContainer com height fixo de 200px
- Sem grid vertical, apenas horizontal suave
- Sem legenda (tooltip é suficiente)
- Scroll horizontal quando mais de 14 dias (ScrollableChart wrapper)

### src/components/features/history/DayListItem.tsx
Props: { date, totalMl, goalMl, goalReached, onPress }
- Data: "Seg, 05/05" | "Hoje" (se for hoje) | "Ontem" (se for ontem)
- Total: "1.800 ml" em destaque
- Mini barra de progresso horizontal
- Ícone: ✅ verde se goalReached, ❌ vermelho se totalMl > 0 mas < goalMl, ○ cinza se totalMl = 0
- Chevron direito indicando que é clicável
- Touch feedback (ripple ou background change)

### src/components/features/history/HistoryStats.tsx
Props: { dailyData, periodAverage, daysWithGoal, totalConsumed }
- 3 cards horizontais: "Média diária", "Dias com meta", "Total no período"
- Design compacto, destinado ao topo da tela de histórico

### src/app/(app)/historico/page.tsx
Layout:
- PeriodSelector no topo
- HistoryStats logo abaixo
- HydrationChart
- Separador "Registros por dia"
- Lista de DayListItem com virtualização se > 30 itens (ou paginação simples de 30 em 30)
- Empty state quando nenhum registro no período: ilustração de copo vazio + texto
- Loading skeleton enquanto carrega

**Regras:**
- Gráfico deve ser legível em tela de 320px de largura
- Datas sempre em pt-BR via date-fns locale
- Lazy load do módulo recharts (dynamic import) para não inflar bundle inicial
- Memoizar cálculos pesados (useMemo para dailyData)

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 8 — Estatísticas e Streak

```
Você é um desenvolvedor sênior especialista em React, algoritmos de streak e Recharts.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–7 concluídos.
Histórico com gráficos funcionando. Repositório de streak no Dexie disponível.

**Objetivo deste sprint:** Painel de estatísticas com cálculo de streak, médias e tendência.

**Crie os seguintes arquivos:**

### src/lib/utils/hydrationUtils.ts
- calculateStreak(dailyData: Array<{date, goalReached}>): { current: number, best: number }
  Regras:
  - Streak atual: conta dias consecutivos retroativos a partir de ontem (ou hoje se já atingiu meta hoje)
  - Se hoje não atingiu meta ainda, não quebra o streak (dia ainda não terminou)
  - Streak quebra se ontem não atingiu meta
  - best: maior sequência histórica
- calculateAverage(dailyData, days: 7 | 30): number
- calculateGoalAuto(weight_kg: number): number — peso × 35, arredonda para múltiplo de 50
- formatVolume(ml: number): string — "1.800 ml" ou "1,8 L" (acima de 1000ml)

### src/hooks/useStreak.ts
- Busca todos os registros históricos agrupados por dia via recordRepository.getTotalsByPeriod
- Busca metas via goalRepository
- Calcula streaks com hydrationUtils.calculateStreak
- Atualiza cache na tabela streaks quando calcula
- Reexecuta quando registros mudam (useLiveQuery)
- Expõe: { currentStreak, bestStreak, isLoading }

### src/hooks/useStats.ts
- Usa recordRepository para buscar dados dos últimos 30 dias e todos os históricos
- Expõe:
  - avg7Days: number
  - avg30Days: number
  - totalHistoricalLiters: number
  - totalDaysTracked: number
  - bestDay: { date: string, totalMl: number } | null
  - isLoading: boolean

### src/components/features/stats/StreakCard.tsx
Props: { currentStreak, bestStreak }
- Streak atual: número grande + "dias consecutivos" + ícone 🔥
- Animação de chama quando currentStreak > 0 (CSS keyframe)
- Melhor streak: número menor + "🏆 Recorde pessoal"
- Mensagem motivacional:
  - 0: "Comece hoje e construa sua sequência!"
  - 1–6: "Você está começando! Continue!"
  - 7–29: "Uma semana de constância! Incrível!"
  - 30+: "Um mês de hidratação! Você é um exemplo!"

### src/components/features/stats/StatCard.tsx
Props: { icon, label, value, subtitle?, color? }
- Card genérico reutilizável para estatísticas
- Ícone + label acima, valor em destaque, subtitle abaixo
- Animação de entrada: slide up + fade (Intersection Observer)

### src/components/features/stats/TrendChart.tsx
Props: { data: Array<{date, totalMl}>, goalMl }
Recharts LineChart:
- Linha suave (type="monotone") do consumo diário
- Linha tracejada da meta
- Área preenchida abaixo da linha de consumo (cor primary com opacity)
- Eixo X: datas, Eixo Y: ml
- Responsive, height: 180px
- Tooltip: "DD/MM: Xml"
- Sem legenda

### src/app/(app)/estatisticas/page.tsx
Layout (de cima para baixo):
1. Título "Suas Estatísticas"
2. StreakCard (ocupa 100% da largura)
3. Grid 2 colunas:
   - StatCard: "Média 7 dias" (ícone gráfico de barras)
   - StatCard: "Média 30 dias" (ícone calendário)
4. Grid 2 colunas:
   - StatCard: "Total histórico" (em litros, ícone de garrafa)
   - StatCard: "Dias monitorados" (ícone de checkmark)
5. StatCard largura total: "Melhor dia" com data e volume
6. Título "Tendência — Últimos 30 dias"
7. TrendChart
8. Empty state quando < 3 dias de dados: "Registre por pelo menos 3 dias para ver suas estatísticas"

**Regras:**
- Streak nunca é negativo
- Se não há dados: exibir 0 dias, não null/undefined
- Memoizar cálculos de streak (são O(n) mas não devem rodar a cada render)
- TrendChart com dynamic import (lazy) para não bloquear carregamento inicial

**Entregue:** Código completo de todos os arquivos acima.
```

---

## Sprint 9 — PWA Completo, Tema e Acessibilidade

```
Você é um desenvolvedor sênior especialista em PWA, Workbox, acessibilidade e performance web.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–8 concluídos.
Todas as funcionalidades principais estão implementadas.

**Objetivo deste sprint:** Tornar o app instalável como PWA, polir tema claro/escuro e garantir acessibilidade WCAG 2.1 AA.

**Tarefas:**

### 1. Manifest e Ícones
- public/manifest.json completo com:
  name, short_name, description, start_url: "/", scope: "/"
  display: "standalone", orientation: "portrait"
  background_color: "#F0F9FF", theme_color: "#0EA5E9"
  icons: [192 (any), 384 (any), 512 (any+maskable)]
  shortcuts: [{ name: "Registrar Água", url: "/dashboard", icons }]
  screenshots: [mobile 390×844, desktop 1280×800]
  categories: ["health", "lifestyle"]
- Ícones SVG/PNG: gota d'água estilizada nas 4 dimensões
  Criar SVG base e exportar nos tamanhos com sharp ou jimp via script

### 2. next-pwa / Workbox
next.config.js atualizado com next-pwa:
- runtimeCaching com estratégias:
  - Static assets (/_next/static/**, /icons/**): CacheFirst, maxAge 1 ano
  - Google Fonts: StaleWhileRevalidate
  - Páginas HTML: NetworkFirst, timeout 3s, fallback para cache
- fallbacks: { document: '/offline.html' }
- Criar src/app/offline/page.tsx: página offline estilizada com mensagem e botão "Tentar novamente"

### 3. Banner de Instalação
src/components/ui/InstallBanner.tsx:
- Detecta evento beforeinstallprompt (salvar em ref)
- Exibe banner customizado após 30 segundos de uso OU 1 registro realizado
- "Instale o HydroLembre para usar offline e receber lembretes!"
- Botão "Instalar" — chama prompt.prompt()
- Botão "Agora não" — salva timestamp em localStorage, não exibe por 7 dias
- Não exibe se já instalado (display-mode: standalone)
- Suporte a iOS: exibe instrução alternativa quando needsHomeScreenInstall()

### 4. Banner de Atualização do SW
src/components/ui/UpdateBanner.tsx:
- Detecta novo SW via workbox/window
- Exibe: "Nova versão disponível 🎉" + botão "Atualizar"
- Ao clicar: skipWaiting() + window.location.reload()
- Banner fixo no topo (não bloqueia conteúdo)

### 5. ThemeContext
src/contexts/ThemeContext.tsx:
- theme: 'light' | 'dark' | 'system'
- resolvedTheme: 'light' | 'dark' (resolve 'system' via matchMedia)
- setTheme(theme): salva no Dexie via settingsRepository
- Aplica classe "dark" no elemento <html>
- Monitora prefers-color-scheme com addEventListener
- Inicializa SEM flicker: script inline no <head> para aplicar classe antes do React hidratar
  (similar ao padrão do next-themes)
- Provider envolve o layout raiz

### 6. Acessibilidade — Auditoria e Correções
Percorrer todos os componentes existentes e:
- Adicionar aria-label em todos os botões sem texto visível
- Adicionar role="progressbar" aria-valuenow aria-valuemin aria-valuemax no HydrationRing
- Todos os inputs: associados a label via htmlFor/id, ou aria-label
- Modais: aria-modal, aria-labelledby, focus trap, fechar com Esc
- BottomNav: role="navigation" aria-label="Navegação principal", aria-current="page" na aba ativa
- Cores: verificar contraste mínimo 4.5:1 (usar WebAIM Contrast Checker)
- Snackbar: aria-live="polite"
- Imagens decorativas: aria-hidden="true"
- Skip link: "Ir para o conteúdo principal" no topo do layout para usuários de teclado

### 7. Performance
- Dynamic import com next/dynamic para: HydrationChart, TrendChart, StatCard
- Verificar que bundle inicial JS < 200kb gzip
- Adicionar loading.tsx em cada rota do App Router (skeleton screens)
  src/app/(app)/dashboard/loading.tsx
  src/app/(app)/historico/loading.tsx
  src/app/(app)/estatisticas/loading.tsx
  src/app/(app)/configuracoes/loading.tsx
- src/components/ui/Skeleton.tsx — componente de skeleton genérico (pulse animation)

### 8. Meta Tags Extras em layout.tsx
- apple-touch-icon
- apple-mobile-web-app-status-bar-style: default
- msapplication-TileColor

**Regras:**
- Script anti-flicker de tema deve ser injetado como dangerouslySetInnerHTML no <head>
- Testar no Chrome DevTools > Application > Service Workers
- Lighthouse: PWA ≥ 90, Accessibility ≥ 90, Performance ≥ 80

**Entregue:** Código completo de todos os arquivos acima + script de geração de ícones.
```

---

## Sprint 10 — Exportação, Importação, QA e Deploy

```
Você é um desenvolvedor sênior especialista em React, manipulação de arquivos e deploy.
Estamos construindo o HydroLembre — PWA de hidratação. Sprints 1–9 concluídos.
O app está completo funcionalmente. Este é o sprint de finalização.

**Objetivo deste sprint:** Exportação/importação de dados, QA e preparação para deploy.

**Crie os seguintes arquivos:**

### src/lib/export/exportService.ts
- exportToJSON(): Promise<string>
  Gera JSON com: { version: "1.0", exportedAt: ISO string, profile, records: WaterRecord[], goals: Goal[], settings: DefaultSettings }
- exportToCSV(): Promise<string>
  Colunas: Data,Hora,Volume (ml),Observação
  Formatado em pt-BR, separador vírgula, encoding UTF-8 com BOM (para Excel)
- downloadFile(content: string, filename: string, mimeType: string): void
  Usa URL.createObjectURL + link.click()

### src/lib/export/importService.ts
type ImportResult = { success: boolean, imported: number, errors: string[] }
type ImportMode = 'merge' | 'replace'

- validateJSON(raw: string): { valid: boolean, data?: ExportSchema, errors: string[] }
  Validar: versão do schema, estrutura das entidades, tipos dos campos
- importFromJSON(raw: string, mode: ImportMode): Promise<ImportResult>
  Se 'replace': limpar records e goals antes de importar
  Se 'merge': inserir apenas registros não existentes (verificar por timestamp)
  Reinserção com novo auto-id (não usar IDs do arquivo)
  Transação Dexie para atomicidade

### Atualizar src/components/features/settings/DataSection.tsx
Substituir placeholders "Em breve" por funcionalidade real:

**Exportar JSON:**
- Botão "Exportar JSON"
- Ao clicar: exportToJSON() + downloadFile()
- Nome do arquivo: "hydrolembre-backup-YYYY-MM-DD.json"

**Exportar CSV:**
- Botão "Exportar CSV"
- Ao clicar: exportToCSV() + downloadFile()
- Nome do arquivo: "hydrolembre-registros-YYYY-MM-DD.csv"

**Importar JSON:**
- Botão "Importar JSON" abre file input (accept=".json")
- Ao selecionar arquivo: ler com FileReader, chamar validateJSON
- Se inválido: exibir erros no modal
- Se válido: modal de escolha "Mesclar com dados atuais" ou "Substituir tudo"
  - Confirmar ação escolhida
  - Executar importFromJSON
  - Exibir resultado: "X registros importados com sucesso" ou lista de erros

### src/app/not-found.tsx
- Página 404 estilizada com ícone de gota e link de volta ao dashboard

### README.md (raiz do projeto)
- Descrição do projeto
- Stack utilizada
- Como rodar localmente (npm install, npm run dev)
- Como fazer build (npm run build)
- Como deployar no Vercel (um clique)
- Estrutura de diretórios resumida
- Funcionalidades do app
- Capturas de tela (placeholder: [screenshot])
- Licença: MIT

### Checklist de QA Manual
Criar arquivo QA_CHECKLIST.md com todos os fluxos de teste:

**Onboarding:**
- [ ] Usuário novo vê onboarding ao abrir
- [ ] Pular nome → meta padrão 2000ml aplicada
- [ ] Peso 70kg → meta calculada 2450ml exibida
- [ ] Meta manual 3000ml → salva corretamente
- [ ] Copo 500ml → exibido corretamente no dashboard
- [ ] Lembretes ativados → permissão solicitada

**Dashboard:**
- [ ] Botão "Beber Água" adiciona volume padrão
- [ ] Snackbar de desfazer funciona por 5 segundos
- [ ] Anel de progresso atualiza imediatamente
- [ ] Volume customizado com valor inválido mostra erro
- [ ] Fechar e reabrir → dados persistem
- [ ] Virada de dia → contador zera, histórico preservado

**Notificações:**
- [ ] Lembrete dispara no intervalo configurado
- [ ] Fora da janela de horário: não dispara
- [ ] Meta atingida + pausa: lembretes pausam
- [ ] iOS: banner de instalação exibido

**Histórico:**
- [ ] 7 dias e 30 dias mostram dados corretos
- [ ] Gráfico diferencia dias com/sem meta
- [ ] Tap em dia abre detalhe com lista de registros
- [ ] Exclusão com desfazer funciona
- [ ] Edição de volume atualiza total do dia

**Estatísticas:**
- [ ] Streak calculado corretamente
- [ ] Média 7 dias bate com cálculo manual
- [ ] Best streak preservado após recalcular

**Configurações:**
- [ ] Editar nome → aparece no dashboard
- [ ] Mudar meta → progresso recalcula
- [ ] Mudar recipiente → botão principal atualiza
- [ ] Tema escuro aplica sem flicker
- [ ] Limpar histórico → records deletados, perfil mantido
- [ ] Apagar tudo → redireciona para onboarding

**Exportação/Importação:**
- [ ] JSON exportado contém todos os registros
- [ ] CSV abre corretamente no Excel/Sheets
- [ ] Importação mesclada não duplica registros
- [ ] Importação substituir limpa dados antigos

**PWA:**
- [ ] App instalável no Android Chrome
- [ ] Funciona offline após instalar
- [ ] Banner de instalação aparece após 30s
- [ ] Banner de atualização aparece após novo deploy

### Deploy
Fornecer:
- vercel.json (se necessário para configurações extras)
- Instruções para configurar o projeto no Vercel
- Variáveis de ambiente necessárias (nenhuma esperada — app é 100% client-side)
- Configuração de headers de segurança: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

**Regras finais:**
- Todos os 10 critérios de aceitação do LRS devem passar
- Nenhum console.error não tratado em produção
- Build sem warnings de TypeScript
- Lighthouse final: PWA ≥ 90, Accessibility ≥ 90, Performance ≥ 80, Best Practices ≥ 90

**Entregue:** Código completo de todos os arquivos acima + QA_CHECKLIST.md preenchido com os casos de teste.
```

---

## Guia de Uso dos Prompts

**Antes de cada sprint:**
1. Cole o prompt do sprint na conversa do Claude
2. Se houver código relevante do sprint anterior que o Claude precisa ver, inclua como contexto antes do prompt
3. Peça o código arquivo por arquivo se o sprint tiver muitos entregáveis

**Dicas para melhores resultados:**
- Se um componente ficar muito grande, peça para quebrar em partes: "Implemente primeiro os hooks, depois os componentes"
- Use o prompt de um sprint como base e adapte conforme decisões que mudaram durante o desenvolvimento
- Após implementar, use: "Revise o código acima e aponte possíveis bugs ou melhorias antes de passarmos para o próximo sprint"

---

*Prompts gerados em 05/05/2026 para uso ao longo do desenvolvimento do HydroLembre.*
