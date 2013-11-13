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
}