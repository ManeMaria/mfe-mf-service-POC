# POC — Micro Front-ends (MFE)

Documento de apresentação do projeto. Linguagem simples, para explicar a ideia
sem entrar em detalhe de código.

---

## O que é

Uma prova de conceito (POC) de **micro front-ends**: em vez de um único site
gigante, a tela é montada por **vários apps independentes**, cada um com seu
próprio código, sua própria build e até sua própria versão de React.

A pergunta que queremos responder:

> Dá para ter apps front-end **separados**, com **tecnologias diferentes**
> (Vite, Webpack, versões diferentes de React), rodando juntos atrás de um
> **Nginx**, cada um no seu **Docker**?

---

## As peças

```
          navegador
             │
             ▼
     ┌───────────────┐
     │  Nginx (porta  │   ← ponto de entrada único (gateway)
     │     8090)      │
     └───────┬────────┘
      ┌───────┼────────┐
      ▼       ▼        ▼
   /         /app1/   /app2/
  host       app1      app2
(shell)    (página)  (página)
```

| App    | Papel                                  | Stack              |
|--------|----------------------------------------|--------------------|
| host   | "casca" do site: cabeçalho + menu      | React 18 + Vite    |
| app1   | uma página simples                     | React 19 + Vite    |
| app2   | uma página simples                     | React 18 + Webpack |

- **host** — é o dono do layout: tem o **header com navegação** e a **sidebar**.
  É por ele que o usuário circula entre os apps.
- **app1 / app2** — cada um é um app completo e independente, com build e Docker
  próprios. Cada um mostra um texto grande (52px) com uma cor de fundo diferente,
  só para deixar claro, visualmente, que são apps distintos.
- **Nginx** — é a porta de entrada. Decide, pelo endereço, para qual app mandar
  o visitante (`/` → host, `/app1/` → app1, `/app2/` → app2).

---

## Por que isso importa

- **Times independentes**: cada app pode ser desenvolvido, buildado e publicado
  separadamente, sem travar os outros.
- **Tecnologias convivendo**: um app em Vite, outro em Webpack, versões
  diferentes de React — tudo no mesmo produto.
- **Deploy isolado**: cada app tem seu próprio Docker; dá para atualizar um sem
  mexer nos demais.

---

## Como está dividido (fases)

- **Fase 1 (feita)** — os 3 apps isolados, cada um renderizando conteúdo simples,
  cada um com Docker, servidos atrás do Nginx. Prova que builds separados, Docker
  por app e roteamento Nginx funcionam juntos.
- **Fase 2 (próxima)** — ligar **Module Federation**: o host passa a carregar as
  páginas de app1 e app2 **dentro da mesma tela, em tempo real** (e não mais por
  link). É aqui que testamos de verdade React 18 x React 19 convivendo.
- **Fase 2b (ideia)** — o caminho inverso: o host **oferecer** o header e a
  sidebar para os outros apps reutilizarem.

---

## Como rodar (demo)

```bash
docker compose up --build
```

Depois, no navegador:

- http://localhost:8090/      → host (a casca, com menu e sidebar)
- http://localhost:8090/app1/ → app1 (React 19 + Vite)
- http://localhost:8090/app2/ → app2 (React 18 + Webpack)

---

## Em uma frase

> Vários front-ends independentes, com stacks diferentes, cada um no seu Docker,
> aparecendo como um produto só graças ao Nginx — e, na próxima fase, se
> encaixando na mesma tela via Module Federation.
