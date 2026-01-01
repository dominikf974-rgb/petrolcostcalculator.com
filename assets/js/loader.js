async function loadPartial(selector, file) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(file, { cache: "no-cache" });
  el.innerHTML = await res.text();
}

function initApp() {
  const MAPBOX_API_KEY = ''; // optional

  // Tabs
  const tabButtons = document.querySelectorAll('.tabs [role="tab"]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.setAttribute('aria-selected','false'));
      btn.setAttribute('aria-selected','true');

      const target = btn.dataset.target;
      document.querySelectorAll('main > section').forEach(s => {
        const active = (s.id === target);
        s.style.display = active ? '' : 'none';
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      // ✅ Leaflet resize fix after show/hide
      if(target === 'fuel'){
        setTimeout(() => { try{ map.invalidateSize(); }catch(e){} }, 60);
      }
    });
  });

  const parse = v => (v === '' || v == null) ? NaN : Number(String(v).replace(',', '.'));
  const fmt = n => (Number.isFinite(n) ? Number.parseFloat(n.toFixed(2)).toFixed(2) : '0.00');

  // DOM
  const kmEl = document.getElementById('km');
  const consumptionEl = document.getElementById('consumption');
  const priceEl = document.getElementById('price');
  const passengersEl = document.getElementById('passengers');
  const fuelTypeEl = document.getElementById('fuel-type');

  const litersEl = document.getElementById('liters');
  const costFuelEl = document.getElementById('cost-fuel');
  const costRunningEl = document.getElementById('cost-running');
  const costTotalEl = document.getElementById('cost-total');
  const costPersonEl = document.getElementById('cost-person');
  const avg100El = document.getElementById('avg100');
  const runningEstEl = document.getElementById('running-est');

  const avgUnleaded91El = document.getElementById('avg-unleaded91');
  const avgUnleaded95El = document.getElementById('avg-unleaded95');
  const avgDieselEl = document.getElementById('avg-diesel');
  const tollInfoEl = document.getElementById('toll-info');
  const priceInfoEl = document.getElementById('price-info');
  const placeFromEl = document.getElementById('place-from');
  const placeToEl = document.getElementById('place-to');

  // Default prices (USD/L)
  const countryDefaultPriceUSD = {
    AU: { unleaded91:1.30, unleaded95:1.40, diesel:1.35, name:'Australia' },
    NZ: { unleaded91:1.80, unleaded95:1.90, diesel:1.70, name:'New Zealand' },
    US: { unleaded91:1.05, unleaded95:1.15, diesel:1.20, name:'United States' },
    CA: { unleaded91:1.30, unleaded95:1.40, diesel:1.35, name:'Canada' },
    GB: { unleaded91:2.00, unleaded95:2.10, diesel:2.05, name:'United Kingdom' },
    IE: { unleaded91:1.95, unleaded95:2.05, diesel:1.95, name:'Ireland' },
    DE: { unleaded91:1.90, unleaded95:2.00, diesel:1.85, name:'Germany' },
    AT: { unleaded91:1.85, unleaded95:1.95, diesel:1.80, name:'Austria' },
    CH: { unleaded91:2.10, unleaded95:2.20, diesel:2.05, name:'Switzerland' },
    FR: { unleaded91:1.95, unleaded95:2.05, diesel:1.90, name:'France' },
    ES: { unleaded91:1.75, unleaded95:1.85, diesel:1.75, name:'Spain' },
    IT: { unleaded91:1.95, unleaded95:2.05, diesel:1.90, name:'Italy' },
    NL: { unleaded91:2.05, unleaded95:2.15, diesel:1.95, name:'Netherlands' },
    BE: { unleaded91:1.95, unleaded95:2.05, diesel:1.90, name:'Belgium' },
    SE: { unleaded91:2.10, unleaded95:2.20, diesel:2.05, name:'Sweden' },
    NO: { unleaded91:2.30, unleaded95:2.40, diesel:2.20, name:'Norway' },
    DK: { unleaded91:2.05, unleaded95:2.15, diesel:1.95, name:'Denmark' },
    FI: { unleaded91:2.00, unleaded95:2.10, diesel:1.95, name:'Finland' },
    JP: { unleaded91:1.80, unleaded95:1.90, diesel:1.70, name:'Japan' },
    KR: { unleaded91:1.85, unleaded95:1.95, diesel:1.75, name:'South Korea' },
    SG: { unleaded91:2.30, unleaded95:2.40, diesel:2.20, name:'Singapore' },
    TH: { unleaded91:1.20, unleaded95:1.30, diesel:1.15, name:'Thailand' },
    IN: { unleaded91:1.10, unleaded95:1.20, diesel:1.05, name:'India' },
    MX: { unleaded91:1.20, unleaded95:1.30, diesel:1.15, name:'Mexico' },
    BR: { unleaded91:1.25, unleaded95:1.35, diesel:1.20, name:'Brazil' }
  };

  const fallbackPrices = { unleaded91:1.50, unleaded95:1.60, diesel:1.45 };
  let fuelPrices = { ...fallbackPrices };
  let userEditedPrice = false;

  function renderAvgPrices(){
    avgUnleaded91El.textContent = '$' + fmt(fuelPrices.unleaded91);
    avgUnleaded95El.textContent = '$' + fmt(fuelPrices.unleaded95);
    avgDieselEl.textContent = '$' + fmt(fuelPrices.diesel);
  }
  renderAvgPrices();

  function applyCountryDefaults(countryCode){
    const code = (countryCode || '').toUpperCase();
    const prices = countryDefaultPriceUSD[code];
    if(!prices) return false;

    fuelPrices = { unleaded91: prices.unleaded91, unleaded95: prices.unleaded95, diesel: prices.diesel };
    renderAvgPrices();

    if(!userEditedPrice){
      const t = fuelTypeEl.value;
      priceEl.value = fuelPrices[t] ?? '';
      priceInfoEl.textContent = `Detected ${prices.name}. Default price set ($/L). You can edit it.`;
      priceInfoEl.classList.remove('error');
    }
    return true;
  }

  fuelTypeEl.addEventListener('change', () => {
    if(!userEditedPrice){
      priceEl.value = fuelPrices[fuelTypeEl.value] ?? '';
    }
  });

  priceEl.addEventListener('input', () => {
    userEditedPrice = true;
    priceInfoEl.textContent = '';
    priceInfoEl.classList.remove('error');
  });

  document.getElementById('btn-reset-price').addEventListener('click', () => {
    userEditedPrice = false;
    const t = fuelTypeEl.value;
    priceEl.value = fuelPrices[t] ?? '';
    priceInfoEl.textContent = 'Reset to detected default price.';
    priceInfoEl.classList.remove('error');
  });

  // Map (Leaflet muss vorher geladen sein!)
  const map = L.map('map', { attributionControl:true }).setView([-25.2744, 133.7751], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19,
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);

  let markers = [];
  function clearMarkers(){ markers.forEach(m=>map.removeLayer(m)); markers=[]; }
  function addMarker(lat, lon, label){
    const m = L.marker([lat, lon]).addTo(map).bindPopup(label || '');
    markers.push(m);
    return m;
  }

  function haversineKm(lat1, lon1, lat2, lon2){
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  async function geocode(q){
    if(MAPBOX_API_KEY){
      try{
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${encodeURIComponent(MAPBOX_API_KEY)}&limit=1&language=en`;
        const res = await fetch(url);
        if(res.ok){
          const data = await res.json();
          if(data?.features?.length){
            const f = data.features[0];
            return { lat:f.center[1], lon:f.center[0], name:f.place_name };
          }
        }
      }catch(e){}
    }
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
    const res = await fetch(url, { headers:{ 'Accept-Language':'en' }});
    if(!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if(data?.length) return { lat:+data[0].lat, lon:+data[0].lon, name:data[0].display_name };
    return null;
  }

  async function reverseCountryCode(lat, lon){
    try{
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      const res = await fetch(url, { headers:{ 'Accept-Language':'en' }});
      if(!res.ok) return null;
      const j = await res.json();
      const cc = j?.address?.country_code ? String(j.address.country_code).toUpperCase() : null;
      return cc;
    }catch(e){
      return null;
    }
  }

  // Toll estimates
  const tollPer100km = {
    AU:5, NZ:3, JP:12, KR:10, SG:15, TH:3, IN:2, CN:4,
    DE:0, FR:12, IT:10, ES:15, US:3, GB:0, CA:3
  };

  async function estimateTollsSimple(ccA, ccB, distKm){
    const a = tollPer100km[ccA] ?? 5;
    const b = tollPer100km[ccB] ?? a;
    const rate = (ccA === ccB) ? a : (a + b) / 2;
    const total = (distKm / 100) * rate;
    return { totalCost: Math.round(total*100)/100, ratePer100: Math.round(rate*100)/100 };
  }

  let estimatedTollPer100 = 0;

  // Detect defaults while typing
  let detectTimer = null;
  placeFromEl.addEventListener('input', () => {
    clearTimeout(detectTimer);
    detectTimer = setTimeout(async () => {
      const txt = placeFromEl.value.trim();
      if(!txt) return;
      try{
        const a = await geocode(txt);
        if(!a) return;
        const cc = await reverseCountryCode(a.lat, a.lon);
        if(cc) applyCountryDefaults(cc);
      }catch(e){}
    }, 600);
  });

  document.getElementById('btn-geocode').addEventListener('click', async () => {
    const from = placeFromEl.value.trim();
    const to = placeToEl.value.trim();
    if(!from || !to){
      tollInfoEl.textContent = 'Please enter start and destination.';
      tollInfoEl.classList.add('error');
      return;
    }
    try{
      const a = await geocode(from);
      const b = await geocode(to);
      if(!a || !b){
        tollInfoEl.textContent = 'Location not found. Please be more specific.';
        tollInfoEl.classList.add('error');
        return;
      }

      const ccA = await reverseCountryCode(a.lat, a.lon);
      if(ccA) applyCountryDefaults(ccA);

      clearMarkers();
      addMarker(a.lat,a.lon,'Start: ' + a.name);
      addMarker(b.lat,b.lon,'Destination: ' + b.name);
      map.fitBounds([[a.lat,a.lon],[b.lat,b.lon]], { padding:[60,60] });

      const dist = haversineKm(a.lat,a.lon,b.lat,b.lon);
      kmEl.value = Math.round(dist*10)/10;

      tollInfoEl.textContent = 'Estimating tolls…';
      tollInfoEl.classList.remove('error');

      const ccB = await reverseCountryCode(b.lat, b.lon);
      const toll = await estimateTollsSimple(ccA || 'XX', ccB || ccA || 'XX', dist);
      estimatedTollPer100 = +(toll.totalCost / dist * 100).toFixed(2);

      tollInfoEl.textContent =
        `Tolls (estimated): $${fmt(toll.totalCost)} total — approx. $${fmt(estimatedTollPer100)} /100 km`;
    }catch(e){
      tollInfoEl.textContent = 'Error during geocoding or toll estimation. Check connection.';
      tollInfoEl.classList.add('error');
    }
  });

  document.getElementById('btn-clearmap').addEventListener('click', () => {
    clearMarkers();
    map.setView([-25.2744, 133.7751], 4);
    placeFromEl.value = '';
    placeToEl.value = '';
    tollInfoEl.textContent = '';
    tollInfoEl.classList.remove('error');
    estimatedTollPer100 = 0;
    setTimeout(() => { try{ map.invalidateSize(); }catch(e){} }, 60);
  });

  document.getElementById('km-inc').addEventListener('click', ()=>{ const cur = parse(kmEl.value)||0; kmEl.value = Math.round((cur+1)*10)/10; });
  document.getElementById('km-dec').addEventListener('click', ()=>{ const cur = parse(kmEl.value)||0; kmEl.value = Math.max(0, Math.round((cur-1)*10)/10); });

  function estimateRunningPer100(consumptionL100){
    if(!Number.isFinite(consumptionL100) || consumptionL100 <= 0) return 12.0;
    const est = 1.2 * consumptionL100 + 3.5;
    return Math.max(5, Math.min(30, Math.round(est * 10) / 10));
  }

  document.getElementById('calc-fuel').addEventListener('click', () => {
    const km = parse(kmEl.value);
    const v  = parse(consumptionEl.value);
    let p    = parse(priceEl.value);
    const passengers = Math.max(1, Math.floor(parse(passengersEl.value) || 1));

    if(!Number.isFinite(p)){
      p = (fuelPrices[fuelTypeEl.value] ?? NaN);
    }

    if(Number.isNaN(km) || km <= 0 || Number.isNaN(v) || Number.isNaN(p)){
      priceInfoEl.textContent = 'Please enter distance, consumption and price correctly.';
      priceInfoEl.classList.add('error');
      return;
    }
    priceInfoEl.textContent = '';
    priceInfoEl.classList.remove('error');

    const liters = (km * v) / 100;
    const costFuel = liters * p;

    const runningPer100Base = estimateRunningPer100(v);
    const runningPer100Total = runningPer100Base + (estimatedTollPer100 || 0);

    const costRunning = (km * runningPer100Total) / 100;
    const total = costFuel + costRunning;
    const perPerson = total / passengers;
    const avgPer100 = (total / km) * 100;

    litersEl.textContent = fmt(liters) + ' L';
    costFuelEl.textContent = '$' + fmt(costFuel);
    costRunningEl.textContent = '$' + fmt(costRunning);
    costTotalEl.textContent = '$' + fmt(total);
    costPersonEl.textContent = '$' + fmt(perPerson);
    avg100El.textContent = '$' + fmt(avgPer100) + ' /100km';
    runningEstEl.textContent = '$' + fmt(runningPer100Total) + ' /100km';
  });

  document.getElementById('reset-fuel').addEventListener('click', () => {
    kmEl.value = '';
    consumptionEl.value = '7.5';
    priceEl.value = '';
    passengersEl.value = 1;

    litersEl.textContent='0.00 L';
    costFuelEl.textContent='$0.00';
    costRunningEl.textContent='$0.00';
    costTotalEl.textContent='$0.00';
    costPersonEl.textContent='$0.00';
    avg100El.textContent='$0.00 /100km';
    runningEstEl.textContent='—';

    tollInfoEl.textContent='';
    tollInfoEl.classList.remove('error');
    estimatedTollPer100 = 0;

    priceInfoEl.textContent='';
    priceInfoEl.classList.remove('error');
    userEditedPrice = false;

    clearMarkers();
    map.setView([-25.2744, 133.7751],4);
    setTimeout(() => { try{ map.invalidateSize(); }catch(e){} }, 60);
  });

  // Calculator
  const num1 = document.getElementById('num1');
  const num2 = document.getElementById('num2');
  const result = document.getElementById('result');
  document.querySelectorAll('[data-op]').forEach(btn =>
    btn.addEventListener('click', () => {
      const a = parse(num1.value), b = parse(num2.value);
      if(Number.isNaN(a) || Number.isNaN(b)){ result.textContent = '–'; return; }
      let res;
      switch(btn.dataset.op){
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/': res = (b === 0 ? '∞' : a / b); break;
      }
      result.textContent = (typeof res === 'number') ? fmt(res) : res;
    })
  );

  // initial resize safety
  setTimeout(() => { try{ map.invalidateSize(); }catch(e){} }, 120);
}

// Boot: Partials laden, dann App starten
document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadPartial("#site-header", "partials/header.html"),
    loadPartial("#site-footer", "partials/footer.html"),
    loadPartial("#site-cookie", "partials/cookie.html"),
  ]);

  initApp();
});
