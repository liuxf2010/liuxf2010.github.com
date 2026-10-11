/* ============================================================
   基于 jQuery 3.6.0 的页面交互
   ============================================================ */
jQuery(function ($) {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHoverable = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ==========================================================
     1. 顶部导航滚动状态 + 返回顶部显示
     ========================================================== */
  var $header = $('#header');
  var $toTop = $('#toTop');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = $(window).scrollTop();
      $header.toggleClass('scrolled', y > 30);
      $toTop.toggleClass('show', y > 640);
      ticking = false;
    });
  }
  $(window).on('scroll', onScroll);
  onScroll();

  /* ==========================================================
     2. 移动端菜单
     ========================================================== */
  var $menuToggle = $('#menuToggle');
  var $navMenu = $('#navMenu');

  function closeMenu() {
    $navMenu.removeClass('open');
    $menuToggle.removeClass('active').attr('aria-expanded', 'false');
    $('body').css('overflow', '');
  }

  $menuToggle.on('click', function (e) {
    e.stopPropagation();
    var willOpen = !$navMenu.hasClass('open');
    $navMenu.toggleClass('open', willOpen);
    $menuToggle.toggleClass('active', willOpen)
               .attr('aria-expanded', willOpen ? 'true' : 'false');
    $('body').css('overflow', willOpen ? 'hidden' : '');
  });

  // 点击菜单项后关闭
  $navMenu.on('click', 'a', closeMenu);

  // ESC 关闭
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $navMenu.hasClass('open')) {
      closeMenu();
    }
  });

  // 点击菜单外区域关闭
  $(document).on('click', function (e) {
    if (!$navMenu.hasClass('open')) return;
    var $t = $(e.target);
    if ($t.closest('#navMenu').length) return;
    if ($t.closest('#menuToggle').length) return;
    closeMenu();
  });

  /* ==========================================================
     3. 返回顶部
     ========================================================== */
  $toTop.on('click', function () {
    if (prefersReduced) {
      $('html, body').scrollTop(0);
    } else {
      $('html, body').stop(true).animate({ scrollTop: 0 }, 500);
    }
  });

  /* ==========================================================
     4. 滚动入场动画
     ========================================================== */
  var $reveals = $('.reveal');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      $.each(entries, function (_, entry) {
        if (!entry.isIntersecting) return;
        var $el = $(entry.target);
        var idx = $el.parent().children().index(entry.target);
        var delay = (idx > -1 ? idx % 4 : 0) * 90;

        window.setTimeout(function () { $el.addClass('visible'); }, delay);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -70px 0px' });

    $reveals.each(function () { io.observe(this); });
  } else {
    $reveals.addClass('visible');
  }

  /* ==========================================================
     5. 锚点平滑滚动（带顶部偏移）
     ========================================================== */
  $('a[href^="#"]').on('click', function (e) {
    var id = $(this).attr('href');
    if (!id || id === '#' || id.length < 2) return;

    var $target = $(id);
    if (!$target.length) return;

    e.preventDefault();

    var headerH = $(window).width() <= 980 ? 110 : 150;
    var offset = $target.offset().top - headerH + 10;
    offset = Math.max(offset, 0);

    if (prefersReduced) {
      $('html, body').scrollTop(offset);
    } else {
      $('html, body').stop(true).animate({ scrollTop: offset }, 600);
    }
  });

/* ==========================================================
     ★ 3. 二维码浮层 · 共享式（全局单例）
     所有 .qr-link 共用一个浮层
     鼠标移到哪个链接，浮层就出现在哪个链接旁边
     ========================================================== */
  (function qrSharedModule() {
    var $popup = $('#qrGlobalPopup');
    var $mask = $('#qrGlobalMask');
    if (!$popup.length) return;

    var $links = $('.qr-link');
    if (!$links.length) return;

    var hideTimer = null;
    var activeLink = null;

    function isMobile() { return $(window).width() <= 980; }

    /* ---- 显示并定位 ---- */
    function showPopup($link) {
      if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }

      // 高亮当前链接的图标（如果它是 qr-icon-btn）
      $links.removeClass('active');
      if ($link.hasClass('qr-icon-btn')) $link.addClass('active');

      activeLink = $link[0];

      // 移动端：加遮罩 + 屏幕居中
      if (isMobile()) {
        $mask.addClass('show');
        $popup.addClass('show')
              .removeClass('place-top')
              .attr('aria-hidden', 'false');
        return;
      }

      // 桌面端：先显示以获取尺寸，再定位
      $popup.addClass('show')
            .removeClass('place-top')
            .attr('aria-hidden', 'false');

      var pw = $popup.outerWidth();
      var ph = $popup.outerHeight();
      var rect = $link[0].getBoundingClientRect();
      var vw = $(window).width();
      var vh = $(window).height();

      var placeTop = false;
      var top = rect.bottom + 12;
      var left = rect.left + rect.width / 2 - pw / 2;

      // 下方空间不足 → 上方
      if (top + ph > vh - 12) {
        top = rect.top - ph - 12;
        placeTop = true;
      }
      // 上下都放不下（极端情况）：贴底
      if (top < 12) top = 12;

      // 左右边界收拢
      if (left < 12) left = 12;
      if (left + pw > vw - 12) left = vw - pw - 12;

      if (placeTop) $popup.addClass('place-top');
      $popup.css({ top: top, left: left });
    }

    /* ---- 隐藏 ---- */
    function hidePopup(delay) {
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () {
        $popup.removeClass('show').attr('aria-hidden', 'true');
        $mask.removeClass('show');
        $links.removeClass('active');
        activeLink = null;
      }, delay || 0);
    }

    /* ---- 桌面端：悬停显示 / 离开延迟隐藏 ---- */
    if (isHoverable) {
      $links.on('mouseenter', function () { showPopup($(this)); });
      $links.on('mouseleave', function () { hidePopup(150); });

      $popup.on('mouseenter', function () {
        if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = null; }
      });
      $popup.on('mouseleave', function () { hidePopup(150); });
    }

    /* ---- 点击（移动端为主，PC 兜底） ---- */
    $links.on('click', function (e) {
      var href = $(this).attr('href');
      if (!href || href === '#' || href.charAt(0) === '#') {
        e.preventDefault();
      }
      e.stopPropagation();

      var $this = $(this);
      if (activeLink === $this[0] && $popup.hasClass('show')) {
        hidePopup();
      } else {
        showPopup($this);
      }
    });

    /* ---- 点击遮罩关闭 ---- */
    $mask.on('click', function () { hidePopup(); });

    /* ---- 点击其他区域关闭 ---- */
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.qr-link, #qrGlobalPopup, #qrGlobalMask').length) {
        hidePopup();
      }
    });

    /* ---- ESC 关闭 ---- */
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') hidePopup();
    });

    /* ---- 滚动时关闭，避免浮层悬空跟随 ---- */
    $(window).on('scroll', function () { hidePopup(); });

    /* ---- 窗口尺寸变化时关闭，避免定位错乱 ---- */
    $(window).on('resize', function () { hidePopup(); });

  })();

});