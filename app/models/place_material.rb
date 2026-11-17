class PlaceMaterial < ApplicationRecord
  belongs_to :place
  belongs_to :material

  validates :material_id, uniqueness: { scope: :place_id }, if: :place_id?
end
