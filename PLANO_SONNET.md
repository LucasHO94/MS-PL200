# PLANO DE EXECUÇÃO — SIMULADOR PL-200 PREMIUM
> Gerado por análise Opus em 2026-05-12. Para execução pelo Sonnet.

---

## SUMÁRIO EXECUTIVO

Projeto React + Vite + Supabase + Tailwind para simulador da certificação PL-200.
Auditoria identificou:
- **Bugs críticos** (crash em modal, selos nunca desbloqueados, race condition)
- **Falhas de segurança sérias** (paywall aberto, admin sem RLS, premium grátis)
- **~80 questões com português europeu (PT-PT)** no `questions.js` (q1–q193)
- **Inconsistências de localização** (strings hardcoded, chaves duplicadas, chaves faltando)
- Blocos `pl200_oficial_*` (linha ~4183 em diante) já estão em PT-BR puro — **não tocar**

---

## FASE 1 — BUGS CRÍTICOS (PRIORIDADE MÁXIMA)

### Tarefa 1.1 — Importar `CheckCircle` em Dashboard.jsx
- **Arquivo:** `src/pages/Dashboard.jsx` linha 3
- Adicionar `CheckCircle` à lista de imports do `lucide-react`
- Antes: `import { BookOpen, Target, Flame, Trophy, Play, LogOut, Check, X, Medal, Star, Award, TrendingUp, Settings, User, PieChart, AlertCircle, Shield, Clock, Sun, Users, ChevronRight, Mail, Zap } from 'lucide-react';`
- Depois: `import { BookOpen, Target, Flame, Trophy, Play, LogOut, Check, CheckCircle, X, Medal, Star, Award, TrendingUp, Settings, User, PieChart, AlertCircle, Shield, Clock, Sun, Users, ChevronRight, Mail, Zap } from 'lucide-react';`

### Tarefa 1.2 — Corrigir comparação de exam_type no selo "Mestre da Prova"
- **Arquivo:** `src/pages/Dashboard.jsx` linhas 348 e 351
- Trocar `'avançado'` (com cedilha) por `'avancado'` (sem cedilha)
- O Simulator salva via URL `/simulator/avancado` (sem cedilha), mas o comparador usa cedilha → selo nunca desbloqueado

### Tarefa 1.3 — Corrigir chaves duplicadas em `translations.js`
- **Arquivo:** `src/locales/translations.js`
- Chave `passed` aparece 2x em PT (linha 41: `"Aprovado"` e linha 188: `"APROVADO"`)
- Chave `failed` aparece 2x em PT (linha 42: `"Reprovado"` e linha 189: `"REPROVADO"`)
- Mesma situação em EN (linhas 369 e 515)
- **Ação:** Renomear as variantes uppercase:
  - `"passed": "APROVADO"` → `"approved_upper": "APROVADO"`
  - `"failed": "REPROVADO"` → `"failed_upper": "REPROVADO"`
  - Mesma renomeação no EN
  - Auditar uso em `Simulator.jsx:562` e ajustar referências

### Tarefa 1.4 — Adicionar chaves faltantes em `translations.js`
- **Arquivo:** `src/locales/translations.js`
- Adicionar em PT (seção `pt:`):
```js
total: "Total",
target_score: "Meta",
anonymous_user: "Usuário Anônimo",
alert_time_expired: "Tempo Esgotado! Seu simulado foi submetido automaticamente.",
alert_time_ideal_over: "Seu tempo ideal acabou! O cronômetro ficará vermelho, mas você pode continuar para fins didáticos.",
alert_review_no_data: "Este simulado antigo não possui dados de revisão detalhada.",
alert_reset_progress_confirm: "Tem certeza que deseja zerar sua evolução no Modo Geral e começar do zero?",
alert_reset_progress_ok: "Progresso zerado com sucesso!",
alert_reset_progress_err: "Erro ao zerar progresso.",
alert_payment_error: "Houve um erro ao conectar com o provedor de pagamento. Tente novamente em instantes.",
loading_platform: "Carregando Plataforma...",
domain_default: "Microsoft Power Platform",
cut_off_tooltip: "Nota de Corte Oficial (700 Pontos)",
mode_label: "Modo",
download_pdf: "DOWNLOAD PDF",
badge_data_master: "Mestre dos Dados",
nickname_placeholder: "ex: ninja_pl200",
fullname_placeholder: "Ex: Lucas Oliveira",
dashboard_short: "Dashboard",
contact_us_subtitle: "Suporte Direto & Relatos",
passed_simple: "Aprovado",
failed_simple: "Reprovado",
```
- Adicionar em EN (seção `en:`):
```js
total: "Total",
target_score: "Target",
anonymous_user: "Anonymous User",
alert_time_expired: "Time's up! Your simulator has been submitted automatically.",
alert_time_ideal_over: "Your ideal time is up! The timer will turn red, but you can continue for learning purposes.",
alert_review_no_data: "This old simulator doesn't have detailed review data.",
alert_reset_progress_confirm: "Are you sure you want to reset your progress in General Mode?",
alert_reset_progress_ok: "Progress reset successfully!",
alert_reset_progress_err: "Error resetting progress.",
alert_payment_error: "There was an error connecting to the payment provider. Please try again shortly.",
loading_platform: "Loading Platform...",
domain_default: "Microsoft Power Platform",
cut_off_tooltip: "Official Cut-off Score (700 Points)",
mode_label: "Mode",
download_pdf: "DOWNLOAD PDF",
badge_data_master: "Data Master",
nickname_placeholder: "e.g.: pl200_ninja",
fullname_placeholder: "E.g.: John Smith",
dashboard_short: "Dashboard",
contact_us_subtitle: "Direct Support & Reports",
loading_data: "Loading your data...",
passed_simple: "Passed",
failed_simple: "Failed",
```

### Tarefa 1.5 — Substituir strings hardcoded por `t()`
Substituir em cada arquivo:

**`src/pages/Simulator.jsx`:**
- Linha 96: `alert("Este simulado antigo...")` → `alert(t('alert_review_no_data'))`
- Linha 230: `alert("Tempo Esgotado!...")` → `alert(t('alert_time_expired'))`
- Linha 233: `alert("Seu tempo ideal acabou!...")` → `alert(t('alert_time_ideal_over'))`
- Linha 338: `window.confirm('Tem certeza...')` → `window.confirm(t('alert_reset_progress_confirm'))`
- Linha 346: `alert("Erro ao zerar progresso.")` → `alert(t('alert_reset_progress_err'))`
- Linha 350: `alert("Progresso zerado com sucesso!")` → `alert(t('alert_reset_progress_ok'))`
- Linha 550: prefixo `Modo ` → `{t('mode_label')} `
- Linha 764: fallback `'Microsoft Power Platform'` → `t('domain_default')`

**`src/pages/Dashboard.jsx`:**
- Linha 266: `alert("Houve um erro...")` → `alert(t('alert_payment_error'))`
- Linha 362: `Dashboard` → `{t('dashboard_short')}`
- Linha 476: comentário `GAAMIFICATION` → `GAMIFICATION` (typo)
- Linha 505: comentário `HISTÃ"RICO` → `HISTÓRICO` (mojibake)
- Linha 976: `title="Nota de Corte..."` → `title={t('cut_off_tooltip')}`
- Linha 1037: `DOWNLOAD PDF` → `{t('download_pdf')}`

**`src/pages/Profile.jsx`:**
- Linha 199: `Mestre dos Dados` → `{t('badge_data_master')}`
- Linha 228: `placeholder="ex: ninja_pl200"` → `placeholder={t('nickname_placeholder')}`
- Linha 242: `placeholder="Ex: Lucas Oliveira"` → `placeholder={t('fullname_placeholder')}`

**`src/components/SupportModal.jsx`:**
- Linha 65: `Fale Conosco` → `{t('contact_us_title')}`
- Linha 66: `Suporte Direto & Relatos` → `{t('contact_us_subtitle')}`

### Tarefa 1.6 — Corrigir mojibake
- `Dashboard.jsx:476` — `GAAMIFICATION` → `GAMIFICATION`
- `Dashboard.jsx:505` — `HISTÃ"RICO` → `HISTÓRICO`
- `questions.js` — substituir TODAS as ocorrências de `padr?o` (caractere quebrado) por `padrão` (usar Grep para localizar)

### Tarefa 1.7 — Corrigir `lang` do HTML
- **Arquivo:** `index.html:2`
- Alterar `<html lang="en">` para `<html lang="pt-BR">`
- OU adicionar no `LanguageContext.jsx` um `useEffect` que sete `document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en-US'`

---

## FASE 2 — SEGURANÇA E AUTORIZAÇÃO

### Tarefa 2.1 — Centralizar verificação de admin
- Criar arquivo `src/lib/auth.js`:
```js
export const ADMIN_EMAILS = ['lucasho94@hotmail.com'];
export const isAdminEmail = (email) => ADMIN_EMAILS.includes(email);
```
- Substituir `session?.user?.email === 'lucasho94@hotmail.com'` em:
  - `src/pages/Admin.jsx:17`
  - `src/pages/Dashboard.jsx:248`
  - `src/pages/Simulator.jsx:35`
- Importar `isAdminEmail` e usar `isAdminEmail(session?.user?.email)`

### Tarefa 2.2 — Remover `isPremium: true` automático no signup
- **Arquivo:** `src/pages/LandingPage.jsx:42`
- Remover `isPremium: true,` do `data:` do signup. Manter apenas `nickname: generatedNickname`
- **Arquivo:** `src/pages/Dashboard.jsx:231`
- Alterar criação do profile para `is_premium: false`

### Tarefa 2.3 — Validar historyId no modo review
- **Arquivo:** `src/pages/Simulator.jsx:79-86`
- Adicionar `.eq('user_id', session.user.id)` na query do modo review:
```js
// Antes:
const { data: hData } = await supabase
  .from('simulator_history')
  .select('*')
  .eq('id', historyId)
  .single();

// Depois:
const { data: hData } = await supabase
  .from('simulator_history')
  .select('*')
  .eq('id', historyId)
  .eq('user_id', session.user.id)
  .single();
```

---

## FASE 3 — CORREÇÕES PT-PT EM QUESTIONS.JS (CRÍTICA)

> **ATENÇÃO:** Aplicar apenas nas linhas 1 a ~4180. Os blocos `pl200_oficial_*` (a partir de ~linha 4183) já estão em PT-BR — NÃO aplicar replaces globais além dessa linha.

### Tarefa 3.1 — Replacements globais seguros (replace_all)

Aplicar em `src/questions.js` usando Edit com `replace_all: true`:

| Buscar (literal exato) | Substituir |
|---|---|
| `está a olhar` | `está olhando` |
| `está a configurar` | `está configurando` |
| `está a implementar` | `está implementando` |
| `está a criar` | `está criando` |
| `está a desenhar` | `está projetando` |
| `está a desenvolver` | `está desenvolvendo` |
| `está a utilizar` | `está utilizando` |
| `está a usar` | `está usando` |
| `está a fazer` | `está fazendo` |
| `está a trabalhar` | `está trabalhando` |
| `está a ser` | `está sendo` |
| `Está a configurar` | `Está configurando` |
| `Está a criar` | `Está criando` |
| `Está a desenhar` | `Está projetando` |
| `Está a usar` | `Está usando` |
| `Está a utilizar` | `Está utilizando` |
| `estou a olhar` | `estou olhando` |
| `estão a ser importadas` | `estão sendo importadas` |
| `estão a ser criadas` | `estão sendo criadas` |
| `estamos a criar` | `estamos criando` |
| `estamos a falar` | `estamos falando` |
| `partilhar` | `compartilhar` |
| `partilhado` | `compartilhado` |
| `partilhada` | `compartilhada` |
| `partilhados` | `compartilhados` |
| `partilhadas` | `compartilhadas` |
| `partilhá-los` | `compartilhá-los` |
| `Partilhar` | `Compartilhar` |
| `aceder a ` | `acessar ` |
| `aceder ao ` | `acessar o ` |
| `aceder à ` | `acessar a ` |
| `Aceder ao` | `Acessar o` |
| `aceda a ` | `acesse ` |
| `acede ` | `acessa ` |
| `acedem ` | `acessam ` |
| `acedam` | `acessem` |
| `acedendo` | `acessando` |
| `precisa de criar` | `precisa criar` |
| `precisa de configurar` | `precisa configurar` |
| `precisa de garantir` | `precisa garantir` |
| `precisa de capturar` | `precisa capturar` |
| `precisa de implementar` | `precisa implementar` |
| `precisa de armazenar` | `precisa armazenar` |
| `precisa de ajudar` | `precisa ajudar` |
| `precisa de identificar` | `precisa identificar` |
| `precisa de realizar` | `precisa realizar` |
| `precisa de extrair` | `precisa extrair` |
| `Precisa de criar` | `Precisa criar` |
| `Precisa de garantir` | `Precisa garantir` |
| `Precisa de capturar` | `Precisa capturar` |
| `Precisa de configurar` | `Precisa configurar` |
| `Precisa de implementar` | `Precisa implementar` |
| `tem de criar` | `precisa criar` |
| `tem de configurar` | `precisa configurar` |
| `tem de garantir` | `precisa garantir` |
| `tem de ser` | `precisa ser` |
| `Tem de` | `Precisa` |
| `têm de ser` | `precisam ser` |
| `têm de ter` | `precisam ter` |
| `Têm de` | `Precisam` |
| `Você planeia` | `Você planeja` |
| `planeia ` | `planeja ` |
| `recolha de dados` | `coleta de dados` |
| `recolha ` | `coleta ` |
| `recolher dados` | `coletar dados` |
| `registar` | `registrar` |
| `registar-se` | `registrar-se` |
| `registo de` | `registro de` |
| `registos ` | `registros ` |
| `gerir` | `gerenciar` |
| `gere os ` | `gerencia os ` |
| `geríveis` | `gerenciáveis` |
| `governação` | `governança` |
| `imenso trabalho` | `muito trabalho` |
| `padr?o` | `padrão` (usar Grep para encontrar o caractere exato quebrado) |
| `respetiva` | `respectiva` |
| `respetivamente` | `respectivamente` |
| `sítio novo` | `lugar novo` |
| `Tem de se excluir` | `É necessário excluir` |
| `tem de partilhar` | `precisa compartilhar` |
| `acessar ao ` | `acessar o ` |
| `acessar à ` | `acessar a ` |

### Questões com correções pontuais específicas (Edit sem replace_all)

**q22_topic1** (~linha 491):
- `um usuário afastou-se` → `o usuário se afastou`
- `em dispositivos partilhados` → já coberto pelo replace global de `partilhados`

**q23_topic1** (~linha 515):
- `Você tem de fornecer` → `Você deve fornecer`
- `selecionar 'Selecionar texto no tela'` → `selecionar 'Selecionar texto na tela'`

**q65_topic1** (~linha 1493):
- `acessar ao site` → `acessar o site`

**q73_topic1** (~linha 1679):
- `do tela` → `da tela`
- `próximo tela` → `próxima tela`

**q81_topic1** (~linha 1865):
- `passos geríveis` → `passos gerenciáveis` (já coberto pelo replace global)
- `registar o histórico` → `registrar o histórico` (já coberto)

**q82_topic1** (~linha 1888):
- `Precisa de criar uma ligação` → `Precisa criar uma conexão`

**q97_topic1** (~linha 2247):
- `Se precisa de um sítio novo` → `Se precisa de um lugar novo`

**q104_topic1** (~linhas 2397-2412):
- `governação` → `governança` (já coberto)

### Tarefa 3.2 — Verificação pós-replace (Grep de confirmação)

Após aplicar todos os replaces, rodar Grep em `questions.js` para confirmar zero matches de:
- `\bpartilhar\b`
- `\baceder\b`
- `\bregistar\b`
- `\bplaneia\b`
- `\bgerir\b`
- `está a \w+`
- `tem de `
- `têm de `
- `padr.o` (com o caractere quebrado)

---

## FASE 4 — UX E QUALIDADE

### Tarefa 4.1 — Fix do `formatQuestionText` destrutivo
- **Arquivo:** `src/pages/Simulator.jsx:411-421`
- O regex atual quebra acrônimos como "Power BI:", "ID:", "Por exemplo:" e hífens de palavras compostas
- Substituir por versão mais conservadora:
```js
// Antes:
.replace(/(?<=\? )|(?<=:\s)/g, '\n\n')
.replace(/\s?- /g, '\n  • ')

// Depois:
.replace(/(Cenário:|Cenario:|Selecione a combinação correta[:.])/, '\n$1\n')
.replace(/(^|\n)\s*-\s+/g, '$1• ')
```
- Envolver em `useMemo` baseado em `[currentQuestion?.text]`

### Tarefa 4.2 — Memoizar `selos` em Dashboard
- **Arquivo:** `src/pages/Dashboard.jsx:271-353`
- Envolver `const selos = [...]` em `useMemo(() => [...], [history, streak, t])`

### Tarefa 4.3 — Reduzir reatividade do useEffect do Dashboard
- **Arquivo:** `src/pages/Dashboard.jsx:212`
- Trocar dependência `[session]` por `[session?.user?.id]`

### Tarefa 4.4 — Remover bloqueio de copy/contextmenu
- **Arquivo:** `src/pages/Simulator.jsx:185-199`
- Remover o `useEffect` que bloqueia `contextmenu` e `copy` globalmente (DRM falso que só piora UX)

### Tarefa 4.5 — Code-splitting de rotas
- **Arquivo:** `src/App.jsx`
- Trocar imports estáticos por `lazy`:
```js
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
```
- Envolver `<Routes>` em `<Suspense fallback={<div>Loading...</div>}>`

### Tarefa 4.6 — Otimizar bundle com manualChunks
- **Arquivo:** `vite.config.js`
- Adicionar:
```js
build: {
  chunkSizeWarningLimit: 1500,
  rollupOptions: {
    output: {
      manualChunks: {
        pdf: ['jspdf', 'html2canvas'],
        charts: ['recharts'],
        supabase: ['@supabase/supabase-js'],
      },
    },
  },
},
```

### Tarefa 4.7 — Acessibilidade básica (modais)
- Em todos os modais de Dashboard, Settings, Simulator, SupportModal:
  - Adicionar `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
  - Adicionar listener de `Escape` para fechar
- Em botões ícone (X, Pause, Play, Menu): adicionar `aria-label`

---

## FASE 5 — REFINAMENTO

### Tarefa 5.1 — Criar hook useIsPremium
- Criar `src/hooks/useIsPremium.js`:
```js
import { useMemo } from 'react';
import { isAdminEmail } from '../lib/auth';
export function useIsPremium(session, profile) {
  return useMemo(() =>
    profile?.is_premium ||
    session?.user?.user_metadata?.isPremium ||
    isAdminEmail(session?.user?.email),
  [profile, session]);
}
```
- Substituir lógica duplicada em Dashboard, Simulator, Profile

### Tarefa 5.2 — Corrigir `index.html` para lang dinâmico
- **Alternativa simples:** no `LanguageContext.jsx`, adicionar:
```js
useEffect(() => {
  document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en-US';
}, [language]);
```

### Tarefa 5.3 — Remover dead code
- Remover função `XCircle` em `LandingPage.jsx` (importada mas não usada)
- Avaliar mover `refreshDB.js` e `production_checklist.md` para `scratch/`

### Tarefa 5.4 — Validação final
- Rodar `npm run lint` e `npm run build`
- Confirmar zero warnings de chaves i18n
- Rodar Grep final para confirmar zero marcadores PT-PT em `questions.js`

---

## QUESTÕES PT-PT POR ID (REFERÊNCIA RÁPIDA)

IDs identificados com marcadores PT-PT (bloco q1–q193):

q22_topic1, q23_topic1, q25_topic1, q29_topic1, q30_topic1, q31_topic1, q32_topic1, q35_topic1, q37_topic1, q38_topic1, q42_topic1, q44_topic1, q46_topic1, q49_topic1, q51_topic1, q55_topic1, q56_topic1, q59_topic1, q61_topic1, q62_topic1, q63_topic1, q64_topic1, q65_topic1, q67_topic1, q68_topic1, q69_topic1, q71_topic1, q72_topic1, q73_topic1, q75_topic1, q76_topic1, q77_topic1, q78_topic1, q80_topic1, q81_topic1, q82_topic1, q85_topic1, q86_topic1, q88_topic1, q93_topic1, q95_topic1, q97_topic1, q98_topic1, q104_topic1, q105_topic1, q106_topic1, q108_topic1, q109_topic1, q111_topic1, q113_topic1, q115_topic1, q116_topic1, q117_topic1, q123_topic1

**Total estimado: ~80 questões afetadas** com pelo menos 1 marcador PT-PT

---

## INSTRUÇÕES PARA O SONNET

1. **Sequência:** Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
2. **Para Fase 3:** fazer commit por batch de replaces (não tudo de uma vez)
3. **NÃO tocar** nos blocos `pl200_oficial_*` (~linha 4183 em diante de `questions.js`)
4. **Validar diff** manualmente antes de cada commit na Fase 3
5. **Usar replace_all** com cautela — verificar com Grep antes e depois de cada replace
6. Para cada fase concluída, fazer commit com mensagem clara (ex.: `fix(bugs): add CheckCircle import, fix avancado badge`)
