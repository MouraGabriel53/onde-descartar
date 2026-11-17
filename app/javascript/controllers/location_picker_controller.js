import { Controller } from "@hotwired/stimulus"

const DEFAULT_CENTER = [-23.55, -46.63]
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&accept-language=pt-BR"

export default class extends Controller {
  static targets = ["map", "latitude", "longitude", "zip", "street", "number", "neighborhood", "city", "state", "zipStatus"]

  connect() {
    const point = this.#currentPoint()
    this.map = L.map(this.mapTarget).setView(point || DEFAULT_CENTER, point ? 16 : 11)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors"
    }).addTo(this.map)

    this.map.on("click", (event) => this.#pick(event.latlng.lat, event.latlng.lng))
    if (point) this.#placeMarker(point[0], point[1])

    this.resizeTimer = setTimeout(() => this.map?.invalidateSize(), 0)
  }

  disconnect() {
    this.request?.abort()
    clearTimeout(this.resizeTimer)
    this.map?.remove()
    this.map = null
    this.marker = null
  }

  fieldsChanged() {
    const point = this.#currentPoint()
    if (!point) return

    this.#placeMarker(point[0], point[1])
    this.map.panTo(point)
  }

  async zipChanged() {
    const zip = this.zipTarget.value.replace(/\D/g, "")
    if (zip.length !== 8 || zip === this.lastZip) return

    this.lastZip = zip
    const signal = this.#newRequest()
    this.#status("Buscando CEP...")
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`, { signal })
      const data = response.ok ? await response.json() : { erro: true }
      if (data.erro) {
        this.lastZip = null
        this.#status("CEP não encontrado. Preencha o endereço manualmente.", true)
        return
      }

      this.#fill(this.streetTarget, data.logradouro)
      this.#fill(this.neighborhoodTarget, data.bairro)
      this.#fill(this.cityTarget, data.localidade)
      this.#fill(this.stateTarget, data.uf)
      if (data.logradouro && !this.numberTarget.value) this.numberTarget.focus()
      await this.#locate(signal)
    } catch (error) {
      if (error.name === "AbortError") return
      this.lastZip = null
      this.#status("Não foi possível consultar o CEP agora. Preencha o endereço manualmente.", true)
    }
  }

  async numberChanged() {
    if (!this.streetTarget.value || !this.cityTarget.value) return

    try {
      await this.#locate(this.#newRequest())
    } catch (error) {
      if (error.name !== "AbortError") this.#status("Não foi possível localizar o endereço no mapa.", true)
    }
  }

  async #locate(signal) {
    const [street, number, neighborhood, city, state] = [this.streetTarget, this.numberTarget, this.neighborhoodTarget, this.cityTarget, this.stateTarget].map(f => f.value.trim())
    const area = [neighborhood, city, state].filter(Boolean)
    const attempts = [
      { parts: street && /^\d/.test(number) ? [`${street}, ${number}`, ...area] : [], zoom: 17, precise: true },
      { parts: street ? [street, ...area] : [], zoom: 17, precise: false },
      { parts: [city, state].filter(Boolean), zoom: 13, precise: false }
    ].filter(attempt => attempt.parts.length)

    this.#status("Localizando no mapa...")
    for (const { parts, zoom, precise } of attempts) {
      const response = await fetch(`${NOMINATIM_URL}&q=${encodeURIComponent(parts.join(", "))}`, { signal, headers: { Accept: "application/json" } })
      const [result] = response.ok ? await response.json() : []
      if (!result) continue

      this.#pick(+result.lat, +result.lon)
      this.map.setView([+result.lat, +result.lon], zoom)
      this.#status(precise
        ? "Endereço preenchido. Confira a posição no mapa e arraste o marcador se precisar."
        : "Endereço preenchido. Posição aproximada: digite o número ou arraste o marcador até o local exato.")
      return
    }
    this.#status("Endereço preenchido, mas não achamos o local no mapa. Clique no mapa para marcar.", true)
  }

  #newRequest() {
    this.request?.abort()
    this.request = new AbortController()
    return this.request.signal
  }

  #fill(field, value) {
    if (value) field.value = value
  }

  #status(message, isError = false) {
    if (!this.hasZipStatusTarget) return

    this.zipStatusTarget.textContent = message
    this.zipStatusTarget.classList.toggle("is-error", isError)
  }

  #pick(lat, lng) {
    this.#fillFields(lat, lng)
    this.#placeMarker(lat, lng)
  }

  #placeMarker(lat, lng) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng])
      return
    }

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map)
    this.marker.on("dragend", () => {
      const { lat, lng } = this.marker.getLatLng()
      this.#fillFields(lat, lng)
    })
  }

  #fillFields(lat, lng) {
    this.latitudeTarget.value = lat.toFixed(6)
    this.longitudeTarget.value = lng.toFixed(6)
  }

  #currentPoint() {
    const lat = parseFloat(this.latitudeTarget.value)
    const lng = parseFloat(this.longitudeTarget.value)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
    return [lat, lng]
  }
}
