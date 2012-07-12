/**
 * Inline Confirmation plugin for jQuery
 *
 * One of the less obtrusive ways of implementing a confirmation dialogue. Requires jQuery 1.4.2+.
 *
 * v1.5
 *
 * Copyright (c) 2010 Fred Wu
 *
 * Released under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

/**
 * Usage:
 *
 * // using default options
 * $("a.delete").inlineConfirmation();
 *
 * // using some custom options
 * $("a.delete").inlineConfirmation({
 *   confirm: "<a href='#' class='confirm-yes'>Yes</a>",
 *   cancel: "<a href='#' class='confirm-no'>No</a>",
 *   separator: " | ",
 *   reverse: true,
 *   bindsOnEvent: "hover",
 *   confirmCallback: function(action) {
 *     action.parent().fadeIn();
 *   }
 * });
 *
 * Configuration options:
 *
 * confirm            string    the HTML for the confirm action (default: "<a href='#'>Confirm</a>")
 * cancel             string    the HTML for the cancel action (default: "<a href='#'>Cancel</a>")
 * separator          string    the HTML for the separator between the confirm and the cancel actions (default: " ")
 * reverse            boolean   revert the confirm and the cancel actions (default: false)
 * hideOriginalAction boolean   whether or not to hide the original action, useful for display the dialogue as a modal if set to false (default: true)
 * bindsOnEvent       string    the JavaScript event handler for binding the confirmation action (default: "click")
 * expiresIn          integer   seconds before the confirmation dialogue closes automatically, 0 to disable this feature (default: 0)
 * confirmCallback    function  the callback function to execute after the confirm action, accepts the original action object as an argument
 * cancelCallback     function  the callback function to execute after the cancel action, accepts the original action object as an argument
 */

(function($){

  $.inlineConfirmation = function(selector, options) {
    
    var defaults = {
      confirm: "<a href='#'>Confirm</a>",
      cancel: "<a href='#'>Cancel</a>",
      separator: " ",
      reverse: false,
      hideOriginalAction: true,
      bindsOnEvent: "click",
      expiresIn: 0,
      confirmCallback: function() { return true; },
      cancelCallback: function() { return true; }
    };

    var options         = $.extend(defaults, options);
    var block_class     = "inline-confirmation-block";
    var confirm_class   = "inline-confirmation-confirm";
    var cancel_class    = "inline-confirmation-cancel";
    var action_class    = "inline-confirmation-action";
    
    // listen on `body` instead of `document`, so we can stop propagation to
    // the rails-jquery listener which resides on `document`
    $("body").on(options.bindsOnEvent, selector, function(e) {
      
      var confirmed = !!e.originalEvent.confirmed;
      
      // this is the 'true' event, so allow it
      if (confirmed) {
        return true;
      }
      
      var confirmLabel = $(this).data("confirmLabel");
      var cancelLabel = $(this).data("cancelLabel");
      
      if (confirmLabel) {
        var confirmLink = "<a href='#'>" + confirmLabel + "</a>";
      } else {
         var confirmLink = options.confirm;
      }
      
      if (cancelLabel) {
        var cancelLink = "<a href='#'>" + cancelLabel + "</a>";
      } else {
        var cancelLink = options.cancel;
      }
      
      var confirm_html = "<span class='" + action_class + " " + confirm_class + "'>" + confirmLink + "</span>";
      var cancel_html  = "<span class='" + action_class + " " + cancel_class + "'>" + cancelLink + "</span>";

      var action_set = options.reverse === false
        ? confirm_html + options.separator + cancel_html
        : cancel_html + options.separator + confirm_html;
      
      var timeout_id;
      var original_action = $(this);

      $(selector).show(); // show all
      $("span." + block_class).hide(); // hide all confirmations

      if (options.hideOriginalAction === true) {
        $(this).trigger("update").hide();
      }

      var active_action_set = $("span." + block_class, $(this).parent());

      if (active_action_set.length > 0) {
        active_action_set.show();
      } else {
        $(this).after("<span class='" + block_class + "'>" + action_set + "</span>");
      }

      if (options.expiresIn > 0) {
        timeout_id = setTimeout(function() {
          $("span." + block_class, original_action.parent()).hide();
          original_action.show();
        }, options.expiresIn * 1000);
      }
      
      $(this).parent().delegate("span." + action_class, "click", function(event) {
        clearTimeout(timeout_id);
        $(this).parent().hide();
        original_action.show();

        var args = new Array();
        args[0]  = original_action;

        if ($(this).hasClass(confirm_class)) {
          options.confirmCallback.apply(this, args);
          // old school event needed for link clicks to trigger navigation etc.
          // http://stackoverflow.com/questions/143747
          // don't support old versions of IE, but could easily be extended to do so (see SO question)
          var element = $(original_action).get(0);
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent(options.bindsOnEvent, true, true ); // event type,bubbling,cancelable
          evt.confirmed = true; // used to allow this event (see above)
          element.dispatchEvent(evt);
        } else {
          options.cancelCallback.apply(this, args);
        }
        return false;
      });

      // this event shouldn't go further, since it could trigger backbone, ember or other listeners
      e.preventDefault();
      e.stopImmediatePropagation();
    });

  };

})(jQuery);