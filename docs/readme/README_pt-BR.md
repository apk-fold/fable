<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · **Português (Brasil)** · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Ícone do Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Suas horas, seu salário bruto, sem calculadora.</b><br>Controle de horas para contratos franceses de trabalho temporário (intérim), por prazo determinado (CDD) e indeterminado (CDI): horas extras por faixas, noite, domingo, feriados, vale-refeição, IFM e férias remuneradas.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Baixar o APK</b></a> · Android 7 ou superior · grátis, offline, sem conta</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Início e relógio de ponto">
  <img src="../../docs/historique.png" width="200" alt="Histórico">
  <img src="../../docs/resume.png" width="200" alt="Resumo do mês">
  <img src="../../docs/mission.png" width="200" alt="Configurações de uma missão">
</p>

## Instalar

1. No celular, abra o link **Baixar o APK** acima (ou a [release](https://github.com/apk-fold/fable/releases/latest) mais recente).
2. Permita a instalação a partir do navegador se o Android pedir e depois instale.
3. As novas versões são instaladas por cima da antiga: mesma assinatura, dados preservados.

Cada alteração de código enviada para `main` recompila o APK automaticamente (GitHub Actions) e publica uma nova release.

### Assinatura

A chave de assinatura não está no repositório. O GitHub Actions a lê do secret **`FABLE_KEYSTORE_B64`** (o arquivo `.jks` codificado em base64, senha `FABLE_KEYSTORE_PASSWORD` opcional). Sem esse secret, o APK é assinado com uma chave temporária: ele instala, mas a próxima versão vai pedir para desinstalar a anterior.

## O que o app faz

**Registro**
- Relógio de ponto: *Começar*, *Pausa*, *Terminar* — o dia é criado sozinho (arredondamento para o quarto de hora opcional).
- Registro manual: data, início → fim (turnos que passam da meia-noite são suportados), pausa, botões **+ Horas extras** (+15 min, +30 min, +1 h).
- Prévia ao vivo do cálculo enquanto você digita, aviso se dois dias se sobrepõem.
- Repetir um dia em outros dias da semana, duplicar um dia, forçar ou remover o vale-refeição caso a caso.

**Missões** (uma por empregador ou agência), cada uma com suas regras:
- Tipo de contrato: Temporário (intérim), Prazo determinado (CDD), Indeterminado (CDI), Outro — valor-hora bruto, cor.
- **Horas extras** por semana ou por dia, com 2 faixas (ex.: +25% a partir de 35 h, +50% a partir de 43 h).
- **Horas noturnas** em uma faixa ajustável (21 h → 6 h por padrão) com seu adicional.
- **Domingos** e **feriados**: calendário da **França metropolitana (Paris)** por padrão, ou **Alsácia-Mosela** (+ Sexta-feira Santa e 26 de dezembro), configurável para todas as missões.
- Acúmulo de adicionais: somados ou só o maior; a noite de sábado para domingo é contada pelo dia de início ou hora a hora.
- **Vale-refeição** a cada dia trabalhado ou a partir de um número de horas, **auxílio-transporte** por dia.
- **IFM** (indenização de fim de missão, trabalho temporário) ou **prêmio de precariedade** (CDD) e **ICCP** (indenização de férias), 10% + 10% por padrão.
- **Período de folha** no mês inteiro ou deslocado (ex.: do dia 21 ao dia 20), horários e pausa padrão.

**Acompanhamento**
- Início: relógio de ponto, semana atual com o indicador do limite de horas extras, totais do mês.
- Histórico por mês, em lista agrupada por semana ou em calendário, filtro por missão.
- Resumo de semana / mês / ano: horas, horas extras por faixa, noite, domingo, feriados, dias trabalhados, gráfico, detalhamento do bruto até o **líquido estimado** (alíquota de descontos ajustável).
- **Exportação em PDF** (folha de ponto pronta para enviar), **Excel .xlsx** e **CSV** — sem assinatura.

**O resto**
- Lembrete por notificação nos dias e no horário que você escolher.
- **Tudo é personalizável** em Configurações: tema escuro, preto (AMOLED), claro ou automático; cor principal e cores dos adicionais (paleta ou cor livre); fontes; tamanho do texto; cantos; densidade; animações; formato das durações (7 h 30, 7h30 ou 7,5 h); modo discreto que esconde os valores; tela inicial; visualização do histórico. Cor livre também para cada missão.
- Backup / restauração em arquivo `.json`, cópia de segurança automática nos arquivos privados do app.
- Nenhum dado sai do celular: sem conta, sem servidor, sem anúncios.

## Como é calculado

Cada dia é dividido minuto a minuto. Para cada minuto trabalhado, o Fable sabe se ele cai à noite, num domingo ou num feriado e em qual faixa de horas extras (acumulado da semana de segunda a domingo, em ordem cronológica). A pausa é descontada proporcionalmente. Uma semana que atravessa dois meses é calculada inteira e depois só os dias do período são contados.

- Salário bruto = horas × valor-hora + adicionais
- IFM / prêmio de precariedade = bruto × 10%
- ICCP = (bruto + IFM) × 10%
- Líquido estimado = total bruto − descontos (22% por padrão) + refeição e transporte

São **estimativas**: o que vale é a sua convenção coletiva e o seu holerite.

## Desenvolvimento

```bash
npm install
npm run dev        # interface no navegador
npm test           # testes do motor de cálculo
npm run sync       # build web + projeto Android (após "npx cap add android" na primeira vez)
npm run open       # abre o projeto no Android Studio
```

Estrutura: `src/core` (cálculos, feriados, armazenamento, exportações PDF/Excel), `src/views` (telas), `src/ui` (componentes), `scripts/patch-android.mjs` (nome, ícones, tema e assinatura do projeto Android), `tests/` (testes do motor e fluxos da interface).

Stack: HTML/CSS/JS sem framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Fontes Manrope e Unbounded (SIL Open Font License).
