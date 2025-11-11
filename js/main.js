/* Updated main.js — paste over your existing main.js */
jQuery(document).ready(function($) {
  'use strict';

  // Elements
  var $doc        = $(document);
  var $body       = $('body');
  var $menuIcon   = $('.menu-icon');
  var $overlay    = $('.overlay-menu');
  var $modBtn     = $('#modBtn');
  var $modal      = $('#modal');
  var $closeImg   = $modal.find('.close-btn img');
  var $modContent = $modal.find('.modal-content');

  // === Modal logic (keep existing) ===
  $modBtn.on('click', function() {
    $modal.css('display', 'block');
    $modContent.removeClass('modal-animated-out').addClass('modal-animated-in');
  });

  $doc.on('click', function(e) {
    var $target = $(e.target);
    if ($target.is($modal) || $target.is($closeImg)) {
      $modContent.removeClass('modal-animated-in').addClass('modal-animated-out').delay(300).queue(function(next) {
        $modal.css('display', 'none');
        next();
      });
    }
  });

  // === Smooth scroll for anchors with class .scrollTo ===
  $('a.scrollTo').on('click', function(e) {
    e.preventDefault();
    var scrollTo = $(this).attr('data-scrollTo');
    if (!scrollTo) return false;

    // toggle active class
    $('a.scrollTo').each(function() {
      $(this).toggleClass('active', $(this).attr('data-scrollTo') === scrollTo);
    });

    // scroll
    var $target = $('#' + scrollTo);
    if ($target.length) {
      $('html, body').animate({ scrollTop: $target.offset().top }, 900);
    }
    return false;
  });

  // === Overlay Menu Toggle ===
  function openMenu() {
    $menuIcon.addClass('active');
    $overlay.addClass('open').attr('aria-hidden', 'false');
    $body.css('overflow', 'hidden'); // prevent background scroll
  }
  function closeMenu() {
    $menuIcon.removeClass('active');
    $overlay.removeClass('open').attr('aria-hidden', 'true');
    $body.css('overflow', ''); // restore scroll
  }

  $menuIcon.on('click', function(e) {
    e.stopPropagation();
    if ($overlay.hasClass('open')) closeMenu();
    else openMenu();
  });

  // Close if clicking outside the overlay content
  $overlay.on('click', function(e) {
    // if click occurred directly on the overlay background (not on inner menu)
    if ($(e.target).is($overlay)) closeMenu();
  });

  // Close when user presses Escape
  $(document).on('keyup', function(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      if ($overlay.hasClass('open')) closeMenu();
      if ($modal.is(':visible')) {
        $modContent.removeClass('modal-animated-in').addClass('modal-animated-out').delay(300).queue(function(next) {
          $modal.css('display', 'none');
          next();
        });
      }
    }
  });

  // Close when clicking a link inside the overlay (so nav goes away on selection)
  $overlay.find('a').on('click', function() {
    closeMenu();
  });

  // Keep the original click handler for the menu-icon small-screen animation in case other code relies on it
  $menuIcon.on('click', function() {
    $(this).toggleClass('active'); // harmless duplicate toggle (kept for compatibility)
  });

  // ===== small helper: center video-content behind fixed nav if nav height changes =====
  function updateHeroOffset() {
    var navHeight = $('.sticky-nav').outerHeight() || 0;
    // ensures the hero inner content sits visually below nav on small screens
    $('.video-content').css('margin-top', navHeight + 'px');
  }
  $(window).on('load resize', updateHeroOffset);
  updateHeroOffset();

});
