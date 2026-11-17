class Material < ApplicationRecord
  has_many :place_materials, dependent: :restrict_with_error
  has_many :places, through: :place_materials

  validates :key, presence: true, uniqueness: true, format: { with: /\A[a-z_]+\z/ }
  validates :name, presence: true, uniqueness: true
end
