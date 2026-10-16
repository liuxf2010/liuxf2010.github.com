jQuery(function ($) {
  'use strict';

  /* ==========================================================
     1. 复制当前页面链接
     ========================================================== */
  $('#copyLink').on('click', function (e) {
    e.preventDefault();

    var url = window.location.href;

    function feedback() {
      var $btn = $('#copyLink');
      var originalHtml = $btn.html();
      $btn.html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>');

      setTimeout(function () {
        $btn.html(originalHtml);
      }, 1300);
    }

    function fallback(text, cb) {
      try {
        var $ta = $('<textarea>').val(text).attr('readonly', true).css({
          position: 'fixed', top: '-1000px', left: '-1000px', opacity: 0
        });
        $('body').append($ta);
        $ta[0].select();
        document.execCommand('copy');
        $ta.remove();
        cb();
      } catch (err) { /* 静默失败 */ }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(feedback).catch(function () {
        fallback(url, feedback);
      });
    } else {
      fallback(url, feedback);
    }
  });

  $('.article-body img').each(function () {
    if (!this.getAttribute('loading')) {
      this.setAttribute('loading', 'lazy');
    }
  });

});