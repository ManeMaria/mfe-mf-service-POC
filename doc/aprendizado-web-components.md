# Aprendizado — Web Components e MFE com frameworks diferentes

Nota para pesquisar depois. Surgiu da pergunta: "se eu tivesse um app em Angular,
daria para compartilhar o layout (Header/Sidebar) do host React com ele?".

---

## A pergunta tem duas camadas

1. **Redirecionar** para o app Angular (abrir ele por uma rota).
2. **Compartilhar o layout** React (Angular renderizar o `<Header/>` React dentro dele).

São problemas de dificuldade bem diferente.

---

## 1. Redirecionar: fácil, independe de framework

Angular buildado também vira estático (`index.html` + JS/CSS), servido por um Nginx
no container dele. Basta mais um serviço atrás do gateway:

```nginx
location /app3/ {
    proxy_pass http://app3:80;
}
```

`/app3/` abre o Angular; header/sidebar do host só precisam de um link para lá.
É o mesmo que a Fase 1 já faz com app1/app2. Vale para Angular, Vue, Svelte, etc.

---

## 2. Compartilhar o layout React com o Angular: dá, mas com ressalva

### O nó do problema

> Um componente **React** só sabe se renderizar com o **runtime do React**.
> Angular tem o runtime dele (Zone.js, change detection). Angular não "executa"
> um componente React — são dois motores de renderização diferentes.

Module Federation **compartilha o código JS** entre apps sem problema (o Angular
consegue **baixar** o módulo React via `remoteEntry.js`). O que ele **não** faz
sozinho é fazer o Angular **renderizar** aquilo.

> **Module Federation compartilha _código_. Renderizar o componente de um
> framework dentro de outro é um problema de _runtime_.**

Por isso o `shared: react` (que serve para dois apps React não duplicarem o React)
**não ajuda** entre React e Angular: cada um carrega seu próprio runtime.

### A ponte: Web Components

Para o Header React aparecer dentro do Angular, empacota-se o componente como
**Web Component** (custom element — padrão do navegador, agnóstico de framework):

- `react-to-webcomponent` (ou similar) transforma o `<Header/>` React em `<app-header>`;
- o Angular (ou Vue, ou qualquer um) usa `<app-header>` como uma tag HTML normal.

Web Component é padrão do browser, não de framework — por isso serve de "idioma
comum" entre stacks diferentes.

---

## Padrões usados quando o MFE mistura frameworks

1. **Cada app dono da tela inteira** (inclui seu próprio header/sidebar); só o
   roteamento é compartilhado (o "redirecionar" do item 1). Mais simples e robusto,
   acoplamento mínimo. Bom ponto de partida.
2. **Layout exposto como Web Components** agnósticos: o host expõe `<app-header>` e
   `<app-sidebar>` como custom elements; React, Angular e Vue consomem igual.
   Caminho "certo" para um layout único entre stacks diferentes.
3. **Orquestrador** (single-spa / Module Federation) montando e desmontando cada
   MFE na página, cada um no seu framework.

---

## Regra de bolso

| Cenário                                   | Ferramenta                          |
|-------------------------------------------|-------------------------------------|
| Dois apps do **mesmo** framework (React)  | `shared` (singleton do React)       |
| Apps de **frameworks diferentes**         | **Web Components** (custom elements) |
| Só navegar entre apps                     | roteamento no Nginx (gateway)       |

---

## A pesquisar depois

- `@angular/elements` (expor Angular como Web Component) e `react-to-webcomponent`.
- Como passar props / eventos através da fronteira de um Web Component.
- Estilos: Shadow DOM isola CSS — como fica o Tailwind nesse caso.
- single-spa como orquestrador multi-framework.
