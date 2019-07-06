class TasksController < ApplicationController
  def create
    kanban = Kanban.find(params[:kanban_id])
    @task = kanban.tasks.build(task_params)
    @task.sort = kanban.tasks.length
    flash[:success] = "タスクを作成しました" if @task.save
      
    redirect_to root_url
  end

  def update
    @task = Task.find(params[:id])
    if @task.kanban.user_id == current_user.id
      if @task.update_attributes(update_params)
        render json: {response: 'ok'}
      end
    end
  end

  def update_sort
    # 所有者、パラメータチェック
    @tasks = Task.joins(:kanban).where(kanbans: {user_id: current_user.id}).where(id: [params[:task][:id], params[:task][:target_id]])
    @tasks.each do |e| 
      logger.debug(e.id)
    end
#    maxSort = params[:sort] > params[:target_sort] ? params[:sort] : params:[:target_sort]
#    minSort = params[:sort] < params[:target_sort] ? params[:sort] : params:[:target_sort]
#    Task.where(id: params[:id])
#      .or(id: params[:target_id])
#      .where("sort <= ?", maxSort)
#      .where("sort >= ?", minSort)
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

    def update_sort_params
      params.require(:task).permit(:id, :target_id)
    end
end
