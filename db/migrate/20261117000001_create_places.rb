class CreatePlaces < ActiveRecord::Migration[8.1]
  def change
    create_table :places do |t|
      t.string :name, null: false
      t.text :description
      t.string :kind, null: false
      t.boolean :active, null: false, default: true
      t.timestamps
    end
    add_index :places, :kind
    add_check_constraint :places, "kind IN ('ecopoint', 'cooperative', 'drop_off_point', 'partner_store')", name: "places_kind_check"
  end
end
