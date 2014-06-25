var app = app || {};

(function(){

	'use strict';

	// initializes the user's profile and connection information
	// creates a new game, level 1
	app.init = function (){

		User.init(function(){
			app.createGameSession(User.profile, User.contacts, 0);
			app.bindListeners();
		});
	};

	// inits and renders the intro animation of me and bob
	app.initIntro = function(){

		setTimeout(function(){
			$('#game-intro').fadeIn();
		},1000)
		// animate me and bob moving
		setTimeout(function(){
			$('#bob').addClass('move');
		$	('#me').addClass('move');
		},2000);

		// animate conversation
		var delays = [0,2000,5000,7500,11500,15000];
		setTimeout(function(){
			for (var i=1;i<7;i++) { 
				(function(){ 
					var k = i; 
					setTimeout(function(){ $('#s'+k).addClass('in'); },delays[k-1]); 
					setTimeout(function(){ $('#s'+k).addClass('out'); }, delays[k-1]+1500);
				})();
			}
		},3500);
	};

	// bind listeners to level buttons
	app.bindListeners = function(){
		$('.game-mode').on('click', function(){
			var i = $(this).data("mode");
			app.newGame(i);
		});
	};

	// create new game instance
	app.newGame = function(mode){
		app.createGameSession(User.profile, User.contacts, mode);
	};


	app.createGameSession = function(profile, contacts, mode){	
		var random_numbers = [],
		i = 0,
		count = 0,
		cards = [],
		potentialContacts = [],
		temp_ids = [];

		// get 20 random contacts to not overwhelm linkedin
		for ( var key in User.contacts)
			temp_ids.push(key);
		temp_ids.shuffle();
		var temp_contacts = temp_ids.slice(0,Math.min(20,temp_ids.length));
		
		// get num of related connections with each contact
		IN.API.Raw('/people::(' + temp_contacts.join(',') + '):(relation-to-viewer:(related-connections))')
		.result(function(relation){

			relation.values.forEach(function(value){
				potentialContacts.push({
					'id': value._key,
					'name': contacts[value._key].name,
					'pictureUrl': contacts[value._key].pictureUrl,
					'relationCount': value.relationToViewer.relatedConnections._total
				});
			});

			// sort contacts by relation count
			potentialContacts.sort(function(a,b){
				return a.relationCount-b.relationCount;
			});

			// easy, level 1, most connections in common
			if (mode === 0){
				Game.init(potentialContacts.slice(potentialContacts.length-6,potentialContacts.length), mode);
			
			// level 2
			} else if (mode === 1){
				Game.init(potentialContacts.slice(Math.floor(potentialContacts.length/2)-3, Math.floor(potentialContacts.length/2)+3),mode);
			
			// hard, level 3, least connections in common
			} else {
				Game.init(potentialContacts.slice(0,6), mode);

			}
		});
	};

})();

