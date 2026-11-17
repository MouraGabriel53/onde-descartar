class Place < ApplicationRecord
  enum :kind, {
    ecopoint: "ecopoint",
    cooperative: "cooperative",
    drop_off_point: "drop_off_point",
    partner_store: "partner_store"
  }, validate: true

  has_one :address, dependent: :destroy
  has_many :contacts, dependent: :destroy
  has_many :opening_hours, dependent: :destroy
  has_many :place_materials, dependent: :destroy
  has_many :materials, through: :place_materials

  accepts_nested_attributes_for :address
  accepts_nested_attributes_for :contacts, :opening_hours, allow_destroy: true, reject_if: :all_blank

  scope :active, -> { where(active: true) }

  validates :name, presence: true, length: { in: 2..120 }
  validates :description, length: { maximum: 1000 }
  validates :address, presence: true
  validate :must_have_materials
  validate :opening_hours_do_not_overlap
  validate :contacts_are_unique

  def self.kind_label(kind)
    I18n.t("activerecord.attributes.place.kinds.#{kind}")
  end

  def self.kind_options
    kinds.keys.map { |kind| [ kind_label(kind), kind ] }
  end

  def kind_label
    self.class.kind_label(kind) if kind.present?
  end

  def as_map_json
    {
      id: id,
      name: name,
      kind: kind,
      kind_label: kind_label,
      description: description.presence,
      lat: address.latitude.to_f,
      lng: address.longitude.to_f,
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement.presence,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zip_code: address.formatted_zip,
        full: address.full_address
      },
      materials: materials.sort_by(&:name).map { |material| { key: material.key, name: material.name, notice: material.notice } },
      opening_hours: opening_hours.sort_by { |hour| [ hour.weekday, hour.opens_at ] }.map(&:as_map_json),
      contacts: contacts.sort_by(&:id).map(&:as_map_json)
    }
  end

  private

  def must_have_materials
    errors.add(:materials, :at_least_one) if materials.empty?
  end

  def opening_hours_do_not_overlap
    hours = opening_hours.reject(&:marked_for_destruction?).select { |hour| hour.weekday && hour.opens_at && hour.closes_at }
    hours.group_by(&:weekday).each_value do |day_hours|
      day_hours.sort_by(&:opens_at).each_cons(2) do |previous, current|
        next unless current.opens_at < previous.closes_at

        current.errors.add(:opens_at, :overlap)
        errors.add(:opening_hours, :overlap, weekday: OpeningHour.weekday_name(current.weekday))
      end
    end
  end

  def contacts_are_unique
    seen = {}
    contacts.reject(&:marked_for_destruction?).each do |contact|
      contact.normalize_value
      key = [ contact.kind, contact.value ]
      next if contact.value.blank?

      if seen[key]
        contact.errors.add(:value, :taken)
        errors.add(:contacts, :duplicate, value: contact.value)
      end
      seen[key] = true
    end
  end
end
