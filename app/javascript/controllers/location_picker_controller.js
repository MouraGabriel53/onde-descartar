import { Controller } from "@hotwired/stimulus"

const DEFAULT_CENTER = [-23.55, -46.63]

export default class extends Controller {
  static targets = ["map", "latitude", "longitude"]

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
