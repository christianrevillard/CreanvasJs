var Creanvas = Creanvas || {};		

Creanvas.Element = function(elementData){

	if (!elementData.hasOwnProperty('controller'))
	{
		return; // TODO error throw / handling
	};

	if (!elementData.hasOwnProperty('draw'))
	{
		return; // TODO error throw / handling
	};

	this.controller = elementData.controller;
	this.x = elementData.x || 0;
	this.y = elementData.y || 0;
	this.z = elementData.z || 0;
	this.draw = elementData.draw;	
	
	var element = this;
		
	this.controller.addEventListener('draw', function(e) {
		element.controller.context.beginPath(); // missing in draw() would mess everything up...
		element.draw(element.controller.context);
		// check events just after draw while we know the path
		while(eventsToHandle.length>0)
		{
			eventsToHandle.shift()();
		}
		
	}, 
	element.z);
	
	var eventsToHandle = [];
			
	this.isPointInPath = function(clientXY){
		// weakness: will only work with the last path in 'draw' function
		// and only just after drawing this element.
		var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);	
		return element.controller.context.isPointInPath(
			canvasXY.x, 
			canvasXY.y);
	};
		
	if (Creanvas.elementDecorators)
	{
		for(var decoratorId=0; decoratorId<Creanvas.elementDecorators.length; decoratorId++)
		{
			var decorator = Creanvas.elementDecorators[decoratorId];
			if (elementData.hasOwnProperty(decorator.type) && elementData[decorator.type])
			{
				decorator.applyTo(element, eventsToHandle, elementData[decorator.type]);
			}
		}
	}	
};

Creanvas.Element.prototype.triggerRedraw = function()
{
	this.controller.redraw();
};
