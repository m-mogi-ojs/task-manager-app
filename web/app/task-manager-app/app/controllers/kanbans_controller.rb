class KanbansController < ApplicationController
  before_action :logged_in_user

  def index
    @kanban = Kanban.new
    @task = Task.new
    @kanbans = current_user.kanbans.includes(:tasks).order('tasks.sort')
  end

  def create
    @kanban = current_user.kanbans.build(kanban_params)
    flash[:success] = "かんばんを作成しました" if @kanban.save
      
    redirect_to root_url
  end

  def update
    @kanban = Kanban.find(params[:id])
    if @kanban.user_id == current_user.id
      if @kanban.update_attributes(kanban_params)
        render json: {response: 'ok'}
      end
    end
  end

  def destroy
    @kanban = Kanban.find(params[:id])
    str = @kanban.name
    @kanban.destroy
    flash[:success] = "#{str}を削除しました。"
    redirect_to root_url
  end

  private

    def kanban_params
      params.require(:kanban).permit(:name)
    end
end
