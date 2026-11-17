class CreateAddresses < ActiveRecord::Migration[8.1]
  def change
    create_table :addresses do |t|
      t.references :place, null: false, foreign_key: { on_delete: :cascade }, index: { unique: true }
      t.string :street, null: false
      t.string :number, null: false
      t.string :complement
      t.string :neighborhood, null: false
      t.string :city, null: false
      t.string :state, limit: 2, null: false
      t.string :zip_code, limit: 8, null: false
      t.decimal :latitude, precision: 9, scale: 6, null: false
      t.decimal :longitude, precision: 9, scale: 6, null: false
      t.timestamps
    end
    add_check_constraint :addresses, "latitude BETWEEN -90 AND 90", name: "addresses_latitude_check"
    add_check_constraint :addresses, "longitude BETWEEN -180 AND 180", name: "addresses_longitude_check"
    add_check_constraint :addresses, "zip_code ~ '^[0-9]{8}$'", name: "addresses_zip_code_check"
  end
end
