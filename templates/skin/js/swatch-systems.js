jQuery(function ($) {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1. 数字滚动（保持不变）
     ========================================================== */
  var $counters = $('[data-count]');
  var counted = false;

  function formatNum(v) {
    return v >= 1000
      ? v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : String(v);
  }

  function runCounters() {
    if (counted) return;
    counted = true;

    $counters.each(function () {
      var $el = $(this);
      var target = parseFloat($el.attr('data-count')) || 0;

      if (prefersReduced) { $el.text(formatNum(target)); return; }

      $({ val: 0 }).animate({ val: target }, {
        duration: 1700,
        easing: 'swing',
        step: function () { $el.text(formatNum(Math.round(this.val))); },
        complete: function () { $el.text(formatNum(target)); }
      });
    });
  }

  var $statsBar = $('.stats-bar');
  if ($statsBar.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { runCounters(); sio.disconnect(); }
    }, { threshold: 0.3 });
    sio.observe($statsBar[0]);
  } else {
    runCounters();
  }

  /* ==========================================================
     2. 色卡体系切换（新增）
     点击标签切换对应体系色卡
     ========================================================== */
  var $sysTabs = $('.swatch-tab');
  var $sysGroups = $('.swatch-group');

  if ($sysTabs.length && $sysGroups.length) {
    $sysTabs.on('click', function () {
      var $tab = $(this);
      var sys = $tab.data('sys');

      // 切换标签状态
      $sysTabs.removeClass('active').attr('aria-selected', 'false');
      $tab.addClass('active').attr('aria-selected', 'true');

      // 切换色卡分组
      $sysGroups.removeClass('active');
      $sysGroups.filter('[data-sys="' + sys + '"]').addClass('active');
    });
  }

  /* ==========================================================
     3. 色卡点击复制色号（保持不变）
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
      timer = window.setTimeout(function () { $nameEl.text(original); }, 1300);
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