class TasksController < ApplicationController
  before_action :logged_in_user, only: [:create, :update, :update_sort]

  def create
    kanban = Kanban.find(params[:kanban_id])
    @task = kanban.tasks.build(task_params)
    @task.sort = kanban.tasks.length
    if @task.save
      render json: {response: 'ok', task_id: @task.id, sort: @task.sort}
    else
      render status: 400, json: {response: 'ng'}
    end
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
    #所有者、パラメータチェック(id, target_id, user)
    from_task = Task
              .joins(:kanban)
              .where(kanbans: {user_id: current_user.id})
              .where(id: params[:task][:id])
            .load()
    to_task = Task
              .joins(:kanban)
              .where(kanbans: {user_id: current_user.id})
              .where(id: params[:task][:target_id])
              .load()
    return render status: 400, json: {response: 'Invalid parameter [id].'} if from_task.empty? 
    if !to_task.empty? && from_task.first.kanban_id != to_task.first.kanban_id
      #別のかんばんの間へ移動したい場合
      move_task_to_other_kanban(from_task, to_task)
    elsif to_task.empty? && params[:task][:target_kanban_id].present?
      #別のかんばんの最後へ移動
      move_task_to_other_kanban_latest(from_task)
    elsif !to_task.empty?
      #かんばんの移動なし
      move_task_to_same_kanban(from_task, to_task)
    else
      return render status: 400, json: {response: 'Invalid parameter.'}
    end
      
    render json: { response: 'ok'}

  end

  def destroy
    @task = Task.includes(:kanban).find(params[:id])
    if @task.kanban.user_id == current_user.id
      #sort順変更
      Task.joins(:kanban)
          .where(kanbans: {user_id: current_user.id})
          .where('sort > ?', @task.sort)
          .find_each do |e|
            e.sort = e.sort - 1
            e.save!
          end
      @task.destroy
    end
    #render json: { response: 'ok'}
    redirect_to root_url
  end

  private

    def task_params
      params.require(:task).permit(:name, :deadline)
    end

    def update_params
      params.require(:task).permit(:name, :complete_flg)
    end

    def update_sort_params
      params.require(:task).permit(:id, :target_id, :target_kanban_id)
    end

    def move_task_to_other_kanban(from_task, to_task)
      Task.transaction do
        from_tasks = Task
                  .where(kanban_id: from_task.first.kanban_id)
                  .where('sort >= ?', from_task.first.sort)
                  .order(:sort)
        to_tasks = Task
                  .where(kanban_id: to_task.first.kanban_id)
                  .where('sort >= ?', to_task.first.sort)
                  .order(:sort)
                  .load()
        from_tasks.each_with_index do |e, i|
          if i == 0
            e.kanban_id = to_task.first.kanban_id
            e.sort = to_task.first.sort
          else
            e.sort -= 1
          end
          e.save!
        end
        to_tasks.each do |e|
          e.sort += 1
          e.save!
        end
      end
    end
    
    def move_task_to_other_kanban_latest(from_task)
      Task.transaction do
        tasks = Task
                  .where(kanban_id: from_task.first.kanban_id)
                  .where('sort >= ?', from_task.first.sort)
                  .order(:sort)
                  .load()
        target_latest_task = Task
                  .where(kanban_id: params[:task][:target_kanban_id])
                  .order('sort desc')
                  .limit(1)
                  .load()
        tasks.each_with_index do |e, i|
          if i == 0
            e.kanban_id = params[:task][:target_kanban_id]
            e.sort = target_latest_task.first.sort + 1
          else
            e.sort -= 1
          end
          e.save!
        end
      end
    end

    def move_task_to_same_kanban(from_task, to_task)
      # target_id.empty? タスクを一番下へ
      if params[:task][:target_id].empty?
        tasks = Task
                          .where(kanban_id: from_task.first.kanban_id)
                          .where('sort >= ?', from_task.first.sort)
                          .order(:sort)
        tasks.each_with_index do |e, i| 
          if i == 0
            e.sort = tasks.map{ |t| t.sort }.max
          else
            e.sort -= 1
          end
          e.save!
        end
      else
        #かんばん内の入れ替え
        # 更新対象を取得
        max_sort = [from_task.first.sort, to_task.first.sort].max
        min_sort = [from_task.first.sort, to_task.first.sort].min
        is_max_from = (max_sort == from_task.first.sort)
        sort = is_max_from ? 'sort desc' : :sort 
        max_sort = is_max_from ? max_sort : max_sort-1
        tasks = Task
                  .where(kanban_id: from_task.first.kanban_id)
                  .where(sort: min_sort..max_sort)
                  .order(sort)
        # sort入れ替え処理
        # min -> max -1
        # max -1 < -> -1
        tasks.each_with_index do |e, i|
          if i == 0
            e.sort = is_max_from ? min_sort : max_sort
          else
            e.sort = e.sort + (is_max_from ? 1 : -1)
          end
          e.save!
        end
      end
    end
end
