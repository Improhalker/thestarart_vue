# AGENTS.md — TheStarArt

## 1. Propósito

Este documento orienta agentes que analisam, alteram, organizam ou expandem o TheStarArt. Ele descreve principalmente o frontend existente em `thestarart_vue/`, publicado em <https://thestarart-vue.vercel.app/>.

O TheStarArt é um universo digital pessoal em evolução. Não o trate como um projeto novo, um portfólio corporativo, um dashboard SaaS, um template genérico ou uma landing page convencional.

O objetivo é fazer o projeto crescer sem apagar sua história, personalidade ou identidade visual.

## 2. Visão e identidade não negociável

O site reúne arte, pensamentos, experiências, jogos, tecnologia, programação, música, cultura da internet e conteúdo autoral. A experiência deve lembrar sistemas operacionais e softwares do início dos anos 2000, páginas pessoais, janelas de desktop, exploradores de arquivos, players e terminais.

Preservar:

- atmosfera de antiga internet, pixel art e elementos lúdicos;
- paleta escura com roxo, rosa, azul profundo e contrastes vibrantes;
- títulos e elementos com aparência de software, como `Blog.exe`, `Thought_Terminal.exe`, `CurrentlyDrawing.exe` e `System_Logs.txt`;
- sensação de descoberta e de universo pessoal;
- conteúdo autoral acima da decoração.

Não transformar a interface em portfólio minimalista branco, landing page de startup, dashboard corporativo, tema padrão de shadcn ou blog editorial genérico. Nostalgia visual não justifica navegação confusa, baixa legibilidade, experiência quebrada ou inacessível.

As referências externas indicadas pelo autor, como `adilene.net` e `lilithdev.neocities.org`, servem apenas para estudar princípios de composição, autoria e exploração. Não copiar código, imagens, textos, personagens, paletas completas ou estrutura.

## 3. Stack e limites atuais

### Frontend existente: `thestarart_vue/`

- Vue 3, Vite 7 e TypeScript;
- Tailwind CSS 4 e `tw-animate-css`;
- Vue Router e Pinia;
- componentes UI baseados em Reka/shadcn-vue em `src/components/ui/`;
- Tiptap para o editor de posts;
- `fetch` no cliente principal e Axios somente no serviço de músicas;
- Vercel com fallback SPA em `vercel.json`.

### Integrações conhecidas

- API REST Laravel via `VITE_API_URL` e `useApi`;
- autenticação administrativa por sessão Laravel Sanctum e cookies HttpOnly;
- upload de thumbnail e imagem pelo repositório de posts;
- Google Translate, YouTube IFrame API e Chatango como integrações de terceiros;
- backend Laravel e Supabase pertencem à arquitetura do produto, mas não devem ser alterados em uma tarefa exclusivamente de frontend sem solicitação explícita.

Não substituir tecnologias existentes, instalar bibliotecas ou reescrever a aplicação por preferência. Justificar tecnicamente qualquer nova dependência e informar sua adição ao final da tarefa.

## 4. Estrutura atual confirmada

```text
thestarart_vue/
├── public/
│   ├── images/                 # arte, UI, social, admin e backgrounds
│   ├── smallgifs/
│   └── sounds/
├── src/
│   ├── assets/
│   │   ├── components/button.css
│   │   ├── font.css
│   │   ├── main.css
│   │   └── utilities.css
│   ├── components/
│   │   ├── admin/blog/, admin/madoka/, admin/musics/
│   │   ├── drawing/
│   │   ├── global/, globalchat/, home/, login/, themes/
│   │   └── ui/                 # button, carousel, dialog, drawer, hover-card, sheet, slider
│   ├── composables/
│   │   ├── api/useApi.ts
│   │   ├── posts/types.ts
│   │   ├── posts/usePostRepository.ts
│   │   ├── posts/usePosts.ts
│   │   ├── useAchievements.ts
│   │   ├── useAuth.ts
│   │   ├── usePlayer.ts
│   │   └── useTranslate.ts
│   ├── data/changelog.json
│   ├── layouts/AdminLayout.vue
│   ├── layouts/DefaultLayout.vue
│   ├── lib/utils.ts
│   ├── router/index.ts
│   ├── services/MusicService.ts
│   ├── stores/counter.ts
│   ├── utils/toFormData.ts
│   ├── views/
│   │   ├── admin/blog/
│   │   ├── auth/
│   │   ├── blog/
│   │   ├── themes/MiraiNikki/
│   │   └── HomeView.vue, AboutView.vue, ChangelogView.vue, ErrorView.vue, FourthView.vue
│   ├── App.vue
│   └── main.ts
├── package.json
├── vite.config.ts
└── vercel.json
```

Não inventar pastas, componentes ou camadas como se já existissem. Em especial, não existem hoje `src/features/`, `src/repositories/`, `src/types/` globais, `src/constants/` ou a pasta `docs/` proposta neste documento.

## 5. Aplicação, layouts, páginas e rotas atuais

`src/main.ts` cria a aplicação, registra Pinia e Vue Router. `src/App.vue` monta a `RouterView`, inicia Google Translate e mantém `AchievementBadge` globalmente.

### Layouts

- `DefaultLayout.vue`: shell da área pública. Contém `NewNavbar/Navbar.vue`, links sociais, `LeftSide.vue`, `YoutubeMusic.vue`, `Chat.vue`, changelog, `AdminPet.vue`, footer e `StartupPopup.vue`.
- `AdminLayout.vue`: shell do painel. Contém sidebar administrativa, `Logout.vue`, `RightSidebar.vue`, `AdminPet.vue` e a `RouterView` administrativa.

### Rotas registradas em `src/router/index.ts`

| Área | Rota | Componente atual |
|---|---|---|
| Pública | `/` | `DefaultLayout` → `HomeView` → `components/home/Main.vue` |
| Pública | `/about` | `AboutView.vue` |
| Pública | `/changelog` | `ChangelogView.vue` |
| Pública | `/diary` | `views/themes/MiraiNikki/Diary.vue` |
| Pública | `/blog` | `views/blog/BlogView.vue` |
| Pública | `/post/:slug` | `views/blog/PostView.vue` |
| Utilitária | `/choose-your-lang` | `global/translate/LanguageSelector.vue` |
| Utilitária | `/justcryatthispoint` | `FourthView.vue` |
| Utilitária | `/noaccess` e `/AllTheThingsSheSaid` | componentes em `components/global/access/` |
| Autenticação | `/login` | `views/auth/LoginView.vue` |
| Admin | `/admin` | `AdminLayout` → `DashboardView.vue` |
| Admin | `/admin/musics` | `MusicListView.vue` |
| Admin | `/admin/blog` | `BlogListView.vue` |
| Admin | `/admin/blog/editor/:id?` | `BlogEditView.vue` |
| Erro | `/error/:code` e curinga | `ErrorView.vue` |

Há links existentes para `/recruiter` em `components/global/NewNavbar/navigation.ts` e `/admin/changelog` em `AdminLayout.vue`, mas essas rotas não estão registradas. Não ampliar ou esconder esse fato: corrigir ou decidir o destino em tarefa específica.

## 6. Componentes e responsabilidades atuais

### Identidade e estrutura pública

- `components/global/CardWindowHeader.vue` é o cabeçalho de janela reutilizado por blog, changelog, galeria, pensamentos e outras caixas.
- `components/global/NewNavbar/` é a navegação pública em uso, com `Navbar.vue`, `NavbarMobile.vue` e `navigation.ts`.
- `components/home/LeftSide.vue` compõe widgets laterais: `Slider.vue`, `Coupon.vue`, `VisualSuffer.vue`, `SystemResource.vue` e `Calendar.vue`.
- `components/global/YoutubeMusic.vue`, `globalchat/Chat.vue`, `global/StartupPopup.vue` e `admin/madoka/AdminPet.vue` são experiências persistentes do shell público.
- `components/drawing/Slider.vue` e `DrawingProcess.vue` são a galeria atual de desenhos/processos, com visualização ampliada.
- `components/home/Thought.vue`, `About.vue`, `CsGallery.vue` e `Main.vue` compõem o conteúdo da home.

### Blog público

- `components/global/blog/PostCard.vue`: card reutilizável de post.
- `components/global/blog/PostGrid.vue`: loading, erro, vazio, limite e grade de `PostCard`.
- `views/blog/BlogView.vue`: listagem pública.
- `views/blog/PostView.vue`: consulta e renderização do post individual.

`components/global/blog/BlogGrid.vue` também existe, mas duplica parte importante de `PostGrid` e `PostCard`; avaliar usos antes de removê-lo ou migrá-lo.

### Administração

- `views/admin/blog/BlogListView.vue` e `components/admin/blog/BlogPostList.vue`: lista e ações de posts.
- `views/admin/blog/BlogEditView.vue`: criação e edição de post.
- `components/admin/blog/editor/TiptapEditor.vue` e `TiptapToolbar.vue`: edição rica, links, imagens e YouTube.
- `views/admin/MusicListView.vue`, `components/admin/musics/MusicForm.vue` e `MusicCard.vue`: gestão de músicas.
- `views/admin/ChangelogView.vue` é também reutilizada pelo changelog público e pela sidebar administrativa.

### UI de baixo nível

`components/ui/` contém implementações locais de `Button`, `Dialog`, `Drawer`, `Sheet`, `HoverCard`, `Carousel` e `Slider`. Esses componentes devem permanecer genéricos: não devem conhecer posts, músicas, usuário ou regras de negócio.

Há componentes e gerações anteriores que requerem auditoria antes de qualquer remoção: `components/global/OldNavbar/`, `components/global/OldNavBar.vue`, `HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `TsButton.vue`, `TsCard.vue`, `home/GallerySection.vue` e `home/CsSection.vue`.

## 7. Dados, composables, repositórios e serviços atuais

### Fluxo preferencial já usado pelo blog

```text
View ou componente coordenador
→ usePosts()
→ usePostsRepository()
→ useApi().client()
→ API Laravel
```

- `useApi.ts`: usa `VITE_API_URL`, `credentials: "include"` e o cookie CSRF do Sanctum; não envia Bearer token.
- `composables/posts/usePostRepository.ts`: acesso a `/posts`, post por ID/slug e uploads em `/upload/thumbnail` e `/upload/image`.
- `composables/posts/usePosts.ts`: estado compartilhado de posts, pendência, erro, contadores, criação, visibilidade e exclusão.
- `composables/posts/types.ts`: tipos atuais `Post` e `PostCreateDTO`.
- `utils/toFormData.ts`: serializa payloads de posts e arrays para `FormData`.

Exceções atuais que devem ser preservadas ou corrigidas incrementalmente, nunca ignoradas:

- `PostView.vue`, `BlogEditView.vue` e `TiptapToolbar.vue` chamam `usePostsRepository` diretamente; isso é aceitável apenas enquanto a responsabilidade estiver clara, mas não deve proliferar.
- `MusicService.ts` usa o mesmo `useApi` do restante da aplicação para compartilhar cookies, CSRF e tratamento de sessão.
- `useAuth.ts` centraliza usuário em memória, verificação de `/api/me`, login, logout e sessão expirada. O guard consulta a API antes de liberar o admin; Laravel continua sendo a autoridade de autorização.
- `useTranslate.ts` usa Google Translate e cookies `googtrans`; isso não constitui i18n editorial. O campo `Post.lang` existe, mas ainda não há fluxo explícito de conteúdo PT/EN/ES.
- `useAchievements.ts` mantém conquistas em memória e áudio local. `usePlayer.ts` existe como estado compartilhado, mas a implementação atual de `YoutubeMusic.vue` mantém seu próprio player.
- `stores/counter.ts` é o store padrão do Pinia e não deve ser tomado como estado de domínio consolidado.

Não fazer chamadas a API em componentes de apresentação novos. Preferir repositório/service e composable conforme o padrão do blog; tipar respostas e evitar `any`.

## 8. Segurança e conteúdo

- O painel não armazena token nem flag de autenticação em `localStorage`. O estado em memória melhora a interface, mas nunca é autorização real.
- `PostView.vue` renderiza `post.content` com `v-html`. Antes de ampliar editor, embeds ou fontes de conteúdo, verificar sanitização e validação no Laravel.
- Links externos com `target="_blank"` devem usar `rel="noopener noreferrer"` quando forem tocados.
- Uploads devem validar tipo, tamanho e resposta no backend; `accept="image/*"` no frontend não é segurança.
- Não expor valores de `.env`. `VITE_*` é público por definição no build; não colocar segredos nele.

## 9. Estilos e design system atual

O ponto central de estilos é `src/assets/main.css`, que importa `font.css`, Tailwind, `utilities.css` e `components/button.css`.

### Tokens existentes

- Base: `--ts-primary-black`, `--ts-secondary-black`, `--ts-primary-red`, `--ts-primary-pink`, `--ts-light-blue`.
- Retro: `--ts-retro-gray`, `--ts-retro-blue`, `--ts-retro-shadow`.
- UI rosa: `--ui-bg`, `--ui-bg-secondary`, `--ui-bg-tertiary`, `--ui-border`, `--ui-border-dark`, `--ui-text`, `--ui-text-soft`, `--ui-accent`, `--ui-accent-soft`.
- Variações: grupos `--crimson-*`, `--onyx-*` e `--ui-dark-*`.
- Tokens Tailwind derivados: `bg-ts-*`, `text-ts-*` e os equivalentes definidos no bloco `@theme`.

Primitivos e padrões existentes:

- `.container-style-dark`, `.container-style-light` e `.container-blog` em `assets/utilities.css`;
- `.retro-btn` em `assets/components/button.css`;
- `font-pixel` e `ts-font-main` em `assets/font.css`;
- `CardWindowHeader.vue` como padrão visual de barra de janela;
- bordas de 2–4px, sombras rígidas e imagens `pixelated` como linguagem recorrente.

Ao alterar estilos, preferir os tokens existentes e extrair novos tokens somente quando houver padrão real. Não espalhar novas cores hexadecimais sem necessidade. Alguns valores arbitrários e estilos repetidos ainda existem; consolidá-los por área, sem redesenho total.

`TsButton.vue` referencia `--primary-red` e `--primary-pink`, que não pertencem ao conjunto atual de tokens. Não propagar esses nomes; corrigir o componente em tarefa limitada se ele voltar a ser usado.

## 10. Responsividade, acessibilidade e desempenho

### Responsividade

- A área pública usa uma grade de três colunas em desktop e uma coluna em telas menores dentro de `DefaultLayout.vue`.
- `NewNavbar/NavbarMobile.vue` usa `Sheet` no mobile.
- `YoutubeMusic.vue` possui variações desktop e barra fixa móvel.
- A área admin ainda exige revisão móvel: a sidebar não possui um padrão equivalente de drawer.

Em mudanças de layout, preservar a ordem de conteúdo no mobile; sidebars podem ser recolhidas ou simplificadas, mas blog e navegação devem permanecer claros.

### Acessibilidade

Preservar e melhorar foco visível, contraste, labels, textos alternativos, nomes acessíveis para botões de ícone, teclado e feedbacks de erro. Não usar somente cor para estado.

Modais próprios de `Slider.vue` e `DrawingProcess.vue`, imagens decorativas, botões de janela e animações/GIFs merecem auditoria antes de expansão. Respeitar `prefers-reduced-motion` ao criar ou alterar animações.

### Desempenho

`DefaultLayout.vue` mantém widgets pesados em várias páginas públicas, incluindo YouTube, Chatango, Google Translate, GIFs e imagens externas. Adiar ou carregar sob interação/visibilidade deve ser avaliado antes de adicionar novos widgets globais.

Para imagens, definir dimensões quando possível, usar formatos otimizados e `loading="lazy"` para conteúdo fora da dobra. Não concluir melhoria de bundle sem executar build e analisar o resultado. A página pública de posts precisa evoluir para paginação/filtros quando o acervo crescer.

## 11. Estratégia obrigatória de evolução

Não executar grande redesign ou refatoração geral em uma única tarefa. Cada alteração deve ter área delimitada, problema, proposta, riscos, arquivos envolvidos, critério de conclusão e validação.

Fluxo preferencial:

```text
analisar → propor → aprovar quando houver mudança estrutural
→ implementar uma parte pequena → validar → continuar
```

Para reorganização relevante de pastas, rotas, componentes ou camadas, apresentar antes:

1. estado atual e arquivos envolvidos;
2. estado desejado e responsabilidades;
3. plano de migração por etapas;
4. compatibilidade temporária, riscos e validação.

Não remover componentes antigos antes de confirmar usos. Preferir wrappers, aliases e migração progressiva quando necessário.

## 12. Sugestões futuras — não são estrutura atual

Se o crescimento do projeto justificar, a organização pode migrar gradualmente para módulos de domínio, sem uma movimentação em massa:

```text
src/
├── modules/
│   ├── blog/        # futuro: componentes, API, composables e tipos do blog
│   ├── music/       # futuro: gestão e player de músicas
│   └── gallery/     # futuro: arte e visualizadores
└── shared/
    ├── components/  # futuro: primitivas visuais TheStarArt reutilizáveis
    ├── styles/
    └── ui/          # componentes Reka/shadcn existentes ou migrados
```

Primitivas futuras só devem ser criadas após identificar repetição real. Candidatas baseadas em padrões existentes são uma moldura de janela que preserve `CardWindowHeader`, um botão retrô baseado em `.retro-btn`, e estados compartilhados de carregamento, erro e vazio. Não criar componentes universais excessivamente genéricos.

A pasta `docs/` com `architecture.md`, `design-system.md`, `refactor-roadmap.md` e `content-map.md` é uma sugestão futura de documentação. Ela não existe hoje e não deve ser criada automaticamente em tarefas sem esse escopo.

## 13. Sequência futura recomendada

1. Corrigir destinos de navegação e recursos estáticos quebrados.
2. Definir contrato explícito entre posts públicos e administrativos: publicação, idioma, paginação, ordenação e autorização.
3. Revisar autenticação, logout, respostas 401 e sanitização de HTML juntamente com Laravel.
4. Unificar e tipar o acesso HTTP de posts e músicas sem alterar a identidade visual.
5. Melhorar validação, feedback e acessibilidade do editor e formulários administrativos.
6. Medir build, imagens, widgets externos e comportamento mobile antes de otimização ampla.
7. Consolidar padrões visuais e remover legado somente após auditoria de uso.

## 14. Escopo e validação de tarefas

Antes de implementar, informar quando aplicável:

```text
Área analisada:
Problema encontrado:
Solução proposta:
Arquivos que serão alterados:
Arquivos que serão criados:
Comportamento preservado:
Critérios de conclusão:
```

Depois de implementar, executar o que estiver disponível e proporcional ao risco:

- `npm run type-check`;
- `npm run lint`;
- `npm run build`;
- testes existentes, se houver;
- verificação de imports, rotas afetadas, console, desktop e mobile.

Se uma validação não puder ser executada, declarar o motivo. Não afirmar que algo funciona sem validação ou sem explicitar a limitação.

No relatório final, informar arquivos modificados/criados, componentes reutilizados ou substituídos, decisões, comandos executados, resultados, comportamento preservado, pendências e a próxima menor etapa recomendada.

## 15. Restrições finais

Não:

- iniciar reescrita completa;
- apagar identidade visual ou aplicar visual padrão de biblioteca;
- alterar backend em tarefa somente de frontend;
- modificar áreas não relacionadas;
- adicionar dependências sem justificativa;
- apagar componentes sem mapear seus usos;
- fazer grandes movimentações sem aprovação e plano;
- priorizar decoração acima de conteúdo, legibilidade, segurança e navegação;
- esconder problemas encontrados.

O objetivo é tornar o TheStarArt mais consistente, navegável, sustentável, expressivo, acessível e fácil de expandir — sem deixá-lo convencional.
