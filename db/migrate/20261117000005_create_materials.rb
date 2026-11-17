class CreateMaterials < ActiveRecord::Migration[8.1]
  def change
    create_table :materials do |t|
      t.string :key, null: false
      t.string :name, null: false
      t.timestamps
    end
    add_index :materials, :key, unique: true
    add_index :materials, :name, unique: true
    add_check_constraint :materials, "key ~ '^[a-z_]+$'", name: "materials_key_format"
  end
end
