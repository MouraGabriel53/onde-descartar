Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  root "map#index"
  resources :places, only: [ :index ]

  namespace :admin do
    root "places#index"
    resources :places
  end
end
