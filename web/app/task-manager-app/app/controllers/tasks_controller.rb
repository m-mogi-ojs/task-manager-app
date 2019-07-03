class TasksController < ApplicationController
  def create
    kanban = Kanban.find(params[:kanban_id])
    @task = kanban.tasks.build(task_params)
    @task.sort = kanban.tasks.length
    flash[:success] = "タスクを作成しました" if @task.save
      
    redirect_to root_url
  end

  def update
    #持ち主チェックが必要
    @task = Task.find(params[:id])
    if @task.kanban.user_id == current_user.id
      if @task.update_attributes(update_params)
        render json: {response: 'ok'}
      end
    end
  end

  def destory
  end

  private

    def task_params
      params.require(:task).permit(:name, :deadline)
    end

    def update_params
      params.require(:task).permit(:name, :complete_flg)
    end
end
