class CreateContacts < ActiveRecord::Migration[8.1]
  def change
    create_table :contacts do |t|
      t.references :place, null: false, foreign_key: { on_delete: :cascade }
      t.string :kind, null: false
      t.string :value, null: false
      t.timestamps
    end
    add_index :contacts, [ :place_id, :kind, :value ], unique: true
    add_check_constraint :contacts, "kind IN ('phone', 'whatsapp', 'email', 'website')", name: "contacts_kind_check"
  end
end
