define(function (require, exports, module) {
  var Utils = require('utils');

  
  $('#user-tabs').on('click', 'li', function () {
    var userId = sessionStorage.userId;
    $(this).addClass('active').siblings().removeClass('active');
    var flag = $(this).hasClass('js-important') ? 0 : 1;
    getUserData(userId, flag);
  });

  
  $('#box-add').on('click', function () {
    var data = [{
      add: true,
      name: '',
      note: ''
    }];
    $('#task-modal .modal-detail').children('div').remove();
    var tplFnNull = _.template( $('#tpl-modal').html() );
    $('#task-modal .modal-detail').append( tplFnNull(data) );
    $('#task-modal').fadeIn();
  });

  
  $('#task').on('click', '.box', function () {
    var $modal = $('#task-modal .modal-detail');
    var data = [{
      name: $(this).find('.box-name').text(),
      id: $(this).attr('data-id'),
      note: $(this).attr('note')
    }];
    $modal.children('div').remove();
    var level = $(this).attr('level');
    var tplFnModal = _.template( $('#tpl-modal').html() );
    $modal.append( tplFnModal(data) );
    $modal.find('.form-group').children().prop('readonly', 'true');
    $modal.find('select').prop('disabled', true).find('option[rel=' + level + ']').prop('selected', true);
    $('#task-modal').fadeIn();
  });

  $('#task-modal').on('click', '.js-modal-close', function () {
    $(this).parents('.modal').fadeOut();
  });

  
  $('#task-modal').on('click', '.js-modal-save', function () {
    var $this = $(this);
    var userId = sessionStorage.userId;
    var data = getModalData();
    $.ajax({
      url: '../admin/useradd.php',
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(data)
    }).done(function (res) {
      if (res.success) {     
        getNumbers(userId); 
        $('#user-tabs li').eq(data.done).trigger('click');
        $('#task-modal').fadeOut('fast');
      } else {
        Utils.cmptPopUp($this.get(0), 'up', res.msg);
      }
    }).fail(function (error) {
      console.log('error' + error);
    });
  });

  
  $('#task-modal').on('click', '.js-modal-remove', function () {
    var dom = $(this).get(0);
    Utils.cmptRomove(dom, 'up');
  });

  
  $('#task-modal').on('click', '.js-pop-no, .js-pop-yes', function (e) {
    if ($(this).hasClass('js-pop-no')) {
      $('#task-modal .js-modal-remove').trigger('click');
      e.stopPropagation();
    } else {
      var userId = sessionStorage.userId;
      var data = getModalData();
      data.dataId = $('#task-modal').find('.name').attr('data-id');
      $.ajax({
        url: '../admin/userremove.php',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(data)
      }).done(function (res) {
        getNumbers(userId); 
        $('#user-tabs li').eq(data.done).trigger('click');
        $('#task-modal').fadeOut();
      }).fail(function (error) {
        console.log('error' + error);
      });
    } 
  });

  
  function getNumbers(userId) {
    if (!userId) return;
    $.ajax({
      url: '../admin/usernums.php',
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(userId)
    }).done(function (res) {
      setProcess(res);
    }).fail(function (error) {
      console.log('error' + error);
    });
  }

  
  function getUserData(userId, flag) {
    if (!userId) return;
    var data = {
      id: userId,
      flag: flag
    };
    $.ajax({
      url: '../admin/userdata.php',
      type: 'post',
      dataType: 'json',
      data: JSON.stringify(data)
    }).done(function (res) {
      setTaskBox(res.data);
    }).fail(function (error) {
      console.log('error' + error);
    });
  }

  
  function setTaskBox(datas) {
    $('#task').children('div').remove();
    for (var key in datas) {
      var type;
      var level = datas[key].level;
      if (level == 1) {
        type = 'danger';
      } else if (level == 2) {
        type = 'warning';
      } else if (level == 3) {
        type = 'info';
      } else {
        type = 'default';
      }
      datas[key].type = type;
    }
    var tplFnDone = _.template( $('#tpl-task').html() );
    $('#task').append( tplFnDone(datas) );
  }

  
  function getModalData() {
    $this = $('#task-modal');
    var userId = sessionStorage.userId;
    var data = {
      id: userId,
      name: $this.find('.task-name').val().trim(),
      note: $this.find('.task-note').val().trim(),
      level: $this.find('select option:selected').attr('rel')
    }
    data.done = data.level < 3 ? 0 : 1;
    return data;
  }

  
  function setProcess(data) {
    var length = $('#overview canvas').length;
    for (var i = 0; i < length;) {
      var dom = $('#overview canvas').eq(i++);
      var nums = data['level' + i];
      var proportion = nums / data.total * 100;
      Utils.makeCircle(dom.attr('id'), 50, proportion);
    }  
  }

  return {
    getUserData: getUserData,
    getNumbers: getNumbers
  };
});