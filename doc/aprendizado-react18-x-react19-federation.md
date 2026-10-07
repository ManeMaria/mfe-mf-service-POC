# Aprendizado — React 18 (host) × React 19 (app1) via Module Federation

Registro do experimento mais importante da POC: o host (React 18) expõe
`Header`/`Sidebar` e o app1 (React 19) os consome via Module Federation
(`@originjs/vite-plugin-federation`). Objetivo: descobrir, na prática, o que
acontece ao cruzar componentes de UI entre **versões diferentes de React**.

> Este é o cenário "além do tutorial" que a POC quis enfrentar: não é um passo a
> passo que dá certo, é a investigação de um limite real da tecnologia.

---

## Erros enfrentados, em ordem (cada um ensinou algo)

### 1. `Top-level await is not available in the configured target`
- **Causa:** o plugin de federation gera `await importShared(...)` no bundle; o
  target padrão do Vite (es2020) não aceita top-level await.
- **Correção:** `build.target: 'esnext'` (+ `minify: false`) nos apps com federation.

### 2. `remoteEntry.js` retornando `text/html` (404 disfarçado)
- **Causa:** imagem Docker servida era anterior ao `federation()`; o arquivo não
  existia e o Nginx caía no `try_files .../index.html`.
- **Correção:** rebuild **real** da imagem (`--no-cache`) + `--force-recreate`.

### 3. Chunks do remote em 404 pelo gateway (mas 200 direto no container)
- **Causa (achado forte):** o Nginx gateway resolve o IP do upstream (`host`) no
  boot e **cacheia**. Ao recriar o container `host`, o IP muda, mas o gateway
  continua apontando para o IP antigo — servindo o `remoteEntry.js` velho e 404
  nos chunks novos.
- **Correção:** `docker compose restart gateway` após recriar um upstream (em
  produção: `resolver` do Docker + variável no `proxy_pass`, ou recarregar o Nginx).

### 4. `Minified React error #525` — o nó central
- **Texto real:** *"A React Element from an older version of React was rendered.
  This is not supported."*
- **Causa:** elementos React carregam a assinatura da **versão/instância** que os
  criou. O `Header` é criado pelo **React 18** do host; ao ser renderizado dentro
  da árvore do **React 19** do app1, o React 19 rejeita o elemento "de outra versão".

---

## Os dois caminhos testados — e por que ambos falham aqui

| Configuração `shared` | Resultado | Porquê |
|---|---|---|
| `shared` React **singleton** | Erro ao resolver `react/jsx-runtime` / #525 | o `@originjs` não resolve o specifier `react/jsx-runtime`; e mesmo unificando `react`, o `jsx-runtime` divergente recria o problema |
| **Sem `shared`** (cada um seu React) | #525 | host cria elementos com React 18, app1 renderiza com React 19 → versões incompatíveis |

**Conclusão:** com **versões diferentes** de React (18 vs 19), compartilhar um
componente de UI que **executa** na árvore do outro app não funciona — nem
unificando o React (esbarra no `jsx-runtime`/instância), nem deixando cada um com
o seu (os elementos de uma versão são rejeitados pela outra).

---

## Saídas reais (para uma próxima fase)

1. **Alinhar as versões de React** dos dois lados (ex.: ambos 18 **ou** ambos 19)
   e compartilhar como `singleton`. É o caminho padrão de MFE com React — o preço
   é abrir mão de "cada app na sua versão".
2. **Não cruzar componentes React pela fronteira.** Trocar só dados/strings, ou
   expor o layout como **Web Component** (custom element), que é agnóstico de
   versão/framework. (ver `aprendizado-web-components.md`)
3. Trocar o plugin por **`@module-federation/vite`** (runtime oficial do Module
   Federation), que negocia `shared` de forma mais completa — a investigar se
   muda o resultado com versões divergentes.

---

## Frase para a apresentação

> Module Federation entrega o **código** do componente entre apps sem dificuldade.
> O limite não é a entrega — é o **runtime do React**: um elemento criado por uma
> versão/instância de React não pode ser renderizado por outra. Versões diferentes
> de React compartilhando UI exigem ou unificar o React, ou uma ponte agnóstica
> (Web Components).
