module Admin
  class BaseController < ApplicationController
    before_action :authenticate_admin!

    private

    def authenticate_admin!
      expected_user, expected_password = admin_credentials
      return head(:service_unavailable) if expected_password.blank?

      authenticate_or_request_with_http_basic("OndeDescartar Admin") do |user, password|
        ActiveSupport::SecurityUtils.secure_compare(user, expected_user) &
          ActiveSupport::SecurityUtils.secure_compare(password, expected_password)
      end
    end

    def admin_credentials
      if Rails.env.production?
        [ ENV.fetch("ADMIN_USER", "admin"), ENV["ADMIN_PASSWORD"] ]
      else
        [ ENV.fetch("ADMIN_USER", "admin"), ENV.fetch("ADMIN_PASSWORD", "admin") ]
      end
    end
  end
end
