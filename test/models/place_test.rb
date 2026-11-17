require "test_helper"

class PlaceTest < ActiveSupport::TestCase
  def build_place(**attrs)
    Place.new({
      name: "Ecoponto Teste",
      kind: "ecopoint",
      material_ids: [ materials(:paper).id ],
      address_attributes: {
        street: "Rua A", number: "10", neighborhood: "Centro", city: "São Paulo",
        state: "SP", zip_code: "01001-000", latitude: -23.55, longitude: -46.63
      }
    }.merge(attrs))
  end

  test "valid with name, address and materials" do
    assert build_place.valid?
  end

  test "invalid without name" do
    assert_not build_place(name: "").valid?
  end

  test "invalid without address" do
    place = build_place
    place.address = nil
    assert_not place.valid?
    assert place.errors.key?(:address)
  end

  test "invalid without materials" do
    place = build_place(material_ids: [])
    assert_not place.valid?
    assert place.errors.added?(:materials, :at_least_one)
  end

  test "invalid kind is rejected" do
    place = build_place(kind: "volcano")
    assert_not place.valid?
    assert place.errors.key?(:kind)
  end

  test "overlapping opening hours on the same day are invalid" do
    place = build_place(opening_hours_attributes: [
      { weekday: 1, opens_at: "08:00", closes_at: "12:00" },
      { weekday: 1, opens_at: "11:00", closes_at: "14:00" }
    ])
    assert_not place.valid?
    assert place.errors.key?(:opening_hours)
  end

  test "separate intervals on the same day are valid" do
    place = build_place(opening_hours_attributes: [
      { weekday: 1, opens_at: "08:00", closes_at: "12:00" },
      { weekday: 1, opens_at: "14:00", closes_at: "18:00" }
    ])
    assert place.valid?, place.errors.full_messages.inspect
  end

  test "overlap ignores hours marked for destruction" do
    place = places(:bem_te_vi)
    monday = opening_hours(:bem_te_vi_monday)
    place.assign_attributes(opening_hours_attributes: [
      { id: monday.id, _destroy: "1" },
      { weekday: 1, opens_at: "07:00", closes_at: "09:00" }
    ])
    assert place.valid?, place.errors.full_messages.inspect
  end

  test "save with an invalid child writes nothing" do
    place = build_place(
      contacts_attributes: [ { kind: "email", value: "ok@exemplo.org" } ],
      opening_hours_attributes: [ { weekday: 1, opens_at: "10:00", closes_at: "09:00" } ]
    )
    assert_no_difference [ "Place.count", "Address.count", "Contact.count", "OpeningHour.count", "PlaceMaterial.count" ] do
      assert_not place.save
    end
  end

  test "saves place with all children" do
    place = build_place(
      contacts_attributes: [ { kind: "phone", value: "(11) 3333-4444" } ],
      opening_hours_attributes: [ { weekday: 1, opens_at: "08:00", closes_at: "18:00" } ]
    )
    assert_difference [ "Place.count", "Address.count", "Contact.count", "OpeningHour.count" ], 1 do
      assert place.save, place.errors.full_messages.inspect
    end
  end

  test "active scope excludes inactive places" do
    assert_includes Place.active, places(:bem_te_vi)
    assert_not_includes Place.active, places(:closed_coop)
  end

  test "as_map_json follows the contract" do
    json = places(:bem_te_vi).as_map_json
    assert_equal "Ecoponto", json[:kind_label]
    assert_equal(-23.585, json[:lat])
    assert_equal "04101-000", json[:address][:zip_code]
    assert_equal [ { weekday: 1, opens_at: "06:00", closes_at: "22:00" }, { weekday: 6, opens_at: "08:00", closes_at: "12:00" } ], json[:opening_hours]
    assert_equal({ kind: "phone", value: "+551100000101", display: "(11) 0000-0101", href: "tel:+551100000101" }, json[:contacts].first)
  end

  test "destroy cascades to children" do
    assert_difference({ "Place.count" => -1, "Address.count" => -1, "PlaceMaterial.count" => -2, "OpeningHour.count" => -2, "Contact.count" => -1 }) do
      places(:bem_te_vi).destroy
    end
  end
end
