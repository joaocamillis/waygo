# Setup Geoapify para WayGo

## Backend

### 1. Obter chave API Geoapify

1. Acesse [geoapify.com](https://www.geoapify.com)
2. Crie uma conta (plano gratuito disponível)
3. Gere uma API key no dashboard
4. A chave permite autocomplete, reverse geocoding e routing

### 2. Configurar variável de ambiente

Adicione `GEOAPIFY_API_KEY` ao `.env` no backend:

```
GEOAPIFY_API_KEY=sua_chave_aqui
```

### 3. Testar rotas

Após iniciar o backend (`npm run dev`), teste as rotas:

**Autocomplete:**
```bash
curl "http://localhost:3333/places/autocomplete?input=etec&lat=-23.55&lng=-46.63" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Reverse Geocoding:**
```bash
curl "http://localhost:3333/places/reverse?lat=-23.55&lng=-46.63" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Routing (Car):**
```bash
curl "http://localhost:3333/places/route?originLat=-23.55&originLng=-46.63&destinationLat=-23.54&destinationLng=-46.61" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Mobile

### 1. Dependências instaladas

- `expo-location` (já estava)
- `react-native-maps` (instalado)
- `axios` (já estava)

### 2. Variáveis de ambiente

Confirme que `EXPO_PUBLIC_API_BASE_URL` aponta para seu backend (incluindo URL do Render em produção):

```env
EXPO_PUBLIC_API_BASE_URL=http://seu-backend.onrender.com
```

### 3. Fluxo de uso

1. **Ao abrir HomeScreen:**
   - App pede permissão de localização
   - Obtém GPS atual
   - Chama `GET /places/reverse` para obter endereço
   - Preenche campo "Origem" automaticamente

2. **Digitar destino:**
   - Usuário digita no campo "Destino"
   - Com 2+ caracteres e após 400ms (debounce), app chama `GET /places/autocomplete`
   - Mostra sugestões (histórico + Geoapify)
   - Usuário seleciona sugestão

3. **Clicar "Comparar corridas":**
   - Chama `GET /places/route` para obter distância e duração reais
   - Salva busca via `POST /rides/searches`
   - Navega para ResultsScreen com dados da rota

4. **Mapa:**
   - Mostra marcador de origem (verde)
   - Mostra marcador de destino (vermelho)
   - Desenha rota (azul) entre os dois pontos
   - Rota pode ser a geometry da Geoapify ou linha reta (fallback)

## Recursos Implementados

### Backend

- **geoapifyService.ts**: Wrapper para APIs Geoapify
  - `autocomplete()`: Busca de endereços com bias de proximidade
  - `reverseGeocode()`: Geocodificação reversa
  - `routing()`: Cálculo de rota para carros
- **placeSuggestionService.ts**: Combina histórico do usuário com Geoapify
  - Prioriza destinos recentes do usuário
  - Limita a 8 sugestões totais
- **placesController.ts**: Rotas HTTP
- **placesRoutes.ts**: Integração com middleware de autenticação

### Mobile

- **PlaceAutocompleteInput.tsx**: Componente de entrada inteligente
  - Debounce de 400ms
  - Mostra sugestões com indicador de fonte (Recente/Sugestão)
  - Selecionar preenche latitude/longitude automaticamente
- **MapView.tsx**: Componente de mapa
  - Centraliza automaticamente em origem/destino
  - Mostra marcadores coloridos
  - Desenha polyline da rota
- **HomeScreen.tsx**: Tela principal atualizada
  - Dois campos de autocomplete (origem e destino)
  - Mapa em tempo real
  - Exibe distância/duração calculadas
  - Botão "Comparar corridas" (habilitado apenas com origem e destino)
- **locationService.ts**: Atualizado
  - `getReverseGeocode()`: Integração com API backend
  - `getRoute()`: Chamada a API backend de routing
- **routeService.ts**: Atualizado
  - Tenta Geoapify via backend
  - Fallback para Haversine local

## Plano gratuito Geoapify

- Até 3000 requisições/dia
- Autocomplete, reverse geocoding e routing incluídos
- Ideal para desenvolvimento e pequenas aplicações

## Próximas melhorias

- Cache de buscas frequentes
- Modo offline com cache local
