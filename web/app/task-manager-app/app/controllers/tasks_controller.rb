class TasksController < ApplicationController
  def create
    @task = Kanban.find(params[:id]).tasks.build(task_params)
    flash[:success] = "タスクを作成しました" if @task.save
      
    redirect_to root_url
  end

  def update
    #持ち主チェックが必要
    @task = Task.find(params[:id])
    if @task.update_attributes(update_params)
      redirect_to root_url
    end
  end

  def destory
  end

  private

    def task_params
      params.require(:task).permit(:name, :deadline)
    end

    def update_params
      params.require(:task).permit(:complete_flg)
    end
end
