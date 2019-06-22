$(document).ready(function () {
  menuControl("font-li", "font-ul");
  menuControl("color-li", "color-ul");
  $('#font-ul li').click(function(){
    if($(this).attr("id") == "bigSize"){
      $('.item-msg').css("font-size",'28px');
      $('#new-todo').css("font-size",'24px');
    }
    else if($(this).attr("id") == "smallSize"){
      $('.item-msg').css('font-size','20px');
      $('#new-todo').css("font-size",'16px')
    }
    else{
      $('.item-msg').css('font-size','24px');
      $('#new-todo').css("font-size",'20px')
    }

});
$('#color-ul li').click(function(){
  if($(this).attr("id") == "blue"){
    $('#todo-ul li').css("background-color","rgba(154, 211, 240, 0.644)");
    $('.header h1').css("color","rgba(120, 186, 216, 0.644)");
    $('.importantitem').css("background-color","rgba(120, 186, 216, 0.644)");
    $('.completed').css("background-color","#fff");
  }
  else if($(this).attr("id") == "green"){
    $('#todo-ul li').css("background-color","rgba(144, 235, 152, 0.644)");
    $('.header h1').css("color","rgba(120, 216, 128, 0.644)");
    $('.completed').css("background-color","#fff");
    $('.importantitem').css("background-color","rgba(120, 216, 128, 0.644)");
  }
  else{
    $('#todo-ul li').css("background-color","rgba(253, 142, 142, 0.644)");
    $('.header h1').css("color","rgba(226, 110, 110, 0.644)");
    $('.completed').css("background-color","#fff");
    $('.importantitem').css("background-color","rgba(226, 110, 110, 0.644)");
  }

});
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
        completed: false,
        important:false,
        canceled: false
      });
      data.input = '';
      update();
    }
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

  $('.header').on('click', '#remove', function () {
    if(data.filter == 'All'){
      data.items=[];
    }
    else if(data.filter == 'Completed'){
      for (var i = 0; i < data.items.length; i++) {
      if (data.items[i].completed) {
        data.items.splice(i, 1);
      }
    }
    }
    else if(data.filter == 'Active'){
      for (var i = 0; i < data.items.length; i++) {
        if (!data.items[i].completed) {
          data.items.splice(i, 1);
        }
      }
    }
    else if(data.filter == 'Canceled'){
      for (var i = 0; i < data.items.length; i++) {
        if (data.items[i].canceled) {
          data.items.splice(i, 1);
        }
      }
    }
    
    update();
  });

  $('.filter-ul li a').each(function(){
    if (data.filter == this.innerHTML) $(this).addClass('selected');
     else $(this).removeClass('selected');
  });

  var activeCount = 0;
  var completedCount = 0;
  var canceledCount = 0;
  var todoul = document.getElementById('todo-ul');
  todoul.innerHTML = '';

  if (data.filter == 'All' || data.filter == 'Completed') {
  data.items.forEach(function(itemData, index) {
    if (itemData.completed&&!itemData.canceled) {
      completedCount++;
      
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

    $(item).on('click', '.line-btn-delete', function () {      
      data.items.splice(index, 1); 
      update();
    });
    $(item).on('click', '.line-btn-cancel', function () {      
      itemData.canceled=true; 
      update();
    });
    var todoul = document.getElementById('todo-ul');
    todoul.insertBefore(item, todoul.children[0]);
  
  }
    
  });
}
  
if (data.filter == 'All' || data.filter == 'Active') {
    data.items.forEach(function(itemData, index) {
    if (!itemData.completed && !itemData.important&&!itemData.canceled) {
      activeCount++;
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
    item.querySelector('.important').checked=itemData.important;    
    $(item).on('change', '.important', function () {      
      itemData.important = !itemData.important;     
      update();
    });
    item.querySelector('.complete').checked=false;
    $(item).on('change', '.complete', function () {      
      itemData.completed = true;     
      update();
    });
    $(item).on('click', '.line-btn-delete', function () {      
      data.items.splice(index, 1); 
      update();
    });
    $(item).on('click', '.line-btn-cancel', function () {      
      itemData.canceled=true; 
      update();
    });
    var todoul = document.getElementById('todo-ul');
    todoul.insertBefore(item, todoul.children[0]);
    
  
  }
    
  });

  data.items.forEach(function(itemData, index) {
    if (!itemData.completed && itemData.important&&!itemData.canceled) {
      activeCount++;
        var item = document.createElement('li');
        item.classList.add("line-wrapper");
        item.classList.add("importantitem");
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
    item.querySelector('.important').checked=itemData.important;    
    $(item).on('change', '.important', function () {      
      itemData.important = !itemData.important;     
      update();
    });
    item.querySelector('.complete').checked=false;
    $(item).on('change', '.complete', function () {      
      itemData.completed = true;     
      update();
    });
    $(item).on('click', '.line-btn-delete', function () {      
      data.items.splice(index, 1); 
      update();
    });
    $(item).on('click', '.line-btn-cancel', function () {      
      itemData.canceled=true; 
      update();
    });
    var todoul = document.getElementById('todo-ul');
    todoul.insertBefore(item, todoul.children[0]);
    
  
  }
    
  });
}

if (data.filter == 'Canceled') {
  data.items.forEach(function(itemData, index) {
    if (itemData.canceled) {
      canceledCount++;
      
        var item = document.createElement('li');
        item.classList.add("line-wrapper");
        item.classList.add("completed");
        item.innerHTML = [
          '<div class="line-scroll-wrapper">',
          '<div class="line-normal-wrapper">',
          '  <div class="line-normal-left-wrapper">',
          
          '  <div class="item-msg">' + itemData.msg + '</div>',
          '  </div>',
          
          '</div>',
          '<div class="line-btn-cancel"><button>renew</button></div>',
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


    $(item).on('click', '.line-btn-delete', function () {      
      data.items.splice(index, 1); 
      update();
    });
    $(item).on('click', '.line-btn-cancel', function () {      
      itemData.canceled=false; 
      update();
    });
    var todoul = document.getElementById('todo-ul');
    todoul.insertBefore(item, todoul.children[0]);
  
  }
    
  });
}

  if (data.filter == 'All'){
    $('.count').html((activeCount+completedCount)+((activeCount+completedCount) > 1 ? ' items' : ' item'));
  }
  else if(data.filter == 'Active'){
    $('.count').html(activeCount + (activeCount > 1 ? ' items' : ' item'));
  }
  else if(data.filter == 'Completed'){
    $('.count').html(completedCount + (completedCount > 1 ? ' items' : ' item'));
  }
  else{
    $('.count').html(canceledCount + (canceledCount > 1 ? ' items' : ' item'));
  }
  
  //参考开源代码https://github.com/Orange1991/demos-in-sfg.name/tree/master/code/4_left_sliding_button_in_listview
  $(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-cancel").width() + $(".line-btn-delete").width());
  $(".line-normal-wrapper").width($(".line-wrapper").width());
  var lines = $(".line-normal-wrapper");
  var lastX, lastXForMobile;
  
  var pressedObj; 
  var lastObj; 
  
  var start;
  touchHandler = {
    start: function(e) {
      lastXForMobile = e.changedTouches[0].pageX;
      pressedObj = this;  
      
      var touches = event.touches[0];
      start = {
        x: touches.pageX, 
        y: touches.pageY 
      };
    },
    move: function() {
      var touches = event.touches[0];
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      };
      
      if (Math.abs(delta.x) > Math.abs(delta.y)) {
        event.preventDefault();
      }
      
    },
    end: function(e) {
      if (lastObj && pressedObj != lastObj) { 
        $(lastObj).animate({
          marginLeft: "0"
        }, 500); 
        lastObj = null; 
      }
      var diffX = e.changedTouches[0].pageX - lastXForMobile;
      if (diffX < -100) {
        $(pressedObj).animate({
          marginLeft: "-140px"
        }, 500);
        lastObj && lastObj != pressedObj &&
          $(lastObj).animate({
            marginLeft: "0"
          }, 500); 
        lastObj = pressedObj; 
      } else if (diffX > 100) {
        if (pressedObj == lastObj) {
          $(pressedObj).animate({
            marginLeft: "0"
          }, 500); 
          lastObj = null; 
        }
      }
    },
    
  };
  for (var i = 0; i < lines.length; ++i) {
    lines[i].addEventListener("touchstart", touchHandler.start);
    lines[i].addEventListener("touchmove", touchHandler.move);
    lines[i].addEventListener("touchend", touchHandler.end);
  }
 
  for (var i = 0; i < lines.length; ++i) {
    $(lines[i]).bind('mousedown', function (e) {
      lastX = e.clientX;
      pressedObj = this; 
    });
    $(lines[i]).bind('mouseup', function (e) {
      if (lastObj && pressedObj != lastObj) { 
        $(lastObj).animate({
          marginLeft: "0"
        }, 500); 
        lastObj = null; 
      }
      var diffX = e.clientX - lastX;
      if (diffX < -100) {
        $(pressedObj).animate({
          marginLeft: "-140px"
        }, 500); 
        lastObj && lastObj != pressedObj &&
          $(lastObj).animate({
            marginLeft: "0"
          }, 500); 
        lastObj = pressedObj; 
      } else if (diffX > 100) {
        if (pressedObj == lastObj) {
          $(pressedObj).animate({
            marginLeft: "0"
          }, 500); 
          lastObj = null; 
        }
      }
    });
  }
}