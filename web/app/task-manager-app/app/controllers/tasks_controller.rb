class TasksController < ApplicationController
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
    if !to_task.empty? && from_task.first.kanban_id != to_task.first.kanban_id
      #別のかんばんの間へ移動したい場合
      tasks = Task
                .where(kanban_id: from_task.first.kanban_id)
                .where('sort >= ?', from_task.first.sort)
                .or(Task.where(kanban_id: to_task.first.kanban_id).where('sort >= ?', to_task.first.sort))
                .order(:sort)
                .load()

      tasks.select{ |e| e.kanban_id == to_task.first.kanban_id }.each do |e|
        #対象のかんばんBのsortを全て+1
        e.sort += 1
        e.save!
      end
      tasks.select{ |e| e.kanban_id == from_task.first.kanban_id }.each_with_index do |e, i|
        #かんばんAのリクエストのデータのkanban_idをかんばんBに変更
        #残りの対象のsortを全て-1
        if i == 0
          e.kanban_id = to_task.first.kanban_id
          e.sort = to_task.first.sort
        else
          e.sort -= 1
        end
        e.save!
      end
    elsif to_task.empty? && params[:task][:target_kanban_id].present?
      #かんばんの最後へ移動
      #かんばんの所有者チェック
      kanban = Kanban.find_by(id: params[:task][:target_kanban_id], user_id: current_user.id)
      return render status: 400, json: {response: 'ng'} if kanban.blank?

      tasks = Task
                .where(kanban_id: from_task.first.kanban_id)
                .where('sort >= ?', from_task.first.sort)
                .order(:sort)
                .load()
      tasks.each_with_index do |e, i|
        if i == 0
          e.kanban_id = params[:task][:target_kanban_id]
          e.sort = Task.where(kanban_id: params[:task][:target_kanban_id]).length
        else
          e.sort -= 1
        end
        e.save!
      end
    else
      #かんばんの移動なし
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
        maxSort = [from_task.first.sort, to_task.first.sort].max
        minSort = [from_task.first.sort, to_task.first.sort].min
        isMaxFrom = (maxSort == from_task.first.sort)
        sort = isMaxFrom ? 'sort desc' : :sort 
        tasks = Task
                  .where(kanban_id: from_task.first.kanban_id)
                  .where(sort: minSort..maxSort)
                  .order(sort)
        # sort入れ替え処理
        # min -> max -1
        # max -1 < -> -1
        tasks.each_with_index do |e, i|
          if i == 0
            e.sort = isMaxFrom ? minSort : maxSort
          else
            e.sort = e.sort + (isMaxFrom ? 1 : -1)
          end
          e.save!
        end
      end
    end
      
    render json: { response: 'ok'}

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
      params.require(:task).permit(:id, :target_id, :target_kanban_id)
    end
end
