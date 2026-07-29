# Módulo Music — frontend Vue

| Item | Valor |
| --- | --- |
| Última atualização | 2026-07-22 |
| Escopo | Player público e painel administrativo em `thestarart_vue/` |
| Responsável | equipe de desenvolvimento |

## Objetivo

O Vue apresenta a playlist definida pelo Laravel e oferece o painel para administrá-la. Ele não decide quais faixas são públicas nem autoriza operações administrativas: essas decisões continuam no backend com Sanctum.

## Arquivos implementados

```text
src/
├── services/MusicService.ts                    # contratos tipados e chamadas HTTP
├── composables/useMusicPlaylist.ts             # estado compartilhado e preferências locais
├── components/
│   ├── global/YoutubeMusic.vue                  # visual e IFrame API do YouTube
│   └── admin/musics/
│       ├── MusicForm.vue
│       └── MusicCard.vue                        # item ordenável da lista
├── views/admin/MusicListView.vue                # CRUD e persistência do drag-and-drop
└── layouts/DefaultLayout.vue                    # mantém o player no shell público

src/composables/__tests__/useMusicPlaylist.spec.ts
vitest.config.ts
```

`src/composables/usePlayer.ts` ainda existe no projeto, mas não é usado pelo módulo atual. Recomenda-se removê-lo somente após uma revisão específica de referências externas.

## Consumo da API

`MusicService` centraliza as chamadas via `useApi`, portanto compartilha cookies Sanctum, tratamento de `401` e CSRF. Antes de cada mutação administrativa, solicita o cookie CSRF.

- `getPublicPlaylist()` chama `GET /musics`;
- `getAdminPlaylist()`, `create`, `update`, `reorder` e `delete` usam somente `/admin/musics`.

Os tipos `PublicMusic` e `AdminMusic` refletem os Resources distintos do Laravel. O player nunca recebe URL original, status ou datas administrativas.

## Player público

`YoutubeMusic.vue` é montado por `DefaultLayout`, por isso permanece entre trocas de rota públicas. `useMusicPlaylist` carrega, ordena defensivamente por `position` e restaura somente a última faixa ainda retornada pela API.

Persistência local permitida:

- ID da última faixa ativa;
- volume;
- estado de mudo.

Não há token de autenticação, URL administrativa ou ID de vídeo hardcoded no player. A reprodução depende da interação do visitante; nenhuma faixa inicia automaticamente após recarregar.

O componente usa a YouTube IFrame API para reproduzir vídeos incorporados. Trata fim de faixa, anterior, próxima, retorno ao início, API indisponível, playlist vazia e vídeo bloqueado. Em erro de vídeo, marca a faixa como indisponível apenas na sessão e tenta a próxima; se todas falharem, informa o estado sem travar a interface.

A interface mantém a identidade escura, vermelha e pixel, com um único conjunto de controles, `TRACK 01/NN`, GIF decorativo reduzido, título, artista, thumbnail, `PERSONAL_NOTE.txt` e uma playlist discreta. No mobile, o mesmo componente se torna barra fixa; `DefaultLayout` reserva espaço inferior para não encobrir o conteúdo.

## Painel administrativo

`MusicListView.vue` usa `vue-draggable-plus`, baseado em Sortable, para drag-and-drop em mouse e toque. A lista local só é confirmada depois de `PATCH /api/admin/musics/reorder`; se a chamada falhar, retorna à última ordem confirmada pelo servidor.

O formulário recebe URL do YouTube, título, artista/contexto, nota e status. A thumbnail é uma prévia local; o backend continua validando a URL e gerando a thumbnail oficial. Erros `422` aparecem no campo correspondente. A exclusão exige confirmação dentro do próprio item.

## Testes e manutenção

O projeto agora usa Vitest, Vue Test Utils e JSDOM. O teste do composable cobre carregamento, estado vazio, erro, ordenação, avanço/retorno circular, restauração segura e vídeo indisponível.

```powershell
npm run test
npm run type-check
npm run build
```

Dependência de runtime: `vue-draggable-plus`. Dependências de desenvolvimento: `vitest`, `@vue/test-utils` e `jsdom`.

Ao alterar a API, atualize `MusicService.ts`, os tipos, o composable, os testes e esta documentação no mesmo change set. Não substitua a validação ou a autorização do Laravel por estado local do Vue.
