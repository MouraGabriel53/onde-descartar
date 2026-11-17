require "test_helper"

class AdminPlacesTest < ActionDispatch::IntegrationTest
  AUTH = { "HTTP_AUTHORIZATION" => ActionController::HttpAuthentication::Basic.encode_credentials("admin", "admin") }.freeze

  def valid_params(overrides = {})
    {
      place: {
        kind: "ecopoint",
        name: "Ecoponto Novo",
        description: "Teste",
        active: "1",
        material_ids: [ materials(:paper).id, materials(:glass).id ],
        address_attributes: {
          street: "Rua Nova", number: "10", neighborhood: "Centro", city: "São Paulo",
          state: "SP", zip_code: "01001-000", latitude: "-23.55", longitude: "-46.63"
        },
        opening_hours_attributes: {
          "0" => { weekday: "1", opens_at: "08:00", closes_at: "12:00", _destroy: "0" },
          "1" => { weekday: "2", opens_at: "09:00", closes_at: "17:00", _destroy: "0" }
        },
        contacts_attributes: {
          "0" => { kind: "email", value: "novo@exemplo.org", _destroy: "0" }
        }
      }.deep_merge(overrides)
    }
  end

  test "index requires credentials" do
    get admin_places_path
    assert_response :unauthorized
  end

  test "index lists places" do
    get admin_places_path, headers: AUTH
    assert_response :success
    assert_includes response.body, places(:bem_te_vi).name
    assert_includes response.body, places(:closed_coop).name
  end

  test "admin root, new and edit render" do
    get admin_root_path, headers: AUTH
    assert_response :success
    get new_admin_place_path, headers: AUTH
    assert_response :success
    get edit_admin_place_path(places(:bem_te_vi)), headers: AUTH
    assert_response :success
  end

  test "new form wires the CEP lookup to the address fields" do
    get new_admin_place_path, headers: AUTH
    assert_response :success
    assert_select "input[data-location-picker-target='zip'][data-action='input->location-picker#zipChanged']"
    assert_select "input[data-location-picker-target='number'][data-action='change->location-picker#numberChanged']"
    %w[street neighborhood city].each { |field| assert_select "input[data-location-picker-target='#{field}']" }
    assert_select "select[data-location-picker-target='state']"
    assert_select "[data-location-picker-target='zipStatus']"
  end

  test "edit keeps each persisted row id inside its removable row" do
    place = places(:bem_te_vi)
    get edit_admin_place_path(place), headers: AUTH
    assert_response :success
    assert_select "input[name^='place[opening_hours_attributes]'][name$='[id]']", count: place.opening_hours.count
    assert_select ".nested-row input[type='hidden'][name^='place[opening_hours_attributes]'][name$='[id]']", count: place.opening_hours.count
    assert_select "input[name^='place[contacts_attributes]'][name$='[id]']", count: place.contacts.count
    assert_select ".nested-row input[type='hidden'][name^='place[contacts_attributes]'][name$='[id]']", count: place.contacts.count
  end

  test "removing every opening hour leaves the place with none" do
    place = places(:bem_te_vi)
    attrs = place.opening_hours.each_with_index.to_h { |hour, i| [ i.to_s, { id: hour.id, _destroy: "1" } ] }
    patch admin_place_path(place), params: { place: { opening_hours_attributes: attrs } }, headers: AUTH
    assert_redirected_to admin_root_path
    assert_empty place.reload.opening_hours
  end

  test "edit renders a place without rows" do
    get edit_admin_place_path(places(:closed_coop)), headers: AUTH
    assert_response :success
  end

  test "create saves place with children" do
    assert_difference [ "Place.count", "Address.count", "Contact.count" ], 1 do
      assert_difference [ "OpeningHour.count", "PlaceMaterial.count" ], 2 do
        post admin_places_path, params: valid_params, headers: AUTH
      end
    end
    assert_redirected_to admin_root_path
    assert_equal "Ponto salvo com sucesso.", flash[:notice]
  end

  test "create without materials renders 422 and keeps typed values" do
    assert_no_difference [ "Place.count", "Address.count", "OpeningHour.count", "Contact.count" ] do
      post admin_places_path, params: valid_params(material_ids: [ "" ]), headers: AUTH
    end
    assert_response :unprocessable_entity
    assert_includes response.body, "Ecoponto Novo"
    assert_includes response.body, 'value="08:00"'
    assert_includes response.body, 'value="17:00"'
  end

  test "create with closing before opening renders 422 and keeps rows" do
    params = valid_params(opening_hours_attributes: { "0" => { weekday: "1", opens_at: "10:00", closes_at: "09:00", _destroy: "0" } })
    assert_no_difference [ "Place.count", "Address.count", "OpeningHour.count", "Contact.count" ] do
      post admin_places_path, params: params, headers: AUTH
    end
    assert_response :unprocessable_entity
    assert_includes response.body, "Ecoponto Novo"
    assert_includes response.body, 'value="10:00"'
    assert_includes response.body, 'value="09:00"'
  end

  test "update changes name and removes an opening hour" do
    place = places(:bem_te_vi)
    hour = opening_hours(:bem_te_vi_saturday)
    patch admin_place_path(place), params: {
      place: { name: "Nome Atualizado", opening_hours_attributes: { "0" => { id: hour.id, _destroy: "1" } } }
    }, headers: AUTH

    assert_redirected_to admin_root_path
    assert_equal "Nome Atualizado", place.reload.name
    assert_equal 1, place.opening_hours.count
    assert_not OpeningHour.exists?(hour.id)
  end

  test "invalid update returns 422 and changes nothing" do
    place = places(:bem_te_vi)
    original_materials = place.material_ids.sort

    patch admin_place_path(place), params: {
      place: { name: "", material_ids: [ materials(:metal).id ] }
    }, headers: AUTH

    assert_response :unprocessable_entity
    place.reload
    assert_equal "Ecoponto Bem-te-vi", place.name
    assert_equal original_materials, place.material_ids.sort
  end

  test "destroy removes place and children" do
    place = places(:bem_te_vi)
    assert_difference "Place.count", -1 do
      delete admin_place_path(place), headers: AUTH
    end
    assert_redirected_to admin_root_path
    assert_equal 0, Address.where(place_id: place.id).count
    assert_equal 0, OpeningHour.where(place_id: place.id).count
    assert_equal 0, Contact.where(place_id: place.id).count
    assert_equal 0, PlaceMaterial.where(place_id: place.id).count
  end
end
