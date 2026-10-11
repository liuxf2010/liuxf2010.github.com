jQuery(function ($) {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1. 分类筛选
     ========================================================== */
  var $tabs = $('.news-tab');
  var $items = $('.news-item');
  var $empty = $('#newsEmpty');

  if ($tabs.length && $items.length) {

    $tabs.on('click', function () {
      var $tab = $(this);
      var cat = $tab.data('cat');

      // 切换 active 状态
      $tabs.removeClass('active').attr('aria-selected', 'false');
      $tab.addClass('active').attr('aria-selected', 'true');

      // 筛选
      var visible = 0;
      $items.each(function (i) {
        var $item = $(this);
        var match = (cat === 'all' || $item.data('cat') === cat);

        if (match) {
          $item.show();
          visible++;

          if (!prefersReduced) {
            $item.css({
              opacity: 0,
              transform: 'translateY(24px)'
            });
            window.setTimeout(function () {
              $item.css({
                transition: 'opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)',
                opacity: 1,
                transform: 'translateY(0)'
              });
            }, Math.min(i * 60, 360));
          }
        } else {
          $item.hide();
        }
      });

      // 空状态
      if (visible === 0) {
        $empty.addClass('show');
      } else {
        $empty.removeClass('show');
      }
    });

  }

  /* ==========================================================
     2. 分页交互（纯前端演示）
     真实项目请把这里的逻辑换成跳转到对应分页 URL
     ========================================================== */
  var $pages = $('.news-page');

  if ($pages.length) {

    $pages.on('click', function () {
      var $page = $(this);

      // 上一页 / 下一页按钮
      if ($page.find('svg').length) {
        var $active = $pages.filter('.active');
        var isNext = $page.attr('aria-label') === '下一页';

        if (isNext) {
          var $next = $active.next('.news-page');
          if ($next.length && !$next.find('svg').length) {
            switchPage($active, $next);
          }
        } else {
          var $prev = $active.prev('.news-page');
          if ($prev.length && !$prev.find('svg').length) {
            switchPage($active, $prev);
          }
        }
        return;
      }

      // 数字按钮
      if (!$page.hasClass('active') && !$page.hasClass('disabled')) {
        switchPage($pages.filter('.active'), $page);
      }
    });

    function switchPage($from, $to) {
      $from.removeClass('active').removeAttr('aria-current');
      $to.addClass('active').attr('aria-current', 'page');

      // 更新上一页 / 下一页禁用状态
      updateArrows();

      // 平滑滚回列表顶部
      var $list = $('#newsList');
      if ($list.length) {
        var headerH = $(window).width() <= 980 ? 110 : 150;
        var offset = Math.max($list.offset().top - headerH - 10, 0);
        if (prefersReduced) {
          $('html, body').scrollTop(offset);
        } else {
          $('html, body').stop(true).animate({ scrollTop: offset }, 500);
        }
      }
    }

    function updateArrows() {
      var $nums = $pages.filter(function () {
        return !$(this).find('svg').length;
      });
      var $active = $pages.filter('.active');
      var idx = $nums.index($active);

      var $prevBtn = $pages.first();
      var $nextBtn = $pages.last();

      $prevBtn.toggleClass('disabled', idx === 0);
      $nextBtn.toggleClass('disabled', idx === $nums.length - 1);
    }

    // 初始化箭头状态
    updateArrows();
  }

  /* ==========================================================
     3. 热门文章 / 标签点击：占位跳转
     真实项目改成真实链接即可
     ========================================================== */
  $('.hot-item, .side-tag').on('click', function () {
    // 演示：仅做轻微反馈
    var $el = $(this);
    $el.css('transition', 'transform .2s ease');
    $el.css('transform', 'scale(.98)');
    window.setTimeout(function () {
      $el.css('transform', '');
    }, 180);
  });

});