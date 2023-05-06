define(function (require, exports, module) {
  var Utils = {
    getLocalStorage: function (key) {
      var data;
      if (window.localStorage) {
        data = localStorage.getItem(key);
      } else {
        console.log('Your browser does not support localStorage');
      }
      return JSON.parse(data);
    },

    setLocalStorage: function (key, data) {
      data = JSON.stringify(data);
      if (window.localStorage) {
        localStorage.setItem(key, data);
      } else {
        console.log('Your browser does not support localStorage');
      }
    },

    cmptRomove: function (dom, pos) {
      var html = '<p>Confirm delete?</p>' +        
                 '<button class="btn btn-cancel btn-xs js-pop-no">No</button>' +
                 '<button class="btn btn-main btn-xs js-pop-yes">Yes</button>';
      this.cmptPopUp(dom, pos, html);
    },

    cmptPopUp: function (dom, pos, html) {
      html = '<div class="pop-body arrow pop-' + pos + '">' + html + '</div>';
      if (!$(dom).find('.pop-body').length) {
        $(dom).addClass('cmpt-pop-up').append(html);
      }
      $(dom).find('.pop-body').slideToggle();
    },

    cmptHtml: function (cmpt, content) {
      var html;
      switch(cmpt) {
        case 'line-down':
          html = this.cmptProDown(content);
          break;
      }
      return '<div class="row">' + html + '</div>';
    },

    cmptProDown: function (content) {
      var color = $('#basic-title [value=color] input').val().trim();
      return '<div class="col-xs-12">' + content.title + '<div class="cmpt cmpt-pro-down" style="width:' + content.pro + '%; border-color:' + color + '"></div></div>';
    },

    makeCircle: function (id, radius, process) {
      var time = 0;
      var $selector = $('#' + id);
      $selector.get(0).height = $selector.get(0).width = radius * 2;
      this.setTimeCircle($selector, time, radius, process);
    },
     
    
    setTimeCircle: function ($selector, time, radius, process) {
      $selector.text(time + '%');
      this.drawCircle($selector, radius);
      if (time < process){
        time++;     
        setTimeout(function () {
          Utils.setTimeCircle($selector, time, radius, process);
        }, 20);
      }
    },

    
    drawCircle: function ($selector, radius) {  
      var text = $selector.text();
      var process = text.substring(0, text.length-1);
      var context = $selector.get(0).getContext('2d'); 

      context.clearRect(0, 0, radius, radius); 
      context.beginPath(); 
      context.moveTo(radius, radius); 
      context.arc(radius, radius, radius, 0, Math.PI*2, false); 
      context.closePath();
      context.fillStyle = '#eee'; 
      context.fill();
                    
      context.beginPath(); 
      context.moveTo(radius, radius);
      context.arc(radius, radius, radius, -Math.PI/2, Math.PI*2 * process / 100 - Math.PI/2, false);
      context.closePath();
      var color = process > 50 ? '#fa8480' : '#2eafb5';
      context.fillStyle = color;
      context.fill();
        
      
      context.beginPath();
      context.moveTo(radius, radius);
      context.arc(radius, radius, radius - 4, 0, Math.PI*2, true);
      context.closePath();
      context.fillStyle = '#fff';
      context.fill();
          
      
      context.font = 'normal 16px Arial';
      context.fillStyle = '#2eafb5';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.moveTo(radius, radius);
      context.fillText(text, radius, radius);
    }
  };
  module.exports = Utils;
});