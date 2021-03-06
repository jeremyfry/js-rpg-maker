/* Defines the grid items */
function GridSquare(canvasContext, gridSize, col, row){
	this.mouseStatus = "none";
	this.size = gridSize;
	this.active = false;
	// Position holds the pixel coords of the grid
	// and it's row/col position
	this.position = {
		x: row*gridSize,
		y: col*gridSize,
		row: row,
		col: col
	}
	// Reference to our game canvas
	this.ctx = canvasContext;
	this.pathMode = 0;

	/* Sets the visible tile for this
	 *	grid element
	 */
	this.setTile = function(){

	};

	this.draw = function(){
		// Draw out the grid
		// This will change based on the mouse state
		this.ctx.lineWidth = (this.active) ? 1 : 0.3;

    	this.ctx.strokeRect(this.position.x, this.position.y,
    		this.size, this.size);
    	//console.log(this.position.col, this.position.row);
	}


	this.selectByRowCol = function(row, col){
		if(!row || !col){
			return null;
		}
		if(this.position.row === row && this.position.col === col){
			return this;
		}
	}
};function Editor(){
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
			var $ul = $('#tabs ul');
			var $tabLi = $('<li>').appendTo($ul).html('New Level').attr('level-index', $ul.children().length);
			var $levelLi = $('<li>').appendTo('#levels ul').attr('level-index', $ul.children().length);
			var level = new LevelTab($levelLi);
			level.createLevel({
				name: 'Level Name',
				sizeX: 800,
				sizeY: 800,
				gridSize: 32
			});
			this.tabs.forEach(function(tab){
				tab.level.isActiveTab = false;
				tab.elements.level.hide();
			});
			this.tabs.push({
				elements: {
					tab: $tabLi,
					level: $levelLi
				},
				level: level
			});
		}.bind(this));
	};

	// Initialize a basic level
	this.bindEvents();
	
}

var E = new Editor();;/* Defines the a level that is displayed on a tab
 * in the editor
 */
function LevelTab(element){
	var level = this;
	this.isActiveTab = false;
	this.name = "";
	this.gridSize = 0;
	this.activeGridItem = null;
	
	// Used for the drag events
	this.translate = {
		x: 0,
		y: 0
	};
	this.mouseOffset = {
		x: 0,
		y: 0
	};

	this.visibleRange = {
		minX: 0,
		minY: 0,
		maxX: 0,
		maxX: 0
	};


	// Holds the different grid objects
	this.grid = [];

	// Temporary
	this.canvas = document.createElement('canvas');
	this.context = this.canvas.getContext('2d');
	$(element).append(this.canvas);
	// Save context with no modifications
	this.context.save();

	this.createLevel = function (levelParams){
		this.name = levelParams.name;
		this.sizeX = levelParams.sizeX;
		this.sizeY = levelParams.sizeY;
		this.gridSize = levelParams.gridSize;

		// Create grid
		for(var y = 0; y <= this.sizeY; y++){
			for(var x = 0; x <= this.sizeX; x++){
				this.grid.push(new GridSquare(this.context, this.gridSize, y, x));
			}
		}

		this.isActiveTab = true;
		this.bindEvents();
		this.calculateVisibleRange();
		setInterval(function(){ 
			//TODO: Change this to prevent the interval. Setter for isActive would help
			if(this.isActiveTab){
				level.draw(); 	
			}
		}.bind(this), 33);
	};

	this.bindEvents = function(){
		var level = this;
		this.canvas.onselectstart = function(){ return false; }
		$(this.canvas).on('mousedown', function(e){ level.rightClickDown.call(level, e); });
		$(this.canvas).on('mousemove', function(e){ 
			level.drag.call(level, e);
			level.gridHover.call(level, e);
		});
		this.canvas.onmouseup =  function(e){ level.rightClickUp.call(level, e); }
		this.canvas.oncontextmenu = function(){ return false; }
		window.onresize = function(e){ level.resizeCanvas.call(level, e); };
	};

	this.rightClickDown = function(e){
		if(e.button !== 2){ return true; }
		this.dragging = true;
		this.mouseOffset.x = e.pageX;
		this.mouseOffset.y = e.pageY;
		return false;
	}

	this.rightClickUp = function(){
		this.dragging = false;
	}

	/* This function is responsible for dragging the canvas around during
	 * a drag with the right click of the mouse
	 */
	this.drag = function(e){
		if(!this.dragging){ return;	}
		this.translate.x += e.pageX - this.mouseOffset.x;
		this.translate.y += e.pageY - this.mouseOffset.y;
		this.mouseOffset.x = e.pageX;
		this.mouseOffset.y = e.pageY;
		this.calculateVisibleRange();
	};

	this.gridHover = function(e){
		// Calculate the new active grid and unselect the old one
		var col = Math.floor((e.pageX-this.translate.x)/this.gridSize);
		var row = Math.floor((e.pageY-this.translate.y)/this.gridSize);
		var gridItem = this.selectGridByColRow(col,row);
		if(!gridItem || gridItem === this.activeGridItem){ return; }
		if(this.activeGridItem){
			this.activeGridItem.active = false;	
		}
		this.activeGridItem = gridItem;
		this.activeGridItem.active = true;
	};

	this.draw = function(){
		this.clear();
  		this.context.lineWidth = 2;
  		// Determine visible items and only draw those items
		for(var y=this.visibleRange.minY; y <= this.visibleRange.maxY; y++){
			for(var x=this.visibleRange.minX; x <= this.visibleRange.maxX; x++){
				this.selectGridByColRow(x,y).draw();
			}
		}
	};

	// Sets the visible range of grids to speed up 
	this.calculateVisibleRange = function(){
		this.visibleRange.maxX = Math.ceil((this.canvas.width - this.translate.x) / this.gridSize);
  		this.visibleRange.maxY = Math.ceil((this.canvas.height - this.translate.y) / this.gridSize);
  		this.visibleRange.minX = Math.max(Math.floor(this.translate.x *-1/ this.gridSize),0);
  		this.visibleRange.minY = Math.max(Math.floor(this.translate.y *-1/ this.gridSize),0);
	};

	this.resizeCanvas = function(){
		this.context.canvas.width  = window.innerWidth;
		this.context.canvas.height = window.innerHeight;
		this.context.save();
		this.context.translate(this.translate.x, this.translate.y);
		this.calculateVisibleRange();
	};

	this.clear = function(){
		this.context.restore();
		this.context.save();
		this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
		this.context.translate(this.translate.x, this.translate.y);
	};

	this.selectGridByColRow = function(col, row){
		var index = row*this.sizeX+col+row;
		return this.grid[index];
	};
}