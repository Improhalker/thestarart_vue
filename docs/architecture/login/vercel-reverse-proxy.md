# Autenticação Sanctum pelo proxy da Vercel

## Objetivo

Permitir que a SPA hospedada na Vercel use a sessão Laravel Sanctum sem depender
de cookies de terceiros e sem expor token Bearer no navegador.

## Topologia implementada

```text
Navegador
  -> https://<frontend-vercel>/sanctum/csrf-cookie
  -> https://<frontend-vercel>/api/login
  -> https://<frontend-vercel>/api/me
       |
       | rewrite interno da Vercel
       v
  -> https://<laravel-origin>/sanctum/csrf-cookie
  -> https://<laravel-origin>/api/*
```

O navegador só enxerga o domínio da Vercel. Portanto, os cookies de sessão e
`XSRF-TOKEN` são de primeira parte para a SPA. A URL do Laravel permanece em
uma variável de ambiente da Vercel e não é uma variável `VITE_*`.

## Arquivos

- `vercel.ts`: proxy reverso para `/api/*` e `/sanctum/*`; impede cache dessas
  respostas.
- `src/composables/api/useApi.ts`: em produção usa `/api`; em desenvolvimento
  usa `VITE_API_URL` ou `http://localhost:8000/api`.

## Configuração obrigatória

### Vercel

Definir somente no ambiente de deploy:

```dotenv
LARAVEL_API_ORIGIN=https://<host-publico-do-laravel>
```

O valor deve ser uma origem HTTPS, sem `/api` no final. Não criar
`VITE_API_URL` de produção apontando diretamente ao Laravel.

### Laravel em produção

Configurar no servidor, sem registrar valores reais em repositório:

```dotenv
SANCTUM_STATEFUL_DOMAINS=<host-exato-da-producao-vercel>
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

`SESSION_DOMAIN=null` é intencional: a resposta do proxy gera cookies host-only
para o domínio da Vercel. Não usar um domínio do Laravel nessa variável.

`CORS_ALLOWED_ORIGINS` continua necessário somente para desenvolvimento local
ou consumidores que chamam o Laravel diretamente. O navegador não faz CORS no
fluxo de produção via proxy.

## Validação pós-deploy

1. Abrir a URL de produção da Vercel em janela anônima.
2. Fazer login e confirmar no DevTools que `XSRF-TOKEN` e a sessão pertencem ao
   host da Vercel, com sessão marcada como `HttpOnly` e `Secure`.
3. Confirmar que `GET /api/me` retorna `200` após login e `401` antes dele.
4. Confirmar que uma rota administrativa retorna `401` sem sessão e funciona
   após login.
5. Fazer logout e confirmar que `GET /api/me` volta a retornar `401`.

## Limitações intencionais

- Pré-visualizações temporárias da Vercel não entram automaticamente em
  `SANCTUM_STATEFUL_DOMAINS`; login deve ser validado na URL de produção ou o
  host de preview deve ser liberado explicitamente e de forma temporária.
- Quando houver domínio próprio, basta trocar o host stateful da produção. O
  proxy e a estratégia de cookies permanecem os mesmos.
- A origem Laravel precisa continuar HTTPS e acessível pela Vercel.
