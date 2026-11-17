require "test_helper"

class AddressTest < ActiveSupport::TestCase
  def build_address(**attrs)
    Address.new({
      place: places(:bem_te_vi), street: "Rua A", number: "s/n", neighborhood: "Centro",
      city: "São Paulo", state: "SP", zip_code: "04101-000", latitude: -23.5, longitude: -46.6
    }.merge(attrs))
  end

  test "zip code keeps only digits" do
    address = build_address(zip_code: "04101-000")
    address.valid?
    assert_equal "04101000", address.zip_code
  end

  test "zip code with 7 digits is invalid" do
    address = build_address(zip_code: "0410100")
    assert_not address.valid?
    assert address.errors.key?(:zip_code)
  end

  test "state is upcased" do
    address = build_address(state: " sp ")
    address.valid?
    assert_equal "SP", address.state
  end

  test "unknown state is invalid" do
    assert_not build_address(state: "XX").valid?
  end

  test "latitude out of range is invalid" do
    address = build_address(latitude: 95)
    assert_not address.valid?
    assert address.errors.key?(:latitude)
  end

  test "formats zip and full address" do
    address = addresses(:bem_te_vi)
    assert_equal "04101-000", address.formatted_zip
    assert_equal "Rua das Embaúbas, 480 – Vila Mariana, São Paulo – SP, 04101-000", address.full_address
  end
end
