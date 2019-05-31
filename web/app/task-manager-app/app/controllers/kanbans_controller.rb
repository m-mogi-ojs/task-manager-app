class KanbansController < ApplicationController
  def index
    redirect_to top_url if !logged_in?
    @kanban = Kanban.new
    @task = Task.new
    @kanbans = current_user.kanbans.includes(:tasks)
  end

  def create
    @kanban = current_user.kanbans.build(kanban_params)
    flash[:success] = "かんばんを作成しました" if @kanban.save
      
    redirect_to root_url
  end

  def update
  end

  def destroy
  end

  private

    def kanban_params
      params.require(:kanban).permit(:name)
    end
end
