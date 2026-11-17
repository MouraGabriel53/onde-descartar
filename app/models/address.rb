class Address < ApplicationRecord
  STATES = %w[AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO].freeze

  belongs_to :place

  before_validation :normalize_fields

  validates :street, :number, :neighborhood, :city, presence: true
  validates :state, presence: true, inclusion: { in: STATES, allow_blank: true }
  validates :zip_code, presence: true, format: { with: /\A\d{8}\z/, allow_blank: true }
  validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90, allow_nil: true }
  validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180, allow_nil: true }

  def formatted_zip
    return zip_code unless zip_code.to_s.match?(/\A\d{8}\z/)

    "#{zip_code[0, 5]}-#{zip_code[5, 3]}"
  end

  def full_address
    first_line = [ street, number, complement.presence ].compact.join(", ")
    "#{first_line} – #{neighborhood}, #{city} – #{state}, #{formatted_zip}"
  end

  private

  def normalize_fields
    self.zip_code = zip_code.to_s.gsub(/\D/, "") unless zip_code.nil?
    self.state = state.to_s.upcase.strip unless state.nil?
  end
end
