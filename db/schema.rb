# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_17_000006) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.string "street", null: false
    t.string "number", null: false
    t.string "complement"
    t.string "neighborhood", null: false
    t.string "city", null: false
    t.string "state", limit: 2, null: false
    t.string "zip_code", limit: 8, null: false
    t.decimal "latitude", precision: 9, scale: 6, null: false
    t.decimal "longitude", precision: 9, scale: 6, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["place_id"], name: "index_addresses_on_place_id", unique: true
    t.check_constraint "latitude >= '-90'::integer::numeric AND latitude <= 90::numeric", name: "addresses_latitude_check"
    t.check_constraint "longitude >= '-180'::integer::numeric AND longitude <= 180::numeric", name: "addresses_longitude_check"
    t.check_constraint "zip_code::text ~ '^[0-9]{8}$'::text", name: "addresses_zip_code_check"
  end

  create_table "contacts", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.string "kind", null: false
    t.string "value", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["place_id", "kind", "value"], name: "index_contacts_on_place_id_and_kind_and_value", unique: true
    t.index ["place_id"], name: "index_contacts_on_place_id"
    t.check_constraint "kind::text = ANY (ARRAY['phone'::character varying, 'whatsapp'::character varying, 'email'::character varying, 'website'::character varying]::text[])", name: "contacts_kind_check"
  end

  create_table "materials", force: :cascade do |t|
    t.string "key", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_materials_on_key", unique: true
    t.index ["name"], name: "index_materials_on_name", unique: true
    t.check_constraint "key::text ~ '^[a-z_]+$'::text", name: "materials_key_format"
  end

  create_table "opening_hours", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.integer "weekday", null: false
    t.time "opens_at", null: false
    t.time "closes_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["place_id", "weekday"], name: "index_opening_hours_on_place_id_and_weekday"
    t.index ["place_id"], name: "index_opening_hours_on_place_id"
    t.check_constraint "closes_at > opens_at", name: "opening_hours_closes_after_opens"
    t.check_constraint "weekday >= 0 AND weekday <= 6", name: "opening_hours_weekday_range"
  end

  create_table "place_materials", force: :cascade do |t|
    t.bigint "place_id", null: false
    t.bigint "material_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["material_id"], name: "index_place_materials_on_material_id"
    t.index ["place_id", "material_id"], name: "index_place_materials_on_place_id_and_material_id", unique: true
  end

  create_table "places", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "kind", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kind"], name: "index_places_on_kind"
    t.check_constraint "kind::text = ANY (ARRAY['ecopoint'::character varying, 'cooperative'::character varying, 'drop_off_point'::character varying, 'partner_store'::character varying]::text[])", name: "places_kind_check"
  end

  add_foreign_key "addresses", "places", on_delete: :cascade
  add_foreign_key "contacts", "places", on_delete: :cascade
  add_foreign_key "opening_hours", "places", on_delete: :cascade
  add_foreign_key "place_materials", "materials"
  add_foreign_key "place_materials", "places", on_delete: :cascade
end
