/* main.js — fixed for overlay menu, modal, smooth scroll */

jQuery(document).ready(function($){
  'use strict';

  var $body      = $('body');
  var $menuIcon  = $('.menu-icon');
  var $overlay   = $('.overlay-menu');
  var $modBtn    = $('#modBtn');
  var $modal     = $('#modal');
  var $closeImg  = $modal.find('.close-btn img');
  var $modContent= $modal.find('.modal-content');

  // Modal open/close (existing behavior)
  $modBtn.on('click', function(){
    $modal.css('display','block');
    $modContent.removeClass('modal-animated-out').addClass('modal-animated-in');
  });

  $(document).on('click', function(e){
    var $target = $(e.target);
    if($target.is($modal) || $target.is($closeImg)){
      $modContent.removeClass('modal-animated-in').addClass('modal-animated-out').delay(300).queue(function(next){
        $modal.css('display','none');
        next();
      });
    }
  });

  // Smooth scroll
  $('a.scrollTo').on('click', function(e){
    e.preventDefault();
    var scrollTo = $(this).attr('data-scrollTo');
    if(!scrollTo) return false;

    $('a.scrollTo').each(function(){
      $(this).toggleClass('active', $(this).attr('data-scrollTo') === scrollTo);
    });

    var $target = $('#' + scrollTo);
    if($target.length){
      $('html, body').animate({scrollTop: $target.offset().top}, 900);
    }
    return false;
  });

  // Overlay menu toggle
  function openMenu(){
    $menuIcon.addClass('active');
    $overlay.addClass('open').attr('aria-hidden','false');
    $body.css('overflow','hidden'); // prevent background scroll
    $menuIcon.attr('aria-expanded','true');
  }
  function closeMenu(){
    $menuIcon.removeClass('active');
    $overlay.removeClass('open').attr('aria-hidden','true');
    $body.css('overflow','');
    $menuIcon.attr('aria-expanded','false');
  }
  $menuIcon.on('click', function(e){
    e.stopPropagation();
    if($overlay.hasClass('open')) closeMenu();
    else openMenu();
  });
  // close on overlay click (outside menu)
  $overlay.on('click', function(e){
    if($(e.target).is($overlay)) closeMenu();
  });
  // close when clicking links inside overlay
  $overlay.find('a').on('click', closeMenu);
  // close on ESC
  $(document).on('keyup', function(e){
    if(e.key === "Escape" || e.keyCode === 27){
      if($overlay.hasClass('open')) closeMenu();
      if($modal.is(':visible')){
        $modContent.removeClass('modal-animated-in').addClass('modal-animated-out').delay(300).queue(function(next){
          $modal.css('display','none');
          next();
        });
      }
    }
  });

  // ensure hero margin accounts for nav height
  function updateHeroOffset(){
    var navHeight = $('.sticky-nav').outerHeight() || 0;
    $('.video-content').css('padding-top', navHeight + 'px');
  }
  $(window).on('load resize', updateHeroOffset);
  updateHeroOffset();

});
