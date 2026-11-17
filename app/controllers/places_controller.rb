class PlacesController < ApplicationController
  def index
    places = Place.active.includes(:address, :materials, :opening_hours, :contacts)
    render json: places.map(&:as_map_json)
  end
end
