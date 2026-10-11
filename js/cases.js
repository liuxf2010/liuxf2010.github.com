jQuery(function ($) {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1. 分类筛选
     ========================================================== */
  var $tabs = $('.cases-tab');
  var $cards = $('.case-card');
  var $count = $('#casesCount strong');
  var $empty = $('#casesEmpty');

  if ($tabs.length && $cards.length) {

    $tabs.on('click', function () {
      var $tab = $(this);
      var cat = $tab.data('cat');

      // 切换 active 状态
      $tabs.removeClass('active').attr('aria-selected', 'false');
      $tab.addClass('active').attr('aria-selected', 'true');

      // 筛选
      var visible = 0;
      $cards.each(function (i) {
        var $card = $(this);
        var match = (cat === 'all' || $card.data('cat') === cat);

        if (match) {
          $card.show();
          visible++;

          if (!prefersReduced) {
            $card.css({
              opacity: 0,
              transform: 'translateY(24px)'
            });
            window.setTimeout(function () {
              $card.css({
                transition: 'opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)',
                opacity: 1,
                transform: 'translateY(0)'
              });
            }, Math.min(i * 50, 400));
          }
        } else {
          $card.hide();
        }
      });

      // 更新计数
      if ($count.length) $count.text(visible);

      // 空状态
      if (visible === 0) {
        $empty.addClass('show');
      } else {
        $empty.removeClass('show');
      }
    });

  }

  /* ==========================================================
     2. 数据条数字滚动
     ========================================================== */
  var $counters = $('.cases-stats [data-count]');
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

  var $statsBar = $('.cases-stats');
  if ($statsBar.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        runCounters();
        sio.disconnect();
      }
    }, { threshold: 0.3 });
    sio.observe($statsBar[0]);
  } else {
    runCounters();
  }

});