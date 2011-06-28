# Inline Confirmation plugin for jQuery

In a web app, it is very common to have actions that destroy (delete/remove) data. These actions, if you don’t already know, should always map to POST methods. On top of that, because these actions are destructive, the UI should always ask the user for confirmation.

But how do we actually implement the confirmation dialogue though? The vanilla JavaScript confirm box would be the easiest but at the same time the ugliest - this thing stalls most web browsers until the user acts on it.

An inline popup/modal box? Perhaps, but it is still obtrusive, in the sense that the popup/model boxes are usually in the way of other tasks.

Meet __Inline Confirmation__ - a jQuery plugin for creating easy, less obtrusive confirmation dialogues!

## Configuration

There are a few options to customise the behaviour of this plugin:

- _confirm_            (string)    the HTML for the confirm action (default: "<a href='#'>Confirm</a>")
- _cancel_             (string)    the HTML for the cancel action (default: "<a href='#'>Cancel</a>")
- _separator_          (string)    the HTML for the separator between the confirm and the cancel actions (default: " ")
- _reverse_            (boolean)   revert the confirm and the cancel actions (default: false)
- _hideOriginalAction_ (boolean)   whether or not to hide the original action, useful for display the dialogue as a modal if set to false (default: true)
- _bindsOnEvent_       (string)    the JavaScript event handler for binding the confirmation action (default: "click")
- _expiresIn_          (integer)   seconds before the confirmation dialogue closes automatically, 0 to disable this feature (default: 0)
- _confirmCallback_    (function)  the callback function to execute after the confirm action, accepts the original action object as an argument
- _cancelCallback_     (function)  the callback function to execute after the cancel action, accepts the original action object as an argument


## Usage

``` js
// using default options
$("a.delete").inlineConfirmation();

// using some custom options
$("a.delete").inlineConfirmation({
  confirm: "<a href='#' class='confirm-yes'>Yes</a>",
  cancel: "<a href='#' class='confirm-no'>No</a>",
  separator: " | ",
  reverse: true,
  bindsOnEvent: "hover",
  confirmCallback: function(action) {
    action.parent().fadeIn();
  }
});
```

## Changelog

v1.4.0 [2011-06-28]

- Added a demo and readme to the repository.

v1.3.1 [2010-08-04]

- Fixed a regression bug that causes `expiresIn` to stop working.

v1.3.0 [2010-08-04]

- Removed `allowMultiple` option as tracking multiple instances of the dialogues is not a good idea (the code was broken anyway).
- Added the original action object as an argument to the callback functions.
- Fixed a bug where original actions would disappear.

v1.2.0 [2010-08-04]

- Added `hideOriginalAction` option.

v1.1.0 [2010-08-04]

- Added `allowMultiple` option.

v1.0.0 [2010-08-03]

- Initial release.

## License

Copyright (c) 2010 Fred Wu

Released under the [MIT](http://www.opensource.org/licenses/mit-license.php) license.
