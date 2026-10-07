# POC — Micro Front-ends com Module Federation, Nginx e Docker

POC/estudo de micro front-ends (MFE). O objetivo é validar builds independentes
com versões diferentes de React, roteamento via Nginx e, na Fase 2, Module
Federation de verdade (host consumindo remotes em runtime na mesma página).

## Arquitetura

```
apps/
  host/   → React 18 + Vite   — shell: header/nav + sidebar + área de conteúdo (roteador)
  app1/   → React 19 + Vite   — página simples (remote na Fase 2)
  app2/   → React 18 + Webpack — página simples (remote na Fase 2)
```

- **host**: dono do layout (header/nav + sidebar). Na Fase 1 renderiza links para
  os apps; na Fase 2 consome `app1` e `app2` como remotes via Module Federation.
- **app1 / app2**: cada um com seu próprio React, build e Dockerfile. Renderizam
  um texto de 52px com um fundo de cor diferente.
- **Nginx (raiz)**: ponto de entrada único, roteando por path para cada app.

## Fases

- **Fase 1 (atual)**: 3 apps isolados renderizando conteúdo simples, cada um com
  Dockerfile, servidos atrás do Nginx via `docker-compose`. Valida builds
  separados, Docker por app e roteamento Nginx.
- **Fase 2**: ligar Module Federation — host (Vite) consumindo os componentes de
  página expostos por app1 (Vite) e app2 (Webpack), testando React 18 vs 19 e
  `shared singleton`.
- **Fase 2b (ideia)**: opção (B) — host **expõe** sidebar/nav como módulos
  federados para os remotes importarem.

## Roteamento (Fase 1)

| Path      | App            | Stack              |
|-----------|----------------|--------------------|
| `/`       | host           | React 18 + Vite    |
| `/app1/`  | app1           | React 19 + Vite    |
| `/app2/`  | app2           | React 18 + Webpack |

## Como rodar

```bash
docker compose up --build
```

Depois abra:

- http://localhost:8090/      → host (shell com header/nav + sidebar)
- http://localhost:8090/app1/ → app1 (React 19 + Vite)
- http://localhost:8090/app2/ → app2 (React 18 + Webpack)

## Stack

- React 18 / 19
- Vite + `@vitejs/plugin-react`
- Webpack 5
- Tailwind CSS v4
- Nginx
- Docker + Docker Compose
