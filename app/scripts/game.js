var Game = (function(){

	'use strict';

	var CARD_COUNT = 6,
		last_card_index,
		last_card,
		gameStats,
		colors = [
			[ 'rgb(155,202,215)', 'rgb(83,176,191)', 'rgb(155,202,215)', 'rgb(83,176,191)', '#3498db', '#2980b9'],
			['#e74c3c','rgb(249,99,99)', '#c0392b', 'rgb(167,58,84)'],
			['#f1c40f','#f39c12', '#F79B57']
		], 
		cards = [], 
		mode = 0;

	// initalize a game and animate entry of cards
	function init( c, m ){
		
		// initalize all variables
		cards = c;
		mode = m;
		last_card_index  = -1,
		last_card = {},
		gameStats = {
			'completed':0,
			'errors':0
		},

		//fade out and clear previous content
		$('#game-container').addClass('init')
		$('#game-intro').fadeOut();
		$('#game-container').fadeOut(300);
		$('footer').fadeIn();
		$('body').css({'background-color':'white'});
		setTimeout(function(){
			$('#container').html('');
			$('#completed').html('0');
			$('#errors').html('0');
			$('#stats').css({'width':'0px'});
			$('#stats').css({'opacity':'0'});
		},300);

		// render and fade in new content
		setTimeout(function(){
			$('#game-container').fadeIn();
			addCards();
		}, 1000);
	}


	function addCards(){

		var name_card_template = _.template($('#name-card').html()),
			picture_card_template = _.template($('#picture-card').html()),
			card_el = [];

		function fadeInCards(){
			card_el.shuffle();
			var indices = [];
			for (var i=0;i<CARD_COUNT;i+=1){
				indices.push(i);
				indices.push(i+CARD_COUNT);
			}
			indices.shuffle();
			card_el.forEach(function(el, index){
				el.appendTo('#container'); 
				setTimeout(function(){ el.css({'opacity':1}); },indices[index]*50+250);
			});
			setTimeout(function(){ $('#stats').css({'width':'250px'}); }, 500+CARD_COUNT*2*50);
			setTimeout(function(){ $('#stats').css({'opacity':'1'}); }, 750+CARD_COUNT*2*50);
		}

		function renderCard(type, index, card, url){
			var c = Math.floor(Math.random()*colors.length),
				k;
				console.log(colors);
			if (type===0){
				k = $( name_card_template({'name':card.name, 'color':colors[mode][c]}) );
			} else {
				k = $( picture_card_template({'name':card.name,'color':colors[mode][c], 'url':url}) );
			}
			$(k).on('click', function(){
				nextMove(index, this);
			});
			$(k).data('flipped', false);
			card_el.push(k);
			if (card_el.length===CARD_COUNT*2)
				fadeInCards();
		}

		cards.forEach(function(card, index){
			renderCard( 0, index, card);
			IN.API.Raw("/people/"+card.id+"/picture-urls::(original)")
			.result(function(profile){
				renderCard( 1, index, card, profile.values[0]);
			});
		});
	}

	// game logic, checks if consecutive card flips match
	// sets game stats accordingly
	function nextMove(index, card){
		
		// waiting for cards to flip back, do nothing
		if (last_card_index===-2)
			return;
		
		// first card, flip it
		if (last_card_index == -1 ){
			last_card = card;
			last_card_index = index;
			$(card).addClass('uncover');
		
		// second card
		} else {

			// invalid
			if (last_card===card)
				return;

			// flip it
			$(card).addClass('uncover');

			// cards match, increment points
			if (last_card_index === index){
				$(card).toggleClass('isactive').off('click');
				$(last_card).toggleClass('isactive').off('click');
				gameStats.completed+=1;
				$('#completed').html(gameStats.completed);
				$('#star').attr({'class':'yellow'}); 
				setTimeout(function(){ $('#star').attr({'class':''}); }, 400);
				if (gameStats.completed===CARD_COUNT)
					app.endGame();
				last_card_index=-1;

			// cards don't match :(
			} else {

				// increment error only if one of cards has been flipped before
				if ( ($(card).data('flipped')||$(last_card)) === true ){
					gameStats.errors += 1;
					$('#error').attr({'class':'red'});
					setTimeout(function(){ $('#error').attr({'class':''}); }, 400);
					$('#errors').html(gameStats.errors);
				}
				last_card_index=-2;
				setTimeout(function(){
					$(last_card).removeClass('uncover');
					$(card).removeClass('uncover');
					last_card_index = -1;

				},750);
			}

			$(card).data('flipped',true);
			$(last_card).data('flipped',true);
		}
	}

	return {
		'init':init,
	};
})();