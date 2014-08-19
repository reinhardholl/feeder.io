define(["ko", "firebase", "fbase-simpleloging"], function(ko) {
	return function(postbox) {
		var self = this,
			ref = new Firebase("https://feederapp.firebaseio.com"),
			authClient = {};

		function init() {
			setupAuthClient();
			setupSubscriptions();
		}

		function setupAuthClient() {
			authClient = new FirebaseSimpleLogin(ref, function(error, user) {
			  if (error) {
			    alert(error);
			  } else if (user) {
			  	registerUserIfNew(user);
			    postbox.notifySubscribers(user, "user_login");
			    console.log("User ID: " + user.uid + ", Provider: " + user.provider);
			  } else {
			    postbox.notifySubscribers(null, "user_login");
			    console.log("user is logged out");
			  }
			});
		}

		function registerUserIfNew(user) {
			ref.child('users').child(user.uid).set({
		        displayName: user.displayName,
		        provider: user.provider,
		        provider_id: user.id
		      });
		}

		function setupSubscriptions() {
			postbox.subscribe(login, null, "social_login");
		}

		function login(provider) {
			authClient.login(provider);
		}
		init();
	}
});