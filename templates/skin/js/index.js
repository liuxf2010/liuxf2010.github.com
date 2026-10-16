/* ============================================================
   基于 jQuery 3.6.0 的页面交互
   ============================================================ */
jQuery(function ($) {
  'use strict';

  $('.swatch').attr('title', '点击复制色号').on('click', function () {
    var $sw = $(this);
    var $codeEl = $sw.find('.code');
    var $nameEl = $sw.find('.name');
    if (!$codeEl.length || !$nameEl.length) return;

    var code = $.trim($codeEl.text());
    var original = $nameEl.text();
    var timer = null;

    function feedback() {
      $nameEl.text('已复制 ✓');
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        $nameEl.text(original);
      }, 1300);
    }

    function fallbackCopy(text, cb) {
      try {
        var $ta = $('<textarea>').val(text).attr('readonly', true).css({
          position: 'fixed',
          top: '-1000px',
          left: '-1000px',
          opacity: 0
        });
        $('body').append($ta);
        $ta[0].select();
        document.execCommand('copy');
        $ta.remove();
        cb();
      } catch (err) {
        /* 静默失败 */
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(feedback).catch(function () {
        fallbackCopy(code, feedback);
      });
    } else {
      fallbackCopy(code, feedback);
    }
  });

});