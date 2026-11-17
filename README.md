# OndeDescartar

Mapa público de pontos de descarte (ecopontos, cooperativas, PEVs e pontos em comércios), com uma área administrativa simples para cadastrar os pontos.

- `/`: mapa em tela cheia com pins, painel de detalhes, status "aberto agora", rota, compartilhamento, busca de endereço/CEP e o ponto mais próximo.
- `/admin`: CRUD de pontos (HTTP Basic), com endereço, mini-mapa, materiais, horários e contatos num único formulário.
- `/places.json`: pontos ativos, consumidos pelo mapa.

## Rodando localmente

Requisitos: Ruby 3.4 e um PostgreSQL acessível.

```bash
cp .env.example .env      # ajuste DB_* e use RAILS_ENV=development
bundle install
bin/rails db:prepare db:seed
bin/rails server          # http://localhost:3000 e http://localhost:3000/admin
bin/rails test
```

Em development e test, o admin usa `admin`/`admin` se `ADMIN_USER`/`ADMIN_PASSWORD` não estiverem definidas.

## Rodando com Docker Compose (app + Postgres)

O `compose.yml` sobe um Postgres próprio (`db`, com volume `pgdata`) e o app (`web`, construído pelo `Dockerfile`), lendo o `.env`:

```bash
cp .env.example .env
docker compose up -d --build   # app em http://localhost:${APP_PORT:-3000}
```

O `web` roda sempre em `RAILS_ENV=production`, com `DB_HOST=db`. O Postgres fica publicado em `127.0.0.1:${DB_PORT}`, então o mesmo banco serve para rodar `bin/rails server` e `bin/rails test` localmente (`DB_HOST=localhost`). Se as portas 3000 ou 5432 já estiverem em uso, troque `APP_PORT` e `DB_PORT` no `.env`.

## Rodando só o Dockerfile (Postgres externo)

O `Dockerfile` é o de produção gerado pelo Rails 8 e também funciona sozinho, com um Postgres externo:

```bash
docker build -t onde-descartar .
docker run --rm -p 3000:3000 --env-file .env onde-descartar
```

No `.env` usado pelo container, defina `RAILS_ENV=production` e um `SECRET_KEY_BASE` real (`bin/rails secret`). Ao subir, o entrypoint roda `db:prepare` (cria e migra) e `db:seed` (idempotente, só materiais).

Se o Postgres estiver na própria máquina (fora do Docker), use `DB_HOST=host.docker.internal` e, no Linux, acrescente `--add-host=host.docker.internal:host-gateway`:

```bash
docker run --rm -p 3000:3000 --env-file .env --add-host=host.docker.internal:host-gateway onde-descartar
```

O Postgres precisa aceitar conexões vindas da rede do Docker. Um Postgres publicado só em `127.0.0.1` não é alcançável pelo container.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` | Conexão com o PostgreSQL |
| `DB_NAME` | Nome do banco em produção. Em dev e test, recebe o sufixo `_development`/`_test` |
| `RAILS_ENV` | `development` localmente, `production` no container |
| `SECRET_KEY_BASE` | Obrigatória em produção. O app não usa `RAILS_MASTER_KEY`/credentials |
| `FORCE_SSL` | `true` liga `force_ssl`/`assume_ssl`. Deixe `false` para rodar em `http://localhost` |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Credenciais do admin. Em produção, sem `ADMIN_PASSWORD` o admin responde 503 |

## Decisões

- **PostgreSQL só via ENV**: o `config/database.yml` lê `DB_*`, sem `DATABASE_URL`. O mesmo `.env` serve para rodar local (via `dotenv-rails`) e para `docker run --env-file`.
- **Rails clássico, sem React e sem build de JS**: Importmap + Stimulus. O mapa (`map_controller.js`) é um porte do protótipo em `prototype-src/`.
- **Leaflet + tiles do OpenStreetMap**, carregados do unpkg.
- **Busca com Nominatim** (e ViaCEP para CEPs), chamada do navegador e isolada na classe `Geocoder`, para facilitar a troca de provedor. Debounce de 600 ms e cancelamento da requisição anterior, respeitando a política de uso do Nominatim.
- **Status "aberto agora" calculado no front**, no fuso `America/Sao_Paulo`. Os horários são guardados como horário "de relógio" (`time`, sem conversão de fuso).
- **Integridade no banco e no model**: FKs com cascade, índices únicos, NOT NULL e CHECKs (`closes_at > opens_at`, `weekday` 0..6, CEP com 8 dígitos, faixas de lat/lng). O lugar e todos os filhos são gravados numa única transação.
- **Contatos normalizados** (telefone em `+55...`, e-mail minúsculo, site com `https://`) e formatados só na exibição.
- **Admin com HTTP Basic** concentrado em `Admin::BaseController#authenticate_admin!`, para ser trocado por outro mecanismo depois.

## Limitações conhecidas

- Não há suporte a horários que viram a noite (ex.: 22h–02h).
- Sem filtros por material/tipo, contas de usuário, avaliações ou favoritos (fora do escopo do MVP).
- A busca depende da disponibilidade do Nominatim/ViaCEP, que são serviços públicos com limite de uso.
- O admin não geocodifica o endereço automaticamente: a posição é marcada no mini-mapa.
