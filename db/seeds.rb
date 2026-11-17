MATERIALS = {
  "paper" => "Papel e papelão",
  "plastic" => "Plásticos",
  "glass" => "Vidros",
  "metal" => "Metais",
  "electronics" => "Eletrônicos",
  "batteries" => "Pilhas e baterias",
  "cooking_oil" => "Óleo de cozinha",
  "furniture" => "Móveis",
  "rubble" => "Entulho",
  "special_waste" => "Resíduos especiais"
}.freeze

MATERIALS.each do |key, name|
  material = Material.find_or_create_by!(key: key) { |m| m.name = name }
  material.update!(name: name) if material.name != name
end
