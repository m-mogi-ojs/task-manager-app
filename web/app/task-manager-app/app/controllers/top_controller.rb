class TopController < ApplicationController
  def index
    redirect_to kanbans_url if logged_in?
  end
end
