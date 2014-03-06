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
	this.id = name + Date.now();	
	this.name = elementData.name;	

	var draw = elementData.draw;	

	var element = this;
		
	
	var eventsToHandle = [];
	var eventListeners = [];

	this.isPointInPath = function(clientXY){
		// weakness: will only work with the last path in 'draw' function
		// and only just after drawing this element.
		var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);	
		return element.controller.context.isPointInPath(
			canvasXY.x, 
			canvasXY.y);
	};
	
	this.addEventListener = function(listenerData)
	{
		eventListeners.push(
				{
					decoratorType:listenerData.decoratorType,
					eventId:listenerData.eventId,
					handle:element.controller.addEventListener(
						listenerData.eventId, 
						listenerData.handler, 
						listenerData.rank)});
	};

	this.controller.addElement(element);
	
	var handleEvents = function()
	{
		// check events just after draw while we know the path
		while(eventsToHandle.length>0)
		{
			eventsToHandle.shift()();
		}
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
	
	this.clone = function()
	{
		return new Creanvas.Element(elementData);
	};

	this.applyDecorator = function(decorator, decoratorData)
	{
		decorator.applyTo(element, eventsToHandle, decoratorData);
	};
	
	this.removeDecorator = function (decoratorType)
	{
		var toCancel = eventListeners.filter(function(listener){ return listener.decoratorType == decoratorType;});
		for (var i=0; i<toCancel.length; i++)
		{
			element.controller.removeEventListener(
				toCancel[i].eventId, 
				toCancel[i].handle);
		};
		eventListeners = eventListeners.filter(function(listener){ return listener.decoratorType != decoratorType;});
	};
	
	this.deactivate = function ()
	{
		for (var i=0; i<eventListeners.length; i++)
		{
			if (eventListeners[i].eventId == 'deactivate')
				continue;
			
			element.controller.removeEventListener(
				eventListeners[i].eventId, 
				eventListeners[i].handle);
		};
		eventListeners = [];
	};
	
	this.drawAndHandleEvents = function()
	{
		element.controller.context.beginPath(); // missing in draw() would mess everything up...
		draw.call(element, element.controller.context);
		handleEvents();
	};
};

Creanvas.Element.prototype.triggerRedraw = function()
{
	this.controller.redraw();
};
