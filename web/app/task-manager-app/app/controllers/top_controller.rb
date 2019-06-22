class TopController < ApplicationController
  def index
    redirect_to root_url if logged_in?
  end
end
