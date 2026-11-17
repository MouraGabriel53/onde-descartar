/* =========================================================
   OndeDescartar — app
   Organização:
   1. Ícones            5. Mapa (MapView)
   2. Utilitários       6. Busca (SearchUI)
   3. Repositório       7. Painel (PanelUI)
   4. Geocodificador    8. Controles, toast e boot
   ========================================================= */
(function () {
'use strict';

/* ---------- 1. Ícones (traço 2px, estilo consistente) ---------- */
const P = {
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  locate:'<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  overview:'<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><circle cx="12" cy="12" r="2.5"/>',
  share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
  route:'<path d="M3 11 21 3l-8 18-2-8-8-2Z"/>',
  phone:'<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  whatsapp:'<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1L3.5 20.5Z"/><path d="M9 9.2c.2 1.6 2.2 4 4.6 4.7l1-1.2 1.8.9c-.3 1.2-1.2 1.7-2.2 1.6C11 14.8 8.6 12.4 8.3 9.9c-.1-1 .5-1.8 1.6-2.1l.9 1.8-1 .9"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  recycle:'<path d="m7 19-3.5-6L6 8.7M17 19l3.5-6L18 8.7M9.5 4.5h5L17 9M7 19h10M12 4.5 7 13M12 4.5 17 13"/>',
  building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3"/>',
  city:'<path d="M3 21h18M5 21V9l5-3v15M10 21V4l9 4v13M14 10h2M14 14h2M7 12h1M7 16h1"/>',
  map:'<path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4ZM9 4v13.5M15 6.5V20"/>',
  hash:'<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
  landmark:'<path d="M3 21h18M5 21V10M19 21V10M9.5 21V10M14.5 21V10M2 10l10-6 10 6"/>',
  road:'<path d="M5 21 9 3M19 21 15 3M12 5v2M12 11v2M12 17v2"/>',
  leaf:'<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19 13 11"/>',
  tag:'<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.5"/>',
  // materiais
  papel:'<path d="M4 8 12 4l8 4v9l-8 4-8-4V8Z"/><path d="m4 8 8 4 8-4M12 12v9"/>',
  plastico:'<path d="M10 2h4v3l1.5 2.5V20a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V7.5L10 5V2Z"/><path d="M8.5 12h7"/>',
  vidro:'<path d="M7 3h10l-1 7a4 4 0 0 1-8 0L7 3ZM12 14v7M8.5 21h7"/>',
  metal:'<ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14c0 1.1 2.7 2 6 2s6-.9 6-2V5"/><path d="M6 12c0 1.1 2.7 2 6 2s6-.9 6-2"/>',
  eletronicos:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  pilhas:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10.5v3M7 12h4M9 10v4"/>',
  oleo:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
  moveis:'<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3v-4ZM6 17v2M18 17v2"/>',
  entulho:'<path d="M3 20h18M4 20v-5h7v5M13 20v-5h7v5M7.5 15v-5h9v5"/>',
  especiais:'<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4M12 17h.01"/>',
};
const icon = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

/* Marca: pin de localização cujo "miolo" é uma folha */
const LOGO = `<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
  <path d="M24 3C14.3 3 6.5 10.6 6.5 20.1c0 12.6 15.3 24 16.4 24.8.7.5 1.5.5 2.2 0C26.2 44.1 41.5 32.7 41.5 20.1 41.5 10.6 33.7 3 24 3Z" fill="#1F5FD6"/>
  <circle cx="24" cy="20" r="11" fill="#FFFFFF"/>
  <path d="M17.2 26.6c-.6-7.9 4.4-13.4 13.8-13.6.5 9.2-5.2 14.6-13.8 13.6Z" fill="#18A06A"/>
  <path d="M17.6 26.2 25.6 18.4" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;
const WORDMARK = `<span class="wordmark"><span class="a">Onde</span><span class="b">Descartar</span></span>`;

/* ---------- 2. Utilitários ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const haversineKm = (a, b) => {
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const fmtKm = km => km < 1 ? `${Math.round(km * 1000 / 10) * 10} m` : `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`;
const DIAS = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const fmtHora = h => h.endsWith(':00') ? h.slice(0, 2).replace(/^0/, '') + 'h' : h.replace(':', 'h');

/** Hora atual no fuso do ecoponto (America/Sao_Paulo), independente do fuso do visitante */
function nowInSaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'));
  return { day, min: (+get('hour')) * 60 + (+get('minute')) };
}
const toMin = h => { const [a, b] = h.split(':'); return +a * 60 + +b; };

/** Status de funcionamento a partir da grade de horários */
function openStatus(horarios) {
  const { day, min } = nowInSaoPaulo();
  const today = horarios[day];
  if (today && min >= toMin(today[0]) && min < toMin(today[1])) {
    const left = toMin(today[1]) - min;
    return left <= 60
      ? { cls: 'soon', text: `Fecha em breve · às ${fmtHora(today[1])}` }
      : { cls: 'open', text: `Aberto agora · fecha às ${fmtHora(today[1])}` };
  }
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7, h = horarios[d];
    if (!h) continue;
    if (i === 0 && min >= toMin(h[0])) continue;
    const when = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DIAS[d].toLowerCase();
    return { cls: 'closed', text: `Fechado · abre ${when} às ${fmtHora(h[0])}` };
  }
  return { cls: 'closed', text: 'Fechado' };
}

const fullAddress = e => `${e.endereco}, ${e.numero} – ${e.bairro}, ${e.cidade} – ${e.estado}, ${e.cep}`;
const mapsLink = e => `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`;
const digits = s => s.replace(/\D/g, '');

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
    ta.remove(); return ok;
  }
}

/* ---------- 3. Repositório de ecopontos ----------
   Hoje lê os dados demonstrativos locais. Para integrar com o back-end,
   troque a implementação de list() por: fetch('/api/ecopontos').then(r => r.json())
   ---------------------------------------------------------------- */
const EcopontoRepository = {
  async list() { return window.ECOPONTOS_SEED; },
};

/* ---------- 4. Geocodificador ----------
   Interface: search(query) -> Promise<Array<{label, sub, type, lat, lng, zoom}>>
   Implementação local (gazetteer embutido), porque o ambiente de demonstração
   não permite chamadas a serviços externos. Em produção, substitua por um
   NominatimGeocoder / Google Places com a mesma interface.
   ---------------------------------------------------------------- */
const LocalGeocoder = (() => {
  const G = window.GEO;
  const UF_NAME = Object.fromEntries(G.states.map(s => [s[0], s[1]]));
  const CAPITAIS = { AC:'Rio Branco',AL:'Maceió',AP:'Macapá',AM:'Manaus',BA:'Salvador',CE:'Fortaleza',DF:'Brasília',ES:'Vitória',GO:'Goiânia',MA:'São Luís',MT:'Cuiabá',MS:'Campo Grande',MG:'Belo Horizonte',PA:'Belém',PB:'João Pessoa',PR:'Curitiba',PE:'Recife',PI:'Teresina',RJ:'Rio de Janeiro',RN:'Natal',RS:'Porto Alegre',RO:'Porto Velho',RR:'Boa Vista',SC:'Florianópolis',SP:'São Paulo',SE:'Aracaju',TO:'Palmas' };

  const entries = [];
  const add = (label, sub, type, lat, lng, zoom, boost = 0, extra = '') =>
    entries.push({ label, sub, type, lat, lng, zoom, boost, key: norm(label), alt: norm(extra) });

  // Logradouros e pontos de referência (coordenadas aproximadas)
  const SP = 'São Paulo – SP';
  [
    ['Avenida Paulista', -23.5614, -46.6559, 'road'], ['Rua Augusta', -23.5555, -46.6585, 'road'],
    ['Avenida Brigadeiro Faria Lima', -23.5795, -46.6880, 'road'], ['Avenida Rebouças', -23.5650, -46.6760, 'road'],
    ['Rua Oscar Freire', -23.5627, -46.6700, 'road'], ['Avenida Ipiranga', -23.5430, -46.6420, 'road'],
    ['Rua 25 de Março', -23.5425, -46.6320, 'road'], ['Avenida Sumaré', -23.5410, -46.6790, 'road'],
    ['Marginal Tietê', -23.5170, -46.6300, 'road'], ['Marginal Pinheiros', -23.5900, -46.6950, 'road'],
    ['Avenida Jabaquara', -23.6180, -46.6390, 'road'], ['Avenida Interlagos', -23.6800, -46.6810, 'road'],
    ['Avenida Radial Leste', -23.5440, -46.5800, 'road'], ['Avenida Cruzeiro do Sul', -23.5150, -46.6250, 'road'],
    ['Avenida Santo Amaro', -23.6120, -46.6720, 'road'], ['Avenida Engenheiro Luís Carlos Berrini', -23.6030, -46.6930, 'road'],
    ['Avenida Washington Luís', -23.6400, -46.6640, 'road'], ['Avenida do Estado', -23.5600, -46.6110, 'road'],
    ['Avenida Celso Garcia', -23.5360, -46.5850, 'road'], ['Avenida Aricanduva', -23.5600, -46.5100, 'road'],
    ['Avenida Sapopemba', -23.5900, -46.5250, 'road'], ['Avenida Consolação', -23.5520, -46.6510, 'road'],
    ['Avenida Francisco Morato', -23.5900, -46.7300, 'road'], ['Avenida Inajar de Souza', -23.4800, -46.6850, 'road'],
    ['Avenida Brasil', -23.5730, -46.6730, 'road'], ['Avenida Nove de Julho', -23.5600, -46.6600, 'road'],
    ['Parque Ibirapuera', -23.5874, -46.6576, 'landmark'], ['MASP – Museu de Arte de São Paulo', -23.5614, -46.6559, 'landmark', 'masp museu'],
    ['Estação da Luz', -23.5347, -46.6346, 'landmark'], ['Praça da Sé', -23.5503, -46.6339, 'landmark', 'catedral'],
    ['Mercado Municipal de São Paulo', -23.5417, -46.6295, 'landmark', 'mercadao'], ['Theatro Municipal', -23.5452, -46.6386, 'landmark', 'teatro'],
    ['Pinacoteca de São Paulo', -23.5341, -46.6337, 'landmark'], ['Memorial da América Latina', -23.5265, -46.6650, 'landmark'],
    ['Estádio do Morumbi', -23.6000, -46.7200, 'landmark', 'morumbis'], ['Allianz Parque', -23.5275, -46.6783, 'landmark'],
    ['Neo Química Arena', -23.5453, -46.4741, 'landmark', 'arena corinthians itaquerao'], ['Aeroporto de Congonhas', -23.6261, -46.6564, 'landmark'],
    ['Cidade Universitária – USP', -23.5613, -46.7307, 'landmark', 'usp universidade'], ['Parque Villa-Lobos', -23.5465, -46.7225, 'landmark'],
    ['Autódromo de Interlagos', -23.7036, -46.6997, 'landmark'], ['Parque do Carmo', -23.5800, -46.4750, 'landmark'],
    ['Aeroporto de Guarulhos', -23.4356, -46.4731, 'landmark', 'gru cumbica', 'Guarulhos – SP'],
  ].forEach(([n, lat, lng, t, alt, sub]) => add(n, sub || SP, t, lat, lng, t === 'road' ? 15 : 15, 3, alt || ''));

  // Distritos/bairros de São Paulo (dados reais de limites)
  Object.entries(G.dpts).forEach(([n, [lat, lng]]) => add(n, 'Bairro · São Paulo – SP', 'district', lat, lng, 14, 2));

  // Municípios brasileiros (IBGE)
  G.cities.split('~').forEach(row => {
    const [n, uf, lat, lng] = row.split('|');
    const isCap = CAPITAIS[uf] === n;
    const z = n === 'São Paulo' && uf === 'SP' ? 11 : 12;
    add(n, `${UF_NAME[uf]} – ${uf}`, 'city', +lat, +lng, z, (isCap ? 2.5 : 0) + (uf === 'SP' ? 1 : 0), uf);
  });

  // Estados
  G.states.forEach(([uf, name, lat, lng]) => add(name, `Estado · ${uf}`, 'state', lat, lng, uf === 'DF' ? 9 : 6, 2, uf));

  // CEP: faixas por prefixo (aproximação para a demonstração)
  const CEP_SPC = { '010':['Sé / Centro',-23.5480,-46.6350],'011':['Bom Retiro / Luz',-23.5290,-46.6380],'012':['Santa Cecília / Higienópolis',-23.5400,-46.6540],'013':['Bela Vista / Consolação',-23.5570,-46.6520],'014':['Jardins / Cerqueira César',-23.5660,-46.6650],'015':['Liberdade / Aclimação',-23.5660,-46.6320],
    '02':['Zona Norte',-23.4950,-46.6300],'03':['Zona Leste',-23.5450,-46.5650],'04':['Zona Sul',-23.6200,-46.6600],'05':['Zona Oeste',-23.5500,-46.7100],'08':['Extremo Leste',-23.5300,-46.4400] };
  const CEP_SP = { '06':['Osasco / região oeste da Grande SP','Osasco'],'07':['Guarulhos / região norte da Grande SP','Guarulhos'],'09':['Grande ABC','Santo André'],'11':['Baixada Santista','Santos'],'12':['Vale do Paraíba','São José dos Campos'],'13':['Região de Campinas','Campinas'],'14':['Região de Ribeirão Preto','Ribeirão Preto'],'15':['Região de São José do Rio Preto','São José do Rio Preto'],'16':['Região de Araçatuba','Araçatuba'],'17':['Região de Bauru','Bauru'],'18':['Região de Sorocaba','Sorocaba'],'19':['Região de Presidente Prudente','Presidente Prudente'] };
  const cepUF = p => { const n = +p; if (n < 20) return 'SP'; if (n <= 28) return 'RJ'; if (n === 29) return 'ES'; if (n <= 39) return 'MG'; if (n <= 48) return 'BA'; if (n === 49) return 'SE'; if (n <= 56) return 'PE'; if (n === 57) return 'AL'; if (n === 58) return 'PB'; if (n === 59) return 'RN'; if (n <= 63) return 'CE'; if (n === 64) return 'PI'; if (n === 65) return 'MA'; if (n <= 68) return 'PA'; if (n === 69) return 'AM'; if (n <= 71) return 'DF'; if (n <= 76) return 'GO'; if (n === 77) return 'TO'; if (n === 78) return 'MT'; if (n === 79) return 'MS'; if (n <= 87) return 'PR'; if (n <= 89) return 'SC'; return 'RS'; };
  const findCity = (name, uf) => entries.find(e => e.type === 'city' && e.label === name && e.sub.endsWith(uf));

  function byCep(q) {
    const d = q.replace(/\D/g, '');
    if (!/^\d{5,8}$/.test(q.replace(/[\s.-]/g, '')) || d.length < 5) return null;
    const cep = d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    const p2 = d.slice(0, 2), p3 = d.slice(0, 3);
    if (+p2 <= 5 || p2 === '08') {
      const z = CEP_SPC[p3] || CEP_SPC[p2]; if (!z) return null;
      return { label: `CEP ${cep}`, sub: `${z[0]} · São Paulo – SP (região aproximada)`, type: 'cep', lat: z[1], lng: z[2], zoom: CEP_SPC[p3] ? 15 : 13 };
    }
    if (CEP_SP[p2]) { const c = findCity(CEP_SP[p2][1], 'SP'); return c && { label: `CEP ${cep}`, sub: `${CEP_SP[p2][0]} – SP (região aproximada)`, type: 'cep', lat: c.lat, lng: c.lng, zoom: 11 }; }
    const uf = cepUF(p2), c = findCity(CAPITAIS[uf], uf);
    return c && { label: `CEP ${cep}`, sub: `${UF_NAME[uf]} – ${uf} (região aproximada)`, type: 'cep', lat: c.lat, lng: c.lng, zoom: 10 };
  }

  const STOP = new Set(['rua','r','av','avenida','alameda','al','travessa','praca','pca','estrada','rodovia','de','da','do','das','dos','e','sp','n','no','numero','bairro','cidade']);
  const ABBR = { av:'avenida', r:'rua', al:'alameda', pca:'praca', jd:'jardim', vl:'vila', sta:'santa', sto:'santo', pq:'parque' };

  function search(raw) {
    const q = raw.trim();
    if (q.length < 2) return Promise.resolve([]);
    const out = [];
    const cep = byCep(q); if (cep) return Promise.resolve([cep]);

    // "Rua Augusta, 500" -> remove números e abreviações; "Campinas, SP" -> filtro de UF
    let nq = norm(q).split(' ').map(t => ABBR[t] || t);
    const ufTok = nq.find(t => t.length === 2 && UF_NAME[t.toUpperCase()]);
    const words = nq.filter(t => !/^\d+$/.test(t));
    const core = words.filter(t => !STOP.has(t) && !(ufTok && t === ufTok && words.length > 1));
    const phrase = words.join(' ');
    if (!core.length || !phrase) return Promise.resolve([]);

    const scored = [];
    for (const e of entries) {
      let s = 0;
      if (e.type === 'state' && e.alt === phrase) s = 110;
      else if (e.key === phrase) s = 100;
      else if (e.key.startsWith(phrase)) s = 80;
      else if (core.length && core.every(t => e.key.includes(t) || e.alt.includes(t))) {
        s = core.every(t => e.key.split(' ').some(w => w.startsWith(t))) ? 60 : 40;
      }
      if (!s) continue;
      if (ufTok && e.type === 'city') s += e.alt === ufTok ? 15 : -25;
      s += e.boost * 4 - e.key.length * 0.05;
      scored.push([s, e]);
    }
    scored.sort((a, b) => b[0] - a[0]);
    const seen = new Set();
    for (const [, e] of scored) {
      const k = e.label + e.sub; if (seen.has(k)) continue; seen.add(k);
      out.push(e); if (out.length >= 6) break;
    }
    return Promise.resolve(out);
  }
  return { search };
})();
const Geocoder = LocalGeocoder;

/* ---------- 5. Mapa ---------- */
const MapView = (() => {
  const G = window.GEO;
  const map = L.map('map', { zoomControl: false, minZoom: 4, maxZoom: 16, zoomSnap: 0.5, worldCopyJump: false, preferCanvas: true, attributionControl: true });
  map.attributionControl.setPrefix(false);
  map.attributionControl.addAttribution('Limites: <a href="https://github.com/tbrugz/geodata-br" target="_blank" rel="noopener">IBGE/geodata-br</a> · Distritos SP: <a href="https://github.com/codigourbano/distritos-sp" target="_blank" rel="noopener">Prefeitura de SP</a>');
  const renderer = L.canvas({ padding: 0.6 });

  // Mapa-base vetorial embutido (sem tiles externos)
  L.geoJSON(G.uf, { renderer, interactive: false, style: { fillColor: '#F1F5F3', fillOpacity: 1, color: '#C9D5E2', weight: 1 } }).addTo(map);
  L.geoJSON(G.mun, { renderer, interactive: false, style: f => ({ fillColor: f.properties.id === '3550308' ? '#FFFFFF' : '#F7F9F8', fillOpacity: 1, color: '#DCE4EA', weight: 0.8 }) }).addTo(map);
  const RURAL = new Set(['Marsilac', 'Parelheiros']);
  const VERDE = new Set(['Jaraguá', 'Anhanguera', 'Perus', 'Tremembé', 'Cachoeirinha', 'Brasilândia', 'Mandaqui']);
  L.geoJSON(G.dist, { renderer, interactive: false, style: f => ({
    fillColor: RURAL.has(f.properties.n) ? '#E5F4EB' : '#FFFFFF', fillOpacity: 1, color: '#E3E9EF', weight: 1,
  }) }).addTo(map);
  // Faixa verde suave nos distritos que encostam na Serra da Cantareira
  L.geoJSON({ type: 'FeatureCollection', features: G.dist.features.filter(f => VERDE.has(f.properties.n)) }, { renderer, interactive: false, style: { fillColor: '#F1F9F4', fillOpacity: 1, color: '#E3E9EF', weight: 1 } }).addTo(map);
  // Contorno da cidade de São Paulo
  L.geoJSON({ type: 'FeatureCollection', features: G.mun.features.filter(f => f.properties.id === '3550308') }, { renderer, interactive: false, style: { fill: false, color: '#9DB7E3', weight: 1.6 } }).addTo(map);

  // Rótulos por nível de zoom
  const label = (lat, lng, text, cls) => L.marker([lat, lng], { interactive: false, keyboard: false, icon: L.divIcon({ className: 'map-label ' + cls, html: `<span>${esc(text)}</span>`, iconSize: null }) });
  const lStates = L.layerGroup(G.states.map(([uf, , lat, lng]) => label(lat, lng, uf, 'lbl-state')));
  const lDistricts = L.layerGroup(Object.entries(G.dpts).map(([n, [lat, lng]]) => label(lat, lng, n, 'lbl-district')));
  const MAJOR = new Set(['Campinas','Santos','Sorocaba','São José dos Campos','Ribeirão Preto','São José do Rio Preto','Bauru','Jundiaí','Piracicaba','Presidente Prudente','Guarulhos','Osasco','Santo André','São Bernardo do Campo','Mogi das Cruzes','Taubaté','Araçatuba','Marília','Franca','Registro']);
  const spCities = G.cities.split('~').map(r => r.split('|')).filter(r => r[1] === 'SP' && r[0] !== 'São Paulo');
  const center = { lat: -23.55, lng: -46.63 };
  const lMajor = L.layerGroup(spCities.filter(r => MAJOR.has(r[0])).map(r => label(+r[2], +r[3], r[0], 'lbl-city')));
  const lMetro = L.layerGroup(spCities.filter(r => !MAJOR.has(r[0]) && haversineKm(center, { lat: +r[2], lng: +r[3] }) < 42).map(r => label(+r[2], +r[3], r[0], 'lbl-city')));
  const lCapital = L.layerGroup([label(-23.548, -46.636, 'São Paulo', 'lbl-city major')]);
  function syncLabels() {
    const z = map.getZoom();
    const want = [[lStates, z <= 6.5], [lMajor, z >= 7.5 && z < 12.5], [lMetro, z >= 10 && z < 12.5], [lCapital, z >= 6.5 && z < 10.5], [lDistricts, z >= 12]];
    want.forEach(([l, on]) => on ? (map.hasLayer(l) || l.addTo(map)) : (map.hasLayer(l) && map.removeLayer(l)));
  }
  map.on('zoomend', syncLabels);

  // Pins
  const PIN = `<svg class="eco-pin" viewBox="0 0 36 46" aria-hidden="true">
    <path class="body" d="M18 1.5C9 1.5 1.8 8.5 1.8 17.3c0 11.3 14 25.3 15 26.3.7.6 1.7.6 2.4 0 1-1 15-15 15-26.3C34.2 8.5 27 1.5 18 1.5Z"/>
    <circle class="ring" cx="18" cy="17" r="10.2"/>
    <path class="leaf" d="M12.4 22.6c-.5-6.6 3.7-11.3 11.6-11.4.4 7.7-4.4 12.3-11.6 11.4Z"/>
    <path d="M12.8 22.2 19.4 15.7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const markers = new Map();
  let selectedId = null;

  function setPoints(points, onSelect) {
    points.forEach(p => {
      const m = L.marker([p.lat, p.lng], {
        title: p.nome, alt: p.nome, riseOnHover: true, keyboard: true,
        icon: L.divIcon({ className: 'eco-marker', html: PIN, iconSize: [36, 46], iconAnchor: [18, 45] }),
      }).addTo(map);
      m.on('click', () => onSelect(p.id));
      m.on('keypress', e => { if (e.originalEvent.key === 'Enter') onSelect(p.id); });
      markers.set(p.id, m);
    });
  }
  function select(id) {
    if (selectedId && markers.get(selectedId)) {
      const el = markers.get(selectedId).getElement();
      el && el.classList.remove('is-selected') ; el && el.querySelector('.eco-pin').classList.remove('is-selected', 'bounce');
    }
    selectedId = id;
    if (!id) return;
    const el = markers.get(id).getElement();
    if (!el) return;
    el.classList.add('is-selected');
    const pin = el.querySelector('.eco-pin');
    pin.classList.remove('bounce'); void pin.offsetWidth; pin.classList.add('is-selected', 'bounce');
  }

  // Marcadores auxiliares (local pesquisado / usuário)
  let placeMarker = null, userMarker = null;
  function showPlace(r) {
    placeMarker && map.removeLayer(placeMarker);
    placeMarker = L.marker([r.lat, r.lng], { interactive: false, keyboard: false, icon: L.divIcon({ className: '', html: '<div class="place-dot searched"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(map);
  }
  function clearPlace() { placeMarker && map.removeLayer(placeMarker); placeMarker = null; }
  function showUser(pos) {
    userMarker && map.removeLayer(userMarker);
    userMarker = L.marker([pos.lat, pos.lng], { interactive: false, keyboard: false, zIndexOffset: -100, icon: L.divIcon({ className: '', html: '<div class="user-dot"><i></i></div>', iconSize: [20, 20], iconAnchor: [10, 10] }) }).addTo(map);
  }

  /** Centraliza considerando o espaço ocupado pelo painel/bottom sheet */
  function viewPadding() {
    const mobile = innerWidth <= 760, open = document.body.classList.contains('panel-open');
    if (mobile) return { tl: [24, 110], br: [24, open ? 340 : 90] };
    return { tl: [40, 100], br: [open ? 460 : 90, 60] };
  }
  function flyTo(lat, lng, zoom) {
    const pad = viewPadding();
    const target = map.project([lat, lng], zoom);
    const offX = (pad.br[0] - pad.tl[0]) / 2, offY = (pad.br[1] - pad.tl[1]) / 2;
    map.flyTo(map.unproject(target.add([offX, offY]), zoom), zoom, { duration: 0.9 });
  }
  function fitPoints(pts, maxZoom = 15) {
    const pad = viewPadding();
    map.flyToBounds(L.latLngBounds(pts.map(p => [p.lat, p.lng])), { paddingTopLeft: pad.tl, paddingBottomRight: pad.br, maxZoom, duration: 0.9 });
  }
  function panToPoint(p) {
    const z = Math.max(map.getZoom(), 13.5);
    flyTo(p.lat, p.lng, z);
  }
  return { map, setPoints, select, showPlace, clearPlace, showUser, flyTo, fitPoints, panToPoint, syncLabels };
})();

/* ---------- 8a. Toast ---------- */
const Toast = (() => {
  const el = $('#toast'); let t;
  function show({ msg, sub = '', kind = 'ok', action = null, ms = 3200 }) {
    clearTimeout(t);
    el.innerHTML = `${icon(kind === 'ok' ? 'check' : 'info', 't-ico ' + (kind === 'ok' ? '' : 'warn'))}<div class="t-msg">${esc(msg)}${sub ? `<small>${esc(sub)}</small>` : ''}</div>${action ? `<button class="t-act" type="button">${esc(action.label)}</button>` : ''}`;
    if (action) $('.t-act', el).onclick = () => { hide(); action.run(); };
    el.classList.add('show');
    t = setTimeout(hide, action ? Math.max(ms, 6500) : ms);
  }
  const hide = () => el.classList.remove('show');
  return { show, hide };
})();

/* ---------- Estado ---------- */
const state = { points: [], byId: new Map(), selected: null, user: null, userSimulated: false, ref: null };

/* ---------- 7. Painel de detalhes ---------- */
const PanelUI = (() => {
  const panel = $('#panel'), scroll = $('#panel-scroll'), body = $('#panel-body');
  const isMobile = () => innerWidth <= 760;

  function render(e) {
    const st = openStatus(e.horarios);
    const { day } = nowInSaoPaulo();
    const ref = state.user || state.ref;
    const dist = ref ? haversineKm(ref, e) : null;
    const contacts = [
      e.telefone && `<a class="contact" href="tel:+55${digits(e.telefone)}"><span class="c-ico">${icon('phone')}</span><span><span class="c-label">Telefone</span><span class="c-val">${esc(e.telefone)}</span></span></a>`,
      e.whatsapp && `<a class="contact" href="https://wa.me/55${digits(e.whatsapp)}" target="_blank" rel="noopener"><span class="c-ico wa">${icon('whatsapp')}</span><span><span class="c-label">WhatsApp</span><span class="c-val">${esc(e.whatsapp)}</span></span></a>`,
      e.site && `<a class="contact" href="${esc(e.site)}" target="_blank" rel="noopener"><span class="c-ico">${icon('globe')}</span><span><span class="c-label">Site</span><span class="c-val">${esc(e.site.replace(/^https?:\/\//, ''))}</span></span></a>`,
    ].filter(Boolean);
    const contactBtns = [
      e.telefone && `<a class="btn btn-ghost" href="tel:+55${digits(e.telefone)}">${icon('phone')}Ligar</a>`,
      e.whatsapp && `<a class="btn btn-ghost wa" href="https://wa.me/55${digits(e.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>`,
    ].filter(Boolean);

    body.innerHTML = `
      <div class="panel-head" id="panel-head">
        <div class="p-eyebrow">${icon('recycle')}${esc(e.tipo)}</div>
        <h2 class="p-name" id="panel-title">${esc(e.nome)}</h2>
        <div class="p-meta">
          <span class="status ${st.cls}">${esc(st.text)}</span>
          ${dist != null ? `<span class="p-dist">${fmtKm(dist)} ${state.user ? (state.userSimulated ? 'da localização simulada' : 'de você') : 'do local buscado'}</span>` : ''}
          <span class="tag-demo" title="Ponto fictício, criado para demonstração">Demonstrativo</span>
        </div>
        ${e.descricao ? `<p class="p-desc">${esc(e.descricao)}</p>` : ''}
      </div>
      <div class="p-actions" id="panel-actions">
        <a class="btn btn-primary" id="btn-route" href="${routeUrl(e)}" target="_blank" rel="noopener">${icon('route')}Como chegar</a>
        <button class="btn btn-secondary" id="btn-share" type="button">${icon('share')}<span>Compartilhar endereço</span></button>
        ${contactBtns.length ? `<div class="btn-row ${contactBtns.length === 1 ? 'single' : ''}">${contactBtns.join('')}</div>` : ''}
      </div>
      <section class="p-sec" aria-labelledby="sec-end">
        <h3 class="p-sec-title" id="sec-end">${icon('pin')}Endereço</h3>
        <div class="addr">
          <div class="addr-text"><b>${esc(e.endereco)}, ${esc(e.numero)}</b><span>${esc(e.bairro)} · ${esc(e.cidade)} – ${esc(e.estado)}<br>CEP ${esc(e.cep)}</span></div>
          <button class="btn-copy" id="btn-copy" type="button" aria-label="Copiar endereço completo">${icon('copy')}<span>Copiar</span></button>
        </div>
      </section>
      <section class="p-sec" aria-labelledby="sec-mat">
        <h3 class="p-sec-title" id="sec-mat">${icon('leaf')}Materiais aceitos</h3>
        <div class="chips">${e.materiais.map(m => `<span class="chip">${icon(m)}${esc(window.MATERIAIS[m].label)}</span>`).join('')}</div>
        <p class="chips-note">Este ponto aceita apenas os materiais acima. Confira antes de levar seu descarte.</p>
      </section>
      <section class="p-sec" aria-labelledby="sec-hor">
        <h3 class="p-sec-title" id="sec-hor">${icon('clock')}Horário de funcionamento</h3>
        <ul class="hours">${[1,2,3,4,5,6,0].map(d => { const h = e.horarios[d];
          return `<li class="${h ? '' : 'closed'} ${d === day ? 'today' : ''}"><span>${DIAS[d]}</span><span>${h ? `${h[0]} – ${h[1]}` : 'Fechado'}</span></li>`; }).join('')}</ul>
      </section>
      ${contacts.length ? `<section class="p-sec" aria-labelledby="sec-con"><h3 class="p-sec-title" id="sec-con">${icon('phone')}Contato</h3><div class="contacts">${contacts.join('')}</div></section>` : ''}
      <div class="p-foot">${icon('info')}<span>Ponto fictício, criado apenas para demonstração do OndeDescartar. Telefones e sites não pertencem a estabelecimentos reais.</span></div>`;

    $('#btn-share').onclick = () => share(e);
    $('#btn-copy').onclick = () => copyAddress(e);
    $('#btn-route').onclick = () => { $('#btn-route').href = routeUrl(e); };
  }

  /** Rota: usa a localização real como origem quando disponível; senão o Google Maps decide a origem */
  function routeUrl(e) {
    const origin = state.user && !state.userSimulated ? `&origin=${state.user.lat},${state.user.lng}` : '';
    return `https://www.google.com/maps/dir/?api=1${origin}&destination=${e.lat},${e.lng}&travelmode=driving`;
  }

  async function share(e) {
    const text = `${e.nome}\n${fullAddress(e)}`;
    const url = mapsLink(e);
    if (navigator.share) {
      try { await navigator.share({ title: `${e.nome} · OndeDescartar`, text, url }); return; }
      catch (err) { if (err && err.name === 'AbortError') return; /* sem suporte no contexto -> cai para cópia */ }
    }
    const ok = await copyText(`${text}\n${url}`);
    const btn = $('#btn-share');
    if (ok) {
      btn.classList.add('done'); btn.querySelector('span').textContent = 'Endereço e link copiados';
      btn.querySelector('svg').outerHTML = icon('check');
      setTimeout(() => { if (!btn.isConnected) return; btn.classList.remove('done'); btn.querySelector('span').textContent = 'Compartilhar endereço'; btn.querySelector('svg').outerHTML = icon('share'); }, 2400);
      Toast.show({ msg: 'Pronto para colar e enviar', sub: 'Nome, endereço e link de localização copiados.' });
    } else {
      Toast.show({ kind: 'warn', msg: 'Não foi possível copiar automaticamente', sub: `${fullAddress(e)} · ${url}`, ms: 8000 });
    }
  }
  async function copyAddress(e) {
    const ok = await copyText(fullAddress(e));
    const btn = $('#btn-copy');
    if (ok) {
      btn.classList.add('done'); btn.querySelector('span').textContent = 'Copiado'; btn.querySelector('svg').outerHTML = icon('check');
      setTimeout(() => { if (!btn.isConnected) return; btn.classList.remove('done'); btn.querySelector('span').textContent = 'Copiar'; btn.querySelector('svg').outerHTML = icon('copy'); }, 2000);
    } else Toast.show({ kind: 'warn', msg: 'Não foi possível copiar', sub: fullAddress(e), ms: 7000 });
  }

  function setPeek() {
    if (!isMobile()) return;
    const head = $('#panel-head'), act = $('#panel-actions');
    const h = 26 + (head ? head.offsetHeight : 0) + (act ? act.offsetHeight : 0) + 12;
    panel.style.setProperty('--peek', Math.min(h, innerHeight * 0.6) + 'px');
  }

  function open(e) {
    render(e);
    scroll.scrollTop = 0;
    panel.classList.remove('expanded');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('panel-open');
    requestAnimationFrame(setPeek);
  }
  function close() {
    panel.classList.remove('open', 'expanded');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('panel-open');
    panel.style.transform = '';
  }
  $('#panel-close').onclick = () => Controller.deselect();

  // Bottom sheet: arrastar / tocar no puxador para expandir e recolher
  (() => {
    const handle = $('#sheet-handle');
    let startY = 0, startT = 0, dragging = false, moved = false, base = 0;
    const current = () => { const m = new DOMMatrixReadOnly(getComputedStyle(panel).transform); return m.m42; };
    const peekY = () => panel.offsetHeight - parseFloat(getComputedStyle(panel).getPropertyValue('--peek'));
    const start = y => { if (!isMobile()) return; dragging = true; moved = false; startY = y; startT = Date.now(); base = current(); panel.classList.add('dragging'); };
    const move = y => { if (!dragging) return; const dy = y - startY; if (Math.abs(dy) > 4) moved = true; panel.style.transform = `translateY(${Math.max(0, base + dy)}px)`; };
    const end = y => {
      if (!dragging) return; dragging = false; panel.classList.remove('dragging'); panel.style.transform = '';
      const dy = y - startY, v = dy / Math.max(1, Date.now() - startT);
      if (!moved) { panel.classList.toggle('expanded'); return; }
      const pos = base + dy;
      if (v > 0.6 || pos > peekY() + 80) { panel.classList.contains('expanded') && pos < peekY() + 80 ? panel.classList.remove('expanded') : Controller.deselect(); }
      else if (v < -0.4 || pos < peekY() / 2) panel.classList.add('expanded');
      else panel.classList.remove('expanded');
    };
    handle.addEventListener('pointerdown', e => { handle.setPointerCapture(e.pointerId); start(e.clientY); });
    handle.addEventListener('pointermove', e => move(e.clientY));
    handle.addEventListener('pointerup', e => end(e.clientY));
    handle.addEventListener('pointercancel', e => end(startY));
    handle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); panel.classList.toggle('expanded'); } });
    // tocar no cabeçalho no estado recolhido também expande
    panel.addEventListener('click', e => { if (isMobile() && !panel.classList.contains('expanded') && e.target.closest('#panel-head') && !e.target.closest('button,a')) panel.classList.add('expanded'); });
  })();
  addEventListener('resize', setPeek);
  return { open, close };
})();

/* ---------- Faixa "ecoponto mais próximo" ---------- */
const Nearby = (() => {
  const el = $('#nearby');
  function show(ref, labelRef) {
    const ranked = state.points.map(p => [haversineKm(ref, p), p]).sort((a, b) => a[0] - b[0]);
    const [km, p] = ranked[0];
    if (km > 35) {
      el.innerHTML = `<span class="nb-ico">${icon('info')}</span><span class="nb-text"><b>Nenhum ecoponto demonstrativo por aqui</b>A demonstração cobre a cidade de São Paulo.</span><button class="nb-btn" type="button">Ver ecopontos</button><button class="nb-x" type="button" aria-label="Fechar">${icon('x')}</button>`;
      $('.nb-btn', el).onclick = () => { hide(); Controller.overview(); };
    } else {
      const near = ranked.filter(r => r[0] <= 3).length;
      el.innerHTML = `<span class="nb-ico">${icon('recycle')}</span><span class="nb-text"><b>${esc(p.nome)}</b>Mais próximo ${labelRef} · ${fmtKm(km)}${near > 1 ? ` · ${near} pontos a até 3 km` : ''}</span><button class="nb-btn" type="button">Ver</button><button class="nb-x" type="button" aria-label="Fechar">${icon('x')}</button>`;
      $('.nb-btn', el).onclick = () => { hide(); Controller.select(p.id); };
      // enquadra o local buscado + o ecoponto mais próximo
      if (km > 0.6) setTimeout(() => MapView.fitPoints([ref, ...ranked.slice(0, Math.max(1, Math.min(3, near))).map(r => r[1])], 14.5), 950);
    }
    $('.nb-x', el).onclick = hide;
    el.classList.add('show');
  }
  const hide = () => el.classList.remove('show');
  return { show, hide };
})();

/* ---------- 6. Busca ---------- */
const SearchUI = (() => {
  const wrap = $('#search'), input = $('#q'), list = $('#suggest'), clear = $('#q-clear');
  let results = [], active = -1;
  const TYPE = { road: ['road', 'Rua'], landmark: ['landmark', 'Referência'], district: ['building', 'Bairro'], city: ['city', 'Cidade'], state: ['map', 'Estado'], cep: ['hash', 'CEP'] };

  const hl = (label, q) => {
    const words = norm(q).split(' ').filter(w => w.length > 1 && !/^\d+$/.test(w));
    if (!words.length) return esc(label);
    const n = norm(label);
    // destaca a primeira ocorrência de cada termo (mapeando índices sem acento -> original)
    const marks = new Array(label.length).fill(false);
    const plain = label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    words.forEach(w => { const i = plain.indexOf(w); if (i >= 0) for (let k = i; k < i + w.length; k++) marks[k] = true; });
    let out = '', on = false;
    [...label].forEach((ch, i) => { if (marks[i] && !on) { out += '<mark>'; on = true; } if (!marks[i] && on) { out += '</mark>'; on = false; } out += esc(ch); });
    return on ? out + '</mark>' : out;
  };

  function renderList(q) {
    if (!q.trim()) { wrap.classList.remove('open'); input.setAttribute('aria-expanded', 'false'); return; }
    if (!results.length) {
      list.innerHTML = `<div class="sg-empty">Nada encontrado para <b>“${esc(q)}”</b>.<br>Tente um bairro, cidade, estado, CEP ou avenida conhecida.</div>`;
    } else {
      list.innerHTML = results.map((r, i) => `<button type="button" role="option" id="sg-${i}" class="sg-item ${i === active ? 'active' : ''}" data-i="${i}" aria-selected="${i === active}">
          <span class="sg-ico">${icon(TYPE[r.type][0])}</span>
          <span class="sg-text"><span class="sg-title">${hl(r.label, q)}</span><span class="sg-sub">${esc(r.sub)}</span></span>
          <span class="sg-type">${TYPE[r.type][1]}</span></button>`).join('')
        + `<div class="sg-foot">Busca demonstrativa offline: bairros e distritos de SP, municípios e estados do Brasil, faixas de CEP e principais referências.</div>`;
    }
    wrap.classList.add('open'); input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', active >= 0 ? `sg-${active}` : '');
  }
  const run = debounce(async () => {
    const q = input.value;
    results = await Geocoder.search(q);
    active = results.length ? 0 : -1;
    renderList(q);
  }, 90);

  function choose(r) {
    input.value = r.type === 'cep' ? r.label.replace('CEP ', '') : r.label;
    wrap.classList.remove('open'); input.setAttribute('aria-expanded', 'false');
    input.blur();
    Controller.goToPlace(r);
  }

  input.addEventListener('input', () => { clear.classList.toggle('show', !!input.value); run(); });
  input.addEventListener('focus', () => { if (input.value.trim()) run(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' && results.length) { e.preventDefault(); active = (active + 1) % results.length; renderList(input.value); }
    else if (e.key === 'ArrowUp' && results.length) { e.preventDefault(); active = (active - 1 + results.length) % results.length; renderList(input.value); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) choose(results[active]); }
    else if (e.key === 'Escape') { wrap.classList.remove('open'); input.blur(); }
  });
  list.addEventListener('mousedown', e => e.preventDefault());
  list.addEventListener('click', e => { const b = e.target.closest('.sg-item'); if (b) choose(results[+b.dataset.i]); });
  clear.onclick = () => { input.value = ''; results = []; clear.classList.remove('show'); wrap.classList.remove('open'); MapView.clearPlace(); Nearby.hide(); state.ref = null; input.focus(); };
  document.addEventListener('pointerdown', e => { if (!wrap.contains(e.target)) wrap.classList.remove('open'); });
  $('#search-form').addEventListener('submit', e => e.preventDefault());
  return {};
})();

/* ---------- Controlador (fluxos principais) ---------- */
const Controller = {
  select(id) {
    const e = state.byId.get(id); if (!e) return;
    state.selected = id;
    MapView.select(id);
    PanelUI.open(e);
    Nearby.hide();
    setTimeout(() => MapView.panToPoint(e), 30);
  },
  deselect() { state.selected = null; MapView.select(null); PanelUI.close(); },
  overview() { MapView.fitPoints(state.points, 13); },
  goToPlace(r) {
    this.deselect();
    MapView.showPlace(r);
    MapView.flyTo(r.lat, r.lng, r.zoom);
    state.ref = { lat: r.lat, lng: r.lng };
    if (r.zoom >= 10) Nearby.show(state.ref, 'do local buscado');
    else Nearby.hide();
  },
  setUser(pos, simulated) {
    state.user = pos; state.userSimulated = simulated;
    MapView.showUser(pos);
    MapView.flyTo(pos.lat, pos.lng, 14);
    Nearby.show(pos, simulated ? 'da localização simulada' : 'de você');
  },
  locate(btn) {
    const simulate = () => { this.setUser({ lat: -23.5614, lng: -46.6559 }, true); Toast.show({ msg: 'Usando localização simulada', sub: 'Av. Paulista, São Paulo (apenas demonstração).' }); };
    const fail = (why) => {
      btn.classList.remove('locating');
      Toast.show({ kind: 'warn', msg: 'Não conseguimos acessar sua localização', sub: why + ' Você pode buscar um endereço no campo acima.', action: { label: 'Simular', run: simulate }, ms: 9000 });
    };
    if (!('geolocation' in navigator)) return fail('Seu navegador não oferece esse recurso.');
    btn.classList.add('locating');
    let done = false;
    const guard = setTimeout(() => { if (!done) { done = true; fail('A permissão não foi respondida a tempo.'); } }, 9000);
    try {
      navigator.geolocation.getCurrentPosition(
        p => { if (done) return; done = true; clearTimeout(guard); btn.classList.remove('locating'); btn.classList.add('located'); this.setUser({ lat: p.coords.latitude, lng: p.coords.longitude }, false); },
        err => { if (done) return; done = true; clearTimeout(guard); fail(err.code === 1 ? 'A permissão foi negada ou está bloqueada neste ambiente.' : 'Não foi possível obter sua posição agora.'); },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
    } catch (_) { done = true; clearTimeout(guard); fail('O acesso à localização está bloqueado neste ambiente.'); }
  },
};

/* ---------- 8b. Controles e boot ---------- */
function mountChrome() {
  $('#brand').innerHTML = LOGO + WORDMARK;
  $('#brand-mini').innerHTML = LOGO;
  $('#ico-search').innerHTML = icon('search');
  $('#q-clear').innerHTML = icon('x');
  $('#panel-close').innerHTML = icon('x');
  $('#c-locate').innerHTML = icon('locate');
  $('#c-in').innerHTML = icon('plus');
  $('#c-out').innerHTML = icon('minus');
  $('#c-all').innerHTML = icon('overview');
  $('#demo-ico').innerHTML = icon('info');
  $('#dlg-brand').innerHTML = LOGO + WORDMARK;
  $('#c-locate').onclick = e => Controller.locate(e.currentTarget);
  $('#c-in').onclick = () => MapView.map.zoomIn(1);
  $('#c-out').onclick = () => MapView.map.zoomOut(1);
  $('#c-all').onclick = () => { Controller.deselect(); Nearby.hide(); Controller.overview(); };
  const scrim = $('#about');
  $('#demo-chip').onclick = () => { scrim.classList.add('open'); scrim.setAttribute('aria-hidden', 'false'); $('#about-ok').focus(); };
  const closeAbout = () => { scrim.classList.remove('open'); scrim.setAttribute('aria-hidden', 'true'); };
  $('#about-ok').onclick = closeAbout;
  scrim.addEventListener('click', e => { if (e.target === scrim) closeAbout(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAbout(); if (state.selected && document.activeElement !== $('#q')) Controller.deselect(); } });
  MapView.map.on('click', () => { if (state.selected) Controller.deselect(); });
}

async function boot() {
  mountChrome();
  state.points = await EcopontoRepository.list();
  state.points.forEach(p => state.byId.set(p.id, p));
  MapView.setPoints(state.points, id => Controller.select(id));
  const b = L.latLngBounds(state.points.map(p => [p.lat, p.lng]));
  const mobile = innerWidth <= 760;
  MapView.map.fitBounds(b, { paddingTopLeft: mobile ? [24, 110] : [60, 120], paddingBottomRight: mobile ? [24, 90] : [90, 70], maxZoom: 13 });
  MapView.syncLabels();
}
boot();
})();
