class OpeningHour < ApplicationRecord
  belongs_to :place

  validates :weekday, presence: true, inclusion: { in: 0..6, allow_nil: true }
  validates :opens_at, :closes_at, presence: true
  validate :closes_after_opens

  def self.weekday_name(weekday)
    I18n.t("date.day_names")[weekday].capitalize
  end

  def self.weekday_options
    (0..6).map { |weekday| [ weekday_name(weekday), weekday ] }
  end

  def as_map_json
    { weekday: weekday, opens_at: opens_at.strftime("%H:%M"), closes_at: closes_at.strftime("%H:%M") }
  end

  private

  def closes_after_opens
    return if opens_at.blank? || closes_at.blank?

    errors.add(:closes_at, :after_opens_at) unless closes_at > opens_at
  end
end
