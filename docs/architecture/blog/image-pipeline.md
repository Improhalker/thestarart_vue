# Blog Vue — uploads e renderização

Atualizado em 22/10/2026 pela equipe de desenvolvimento.

## Implementado sem redesenho

- `src/views/admin/blog/BlogEditView.vue`: aplica resposta canônica (slug/HTML/thumbnail), limpa arquivo e Object URL após atualizar, evitando reenvio. Erro de carga não revela formulário vazio editável. Bloqueia save duplicado/durante upload. Confirma saída com alterações, inclusive entre IDs da mesma rota. Thumbnail por botão acessível, cancelamento de seleção local e erros por campo; cancelar não apaga nada no servidor.
- `src/components/admin/blog/editor/TiptapToolbar.vue`: um upload por vez, feedback inline, 422, AbortController, timeout de 60s e cleanup. Não insere em editor desmontado. Abort não garante cancelamento no servidor: um upload pode concluir e ficar sem vínculo; não se exclui automaticamente.
- `src/components/admin/blog/editor/TiptapEditor.vue`: HTML canônico sincronizado sem recursão, bloqueio de edição no save, eventos de upload. Link/Underline configurados apenas uma vez, sem duplicação no StarterKit.
- `src/utils/toFormData.ts`: booleanos `1/0`, arquivos e `tags[]` preservados. Array vazio envia `tags=""`, normalizado para `[]` no PostRequest; omitido continua distinto de vazio.
- `src/utils/postImage.ts`: validação inicial para UX e fallback delegado no `v-html`; segurança continua no Laravel.
- `src/components/global/blog/PostImage.vue`: URLs atuais, fallback limitado, decoding async, lazy por padrão/prioridade quando solicitado. Reutilizado em cards, sidebar, thumbnail do post e admin. Não inventa `srcset`/variantes.
- `src/utils/sanitizePostHtml.ts`: dimensões numéricas seguras preservadas, atributos perigosos removidos e iframes YouTube restritos. Lazy loading é aplicado somente à cópia de renderização, sem reescrever HTML salvo.
- `src/views/blog/PostView.vue`: sanitização computada, thumbnail prioritária, fallback interno, mensagem específica de 404 e retry transitório. Mesma rota `/post/:slug`.
- `src/composables/posts/{usePublicPosts,usePosts}.ts`: respostas antigas não substituem filtros mais recentes. O scope público descarta conclusões após unmount.
- `src/composables/posts/usePostRepository.ts`: uploads tipados e sinal opcional; mesmos endpoints e envelopes. Cache público de cinco minutos/deduplicação/invalidação mantidos.
- `src/composables/api/useApi.ts`: genérico padrão unknown; entende `{error}` existente além de `{message}`. Cookies/CSRF/autorização inalterados.
- `src/i18n/locales/{pt-BR,en,es}.ts`: novos feedbacks traduzidos, sem traduzir conteúdo editorial.

## Compatibilidade e validação

Sem dependências, rotas, layout administrativo, buckets, variáveis ou credenciais novas. Limites em bytes mantidos: thumbnail até 1 MiB; conteúdo até 2 MiB. Laravel acrescenta inspeção de cabeçalho, extensão/MIME coerentes e limite de 12.000px por lado/24MP para novos arquivos. Nenhum post antigo foi reescrito. Cards mantêm overlay e dimensões, trocando background CSS pela mesma imagem com object-cover.

Backend: `../../../../thestarartLaravelBack/docs/architecture/blog/image-pipeline.md`.

Testes de formulário cobrem thumbnail enviada uma vez, campos canônicos, bloqueios, erros e falha de carga. Tiptap real testado na sincronização e contenteditable; serviço de upload simulado nos testes de concorrência/unmount. Há testes de serialização, fallback/sanitização e consultas fora de ordem.

Build/TypeScript e ESLint/Oxlint no escopo alterado aprovados. Os 30 testes focados passaram; suíte geral com 64 aprovados e duas falhas preexistentes descritas abaixo. Navegador com listagem real em 1440×1000 e 390×844, sem overflow horizontal. Detalhe real por GET sem registrar visualização. Página inexistente mostrou o 404 específico. Capturas: `validation-desktop.png` e `validation-mobile.png`.

A suíte geral mantém duas falhas antigas em `src/features/star-station/utils/__tests__/artworks.spec.ts` (asset e alt esperados desatualizados), fora deste módulo. Console do shell legado também mostrou avisos antigos de CardWindowHeader não importado em VisualSuffer/UnderConstruction; esses componentes não foram refatorados.

Não foram feitos login/salvamentos/uploads com credenciais ou dados oficiais para validação. Mutações/autorização foram testadas em SQLite em memória e Storage simulado. Conversão, variantes, EXIF, inventário e exclusão permanente continuam opcionais e dependem da etapa aprovada de infraestrutura/dados.
