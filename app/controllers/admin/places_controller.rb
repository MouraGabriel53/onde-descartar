module Admin
  class PlacesController < BaseController
    before_action :set_place, only: %i[edit update destroy]

    def index
      @places = Place.includes(:address, :materials).order(:name)
    end

    def show
      redirect_to edit_admin_place_path(params[:id])
    end

    def new
      @place = Place.new(active: true)
      @place.build_address
    end

    def create
      @place = Place.new(place_params)
      @place.build_address if @place.address.nil?

      if @place.save
        redirect_to admin_root_path, notice: "Ponto salvo com sucesso."
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit
      @place.build_address if @place.address.nil?
    end

    def update
      if @place.update(place_params)
        redirect_to admin_root_path, notice: "Ponto salvo com sucesso."
      else
        @place.build_address if @place.address.nil?
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @place.destroy!
      redirect_to admin_root_path, notice: "Ponto excluído."
    end

    private

    def set_place
      @place = Place.find(params[:id])
    end

    def place_params
      params.require(:place).permit(
        :kind, :name, :description, :active,
        material_ids: [],
        address_attributes: %i[id street number complement neighborhood city state zip_code latitude longitude],
        opening_hours_attributes: %i[id weekday opens_at closes_at _destroy],
        contacts_attributes: %i[id kind value _destroy]
      )
    end
  end
end
