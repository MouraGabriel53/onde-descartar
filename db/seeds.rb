MONTHLY_LIMIT = "Limite: 1 m³ ou 10 sacos de 100 litros por pessoa por mês.".freeze

MATERIALS = {
  "paper" => { name: "Papel" },
  "cardboard" => { name: "Papelão" },
  "plastic" => { name: "Plásticos" },
  "glass" => { name: "Vidros" },
  "metal" => { name: "Metais" },
  "electronics" => { name: "Eletrônicos" },
  "appliances" => { name: "Eletrodomésticos" },
  "batteries" => { name: "Pilhas e baterias" },
  "cooking_oil" => { name: "Óleo de cozinha" },
  "furniture" => { name: "Móveis" },
  "wood" => { name: "Madeiras" },
  "plaster" => { name: "Gesso" },
  "eps" => { name: "Isopor (EPS)" },
  "tires" => { name: "Pneus", notice: "Limite: 4 unidades por pessoa." },
  "green_waste" => { name: "Resíduos de poda e jardinagem", notice: MONTHLY_LIMIT },
  "rubble" => { name: "Resíduos de construção civil e demolição (entulho)", notice: MONTHLY_LIMIT },
  "special_waste" => { name: "Resíduos especiais" }
}.freeze

MATERIALS.each do |key, attributes|
  Material.find_or_initialize_by(key: key).update!({ notice: nil }.merge(attributes))
end
