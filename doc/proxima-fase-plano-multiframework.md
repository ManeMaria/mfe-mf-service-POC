# Próxima fase (plano) — Host compartilhando componentes com múltiplos consumidores

Status: **planejamento. Nada implementado ainda.** Este documento descreve o
próximo passo da POC e os desafios que esperamos enfrentar, para guiar a
implementação futura.

Pré-requisitos de leitura:
- `aprendizado-react18-x-react19-federation.md` — o limite do runtime do React.
- `aprendizado-web-components.md` — Web Components como ponte entre frameworks.

---

## Objetivo

Um **host** (dono do layout) expõe componentes (ex.: `Header`, `Sidebar`) e
**vários consumidores** os integram, cada um com uma stack diferente:

| Consumidor | Stack | Pergunta que queremos responder |
|---|---|---|
| app1 | React 19 + Vite | React de versão diferente do host consegue consumir? |
| app2 | React 18 + Webpack | mesmo React, bundler diferente — o `shared` casa? |
| app3 (novo) | **Angular** | dá para um app Angular renderizar o layout do host? |
| app4 (novo) | **Next.js** | SSR + federation muda o jogo? |

---

## Eixo 1 — Versões diferentes de React (continuação)

Já sabemos (fase anterior) que **cruzar componentes React entre 18 e 19 falha**
com `#525`. O plano para esta fase é testar as saídas, não repetir o erro:

- **1a. Alinhar versões + `singleton`:** host e remotes no mesmo React (ex.: ambos
  19), `shared: { react: { singleton: true }, 'react-dom': { singleton: true } }`.
  Expectativa: Header/Sidebar renderizam dentro do remote. Vira o "antes/depois".
- **1b. Trocar o plugin:** usar **`@module-federation/vite`** (runtime oficial do
  Module Federation) no lugar de `@originjs`. Investigar se a negociação de
  `shared`/`jsx-runtime` é mais robusta e se muda algo com versões divergentes.
- **1c. Fronteira sem React cruzado:** host expõe o layout como **Web Component**,
  e o próprio app1 (React 19) consome via custom element — React não cruza a
  fronteira, então a divergência de versão deixa de importar.

Desafios esperados: resolução de `react/jsx-runtime` no `shared`; CSS do Tailwind
atravessando a fronteira; `StrictMode`/duplo-render mascarando erros.

---

## Eixo 2 — Angular como consumidor (app3)

Angular **não executa** um componente React (runtimes distintos). Logo, o layout
React do host precisa virar algo que o Angular saiba montar.

Plano:
- Expor `Header`/`Sidebar` do host **como Web Components** (`react-to-webcomponent`
  ou wrapper manual com `createRoot`), publicados via federation.
- No app3 Angular: consumir `<app-header>`/`<app-sidebar>` como custom elements
  (`CUSTOM_ELEMENTS_SCHEMA`), carregando o bundle do host em runtime.
- Alternativa de contraste: Angular expondo **seus** componentes como Web
  Components (`@angular/elements`) para o host React consumir — testa a via inversa.

Desafios esperados:
- **Shadow DOM × Tailwind:** se o Web Component isola estilo, o CSS do host não
  vaza e o Tailwind precisa ser injetado dentro do shadow root (ou abrir mão do
  shadow DOM).
- **Props/eventos** cruzando a fronteira: atributos viram strings; objetos/eventos
  exigem propriedade DOM / CustomEvent.
- **Dois runtimes na página** (React + Angular): tamanho do bundle e inicialização.
- **Zone.js**: efeitos colaterais e detecção de mudança do Angular ao redor de um
  nó controlado por React.

---

## Eixo 3 — Next.js como consumidor (app4)

Next adiciona **SSR/RSC** à equação, o que briga com o modelo de remote carregado
só no cliente.

Plano:
- Começar consumindo o remote **client-side only** (`dynamic(() => ..., { ssr:false })`),
  isolando a federation do SSR.
- Depois avaliar `@module-federation/nextjs-mf` (ou o adapter atual mantido) para
  federation integrada ao build do Next.
- Decidir fronteira: o layout federado é **client component**; marcar `"use client"`.

Desafios esperados:
- **SSR vs. remoteEntry no cliente:** hidratação quebra se o servidor renderiza
  algo que o cliente busca depois; `ssr:false` evita, mas perde SSR do layout.
- **App Router / React Server Components:** componente federado dificilmente é RSC;
  tratar como client component.
- **Versão de React do Next** (fixada pelo framework) vs. a do host — volta o
  Eixo 1 (provável necessidade de Web Component para não acoplar versões).
- Build do Next (Turbopack/Webpack) e compatibilidade do plugin de federation.

---

## Estratégia sugerida (ordem de ataque)

1. Fechar o **Eixo 1a** (mesma versão + singleton) para ter federation React↔React
   funcionando de ponta a ponta — base de comparação.
2. Introduzir o **Web Component** do layout (Eixo 1c) — destrava Angular e Next sem
   acoplar versão de React.
3. **app3 Angular** consumindo o Web Component (Eixo 2).
4. **app4 Next** consumindo client-side (Eixo 3), SSR depois.

Cada etapa deve virar um `aprendizado-*.md` com erros enfrentados e saídas, no
mesmo formato dos anteriores.

---

## Hipótese a validar (resumo)

> Entre **mesmo framework** (React↔React), o `shared` resolve — desde que as
> versões sejam compatíveis. Entre **frameworks diferentes** (Angular, Next com
> React próprio), o caminho sustentável é expor o layout como **Web Component**,
> tornando-o agnóstico de versão e de framework. Module Federation entrega o
> código; o Web Component resolve o runtime.
