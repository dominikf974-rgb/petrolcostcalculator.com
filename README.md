# Spritkosten-Check (Fuel Cost Calculator)

## Australia Setup
- UI in Australian English, currency AUD ($), map centered on Australia.
- Fuel types: U91, E10, P95, P98, Diesel with Aussie fallback prices.
- Tolls: includes AU rate; map/geocoding use en-AU locale.

## Live fuel prices (WA)
- The proxy [server/server.js](server/server.js) fetches live averages from FuelWatch when coordinates are in Western Australia; otherwise it falls back to static AU averages.
- Endpoint: `http://localhost:3000/prices?lat=<lat>&lng=<lng>&rad=100` returning `{ averages: { u91,e10,p95,p98,diesel }, currency: 'AUD' }`.

## Run the proxy (optional)
Requires Node.js 18+.

```powershell
Push-Location server
npm install
npm start
Pop-Location
```

## Frontend
- Main page: [index.html](index.html) (no build step, open directly or serve statically).

## Notes
- NSW FuelCheck or other state feeds can be added later if an API key is available.
