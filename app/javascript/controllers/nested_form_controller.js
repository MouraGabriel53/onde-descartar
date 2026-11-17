import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "template"]

  connect() {
    this.counter = 0
  }

  add(event) {
    event?.preventDefault()
    return this.#appendRow()
  }

  addMany(event) {
    event.preventDefault()
    const { weekdays, opensAt, closesAt } = event.params
    String(weekdays).split(",").forEach((weekday) => {
      const row = this.#appendRow()
      this.#setValue(row, "weekday", weekday)
      this.#setValue(row, "opens_at", opensAt)
      this.#setValue(row, "closes_at", closesAt)
    })
  }

  remove(event) {
    event.preventDefault()
    const row = event.target.closest("[data-nested-form-target='row']")
    if (!row) return

    const persisted = row.querySelector("input[type='hidden'][name$='[id]']")
    const destroy = row.querySelector("input[data-nested-form-target='destroy']")
    if (persisted && destroy) {
      destroy.value = "1"
      row.hidden = true
    } else {
      row.remove()
    }
  }

  #appendRow() {
    this.counter += 1
    const uniqueId = `${Date.now()}${this.counter}`
    const html = this.templateTarget.innerHTML.replaceAll("NEW_RECORD", uniqueId)
    this.containerTarget.insertAdjacentHTML("beforeend", html)
    return this.containerTarget.lastElementChild
  }

  #setValue(row, attribute, value) {
    const field = row.querySelector(`[name$='[${attribute}]']`)
    if (field) field.value = value
  }
}
