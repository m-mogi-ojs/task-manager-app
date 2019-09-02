const KEY_CODE_ENTER = 13;
$(function(){
  initTaskEvent($(".task-name"));
  initTaskEditEvent($(".task-edit"));
  initTaskAddEvent($(".task-add"));
  initKanbanEvent();

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
    $select.parents(".card-content").find(".task-row").each(function(i, e) {
      var $obj = $(e);
      if($obj.hasClass("task-row-dummy")) {
        return;
      }
      if (completeFlg === "" || completeFlg == hasCheck($obj.find(".complete-flg"))) {
        $obj.show();
      } else {
        $obj.hide();
      }
    });
  });

  // タスクのドロップイベント
  var $draggingObj = null;
  initDragEvent($(".task-row"));
  addDragEvent($(".task-row"));

  // モバイル時にタスク入れ替えボタンを表示する
  $(".fa-arrows-alt-v").each(function() {
    if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
      $(this).parent().append('<i class="fas fa-caret-square-down is-pulled-left" style="margin-top: 0.25rem; margin-left: 0.25rem;"></i>');
      $(this).parent().append('<i class="fas fa-caret-square-up is-pulled-left" style="margin-top: 0.25rem; margin-left: 0.25rem;"></i>');
      $(this).remove();
      // TODO:ボタンのイベントを登録する
    }
  });

});

var hasCheck = function($obj) {
  return $obj.attr("class").split(" ").includes("fa-check-square") ? 1 : 0;
}

var initDragEvent = function($obj){
  $obj.on('drop', function(e){
    e.preventDefault();
    e.stopPropagation()
  });
  $obj.on('dragover', function(e){
    e.preventDefault();
    e.stopPropagation()
  });
  $obj.on('dragenter', function(e){
    e.preventDefault();
    e.stopPropagation()
  });
  $obj.on('dragleave', function(e){
    e.preventDefault();
    e.stopPropagation()
  });
  $obj.on('dragend', function(e){
    e.preventDefault();
    e.stopPropagation()
    $draggingObj.find(".card").removeClass("has-background-grey-light");
  });
}

var addDragEvent = function($obj) {
  $obj.on('dragstart', function(e){
    if ($(this).hasClass("task-row-dummy")){
      $draggingObj = null;
      return;
    }
    $draggingObj = $(this)
    $draggingObj.find(".card").addClass("has-background-grey-light");
  });

  $obj.on('drop', function(e){
    var $taskRow = $draggingObj;
    var $targetTaskRow = $(this);
    var isDummy = false;
    var isDiffKanban = false
    // 同じtaskRowにdropされたら処理を中断
    if ($draggingObj == null || $taskRow.is($targetTaskRow)){
      $(this).css('padding-top', '');
      return
    }

    // タスク名にdropした場合task.parentでtask-rowに変更
    if ($targetTaskRow.attr("class") === "task-name") {
      $targetTaskRow = $targetTaskRow.parent();
    }
    // dummyにdropした場合はisDummyフラグを立てる
    if ($targetTaskRow.hasClass("task-row-dummy")) {
      isDummy = true;
    }
    // 異なるかんばんにdoopした場合はisDiffKanbanフラグを立てる
    if ($taskRow.parent().find(".kanban-row").attr("data-kanban-id") !== $targetTaskRow.parent().find(".kanban-row").attr("data-kanban-id")) {
      isDiffKanban = true;
    }

    // taskrowが取得できた場合
    if ($targetTaskRow !== null) {
      // taskRowにtargetTaskRowのsortを設定する
      // その際、taskRow.sortからtargetTaskRow.sortの値を順番通りになるように変更する
      $.ajax({
        type: "PATCH",
        url: "/tasks/update/sort",
        timeout: 10000,
        cache: false,
        data: {'task': {
          'id': $taskRow.attr('data-task-id'),
          'target_id': isDummy ? null : $targetTaskRow.attr('data-task-id'),
          'target_kanban_id': isDummy && isDiffKanban ? $targetTaskRow.parent().find(".kanban-row").attr("data-kanban-id") : null
        }},
        dataType: 'json'
      }).done(function (response, textStatus, jqXHR) {
        $taskRow.clone(true).insertBefore($targetTaskRow);
        $taskRow.remove();
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        alert("fail: Internal server error or not response");
      }).always( function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
      });
    }
    $(this).css('padding-top', '');
  });

  // dragenter, dragleave
  $obj.on('dragenter', function(e){
    $(this).css('padding-top', '2.5rem');
  });

  $obj.on('dragleave', function(e){
    $(this).css('padding-top', '');
  });
}

var initTaskEvent = function($obj) {
  // タスク名クリック時にテキストボックスを表示
  $obj.on('click', function() {
    var $task = $(this);
    $task.hide();
    $task.parent().find('.task-edit').val($task.text()).show().focus();
    $task.parent().find(".complete-flg").hide();
    $task.parent().find("i").hide();
  });
}

var initTaskEditEvent = function($obj) {
  $obj.keydown(function() {
    if (event.keyCode === KEY_CODE_ENTER) {
      $(this).blur();
      if ($(this).val() !== "") {
        $(this).click();
      }
    }
  })

  // タスク名テキストボックスからフォーカスを外した際にタスク名に反映
  $obj.blur(function() {
    var $taskEdit = $(this);
    $taskEdit.hide();
    var $taskRow = $taskEdit.parent();
    var $task = $taskRow.find('.task-name');
    var $completeFlg = $taskRow.find('.complete-flg');
    var $images = $taskRow.find("i");
    $task.text($taskEdit.val()).show();
    $completeFlg.show();
    $images.show();
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

}

var initTaskAddEvent = function($obj) {
  // タスクを追加するクリック時にテキストボックスを表示
  $obj.on('click', function() {
    var $taskAdd = $(this);
    $taskAdd.find("span").hide();
    $taskAdd.find("input").show().focus();
  });

  // Enterでもタスクの追加ができるように
  $obj.keydown(function() {
    if (event.keyCode === KEY_CODE_ENTER) {
      $(".task-add-input").blur();
      if ($(this).find("input").val() !== "") {
        $(this).click();
      }
    }
  })

  // タスク名テキストボックスからフォーカスを外した際にタスク名に反映
  $obj.find(".task-add-input").blur(function() {
    var $taskAddInput = $(this);
    var $taskAdd = $taskAddInput.parent();
    var $cardContent = $taskAdd.parent();
    //inputを非表示に
    $taskAddInput.hide();
    //spanを表示に
    $taskAdd.find("span").show();
    //空だったらコールしない
    if ($taskAddInput.val() == "") {
      return
    }
    // ajaxでデータ更新
    $.ajax({
      type: "POST",
      url: "/tasks",
      timeout: 10000,
      cache: false,
      data: {'task': {
        'name': $taskAddInput.val(),
      },
      'kanban_id': $cardContent.attr("data-kanban-id")
    },
      dataType: 'json'
    }).done(function (response, textStatus, jqXHR) {
      //追加タスクをかんばんに追加
      $taskRowDummy = $cardContent.find(".task-row-dummy");
      $taskRowDummy.before(
        `
                    <div class="task-row" draggable="true" data-sort="`+response.sort+`" data-task-id="`+response.task_id+`">
                      <div class="card">
                        <span class="task-name">`+$taskAddInput.val()+`</span>
                        <input type="text" class="input is-small task-edit" style="display: none"/>
                        <a data-remote="true" rele="nofollow" data-method="delete" href="/tasks/`+response.task_id+`">
                          <i class="far fa-times-circle is-pulled-right"></i>
                        </a>
                        <i class="complete-flg far fa-square is-pulled-right"></i>
                        <input type="hidden" name="task-id" value="`+response.task_id+`<%=task.id%>">
                      </div>
                    </div>
        `
      );
      //イベントリスナーの登録
      initDragEvent($taskRowDummy.prev());
      addDragEvent($taskRowDummy.prev());
      //inputの内容をリセット
      $taskAddInput.val("");
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      alert("fail: Internal server error or not response");
    }).always( function (data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
    });
  });

}

var initKanbanEvent = function() {
  // かんばん名クリック時にテキストボックスを表示
  $(".kanban-name").on('click', function() {
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
    var $kanban = $kanbanRow.find('.kanban-name');
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
}