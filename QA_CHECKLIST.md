# Checklist de QA — HydroLembre PWA

Este documento contém os fluxos de teste manuais para validação final do HydroLembre.

## 🏁 Onboarding
- [OK] **Fluxo Inicial:** Usuário novo vê onboarding ao abrir o app pela primeira vez.
- [OK] **Pular Nome:** Avançar sem nome funciona e não quebra a interface.
- [OK] **Cálculo de Meta:** Peso 70kg exibe meta recomendada de 2450ml.
- [OK] **Meta Manual:** Definir meta manual de 3000ml salva corretamente.
- [OK] **Seleção de Recipiente:** Copo 500ml selecionado é exibido como padrão no dashboard.
- [OK] **Permissão de Notificação:** Modal de permissão aparece e trata "permitir" e "bloquear".

## 💧 Dashboard
- [OK] **Botão Rápido:** Adiciona o volume padrão com um toque.
- [OK] **Desfazer:** Snackbar de "Registro adicionado" aparece e "Desfazer" funciona em até 5s.
- [OK] **Anel de Progresso:** Atualiza imediatamente após adicionar ou excluir água.
- [OK] **Volume Customizado:** Validar valor inválido (0, negativo, muito alto) mostra erro.
- [OK] **Persistência:** Fechar aba e reabrir mantém os dados.
- [ ] **Virada de Dia:** Contador zera à meia-noite, mas o histórico do dia anterior é preservado.

## 🔔 Notificações
- [OK] **Disparo:** Lembrete aparece no intervalo configurado (ex: cada 1 min para teste).
- [OK] **Janela de Horário:** Notificações não aparecem fora do horário (ex: configurar fim para 1 min atrás).
- [OK] **Meta Atingida:** Lembretes param (ou perguntam se quer pausar) ao atingir 100%.
- [OK] **iOS Fallback:** Banner de instalação aparece no iOS Safari (simular via User Agent).

## 📅 Histórico
- [OK] **Gráfico:** Exibe barras corretas para 7 e 30 dias.
- [OK] **Visualização:** Diferencia visualmente dias com meta atingida (azul) e não atingida (cinza).
- [OK] **Detalhamento:** Clicar em um dia abre a lista de registros daquela data.
- [OK] **Edição/Exclusão:** Editar volume ou excluir registro no detalhe do dia funciona e atualiza o total.

## 📈 Estatísticas
- [OK] **Streak Atual:** Incrementa corretamente após atingir a meta hoje.
- [OK] **Melhor Streak:** Preserva o recorde histórico mesmo se o streak atual quebrar.
- [OK] **Médias:** Cálculo de média de 7 e 30 dias bate com os registros reais.

## ⚙️ Configurações
- [OK] **Perfil:** Alterar nome ou peso reflete imediatamente no app.
- [ ] **Aparência:** Trocar entre Claro, Escuro e Sistema aplica o tema sem flicker.
- [ ] **Recipientes:** Adicionar/remover volumes rápidos atualiza os atalhos no dashboard.
- [ ] **Limpeza:** "Limpar histórico" apaga apenas registros; "Apagar tudo" reseta o app.

## 💾 Exportação e Importação
- [ ] **JSON:** Exportar e verificar se o arquivo contém perfil, metas e registros.
- [ ] **CSV:** Exportar e abrir no Excel/Sheets para validar colunas e encoding.
- [ ] **Importar (Mesclar):** Importar backup e verificar se novos registros foram adicionados sem duplicar existentes.
- [ ] **Importar (Substituir):** Importar backup e verificar se os dados antigos foram removidos.

## 📱 PWA
- [ ] **Instalação:** Banner de instalação aparece após 30s ou 1 registro.
- [ ] **Offline:** Colocar navegador em "Offline" e verificar se o app carrega e permite registrar água.
- [ ] **Atualização:** Simular novo Service Worker e verificar se o banner de "Nova versão" aparece.

---
**Data do QA:** ___/___/___  
**Versão Testada:** 1.0.0  
**Status Final:** [ ] Aprovado | [ ] Reprovado
