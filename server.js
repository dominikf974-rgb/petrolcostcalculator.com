const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Rough AU bounding box
function isInAustralia(lat, lng){
  return lat <= -10 && lat >= -44 && lng >= 113 && lng <= 154;
}

// Rough Western Australia bounding box
function isInWA(lat, lng){
  return lat <= -13 && lat >= -36 && lng >= 112 && lng <= 129;
}

// Static Aussie averages (AUD) — adjust as needed
const AU_DEFAULTS = { u91: 2.02, e10: 1.98, p95: 2.18, p98: 2.30, diesel: 2.05 };

// Map product to FuelWatch product codes
const FUELWATCH_CODES = { u91: 1, e10: 11, p95: 2, p98: 6, diesel: 4 };

async function fetchFuelWatchAverage(productCode){
  const url = `https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS?format=json&Product=${productCode}&Day=today`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' }});
  if(!res.ok) throw new Error(`FuelWatch HTTP ${res.status}`);
  const data = await res.json();
  if(!data || !Array.isArray(data.response)) throw new Error('FuelWatch response malformed');
  const prices = data.response
    .map(item => parseFloat(item.price))
    .filter(v => Number.isFinite(v));
  if(!prices.length) throw new Error('FuelWatch no prices');
  const avg = prices.reduce((a,b)=>a+b,0) / prices.length;
  return Math.round(avg * 1000) / 1000; // 0.001 precision
}

async function getAuAverages(lat, lng){
  const inWA = isInWA(lat, lng);
  if(!inWA) return { ...AU_DEFAULTS, source: 'fallback' };

  try{
    const entries = await Promise.all(Object.entries(FUELWATCH_CODES).map(async ([key, code]) => {
      const v = await fetchFuelWatchAverage(code);
      return [key, v];
    }));
    const averages = Object.fromEntries(entries);
    return { ...averages, source: 'fuelwatch' };
  }catch(err){
    console.warn('FuelWatch failed, using fallback', err.message);
    return { ...AU_DEFAULTS, source: 'fallback' };
  }
}

app.get('/prices', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const rad = parseFloat(req.query.rad) || 100;

  // For AU: live WA (FuelWatch) if in WA, else fallback AU averages. Outside AU: fallback.
  const inAU = Number.isFinite(lat) && Number.isFinite(lng) && isInAustralia(lat, lng);
  const averages = inAU ? await getAuAverages(lat, lng) : { ...AU_DEFAULTS, source: 'fallback' };

  res.json({
    ok: true,
    area: { lat, lng, rad, inAU },
    currency: 'AUD',
    averages
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fuel price proxy listening on http://localhost:${PORT}`);
});
