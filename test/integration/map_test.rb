require "test_helper"

class MapTest < ActionDispatch::IntegrationTest
  PLACE_KEYS = %w[id name kind kind_label description lat lng address materials opening_hours contacts].sort
  ADDRESS_KEYS = %w[street number complement neighborhood city state zip_code full].sort

  test "home renders the map shell" do
    get root_path

    assert_response :success
    assert_includes response.body, 'data-controller="map"'
    assert_includes response.body, "Buscar endereço, cidade, bairro ou CEP..."
  end

  test "places json lists only active places with the contract keys" do
    get places_path(format: :json)

    assert_response :success
    items = response.parsed_body
    ids = items.map { |item| item["id"] }
    assert_includes ids, places(:bem_te_vi).id
    assert_not_includes ids, places(:closed_coop).id

    items.each do |item|
      assert_equal PLACE_KEYS, item.keys.sort
      assert_equal ADDRESS_KEYS, item["address"].keys.sort
    end
  end
end
