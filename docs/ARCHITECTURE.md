# Arquitetura Técnica — HydroLembre PWA
**Versão:** 1.0 | **Data:** 05/05/2026  
**Stack:** Next.js 14 (App Router) · Dexie.js · IndexedDB · Workbox PWA · Tailwind CSS

---

## 1. Visão Geral

HydroLembre é uma aplicação **offline-first** sem backend. Toda a lógica reside no cliente — não há chamadas a APIs externas de dados. A persistência é feita exclusivamente via **IndexedDB** com **Dexie.js** como ORM.

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER / DEVICE                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Next.js App (Client)               │   │
│  │                                                 │   │
│  │   Pages/Routes ──► Hooks ──► Repositories      │   │
│  │        │              │            │            │   │
│  │   Components      Business      Dexie.js        │   │
│  │                    Logic       (IndexedDB)       │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────▼──────────────────────────┐   │
│  │              Service Worker (Workbox)            │   │
│  │  Cache First (assets) │ Network First (pages)   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Web Notifications API                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │ HTTPS only
                ┌─────────▼──────────┐
                │   Static Hosting   │
                │ (Vercel / Netlify) │
                └────────────────────┘
```

---

## 2. Estrutura de Diretórios

```
hydrolembre/
├── public/
│   ├── manifest.json              # Web App Manifest
│   ├── sw.js                      # Service Worker (gerado pelo Workbox)
│   └── icons/
│       ├── icon-192.png
│       ├── icon-384.png
│       ├── icon-512.png
│       └── icon-512-maskable.png
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # Root layout (PWA meta, providers)
│   │   ├── page.tsx               # Redirect → /dashboard
│   │   ├── (onboarding)/
│   │   │   └── onboarding/
│   │   │       └── page.tsx       # Fluxo de onboarding (steps)
│   │   └── (app)/
│   │       ├── layout.tsx         # Layout com nav bottom bar
│   │       ├── dashboard/
│   │       │   └── page.tsx       # Tela principal
│   │       ├── historico/
│   │       │   ├── page.tsx       # Lista de dias
│   │       │   └── [date]/
│   │       │       └── page.tsx   # Detalhe de um dia
│   │       ├── estatisticas/
│   │       │   └── page.tsx       # Streaks e médias
│   │       └── configuracoes/
│   │           └── page.tsx       # Settings
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts           # Instância Dexie (singleton)
│   │   │   ├── schema.ts          # Versões e migrações do schema
│   │   │   ├── types.ts           # Interfaces TypeScript das entidades
│   │   │   └── repositories/
│   │   │       ├── profileRepository.ts
│   │   │       ├── recordRepository.ts
│   │   │       ├── settingsRepository.ts
│   │   │       ├── goalRepository.ts
│   │   │       └── streakRepository.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notificationManager.ts  # Solicita permissão, dispara notif.
│   │   │   └── reminderScheduler.ts    # setInterval + janela de horário
│   │   │
│   │   ├── utils/
│   │   │   ├── dateUtils.ts       # Helpers de data (hoje, ontem, YYYY-MM-DD)
│   │   │   ├── hydrationUtils.ts  # Cálculo de meta, progresso, streak
│   │   │   └── storageUtils.ts    # navigator.storage.persist()
│   │   │
│   │   └── export/
│   │       ├── exportService.ts   # Gera CSV e JSON dos registros
│   │       └── importService.ts   # Valida e importa JSON
│   │
│   ├── hooks/
│   │   ├── useHydration.ts        # Estado do dia: total, meta, registros
│   │   ├── useReminders.ts        # Lógica de lembretes e permissão
│   │   ├── useStreak.ts           # Streak atual e melhor streak
│   │   ├── useHistory.ts          # Histórico com filtro de período
│   │   ├── useSettings.ts         # Leitura/escrita de configurações
│   │   └── useOnboarding.ts       # Controle do fluxo de onboarding
│   │
│   ├── components/
│   │   ├── ui/                    # Componentes genéricos reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── ProgressRing.tsx   # Indicador circular de progresso
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Snackbar.tsx       # Undo de exclusão
│   │   │   ├── Input.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx      # Navegação inferior mobile
│   │   │   └── AppShell.tsx       # Wrapper com nav e área de conteúdo
│   │   │
│   │   └── features/
│   │       ├── dashboard/
│   │       │   ├── HydrationRing.tsx    # Anel de progresso principal
│   │       │   ├── QuickAddButton.tsx   # Botão principal de registro
│   │       │   ├── VolumeShortcuts.tsx  # Grade de volumes rápidos
│   │       │   ├── CustomVolumeInput.tsx
│   │       │   └── TodayRecordsList.tsx
│   │       │
│   │       ├── history/
│   │       │   ├── PeriodSelector.tsx
│   │       │   ├── HydrationChart.tsx   # Gráfico de barras (Recharts)
│   │       │   ├── DayListItem.tsx
│   │       │   └── RecordItem.tsx
│   │       │
│   │       ├── stats/
│   │       │   ├── StreakCard.tsx
│   │       │   ├── AverageCard.tsx
│   │       │   └── TrendChart.tsx
│   │       │
│   │       ├── settings/
│   │       │   ├── ProfileSection.tsx
│   │       │   ├── RemindersSection.tsx
│   │       │   ├── QuickVolumesSection.tsx
│   │       │   ├── AppearanceSection.tsx
│   │       │   └── DataSection.tsx
│   │       │
│   │       └── onboarding/
│   │           ├── OnboardingShell.tsx
│   │           ├── StepName.tsx
│   │           ├── StepGoal.tsx
│   │           ├── StepCup.tsx
│   │           ├── StepReminders.tsx
│   │           └── StepPermission.tsx
│   │
│   ├── contexts/
│   │   └── ThemeContext.tsx        # Tema claro/escuro/sistema
│   │
│   └── styles/
│       └── globals.css             # Tailwind base + CSS variables de tema
│
├── next.config.js                  # next-pwa / Workbox config
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. Camada de Dados (Dexie.js)

### 3.1 Instância Singleton

```typescript
// src/lib/db/index.ts
import Dexie, { type Table } from 'dexie';
import type { Profile, Record, Settings, Goal, StreakCache } from './types';

class HydroLembreDB extends Dexie {
  profile!: Table<Profile>;
  records!: Table<Record>;
  settings!: Table<Settings>;
  goals!: Table<Goal>;
  streaks!: Table<StreakCache>;

  constructor() {
    super('hydrolembre');
    this.version(1).stores({
      profile:  '++id, createdAt',
      records:  '++id, date, timestamp',
      settings: '++id, key',
      goals:    '++id, date',
      streaks:  '++id, updatedAt',
    });
  }
}

export const db = new HydroLembreDB();
```

### 3.2 Tipos das Entidades

```typescript
// src/lib/db/types.ts

export interface Profile {
  id?: number;
  name?: string;
  weight_kg?: number;
  daily_goal_ml: number;
  default_cup_ml: number;
  onboarding_done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterRecord {
  id?: number;
  volume_ml: number;
  date: string;        // YYYY-MM-DD
  timestamp: Date;
  note?: string;
}

export interface Settings {
  id?: number;
  key: string;
  value: unknown;
}

export interface Goal {
  id?: number;
  date: string;        // YYYY-MM-DD
  goal_ml: number;
}

export interface StreakCache {
  id?: number;
  current_streak: number;
  best_streak: number;
  last_date: string;
  updatedAt: Date;
}
```

### 3.3 Padrão de Repositório

Toda interação com o banco passa por funções no repositório. Nenhum componente ou hook acessa `db` diretamente.

```typescript
// src/lib/db/repositories/recordRepository.ts
import { db } from '../index';
import type { WaterRecord } from '../types';
import { toDateString } from '@/lib/utils/dateUtils';

export const recordRepository = {
  async addRecord(volume_ml: number, note?: string): Promise<number> {
    const now = new Date();
    return db.records.add({
      volume_ml,
      date: toDateString(now),
      timestamp: now,
      note,
    });
  },

  async getTodayRecords(): Promise<WaterRecord[]> {
    const today = toDateString(new Date());
    return db.records
      .where('date').equals(today)
      .sortBy('timestamp');
  },

  async getRecordsByDate(date: string): Promise<WaterRecord[]> {
    return db.records.where('date').equals(date).sortBy('timestamp');
  },

  async getRecordsByPeriod(from: string, to: string): Promise<WaterRecord[]> {
    return db.records
      .where('date').between(from, to, true, true)
      .toArray();
  },

  async deleteRecord(id: number): Promise<void> {
    await db.records.delete(id);
  },

  async updateRecord(id: number, volume_ml: number): Promise<void> {
    await db.records.update(id, { volume_ml });
  },
};
```

---

## 4. Camada de Hooks

Os hooks encapsulam a lógica de negócio e expõem estado reativo para os componentes. Utilizam `useLiveQuery` do `dexie-react-hooks` para reatividade automática.

```typescript
// src/hooks/useHydration.ts  (esboço)
import { useLiveQuery } from 'dexie-react-hooks';
import { recordRepository } from '@/lib/db/repositories/recordRepository';
import { profileRepository } from '@/lib/db/repositories/profileRepository';

export function useHydration() {
  const todayRecords = useLiveQuery(() => recordRepository.getTodayRecords(), []);
  const profile = useLiveQuery(() => profileRepository.getProfile(), []);

  const totalMl = todayRecords?.reduce((acc, r) => acc + r.volume_ml, 0) ?? 0;
  const goalMl = profile?.daily_goal_ml ?? 2000;
  const progressPct = Math.min(Math.round((totalMl / goalMl) * 100), 100);
  const remainingMl = Math.max(goalMl - totalMl, 0);
  const goalReached = totalMl >= goalMl;

  async function addWater(volume_ml: number) {
    await recordRepository.addRecord(volume_ml);
  }

  return { todayRecords, totalMl, goalMl, progressPct, remainingMl, goalReached, addWater };
}
```

---

## 5. Sistema de Notificações

### Fluxo de Permissão

```
App inicia
    │
    ▼
Verifica Notification.permission
    │
    ├── "granted" ──► Inicia scheduler
    ├── "denied"  ──► Exibe aviso + modo visual
    └── "default" ──► (onboarding) Solicita permissão
                            │
                            ├── Aceito ──► Salva "granted" + Inicia scheduler
                            └── Negado ──► Salva "denied" + Modo visual
```

### Scheduler de Lembretes

```typescript
// src/lib/notifications/reminderScheduler.ts
export class ReminderScheduler {
  private timerId: ReturnType<typeof setInterval> | null = null;

  start(intervalMin: number, startTime: string, endTime: string, message: string) {
    this.stop();
    this.timerId = setInterval(() => {
      if (this.isWithinWindow(startTime, endTime)) {
        new Notification('HydroLembre 💧', { body: message, icon: '/icons/icon-192.png' });
      }
    }, intervalMin * 60 * 1000);
  }

  stop() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  private isWithinWindow(start: string, end: string): boolean {
    const now = new Date();
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    return nowMin >= startMin && nowMin <= endMin;
  }
}

export const reminderScheduler = new ReminderScheduler();
```

> **Nota iOS:** No iOS Safari (< 16.4 ou sem app instalado na home screen), a Web Notifications API não está disponível. O app detecta isso e exibe um banner visual ao abrir: *"Você já bebeu água hoje?"*

---

## 6. PWA — Service Worker e Cache

### Estratégias de Cache (Workbox via next-pwa)

| Tipo de Recurso          | Estratégia        | Cache Name          |
|--------------------------|-------------------|---------------------|
| JS / CSS / fontes / ícones | Cache First     | `static-assets`     |
| Páginas HTML (rotas)     | Network First     | `pages`             |
| Imagens                  | Cache First       | `images`            |
| Qualquer outro           | Network First     | `default`           |

### next.config.js (esboço)

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: { cacheName: 'default', networkTimeoutSeconds: 10 },
    },
  ],
});

module.exports = withPWA({ reactStrictMode: true });
```

### Persistência do Storage

```typescript
// src/lib/utils/storageUtils.ts
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage?.persist) {
    return navigator.storage.persist();
  }
  return false;
}
```

Chamado na inicialização do app (layout.tsx) para evitar que o browser descarte o IndexedDB.

---

## 7. Gerenciamento de Tema

```typescript
// src/contexts/ThemeContext.tsx
// Lê preferência de "theme" do Dexie settings
// Aplica classe "dark" no <html> para Tailwind dark mode
// Monitora prefers-color-scheme quando theme = "system"
```

Tailwind configurado com `darkMode: 'class'`.

---

## 8. Fluxo de Inicialização do App

```
Browser abre o app
        │
        ▼
layout.tsx monta
        │
        ├── requestPersistentStorage()
        ├── Verifica onboarding_done no Dexie
        │       ├── false → redirect /onboarding
        │       └── true  → continua
        ├── Aplica tema (ThemeContext)
        └── Inicia ReminderScheduler (se permissão = granted)
                │
                ▼
        Dashboard renderiza
                │
                └── useLiveQuery reage a qualquer mudança no IndexedDB
```

---

## 9. Decisões de Arquitetura

| Decisão | Escolha | Justificativa |
|---|---|---|
| Framework | Next.js 14 App Router | SSG para deploy estático, roteamento nativo, bom suporte a PWA |
| ORM local | Dexie.js | API limpa sobre IndexedDB, suporte a migrações, hooks reativos |
| Estado reativo | `useLiveQuery` (Dexie) | Evita estado global (Redux/Zustand) — Dexie já notifica mudanças |
| Estilo | Tailwind CSS | Produtividade, dark mode por classe, bundle pequeno com purge |
| Gráficos | Recharts | Leve, composable, integração simples com React |
| Notificações | Web Notifications API | Nativa, sem dependência externa |
| SW | next-pwa + Workbox | Integração automática com Next.js build pipeline |
| Datas | date-fns | Tree-shakeable, sem mutação, TypeScript-first |
| Sem estado global | — | useLiveQuery + hooks locais são suficientes para este escopo |

---

## 10. Considerações de Segurança e Privacidade

- **Zero dados externos:** nenhuma telemetria, analytics ou CDN de dados de usuário
- **CSP:** Content Security Policy restrita, bloqueando scripts inline e origens externas
- **HTTPS obrigatório:** Service Worker só registra em contexto seguro
- **Limpeza de dados:** usuário tem controle total — exportar, importar ou apagar tudo
- **Sem cookies:** nenhum cookie de rastreamento ou sessão

---

*Documento gerado em 05/05/2026.*
