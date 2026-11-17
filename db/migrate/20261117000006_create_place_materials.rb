class CreatePlaceMaterials < ActiveRecord::Migration[8.1]
  def change
    create_table :place_materials do |t|
      t.references :place, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.references :material, null: false, foreign_key: true
      t.timestamps
    end
    add_index :place_materials, [ :place_id, :material_id ], unique: true
  end
end
