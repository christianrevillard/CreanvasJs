var CreanvasJs 	= CreanvasJs || {};		

CreanvasJs.CreanvasElement = function(elementData){

	if (!elementData.hasOwnProperty('controller'))
	{
		return; // should throw error
	};

	if (!elementData.hasOwnProperty('draw'))
	{
		return; // should throw error
	};

	this.controller = elementData.controller;
	this.x = elementData.x || 0;
	this.y = elementData.y || 0;
	this.z = elementData.z || 0;
	this.draw = elementData.draw;	
	
	var element = this;
		
	this.controller.addEventListener('draw', function(e) {
		element.controller.context.beginPath();
		element.draw(element.controller.context);
	}, 
	element.z);

	
	// not need if not event, but still very generic... 
	
	var isClicked = function(e){
		var canvasXY = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
		element.controller.context.beginPath();
		element.draw(element.controller.context); // to recreate the path. - avoid redrawing all??
		// weakness: will only work with the last path in 'draw' function
		return element.controller.context.isPointInPath(
				canvasXY.x, 
				canvasXY.y);
	};

	

	
	// mouse events, not basic, should not be in basic element definition	
	
	this.controller.addEventListener('click', function(e) {
		if (isClicked(e))			
		{	
			//alert(name);		
		}
	}, 
	element.z);

	var isMoved = false;
	var movingFrom = null;
	
	this.controller.addEventListener('mousedown', function(e) {
		if (isClicked(e))
		{
			if (e.shiftKey)
			{ 				
				// copy before moving - must no handle the current event!		
				// is there a better way?
				setTimeout (
						function(){
				new CreanvasJs.CreanvasElement(
						{ 
							controller: element.controller,
							x: element.x,
							y: element.y,
							draw: element.draw});},10);
			}
			
			isMoved = true;
			movingFrom = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
		}
	}, 
	element.z);

	this.controller.addEventListener('mousemove', function(e) {
		if (isMoved)
		{
			var canvasXY = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
			element.x += canvasXY.x-movingFrom.x;
			element.y += canvasXY.y-movingFrom.y;
			movingFrom = canvasXY;	
			element.triggerRedraw();
		}
	}, 
	element.z);

	this.controller.addEventListener('mouseup', function(e) {
		if (isMoved)
		{
			var canvasXY = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
			element.x += canvasXY.x-movingFrom.x;
			element.y += canvasXY.y-movingFrom.y;
			isMoved = false;
			element.triggerRedraw();
		}
	}, 
	element.z);
};

CreanvasJs.CreanvasElement.prototype.triggerRedraw = function()
{
	this.controller.needRedraw =  true;
};

// specific elements, circles and stuff
 
// more advanced elements
