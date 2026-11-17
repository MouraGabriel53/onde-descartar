import { Controller } from "@hotwired/stimulus"

/* ---------- 1. Ícones ---------- */
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  locate: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  overview: '<path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><circle cx="12" cy="12" r="2.5"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
  route: '<path d="M3 11 21 3l-8 18-2-8-8-2Z"/>',
  phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  whatsapp: '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.1L3.5 20.5Z"/><path d="M9 9.2c.2 1.6 2.2 4 4.6 4.7l1-1.2 1.8.9c-.3 1.2-1.2 1.7-2.2 1.6C11 14.8 8.6 12.4 8.3 9.9c-.1-1 .5-1.8 1.6-2.1l.9 1.8-1 .9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  recycle: '<path d="m7 19-3.5-6L6 8.7M17 19l3.5-6L18 8.7M9.5 4.5h5L17 9M7 19h10M12 4.5 7 13M12 4.5 17 13"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3"/>',
  city: '<path d="M3 21h18M5 21V9l5-3v15M10 21V4l9 4v13M14 10h2M14 14h2M7 12h1M7 16h1"/>',
  map: '<path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4ZM9 4v13.5M15 6.5V20"/>',
  road: '<path d="M5 21 9 3M19 21 15 3M12 5v2M12 11v2M12 17v2"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19 13 11"/>',
  papel: '<path d="M4 8 12 4l8 4v9l-8 4-8-4V8Z"/><path d="m4 8 8 4 8-4M12 12v9"/>',
  plastico: '<path d="M10 2h4v3l1.5 2.5V20a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V7.5L10 5V2Z"/><path d="M8.5 12h7"/>',
  vidro: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0L7 3ZM12 14v7M8.5 21h7"/>',
  metal: '<ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14c0 1.1 2.7 2 6 2s6-.9 6-2V5"/><path d="M6 12c0 1.1 2.7 2 6 2s6-.9 6-2"/>',
  eletronicos: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  pilhas: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10.5v3M7 12h4M9 10v4"/>',
  oleo: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
  moveis: '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3v-4ZM6 17v2M18 17v2"/>',
  entulho: '<path d="M3 20h18M4 20v-5h7v5M13 20v-5h7v5M7.5 15v-5h9v5"/>',
  especiais: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4M12 17h.01"/>'
}
const icon = (name, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`

const MATERIAL_ICON = {
  paper: "papel", plastic: "plastico", glass: "vidro", metal: "metal", electronics: "eletronicos",
  batteries: "pilhas", cooking_oil: "oleo", furniture: "moveis", rubble: "entulho", special_waste: "especiais"
}

const CONTACT_META = {
  phone: { label: "Telefone", icon: "phone", external: false },
  whatsapp: { label: "WhatsApp", icon: "whatsapp", external: true, cls: "wa" },
  email: { label: "E-mail", icon: "mail", external: false },
  website: { label: "Site", icon: "globe", external: true }
}

/* ---------- 2. Utilitários ---------- */
const TIME_ZONE = "America/Sao_Paulo"
const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const $ = (selector, el) => el.querySelector(selector)
const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim()
const isAbort = error => error && error.name === "AbortError"
const safeHref = href => (/^(https?:|tel:|mailto:)/i.test(href || "") ? href : "#")

const haversineKm = (a, b) => {
  const R = 6371, toRad = Math.PI / 180
  const dLat = (b.lat - a.lat) * toRad, dLng = (b.lng - a.lng) * toRad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
const fmtKm = km => km < 1 ? `${Math.round(km * 1000 / 10) * 10} m` : `${km.toFixed(km < 10 ? 1 : 0).replace(".", ",")} km`
const fmtHour = h => { const [hh, mm] = h.split(":"); return mm === "00" ? `${+hh}h` : `${+hh}h${mm}` }
const toMin = h => { const [a, b] = h.split(":"); return +a * 60 + +b }

function nowInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date())
  const get = type => parts.find(p => p.type === type).value
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"))
  return { day, min: +get("hour") * 60 + +get("minute") }
}

function intervalsByDay(openingHours) {
  const days = Array.from({ length: 7 }, () => [])
  openingHours.forEach(h => days[h.weekday].push(h))
  days.forEach(list => list.sort((a, b) => toMin(a.opens_at) - toMin(b.opens_at)))
  return days
}

function openStatus(openingHours) {
  const days = intervalsByDay(openingHours)
  const { day, min } = nowInSaoPaulo()
  const current = days[day].find(h => min >= toMin(h.opens_at) && min < toMin(h.closes_at))
  if (current) {
    const left = toMin(current.closes_at) - min
    return left <= 60
      ? { cls: "soon", text: `Fecha em breve · às ${fmtHour(current.closes_at)}` }
      : { cls: "open", text: `Aberto agora · fecha às ${fmtHour(current.closes_at)}` }
  }
  for (let i = 0; i <= 7; i++) {
    const d = (day + i) % 7
    const next = days[d].find(h => i > 0 || toMin(h.opens_at) > min)
    if (!next) continue
    const when = i === 0 ? "hoje" : i === 1 ? "amanhã" : WEEKDAYS[d].toLowerCase()
    return { cls: "closed", text: `Fechado · abre ${when} às ${fmtHour(next.opens_at)}` }
  }
  return { cls: "closed", text: "Fechado" }
}

const mapsLink = place => `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (_) {
    return false
  }
}

/* ---------- 3. Geocodificador ---------- */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=br&accept-language=pt-BR"
const KIND_BY_ADDRESSTYPE = {
  house: "house", building: "house",
  road: "street", residential: "street", pedestrian: "street", footway: "street", tertiary: "street", secondary: "street", primary: "street", trunk: "street", motorway: "street", service: "street", living_street: "street",
  neighbourhood: "neighbourhood", suburb: "neighbourhood", quarter: "neighbourhood", city_district: "neighbourhood", borough: "neighbourhood", district: "neighbourhood",
  city: "city", town: "city", village: "city", municipality: "city", county: "city", hamlet: "city",
  state: "state", region: "state", state_district: "state"
}
const ZOOM_BY_KIND = { house: 16, street: 16, neighbourhood: 14, city: 12, state: 7, place: 14 }

class Geocoder {
  constructor() { this.request = null }

  cancel() {
    if (this.request) this.request.abort()
    this.request = null
  }

  async search(query) {
    this.cancel()
    this.request = new AbortController()
    const { signal } = this.request
    const q = query.trim()
    if (/^\d{5}-?\d{3}$/.test(q)) return this.searchZip(q, signal)
    return this.nominatim(q, signal)
  }

  async searchZip(zip, signal) {
    const digits = zip.replace(/\D/g, "")
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal })
      if (response.ok) {
        const data = await response.json()
        if (!data.erro) {
          const text = [data.logradouro, data.localidade, data.uf].filter(Boolean).join(", ")
          const results = await this.nominatim(text, signal)
          if (results.length) return results
        }
      }
    } catch (error) {
      if (isAbort(error)) throw error
    }
    return this.nominatim(zip, signal)
  }

  async nominatim(text, signal) {
    const response = await fetch(`${NOMINATIM_URL}&q=${encodeURIComponent(text)}`, { signal, headers: { Accept: "application/json" } })
    if (!response.ok) throw new Error(`Nominatim ${response.status}`)
    const data = await response.json()
    return data.map(item => this.toResult(item))
  }

  toResult(item) {
    const a = item.address || {}
    const kind = KIND_BY_ADDRESSTYPE[item.addresstype] || KIND_BY_ADDRESSTYPE[item.type] || "place"
    const first = (item.display_name || "").split(",")[0].trim()
    const label = kind === "house" && a.road
      ? [a.road, a.house_number].filter(Boolean).join(", ")
      : (item.name || first)
    const sub = [a.suburb || a.neighbourhood, a.city || a.town || a.village || a.municipality, a.state]
      .filter((part, i, all) => part && part !== label && all.indexOf(part) === i).join(" – ")
    const [south, north, west, east] = (item.boundingbox || []).map(Number)
    const bounds = item.boundingbox ? [[south, west], [north, east]] : null
    return { label, sub, type: kind, lat: +item.lat, lng: +item.lon, bounds }
  }
}

/* ---------- 4. Mapa ---------- */
const PIN = `<svg class="eco-pin" viewBox="0 0 36 46" aria-hidden="true">
  <path class="body" d="M18 1.5C9 1.5 1.8 8.5 1.8 17.3c0 11.3 14 25.3 15 26.3.7.6 1.7.6 2.4 0 1-1 15-15 15-26.3C34.2 8.5 27 1.5 18 1.5Z"/>
  <circle class="ring" cx="18" cy="17" r="10.2"/>
  <path class="leaf" d="M12.4 22.6c-.5-6.6 3.7-11.3 11.6-11.4.4 7.7-4.4 12.3-11.6 11.4Z"/>
  <path d="M12.8 22.2 19.4 15.7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>`

class MapView {
  constructor(el) {
    this.map = L.map(el, { zoomControl: false, maxZoom: 19, zoomSnap: 0.5, worldCopyJump: false })
    this.map.attributionControl.setPrefix(false)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(this.map)
    this.map.setView([-23.55, -46.63], 11)
    this.markers = new Map()
    this.selectedId = null
    this.placeMarker = null
    this.userMarker = null
  }

  destroy() { this.map.remove() }

  setPoints(points, onSelect) {
    points.forEach(p => {
      const marker = L.marker([p.lat, p.lng], {
        title: p.name, alt: p.name, riseOnHover: true, keyboard: true,
        icon: L.divIcon({ className: "eco-marker", html: PIN, iconSize: [36, 46], iconAnchor: [18, 45] })
      }).addTo(this.map)
      marker.on("click", () => onSelect(p.id))
      marker.on("keypress", e => { if (e.originalEvent.key === "Enter") onSelect(p.id) })
      this.markers.set(p.id, marker)
    })
  }

  fitInitial(points) {
    if (!points.length) return
    const mobile = innerWidth <= 760
    this.map.fitBounds(L.latLngBounds(points.map(p => [p.lat, p.lng])), {
      paddingTopLeft: mobile ? [24, 110] : [60, 120], paddingBottomRight: mobile ? [24, 90] : [90, 70], maxZoom: 13
    })
  }

  select(id) {
    const previous = this.selectedId && this.markers.get(this.selectedId)
    if (previous) {
      const el = previous.getElement()
      if (el) {
        el.classList.remove("is-selected")
        el.querySelector(".eco-pin").classList.remove("is-selected", "bounce")
      }
    }
    this.selectedId = id
    if (!id) return
    const el = this.markers.get(id).getElement()
    if (!el) return
    el.classList.add("is-selected")
    const pin = el.querySelector(".eco-pin")
    pin.classList.remove("bounce")
    void pin.offsetWidth
    pin.classList.add("is-selected", "bounce")
  }

  showPlace(r) {
    this.clearPlace()
    this.placeMarker = L.marker([r.lat, r.lng], { interactive: false, keyboard: false, icon: L.divIcon({ className: "", html: '<div class="place-dot searched"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(this.map)
  }

  clearPlace() {
    if (this.placeMarker) this.map.removeLayer(this.placeMarker)
    this.placeMarker = null
  }

  showUser(pos) {
    if (this.userMarker) this.map.removeLayer(this.userMarker)
    this.userMarker = L.marker([pos.lat, pos.lng], { interactive: false, keyboard: false, zIndexOffset: -100, icon: L.divIcon({ className: "", html: '<div class="user-dot"><i></i></div>', iconSize: [20, 20], iconAnchor: [10, 10] }) }).addTo(this.map)
  }

  viewPadding() {
    const mobile = innerWidth <= 760, open = document.body.classList.contains("panel-open")
    if (mobile) return { tl: [24, 110], br: [24, open ? 340 : 90] }
    return { tl: [40, 100], br: [open ? 460 : 90, 60] }
  }

  flyTo(lat, lng, zoom) {
    const pad = this.viewPadding()
    const target = this.map.project([lat, lng], zoom)
    const offX = (pad.br[0] - pad.tl[0]) / 2, offY = (pad.br[1] - pad.tl[1]) / 2
    this.map.flyTo(this.map.unproject(target.add([offX, offY]), zoom), zoom, { duration: 0.9 })
  }

  flyToBounds(bounds, maxZoom) {
    const pad = this.viewPadding()
    this.map.flyToBounds(bounds, { paddingTopLeft: pad.tl, paddingBottomRight: pad.br, maxZoom, duration: 0.9 })
  }

  fitPoints(points, maxZoom = 15) {
    if (!points.length) return
    this.flyToBounds(L.latLngBounds(points.map(p => [p.lat, p.lng])), maxZoom)
  }

  panToPoint(p) { this.flyTo(p.lat, p.lng, Math.max(this.map.getZoom(), 13.5)) }
}

/* ---------- 5. Toast ---------- */
class Toast {
  constructor(el) { this.el = el; this.timer = null }

  show({ msg, sub = "", kind = "ok", ms = 3200 }) {
    clearTimeout(this.timer)
    this.el.innerHTML = `${icon(kind === "ok" ? "check" : "info", "t-ico " + (kind === "ok" ? "" : "warn"))}<div class="t-msg">${esc(msg)}${sub ? `<small>${esc(sub)}</small>` : ""}</div>`
    this.el.classList.add("show")
    this.timer = setTimeout(() => this.hide(), ms)
  }

  hide() { this.el.classList.remove("show") }
  destroy() { clearTimeout(this.timer) }
}

/* ---------- 6. Painel de detalhes ---------- */
class PanelUI {
  constructor(root, app) {
    this.app = app
    this.panel = $("#panel", root)
    this.scroll = $("#panel-scroll", root)
    this.body = $("#panel-body", root)
    this.timers = []
    $("#panel-close", root).onclick = () => app.deselect()
    this.bindSheet($("#sheet-handle", root))
    addEventListener("resize", () => this.setPeek(), { signal: app.signal })
  }

  isMobile() { return innerWidth <= 760 }
  destroy() { this.timers.forEach(clearTimeout) }

  routeUrl(place) {
    const origin = this.app.state.user ? `&origin=${this.app.state.user.lat},${this.app.state.user.lng}` : ""
    return `https://www.google.com/maps/dir/?api=1${origin}&destination=${place.lat},${place.lng}&travelmode=driving`
  }

  render(place) {
    const { state } = this.app
    const hasHours = place.opening_hours.length > 0
    const status = hasHours ? openStatus(place.opening_hours) : null
    const { day } = nowInSaoPaulo()
    const ref = state.user || state.ref
    const distance = ref ? haversineKm(ref, place) : null
    const a = place.address
    const phone = place.contacts.find(c => c.kind === "phone")
    const whatsapp = place.contacts.find(c => c.kind === "whatsapp")
    const contactButtons = [
      phone && `<a class="btn btn-ghost" href="${esc(safeHref(phone.href))}">${icon("phone")}Ligar</a>`,
      whatsapp && `<a class="btn btn-ghost wa" href="${esc(safeHref(whatsapp.href))}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp</a>`
    ].filter(Boolean)
    const contactItems = place.contacts.map(c => {
      const meta = CONTACT_META[c.kind] || CONTACT_META.website
      const target = meta.external ? ' target="_blank" rel="noopener"' : ""
      return `<a class="contact" href="${esc(safeHref(c.href))}"${target}><span class="c-ico ${meta.cls || ""}">${icon(meta.icon)}</span><span><span class="c-label">${meta.label}</span><span class="c-val">${esc(c.display || c.value)}</span></span></a>`
    })
    const streetLine = [[a.street, a.number].filter(Boolean).join(", "), a.complement].filter(Boolean).join(" – ")
    const localityLine = [a.neighborhood, [a.city, a.state].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")
    const days = intervalsByDay(place.opening_hours)

    this.body.innerHTML = `
      <div class="panel-head" id="panel-head">
        <div class="p-eyebrow">${icon("recycle")}${esc(place.kind_label)}</div>
        <h2 class="p-name" id="panel-title">${esc(place.name)}</h2>
        <div class="p-meta">
          ${status ? `<span class="status ${status.cls}">${esc(status.text)}</span>` : ""}
          ${distance != null ? `<span class="p-dist">${fmtKm(distance)} ${state.user ? "de você" : "do local buscado"}</span>` : ""}
        </div>
        ${place.description ? `<p class="p-desc">${esc(place.description)}</p>` : ""}
      </div>
      <div class="p-actions" id="panel-actions">
        <a class="btn btn-primary" id="btn-route" href="${esc(this.routeUrl(place))}" target="_blank" rel="noopener">${icon("route")}Como chegar</a>
        <button class="btn btn-secondary" id="btn-share" type="button">${icon("share")}<span>Compartilhar endereço</span></button>
        ${contactButtons.length ? `<div class="btn-row ${contactButtons.length === 1 ? "single" : ""}">${contactButtons.join("")}</div>` : ""}
      </div>
      <section class="p-sec" aria-labelledby="sec-end">
        <h3 class="p-sec-title" id="sec-end">${icon("pin")}Endereço</h3>
        <div class="addr">
          <div class="addr-text">${streetLine ? `<b>${esc(streetLine)}</b>` : ""}<span>${esc(localityLine)}${a.zip_code ? `${localityLine ? "<br>" : ""}CEP ${esc(a.zip_code)}` : ""}</span></div>
          <button class="btn-copy" id="btn-copy" type="button" aria-label="Copiar endereço completo">${icon("copy")}<span>Copiar</span></button>
        </div>
      </section>
      ${place.materials.length ? `<section class="p-sec" aria-labelledby="sec-mat">
        <h3 class="p-sec-title" id="sec-mat">${icon("leaf")}Materiais aceitos</h3>
        <div class="chips">${place.materials.map(m => `<span class="chip">${icon(MATERIAL_ICON[m.key])}${esc(m.name)}</span>`).join("")}</div>
        <p class="chips-note">Este ponto aceita apenas os materiais acima. Confira antes de levar seu descarte.</p>
      </section>` : ""}
      ${hasHours ? `<section class="p-sec" aria-labelledby="sec-hor">
        <h3 class="p-sec-title" id="sec-hor">${icon("clock")}Horário de funcionamento</h3>
        <ul class="hours">${WEEK_ORDER.map(d => {
          const list = days[d]
          const text = list.length ? list.map(h => `${h.opens_at} – ${h.closes_at}`).join(", ") : "Fechado"
          return `<li class="${list.length ? "" : "closed"} ${d === day ? "today" : ""}"><span>${WEEKDAYS[d]}</span><span>${esc(text)}</span></li>`
        }).join("")}</ul>
      </section>` : ""}
      ${contactItems.length ? `<section class="p-sec" aria-labelledby="sec-con"><h3 class="p-sec-title" id="sec-con">${icon("phone")}Contato</h3><div class="contacts">${contactItems.join("")}</div></section>` : ""}`

    $("#btn-share", this.body).onclick = () => this.share(place)
    $("#btn-copy", this.body).onclick = () => this.copyAddress(place)
  }

  flash(btn, doneText, doneIcon, restoreText, restoreIcon, ms) {
    btn.classList.add("done")
    btn.querySelector("span").textContent = doneText
    btn.querySelector("svg").outerHTML = icon(doneIcon)
    this.timers.push(setTimeout(() => {
      if (!btn.isConnected) return
      btn.classList.remove("done")
      btn.querySelector("span").textContent = restoreText
      btn.querySelector("svg").outerHTML = icon(restoreIcon)
    }, ms))
  }

  async share(place) {
    const text = `${place.name}\n${place.address.full}`
    const url = mapsLink(place)
    if (navigator.share) {
      try {
        await navigator.share({ title: `${place.name} · OndeDescartar`, text, url })
        return
      } catch (error) {
        if (isAbort(error)) return
      }
    }
    const ok = await copyText(`${text}\n${url}`)
    if (ok) {
      const btn = $("#btn-share", this.body)
      if (btn) this.flash(btn, "Endereço e link copiados", "check", "Compartilhar endereço", "share", 2400)
      this.app.toast.show({ msg: "Endereço e link copiados", sub: "Pronto para colar e enviar." })
    } else {
      this.app.toast.show({ kind: "warn", msg: "Não foi possível copiar automaticamente", sub: `${place.address.full} · ${url}`, ms: 8000 })
    }
  }

  async copyAddress(place) {
    const ok = await copyText(place.address.full)
    if (ok) {
      const btn = $("#btn-copy", this.body)
      if (btn) this.flash(btn, "Copiado", "check", "Copiar", "copy", 2000)
    } else {
      this.app.toast.show({ kind: "warn", msg: "Não foi possível copiar", sub: place.address.full, ms: 7000 })
    }
  }

  setPeek() {
    if (!this.isMobile()) return
    const head = $("#panel-head", this.body), actions = $("#panel-actions", this.body)
    const h = 26 + (head ? head.offsetHeight : 0) + (actions ? actions.offsetHeight : 0) + 12
    this.panel.style.setProperty("--peek", Math.min(h, innerHeight * 0.6) + "px")
  }

  open(place) {
    this.render(place)
    this.scroll.scrollTop = 0
    this.panel.classList.remove("expanded")
    this.panel.classList.add("open")
    this.panel.setAttribute("aria-hidden", "false")
    document.body.classList.add("panel-open")
    requestAnimationFrame(() => this.setPeek())
  }

  close() {
    this.panel.classList.remove("open", "expanded")
    this.panel.setAttribute("aria-hidden", "true")
    document.body.classList.remove("panel-open")
    this.panel.style.transform = ""
  }

  bindSheet(handle) {
    const panel = this.panel
    let startY = 0, startT = 0, dragging = false, moved = false, base = 0
    const current = () => new DOMMatrixReadOnly(getComputedStyle(panel).transform).m42
    const peekY = () => panel.offsetHeight - parseFloat(getComputedStyle(panel).getPropertyValue("--peek"))
    const start = y => { if (!this.isMobile()) return; dragging = true; moved = false; startY = y; startT = Date.now(); base = current(); panel.classList.add("dragging") }
    const move = y => { if (!dragging) return; const dy = y - startY; if (Math.abs(dy) > 4) moved = true; panel.style.transform = `translateY(${Math.max(0, base + dy)}px)` }
    const end = y => {
      if (!dragging) return
      dragging = false
      panel.classList.remove("dragging")
      panel.style.transform = ""
      const dy = y - startY, v = dy / Math.max(1, Date.now() - startT)
      if (!moved) { panel.classList.toggle("expanded"); return }
      const pos = base + dy
      if (v > 0.6 || pos > peekY() + 80) {
        if (panel.classList.contains("expanded") && pos < peekY() + 80) panel.classList.remove("expanded")
        else this.app.deselect()
      } else if (v < -0.4 || pos < peekY() / 2) panel.classList.add("expanded")
      else panel.classList.remove("expanded")
    }
    handle.addEventListener("pointerdown", e => { handle.setPointerCapture(e.pointerId); start(e.clientY) })
    handle.addEventListener("pointermove", e => move(e.clientY))
    handle.addEventListener("pointerup", e => end(e.clientY))
    handle.addEventListener("pointercancel", () => end(startY))
    handle.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); panel.classList.toggle("expanded") } })
    panel.addEventListener("click", e => {
      if (this.isMobile() && !panel.classList.contains("expanded") && e.target.closest("#panel-head") && !e.target.closest("button,a")) panel.classList.add("expanded")
    })
  }
}

/* ---------- 7. Faixa "ponto mais próximo" ---------- */
class Nearby {
  constructor(root, app) {
    this.el = $("#nearby", root)
    this.app = app
    this.timer = null
  }

  destroy() { clearTimeout(this.timer) }
  hide() { clearTimeout(this.timer); this.el.classList.remove("show") }

  show(ref, refLabel) {
    const { points } = this.app.state
    if (!points.length) return
    clearTimeout(this.timer)
    const ranked = points.map(p => [haversineKm(ref, p), p]).sort((a, b) => a[0] - b[0])
    const [km, place] = ranked[0]
    if (km > 35) {
      this.el.innerHTML = `<span class="nb-ico">${icon("info")}</span><span class="nb-text"><b>Nenhum ponto cadastrado por aqui</b></span><button class="nb-btn" type="button">Ver todos</button><button class="nb-x" type="button" aria-label="Fechar">${icon("x")}</button>`
      $(".nb-btn", this.el).onclick = () => { this.hide(); this.app.overview() }
    } else {
      const near = ranked.filter(r => r[0] <= 3).length
      this.el.innerHTML = `<span class="nb-ico">${icon("recycle")}</span><span class="nb-text"><b>${esc(place.name)}</b>Mais próximo ${esc(refLabel)} · ${fmtKm(km)}${near > 1 ? ` · ${near} pontos a até 3 km` : ""}</span><button class="nb-btn" type="button">Ver</button><button class="nb-x" type="button" aria-label="Fechar">${icon("x")}</button>`
      $(".nb-btn", this.el).onclick = () => { this.hide(); this.app.select(place.id) }
      if (km > 0.6) {
        const frame = [ref, ...ranked.slice(0, Math.max(1, Math.min(3, near))).map(r => r[1])]
        this.timer = setTimeout(() => this.app.mapView.fitPoints(frame, 14.5), 950)
      }
    }
    $(".nb-x", this.el).onclick = () => this.hide()
    this.el.classList.add("show")
  }
}

/* ---------- 8. Busca ---------- */
const SEARCH_TYPE = {
  house: ["pin", "Endereço"], street: ["road", "Rua"], neighbourhood: ["building", "Bairro"],
  city: ["city", "Cidade"], state: ["map", "Estado"], place: ["pin", "Local"]
}

class SearchUI {
  constructor(root, app) {
    this.app = app
    this.geocoder = new Geocoder()
    this.wrap = $("#search", root)
    this.input = $("#q", root)
    this.list = $("#suggest", root)
    this.clear = $("#q-clear", root)
    this.results = []
    this.active = -1
    this.timer = null
    this.bind(root)
  }

  destroy() {
    clearTimeout(this.timer)
    this.geocoder.cancel()
  }

  highlight(label, q) {
    const words = norm(q).split(" ").filter(w => w.length > 1 && !/^\d+$/.test(w))
    if (!words.length) return esc(label)
    const plain = label.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    if (plain.length !== label.length) return esc(label)
    const marks = new Array(label.length).fill(false)
    words.forEach(w => { const i = plain.indexOf(w); if (i >= 0) for (let k = i; k < i + w.length; k++) marks[k] = true })
    let out = "", on = false
    ;[...label].forEach((ch, i) => {
      if (marks[i] && !on) { out += "<mark>"; on = true }
      if (!marks[i] && on) { out += "</mark>"; on = false }
      out += esc(ch)
    })
    return on ? out + "</mark>" : out
  }

  open(html) {
    this.list.innerHTML = html
    this.wrap.classList.add("open")
    this.input.setAttribute("aria-expanded", "true")
  }

  close() {
    this.wrap.classList.remove("open")
    this.input.setAttribute("aria-expanded", "false")
  }

  renderResults(q) {
    if (!this.results.length) {
      this.open(`<div class="sg-empty">Nada encontrado para <b>“${esc(q)}”</b>.<br>Tente um bairro, cidade, estado, CEP ou rua conhecida.</div>`)
      return
    }
    this.open(this.results.map((r, i) => {
      const [ico, typeLabel] = SEARCH_TYPE[r.type] || SEARCH_TYPE.place
      return `<button type="button" role="option" id="sg-${i}" class="sg-item ${i === this.active ? "active" : ""}" data-i="${i}" aria-selected="${i === this.active}">
        <span class="sg-ico">${icon(ico)}</span>
        <span class="sg-text"><span class="sg-title">${this.highlight(r.label, q)}</span><span class="sg-sub">${esc(r.sub)}</span></span>
        <span class="sg-type">${typeLabel}</span></button>`
    }).join(""))
    this.input.setAttribute("aria-activedescendant", this.active >= 0 ? `sg-${this.active}` : "")
  }

  async run() {
    clearTimeout(this.timer)
    this.timer = null
    const q = this.input.value.trim()
    if (q.length < 3) { this.geocoder.cancel(); this.close(); return }
    this.open('<div class="sg-empty">Buscando...</div>')
    try {
      this.results = await this.geocoder.search(q)
    } catch (error) {
      if (isAbort(error)) return
      this.results = []
      this.open('<div class="sg-empty">Não foi possível buscar agora. Verifique sua conexão e tente novamente.</div>')
      return
    }
    this.active = this.results.length ? 0 : -1
    this.renderResults(q)
  }

  schedule() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.run(), 600)
  }

  choose(r) {
    this.input.value = r.label
    this.close()
    this.input.blur()
    this.app.goToPlace(r)
  }

  reset() {
    clearTimeout(this.timer)
    this.timer = null
    this.geocoder.cancel()
    this.input.value = ""
    this.results = []
    this.clear.classList.remove("show")
    this.close()
    this.app.clearSearch()
    this.input.focus()
  }

  bind(root) {
    const { input, list } = this
    input.addEventListener("input", () => { this.clear.classList.toggle("show", !!input.value); this.schedule() })
    input.addEventListener("focus", () => { if (this.results.length && input.value.trim().length >= 3) this.renderResults(input.value) })
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown" && this.results.length) { e.preventDefault(); this.active = (this.active + 1) % this.results.length; this.renderResults(input.value) }
      else if (e.key === "ArrowUp" && this.results.length) { e.preventDefault(); this.active = (this.active - 1 + this.results.length) % this.results.length; this.renderResults(input.value) }
      else if (e.key === "Enter") {
        e.preventDefault()
        if (this.timer === null && this.results[this.active]) this.choose(this.results[this.active])
        else this.run()
      }
      else if (e.key === "Escape") { this.close(); input.blur() }
    })
    list.addEventListener("mousedown", e => e.preventDefault())
    list.addEventListener("click", e => { const b = e.target.closest(".sg-item"); if (b) this.choose(this.results[+b.dataset.i]) })
    this.clear.onclick = () => this.reset()
    document.addEventListener("pointerdown", e => { if (!this.wrap.contains(e.target)) this.close() }, { signal: this.app.signal })
    $("#search-form", root).addEventListener("submit", e => e.preventDefault())
  }
}

/* ---------- 9. Controller ---------- */
export default class extends Controller {
  static values = { url: String }

  connect() {
    this.abort = new AbortController()
    this.signal = this.abort.signal
    this.state = { points: [], byId: new Map(), selected: null, user: null, ref: null }
    this.timers = []
    this.mapView = new MapView($("#map", this.element))
    this.toast = new Toast($("#toast", this.element))
    this.panelUI = new PanelUI(this.element, this)
    this.nearby = new Nearby(this.element, this)
    this.searchUI = new SearchUI(this.element, this)
    this.mountChrome()
    this.loadPoints()
  }

  disconnect() {
    this.abort.abort()
    this.timers.forEach(clearTimeout)
    this.searchUI.destroy()
    this.nearby.destroy()
    this.panelUI.destroy()
    this.toast.destroy()
    document.body.classList.remove("panel-open")
    this.mapView.destroy()
  }

  mountChrome() {
    const root = this.element
    $("#ico-search", root).innerHTML = icon("search")
    $("#q-clear", root).innerHTML = icon("x")
    $("#panel-close", root).innerHTML = icon("x")
    $("#c-locate", root).innerHTML = icon("locate")
    $("#c-in", root).innerHTML = icon("plus")
    $("#c-out", root).innerHTML = icon("minus")
    $("#c-all", root).innerHTML = icon("overview")
    $("#c-locate", root).onclick = e => this.locate(e.currentTarget)
    $("#c-in", root).onclick = () => this.mapView.map.zoomIn(1)
    $("#c-out", root).onclick = () => this.mapView.map.zoomOut(1)
    $("#c-all", root).onclick = () => { this.deselect(); this.nearby.hide(); this.overview() }
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && this.state.selected && document.activeElement !== $("#q", root)) this.deselect()
    }, { signal: this.signal })
    this.mapView.map.on("click", () => { if (this.state.selected) this.deselect() })
  }

  async loadPoints() {
    try {
      const response = await fetch(this.urlValue, { headers: { Accept: "application/json" }, signal: this.signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      this.state.points = await response.json()
    } catch (error) {
      if (isAbort(error)) return
      this.toast.show({ kind: "warn", msg: "Não foi possível carregar os pontos de descarte.", ms: 8000 })
      return
    }
    this.state.points.forEach(p => this.state.byId.set(p.id, p))
    this.mapView.setPoints(this.state.points, id => this.select(id))
    this.mapView.fitInitial(this.state.points)
  }

  later(fn, ms) { this.timers.push(setTimeout(fn, ms)) }

  select(id) {
    const place = this.state.byId.get(id)
    if (!place) return
    this.state.selected = id
    this.mapView.select(id)
    this.panelUI.open(place)
    this.nearby.hide()
    this.later(() => this.mapView.panToPoint(place), 30)
  }

  deselect() {
    this.state.selected = null
    this.mapView.select(null)
    this.panelUI.close()
  }

  overview() { this.mapView.fitPoints(this.state.points, 13) }

  goToPlace(r) {
    this.deselect()
    this.mapView.showPlace(r)
    const zoom = ZOOM_BY_KIND[r.type] || 14
    if (r.bounds) this.mapView.flyToBounds(r.bounds, zoom)
    else this.mapView.flyTo(r.lat, r.lng, zoom)
    this.state.ref = { lat: r.lat, lng: r.lng }
    this.nearby.show(this.state.ref, "do local buscado")
  }

  clearSearch() {
    this.mapView.clearPlace()
    this.nearby.hide()
    this.state.ref = null
  }

  setUser(pos) {
    this.state.user = pos
    this.mapView.showUser(pos)
    this.mapView.flyTo(pos.lat, pos.lng, 14)
    this.nearby.show(pos, "de você")
  }

  locate(btn) {
    const fail = () => {
      btn.classList.remove("locating")
      this.toast.show({ kind: "warn", msg: "Não conseguimos acessar sua localização. Você pode buscar um endereço no campo acima.", ms: 9000 })
    }
    if (!("geolocation" in navigator)) return fail()
    btn.classList.add("locating")
    navigator.geolocation.getCurrentPosition(
      p => {
        if (!btn.isConnected) return
        btn.classList.remove("locating")
        btn.classList.add("located")
        this.setUser({ lat: p.coords.latitude, lng: p.coords.longitude })
      },
      () => { if (btn.isConnected) fail() },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    )
  }
}
