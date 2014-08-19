define(["jquery", "firebase"], function($) {
	return function(postbox, auth) {
		var self = this,
			baseRef = new Firebase("https://feederapp.firebaseio.com/users");
		
		function setupSubscriptions() {
			postbox.subscribe(loadInitialFeeds, null, "application_start");
			postbox.subscribe(loadFeed, null, "new_feed_url");
			postbox.subscribe(markFeedAsRead, null, "mark_feed_as_read");			
		}

		function loadInitialFeeds(done) {
			setTimeout(function() {
				loadFeed("http://www.engadget.com/rss.xml");
			}, 400);
			
		}

		function loadFeed(feedPath) {
			var feed = new google.feeds.Feed(feedPath);
			console.log(feed)
			feed.setNumEntries(50);
			feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
			feed.load(function(feedData) {
				setIsNewFlagOnFeedFromDatabase(feedData, function(finalData) {
					postbox.notifySubscribers(finalData, "feed_newfeeddata");
				});
			});

			google.feeds.findFeeds("cars", function(feds) {
				console.log(feds)
			})
		}

		function setIsNewFlagOnFeedFromDatabase(feedData, done) {
			if(!auth.isLoggedIn()) {
				for(z=0; feedData.feed.entries.length; z++) {
					feedData.feed.entries[z].isNew = true;
					return done(feedData);
				}
			}				

			var query = baseRef.child(auth.currentUser().uid).child("feeds").child(feedData.feed.title).limit(60);
			query.on('value', function (snapshot) {
			  var feeds = snapshot.val();
			  // clean this up
			  var feedDataEntries = feedData.feed.entries;
			  for(z=0; z<feedDataEntries.length; z++) {
			  	for(var key in feeds) {
			  		if(feeds[key] == feedDataEntries[z].link) {
			  			feedDataEntries[z].isNew = false;
			  			break;
			  		}
			  	}
			  	if(feedDataEntries[z].isNew != false)
			  		feedDataEntries[z].isNew = true;
			  }
			  feedData.feed.entries = feedDataEntries;
			  console.log("actually loaded")
			  query.off();
			  done(feedData);			  
			});			
		}

		function markFeedAsRead(feed) {
			baseRef.child(auth.currentUser().uid).child("feeds").child(feed.author).push(feed.link);
		}

		setupSubscriptions();
	}
});