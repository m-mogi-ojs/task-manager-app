$(function(){
  // タスク名クリック時にテキストボックスを表示
  $(".task").click(function() {
    var $task = $(this);
    $task.hide();
    $task.parent().find('.task-edit').val($task.text()).show().focus();
  });
  // タスク名テキストボックスからフォーカスを外した際にタスク名に反映
  $(".task-edit").blur(function() {
    var $taskEdit = $(this);
    // ajaxでデータ更新
    $taskEdit.hide()
    $taskEdit.parent().find('.task').text($taskEdit.val()).show();
  });

});