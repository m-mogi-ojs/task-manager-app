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
    $.ajax({
      type: "PATCH",
      url: "/tasks/" + $taskEdit.attr("id"),
      timeout: 10000,
      cache: false,
      data: {'task': {'name': $taskEdit.val()}},
      dataType: 'json'
    }).done(function (response, textStatus, jqXHR) {
      console.log("done: " + response);
      $taskEdit.hide();
      $taskEdit.parent().find('.task').text($taskEdit.val()).show();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      alert("fail: Internal server error or not response");
    }).always( function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
      console.log("always.");
    });
  });

});
