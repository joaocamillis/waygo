# WayGo — Backend

Backend em Node.js + Express + TypeScript para o projeto WayGo.

## Requisitos

- Node.js (18+ recomendado)
- npm
- Cliente `psql` (opcional, para rodar o `schema.sql`) ou usar o editor SQL do Neon

## Instalar dependências

No diretório `backend`:

```bash
cd backend
npm install
```

## Configurar o arquivo `.env`

Copie o arquivo de exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Exemplo mínimo (`.env`):

```env
PORT=3333
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require&channel_binding=require
JWT_SECRET=troque_essa_chave
```

Nunca comite o arquivo `.env` com segredos.

## Usar Neon PostgreSQL

1. Crie um projeto no Neon e gere a connection string para o branch desejado.
2. Copie a `DATABASE_URL` fornecida pelo Neon e cole em `.env`.
3. Assegure que a connection string inclua `sslmode=require` (ou adicione `?sslmode=require&channel_binding=require`). O backend já trata conexões SSL para Neon.

## Executar `database/schema.sql` no Neon

Opções:

- Usar o editor SQL do Neon: abra o Console do Neon → SQL Editor → cole o conteúdo de `database/schema.sql` e execute.

- Usar `psql` localmente (Linux/macOS):

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

No PowerShell (Windows):

```powershell
psql $env:DATABASE_URL -f database/schema.sql
```

Ou passar a connection string diretamente:

```bash
psql "postgresql://user:pass@host.neon.tech/dbname?sslmode=require&channel_binding=require" -f database/schema.sql
```

## Rodar backend em desenvolvimento

```bash
cd backend
npm install
cp .env.example .env    # editar .env
npm run dev
```

O servidor roda em `http://localhost:3333` (ou na porta informada em `.env`).

## Rotas disponíveis

- POST `/auth/register`
  - Descrição: cria novo usuário e retorna `{ user, token }`.
  - Body (JSON):

```json
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

- POST `/auth/login`
  - Descrição: autentica usuário e retorna `{ user, token }`.
  - Body (JSON):

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

- GET `/auth/me` (protegida)
  - Descrição: retorna os dados do usuário autenticado.
  - Header: `Authorization: Bearer <token>`

- POST `/rides/searches` (protegida)
  - Descrição: salva uma busca de corrida para o usuário.
  - Body (JSON):

```json
{
  "originLat": -23.55052,
  "originLng": -46.633308,
  "originAddress": "Localização atual",
  "destinationLat": -23.542,
  "destinationLng": -46.612,
  "destinationAddress": "Etec da Zona Leste",
  "distanceKm": 12.5,
  "durationMin": 28,
  "selectedProvider": null
}
```

- GET `/rides/searches` (protegida)
  - Descrição: lista o histórico de buscas do usuário autenticado.
  - Header: `Authorization: Bearer <token>`

## Exemplos rápidos (curl)

Registrar:

```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"123456"}'
```

Fazer login:

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

Usar rota protegida (substitua `<TOKEN>`):

```bash
curl http://localhost:3333/auth/me -H "Authorization: Bearer <TOKEN>"
```

Salvar busca (substitua `<TOKEN>`):

```bash
curl -X POST http://localhost:3333/rides/searches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"originLat":-23.55,"originLng":-46.63,"destinationLat":-23.54,"destinationLng":-46.61}'
```

## Testar com Insomnia / Postman

1. Inicie o backend (`npm run dev`).
2. Crie requisição POST para `/auth/login` e copie o `token` retornado.
3. Nas requisições protegidas, adicione header `Authorization: Bearer <token>`.
4. Você pode criar variáveis de ambiente no Insomnia/Postman para o `baseUrl` e para o `token`.

## Testar o mobile (dispositivo físico)

Ao testar o app em um dispositivo real, **use o IP local da sua máquina** (ex.: `http://192.168.0.100:3333`) em vez de `localhost`. Para emuladores:

- Android Emulator: `http://10.0.2.2:3333` (emulador padrão)
- iOS Simulator: `http://localhost:3333` normalmente funciona

## Observações

- Defina uma `JWT_SECRET` forte no `.env`.
- A conexão com Neon exige SSL; a configuração do pool já aceita `sslmode=require`.
- Não exponha segredos em repositórios públicos.

## Deploy no Render

1. **Criar conta no Render**: Acesse [render.com](https://render.com) e crie uma conta gratuita.

2. **Conectar repositório**: No dashboard do Render, clique em "New" → "Web Service" → "Connect GitHub" e selecione o repositório do WayGo backend.

3. **Configurar o serviço**:
   - **Name**: `waygo-backend` (ou similar)
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node 18+` (ou a versão que você usa)

4. **Variáveis de ambiente**:
   - Adicione as seguintes variáveis no painel "Environment" do Render:
     - `DATABASE_URL`: Sua connection string do Neon (com SSL)
     - `JWT_SECRET`: Uma chave secreta forte (gere uma nova para produção)
     - `PORT`: `10000` (Render usa essa porta por padrão, mas o código já usa `process.env.PORT || 3333`)

5. **Configurar banco de dados**:
   - Certifique-se de que o schema do banco está aplicado no Neon (execute `database/schema.sql` no console do Neon).

6. **Deploy**:
   - Clique em "Create Web Service". O Render fará o build e deploy automaticamente.
   - O backend ficará disponível em uma URL como `https://waygo-backend.onrender.com`.

7. **Verificar health check**:
   - Acesse `https://your-render-url.onrender.com/health` para verificar se o backend está rodando.

8. **Atualizar mobile**:
   - No app mobile, altere a `BASE_URL` para a URL do Render (ex.: `https://waygo-backend.onrender.com`).

**Notas importantes**:
- Render tem um plano gratuito com limitações (serviço dorme após inatividade).
- Para produção, considere um plano pago para uptime 24/7.
- Monitore logs no painel do Render para debug.

---

Se quiser, posso:
- rodar o backend agora (`npm run dev`) ou
- criar um script `build`/`start` adicional.
