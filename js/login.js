define(function (require, exports, module) {
  var Utils = require('utils');
  
  
  $('.js-register').on('click', function () {
    $('#register-modal').fadeIn().find('.do-ajax').hide();
  });
  $('#register-modal').on('click', '.icon-close, .js-cancel', function () {
    $(this).parents('.modal').fadeOut('normal', function () {
      $(this).find('.form-control').val('');
    });
  });

  $('#page-login form').on('focus', 'input, .btn', function () {
    $('#page-login .lg-message').text('');
  });

  $('#register-modal').on('focus', 'input', function () {
    $('#register-modal .warning').text('');
  });

  
  $('.js-confirm').on('click', function () {
    var rstInfo = getRstInfo();
    if (validateRst(rstInfo)) {
      $('#register-modal .do-ajax').show();
      $.ajax({
        url: '../admin/register.php',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(rstInfo)
      }).done(function (res) {
        if (!res.error) {
          $('#register-modal .res').show();
          setTimeout(function () {
            $('#register-modal').fadeOut()
          }, 1000);
        } else {
          $('#register-modal .do-ajax').hide();
          $('#register-modal .warning').text('账号名已存在');
        }
      }).fail(function (error) {
        console.log('error' + error);
      });
    }
  });

  
  $('.js-login').on('click', function () {
    var loginInfo = getLoginInfo();
    if (validateLogin(loginInfo)) {
      $.ajax({
        url: '../admin/login.php',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(loginInfo)
      }).done(function (res) {
        loginSuccess(res);
      }).fail(function (error) {
        console.log('error' + error);
      });
    }
  });

  function loginSuccess(res) {
    if (res.success == 1) {
      $('#nav .log-in-out').text('注销').removeAttr('href');
      sessionStorage.userId = res.id; 
      sessionStorage.username = res.name;
      return location.hash = '#user';
    } else {
      $('#page-login .lg-message').text('用户名或密码错误');
      shakeForm('password');
    }
  }

  
  function getRstInfo() {
    var rstInfo = {
      account: $('#rst-account').val().trim(),
      name: $('#rst-name').val().trim(),
      pwd: $('#rst-pwd').val(),
      password: $('#rst-pwd-check').val()
    };
    return rstInfo;
  }

  
  function validateRst(rstInfo) {
    var res = true;
    var danger = $('#register-modal .warning');
    if (!rstInfo.account) {
      danger.text('请输入账号');
      res = false;
    } else if (!/^[a-zA-Z]+[a-zA-Z0-9]*$/.test(rstInfo.account)) {
      danger.text('账号名不规范');
      res = false;
    } else if (!rstInfo.name) {
      danger.text('请输入用户名');
      res = false;
    } else if (!rstInfo.pwd || !rstInfo.password) {
      danger.text('请输入密码');
      res = false;
    } else if (!/[0-9a-zA-Z]{6,20}/.test(rstInfo.pwd) || rstInfo.pwd.length > 20) {
      danger.text('密码不规范');
      res = false;
    } else if (rstInfo.pwd !== rstInfo.password) {
      danger.text('两次输入密码不一致');
      res = false;
    }
    return res;
  }

  
  function getLoginInfo() {
    var loginInfo = {
      account: $('#account').val().trim(),
      password: $('#password').val()
    };
    return loginInfo;
  }

  
  function validateLogin(loginInfo) {
    if (!loginInfo.account) {
      shakeForm('account');
      return false;
    } else if (!loginInfo.password) {
      shakeForm('password');
      return false;
    }
    return true;
  }

  
  function shakeForm(id) {
    $dom = $('#' + id);
    $dom.addClass('shake-form');
    setTimeout(function () {
      $dom.removeClass('shake-form');
    }, 1200);
  }
});