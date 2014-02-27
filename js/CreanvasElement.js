var CreanvasJs 	= CreanvasJs || {};		

CreanvasJs.CreanvasElement = function(name, controller, x, y, draw){
	// basic element
	// needs 
		// -position
		// draw function
		// event handling
		// ..to design: how affected by other stuff? when to redraw?

	this.name = name;
	this.controller = controller;
	this.x = x;
	this.y = y;
	this.draw = draw;	// should be private
	
	var element = this;
		
	var getCanvasFromMouse  = function(mouseX, mouseY)
	{
		var bb = controller.canvas.getBoundingClientRect();
		return { 
			canvasX:(mouseX-bb.left)*controller.canvas.width/bb.width,
			canvasY: (mouseY-bb.top)*controller.canvas.height/bb.height};
		
	};
	
	var isClicked = function(e){
		var canvasXY = getCanvasFromMouse(e.clientX, e.clientY);	
		element.draw(); // to recreate the path.
		return controller.context.isPointInPath(
				canvasXY.canvasX, 
				canvasXY.canvasY);
	};

	controller.clickEvent.register(function(e) {
		if (isClicked(e))			
		{	
			//alert(name);		
		}
	});

	var isMoved = false;
	var movingFrom;
	
	controller.mouseDownEvent.register(function(e) {
		if (isClicked(e))
		{
			isMoved = true;
			movingFrom = getCanvasFromMouse(e.clientX, e.clientY);	
		}
	});

	controller.mouseMoveEvent.register(function(e) {
		if (isMoved)
		{
			var canvasXY = getCanvasFromMouse(e.clientX, e.clientY);	
			element.x += canvasXY.canvasX-movingFrom.canvasX;
			element.y += canvasXY.canvasY-movingFrom.canvasY;
			movingFrom = canvasXY;	
		}
	});

	controller.mouseUpEvent.register(function(e) {
		if (isMoved)
		{
			var canvasXY = getCanvasFromMouse(e.clientX, e.clientY);	
			element.x += canvasXY.canvasX-movingFrom.canvasX;
			element.y += canvasXY.canvasY-movingFrom.canvasY;
			isMoved = false;
		}
	});

	controller.reDraw.register(function(e) {
		element.draw();
	});
	
	
};

// specific elements, circles and stuff
 
// more advanced elements

// But first : drag and drop ! and think redraw
