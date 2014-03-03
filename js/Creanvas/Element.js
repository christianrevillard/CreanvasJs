var Creanvas = Creanvas || {};		

Creanvas.Element = function(elementData){

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
		// check events just after draw to avoid redraw and still know the path...
		while(eventsToHandle.length>0)
		{
			eventsToHandle.shift()();
		}
		
	}, 
	element.z);

	
	var eventsToHandle = [];
		
	// not need if not event, but still very generic... 
	
	this.isPointInPath = function(clientX, clientY){
		var canvasXY = element.controller.getCanvasXYFromClientXY(clientX, clientY);	
		// weakness: will only work with the last path in 'draw' function
		return element.controller.context.isPointInPath(
				canvasXY.x, 
				canvasXY.y);
	};

	if (elementData.hasOwnProperty('movable') && elementData.movable)
	{
		Creanvas.makeElementMovable(this, eventsToHandle);
	}
	
	if (elementData.hasOwnProperty('onclick') )
	{
		Creanvas.makeElementClickable(this, elementData.onclick);
	}

};

Creanvas.makeElementClickable =  function(element, onclick)
{
	element.controller.addEventListener('click', function(e) {
		if (element.isPointInPath(e.clientX, e.clientY))			
		{	
			onclick.call(element);
		}
	});
};

Creanvas.makeElementMovable  = function(element, eventsToHandle)
{
	var isMoved = false;
	var touchIdentifier = null;	
	var movingFrom = null;
	
	var beginMove = function(e) {
		eventsToHandle.push(function()
				{		
			if (element.isPointInPath(e.clientX, e.clientY))			
					{
						if (e.shiftKey)
						{ 				
							// copy before moving - must no handle the current event!		
							// is there a better way?
							setTimeout (
									function(){
							new Creanvas.Element(
									{ 
										controller: element.controller,
										x: element.x,
										y: element.y,
										draw: element.draw});},10);
						}
						
						isMoved = true;
						movingFrom = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
					}
		});
	};

	var beginMovepad = function(e) {
		eventsToHandle.push(function()
				{		
				for (var touch = 0; touch<e.targetTouches.length; touch++)				
					{
					if (isClicked(e.targetTouches[touch]))
					{						
						isMoved = true;
						touchIdentifier = e.targetTouches[touch].identifier;
						movingFrom = element.controller.getCanvasXYFromClientXY(e.targetTouches[touch].clientX, e.targetTouches[touch].clientY);
						touch = e.targetTouches.length;
					}
				}
		});
	};

	element.controller.addEventListener('mousedown', beginMove);
	element.controller.addEventListener('touchstart', beginMovepad);


			
	var move = function(e) {
		eventsToHandle.push(function()
				{		
					if (isMoved)
					{
						var canvasXY = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
						element.x += canvasXY.x-movingFrom.x;
						element.y += canvasXY.y-movingFrom.y;
						movingFrom = canvasXY;	
						element.triggerRedraw();
					}
				});
		element.triggerRedraw();
	};	

	var movepad = function(e) {
		eventsToHandle.push(function()
				{		
					if (isMoved)
					{
						for (var touch=0; touch<e.targetTouches.length; touch++)
						{
							if (e.targetTouches[touch].identifier === touchIdentifier)
								{

						var canvasXY = element.controller.getCanvasXYFromClientXY(e.targetTouches[touch].clientX, e.targetTouches[touch].clientY);	
						element.x += canvasXY.x-movingFrom.x;
						element.y += canvasXY.y-movingFrom.y;
						movingFrom = canvasXY;	
						element.triggerRedraw();
						touch = e.targetTouches.length;
								}
						}
					}
				});
		element.triggerRedraw();
	};	

	element.controller.addEventListener('mousemove', move);
	element.controller.addEventListener('touchmove', movepad);

	var moveend = function(e) {
		eventsToHandle.push(function()
				{
		if (isMoved)
		{
			var canvasXY = element.controller.getCanvasXYFromClientXY(e.clientX, e.clientY);	
			element.x += canvasXY.x-movingFrom.x;
			element.y += canvasXY.y-movingFrom.y;
			isMoved = false;
			element.triggerRedraw();
		}});
		element.triggerRedraw();
	};

	var moveendpad = function(e) {
		e.preventDefault();
		
		eventsToHandle.push(function()
				{
		if (isMoved)
		{
			for (var touch=0; touch<e.changedTouches.length; touch++)
{
				if (e.changedTouches[touch].identifier === touchIdentifier)
				{

			var canvasXY = element.controller.getCanvasXYFromClientXY(e.changedTouches[touch].clientX, e.changedTouches[touch].clientY);	
			element.x += canvasXY.x-movingFrom.x;
			element.y += canvasXY.y-movingFrom.y;
			isMoved = false;
			touchIdentifier = null;
			element.triggerRedraw();
			touch = e.changedTouches.length;
				}
}
		}});
		element.triggerRedraw();
	};

	element.controller.addEventListener('mouseup', moveend);
	element.controller.addEventListener('touchend', moveendpad);
};

Creanvas.Element.prototype.triggerRedraw = function()
{
	this.controller.redraw();
};

// specific elements, circles and stuff
 
// more advanced elements
