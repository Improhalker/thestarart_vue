# Login e sessão no Vue — arquitetura técnica

| Item | Valor |
| --- | --- |
| Última atualização | 2026-07-22 |
| Versão identificada | `vue-project` `0.0.0`; Vue `^3.5.22`; Vue Router `^4.6.3`; Vite `^7.1.11` |
| Escopo analisado | Frontend em `thestarart_vue/`: tela de login, logout, `useAuth`, `useApi`, guard de rota, cookies CSRF/Sanctum e integração com a API Laravel |
| Responsável pela atualização | equipe de desenvolvimento |

> **Legenda de evidência:** **Implementado** significa código existente e inspecionado. **Não encontrado** significa que não há recurso correspondente no projeto. **Planejado ou recomendado** é melhoria proposta, não comportamento atual.

O diagrama editável está em [login-overview.mmd](login-overview.mmd); a exportação PNG está em [login-overview.png](login-overview.png).

## 1. Objetivo e responsabilidades

**Implementado.** O frontend Vue oferece a experiência de acesso administrativo, mas não toma decisões de segurança. Ele:

- exibe `/login` com e-mail, senha, estados de carregamento, erros acessíveis e wallpaper decorativo aleatório;
- solicita o cookie CSRF ao Laravel antes de autenticar ou executar mutações sensíveis;
- envia login por JSON com cookies incluídos e mantém a identidade autenticada apenas em memória;
- consulta `/api/me` ao iniciar, antes de entrar no admin e ao abrir a rota de login;
- bloqueia a navegação visual para `/admin/*` quando não há sessão conhecida;
- redireciona respostas `401` não tratadas para `/login`, preservando o destino na query `redirect`;
- encerra a sessão pelo endpoint de logout e remove o usuário da memória;
- mostra mensagens específicas para erros conhecidos de login.

O Vue não armazena Bearer token, senha, cookie de sessão ou flag de autorização em `localStorage`. O navegador recebe e envia cookies; Laravel/Sanctum continuam sendo a única barreira de autenticação e autorização real.

## 2. Estrutura e arquivos reais

```text
src/
├── main.ts
├── router/index.ts
├── views/auth/LoginView.vue
├── composables/
│   ├── api/useApi.ts
│   └── useAuth.ts
├── components/
│   ├── login/
│   │   ├── Login.vue
│   │   ├── Logout.vue
│   │   └── loginWallpapers.ts
│   ├── global/CardWindowHeader.vue
│   └── ui/button/Button.vue
└── layouts/AdminLayout.vue

.env.example
package.json
vite.config.ts
vercel.json
```

| Categoria | Arquivos encontrados | Responsabilidade real |
| --- | --- | --- |
| Página | `views/auth/LoginView.vue` | Wrapper que monta `Login.vue`. |
| Formulário | `components/login/Login.vue` | E-mail/senha, submissão, feedback, redirecionamento seguro e apresentação visual. |
| Logout | `components/login/Logout.vue` | Ação de saída usada pelo `AdminLayout`. |
| Wallpapers | `components/login/loginWallpapers.ts` | Escolhe uma imagem local aleatória e um fallback. |
| Estado de autenticação | `composables/useAuth.ts` | Sessão em memória, login, consulta de sessão, logout, mapeamento de erros. |
| Cliente HTTP | `composables/api/useApi.ts` | Base URL, CSRF, cookies, JSON e `ApiError`. |
| Rotas | `router/index.ts` | Define `/login`, `/admin/*` e o guard global. |
| Inicialização | `main.ts` | Registra handler de 401 e inicia `checkSession()`. |
| Shell administrativo | `layouts/AdminLayout.vue` | Renderiza o componente `Logout.vue`. |
| Store Pinia de auth | **Não encontrado** | O módulo usa `ref` no escopo do composable, não Pinia. |
| Testes de login no Vue | **Não encontrado** | Não há Vitest, Cypress, Playwright ou arquivos de teste encontrados. |
| Reset de senha, registro, MFA, OAuth ou confirmação de e-mail | **Não encontrado** | Não há rota, tela ou chamada HTTP correspondente no Vue. |

## 3. Rotas e navegação

`src/router/index.ts` usa `createWebHistory`. A autenticação participa destas rotas:

| Caminho | Nome | Componente/layout | Comportamento atual |
| --- | --- | --- | --- |
| `/login` | `login` | `LoginView.vue` → `Login.vue` | Exibe login; se já houver sessão, redireciona para `redirect` seguro ou `/admin`. |
| `/admin` | `admin.dashboard` | `AdminLayout.vue` | Requer sessão conhecida pelo guard antes de navegar. |
| `/admin/musics` | `admin.musics` | `AdminLayout.vue` | Mesmo guard. |
| `/admin/changelog` | `admin.changelog` | `AdminLayout.vue` | Mesmo guard. |
| `/admin/blog` | `admin.blog.list` | `AdminLayout.vue` | Mesmo guard. |
| `/admin/blog/editor/:id?` | `admin.blog.editor` | `AdminLayout.vue` | Mesmo guard. |

### Guard global

O `beforeEach` segue esta lógica:

1. Para qualquer caminho iniciado por `/admin`, usa `auth.user` se já estiver em memória.
2. Ao vir de fora do admin, chama `checkSession()` e consulta `GET /api/me`.
3. Sem usuário, redireciona para `login` com `query.redirect = to.fullPath`.
4. Ao visitar `/login`, também chama `checkSession()`. Se existir usuário e `redirect` começar com uma única `/`, navega para ele; caso contrário vai para `/admin`.
5. Depois, o guard verifica `localStorage.lang` para a seleção de idioma da interface. Essa chave não autentica ninguém nem altera a sessão Laravel.

Em uma navegação interna do admin quando `auth.user` está vazio, o guard não refaz `checkSession()` e redireciona ao login. Isso reduz chamadas repetidas, mas torna o comportamento dependente do estado em memória até a próxima entrada no admin ou recarga.

## 4. Fluxo de login, sessão e logout

### 4.1 Login

```text
Login.vue
→ useAuth.login({ email, password })
→ useApi.requestCsrfCookie()
→ GET <origem de VITE_API_URL>/sanctum/csrf-cookie
→ useApi.client('/login', POST JSON, credentials include)
→ POST <VITE_API_URL>/login
→ Laravel autentica, regenera sessão e responde { data: { id, name, email } }
→ useAuth.user em memória
→ router.push(redirect seguro ou /admin)
```

### 4.2 Recuperação de sessão

`main.ts` chama `void auth.checkSession()` antes de `app.mount()`. `Login.vue` também chama a mesma função no `onMounted`. `useAuth` compartilha `pendingSessionCheck`, logo chamadas concorrentes reutilizam a mesma Promise em vez de duplicar `GET /api/me`.

Se `/api/me` retorna `401`, o composable limpa o usuário e considera a sessão ausente sem mostrar erro. Qualquer outro erro torna `error` igual a `Não foi possível verificar sua sessão.`.

### 4.3 Expiração e logout

- `useApi` chama `unauthorizedHandler` para respostas `401` quando o chamador não usa `handleUnauthorized: false`.
- O handler configurado em `main.ts` chama `auth.handleSessionExpired()`, limpa campos de erro e usa `router.replace()` para `/login?redirect=<rota>&reason=expired`.
- `Logout.vue` chama `useAuth.logout()`, que faz `POST /api/logout`, limpa a memória e navega para a rota `login`.
- Se o logout recebe `401`, o composable também limpa a memória e trata a sessão como já expirada.

O fluxo não usa refresh token nem expõe token de acesso em resposta, storage ou URL.

## 5. `useApi.ts`: transporte, CSRF e erros

`useApi()` devolve `client<T>()` e `requestCsrfCookie()`.

| Comportamento | Implementação |
| --- | --- |
| URL base | `VITE_API_URL`, sem barra final; fallback `http://thestarartlaravelback.test/api`. |
| URL de CSRF | Cria uma `URL` a partir da base e usa apenas sua origem + `/sanctum/csrf-cookie`. |
| Cookies | Toda chamada usa `credentials: "include"`. |
| Headers fixos | `Accept: application/json` e `X-Requested-With: XMLHttpRequest`. |
| Header CSRF | Para métodos diferentes de GET/HEAD/OPTIONS, lê `document.cookie` e transmite `X-XSRF-TOKEN` se o cookie estiver disponível. |
| Resposta | Lê JSON quando o `content-type` indica JSON; caso contrário lê texto. |
| Falha HTTP | Lança `ApiError(message, status, payload)`. |
| Falha 401 | Chama o handler global, salvo opt-out explícito. |

O cookie `XSRF-TOKEN` é deliberadamente legível pelo JavaScript para formar o header; isto não torna o cookie de sessão legível. A sessão deve permanecer `HttpOnly` no Laravel.

## 6. `useAuth.ts`: estado e métodos

O `user`, flags e erros são `ref`s declarados no escopo do módulo. Assim, todos os consumidores de `useAuth()` veem o mesmo estado durante a execução atual da SPA; ao recarregar, o estado é reconstruído por `/api/me`.

| Método/estado | Responsabilidade |
| --- | --- |
| `user` / `isAuthenticated` | Usuário em memória e computed que informa se não é nulo. |
| `checkSession()` | Deduplica a consulta pendente, chama `GET /me` com opt-out de handler e atualiza `user`. |
| `login(credentials)` | Limpa erros, solicita CSRF, chama `POST /login`, armazena `data` e mantém flags de carregamento. |
| `logout()` | Chama `POST /logout`, limpa usuário e trata `401` como sessão já encerrada. |
| `fieldErrors` | Lê `payload.errors` somente para `422`. |
| `errorMessage()` interno | Traduz `401`, `419`, `429` e `5xx` para mensagens da interface. |
| `handleSessionExpired()` | Limpa estado e prepara a mensagem `Sua sessão expirou. Entre novamente.`. |

`AuthUser` contém somente `id`, `name` e `email`. Não há papel, permissões, token ou senha no tipo.

## 7. Formulário e experiência de login

`Login.vue` usa `LoginView.vue` como wrapper e contém:

- campos de e-mail (`type=email`, `autocomplete=email`, `v-model.trim`) e senha (`autocomplete=current-password`);
- controle para mostrar/ocultar senha, com label acessível;
- labels explícitos, `aria-invalid`, `aria-describedby`, `role=alert` e `aria-busy`;
- tela de verificação inicial com skeleton e texto vivo enquanto `checkSession()` está pendente;
- botão bloqueado durante a submissão;
- erros de campo do backend para e-mail/senha e mensagem geral para outras falhas;
- card visual `Admin_Access.exe`, com `CardWindowHeader` e imagens decorativas sem significado semântico;
- wallpaper aleatório entre cinco arquivos de `/public/images/wallpaper/`, com fallback para `1.jpg` caso a imagem escolhida falhe;
- link de volta à rota `/`.

O form usa `novalidate`: o atributo `required` continua no HTML, mas o navegador não interrompe a submissão com seus próprios balões. A validação efetiva é retornada pela API; a UI não implementa validação local de formato, tamanho ou senha além dos tipos/atributos dos inputs.

Não há checkbox/controle de “lembrar-me”. O backend aceita `remember_token`, mas o Vue atual não a envia; o `LoginRequest` aplica `false` como padrão.

## 8. Contratos HTTP realmente consumidos

`VITE_API_URL` já precisa incluir o sufixo `/api`. Os exemplos abaixo usam campos e caminhos chamados pelo cliente; não incluem valores reais de cookies.

### Preparação CSRF

```http
GET <origem-da-api>/sanctum/csrf-cookie
Accept: application/json
X-Requested-With: XMLHttpRequest
```

O frontend espera resposta bem-sucedida sem corpo relevante e cookies `XSRF-TOKEN` e de sessão emitidos pelo servidor. `requestCsrfCookie()` lança `ApiError` se o status não for 2xx.

### Login

```http
POST <VITE_API_URL>/login
Accept: application/json
Content-Type: application/json
X-Requested-With: XMLHttpRequest
X-XSRF-TOKEN: <valor-decoded-do-cookie>
Cookie: <cookies da origem Laravel>

{
  "email": "admin@example.test",
  "password": "senha-do-usuario"
}
```

```json
{
  "data": {
    "id": 1,
    "name": "Nome do usuário",
    "email": "admin@example.test"
  }
}
```

### Sessão atual e logout

```http
GET <VITE_API_URL>/me
Accept: application/json
Cookie: <sessão Laravel>
```

```http
POST <VITE_API_URL>/logout
Accept: application/json
X-XSRF-TOKEN: <valor-decoded-do-cookie>
Cookie: <sessão Laravel>
```

O logout não é tipado com resposta específica no Vue; após sucesso, apenas limpa o estado local e navega para login.

## 9. Falhas e códigos tratados

| Código/situação | Tratamento atual no Vue |
| --- | --- |
| 200 em login/me/logout | Atualiza ou limpa estado conforme o método. |
| 401 no login | `E-mail ou senha inválidos.`; não dispara redirecionamento global. |
| 401 em `checkSession` | Sessão nula, sem alerta de erro. |
| 401 em chamadas comuns | Handler global limpa estado e substitui a rota por login. |
| 419 no login | `Sua sessão segura expirou. Tente novamente.`. Para outras chamadas, permanece como `ApiError` sem tratamento global específico. |
| 422 no login | `fieldErrors` recebe `errors.email` e/ou `errors.password`, exibidos no formulário. |
| 429 no login | `Muitas tentativas. Aguarde alguns minutos.`. |
| 5xx ou erro de rede no login | Mensagem de indisponibilidade/conexão. |
| Falha ao obter CSRF | `Não foi possível preparar a sessão segura.`. |

## 10. Configuração necessária

`.env.example` possui somente a variável pública abaixo:

```dotenv
VITE_API_URL=http://localhost:8000/api
```

`VITE_*` é incorporada no bundle e nunca pode conter segredo. Para o fluxo funcionar, o ambiente Laravel precisa estar coerente com essa origem: CORS deve permitir a origem explícita do Vue com credenciais, Sanctum deve reconhecer o host stateful e os atributos do cookie de sessão devem ser compatíveis com HTTPS/domínios reais.

`vercel.json` faz fallback de todas as URLs para `index.html`, permitindo que `/login` e as rotas administrativas sejam atendidas pelo Vue Router após o deploy. Isso não configura CORS, cookies ou autenticação da API.

## 11. Limitações, inconsistências e oportunidades

### Implementado, com atenção necessária

- O login chama `checkSession()` tanto em `main.ts` quanto no mount do formulário. O composable deduplica chamadas simultâneas, mas pode ocorrer uma nova consulta após a primeira concluir.
- O guard administra a navegação, não autoriza endpoints. Qualquer proteção precisa continuar em `auth:sanctum` no Laravel.
- A mensagem de erro de `419` é especializada apenas no fluxo de `useAuth`; outras mutações que dependem de CSRF recebem `ApiError` genérico.
- O frontend não envia `remember_token`; o parâmetro está disponível somente no backend.
- Não há interceptor para `403`: a chamada rejeita com `ApiError` e cada tela precisa decidir a experiência adequada.
- O guard depende de `localStorage.lang` para redirecionar a seleção de idioma; essa chave não é protegida nem deve ser interpretada como estado de login.
- O wallpaper de login usa imagens decorativas locais com `fetchpriority="high"`; é uma escolha visual, mas impacta a transferência inicial da página.

### Não encontrado

- registro de usuário, recuperação/alteração de senha, confirmação de e-mail, MFA, OAuth, CAPTCHA, “lembrar-me” visual, gestão de sessões, revogação de dispositivos, analytics de login, telemetria de falhas ou testes automatizados;
- refresh token, token Bearer, armazenamento persistente de identidade ou retry automático seguro após `419`;
- página específica para `403`, retorno visual após expiração além do redirect ao login, ou tratamento central de falhas de CORS/cookies bloqueados.

### Planejado ou recomendado

1. Adicionar testes de composable/roteador para login, 401, 419, 422, logout e preservação segura de `redirect`.
2. Exibir orientação de configuração quando o navegador bloquear cookies/CORS, sem revelar detalhes internos da API.
3. Definir se “lembrar-me” é um requisito. Se for, adicionar contrato, UI, testes e política de duração de sessão de forma coordenada com Laravel.
4. Tratar `403` em telas administrativas com uma mensagem de acesso negado, sem confundi-lo com sessão expirada.
5. Avaliar uma chamada de sessão única na inicialização/roteador para diminuir verificações redundantes, preservando a correção do guard.
6. Somente adicionar reset de senha, MFA ou OAuth junto com endpoints backend, rate limit, auditoria e requisitos de segurança definidos.

## 12. Comandos e manutenção

```powershell
npm run type-check
npm run build
npm run dev
```

Não há script `test` no `package.json`. Evite `npm run lint` em uma tarefa de documentação: os scripts atuais usam `--fix` e podem alterar arquivos fora do escopo.

Para manter este documento atualizado:

1. Atualize as rotas e o guard quando `router/index.ts` mudar.
2. Atualize métodos, códigos e exemplos quando `useAuth.ts` ou `useApi.ts` mudar.
3. Coordene alterações de cookie/CSRF/CORS com a documentação Laravel correspondente no mesmo pull request.
4. Edite primeiro `login-overview.mmd` e gere novamente o PNG:

   ```powershell
   npx --yes @mermaid-js/mermaid-cli -i docs/architecture/login/login-overview.mmd -o docs/architecture/login/login-overview.png -w 4200 -b white
   ```

5. Nunca registrar senhas, cookies, tokens, valores reais de ambiente ou domínios privados nesta documentação.
