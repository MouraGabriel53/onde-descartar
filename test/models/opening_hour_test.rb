require "test_helper"

class OpeningHourTest < ActiveSupport::TestCase
  def build_hour(**attrs)
    OpeningHour.new({ place: places(:bem_te_vi), weekday: 2, opens_at: "08:00", closes_at: "12:00" }.merge(attrs))
  end

  test "valid interval" do
    assert build_hour.valid?
  end

  test "closes_at equal to opens_at is invalid" do
    assert_not build_hour(closes_at: "08:00").valid?
  end

  test "closes_at before opens_at is invalid" do
    assert_not build_hour(closes_at: "07:00").valid?
  end

  test "weekday 7 is invalid" do
    assert_not build_hour(weekday: 7).valid?
  end

  test "check constraint rejects inverted interval in the database" do
    hour = build_hour(closes_at: "07:00")
    assert_raises(ActiveRecord::StatementInvalid) { hour.save!(validate: false) }
  end
end
