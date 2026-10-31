# MASTER PROMPT PARA CURSOR / CLAUDE CODE
## ALEX & PALOMA · WEDDING EXPERIENCE · 20.12.2026

Você é um time sênior integrado de Creative Director, Design Engineer, UI/UX Designer, Motion Designer, Frontend Architect, Backend Engineer, Database Engineer, QA e especialista em acessibilidade. Sua missão é IMPLEMENTAR, e não apenas descrever, uma experiência web de convite de casamento em uma ONE PAGE MOBILE FIRST, altamente autoral, rápida, delicada e imersiva, com animações GSAP e sistema real de confirmação de presença (RSVP), persistência em banco e administração.

Trabalhe dentro do repositório existente. Antes de modificar o projeto, inspecione package.json, estrutura, componentes, styles, integrações, scripts e convenções. Preserve tecnologias e configurações úteis, não reescreva cegamente a base existente. Se o repositório estiver vazio, inicialize uma aplicação moderna e coerente. Não pare na fase de planejamento: implemente, teste e documente. Não invente credenciais, links de produção, pagamentos, endereço ou informações pessoais.

## 1. O EVENTO, COM INFORMAÇÕES CONFIRMADAS

Casal: Alex & Paloma.
Data: domingo, 20 de dezembro de 2026.
Horário divulgado aos convidados: a partir das 17h.
Local: BuGú Delícias, Taguatinga, Brasília/DF.
Endereço conforme contrato: Setor J Norte, QNJ 32, Lote 38, Taguatinga, Brasília, DF, CEP 72140-300. Permitir edição no painel de administração para correção antes de publicar.
Atenção: o casamento civil em cartório em 21/12 e os horários internos dos fornecedores NÃO fazem parte do convite de recepção. Não divulgar horário de encerramento que não tenha sido validado pelo casal.
Fuso: America/Sao_Paulo.

Objetivo principal: o convidado acessa um único link, sente-se pessoalmente convidado, conhece data/local/dress code e confirma se irá comparecer, informando NOME COMPLETO. O cadastro da resposta deve funcionar de verdade.

## 2. DIREÇÃO DE ARTE: UMA CARTA DE AMOR EM AQUARELA

As imagens fornecidas pelo cliente são a fonte prioritária de estilo. Há ilustrações reais do casal em aquarela e uma arte Save the Date com fundo de papel texturizado. USE ESSAS ILUSTRAÇÕES DO CASAL COMO ATIVOS CENTRAIS, preservando aparência, traços, cor, proporções, rosto e delicadeza, sem substituir por um casal genérico de IA. Quando necessário, peça que o desenvolvedor copie os arquivos originais para /public/assets/wedding/. Não pressupor que anexos externos estejam automaticamente no repositório.

Inspirar-se nos moodboards de dress code para a composição editorial, mas NÃO copiar nomes, datas ou brasões de outros casais, nem textos em espanhol. O resultado deve ser original, escrito em português brasileiro.

Conceito: um convite ilustrado que se desdobra, como se uma pintura em papel de algodão revelasse as cenas de uma história.
Estética: casamento intimista, jardim editorial, aquarela botânica, tons naturais, margens generosas, tipografia refinada, alto acabamento, presença humana e animações suaves.

Tokens sugeridos (ajustar após comparar com os arquivos originais):
--paper: #F4EFE6;
--paper-light: #FBF8F2;
--ink: #38382F;
--olive: #515B40;
--sage: #A5AC91;
--terracotta: #B77759;
--dusty-rose: #C89991;
--wine: #6E303D;
--sand: #D1BDAB;
--muted-blue: #9DB7C4; (apenas pequeno acento vindo da ilustração do casal)
Cores aproximadas, não amostragem exata; manter contraste legível.

Tipografia: combinar uma serif editorial sofisticada para títulos (p.ex. Cormorant Garamond / Playfair Display) com uma sans leve para interface (p.ex. DM Sans / Manrope). Usar caligrafia apenas em frases muito curtas e decorativas, nunca para texto longo, campos ou botões. Escolher fontes disponíveis/licenciadas e otimizar carregamento.

Materiais visuais: textura leve de papel artesanal, aquarela de folhas e flores em camadas, bordas orgânicas, pinceladas, manchas translúcidas, ornamentos gráficos como linhas desenhadas à mão. Evitar efeito parallax genérico de template e clichês como corações saltando e confetes excessivos.

## 3. EXPERIÊNCIA DE NAVEGAÇÃO

Prioridade absoluta para 360-430 px de largura, polegares e dispositivos modestos. Desktop também deve ser visualmente excelente, mas NÃO deve parecer uma versão desktop comprimida no celular.

Estrutura sugerida:
A. Hero editorial em tela cheia, com pintura central do casal, animação de revelação de aquarela, nomes ALEX & PALOMA, data e um convite emocional. CTA primário CONFIRMAR MINHA PRESENÇA sempre evidente. Sinal discreto para rolar.
B. Bloco narrativo curto: 'Algumas histórias ficam ainda mais bonitas quando são compartilhadas.' A pintura se desdobra em outra cena do casal durante o scroll.
C. Informações do grande dia: 20 de dezembro de 2026, domingo, a partir das 17h, BuGú Delícias, Taguatinga. Cards editoriais com botões COMO CHEGAR e ADICIONAR AO CALENDÁRIO. Countdown discreto opcional, sem tornar a página um cronômetro.
D. Dress code ilustrado, interativo e funcional: COQUETEL ELEGANTE, inspirado em tons naturais. Cartões alternáveis de inspirações femininas, masculinas e opções livres, com silhuetas em aquarela, paleta interativa e informações sobre conforto. Evitar impor gênero para escolher recomendações.
E. Seção de confirmação, principal conversão: convite personalizado, formulário mobile, estado de carregamento, erros, sucesso e opção NÃO PODEREI COMPARECER.
F. Fecho emocional com a segunda ilustração do casal e 'Com carinho, Alex & Paloma'. CTA final se ainda não respondeu.
G. Rodapé delicado com data e local. Nenhum conteúdo fictício (presentes, lista de presentes, hospedagem, dress code obrigatório, estacionamento) sem confirmação.

No mobile, usar barra inferior fixa ELEGANTE com 'Confirmar presença' enquanto o formulário não está na tela; recolher automaticamente quando o formulário estiver visível. Respeitar safe-area iOS e evitar cobrir conteúdo ou teclado.

## 4. HERO IMERSIVA: EXECUÇÃO PRECISA

Composição inicial: viewport mínimo de 100svh, papel texturizado como fundo, grande ilustração do casal centralizada no terço visual correto, camadas SVG de folhagens aquareladas que se abrem progressivamente, tipografia com amplo espaçamento e contraste. Manter a imagem visível sem cortes agressivos em 360x640, 390x844 e 430x932.

Animação inicial GSAP em sequência bem ritmada:
1. textura/fundo aparece de modo imediato (sem splash screen demorada);
2. folhas surgem com leve opacity/rotation de poucos graus, como traços pintados;
3. a ilustração do casal é revelada por máscara SVG, clipPath ou pincelada animada;
4. os nomes surgem com fade/translate curto e suave;
5. data, frase e CTA entram depois, sem bloquear interação;
6. pequenos movimentos ambientais independentes e opcionais, nunca distraindo a leitura.

Animações de rolagem: GSAP ScrollTrigger para revelações e transições, @gsap/react useGSAP para escopo/cleanup; Flip e DrawSVG/MorphSVG apenas quando tecnicamente úteis e disponíveis, sem dependências supérfluas. SVG com caminhos de folhas pode ser desenhado em sequência; ilustrações alternam com máscara orgânica; frases surgem em pequenos blocos. No mobile, limitar efeitos intensivos e priorizar transforms/opacity. Sem scroll hijacking nem scroll horizontal acidental. Considerar viewport resize, orientação, retorno de background e prefers-reduced-motion. Nunca ocultar conteúdo caso JS falhe.

Microinterações: estados hover/focus/active, botões com efeito de tinta que se espalha (CSS/SVG), paleta que troca a cor do background em pequenos cartões, flor que acompanha discretamente o scroll, ícones de localização/calendário e confirmação com motion elegante. Som ambiente NÃO deve iniciar automaticamente. Não colocar player musical sem solicitação.

## 5. COPYWRITING REAL, NÃO PLACEHOLDERS

Tom: íntimo, sofisticado, caloroso, claro e humano. Evitar exagero poético e frases religiosas assumidas. Todo texto em pt-BR. Textos iniciais sugeridos, refináveis no código:

Hero, eyebrow: 'UM DIA PARA GUARDAR NA MEMÓRIA'
Hero H1: 'Alex & Paloma'
Hero destaque: 'Nossa história fica ainda mais bonita com você.'
Hero descrição: 'No dia 20 de dezembro, vamos celebrar o amor e reunir pessoas que fazem parte da nossa história. Você é uma delas, e queremos muito ter você por perto.'
Hero CTA: 'Confirmar minha presença'
Hero CTA secundário: 'Descobrir nosso grande dia'

Narrativa: 'Existem momentos que a gente sonha viver. E existem pessoas que tornam esses momentos inesquecíveis. Você faz parte da nossa história e queremos dividir esse dia com você.'

Data H2: 'Nosso encontro está marcado'
Data: 'Domingo, 20 de dezembro de 2026'
Hora: 'A partir das 17h'
Local: 'BuGú Delícias, Taguatinga'
Botão: 'Como chegar'
Calendário: 'Adicionar ao calendário'

Dress H2: 'Venha do seu jeito mais especial'
Dress subtítulo: 'Sugerimos coquetel elegante: um visual bonito, leve e confortável para celebrar com a gente.'
Dress paleta: 'Inspire-se nos tons da natureza: verde oliva, sálvia, terracota, rosé, vinho e tons terrosos.'
Dress cuidados: 'Se possível, deixe o branco, off-white e marfim para a noiva.'
Dress conforto: 'Escolha um look em que você se sinta bem para aproveitar cada momento.'
Evitar tratar os moodboards diferentes como regras oficiais contraditórias; estabelecer 'coquetel elegante' como SUGESTÃO VISUAL que o casal poderá alterar no painel.

RSVP H2: 'Só falta você confirmar'
RSVP texto: 'Estamos preparando tudo com muito carinho. Para organizar cada detalhe, conta pra gente: podemos esperar por você?'
Campo: 'Seu nome completo'
Placeholder: 'Como você gostaria de ser identificado(a)'
Botão positivo: 'Sim, estarei presente'
Botão negativo: 'Não poderei comparecer'
Botão envio: 'Enviar minha resposta'
Sucesso de envio público: 'Recebemos sua resposta com carinho. Obrigado por nos contar!'
Sucesso confirmação validada: 'Presença confirmada! Estamos muito felizes em dividir esse dia com você.'
Mensagem para quem não irá: 'Vamos sentir sua falta, mas agradecemos por nos avisar.'
Erro real: 'Não foi possível enviar agora. Confira sua conexão e tente novamente.'
Não prometer confirmação final quando existir revisão manual.

Fecho: 'Com carinho, Alex & Paloma. 20.12.2026.'

## 6. DRESS CODE COMO EXPERIÊNCIA INTERATIVA

Não criar apenas uma lista estática de roupas. Desenvolver um pequeno lookbook editorial:
- Seletor por estilo de composição (vestidos/conjuntos, alfaiataria, inspirações livres), com tabs ARIA e gestos de toque quando apropriado;
- ilustrações aquareladas de roupas e acessórios, preferencialmente ativos autorais. Não reutilizar imagens dos moodboards com nomes de outros casais;
- swatches de cores que alteram suavemente fundos, pequenos detalhes e descrição do look;
- detalhes expandíveis: tecidos leves, conforto, sapatos adequados, sugestões para final de tarde;
- botão 'Ver inspirações' abre painel acessível sem navegação desnecessária;
- estados acessíveis por teclado e leitor de tela, e interações sem depender de hover;
- nunca confundir paleta sugerida com uma regra rígida, salvo orientação explícita do casal.

## 7. RSVP, REGRA DE NEGÓCIO E EXPERIÊNCIA

O casal possui uma lista-base PRIVADA de 50 registros, sendo 19 da Paloma, historicamente marcados como confirmados, e 31 do Alex, historicamente ainda pendentes. Esta lista é base administrativa, NÃO deve aparecer no front público e NÃO deve ser exposta por API de busca.

UX prioritária: um único link público abre a experiência. Ao confirmar, o visitante escolhe SIM/NÃO e informa nome completo obrigatório. Opcionalmente pode deixar WhatsApp para facilitar contato, mas não exigir telefone, CPF, e-mail ou senha como condição inicial. Incluir consentimento curto sobre uso dos dados exclusivamente para organização do casamento; não exibir informações de terceiros.

Problema importante: grande parte da lista-base contém apenas prenomes, e há duas entradas chamadas Carolina. Portanto, NÃO implementar fuzzy-match que confirme automaticamente uma pessoa por nome parcial. Para um envio público sem token:
- criar RSVP_SUBMISSION com nome completo, resposta, timestamp e status pending_review;
- mostrar 'Recebemos sua resposta' sem afirmar que já foi validada;
- no admin, sugerir possíveis correspondências, mas exigir decisão humana para associar à pessoa da lista, especialmente homônimos;
- impedir que um formulário anônimo altere diretamente a resposta validada de outro convidado;
- sinalizar repetições e possível spam sem expor quem já está cadastrado;
- dar suporte a alterações manuais e registrar histórico.

Melhoria opcional de baixíssima fricção: gerar um link pessoal assinado com token aleatório forte para cada convite. Quando o convidado acessa esse link, o back-end associa de forma segura sua resposta ao registro correto, ainda solicitando o nome completo conforme pedido. O link genérico público continua funcionando com revisão. NUNCA colocar IDs sequenciais ou lista completa nos parâmetros. Oferecer opção de QR code pessoal no admin, sem obrigatoriedade de cadastro/login público.

A resposta pode ser SIM ou NÃO. RSVP não é criação de convidados ilimitados; respostas não reconhecidas ficam em revisão e não inflacionam a contagem oficial. Mostrar estados: awaiting_response, manually_confirmed, confirmed_via_token, declined, pending_review, duplicate_flagged; definir nomenclatura e transições claramente em schema/serviço. Um convidado pode retificar via link pessoal, mediante revalidação segura. Toda operação crítica deve ser transacional/idempotente.

## 8. PAINEL DE ADMINISTRAÇÃO

Implementar /admin/login e /admin/dashboard sob autenticação efetiva, com autorização de administrador no servidor. Nunca disponibilizar credenciais padrão no código ou no Git. Preferir Supabase Auth ou provedor equivalente disponível no projeto.

Dashboard com: total de convidados importados (inicial 50), confirmados históricos (19), pendentes históricos (31), confirmados pelo site (indicador separado), recusas, respostas em análise, taxa de resposta, evolução no tempo e lista filtrável. Evitar soma dupla de confirmações históricas e novas respostas.

Tabela: nome, responsável (Alex/Paloma), status, origem (importação/manual/link pessoal/formulário público), data da última resposta, contato opcional, observações. Ações: criar, corrigir, remover, confirmar, marcar ausência, associar envio público a registro, sinalizar duplicata, reenviar link individual, copiar link, exportar CSV compatível com Excel (UTF-8 BOM e proteção contra CSV formula injection), visualizar histórico de alterações.

Campos editáveis de evento: título, data, horário de abertura, local, endereço, URL do Google Maps verificada, dress code, prazo de RSVP (inicialmente não definido), textos e link compartilhável. Não permita que links públicos alterem essas configurações.

## 9. LISTA-BASE PARA SEED PRIVADO

Grupo PALOMA, 19 registros. Todos com confirmed_manual = true conforme informação recebida:
1 Sandra
2 Cláudio
3 Péricles
4 Hugo
5 Carolina [registro A]
6 Sérgio
7 Bruna
8 Guilherme
9 Paula
10 Lucas
11 Gessica
12 Leonardo
13 Heloísa
14 João Victor
15 Diovanna
16 Carolina [registro B]
17 Jian
18 Édson
19 Suellen

OBS: conservar as duas Carolinas como registros distintos até o casal decidir se é duplicidade. Não inventar sobrenome, não mesclar automaticamente.

Grupo ALEX, 31 registros, todos awaiting_response conforme informação recebida:
1 Tânia
2 Simone
3 Alberto
4 Thaynara
5 Franciele
6 Thanyele
7 Victor
8 João Miranda
9 Victoria
10 Ana Paula
11 Alan
12 Jorge
13 Elisa
14 Matheus Carolino
15 Ban
16 William
17 Clério
18 Thais
19 Markin
20 Sara
21 Domingos
22 Jessica
23 Alexandre
24 Carol
25 João
26 Diogo
27 Tiago
28 Nathalia Evangelista
29 Daniel
30 Pedro
31 Nicolas Braga

Nomes anteriormente removidos NÃO podem reaparecer no seed: Gabriel Rodrigues, Bárbara, Gabriel Coringa, Suellen [da lista Alex; permanece na lista Paloma], Galdino, Beatriz, Marcos Carvalho, Gabriela Kei, Agnes Kaori, Calebe, Cristina, Gustavo, Vitinho, Amanda.

Atenção: no seed, nome exibido é o que foi efetivamente informado, mesmo quando não há sobrenome; o formulário pede nome completo, então armazenar `submitted_full_name` separadamente do `display_name` importado. Seed seguro e idempotente; não criar registros duplicados em reexecução.

## 10. TECNOLOGIAS E ARQUITETURA

Se o repositório não tiver arquitetura estabelecida, usar:
- Next.js App Router + React + TypeScript strict;
- Tailwind CSS + CSS custom properties para design tokens e detalhes editoriais;
- GSAP + @gsap/react + ScrollTrigger para motion; implementar efeitos em componentes client isolados e limpeza correta;
- SVGs escaláveis e composição com máscaras; imagens usando next/image, asset optimization e fontes Next;
- Lucide apenas para poucos ícones utilitários, não para substituir ilustrações artísticas;
- Supabase PostgreSQL para persistência; Auth para admin; RLS e grants restritivos;
- Zod para validação nos limites do servidor; React Hook Form ou React form actions conforme melhor ajuste ao repositório;
- Playwright para E2E e Vitest para regras/normalização/matching; Lighthouse como auditoria;
- Vercel (ou infraestrutura existente) para deploy; migrations versionadas.

Evitar adicionar Framer Motion se GSAP resolver os movimentos. Não criar animação pesada com canvas/WebGL só por impressionar. Adotar progressive enhancement. Usar libraries atualizadas e APIs estáveis, consultando documentação oficial instalada ou disponível antes de codar. Se algum recurso premium exigir licença, não depender dele; implementar alternativa gratuita robusta.

Estrutura de referência:
app/(public)/page.tsx
app/(public)/layout.tsx
app/admin/login/page.tsx
app/admin/dashboard/page.tsx
app/api/rsvp/route.ts (se necessário)
app/api/calendar/route.ts
components/wedding/Hero.tsx
components/wedding/WatercolorScene.tsx
components/wedding/EventDetails.tsx
components/wedding/DressCodeLookbook.tsx
components/wedding/RSVPForm.tsx
components/wedding/FinalLetter.tsx
components/admin/*
lib/db/*
lib/rsvp/*
lib/auth/*
lib/validators/*
styles/*
supabase/migrations/*
scripts/seed-guests.*
public/assets/wedding/*
tests/*

Adapte a árvore real ao repositório, sem duplicar estrutura sem necessidade.

## 11. MODELO DE DADOS SUGERIDO

events: id, slug, couple_names, event_date, starts_at_local, timezone, venue_name, venue_address, maps_url, dress_code_json, rsvp_deadline(nullable), public_enabled, created_at, updated_at.
guests: id(uuid), event_id, group_owner('Alex'|'Paloma'), display_name, normalized_name, official_status, confirmation_source, invite_token_hash(nullable), token_issued_at, preferred_contact(nullable), notes(nullable), created_at, updated_at, deleted_at(nullable).
rsvp_submissions: id, event_id, guest_id(nullable), submitted_full_name, normalized_submitted_name, attendance_choice(bool), optional_contact(nullable), matching_state, review_status, submitted_at, reviewed_at(nullable), reviewer_id(nullable), request_fingerprint_hash(nullable), consent_version, deduplication_key.
rsvp_audit_log: id, guest_id(nullable), submission_id(nullable), actor_type, actor_id(nullable), action, before_json, after_json, created_at.
admin_profiles: user_id, role, created_at.

Adicionar índices, constraints e foreign keys; timestamps UTC e apresentação timezone America/Sao_Paulo. Event state isolado por event_id. Usar normalização Unicode com remoção de diacríticos para sugestões internas, preservando nome original para exibição. Não expor token bruto ou hashes em payload público. Se link pessoal, apenas armazenar hash do segredo aleatório, validar com comparação segura e expiração/revogação administrável.

Segurança: regras de RLS/grants para não permitir leitura de guests/rsvp_submissions por anon; usar uma camada de servidor autorizada para criação de submissões anônimas com rate limiting, validação Zod, proteção antispam simples (honeypot e limites adaptativos), logging discreto e mensagens que não revelem presença de uma pessoa na lista. Toda mutation admin requer autenticação E autorização no servidor, inclusive Server Actions. Segredos só em runtime server-side, nunca NEXT_PUBLIC. Não gravar IP completo sem justificativa; caso use hash antiabuso, aplicar retenção curta e documentar.

## 12. FLUXOS DE TELAS

Fluxo PÚBLICO:
1. Visitante abre / e assiste à entrada curta; hero já oferece CTA.
2. Pode ver evento, mapa e dress code sem fazer login.
3. CTA rola suavemente para RSVP; foco vai ao título do formulário sem comportamento brusco.
4. Escolhe 'Sim, estarei presente' ou 'Não poderei comparecer'.
5. Digita nome completo; opcionalmente informa contato e aceita o aviso de privacidade proporcional.
6. Validação: nome suficientemente completo (com fallback acessível para nomes legitimamente monônimos a serem revisados), tamanho limite, sanitização de texto, input mobile e erro específico.
7. Envio assíncrono com estado de loading, prevenção de múltiplos cliques, tratamento de timeout/retry.
8. Se token pessoal válido, vincula registro e retorna resposta validada. Se genérico, recebe resposta em análise. Não expor nomes do banco para visitantes.
9. Tela final personalizada com a mensagem correta conforme sim/não e status real.

Fluxo ADMIN:
1. Login seguro; dashboard e métricas.
2. Fila de respostas não vinculadas; busca e sugestões internas por similaridade com transparência.
3. Administrador vincula o nome enviado a um registro OU adiciona novo convidado mediante decisão explícita.
4. Atualiza status de forma transacional; registra auditoria; indicadores são recalculados corretamente.
5. Filtra confirmações, exporta lista e copia links pessoais.

## 13. MAPA, CALENDÁRIO E COMPARTILHAMENTO

'Como chegar': usar link Google Maps para endereço do evento, abrindo app ou navegador. Nunca forçar permissão de localização. Se houver API Key válida e intenção de exibir mapa, criar mapa embutido opcional e lazy-loaded com fallback para link; não tornar a API Google Maps um bloqueio para o site funcionar.

'Adicionar ao calendário': gerar .ics válido, com DTSTART em fuso correto, título 'Casamento Alex & Paloma', local e descrição. Como horário de encerramento não foi confirmado, não afirmar horário de término no texto público; internamente, o arquivo .ics pode usar duração técnica configurável documentada como não oficial, ou oferecer integração de calendário que permita ao convidado ajustar a duração. Não divulgar horários fictícios ao usuário.

Open Graph/WhatsApp: título Alex & Paloma · 20.12.2026; descrição curta carinhosa; imagem OG original derivada da arte Save the Date, sem nomes/datas de outras referências. Favicons, theme-color, SEO com noindex opcional configurável para convite privado; não indexar páginas admin ou nomes de convidados. Metadata pt-BR.

## 14. PERFORMANCE, QUALIDADE E ACESSIBILIDADE

Alvos: carregamento rápido em rede 4G, LCP <= 2,5 s no mobile mediano em condições adequadas, CLS <= 0,1, INP <= 200 ms. Propor peso alvo de imagens e carregamento progressivo; preload apenas recurso essencial do hero, lazy load abaixo da dobra. Não tratar metas como garantidas sem auditoria.

Acessibilidade: contraste WCAG AA nos textos essenciais, sem texto principal como imagem, foco visível, mínimo 44x44 px em áreas de toque, labels reais, aria-live para confirmação, alternativa ao movimento com prefers-reduced-motion, alt descritivo para as ilustrações centrais e alt vazio para folhagens puramente decorativas. Funciona sem mouse e com VoiceOver/TalkBack. Em aparelhos lentos, reduzir/retirar parallax.

Teste nas larguras 320, 360, 375, 390, 430, 768, 1024, 1440. Testar Safari iOS, Chrome Android, desktop e teclado. Orientação e safe areas. Inputs não podem ficar cobertos pelo teclado. Nenhum overflow lateral.

## 15. TESTES DE ACEITAÇÃO

Todos os casos abaixo devem ser verificáveis:
- Hero inicial funciona com e sem GSAP; casal real preservado na arte.
- CTA leva ao RSVP e nunca fica escondido sob dock/teclado.
- O nome completo e a escolha sim/não são enviados ao banco de verdade.
- Sem token, a resposta não altera silenciosamente um convidado existente.
- Com token válido, confirma a pessoa certa sem expor lista.
- Dois registros Carolina permanecem separados até revisão explícita.
- Respostas duplicadas/repetidas são sinalizadas e não criam convites infinitos.
- Admin consegue revisar, vincular, editar e exportar.
- Dashboard inicia com 50 registros, 19 confirmados históricos e 31 pendentes; cálculos posteriores não fazem contagem dupla.
- 14 convidados removidos da lista Alex não reaparecem (inclusive Suellen, que permanece somente na lista Paloma).
- Sem credenciais Supabase, o projeto informa claramente setup pendente e NÃO finge confirmar ou gravar dados.
- Redução de movimento mantém conteúdo completo e funcional.
- Sem chave Maps, botão 'Como chegar' ainda funciona.
- Dress code tem interações reais, não elementos decorativos simulando botões.
- Erros, sucesso, navegação com teclado e estados de loading estão completos.
- Testes automatizados passam; lint/typecheck/build passam; sem erros de console significativos.

## 16. ENTREGÁVEIS OBRIGATÓRIOS

Ao terminar, entregar: código funcional; assets usados com atribuição quando necessária; componentes e estilos; SQL migrations e políticas RLS; seed idempotente; configuração `.env.example`; README com setup/deploy; rotas públicas/admin; testes e um resumo objetivo do que foi implementado, do que ainda requer chaves/arquivos e dos comandos executados. Se não tiver acesso a produção, deixar pronto para deploy sem afirmar que está publicado.

PROCESSO DE EXECUÇÃO:
1. Inspecionar repo e fotos reais disponíveis.
2. Estabelecer arquitetura e tokens, escrevendo implementação, não só documento.
3. Construir mobile primeiro e validar hero visual.
4. Criar dados, autorização, formulário, revisão administrativa e seed.
5. Integrar GSAP e lookbook sem prejudicar a performance.
6. Implementar mapa/calendário/OG, acessibilidade e responsividade.
7. Rodar testes, lint, typecheck, build e corrigir falhas.
8. Relatar entregáveis e qualquer pendência concreta.

REGRA FINAL: É um casamento real, com pessoas reais. Não utilizar placeholders visíveis, texto genérico de template, confirmação falsa ou APIs fictícias. A experiência deve emocionar em 3 segundos e permitir responder em menos de 30 segundos, com o mínimo de atrito possível. Entregar algo autoral e digno de um estúdio de design premium.
