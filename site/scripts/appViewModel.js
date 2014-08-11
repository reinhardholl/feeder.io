define(["ko", "jquery"], function(ko, $) {
	return function (postbox) {
		var self = this,
			postbox = new ko.subscribable();

		self.activeFeed = ko.observable();
		self.activeTemplate = {
			name: "initializing",
			data: {}
		}

		function setupSubscriptions() {
			postbox.subscribe(onFeedData, null, "feed_newfeeddata");
		}

		function onFeedData(feedData) {
			console.log(feedData);
		}
		setupSubscriptions();
	}
});