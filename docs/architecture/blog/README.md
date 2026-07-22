# Módulo Blog no Vue — arquitetura técnica

| Item | Valor |
| --- | --- |
| Última atualização | 2026-07-22 |
| Versão identificada | `vue-project` `0.0.0`; Vue `^3.5.22`; Vite `^7.1.11`; TypeScript `~5.9.0` |
| Escopo analisado | Frontend em `thestarart_vue/`: Blog público, página de post, administração de posts, editor, chamadas HTTP, autenticação que protege o painel e integração com a API Laravel |
| Responsável pela atualização | equipe de desenvolvimento |

> **Legenda de evidência:** **Implementado** descreve código existente e inspecionado. **Não encontrado** indica que não há implementação correspondente no projeto. **Planejado ou recomendado** é uma melhoria proposta; não é comportamento atual.

O diagrama editável está em [blog-overview.mmd](blog-overview.mmd); sua exportação PNG está em [blog-overview.png](blog-overview.png).

## 1. Objetivo e responsabilidades

**Implementado.** No Vue, o módulo Blog:

- apresenta uma prévia de quatro posts na home e a listagem pública paginada em `/blog`;
- apresenta o detalhe público de um post em `/post/:slug`, incluindo conteúdo HTML, visualizações e likes;
- usa o repositório de posts para chamar exclusivamente os endpoints Laravel já definidos;
- mantém o painel de posts em `/admin/blog`, com filtro por estado editorial e posts removidos;
- cria e edita posts em `/admin/blog/editor/:id?`, com prévia de slug, data local de publicação, tags, thumbnail, preview sanitizado, contador de palavras e aviso de alterações não salvas;
- compõe HTML de edição com Tiptap e oferece uma sanitização defensiva no navegador antes de qualquer `v-html`;
- usa cookies da sessão Sanctum para a área administrativa e não armazena token de autenticação em `localStorage`;
- armazena apenas um UUID anônimo em `localStorage` para as interações públicas de visualização e like.

O frontend **não** decide quais posts são públicos, nem autoriza o CRUD administrativo: essas são responsabilidades da API Laravel. O guard do Vue melhora a navegação, mas não substitui `auth:sanctum` e `PostPolicy` no backend.

## 2. Estrutura e arquivos reais

```text
src/
├── main.ts
├── App.vue
├── router/index.ts
├── layouts/
│   ├── DefaultLayout.vue
│   └── AdminLayout.vue
├── views/
│   ├── blog/
│   │   ├── BlogView.vue
│   │   └── PostView.vue
│   └── admin/blog/
│       ├── BlogListView.vue
│       └── BlogEditView.vue
├── components/
│   ├── global/
│   │   ├── CardWindowHeader.vue
│   │   └── blog/
│   │       ├── PostCard.vue
│   │       ├── PostGrid.vue
│   │       ├── BlogGrid.vue                 # encontrado, sem uso atual
│   │       └── Blog.css                     # encontrado, sem import atual
│   └── admin/blog/
│       ├── BlogPostList.vue
│       ├── Blog.vue                         # placeholder, sem uso atual
│       ├── BlogEdit.vue                     # placeholder, sem uso atual
│       └── editor/
│           ├── TiptapEditor.vue
│           └── TiptapToolbar.vue
├── composables/
│   ├── api/useApi.ts
│   ├── useAuth.ts
│   └── posts/
│       ├── types.ts
│       ├── usePostRepository.ts
│       ├── usePublicPosts.ts
│       ├── usePosts.ts
│       └── usePostEngagement.ts
└── utils/
    ├── postSlug.ts
    ├── sanitizePostHtml.ts
    └── toFormData.ts

.env.example
package.json
vite.config.ts
vercel.json
```

### Componentes por categoria

| Categoria | Encontrados | Observação |
| --- | --- | --- |
| Pages/views | `BlogView`, `PostView`, `BlogListView`, `BlogEditView` | São os coordenadores das quatro telas do Blog. |
| Componentes públicos | `PostGrid`, `PostCard`, `CardWindowHeader` | `PostGrid` é reutilizado pela home. |
| Componentes administrativos | `BlogPostList`, `TiptapEditor`, `TiptapToolbar` | `Blog.vue` e `BlogEdit.vue` são placeholders sem uso. |
| Composables | `usePublicPosts`, `usePosts`, `usePostEngagement`, `useAuth`, `useApi` | Estado e acesso HTTP. |
| Repositório | `usePostsRepository` | Apesar do nome de composable, é a camada concreta de acesso à API de posts. |
| Tipos | `types.ts` | `PublicPostSummary`, `PublicPost`, `Post`, paginação e DTO de escrita. |
| Utilitários | `postSlug`, `sanitizePostHtml`, `toFormData` | Slug, defesa contra HTML perigoso e payload multipart. |
| Store Pinia do Blog | **Não encontrado** | O Blog não usa store Pinia de domínio. |
| Testes automatizados do Blog | **Não encontrado** | Não há configuração de Vitest, Cypress, Playwright ou arquivos de teste encontrados. |
| Camada SSR/SEO | **Não encontrado** | Vite SPA com fallback da Vercel; não há SSR ou geração estática de posts. |

## 3. Rotas, layouts e proteção de navegação

`src/router/index.ts` usa `createWebHistory`. As views são carregadas dinamicamente, exceto os imports diretos necessários para montar a aplicação.

| Área | Rota | Layout / view | Proteção no Vue | Comportamento |
| --- | --- | --- | --- | --- |
| Pública | `/` | `DefaultLayout` → `HomeView` → `components/home/Main.vue` | Não exige sessão | Busca quatro resumos públicos e passa-os ao `PostGrid`. |
| Pública | `/blog` | `DefaultLayout` → `views/blog/BlogView.vue` | Não exige sessão | Lista posts públicos paginados; página fica em `?page=`. |
| Pública | `/post/:slug` | `DefaultLayout` → `views/blog/PostView.vue` | Não exige sessão | Busca um post público pelo slug. |
| Admin | `/admin/blog` | `AdminLayout` → `views/admin/blog/BlogListView.vue` | Guard chama `useAuth().checkSession()` antes de acesso externo ao admin | Lista posts do usuário autenticado. |
| Admin | `/admin/blog/editor/:id?` | `AdminLayout` → `views/admin/blog/BlogEditView.vue` | Mesmo guard | Sem `id` cria; com `id` lê e atualiza. |
| Login de suporte | `/login?redirect=/admin/...` | `views/auth/LoginView.vue` → `components/login/Login.vue` | Redireciona usuário já autenticado | Obtém cookie CSRF, cria sessão e volta ao destino seguro. |

O guard também exige que exista `localStorage.lang` antes das rotas comuns; caso não exista, redireciona para `/choose-your-lang`. Isso é seleção da interface/Google Translate e não define `Post.lang` na chamada do Blog.

### Shells visuais que envolvem o Blog

- `DefaultLayout.vue` envolve as rotas públicas com navbar, laterais, player YouTube, chat, changelog, pet e rodapé. Por isso as telas públicas do Blog convivem com esses widgets persistentes.
- `AdminLayout.vue` envolve o Blog administrativo com sidebar, logout, sidebar auxiliar e pet. No mobile, oferece uma barra horizontal de navegação administrativa.
- `CardWindowHeader.vue` é a moldura usada em `BlogView` e na prévia do Blog da home; preserva a identidade visual de janela retro.

## 4. Fluxo de dados e acesso HTTP

### 4.1 Caminho principal

```text
View / componente coordenador
→ composable de estado ou repositório direto
→ usePostsRepository()
→ useApi().client()
→ VITE_API_URL + endpoint Laravel
→ dados tipados / ApiError
→ refs reativas e template
```

`useApi.ts`:

- obtém a base de `VITE_API_URL`, removendo uma barra final; o fallback é `http://thestarartlaravelback.test/api`;
- sempre envia `Accept: application/json`, `X-Requested-With: XMLHttpRequest` e `credentials: "include"`;
- para métodos que modificam estado, lê o cookie `XSRF-TOKEN` e envia `X-XSRF-TOKEN` quando disponível;
- obtém o cookie CSRF em `https?://<origem-da-api>/sanctum/csrf-cookie` por `requestCsrfCookie()`;
- converte respostas não-2xx em `ApiError`, com `status` e `payload` preservados;
- chama o handler global somente em `401`, salvo quando o chamador usa `handleUnauthorized: false`.

`main.ts` registra esse handler: limpa o estado em memória de `useAuth` e leva o usuário a `/login` com o destino atual em `redirect`. Isto não intercepta `403`, `404`, `419`, `422`, `429` ou `5xx` globalmente.

### 4.2 `usePostsRepository.ts`: endpoints realmente chamados

Todos os caminhos abaixo são relativos à URL que já inclui `/api`.

| Método do repositório | HTTP e endpoint | Chamadores atuais | Contrato tratado |
| --- | --- | --- | --- |
| `getPublicPosts(filters)` | `GET /public/posts?page=&per_page=&lang=&order=` | `usePublicPosts` | `{ data: PublicPostSummary[], meta: PaginationMeta }` |
| `getPublicPost(slug)` | `GET /public/posts/{slug}` | `PostView` | `{ data: PublicPost }` |
| `recordPublicView` | `POST /public/posts/{slug}/views` | `usePostEngagement` | `{ data: { views_count, recorded } }` |
| `getPublicLikeState` | `GET /public/posts/{slug}/likes?visitor_id=` | `usePostEngagement` | `{ data: { likes_count, liked } }` |
| `addPublicLike` | `POST /public/posts/{slug}/likes` | `usePostEngagement` | `{ data: { likes_count, liked, changed } }` |
| `removePublicLike` | `DELETE /public/posts/{slug}/likes` | `usePostEngagement` | Mesmo contrato de like. |
| `getAdminPosts` | `GET /admin/posts?status=&trashed=` | `usePosts` | `{ data: Post[], meta: PaginationMeta }` |
| `getAdminPost` | `GET /admin/posts/{id}` | `BlogEditView` | `{ data: Post }` |
| `create` | `POST /admin/posts` multipart | `usePosts`, `BlogEditView` | `{ data: Post }` |
| `update` | `POST /admin/posts/{id}` + `X-HTTP-Method-Override: PUT` | `usePosts`, `BlogEditView` | Resposta usada como `{ data: Post }`. |
| `delete` | `DELETE /admin/posts/{id}` | `usePosts` | A tela não lê body; o backend responde `204`. |
| `uploadThumbnail` | `POST /admin/posts/thumbnail` multipart | **Não encontrado em chamadas atuais** | Método existe, mas o editor grava a thumbnail dentro de create/update. |
| `uploadImage` | `POST /upload/image` multipart | `TiptapToolbar` | `{ url: string }`. |

O repositório codifica `slug` com `encodeURIComponent`. Só os filtros `page`, `perPage`, `lang` e `order` públicos são expostos no tipo `PublicPostListFilters`; busca e filtros administrativos de idioma/paginação não estão implementados no cliente atual, embora a API possa aceitá-los.

### 4.3 Tipos reais

| Tipo | Campos relevantes |
| --- | --- |
| `PublicPostSummary` | `id`, `title`, `slug`, `excerpt`, `thumbnail`, `tags`, `published_at`, `lang`, `views_count`, `likes_count` |
| `PublicPost` | Todos os campos do resumo mais `content`. |
| `Post` | `PublicPost` mais `user_id`, `status` (`draft`, `scheduled`, `published`, `archived`) e `deleted_at?`. |
| `PaginationMeta` | `current_page`, `last_page`, `per_page`, `total`. |
| `PostCreateDTO` | título, slug, excerpt, `File` de thumbnail opcional, HTML, tags, data, status, flag manual de slug e idioma. |

## 5. Blog público

### 5.1 Prévia na home

`src/components/home/Main.vue` chama `fetchPublicPosts({ perPage: 4 })` no `onMounted`. Passa o resultado para `PostGrid` com `limit=4` e `show-view-all`. O botão leva a `/blog`.

### 5.2 Listagem em `/blog`

`BlogView.vue`:

1. considera o query param `page` inteiro positivo, usando 1 como padrão;
2. chama `usePublicPosts().fetchPublicPosts({ page, perPage: 8 })`;
3. atualiza `posts`, `pagination`, `pending` e `error` somente dentro daquela instância do composable;
4. se a página solicitada ultrapassar `meta.last_page`, troca a query pela última página válida;
5. observa `route.query.page` com `immediate: true`, portanto uma troca de página no `PostGrid` faz `router.push` e uma nova consulta;
6. renderiza o banner e `PostGrid` dentro da janela `Blog.exe`.

Não há posts de simulação, cache local, carregamento total do acervo, filtro visual de idioma, busca ou seletor de ordem nessa tela. Sem `lang` explícito, o frontend deixa o backend aplicar seu padrão atual.

### 5.3 `PostGrid` e `PostCard`

- `PostGrid.vue` trata carregamento, falha, lista vazia, cards e paginação. Mostra no máximo cinco botões de página, anterior/próxima e o total retornado pelo backend.
- Enquanto os dados anteriores já existem e uma nova página carrega, a grade continua visível e os controles ficam desabilitados. O estado de loading integral só é mostrado quando não há posts visíveis.
- `PostCard.vue` mostra thumbnail como imagem de fundo, primeira tag ou `SYSTEM`, título, excerpt e data; navega com `<router-link>` para `/post/${post.slug}`.
- `PostGrid` também suporta `limit` e `showViewAll` para a home.

`BlogGrid.vue` é uma implementação anterior/paralela que também busca quatro posts e replica cards. Nenhum import de produção o usa. `Blog.css` contém somente `.retro-shadow` e também não possui import encontrado.

### 5.4 Detalhe em `/post/:slug`

`PostView.vue` busca o post apenas no `onMounted`; como `App.vue` usa `:key="route.fullPath"`, mudar de slug recria a view. Após o retorno:

- mostra título, data, thumbnail, views, likes e `content`;
- chama `sanitizePostHtml()` antes do `v-html`;
- depois de cinco segundos, com a aba visível, chama `recordView`; se a aba for ocultada, cancela o timer;
- usa `viewRequestSent` para não enviar uma segunda view enquanto a instância está montada;
- solicita o estado de like sem bloquear a leitura; o botão chama add/remove e atualiza os dois contadores reativos;
- deixa falhas de engajamento como não críticas, mas mostra erro de like quando a ação do usuário falha;
- apresenta um único estado genérico de erro para 404, 401 inesperado, rede e 5xx.

`fallbackImage` está declarado em `PostView.vue`, mas não é usado no template atual.

### 5.5 Visualizações e likes anônimos

`usePostEngagement.ts` usa a chave `thestarart_visitor_id`:

1. reutiliza o UUID existente em `localStorage`;
2. caso não exista, tenta `crypto.randomUUID()`, depois `crypto.getRandomValues()` e, em último caso, um gerador pseudoaleatório;
3. se o storage estiver indisponível, mantém o UUID somente em memória;
4. antes de POST/DELETE, solicita cookie CSRF;
5. envia somente `visitor_id` à API. O hash, a deduplicação e os limites pertencem ao backend.

Esse UUID não é um token de login e pode ser apagado pelo visitante. O frontend não garante unicidade ou impede automação; ele apenas integra a regra pública da API.

## 6. Administração de posts

### 6.1 Sessão e autorização

`useAuth.ts` conserva `user` em um `ref` de módulo, portanto é compartilhado entre chamadas, mas não persistido após recarregar a página. O fluxo é:

```text
Login.vue → useAuth.login()
→ GET /sanctum/csrf-cookie
→ POST /api/login com cookies
→ { data: AuthUser }
→ navegação para /admin

rota /admin/* → guard → checkSession() → GET /api/me
→ backend aceita ou rejeita auth:sanctum
```

Erros conhecidos recebem mensagens específicas no cliente: `401`, `419`, `429`, `422` e `5xx`. O payload de `422.errors` é exposto em `fieldErrors`. `Logout.vue` chama `POST /api/logout`, limpa o estado quando necessário e navega para login.

**Implementado com limite explícito:** o guard apenas evita navegar para telas administrativas sem uma sessão conhecida. Qualquer usuário pode forjar estado do navegador; a API Laravel continua sendo a barreira efetiva por `auth:sanctum` e policy de propriedade.

### 6.2 Lista administrativa

`BlogListView.vue` usa `usePosts()` e `BlogPostList.vue`:

- busca no mount com `trashed=without`;
- oferece filtros de status e de soft delete, repassados ao repositório;
- mostra três cartões: total, publicados e rascunhos da lista retornada;
- `BlogPostList` apresenta status, tags, excerpt, data e botões de editar, arquivar e excluir;
- o botão de arquivar só aparece em posts publicados e chama `toggleVisibility`, que envia `archived`;
- exclusão pede `window.confirm`, chama `DELETE` e remove o item localmente após sucesso.

`usePosts()` é um estado compartilhado no nível do módulo. Ele recebe `meta` da API, mas atualmente descarta paginação: `posts`, contadores e lista representam somente a página retornada pelo backend. Não há controle de página nessa tela.

### 6.3 Criação e edição

`BlogEditView.vue` distingue criação e edição pela presença de `route.params.id`.

| Comportamento | Implementação atual |
| --- | --- |
| Carregamento em edição | `getAdminPost(id)` no mount preenche o `reactive form`. |
| Slug | `watch(form.title)` chama `normalizePostSlug` até a primeira edição manual; em edição de post existente, a flag começa como manual para preservar a slug. |
| Normalização no cliente | NFD sem acentos, minúsculas, caracteres não alfanuméricos como hífen, hífens duplicados removidos, bordas removidas e máximo 255. |
| Status e data | `draft`/`archived` limpam `published_at`; `published`/`scheduled` preenchem data local se vazia. Antes de enviar, a data local vira ISO UTC. |
| Tags | Entrada lower-case, evita duplicidade exata e remove por índice. |
| Thumbnail | Aceita PNG/JPEG/WebP, cria preview com `URL.createObjectURL` e o revoga ao trocar, resetar ou desmontar. |
| Conteúdo | `TiptapEditor` atualiza `form.content` via `v-model`. |
| Preview e leitura | Aplica `sanitizePostHtml`, extrai texto com `DOMParser`, conta palavras e estima minutos a 200 palavras/minuto. |
| Persistência | Cria ou atualiza em `multipart/form-data`, bloqueando submissão duplicada com `isSubmitting`. |
| Erros | Em `422`, mostra a primeira mensagem somente para slug e data; mantém as demais em `fieldErrors`, sem renderização por campo. |
| Saída com alterações | `onBeforeRouteLeave` usa fingerprint do formulário e confirma por `window.confirm`. |

Para criar um post, a própria view usa `postsRepo.create()` diretamente, não `usePosts().createPost()`. A edição também usa o repositório diretamente. Isto evita alterar uma lista que não está montada, mas deixa duas formas de orquestrar escrita no módulo.

## 7. Editor Tiptap, uploads e sanitização

### 7.1 Editor

`TiptapEditor.vue` inicializa:

- `StarterKit` — parágrafos, headings, listas, blockquote, bloco de código, separador, histórico e demais extensões-base;
- `@tiptap/extension-image`, sem Base64;
- `@tiptap/extension-link`, com protocolos HTTP/HTTPS e `rel="noopener noreferrer"`;
- `@tiptap/extension-underline`;
- `@tiptap/extension-youtube`, com `controls` e `nocookie`.

`TiptapToolbar.vue` expõe negrito, itálico, sublinhado, headings 2/3, listas, citação, bloco de código, separador, link, imagem, YouTube, desfazer e refazer.

Para imagem, solicita alt obrigatório e título opcional, envia `image` para `/api/upload/image` e insere a URL devolvida. Para link, aceita só URL HTTP/HTTPS. Para YouTube, aceita `youtu.be`, `youtube.com`, `www.youtube.com` e `m.youtube.com`, extrai um ID de 11 caracteres e insere apenas o embed `youtube-nocookie.com`.

Não há alinhamento, autosave, indicador de upload, diálogo visual próprio, edição de alt após inserção, contador de caracteres nem preview em rota separada.

### 7.2 Sanitização no navegador

`sanitizePostHtml.ts` usa `dompurify` com allowlist de tags e atributos. Permite blocos textuais, listas, links, imagens, `iframe` e alguns atributos de mídia. Após DOMPurify:

- remove iframes que não correspondem a `youtube.com`, `youtube-nocookie.com` ou `www.youtube.com` no formato `/embed/<11 caracteres>`;
- adiciona `rel="noopener noreferrer"` a links `target="_blank"`;
- permite somente URLs HTTP/HTTPS ou fragmento (`#`) em atributos de URI.

Ela é usada tanto no preview administrativo quanto no `v-html` público. É uma camada defensiva no navegador; não substitui a sanitização já feita no Laravel antes de salvar.

### 7.3 Arquivos e endpoints

| Caso | Campo enviado | Caminho | Resultado usado |
| --- | --- | --- | --- |
| Thumbnail no formulário de post | `thumbnail` | `POST /api/admin/posts` ou update com override PUT | O arquivo entra no `FormData` do post. |
| Endpoint isolado de thumbnail | `image` | `POST /api/admin/posts/thumbnail` | Método existe no repositório, mas não há chamador atual. |
| Imagem do corpo | `image` | `POST /api/upload/image` | `TiptapToolbar` usa `{ url }` para inserir a imagem. |

`toFormData.ts` omite `null`/`undefined`, serializa booleanos como `"1"`/`"0"` e arrays como várias entradas `tags[]`. É por isso que `slug_manually_edited` é transmitido corretamente como booleano compatível com Laravel.

## 8. Formatos de API efetivamente consumidos

Os exemplos são ilustrativos, porém os métodos, chaves e conversões correspondem ao código atual.

### Listagem pública

```http
GET {VITE_API_URL}/public/posts?page=1&per_page=8
Accept: application/json
X-Requested-With: XMLHttpRequest
```

```json
{
  "data": [{
    "id": "uuid",
    "title": "Um post publicado",
    "slug": "um-post-publicado",
    "excerpt": "Resumo",
    "thumbnail": "https://...",
    "tags": ["arte"],
    "published_at": "2026-07-21T17:31:00.000000Z",
    "lang": "pt",
    "views_count": 12,
    "likes_count": 3
  }],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 8, "total": 1 }
}
```

### Criação administrativa

```http
POST {VITE_API_URL}/admin/posts
Accept: application/json
X-XSRF-TOKEN: <cookie-decoded>
Cookie: <sessão Sanctum>
Content-Type: multipart/form-data

title=Novo post
slug=novo-post
slug_manually_edited=0
excerpt=Resumo
content=<p>Conteúdo</p>
published_at=2026-07-21T17:31:00.000Z
status=published
lang=pt
tags[]=arte
thumbnail=<arquivo>
```

O update usa o mesmo payload, mas envia `POST /admin/posts/{id}` e o cabeçalho `X-HTTP-Method-Override: PUT`.

### Engajamento

```http
POST {VITE_API_URL}/public/posts/um-post-publicado/likes
Content-Type: application/json
X-XSRF-TOKEN: <cookie-decoded>

{ "visitor_id": "80dd9895-6f93-4c4a-ae61-8d2571c46abc" }
```

```json
{ "data": { "likes_count": 4, "liked": true, "changed": true } }
```

## 9. Tratamento de falhas e feedbacks

| Situação | Camada que trata | Resultado na interface |
| --- | --- | --- |
| 401 comum | `useApi` → handler de `main.ts` | Limpa usuário e redireciona para login. |
| 401 de login ou `checkSession` | `useAuth` usa `handleUnauthorized: false` | Não dispara redirecionamento global; retorna mensagem apropriada ou sessão nula. |
| 419 no login ou ação autenticada | `useAuth.errorMessage` | `Sua sessão segura expirou. Tente novamente.`; outras chamadas recebem `ApiError` sem mensagem global dedicada. |
| 422 ao salvar post | `BlogEditView` | Mostra aviso geral e mensagens de slug/data. |
| 429 no login | `useAuth.errorMessage` | Informa excesso de tentativas. |
| Falha da lista pública | `usePublicPosts` → `PostGrid` | Mensagem de erro e contatos de suporte. |
| Falha do detalhe | `PostView` | Mensagem genérica; não separa 404 de erro de rede. |
| Falha de view | `PostView` | Ignorada: leitura permanece disponível. |
| Falha de like | `PostView` | Alerta junto ao botão. |
| Falha de upload no editor | `TiptapToolbar` | `window.alert`. |

## 10. Configuração, build e implantação

### Ambiente

`.env.example` define apenas:

```dotenv
# URL pública da API; já deve conter /api. Não use segredo em VITE_*.
VITE_API_URL=http://localhost:8000/api
```

`VITE_API_URL` é embutida no build. O frontend depende também de configuração coerente do backend para CORS com credenciais, domínio stateful do Sanctum, cookie CSRF e sessão. Essas variáveis do Laravel não estão no projeto Vue e não devem ter valores ou segredos copiados para esta documentação.

### Ferramentas e comandos disponíveis

```powershell
npm run type-check
npm run lint
npm run build
npm run dev
npm run preview
```

`npm run build` executa primeiro `vue-tsc --build` e depois `vite build`. Não há script `test`.

`vite.config.ts` registra Vue, Vue JSX, Vue DevTools e Tailwind, além do alias `@` para `src`. `vercel.json` redireciona todos os caminhos para `/index.html`, permitindo que `/blog`, `/post/:slug` e rotas de admin sejam resolvidas pelo Vue Router após o deploy.

## 11. Decisões arquiteturais confirmadas

1. **Contrato público separado do administrativo:** `PublicPostSummary`/`PublicPost` abastecem a leitura; `Post` inclui o estado editorial para admin.
2. **Paginação no servidor:** Blog público pede 8 posts por página; home pede 4. O cliente não monta o acervo inteiro em memória.
3. **Camada HTTP centralizada:** todos os endpoints de posts passam por `usePostsRepository` e, por consequência, por `useApi`.
4. **Sessão por cookie:** o painel usa CSRF + cookies; não usa Bearer token nem `localStorage` para autenticação.
5. **Segurança em profundidade para HTML:** backend sanitiza ao persistir; DOMPurify e regra de iframe oferecem defesa adicional antes do `v-html`.
6. **Slug previsível:** a UI atualiza automaticamente até edição manual e não altera slug de post existente sem intenção explícita.
7. **Engajamento anônimo limitado pela API:** o navegador mantém UUID de visitante, mas o servidor controla hash, cache, rate limit e atomicidade.

## 12. Limitações, inconsistências e oportunidades

### Implementado, com atenção necessária

- `PostView` não tem estado específico de 404 e não oferece botão de retorno/recarga; todas as falhas viram a mesma mensagem.
- `PostView` declara `fallbackImage`, mas não o utiliza.
- A thumbnail do detalhe público não tem `alt`; em `PostCard` ela é imagem de fundo, sem alternativa textual equivalente. Devem receber tratamento de acessibilidade ao evoluir a UI.
- `PostGrid` trata a paginação pública, mas a lista administrativa ignora `meta`, não possui paginação visual e seus cards de total contam apenas a página atual.
- `usePosts.deletePost` não define `pending`/`error` nem trata a rejeição localmente; uma falha pode subir ao componente como promise rejeitada.
- O método `toggleVisibility` é tecnicamente de arquivamento: só a UI de post publicado o chama e envia `archived`; não existe botão de publicar/desarquivar nessa lista.
- `BlogEditView` captura `fieldErrors` completos, mas só exibe os de `slug` e `published_at` no template. `title`, `excerpt`, `content`, `tags` e `thumbnail` podem falhar sem mensagem ao lado do campo.
- O editor não destrói explicitamente a instância Tiptap no unmount; o ciclo de vida do `useEditor` é delegado à biblioteca.
- `BlogGrid.vue`, `Blog.css`, `components/admin/blog/Blog.vue` e `BlogEdit.vue` são arquivos existentes sem uso encontrado; não devem ser removidos sem uma tarefa de limpeza e validação de histórico.
- O `usePostsRepository.uploadThumbnail()` existe, mas nenhuma tela atual o chama; a thumbnail é enviada junto ao post.
- Dados carregados no composable público não são compartilhados entre home e `/blog`; visitar ambas as rotas produz requisições distintas, por design atual.
- `DefaultLayout` mantém widgets de terceiros e mídia persistentes em páginas do Blog. Isso preserva a identidade do site, mas pode afetar o tempo de abertura de um post.

### Não encontrado

- SSR, prerender, sitemap, metatags por post, canonical, Open Graph dinâmico, JSON-LD ou manipulação de `document.title` por post;
- testes de componentes, composables, rotas, E2E, mocks de API ou medição de cobertura;
- cache HTTP, retry, cancelamento com `AbortController`, skeletons de cards e recuperação dedicada de página de post;
- busca, filtro público por idioma ou ordem na UI; paginação administrativa, restore, force delete, comentários e moderação;
- upload de thumbnail isolado em uso, gerenciador de mídia, drag-and-drop, progresso ou exclusão de arquivos;
- store Pinia específico, interfaces de repositório, service worker ou analytics de frontend.

### Planejado ou recomendado

1. Exibir erros `422` junto a todos os campos e tornar o retorno de API acessível por `aria-describedby`.
2. Adicionar paginação administrativa e usar `meta.total` para os indicadores, sem buscar todos os posts de uma vez.
3. Criar estados distintos de 404, indisponibilidade de rede e recarregamento no detalhe público.
4. Fornecer `alt` de thumbnail no contrato público ou uma alternativa textual apropriada no card/detalhe.
5. Consolidar ou remover arquivos legados somente após confirmar que não são importados por rotas, documentação ou fluxos externos.
6. Adicionar testes para serialização FormData, slug, DOMPurify, `usePublicPosts`, engajamento, guard de admin, paginação e formulário.
7. Avaliar tags/SEO no cliente ou prerender progressivo antes de qualquer reescrita de stack.
8. Investigar carregamento sob interação ou visibilidade dos widgets persistentes de `DefaultLayout` antes de otimizar a leitura de posts.

## 13. Como manter esta documentação atualizada

1. Ao alterar `src/router/index.ts`, atualize a seção 3 e o Mermaid no mesmo pull request.
2. Ao adicionar endpoint ou campo, atualize `types.ts`, `usePostsRepository.ts`, a seção 4 e os exemplos da seção 8 juntos.
3. Ao alterar Tiptap, DOMPurify ou upload, revise a seção 7 e valide criação, edição, preview e leitura pública.
4. Ao introduzir cache, SSR, testes, store, filtros ou SEO, mova o item correspondente de “Não encontrado” para “Implementado”, incluindo caminho e comportamento.
5. Edite primeiro `blog-overview.mmd` e gere novamente o PNG; não altere somente a imagem.

   ```powershell
   npx --yes @mermaid-js/mermaid-cli -i docs/architecture/blog/blog-overview.mmd -o docs/architecture/blog/blog-overview.png -w 4200 -b white
   ```

6. Execute `npm run type-check`, `npm run lint` e `npm run build` quando disponíveis. Registre uma limitação se qualquer comando falhar por problema anterior à documentação.
7. Atualize a data inicial e nunca copie segredos, cookies ou valores privados para este arquivo.
