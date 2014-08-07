define(["application"], function(Application) {
	function FeedViewModel(data) {
		var self = this;
	}

	var AppViewModel = function(ko, $) {
		var self = this;
		var app = new Application(self);		

		self.activeFeed = ko.observable();
		self.activeTemplate = {
			name: "feed-overview",
			data: {}
		}

		self.appInitialized = function() {
			loadInitialFeeds();
		}		

		function loadInitialFeeds() {
			app.loadFeeds("http://www.google.com/trends/hottrends/atom/feed?pn=p1", function(feedData) {
				console.log(feedData)
			});
		}
	}
	return AppViewModel;
});