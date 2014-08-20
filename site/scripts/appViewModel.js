define(["ko", "jquery"], function(ko, $) {
	function FeedEntry(data, postbox) {
		var self = this;
		self.title = data.title;
		self.content = data.content;
		self.author = data.author;
		self.publishedDate = data.publishedDate;
		self.link = data.link;
		self.isNew = ko.observable(data.isNew); 

		self.thumbSrc = ko.computed(function() {
			var content = self.content;
			// image embedded in html..
			if(content.indexOf("<img") != -1) {
				var imageHtml = content.substring(content.indexOf("<"), content.indexOf(">") + 1);
				self.content = self.content.replace(imageHtml, "");
				self.thumbSrc = $(imageHtml).attr("src");
				if(self.thumbSrc && self.thumbSrc != "" && self.thumbSrc != null)
					return self.thumbSrc;
			}
			return "theme/img/rssplaceholder.png";
		});		

		self.feedReadClicked = function(data) {
			window.open(data.link);
			if(self.isNew()) {
				postbox.notifySubscribers(data, "feed_read");
				self.isNew(false);
			}
		}
	}

	function Feed(data, postbox) {
		self.title = data.feed.title;
		self.link = data.feed.link;
		self.entries = ko.observableArray(data.feed.entries);
		self.entryRows = ko.computed(function() {
			var entries = self.entries();
			var result = [];
			for (var i = 0; i < entries.length; i += 3) {
		        var row = [];
		        for (var j = 0; j < 3; ++j) {
		            if (entries[i + j]) {
		            	var current = entries[i + j];
		                row.push(new FeedEntry({
		                	title: current.title,
		                	content: current.content,
		                	author: self.title,
		                	link: current.link,
		                	publishedDate: current.publishedDate,
		                	isNew: current.isNew
		                }, postbox));
		            }
		        }
		        result.push(row);
		    }
			return result;
		});
	}

	return function (postbox, auth) {
		var self = this,
			initialized = false;
		self.activeFeed = ko.observable();
		self.feedUrl = ko.observable();
		self.activeTemplate = ko.observable({
			name: "initializing",
			data: {}
		});

		self.auth = auth;

		self.loginClick = function() {
			$("#loginModal").modal();
		}

		self.logoutClick = function() {
			postbox.notifySubscribers(null, "logout_click");
		}

		self.loginWithFacebook = function() {
			postbox.notifySubscribers("facebook", "social_login");
		}

		self.starClicked = function(data) {
			console.log(data)
		}		

		function setupSubscriptions() {
			postbox.subscribe(onFeedData, null, "feed_newfeeddata");
			postbox.subscribe(loginStatusChange, null, "user_login");
			postbox.subscribe(markFeedAsRead, null, "feed_read");
			setupSearchChange();
		}

		function setupSearchChange() {
			var timeout = null;
			self.feedUrl.subscribe(function(url) {
				if(!timeout)
				timeout = setTimeout(function() {
					timeout = null;
					postbox.notifySubscribers(self.feedUrl(), "new_feed_url");		
				}, 1000);
			});
		}

		function markFeedAsRead(data) {
			if(auth.isLoggedIn()) {
				postbox.notifySubscribers(data, "mark_feed_as_read")
			}
		}

		function loginStatusChange(user) {
			if(auth.isLoggedIn())
				$("#loginModal").modal("hide");
			if(!initialized)
				postbox.notifySubscribers(null, "application_start");
		}

		function onFeedData(feedData) {
			if(feedData && feedData.feed) {
				self.activeFeed(new Feed(feedData, postbox));
				self.activeTemplate({
					name: "feed-overview",
					data: {}
				});
				$("#overlay").remove();
			}
		}
		setupSubscriptions();
	}
});