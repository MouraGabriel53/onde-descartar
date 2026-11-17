require "test_helper"
require Rails.root.join("db/migrate/20261117000008_split_paper_and_cardboard")

class SplitPaperAndCardboardTest < ActiveSupport::TestCase
  test "places that accepted paper also accept cardboard and nothing else changes" do
    materials(:cardboard).destroy!
    materials(:paper).update!(name: "Papel e papelão")
    paper_place_ids = materials(:paper).place_ids
    other_place_ids = Place.where.not(id: paper_place_ids).ids

    ActiveRecord::Migration.suppress_messages { SplitPaperAndCardboard.new.migrate(:up) }

    cardboard = Material.find_by!(key: "cardboard")
    assert_equal "Papel", materials(:paper).reload.name
    assert_equal "Papelão", cardboard.name
    assert_equal paper_place_ids.sort, cardboard.place_ids.sort
    assert_empty cardboard.place_ids & other_place_ids
  end
end
