define(["ko", "firebase", "fbase-simpleloging"], function(ko) {
	return function(postbox) {
		var self = this,
			baseRef = new Firebase("https://feederapp.firebaseio.com"),
			authClient = {};

		self.currentUser = ko.observable(null);
		self.isLoggedIn = ko.computed(function() {
			return self.currentUser() != null;
		});

		function init() {
			setupAuthClient();
			setupSubscriptions();
		}

		function setupAuthClient() {
			authClient = new FirebaseSimpleLogin(baseRef, function(error, user) {
			  if (error) {
			    alert(error);
			  } else if (user) {
			  	registerUserIfNew(user, function() {
			  		self.currentUser(user);
			  		postbox.notifySubscribers(user, "user_login");	
			  	});			    
			  } else {
			  	self.currentUser(null);
			    postbox.notifySubscribers(null, "user_login");
			  }
			});
		}

		function setupSubscriptions() {
			postbox.subscribe(login, null, "social_login");
			postbox.subscribe(logout, null, "logout_click");
		}

		function registerUserIfNew(user, done) {
			baseRef.child("users").child(user.uid).once("value", function(data) {
				if(data.val()) return done(); // not a new user

				baseRef.child('users').child(user.uid).set({
			        displayName: user.displayName,
			        provider: user.provider,
			        provider_id: user.id
		      	});
		      	done();
			});
		}

		function logout() {
			authClient.logout();
		}

		function login(provider) {
			authClient.login(provider);
		}
		init();
	}
});