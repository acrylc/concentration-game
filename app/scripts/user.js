var User = (function(){

	'use strict';

	var _this = {
		profile:{},
		contacts:{},
		init:init, 
		appCallback: function(){}
	};

	// inits user profile and connections
	function init (callback) {
		_this.appCallback = callback || _this.appCallback;
		IN.Event.on(IN, "auth", authCallback);
	}

	// on authentication, gets user profile info
	function authCallback(callback) {
		IN.API.Profile("me")
			.fields("firstName", "lastName", "id", "industry", "educations", "positions" , "connections")
			.result(profileCallback, callback);	
	}

	// saves user profile info and gets connections
	function profileCallback(profiles) {
		var member = profiles.values[0];
		_this.profile = {
			'id':member.id,
			'education' : member.educations.values,
			'name' : member.firstName+' '+member.lastName,
			'industry' : member.industry,
			'work' : member.positions.values,
			'contacts' : member.connections
		};
		IN.API.Connections("me")
			.fields("firstName", "lastName", "id", "pictureUrl")
			.result(connectionsCallback);
	}

	// saves connections and calls app's callback
	function connectionsCallback(profiles){

		var profileIsValid = function(profile){
			return (profile.name !== 'private private' && profile.pictureUrl!==undefined);
		};

		_this.contacts = {};
		var ids = [];
		profiles.values.forEach(function(profile){
			if (profileIsValid(profile)){
				_this.contacts[profile.id]={
					'name' : profile.firstName+' '+profile.lastName,
					'pictureUrl' : profile.pictureUrl
				};
			}
		});
		_this.appCallback();
	}

	return _this;

})();
