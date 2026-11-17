class Contact < ApplicationRecord
  enum :kind, { phone: "phone", whatsapp: "whatsapp", email: "email", website: "website" }, validate: true

  belongs_to :place

  before_validation :normalize_value

  validates :value, presence: true
  validates :value, uniqueness: { scope: [ :place_id, :kind ] }, if: -> { place_id.present? && value.present? }
  validate :value_matches_kind

  def self.kind_label(kind)
    I18n.t("activerecord.attributes.contact.kinds.#{kind}")
  end

  def self.kind_options
    kinds.keys.map { |kind| [ kind_label(kind), kind ] }
  end

  def normalize_value
    return if value.nil? || kind.blank?

    self.value = normalized(value)
  end

  def display_value
    case kind
    when "phone", "whatsapp" then format_phone
    when "website" then value.sub(%r{\Ahttps?://}i, "").chomp("/")
    else value
    end
  end

  def href
    case kind
    when "phone" then "tel:#{value}"
    when "whatsapp" then "https://wa.me/#{value.delete('+')}"
    when "email" then "mailto:#{value}"
    when "website" then value
    end
  end

  def as_map_json
    { kind: kind, value: value, display: display_value, href: href }
  end

  private

  def normalized(raw)
    case kind
    when "phone", "whatsapp"
      digits = raw.to_s.gsub(/\D/, "")
      digits.length.between?(10, 11) ? "+55#{digits}" : (raw.to_s.strip.start_with?("+") ? "+#{digits}" : digits)
    when "email"
      raw.to_s.strip.downcase
    when "website"
      url = raw.to_s.strip
      url.blank? || url.match?(%r{\A[a-z][a-z0-9+\-.]*://}i) ? url : "https://#{url}"
    else
      raw
    end
  end

  def value_matches_kind
    return if value.blank? || kind.blank?

    valid = case kind
    when "phone" then value.match?(/\A\+55\d{10,11}\z/)
    when "whatsapp" then value.match?(/\A\+55\d{2}9\d{8}\z/)
    when "email" then value.match?(URI::MailTo::EMAIL_REGEXP)
    when "website" then valid_url?
    end
    errors.add(:value, :"invalid_#{kind}") unless valid
  end

  def valid_url?
    uri = URI.parse(value)
    %w[http https].include?(uri.scheme&.downcase) && uri.host.present?
  rescue URI::InvalidURIError
    false
  end

  def format_phone
    digits = value.to_s.delete_prefix("+55")
    case digits.length
    when 10 then "(#{digits[0, 2]}) #{digits[2, 4]}-#{digits[6, 4]}"
    when 11 then "(#{digits[0, 2]}) #{digits[2, 5]}-#{digits[7, 4]}"
    else value
    end
  end
end
