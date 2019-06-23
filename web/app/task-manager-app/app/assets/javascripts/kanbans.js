$(function(){
  console.log("Hello JQuery");

  $(".task").click(function() {
    console.log($(this).text());
    var $task = $(this);
    $task.hide();
    $task.parent().find('.task-edit').val($task.text()).show().focus();
  });

  $(".task-edit").blur(function() {
    console.log($(this).val());
    var $taskEdit = $(this);
    $taskEdit.hide()
    $taskEdit.parent().find('.task').text($taskEdit.val()).show();
  });

});