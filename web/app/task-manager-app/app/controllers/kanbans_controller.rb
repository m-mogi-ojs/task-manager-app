class KanbansController < ApplicationController
  def index
    redirect_to top_url if !logged_in?
  end

  def create
  end

  def update
  end

  def destroy
  end
end
