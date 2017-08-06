/*!
 * amaretti v0.0.1 (http://foxythemes.net/themes/amaretti)
 * Copyright 2014-2016 Foxy Themes all rights reserved 
 */
var App = (function () {
  'use strict';

  //Basic Config
  var config = {
    assetsPath: 'assets',
    imgPath: 'img',
    jsPath: 'js',
    libsPath: 'lib',
    leftSidebarSlideSpeed: 200,
    enableSwipe: true,
    swipeTreshold: 100,
    scrollTop: true,
    openLeftSidebarClass: 'open-left-sidebar',
    openRightSidebarClass: 'open-right-sidebar',
    removeLeftSidebarClass: 'am-nosidebar-left',
    transitionClass: 'am-animate',
    openSidebarDelay: 400,
    syncSubMenuOnHover: false
  };

  var colors = {};
  var body = $("body");
  var wrapper = $(".am-wrapper");
  var leftSidebar = $(".am-left-sidebar");
  var rightSidebar = $(".am-right-sidebar");
  var openSidebar = false;

  //Get the template css colors into js vars
  function getColor( c ){
    var tmp = $("<div>", { class: c }).appendTo("body");
    var color = tmp.css("background-color");
    tmp.remove();

    return color;
  }

  //Core private functions
  function leftSidebarInit(){

    function syncSubMenu( item ){
      var elements = $(".sidebar-elements > li", leftSidebar);

      if( typeof item !== "undefined" ) {
        elements = item;
      }

      $.each( elements, function(i, v){

        var title = $(this).find("> a span").html();
        var ul = $(this).find("> ul");
        var subEls = $("> li", ul);
        var title = $('<li class="title">' + title + '</li>');
        var subContainer = $('<li class="nav-items"><div class="am-scroller nano"><div class="content nano-content"><ul></ul></div></div></li>');

        if( !ul.find("> li.title").length > 0 ){
         ul.prepend( title );
          subEls.appendTo( subContainer.find(".content ul") );
          subContainer.appendTo( ul );
        }
      });
    }

    /*Create sub menu elements*/
      syncSubMenu();

    function oSidebar(){
      body.addClass( config.openLeftSidebarClass + " " + config.transitionClass );
      openSidebar = true;
    }

    function cSidebar(){
      body.removeClass( config.openLeftSidebarClass ).addClass( config.transitionClass );
      sidebarDelay();
    }

    /*Open-Sidebar when click on topbar button*/
      $('.am-toggle-left-sidebar').on("click", function(e){
        if( openSidebar && body.hasClass( config.openLeftSidebarClass ) ){
          cSidebar();
        }else if( !openSidebar ){
          oSidebar();
        }
        e.stopPropagation();
        e.preventDefault();
      });

    /*Close sidebar on click outside*/
      $(document).on("touchstart mousedown",function(e){
        if ( !$(e.target).closest(leftSidebar).length && body.hasClass( config.openLeftSidebarClass ) ) {
          cSidebar();
        }
      });

    var firstAnchor = $(".sidebar-elements > li > a", leftSidebar);

    /*Sub-menu title func*/
      firstAnchor.on('mouseover',function(){
        var amScroller = $(this).parent().find(".am-scroller");
        var li = $(this).parent();
        var subMenu = li.find("> ul");

        //Delay after mouse leave
        if( !$.isXs() ){
          $("ul.visible", leftSidebar).removeClass("visible");
          subMenu.removeClass("hide");
          subMenu.addClass("visible");
        }

        amScroller.nanoScroller({ destroy: true });
        amScroller.nanoScroller();

        //Create sub-menu elements
        if( config.syncSubMenuOnHover ){
          syncSubMenu( li );
        }
        
      });

    /*Sub-menu delay on mouse leave*/
      firstAnchor.on('mouseleave',function(){
        var subMenu = $(this).parent().find("> ul");
        if( !$.isXs() ){
          setTimeout(function(){
            subMenu.removeClass("visible");
          }, 300);
        }
      });

    /*Open sub-menu on small devices*/
      $(".sidebar-elements li a", leftSidebar).on("click",function( e ){
        if( $.isXs() ){
          var $el = $(this), $open, $speed = config.leftSidebarSlideSpeed;
          var $li = $el.parent();
          var $subMenu = $el.next();

          $open = $li.siblings(".open");

          if( $open ){
            $open.find('> ul:visible').slideUp({ duration: $speed, complete: function(){
              $open.toggleClass('open');
              $(this).removeAttr('style');
            }});
          }

          if( $li.hasClass('open') ){
            $subMenu.slideUp({ duration: $speed, complete: function(){
              $li.toggleClass('open');
              $(this).removeAttr('style');
            }});
          }else{
            $subMenu.slideDown({ duration: $speed, complete: function(){
              $li.toggleClass('open');
              $(this).removeAttr('style');
            }});
          }

          if( $el.next().is('ul') ){
            e.preventDefault();
          }
        }else{
          //Close sub-menu on anchor click
          var subMenu = $(".sidebar-elements > li > ul:visible", leftSidebar);
          subMenu.addClass('hide');
        }
      });

    /*Calculate sidebar tree active & open classes*/
      $("li.active", leftSidebar).parents(".parent").addClass("active open");

    /*Nanoscroller when left sidebar is fixed*/
      if( wrapper.hasClass("am-fixed-sidebar") ){
        var lsc = $(".am-left-sidebar > .content");
        lsc.wrap('<div class="am-scroller nano"></div>');
        lsc.addClass("nano-content");
        lsc.parent().nanoScroller();
      }

    /*On window resize check for small resolution classes to remove them*/
      $(window).resize(function () {
        waitForFinalEvent(function(){
          if( !$.isXs() ){
            var scroller = $(".am-scroller");
            scroller.nanoScroller({ destroy: true });
            scroller.nanoScroller();
          }
        }, 500, "am_check_phone_classes");
      });
  }

  function rightSidebarInit() {

    function oSidebar() {
      body.addClass( config.openRightSidebarClass  + " " + config.transitionClass );
    }

    function cSidebar() {
      body.removeClass( config.openRightSidebarClass ).addClass( config.transitionClass );
      sidebarDelay();
    }

    if (rightSidebar.length > 0) {
      /*Open-Sidebar when click on topbar button*/
      $('.am-toggle-right-sidebar').on("click", function(e){
        if( openSidebar && body.hasClass( config.openRightSidebarClass ) ){
          cSidebar();
        }else if( !openSidebar ){
          oSidebar();
        }
        
        e.stopPropagation();
        e.preventDefault();
      });

      /*Close sidebar on click outside*/
      $( document ).on("mousedown touchstart",function( e ){
        if ( !$( e.target ).closest( rightSidebar ).length && body.hasClass( config.openRightSidebarClass ) ) {
          cSidebar();
        }
      });
    }
  }

  function sidebarDelay(){
    openSidebar = true;
    setTimeout(function(){
      openSidebar = false;
    }, config.openSidebarDelay );
  }

  function sidebarSwipe(){
    /*Open sidedar on swipe*/
    wrapper.swipe( {
      allowPageScroll: "vertical",
      preventDefaultEvents: false,
      fallbackToMouseEvents: false,
      swipeRight: function(e) {
        if( !openSidebar && !wrapper.hasClass( config.removeLeftSidebarClass ) ){
          body.addClass( config.openLeftSidebarClass + " " + config.transitionClass );
          openSidebar = true;
        }
      },
      swipeLeft: function(e){
        if( !openSidebar && rightSidebar.length > 0 ){
          body.addClass( config.openRightSidebarClass + " " + config.transitionClass );
          openSidebar = true;
        }
      },
      threshold: config.swipeTreshold
    });
  }

  function chatWidget(){
    var chat = $(".am-right-sidebar .tab-pane.chat");
    var contactsEl = $(".chat-contacts", chat);
    var conversationEl = $(".chat-window", chat);
    var messagesContainer = $(".chat-messages", conversationEl);
    var messagesList = $(".content > ul", messagesContainer);
    var messagesScrollContent = $(".nano-content", messagesContainer);
    var chatInputContainer = $(".chat-input", conversationEl);
    var chatInput = $("input", chatInputContainer);
    var chatInputSendButton = $(".send-msg", chatInputContainer);

    function openChatWindow(){
      if( !chat.hasClass("chat-opened") ){
        chat.addClass("chat-opened");
        $(".am-scroller", messagesContainer).nanoScroller();
      }
    }

    function closeChatWindow(){
      if( chat.hasClass("chat-opened") ){
        chat.removeClass("chat-opened");
      }
    }

    /*Open Conversation Window when click on chat user*/
    $(".user a", contactsEl).on('click',function( e ){
      $(".am-scroller", contactsEl).nanoScroller({ stop: true });
      openChatWindow();
      e.preventDefault();
    });

    /*Close chat conv window*/
    $(".title .return", conversationEl).on('click',function( e ){
      closeChatWindow();
      scrollerInit();
    });

    /*Send message*/
    function sendMsg(msg, self){
      var $message = $('<li class="' + ((self)?'self':'friend') + '"></li>');

      if( msg != '' ){
        $('<div class="msg">' + msg + '</div>').appendTo($message);
        $message.appendTo(messagesList);

        messagesScrollContent.stop().animate({
          'scrollTop': messagesScrollContent.prop("scrollHeight")
        }, 900, 'swing');

        scrollerInit();
      }
    }

    /*Send msg when click on 'send' button or press 'Enter'*/
      chatInput.keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var msg = $(this).val();

        if(keycode == '13'){
          sendMsg(msg, true);
          $(this).val("");
        }
        event.stopPropagation();
      });

      chatInputSendButton.on('click',function(){
        var msg = chatInput.val();
        sendMsg(msg, true);
        chatInput.val("");
      });
  }

  function scrollerInit(){
    $(".am-scroller").nanoScroller();
  }

  function scrollTopButton(){
    var offset = 220;
    var duration = 500;
    var button = $('<div class="am-scroll-top"></div>');
    button.appendTo("body");
    
    $(window).on('scroll',function() {
      if ( $(this).scrollTop() > offset ) {
        button.fadeIn(duration);
      } else {
        button.fadeOut(duration);
      }
    });
  
    button.on('touchstart mouseup',function( e ) {
      $( 'html, body' ).animate({ scrollTop: 0 }, duration);
      e.preventDefault();
    });
  }

  //Wait for final event on window resize
  var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = "x1x2x3x4";
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();

  return {
    //General data
    conf: config,
    color: colors,

    //Init function
    init: function (options) {
      
      //Extends basic config with options
        $.extend( config, options );

      /*Left Sidebar*/
        leftSidebarInit();

      /*FastClick on mobile*/
        FastClick.attach(document.body);
      
      /*Right Sidebar*/
        rightSidebarInit();
        chatWidget();

      /*Sidebars Swipe*/
        if( config.enableSwipe ){
          sidebarSwipe();
        }

      /*Body transition effect*/
        leftSidebar.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
          body.removeClass( config.transitionClass );
        });

      /*Scroll Top button*/
        if( config.scrollTop ){
          scrollTopButton();
        }

      /*Get colors*/
        colors.primary = getColor('clr-primary');
        colors.success = getColor('clr-success');
        colors.info    = getColor('clr-info');
        colors.warning = getColor('clr-warning');
        colors.danger  = getColor('clr-danger');
        colors.alt1    = getColor('clr-alt1');
        colors.alt2    = getColor('clr-alt2');
        colors.alt3    = getColor('clr-alt3');
        colors.alt4    = getColor('clr-alt4');

      //Prevent Connections Dropdown closes on click
        $(".am-connections").on("click",function( e ){
          e.stopPropagation();
        });

      //Nanoscroller init function
        scrollerInit();

      /*Bind plugins on hidden elements*/
      /*Dropdown shown event*/
        $('.dropdown').on('shown.bs.dropdown', function () {
          $(".am-scroller").nanoScroller();
        });
        
      /*Tabs refresh hidden elements*/
        $('.nav-tabs').on('shown.bs.tab', function (e) {
          $(".am-scroller").nanoScroller();
        });


      /*Tooltips*/
        $('[data-toggle="tooltip"]').tooltip();
      
      /*Popover*/
        $('[data-toggle="popover"]').popover();

      /*Bootstrap modal scroll top fix*/
        $('.modal').on('show.bs.modal', function(){
          $("html").addClass('am-modal-open');
        });

        $('.modal').on('hidden.bs.modal', function(){
          $("html").removeClass('am-modal-open');
        });
    },

    //Methods
    closeSubMenu: function(){
      var subMenu = $(".sidebar-elements > li > ul:visible", leftSidebar);
      subMenu.addClass('hide');
      setTimeout(function(){
        subMenu.removeClass('hide');
      }, 50);
    }
  };
 
})();


App.init({});
