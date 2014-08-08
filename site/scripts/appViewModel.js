define(["application"], function(Application) {
	// function FeedViewModel(data) {
	// 	var self = this;
	// }

	var AppViewModel = function (ko, $) {
		var self = this;
		self.app = new Application(self);
		self.activeFeed = ko.observable();
		self.activeTemplate = {
			name: "feed-overview",
			data: {}
		}		
	}

	AppViewModel.prototype = {
		appInitialized: function() {
			//console.log(self)
		},
		loadInitialFeeds: function () {
			self.app.loadFeeds("http://www.google.com/trends/hottrends/atom/feed?pn=p1", function(feedData) {
				//console.log(feedData)
			});
		}
	}

	return AppViewModel;
});