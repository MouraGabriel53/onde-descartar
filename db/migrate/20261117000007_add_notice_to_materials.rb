class AddNoticeToMaterials < ActiveRecord::Migration[8.1]
  def change
    add_column :materials, :notice, :string
  end
end
