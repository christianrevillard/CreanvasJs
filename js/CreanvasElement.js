var CreanvasJs 	= CreanvasJs || {};		

CreanvasJs.CreanvasElement = function(context, x, y, draw){
	// basic element
	// needs 
		// -position
		// draw function
		// event handling
		// ..to design: how affected by other stuff? when to redraw?

	this.context = context;
	this.x = x;
	this.y = y;
	this.draw = draw;	// should be private
};
