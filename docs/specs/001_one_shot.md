# SPEC — OndeDescartar (MVP em Ruby on Rails)

> **Para o Claude Code:** esta é uma spec *one-shot*. Execute tudo, na ordem da seção 10, sem pedir confirmação entre as etapas.
> Ao final, rode a checagem da seção 11 e só considere concluído se tudo passar.
> A pasta `prototype-src/` é o **protótipo de referência** (mapa, busca, pins, painel, bottom sheet, marca): `index.html` (markup), `app.css` (design), `app.js` (comportamento: `LOGO`, `PIN`, ícones, `openStatus`, painel, bottom sheet, busca) e `data.js` (`ECOPONTOS_SEED`).
> **Não leia o `prototype.html`** (1 MB, é a versão compilada só para abrir no navegador). Leia apenas os arquivos de `prototype-src/`.
> Reaproveite o CSS, os ícones SVG, o logo e o comportamento dele. **Não** reaproveite o mapa-base embutido nem a busca offline do protótipo: no app real, use tiles do OpenStreetMap e o Nominatim (seção 7).

---

## 1. Objetivo

Web app público em que qualquer pessoa abre o site e vê **imediatamente** um mapa com pontos de descarte (ecopontos, cooperativas etc.).
A pessoa clica em um pin e vê o painel de detalhes: endereço, materiais aceitos, horários e contatos. Dali, pode traçar a rota ou compartilhar o endereço.
Uma área administrativa simples permite cadastrar, editar e remover os pontos.

**Fora do escopo (não implementar):** login/cadastro de usuários finais, filtros por material ou categoria, dashboard, landing page, avaliações, favoritos.

---

## 2. Stack e decisões

| Item | Decisão | Motivo |
|---|---|---|
| Framework | Rails 8 (ou 7.2+), MVC clássico, server-rendered | Pedido do projeto |
| Banco | **PostgreSQL**, conexão 100% por variáveis de ambiente (seção 2.1) | O banco roda fora do container; o app só recebe os dados de conexão |
| Front-end | Importmap + Stimulus (padrão do Rails). **Sem** React, **sem** build de JS | Simplicidade |
| CSS | CSS próprio em `app/assets/stylesheets/application.css`, portado do `prototype.html`. **Sem** Tailwind | O protótipo já tem o design pronto |
| Mapa | Leaflet 1.9.4 via CDN (`unpkg.com/leaflet@1.9.4`) + tiles OpenStreetMap | Pedido do projeto |
| Busca de endereço | Nominatim (OpenStreetMap), chamada **do navegador** | Gratuito, sem chave |
| Autenticação do admin | `http_basic_authenticate_with` com usuário/senha em ENV | Não é "login de usuário", só protege o admin |
| Testes | Minitest (padrão do Rails): models + requests | Padrão do Rails |
| Deploy | **Um único `Dockerfile`** (o de produção que o Rails 8 gera, ajustado). Sem docker-compose | Pedido do projeto |
| ENV local | gem `dotenv-rails` (grupos development e test) lendo `.env` | Mesmo `.env` serve para rodar local e para o `docker run --env-file` |
| Idioma | Código, tabelas, rotas e classes em **inglês**. Interface em **português (pt-BR)** | Pedido do projeto |
| Fuso | `config.time_zone = "Brasilia"`; `config.active_record.time_zone_aware_types = [:datetime]` | Horário de funcionamento é horário "de relógio" e **não** pode ser convertido de fuso |

Nome da app: `onde_descartar`. Comando de criação:
```bash
rails new onde_descartar -d postgresql --skip-solid --skip-kamal --skip-jbuilder --skip-action-mailbox --skip-action-text --skip-active-storage --skip-action-cable
```
`--skip-solid` é **obrigatório**: sem ele, o Rails 8 configura em produção 4 bancos (primary, cache, queue, cable), e o deploy com um único banco quebra.
(se a pasta atual já for a raiz do projeto, use `rails new . ...`).

### 2.1 Variáveis de ambiente

Criar `.env.example` (versionado) e incluir `.env` no `.gitignore` e no `.dockerignore`:

```dotenv
# Banco (PostgreSQL externo)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=onde_descartar

# Rails
RAILS_ENV=production
SECRET_KEY_BASE=troque-por-bin-rails-secret
RAILS_LOG_TO_STDOUT=true
FORCE_SSL=false

# Admin (HTTP Basic)
ADMIN_USER=admin
ADMIN_PASSWORD=troque-esta-senha
```

`config/database.yml`, sem `DATABASE_URL`, lendo as variáveis acima:

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS", 5) %>
  host: <%= ENV.fetch("DB_HOST", "localhost") %>
  port: <%= ENV.fetch("DB_PORT", 5432) %>
  username: <%= ENV.fetch("DB_USERNAME", "postgres") %>
  password: <%= ENV["DB_PASSWORD"] %>

development:
  <<: *default
  database: <%= ENV.fetch("DB_NAME", "onde_descartar") %>_development

test:
  <<: *default
  database: <%= ENV.fetch("DB_NAME", "onde_descartar") %>_test

production:
  <<: *default
  database: <%= ENV.fetch("DB_NAME", "onde_descartar") %>
```

`config/environments/production.rb`:
- `config.force_ssl = ENV["FORCE_SSL"] == "true"` e `config.assume_ssl = ENV["FORCE_SSL"] == "true"`. Sem isso, rodar o container em `http://localhost:3000` entra em loop de redirect para HTTPS.
- O app não deve depender de `RAILS_MASTER_KEY`/credentials. Tudo vem de ENV (`SECRET_KEY_BASE` incluído).

### 2.2 Dockerfile (único)

Usar o `Dockerfile` gerado pelo Rails 8 (multi-stage, Ruby slim, `assets:precompile`, usuário não-root, Thruster) com estes ajustes:
- Garantir `libpq` no runtime e `libpq-dev` no build (o gerador com `-d postgresql` já faz isso; conferir).
- `EXPOSE 3000` e servidor ouvindo em `0.0.0.0:3000` (`CMD ["./bin/thrust", "./bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]`). Se o Thruster não estiver presente, usar `./bin/rails server -b 0.0.0.0 -p 3000`.
- O `assets:precompile` do build não pode exigir banco nem chave real: usar `SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile` (já é o padrão do gerador).
- `bin/docker-entrypoint`: antes de subir o servidor, rodar `./bin/rails db:prepare` (cria e migra o banco) e depois `./bin/rails db:seed` (idempotente; só cria materiais).
- `.dockerignore`: incluir `.env`, `log/*`, `tmp/*`, `node_modules`, `prototype.html`, `prototype-src/`.

Comandos que **precisam funcionar** e devem estar no README:

```bash
docker build -t onde-descartar .
docker run --rm -p 3000:3000 --env-file .env onde-descartar
```

Se o Postgres estiver na própria máquina (fora do Docker), usar `DB_HOST=host.docker.internal` e, no Linux, acrescentar `--add-host=host.docker.internal:host-gateway` ao `docker run`. Documentar isso no README.

---

## 3. Identidade visual (copiar do protótipo)

- Cores: **Verde `#18A06A`**, **Azul `#1F5FD6`**, **Branco `#FFFFFF`**. Tons derivados (exatamente como em `:root` do protótipo): `--green-700 #0E7A4F`, `--green-50 #ECF8F2`, `--blue-700 #1748A8`, `--blue-900 #0E2350` (texto), `--blue-50 #F0F5FE`, `--line #E3E9F2`, `--muted #5A6A85`.
- Fonte: **Manrope** (Google Fonts), pesos 500/600/700/800.
- Logo: pin azul com uma folha verde no centro. Copie a constante `LOGO` de `prototype-src/app.js` para a partial `app/views/shared/_logo.html.erb`. Wordmark: "Onde" em azul + "Descartar" em verde, peso 800.
- Pin do mapa: copie a constante `PIN` do protótipo (verde quando normal; azul, maior e com animação `pinBounce` quando selecionado).
- Favicon: o mesmo SVG do logo em `public/icon.svg`.

---

## 4. Modelo de dados

```
places 1──1 addresses
places 1──N contacts
places 1──N opening_hours
places N──N materials   (via place_materials)
```

### 4.1 `places`
| Coluna | Tipo | Regras |
|---|---|---|
| name | string | `null: false`; presença; tamanho 2..120 |
| description | text | opcional; máximo de 1000 |
| kind | string | `null: false`; enum **string-backed**: `ecopoint`, `cooperative`, `drop_off_point`, `partner_store` |
| active | boolean | `null: false, default: true` |
| timestamps | | |

- **Não** usar a coluna `type` (é reservada para STI no Rails).
- Enum: `enum :kind, { ecopoint: "ecopoint", cooperative: "cooperative", drop_off_point: "drop_off_point", partner_store: "partner_store" }, validate: true`
- Rótulos pt-BR em `config/locales/pt-BR.yml`: Ecoponto, Cooperativa de reciclagem, Ponto de entrega voluntária, Ponto de coleta em comércio.
- Validações extras: `validates :address, presence: true`; validação customizada que exige **pelo menos 1 material**.
- Associações: `has_one :address`, `has_many :contacts`, `has_many :opening_hours`, `has_many :place_materials`, `has_many :materials, through: :place_materials`, todas com `dependent: :destroy`.
- `accepts_nested_attributes_for :address`
- `accepts_nested_attributes_for :contacts, :opening_hours, allow_destroy: true, reject_if: :all_blank`
- Scope: `scope :active, -> { where(active: true) }`
- Índice: `kind`.

### 4.2 `addresses`
| Coluna | Tipo | Regras |
|---|---|---|
| place_id | references | `null: false`, FK, **índice único** |
| street | string | obrigatório |
| number | string | obrigatório (aceita "s/n", "1.120-A") |
| complement | string | opcional |
| neighborhood | string | obrigatório |
| city | string | obrigatório |
| state | string(2) | obrigatório; precisa estar na lista das 27 UFs; salvo em maiúsculas |
| zip_code | string(8) | obrigatório; normalizado para **apenas dígitos**; exatamente 8 dígitos |
| latitude | decimal(9,6) | `null: false`; entre -90 e 90 |
| longitude | decimal(9,6) | `null: false`; entre -180 e 180 |

- `before_validation`: `zip_code` sem não-dígitos; `state` com `upcase.strip`.
- Métodos: `formatted_zip` → `"04101-000"`; `full_address` → `"Rua X, 480 – Bairro, Cidade – UF, 04101-000"`.

### 4.3 `contacts`
| Coluna | Tipo | Regras |
|---|---|---|
| place_id | references | `null: false`, FK |
| kind | string | `null: false`; enum string: `phone`, `whatsapp`, `email`, `website` |
| value | string | `null: false`; **normalizado** antes de validar |

Índice único: `[place_id, kind, value]`.

**Regra central:** salvar normalizado e formatar só na exibição.

| kind | Normalização (`before_validation`) | Validação | Exibição (`display_value`) | Link (`href`) |
|---|---|---|---|---|
| phone | só dígitos; se tiver 10 ou 11 dígitos, prefixar `+55` | `/\A\+55\d{10,11}\z/` | `(11) 3333-4444` / `(11) 98765-4321` | `tel:+5511...` |
| whatsapp | igual | `/\A\+55\d{2}9\d{8}\z/` (celular) | `(11) 98765-4321` | `https://wa.me/5511...` |
| email | `strip.downcase` | `URI::MailTo::EMAIL_REGEXP` | igual | `mailto:` |
| website | `strip`; se não tiver esquema, prefixar `https://` | `URI.parse` com esquema http/https e host presente | sem o esquema | a própria URL |

A lógica fica no model `Contact`, em métodos privados com `case kind`. Não criar service object.

### 4.4 `opening_hours`
| Coluna | Tipo | Regras |
|---|---|---|
| place_id | references | `null: false`, FK |
| weekday | integer | `null: false`; 0..6 (0 = domingo, o mesmo padrão de `Date#wday`) |
| opens_at | time | `null: false` |
| closes_at | time | `null: false`; **estritamente maior** que `opens_at` |

- **Não** usar `from`/`to` (são palavras reservadas do SQL).
- Validações: `closes_at > opens_at`; sem **sobreposição** de intervalos com outro `opening_hour` do mesmo lugar no mesmo `weekday`.
  - Quando os horários chegam por nested attributes, a checagem de sobreposição precisa considerar os registros **em memória** (`place.opening_hours.reject(&:marked_for_destruction?)`), não só os do banco. Coloque essa validação em `Place` (`validate :opening_hours_do_not_overlap`).
- CHECK constraint na migration: `closes_at > opens_at` e `weekday BETWEEN 0 AND 6`.
- Um dia sem nenhuma linha = fechado. Mais de um intervalo por dia é permitido (ex.: 08–12 e 14–18).
- Limitação aceita: não há suporte a horário que vira a noite (ex.: 22h–02h).

### 4.5 `materials` (catálogo, populado pelo `seeds.rb`)
| Coluna | Tipo | Regras |
|---|---|---|
| key | string | `null: false`, índice único, formato `/\A[a-z_]+\z/` |
| name | string | `null: false`, índice único |

Seeds (idempotentes, com `find_or_create_by!(key:)`):

| key | name |
|---|---|
| paper | Papel e papelão |
| plastic | Plásticos |
| glass | Vidros |
| metal | Metais |
| electronics | Eletrônicos |
| batteries | Pilhas e baterias |
| cooking_oil | Óleo de cozinha |
| furniture | Móveis |
| rubble | Entulho |
| special_waste | Resíduos especiais |

O `key` é usado pelo front para escolher o ícone. Mapeamento a partir dos ícones do protótipo: `paper→papel`, `plastic→plastico`, `glass→vidro`, `metal→metal`, `electronics→eletronicos`, `batteries→pilhas`, `cooking_oil→oleo`, `furniture→moveis`, `rubble→entulho`, `special_waste→especiais`.

### 4.6 `place_materials`
`place_id` e `material_id` como references, `null: false`, FK, com índice único em `[place_id, material_id]`.

### 4.7 Regras gerais de integridade
- Tudo o que é integridade vai **no banco e no model**: FK, unicidade, not null e CHECKs.
- `Place#save` grava lugar, endereço, contatos, horários e materiais numa **única transação**: se qualquer filho for inválido, nada é gravado.

---

## 5. Rotas

```ruby
root "map#index"
resources :places, only: [:index]          # GET /places.json → JSON para o mapa (somente active)

namespace :admin do
  root "places#index"
  resources :places                        # CRUD completo
end
```

---

## 6. Histórias de usuário e critérios de aceite

### Público (mapa)

**US-01 — Ver o mapa ao abrir o site**
*Como cidadão, quero ver o mapa com os pontos de descarte assim que abro o site, para encontrar um local sem passos extras.*
- [ ] `GET /` renderiza o mapa ocupando 100% da tela, sem landing page, login ou onboarding.
- [ ] Todos os places `active` aparecem como pins personalizados (SVG do protótipo).
- [ ] A visão inicial enquadra todos os pins (`fitBounds`). Sem nenhum ponto, centraliza em São Paulo (-23.55, -46.63), zoom 11.
- [ ] Ficam visíveis: o logo, a barra de busca flutuante no topo e os controles do mapa.
- [ ] Places inativos não aparecem.

**US-02 — Ver os detalhes de um ponto**
*Como cidadão, quero clicar em um pin e ver tudo sobre o ponto, para saber se ele aceita o que eu quero descartar.*
- [ ] Clicar no pin abre o painel flutuante à direita (desktop) ou o bottom sheet (≤ 760px), com a mesma animação do protótipo.
- [ ] O pin selecionado fica azul, maior e com uma animação de "bounce".
- [ ] O painel mostra: tipo (rótulo pt-BR), nome, status de funcionamento, descrição, endereço completo com botão "Copiar", materiais aceitos em chips com ícone, horários de segunda a domingo (com o dia de hoje destacado) e contatos.
- [ ] Campos vazios **não** aparecem. Se não houver contatos, a seção "Contato" não é renderizada.
- [ ] O painel fecha pelo X, pela tecla Esc ou com um clique no mapa. O mapa continua visível e navegável atrás dele.
- [ ] No mobile, o bottom sheet abre recolhido (mostrando o cabeçalho e as ações), expande ao tocar ou arrastar o puxador e fecha ao arrastar para baixo.

**US-03 — Saber se está aberto agora**
- [ ] O status é calculado no fuso `America/Sao_Paulo`: "Aberto agora · fecha às 22h", "Fecha em breve · às 18h" (≤ 60 min para fechar) ou "Fechado · abre amanhã às 8h". Mesma lógica de `openStatus` do protótipo.
- [ ] O cálculo é feito no **front-end** (porte de `openStatus` de `prototype-src/app.js`) a partir dos horários recebidos no JSON. O servidor não calcula nem armazena o status.

**US-04 — Traçar rota**
*Como cidadão, quero clicar em "Como chegar" e ver a rota direto.*
- [ ] O botão principal (azul, o mais destacado) abre em nova aba `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG&travelmode=driving`.
- [ ] Se a localização do usuário já tiver sido obtida (US-07), acrescentar `&origin=LAT,LNG`. Caso contrário, o Google Maps escolhe a origem.

**US-05 — Compartilhar endereço**
- [ ] O botão "Compartilhar endereço" usa `navigator.share({ title, text, url })` quando disponível.
- [ ] Sem suporte (ou em caso de erro diferente de `AbortError`), copia nome + endereço completo + link (`https://www.google.com/maps/search/?api=1&query=LAT,LNG`) com `navigator.clipboard.writeText` e mostra feedback visual ("Endereço e link copiados") e um toast.
- [ ] O botão "Copiar" da seção de endereço copia só o endereço completo, com feedback "Copiado".

**US-06 — Contato direto**
- [ ] Se houver telefone: botão secundário "Ligar" (`tel:`). Se houver WhatsApp: botão "WhatsApp" (`https://wa.me/...`, nova aba).
- [ ] Esses botões são visualmente secundários em relação a "Como chegar".

**US-07 — Usar minha localização**
- [ ] O botão de localização (nos controles) chama `navigator.geolocation.getCurrentPosition`.
- [ ] Em caso de sucesso: centraliza com zoom 14, mostra o ponto azul pulsante e exibe a faixa "mais próximo" (US-09).
- [ ] Em caso de negação ou erro: toast amigável ("Não conseguimos acessar sua localização. Você pode buscar um endereço no campo acima."), e a busca continua funcionando. **Não** implementar o modo "Simular" do protótipo.

**US-08 — Buscar endereço**
*Como cidadão, quero buscar uma rua, bairro, cidade, estado, CEP ou ponto de referência para mudar a região do mapa.*
- [ ] Barra flutuante com placeholder "Buscar endereço, cidade, bairro ou CEP...", ícone de lupa, botão de limpar e cantos arredondados.
- [ ] A partir de 3 caracteres, com debounce de **600 ms**, chama `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=br&accept-language=pt-BR&q=...`.
- [ ] Se o texto tiver formato de CEP (8 dígitos, com ou sem hífen), busca primeiro em `https://viacep.com.br/ws/{cep}/json/` e depois no Nominatim com `street, city, state`. Se o ViaCEP falhar, cai para o Nominatim com o CEP puro.
- [ ] Sugestões em dropdown: título (`name` ou a primeira parte de `display_name`), subtítulo (resto do endereço) e um ícone por tipo. Navegação por ↑ ↓ Enter Esc.
- [ ] Mostrar "Buscando..." durante a requisição e "Nada encontrado" quando vier vazio. Em erro de rede, mostrar uma mensagem amigável.
- [ ] Ao escolher: o mapa voa até o local com zoom pelo tipo (casa/rua 16, bairro 14, cidade 12, estado 7; use `boundingbox` com `flyToBounds` quando existir) e um marcador do local buscado.
- [ ] A busca **não filtra** pins: todos continuam visíveis.
- [ ] Toda a busca fica atrás de uma classe `Geocoder` no JS (`async search(query) → [{label, sub, type, lat, lng, bounds}]`), para poder trocar de provedor depois.
- [ ] Respeitar a política do Nominatim: no máximo 1 requisição/segundo (o debounce cuida disso) e cancelar a requisição anterior com `AbortController`.

**US-09 — Ver o ponto mais próximo**
- [ ] Depois de uma busca ou de obter a localização, mostra a faixa inferior "**Nome do ponto** · Mais próximo do local buscado · 1,2 km · N pontos a até 3 km", com o botão "Ver" (que abre o painel do ponto) e o botão X.
- [ ] Se o mais próximo estiver a mais de 35 km: "Nenhum ponto cadastrado por aqui", com o botão "Ver todos" (que enquadra todos os pins).
- [ ] Distância por Haversine, calculada no front.

**US-10 — Controles do mapa**
- [ ] Botões flutuantes no canto inferior direito: Minha localização, Zoom +, Zoom −, Ver todos os pontos.
- [ ] No desktop, quando o painel está aberto, os controles deslizam para a esquerda e não ficam escondidos. No mobile, somem enquanto o sheet estiver aberto.

### Administração

**US-11 — Proteger a área administrativa**
- [ ] Todo o namespace `/admin` exige HTTP Basic com `ADMIN_USER`/`ADMIN_PASSWORD` (ENV). Em development, os padrões são `admin`/`admin`.
- [ ] A autenticação fica **num único lugar**: `Admin::BaseController < ApplicationController`, com `before_action :authenticate_admin!` (método privado que chama `authenticate_or_request_with_http_basic` e compara com `ActiveSupport::SecurityUtils.secure_compare`). Todos os controllers do admin herdam dele. Isso permite trocar por OAuth depois mexendo só nesse método.
- [ ] Em produção, se `ADMIN_PASSWORD` não estiver definida, o admin responde 503 (nunca usar uma senha padrão em produção).

**US-12 — Listar pontos**
- [ ] `/admin` lista os places: nome, tipo, bairro/cidade, número de materiais, ativo (sim/não) e ações Editar e Excluir.
- [ ] Botão "Novo ponto". Link "Ver mapa" para `/`.

**US-13 — Cadastrar ponto em um único formulário**
*Como administrador, quero cadastrar tudo de um ponto numa tela só.*
- [ ] O formulário tem, nesta ordem:
  1. **Dados:** tipo (select com os rótulos pt-BR), nome, descrição, ativo.
  2. **Endereço:** rua, número, complemento, bairro, cidade, UF (select com as 27), CEP. Mais um **mini-mapa Leaflet**: clicar no mapa preenche latitude/longitude (campos visíveis e editáveis) e posiciona um marcador arrastável. Em edição, o mapa abre já no ponto salvo.
  3. **Materiais aceitos:** checkboxes de todos os `Material` (`material_ids: []`).
  4. **Horários:** linhas com dia da semana (select Domingo..Sábado), abre às (`time_field`), fecha às, e remover. Botão "+ Adicionar horário". Atalho "Seg–Sex 08:00–18:00" que cria 5 linhas.
  5. **Contatos:** linhas com tipo (select) e valor, mais remover. Botão "+ Adicionar contato".
- [ ] Linhas dinâmicas com um Stimulus controller `nested-form`, usando `<template>` e a substituição de `NEW_RECORD` por timestamp. Remover marca `_destroy=1` e esconde a linha.
- [ ] Ao salvar com erro: re-renderiza com status 422, mostra os erros no topo e ao lado de cada campo, e **preserva tudo o que foi digitado**, inclusive as linhas dinâmicas.
- [ ] Ao salvar com sucesso: redireciona para `/admin` com o flash "Ponto salvo com sucesso.".

**US-14 — Editar e excluir**
- [ ] Editar usa o mesmo formulário. Excluir pede confirmação (`data-turbo-confirm`) e apaga em cascata.

---

## 7. Contrato do JSON (`GET /places.json`)

```json
[
  {
    "id": 1,
    "name": "Ecoponto Bem-te-vi",
    "kind": "ecopoint",
    "kind_label": "Ecoponto",
    "description": "…",
    "lat": -23.585,
    "lng": -46.637,
    "address": {
      "street": "Rua das Embaúbas", "number": "480", "complement": null,
      "neighborhood": "Vila Mariana", "city": "São Paulo", "state": "SP",
      "zip_code": "04101-000", "full": "Rua das Embaúbas, 480 – Vila Mariana, São Paulo – SP, 04101-000"
    },
    "materials": [{ "key": "rubble", "name": "Entulho" }],
    "opening_hours": [{ "weekday": 1, "opens_at": "06:00", "closes_at": "22:00" }],
    "contacts": [{ "kind": "phone", "value": "+551100000101", "display": "(11) 0000-0101", "href": "tel:+551100000101" }]
  }
]
```

- Implementar com `Place#as_map_json` (método no model) e, no controller, `render json: Place.active.includes(:address, :materials, :opening_hours, :contacts).map(&:as_map_json)`. **Obrigatório usar `includes`** para evitar N+1.
- `opening_hours` ordenados por `weekday`, depois por `opens_at`. Horários formatados como `"HH:MM"`.

---

## 8. Front-end do mapa (onde fica cada coisa)

- `app/views/layouts/application.html.erb`: Manrope, Leaflet CSS/JS (unpkg), meta viewport com `viewport-fit=cover`.
- `app/views/map/index.html.erb`: o markup de `prototype-src/index.html` (topbar, busca, controles, painel, toast, faixa "nearby"), **sem** o diálogo "Sobre" e **sem** o chip "Dados demonstrativos".
- `app/javascript/controllers/map_controller.js` (Stimulus, `data-controller="map"` no `<body>` ou num wrapper), com `data-map-url-value="/places.json"`.
  - Porte de `prototype-src/app.js`, organizado nos mesmos blocos: ícones, utilitários (`openStatus`, `haversineKm`, `copyText`), `Geocoder` (Nominatim/ViaCEP), MapView, SearchUI, PanelUI, Nearby, Toast.
  - Pode ser um único arquivo grande ou ser dividido em `app/javascript/lib/*.js` com pin no importmap. O que for mais rápido e funcionar.
  - **Tiles:** `L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' })`.
  - Remover do porte: o `window.GEO`, os layers de distritos/municípios/estados, os rótulos e o `LocalGeocoder`.
- `app/javascript/controllers/location_picker_controller.js`: o mini-mapa do formulário admin.
- `app/javascript/controllers/nested_form_controller.js`: as linhas dinâmicas.
- CSS: copiar `prototype-src/app.css` para `application.css`, e acrescentar estilos simples para o admin (tabela, formulário em cards, botões já existentes `.btn-primary`/`.btn-secondary`/`.btn-ghost`).

---

## 9. Seeds

`db/seeds.rb` contém **apenas os 10 materials** da seção 4.5, idempotentes (`find_or_create_by!(key:)`, atualizando o `name` se mudar).
**Não** criar seeds de places: os pontos são cadastrados pelo admin. O array `ECOPONTOS_SEED` de `prototype-src/data.js` serve só como exemplo de dados realistas para preencher o formulário.

Nos testes, use fixtures (`test/fixtures/*.yml`) para materials e para pelo menos 2 places completos (um ativo e um inativo), com address, opening_hours e contacts.

---

## 10. Ordem de execução

1. Criar o app Rails (comando da seção 2), adicionar as gems `rails-i18n` e `dotenv-rails`, configurar `database.yml`, `.env.example`, o fuso e o locale `pt-BR` padrão (`config.i18n.default_locale = :"pt-BR"`). `bin/rails db:create`.
2. Migrations (seção 4) com FKs, índices e CHECKs. `bin/rails db:migrate`.
3. Models com associações, enums, normalizações e validações.
4. Testes de model (seção 11). Rodar e passar **antes** de seguir.
5. Seeds (só materials). `bin/rails db:seed` precisa rodar duas vezes sem erro e sem duplicar dados.
6. `PlacesController#index` (JSON) + `MapController#index` + a view do mapa + CSS + o `map_controller.js` portado do protótipo.
7. Admin: `Admin::BaseController` (auth), `Admin::PlacesController`, form com nested attributes, os dois Stimulus controllers e a index.
8. Testes de request.
9. Dockerfile, `bin/docker-entrypoint`, `.dockerignore` e o ajuste de `force_ssl` (seção 2.2).
10. Rodar a checagem final (seção 11).
11. Escrever um `README.md` curto: como rodar local e com Docker, as variáveis de ambiente, as decisões (PostgreSQL via ENV, Nominatim, sem React, HTTP Basic no admin) e as limitações conhecidas.

---

## 11. Testes e checagem final

### Model tests (obrigatórios)
- `Place`: inválido sem nome, sem endereço ou sem materiais; `kind` inválido levanta erro ou fica inválido; horários sobrepostos no mesmo dia → inválido; intervalos separados no mesmo dia → válido; save com um filho inválido não grava nada (contagem de `Place` inalterada).
- `Address`: CEP `"04101-000"` vira `"04101000"`; CEP com 7 dígitos → inválido; UF `"sp"` vira `"SP"`; UF `"XX"` → inválida; latitude 95 → inválida.
- `Contact`: phone `"(11) 3333-4444"` → `"+551133334444"` e `display_value == "(11) 3333-4444"`; whatsapp fixo `"(11) 3333-4444"` → inválido; email `" A@B.COM "` → `"a@b.com"`; website `"exemplo.org"` → `"https://exemplo.org"`; website `"ftp://x"` → inválido; duplicata no mesmo place → inválida.
- `OpeningHour`: `closes_at == opens_at` → inválido; `closes_at < opens_at` → inválido; weekday 7 → inválido.

### Request tests (obrigatórios)
- `GET /` → 200 e contém `data-controller="map"`.
- `GET /places.json` → 200, só places ativos (fixture inativa não aparece), com as chaves do contrato da seção 7.
- `GET /admin/places` sem credenciais → 401; com credenciais → 200.
- `POST /admin/places` válido com nested attributes (endereço, 2 horários, 1 contato e 2 material_ids) → cria tudo e redireciona.
- `POST /admin/places` inválido → 422 e nada é criado.

### Checagem final (tudo precisa passar)
```bash
cp .env.example .env         # ajustar DB_* para o Postgres disponível; RAILS_ENV=development para rodar local
bin/rails db:drop db:create db:migrate db:seed
bin/rails db:seed            # segunda vez, sem erro e sem duplicar
bin/rails test
bin/rails runner 'puts Material.count'   # 10
bin/rails server             # abrir / e /admin manualmente
docker build -t onde-descartar .
docker run --rm -p 3000:3000 --env-file .env onde-descartar   # com RAILS_ENV=production no .env
```
Checklist manual rápido: em `/admin`, cadastrar 2 pontos (use dados de `prototype-src/data.js`), marcando a posição no mini-mapa → em `/`, o mapa mostra os 2 pins → clicar num pin abre o painel → "Como chegar" abre o Google Maps → "Compartilhar" copia → buscar "Avenida Paulista" e "01310-100" move o mapa → o mesmo fluxo funciona com o app rodando no container.

---

## 12. Restrições (não fazer)

- Não implementar login ou cadastro de usuários finais, filtros, dashboard nem landing page.
- Não adicionar gems além de `rails-i18n` sem necessidade real.
- Não criar service objects, form objects ou concerns para o que cabe no model.
- Não calcular o status "aberto/fechado" no servidor.
- Não copiar o `window.GEO` (mapa-base offline) do protótipo para o app.
- Não usar `type`, `from` nem `to` como nomes de coluna.
- Não criar docker-compose nem um container de banco: o Postgres é externo, configurado via `.env`.
- Não criar seeds de places.
- Não versionar `.env` (apenas `.env.example`).
