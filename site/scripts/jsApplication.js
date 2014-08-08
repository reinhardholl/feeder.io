define(["jquery"], function($) {
	return function(mainViewModel) {
		var self = this;

		function init() {
			setupGoogleFeeds();
			if(mainViewModel.appInitialized)
				mainViewModel.appInitialized();
		}

		function setupGoogleFeeds() {
			google.load("feeds", "1");
		}

		self.loadFeeds = function(feedPath, done) {
			var feed = new google.feeds.Feed(feedPath);
			feed.load(done);
		}
		init();
	}
});