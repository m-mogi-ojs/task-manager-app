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
    $taskEdit.parent().find('.task').text($taskEdit.val()).show();
    $taskEdit.parent().find('.complete-flg').show();
    // ajaxでデータ更新
    $.ajax({
      type: "PATCH",
      url: "/tasks/" + $taskEdit.attr("id"),
      timeout: 10000,
      cache: false,
      data: {'task': {'name': $taskEdit.val()}},
      dataType: 'json'
    }).done(function (response, textStatus, jqXHR) {
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      alert("fail: Internal server error or not response");
      var $task = $taskEdit.parent().find(".task");
      $task.hide();
      $task.parent().find('.task').text($task.val()).show();
      $task.parent().find('.complete-flg').show();
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
      url: "/tasks/" + $checkBox.attr("id"),
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