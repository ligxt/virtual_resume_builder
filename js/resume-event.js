define(function (require, exports, module) {
  var Utils = require('utils');
  var re = require('resume');

  
  $('#re-sidebar').on('click', 'li:not(:last-child)', function () {
    var name = $(this).attr('name');
    var title = $(this).text();
    var $cfgId = $('#' + name + '-config');
    $('#re-config .header h5').text(title);
    $('#re-config .pop-body').hide();
    $('#re-config .header .base-button').css('display', name === 'basic' ? 'none' : 'block');
    $cfgId.find('[name = header] input').val(title);
    $('.re-config .header, .re-config .footer').fadeIn();
    $cfgId.fadeIn().siblings().hide();
  });

  
  $('#add-module').on('click', function () {
    var counter = $('#re-sidebar li').length - 5; 
    var name = 'new' + counter;
    var header = 'Untitled';
    re.addNewModule(name, header);
  });

  
  $('#do-module').on('click', function () {
    $('#modal-module').fadeIn();
  });
  $('#modal-module').on('click', 'li[name]', function () {
    $(this).addClass('active').siblings().removeClass('active');
  });
  $('#modal-module').on('click', '.cancel-module', function () {
    $('#modal-module').fadeOut().find('li').removeClass('active');
  });
  $('#modal-module').on('click', '.confirm-module', function () {
    if (window.confirm('Using the template will clear the current resume interface')) {
      var name = $('#modal-module').find('.active').attr('name');
      $.ajax({
        url: './' + name + '.json',
        type: 'get',
        dataType: 'json'
      }).done(function (res) {
        re.clear();
        re.setConfig(res);
        re.save();
        $('#modal-module .cancel-module').trigger('click');
      }).fail(function (error) {
        console.log('error' + error);
      });
    }
  });

  
  $('#re-config').on('click', '.js-shift-up, .js-shift-down', function() {
    if ($('#re-config').hasClass('exchanging')) return;
    var thisName = $('#re-config').find('.js-config-li:visible').attr('id').slice(0, -7);
    var $prev = $('.re-' + thisName).prev();
    var $next = $('.re-' + thisName).next();
    if ($(this).hasClass('js-shift-up') && $prev.length !== 0) {
      $('#re-config').addClass('exchanging');
      var prevName = $prev.attr('class').substr(10);
      re.exchangeRebox(thisName, prevName);
    } else if ($(this).hasClass('js-shift-down') && $next.length !== 0) {
      $('#re-config').addClass('exchanging');
      var nextName = $next.attr('class').substr(10);
      re.exchangeRebox(thisName, nextName, true);
    }
  });

  
  $('#re-config').on('click', '.js-remove', function() {
    var dom = $(this).get(0);
    Utils.cmptRomove(dom, 'down'); 
  });

  
  $('#re-config').on('click', '.js-pop-no, .js-pop-yes', function (e) {
    if ($(this).hasClass('js-pop-no')) {
      $(this).parent('.pop-body').slideUp();
      e.stopPropagation();
    } else {
      var thisName = $('#re-config').find('.js-config-li:visible').attr('id').slice(0, -7);
      var $this = $('#' + thisName + '-config');
      var thisSort = $this.attr('sort');
      $('.js-config-li').each(function() {
        var sort = $(this).attr('sort');
        if (sort > thisSort)
          $(this).attr('sort', --sort);
      });
      $('.re-' + thisName).remove();
      $this.removeAttr('sort').find('input, textarea').val('');
      $this.find('select').each(function () {
        $(this).children('option:first').prop('selected',true).trigger('change');
      });
      $this.find('.can-add-group').children(':gt(0)').remove();
      if (thisName.slice(0, 3) == 'new') {
        $this.remove();
        $('#re-sidebar li[name=' + thisName + ']').remove();
      }
      $(this).parent('.pop-body').slideUp();
      re.save();
    }
  });

  
  $('#zoomIn, #zoomOut').on('click', function () {
    var zoom = parseInt($('.zoom-in-out').attr('zoom'));
    zoom = $(this).attr('id') == 'zoomIn' ? zoom + 20 : zoom - 20;
    if (zoom > 200 || zoom < 40) return;
    if (zoom == 200 || zoom == 40) $(this).attr('disabled', true);
    $('.js-re-resume').css('transform', 'scale(' + zoom / 100 + ')');
    $('.zoom-in-out').attr('zoom', zoom + '%');
    $(this).siblings().removeAttr('disabled');
  });

  
  $('.js-re-resume').on('change', '.user-photo input', function () {
    var file = this.files[0];
    if(window.FileReader) {
      if(!/image\/\w+/.test(file.type)){ 
        alert("文件必须为图片！");
        return false; 
      }
      var fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = function(e) {
        $('.js-re-resume .user-photo img').attr('src', this.result);
      }
    } else {
      console.log('Error');
    }
  });

  
  $('#uploadJson input').on('click', function () {
    $(this).val('');
  });
  $('#uploadJson input').on('change', function () {
    var file = this.files[0];
    if(window.FileReader) {
      var fr = new FileReader();
      fr.onloadend = function(e) {
        var userConfig = this.result;
        re.setConfig(JSON.parse(userConfig)); 
        re.save();
      };
      fr.readAsText(file);
    } else {
      console.log('Error'); 
    }
  });

  
  $('#do-print').on('click', function() {
    window.print();
  });

  
  $('#do-clear').on('click', function() {
    if (window.confirm('Are you sure?')) {
      re.clear();
    }
  });

  
  $('#do-pdf').on('click', function () {
    $('#do-module').css('display', 'none');
    $('.user-photo input').val('');

    setTimeout(startPdf, 1000);

    kendo.drawing
      .drawDOM("#resume-download",
        {
          paperSize: "A4",
          margin: { top: "1cm", bottom: "1cm" },
          scale: 0.7,
          height: 500,
        })
      .then(function (group) {
        kendo.drawing.pdf.saveAs(group, "rb.pdf")
      });
    function startPdf() {
      $('#do-module').css('display','block');
    }
  })

  
  $('#re-config').on('click', '.js-config-ok, .js-config-cancel', function () {
    var cfgId = $('#re-config').find('.body > li:visible').attr('id');
    var $cfgId = $('#' + cfgId);
    var name = cfgId.substr(0, cfgId.length - 7);
    var box = $cfgId.attr('box');
    if ($(this).hasClass('js-config-ok')) {
      var children = $('#layout' + box).children().length;
      if (!$cfgId.attr('sort') && name != 'basic') $cfgId.attr('sort', children);
      if (name != 'basic') {
        var data = re.getCompile(name);
        var html = re.switchResume(name, data);
        re.setResume(name, data, html);
      }  
      re.save();
    } else {
      re.cancel(cfgId);   
    }
  });

  
  $('#re-config').on('change', '[name=select-box] select', function () {
    var box = $(this).parents('.js-config-li').attr('box');
    var thisSort = $(this).parents('.js-config-li').attr('sort');
    $(this).parents('.js-config-li').attr('box', $(this).val());
    if (!thisSort || $(this).val() == box) return;
    var $newBox = $('#layout' + $(this).val());
    var $oldBox = $('#layout' + $(this).children(':selected').siblings().attr('value'));
    var name = $(this).parents('.js-config-li').attr('id').slice(0, -7);   
    $('.js-config-li[box=' + box + ']').each(function() {
      var sort = $(this).attr('sort');
      if (sort > thisSort)
        $(this).attr('sort', --sort);
    });
    $newBox.append($('.re-' + name));
    $oldBox.find('.re-' + name).remove();
    $(this).parents('.js-config-li').attr('sort', --$newBox.children().length);
  });

  
  $('#re-config').on('click', '.can-add-group .can-add', function () {
    var $parent = $(this).parents('.js-config-li');
    var $dom = $parent.find('.icon:last').parents('.form-group').clone();
    var name = $dom.attr('name');
    var index = name.lastIndexOf('-'); 
    var nums = +name.substr(++index) + 1;
    $dom.attr('name', name.slice(0, index) + nums).find('input, textarea').val('');
    $parent.find('.icon:last').parents('.form-group').after($dom);
  });

  
  $('#re-config').on('click', '.can-add-group .can-remove', function () {
    var $dom = $(this).parents('.form-group');
    var name = $dom.attr('name');
    var index = name.lastIndexOf('-'); 
    var pre = name.slice(0, index); 
    $dom.nextAll('[name*=' + pre + ']').each(function () {
      var thisName = $(this).attr('name');
      var nums = +thisName.substr(index + 1) - 1;
      $(this).attr('name', pre + '-' + nums);
    });
    $dom.remove();
  });

  
  $('#re-config').on('change', '#basic-general input', function () {
    var topBottom = $('#basic-general [value = top-bottom] input').val() || 0;
    var leftRight = $('#basic-general [value = left-right] input').val() || 0;
    var fontSize = $('#basic-general [value = font-size] input').val() || 14;
    var padding = topBottom + 'px ' + leftRight + 'px';
    $('.js-re-resume').css({
      'padding': padding,
      'font-size': fontSize + 'px'
    });
  });

  
  $('#re-config').on('change', '#basic-general [value=layout] select', function () {
    var value = $(this).find('option:selected').attr('value').substr(0, 1);
    if (value == '0') {
      $('[name=select-box]').hide().children('select').val('One').trigger('change');
    } else {
      $('[name=select-box]').show();
    }
    re.changeLayout(value);
  });

  
  $('#re-config').on('change', '#basic-general [value=symbol] select', function () {
    $('.js-re-resume').attr('symbol', $(this).val());
  });

  
  $('#re-config').on('change', '#basic-title [value=color] input, #basic-title [value=fr-color] input' , function() {
    var color = $('#basic-title [value=color] input').val().trim();
    var frColor = $('#basic-title [value=fr-color] input').val().trim();
    $('.re-header').css({
      'background-color': color,
      'border-color': color,
      'color': frColor
    });
    $('.cmpt').css('border-color', color);
  });

  
  $('#re-config').on('change', '#basic-title [value=style] select' , function() {
    var style = $(this).val();
    switch(style) {
      case 'none':
        $('.re-header').hide();
        break;
      case 'outline':
        $('.re-header').attr('class', 're-header hd-outline').slideDown();
        break;
      case 'bottom':
        $('.re-header').attr('class', 're-header hd-bottom').slideDown();
        break;
      case 'standard':
        $('.re-header').attr('class', 're-header').slideDown();
        break;
    }
  });

  
  $('#re-config').on('change', '#info-config [name=layout] select', function () {
    $('.re-info .row').attr('class', 'row ' + $(this).val());
  });

  
  $('#re-config').on('change', '#info-config [value=photo] select', function () {
    $('.re-info .user-photo').attr('class', 'user-photo ' + $(this).val());
  });

  
  $('#select-edu-type select').on('change', function () {
    var type = $(this).val();
    $('#edu-config').attr('type', type);
  });

  
  $('#re-config').on('change', '[name=select-component] select', function () {
    var component = $(this).val();
    var $dom = $(this).parent().next();
    $dom.find('.input-group').hide();
    if (component == 'line-down') {
      $dom.find('[value=progress], [value=title]').show();
    } else {
      $dom.find('[value=start], [value=end], [value=title], [value=key], [value=details]').show();
    }
  });
});