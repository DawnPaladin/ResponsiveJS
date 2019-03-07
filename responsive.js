/** Activate/deactivate various scripts depending on the width of the window. */
var responsiveJS = (function() {
	var registry = [];

	if (!jQuery) console.warn("jQuery not present. Responsively loading scripts from URLs will be unavailable.");

	/**
	 * Add an entry to the list of scripts which will run if the window is the right width.
	 * @param {Object} entry
	 * @param {string} [entry.name] - Name of the entry
	 * @param {string} [entry.url] - Path to a script that needs to be loaded before the entry's main function can be run
	 * @param {function} [entry.activationFunction] - Function to be run to activate the entry
	 * @param {function} [entry.deactivationFunction] - Function to be run to deactivate the entry
	 * @param {number} [entry.minWidth] - Entry should be active when screen is at least this wide
	 * @param {number} [entry.maxWidth] - Entry should be active when screen is less wide than this
	 */
	var register = function(entry) {
		entry.loadingStarted = false;
		entry.loaded = entry.url ? false : true; // if entry has a URL, mark that there is a file yet to be loaded
		entry.active = false;
		if (!entry.name) entry.name = "Entry " + (registry.length + 1);
		if (entry.url && !jQuery) throw "jQuery not present. Unable to load " + entry.name + " from " + entry.url;
		entry.activate = function() {
			if (entry.loaded && !entry.active && entry.activationFunction) {
				console.log("Activating", entry.name);
				entry.active = true;
				entry.activationFunction();
			}
		}
		entry.deactivate = function() {
			if (entry.loaded && entry.active && entry.deactivationFunction) {
				console.log("Deactivating", entry.name);
				entry.active = false;
				entry.deactivationFunction();
			}
		}
		registry.push(entry);
		console.log(entry.name, "registered with ResponsiveJS");
		evaluateRegistry();
	}

	function evaluateRegistry() {
		registry.forEach(function(entry) {
			if ((entry.minWidth == undefined || window.innerWidth >= entry.minWidth) && (entry.maxwidth == undefined || window.innerWidth < entry.maxWidth)) {
				if (!entry.loadingStarted && entry.url) {
					console.log("Loading", entry.name, "from", entry.url);
					entry.loadingStarted = true;
					jQuery.ajax({
						url: entry.url,
						dataType: "script",
						cache: true,
						success: function() {
							console.log("Loaded", entry.name);
							entry.loaded = true;
							entry.activate();
						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.error("Failed to load", entry.name, ":", textStatus, errorThrown);
						}
					});
				}
				entry.activate();
			} else {
				entry.deactivate();
			}
		});
	}

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	// Thanks to https://davidwalsh.name/function-debounce
	//
	// This is here because resizing the document window fires many resize events
	// very quickly. Binding expensive functions directly to the resize event
	// causes poor performance. Instead, we wait for resize events to stop coming
	// in before we start all the registered functions.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	// Run all appropriate functions 250ms after we stop receiving resize events.
	window.onresize = debounce(evaluateRegistry, 250);

	return {
		register: register,
		registry: registry,
	};
})();
