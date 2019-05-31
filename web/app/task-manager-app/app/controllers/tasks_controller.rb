class TasksController < ApplicationController
  def index
  end

  def create
    @task = Kanban.find(params[:id]).tasks.build(task_params)
    flash[:success] = "かんばんを作成しました" if @task.save
      
    redirect_to root_url
  end

  def update
  end

  def destory
  end

  private

    def task_params
      params.require(:task).permit(:name, :deadline)
    end
end
