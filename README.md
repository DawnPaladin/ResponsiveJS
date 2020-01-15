# ResponsiveJS

Like @media breakpoints from CSS, but for JavaScript.

Do you have a responsively designed web page with lots of JavaScript that you want to load on the desktop, but not on mobile? This will handle that for you. Designate a `minWidth` and/or a `maxWidth` in pixels; your script will only load and execute when the screen is the right width.

To use, call `responsiveJS.register()` with an object bearing these properties (all of which are optional):

- `name`: Name of your script. Used in various `console.log`s to let you know what's going on.
- `url`: You can designate a .js file to be loaded and run when the screen is the right size. Requires jQuery.
- `activationFunction`: A function to be run when the screen is the right size.
- `deactivationFunction`: A function to be run when the screen is no longer the right size. You can combine this with the above to have JavaScript features that turn on and off as the window gets resized.
- `minWidth`: Run `activationFunction` and the script downloaded from `url` when the screen is at least this size. Run `deactivationFunction` if the screen gets smaller than that.
- `maxWidth`: Run `activationFunction` and the script downloaded from `url` when the screen is smaller than this. Run `deactivationFunction` if the screen gets too big.

You can call `responsiveJS.register()` multiple times with different combinations of settings, like so:

```js
responsiveJS.register({
  name: "Desktop script",
  minWidth: 1200,
  url: "bigFile.js",
  activationScript: function() {
    console.log("Desktop mode");
    // do desktop things
  },
  deactivationScript: function() {
    // stop doing desktop things
  }
});
responsiveJS.register({
  name: "Mobile script",
  maxWidth: 1200,
  activationScript: function() {
    console.log("Mobile mode");
    // do mobile things
  },
  deactivationScript: function() {
    // stop doing mobile things
  }
});
```
