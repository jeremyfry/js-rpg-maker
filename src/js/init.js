function Editor(){
	'use strict';
	var self = this;

	// Object properties
	this.tabs = [];
	this.view = document.getElementById('view');

	// Object methods
	this.adjustCanvasHeight = function(){
		$(self.view).attr('width', $(window).width())
			.attr('hieght', $(window).height());
	};

	this.bindEvents = function(){
		$('#add-tab').on('click', function(){
			// Add a tab and a level.
			var $ul = $(this).parent();
			var $tabLi = $('<li>').appendTo($ul).html('New Level').attr('level-index', $ul.children().length);
			var $levelLi = $('<li>').appendTo('#levels ul').attr('level-index', $ul.children().length);
			var level = new LevelTab($levelLi);
			level.createLevel({
				name: 'Level Name',
				sizeX: 800,
				sizeY: 800,
				gridSize: 32
			});
			this.tabs.push({
				elements: {
					tab: $tabLi,
					level: $levelLi
				},
				level: level
			});
		});
	};

	// Initialize a basic level
	this.bindEvents();
	
}

var E = new Editor();