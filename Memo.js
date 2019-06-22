$(document).ready(function () {
  menuControl("font-li", "font-ul");
  fetch();
  init();
});

function menuControl(li, ul) {
  var li = document.getElementById(li);
  var ul = document.getElementById(ul);

  li.onmouseover = function () {
    ul.style.display = "block"
  }
  li.onmouseout = function () {
    ul.style.display = "none"
  }
}

function fetch() {
  const STORAGE_KEY = model.TOKEN;
  var storageData = window.localStorage.getItem(STORAGE_KEY);
  if (storageData) model.data = JSON.parse(storageData);
}

function save() {
  const STORAGE_KEY = model.TOKEN;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model.data));
}

function init() {
  var data = model.data;
  var ENTER_KEY = 13;

  $('#new-todo').on('keyup', function (e) {
    data.input = $('#new-todo').val();
    save();
    if (e.which == ENTER_KEY && data.input !== '') {
      data.items.push({
        msg: data.input,
        completed: false
      });
      data.input = '';
      update();
    }
  });

  $('.header').on('click', '#remove', function () {
    for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].completed) {
        data.items.splice(i, 1);
      }
    }
    update();
  });

  $('.header').on('change', '#complete-all', function () {
    for (var i = 0; i < data.items.length; i++) {
      data.items[i].completed = $('#complete-all').prop('checked');
    }
    update();
  });

  $('.filter-ul li a').click(function (e) {
    data.filter = e.target.innerHTML;
    $('.filter-ul li a').removeClass('selected');
    $(e.target).addClass('selected');
    update();
  });

  update();
}

function update() {
  var ENTER_KEY = 13;
  var ESC_KEY = 27;

  save();
  var data = model.data;

  $('#new-todo').val(data.input);

  $('#complete-all').prop("checked",data.items.length == completedCount);

  $('.filter-ul li a').each(function(){
    if (data.filter == this.innerHTML) $(this).addClass('selected');
     else $(this).removeClass('selected');
  });

  var activeCount = 0;
  var completedCount = 0;
  var todoul = document.getElementById('todo-ul');
  todoul.innerHTML = '';

  data.items.forEach(function(itemData, index) {
    if (itemData.completed) {
      completedCount++;
      if (data.filter == 'All' || data.filter == 'Completed') {
        var item = document.createElement('li');
        item.classList.add("line-wrapper");
        item.classList.add("completed");
        item.innerHTML = [
          '<div class="line-scroll-wrapper">',
          '<div class="line-normal-wrapper">',
          '  <div class="line-normal-left-wrapper">',
          '  <input class="complete" type="checkbox">',
          '  <div class="item-msg">' + itemData.msg + '</div>',
          '  </div>',
          '  <input class="important" type="checkbox">',
          '</div>',
          '<div class="line-btn-cancel"><button>cancel</button></div>',
          '<div class="line-btn-delete"><button>delete</button></div>',
          '</div>'
        ].join('');

    $(item).on('click', '.item-msg', function (e) {
      var itemMsg=e.target;
      var edit = document.createElement('input');
      edit.setAttribute('type', 'text');
      edit.setAttribute('value', itemMsg.innerHTML);
      edit.classList.add('edit');
      $(e.target).replaceWith(edit);
      edit.focus();
      $(edit).on('blur', function () {
        $(edit).replaceWith(itemMsg);
      });
      $(edit).on('keyup', function (ev) {
        if (ev.which == ESC_KEY) {
          $(edit).replaceWith(itemMsg);
        } else if (ev.which == ENTER_KEY) {
          itemMsg.innerHTML = $(edit).val();
          $(edit).replaceWith(itemMsg);
          itemData.msg = itemMsg.innerHTML;
          update();
        }
      });

    });

    item.querySelector('.complete').checked=true;
    
    $(item).on('change', '.complete', function () {      
      itemData.completed = false;     
      update();
    });
    $(item).on('change', '.line-btn-delete', function () {      
      data.items.splice(index, 1); 
      update();
    });
    var todoul = document.getElementById('todo-ul');
    todoul.insertBefore(item, todoul.children[0]);
  }
  }
    
  });
  
 
    data.items.forEach(function(itemData, index) {
    if (!itemData.completed) {
      activeCount++;
      if (data.filter == 'All' || data.filter == 'Active') {
        var item = document.createElement('li');
        item.classList.add("line-wrapper");
        item.innerHTML = [
          '<div class="line-scroll-wrapper">',
          '<div class="line-normal-wrapper">',
          '  <div class="line-normal-left-wrapper">',
          '  <input class="complete" type="checkbox">',
          '  <div class="item-msg">' + itemData.msg + '</div>',
          '  </div>',
          '  <input class="important" type="checkbox">',
          '</div>',
          '<div class="line-btn-cancel"><button>cancel</button></div>',
          '<div class="line-btn-delete"><button>delete</button></div>',
          '</div>'
        ].join('');

    $(item).on('click', '.item-msg', function (e) {
      var itemMsg=e.target;
      var edit = document.createElement('input');
      edit.setAttribute('type', 'text');
      edit.setAttribute('value', itemMsg.innerHTML);
      edit.classList.add('edit');
      $(e.target).replaceWith(edit);
      edit.focus();
      $(edit).on('blur', function () {
        $(edit).replaceWith(itemMsg);
      });
      $(edit).on('keyup', function (ev) {
        if (ev.which == ESC_KEY) {
          $(edit).replaceWith(itemMsg);
        } else if (ev.which == ENTER_KEY) {
          itemMsg.innerHTML = $(edit).val();
          $(edit).replaceWith(itemMsg);
          itemData.msg = itemMsg.innerHTML;
          update();
        }
      });

    });
    item.querySelector('.complete').checked=false;
    $(item).on('change', '.complete', function () {      
      itemData.completed = true;     
      update();
    });
    $(item).on('change', '.line-btn-delete', function () {      
      data.items.splice(index, 1); 
      update();
    });
    var todoul = document.getElementById('todo-ul');
    todoul.insertBefore(item, todoul.children[0]);
    
  }
  }
    
  });

  $('.count').html((activeCount || 'No') + (activeCount > 1 ? ' items' : ' item'));

  
  $(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-cancel").width() + $(".line-btn-delete").width());
  $(".line-normal-wrapper").width($(".line-wrapper").width());
  var lines = $(".line-normal-wrapper");
  var len = lines.length;
  var lastX, lastXForMobile;
  // 用于记录被按下的对象
  var pressedObj; // 当前左滑的对象
  var lastLeftObj; // 上一个左滑的对象
  // 用于记录按下的点
  var start;
  // 网页在移动端运行时的监听
  for (var i = 0; i < len; ++i) {
    lines[i].addEventListener('touchstart', function (e) {
      lastXForMobile = e.changedTouches[0].pageX;
      pressedObj = this; // 记录被按下的对象 
      // 记录开始按下时的点
      var touches = event.touches[0];
      start = {
        x: touches.pageX, // 横坐标
        y: touches.pageY // 纵坐标
      };
    });
    lines[i].addEventListener('touchmove', function (e) {
      // 计算划动过程中x和y的变化量
      var touches = event.touches[0];
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      };
      // 横向位移大于纵向位移，阻止纵向滚动
      if (Math.abs(delta.x) > Math.abs(delta.y)) {
        event.preventDefault();
      }
    });
    lines[i].addEventListener('touchend', function (e) {
      if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
        $(lastLeftObj).animate({
          marginLeft: "0"
        }, 500); // 右滑
        lastLeftObj = null; // 清空上一个左滑的对象
      }
      var diffX = e.changedTouches[0].pageX - lastXForMobile;
      if (diffX < -150) {
        $(pressedObj).animate({
          marginLeft: "-132px"
        }, 500); // 左滑
        lastLeftObj && lastLeftObj != pressedObj &&
          $(lastLeftObj).animate({
            marginLeft: "0"
          }, 500); // 已经左滑状态的按钮右滑
        lastLeftObj = pressedObj; // 记录上一个左滑的对象
      } else if (diffX > 150) {
        if (pressedObj == lastLeftObj) {
          $(pressedObj).animate({
            marginLeft: "0"
          }, 500); // 右滑
          lastLeftObj = null; // 清空上一个左滑的对象
        }
      }
    });
  }
  // 网页在PC浏览器中运行时的监听
  for (var i = 0; i < len; ++i) {
    $(lines[i]).bind('mousedown', function (e) {
      lastX = e.clientX;
      pressedObj = this; // 记录被按下的对象
    });
    $(lines[i]).bind('mouseup', function (e) {
      if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
        $(lastLeftObj).animate({
          marginLeft: "0"
        }, 500); // 右滑
        lastLeftObj = null; // 清空上一个左滑的对象
      }
      var diffX = e.clientX - lastX;
      if (diffX < -150) {
        $(pressedObj).animate({
          marginLeft: "-132px"
        }, 500); // 左滑
        lastLeftObj && lastLeftObj != pressedObj &&
          $(lastLeftObj).animate({
            marginLeft: "0"
          }, 500); // 已经左滑状态的按钮右滑
        lastLeftObj = pressedObj; // 记录上一个左滑的对象
      } else if (diffX > 150) {
        if (pressedObj == lastLeftObj) {
          $(pressedObj).animate({
            marginLeft: "0"
          }, 500); // 右滑
          lastLeftObj = null; // 清空上一个左滑的对象
        }
      }
    });
  }
}