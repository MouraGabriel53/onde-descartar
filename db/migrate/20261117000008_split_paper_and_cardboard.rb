class SplitPaperAndCardboard < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL
      UPDATE materials SET name = 'Papel', updated_at = NOW() WHERE key = 'paper';

      INSERT INTO materials (key, name, created_at, updated_at)
      VALUES ('cardboard', 'Papelão', NOW(), NOW())
      ON CONFLICT (key) DO NOTHING;

      INSERT INTO place_materials (place_id, material_id, created_at, updated_at)
      SELECT pm.place_id, cardboard.id, NOW(), NOW()
      FROM place_materials pm
      JOIN materials paper ON paper.id = pm.material_id AND paper.key = 'paper'
      CROSS JOIN materials cardboard
      WHERE cardboard.key = 'cardboard'
      ON CONFLICT (place_id, material_id) DO NOTHING;
    SQL
  end

  def down
    execute <<~SQL
      DELETE FROM place_materials
      WHERE material_id IN (SELECT id FROM materials WHERE key = 'cardboard');

      DELETE FROM materials WHERE key = 'cardboard';

      UPDATE materials SET name = 'Papel e papelão', updated_at = NOW() WHERE key = 'paper';
    SQL
  end
end
