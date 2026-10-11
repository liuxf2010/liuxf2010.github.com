jQuery(function ($) {
  'use strict';

  /* ==========================================================
     1. 色卡分类筛选
     ========================================================== */
  var $tabs = $('.swatch-tab');
  var $swatches = $('.swatch');

  if ($tabs.length && $swatches.length) {

    $tabs.on('click', function () {
      var $tab = $(this);
      var cat = $tab.data('cat');

      $tabs.removeClass('active').attr('aria-selected', 'false');
      $tab.addClass('active').attr('aria-selected', 'true');

      $swatches.each(function () {
        var $sw = $(this);
        var match = (cat === 'all' || $sw.data('cat') === cat);
        $sw.toggle(match);
      });
    });

  }

  /* ==========================================================
     2. 色卡点击复制色号
     ========================================================== */
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
      navigator.clipboard.writeText(code).then(feedback).catch(function () {
        fallbackCopy(code, feedback);
      });
    } else {
      fallbackCopy(code, feedback);
    }
  });

});