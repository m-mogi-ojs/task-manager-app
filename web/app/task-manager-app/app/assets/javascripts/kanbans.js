$(function(){
  // タスク名クリック時にテキストボックスを表示
  $(".task").on('click', function() {
    var $task = $(this);
    $task.hide();
    $task.parent().find('.task-edit').val($task.text()).show().focus();
    $task.parent().find(".complete-flg").hide();
  });

  // タスク名テキストボックスからフォーカスを外した際にタスク名に反映
  $(".task-edit").blur(function() {
    var $taskEdit = $(this);
    $taskEdit.hide();
    var $taskRow = $taskEdit.parent();
    var $task = $taskRow.find('.task');
    var $completeFlg = $taskRow.find('.complete-flg');
    $task.text($taskEdit.val()).show();
    $completeFlg.show();
    // ajaxでデータ更新
    $.ajax({
      type: "PATCH",
      url: "/tasks/" + $taskRow.find('input[name="task-id"]').val(),
      timeout: 10000,
      cache: false,
      data: {'task': {'name': $taskEdit.val()}},
      dataType: 'json'
    }).done(function (response, textStatus, jqXHR) {
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      alert("fail: Internal server error or not response");
      $task.hide();
      $task.text($task.val()).show();
      $completeFlg.show();
    }).always( function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
    });
  });

  // かんばん名クリック時にテキストボックスを表示
  $(".kanban").on('click', function() {
    var $kanban = $(this);
    $kanban.hide();
    $kanban.parent().find('.kanban-edit').val($kanban.text()).show().focus();
    $kanban.parent().find(".complete-flg").hide();
  });

  // かんばん名テキストボックスからフォーカスを外した際にタスク名に反映
  $(".kanban-edit").blur(function() {
    var $kanbanEdit = $(this);
    $kanbanEdit.hide();
    var $kanbanRow = $kanbanEdit.parent();
    var $kanban = $kanbanRow.find('.kanban');
    var $completeFlg = $kanbanRow.find('.complete-flg');
    $kanban.text($kanbanEdit.val()).show();
    $completeFlg.show();
    // ajaxでデータ更新
    $.ajax({
      type: "PATCH",
      url: "/kanbans/" + $kanbanRow.find('input[name="kanban-id"]').val(),
      timeout: 10000,
      cache: false,
      data: {'kanban': {'name': $kanbanEdit.val()}},
      dataType: 'json'
    }).done(function (response, textStatus, jqXHR) {
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      alert("fail: Internal server error or not response");
      $kanban.hide();
      $kanban.text($kanban.val()).show();
      $completeFlg.show();
    }).always( function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
    });
  });

  // タスクチェックボックス処理
  $(".complete-flg").click(function() {
    $checkBox = $(this);
    var hasChk = hasCheck($checkBox);
    if (hasChk) {
      $checkBox.removeClass("fa-check-square");
      $checkBox.addClass("fa-square");
    } else {
      $checkBox.removeClass("fa-square");
      $checkBox.addClass("fa-check-square");
    }
    $.ajax({
      type: "PATCH",
      url: "/tasks/" + $checkBox.parent().find('input[name="task-id"]').val(),
      timeout: 10000,
      cache: false,
      data: {'task': {'complete_flg': hasChk === 1 ? 0 : 1}},
      dataType: 'json'
    }).done(function (response, textStatus, jqXHR) {
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      alert("fail: Internal server error or not response");
      if (!hasChk) {
        $checkBox.removeClass("fa-check-square");
        $checkBox.addClass("fa-square");
      } else {
        $checkBox.removeClass("fa-square");
        $checkBox.addClass("fa-check-square");
      }
    }).always( function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
    });
  });

  // セレクトボックスの絞り込み
  $(".search-box").on('change', function(){
    $select = $(this);
    var completeFlg = $select.val();
    $select.parent().parent().parent().parent().find(".task-row").each(function(i, e) {
      var $obj = $(e);
      if (completeFlg === "" || completeFlg == hasCheck($obj.find(".complete-flg"))) {
        $obj.show();
      } else {
        $obj.hide();
      }
    });
  })
});

var hasCheck = function($obj) {
  return $obj.attr("class").split(" ").includes("fa-check-square") ? 1 : 0;
}