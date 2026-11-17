class CreateOpeningHours < ActiveRecord::Migration[8.1]
  def change
    create_table :opening_hours do |t|
      t.references :place, null: false, foreign_key: { on_delete: :cascade }
      t.integer :weekday, null: false
      t.time :opens_at, null: false
      t.time :closes_at, null: false
      t.timestamps
    end
    add_index :opening_hours, [ :place_id, :weekday ]
    add_check_constraint :opening_hours, "closes_at > opens_at", name: "opening_hours_closes_after_opens"
    add_check_constraint :opening_hours, "weekday BETWEEN 0 AND 6", name: "opening_hours_weekday_range"
  end
end
