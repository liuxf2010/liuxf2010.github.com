jQuery(function ($) {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 分类筛选 ---------- */
  var $tabs = $('.filter-tab');
  var $cards = $('.product-card');
  var $count = $('#filterCount strong');
  var $empty = $('#productEmpty');

  if ($tabs.length && $cards.length) {

    $tabs.on('click', function () {
      var $tab = $(this);
      var cat = $tab.data('cat');

      // 切换 active 状态
      $tabs.removeClass('active').attr('aria-selected', 'false');
      $tab.addClass('active').attr('aria-selected', 'true');

      // 筛选卡片
      var visible = 0;
      $cards.each(function (i) {
        var $card = $(this);
        var match = (cat === 'all' || $card.data('cat') === cat);

        if (match) {
          $card.show();
          visible++;

          // 用动画重新入场
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
            }, Math.min(i * 50, 350));
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

  /* ---------- 产品卡片点击：滚动到 CTA 并高亮 ---------- */
  $('.product-card').on('click', function () {
    var $cta = $('#contact');
    if (!$cta.length) return;

    var headerH = $(window).width() <= 980 ? 110 : 150;
    var offset = Math.max($cta.offset().top - headerH + 10, 0);

    if (prefersReduced) {
      $('html, body').scrollTop(offset);
    } else {
      $('html, body').stop(true).animate({ scrollTop: offset }, 700);
    }

    // 轻微脉冲提示
    var $box = $cta.find('.cta-box');
    if ($box.length) {
      $box.css('animation', 'none');
      window.setTimeout(function () {
        $box.css('animation', '');
      }, 50);
    }
  });

});