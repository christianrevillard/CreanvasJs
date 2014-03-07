var CreJs = CreJs || {};

(function(){
	var creanvas = CreJs.Creanvas = CreJs.Creanvas || {};		
	
	creanvas.Element = function(elementData){
	
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
						handlerGuid:element.controller.addEventListener(
							listenerData.eventId, 
							listenerData.handler, 
							listenerData.rank)});
		};
		
		var handleEvents = function()
		{
			// check events just after draw while we know the path
			while(eventsToHandle.length>0)
			{
				eventsToHandle.shift()();
			}
		};
			
		
		if (CreJs.Creanvas.elementDecorators)
		{
			for(var decoratorId=0; decoratorId<creanvas.elementDecorators.length; decoratorId++)
			{
				var decorator = CreJs.Creanvas.elementDecorators[decoratorId];
				if (elementData.hasOwnProperty(decorator.type) && elementData[decorator.type])
				{
					decorator.applyTo(element, eventsToHandle, elementData[decorator.type]);
				}
			}
		}
		
		this.clone = function()
		{
			return element.controller.addElement(elementData);
		};
	
		this.applyDecorator = function(decorator, decoratorData)
		{
			decorator.applyTo(element, eventsToHandle, decoratorData);
		};
		
		this.removeDecorator = function (decoratorType)
		{
			var toCancel = eventListeners.filter(function(listener){ return listener.decoratorType == decoratorType;});
			toCancel.forEach(function(listener){
				element.controller.removeEventListener(
					listener.eventId, 
					listener.handlerGuid);
			});
			eventListeners = eventListeners.filter(function(listener){ return listener.decoratorType != decoratorType;});
		};
		
		this.deactivate = function ()
		{
			while(eventListeners.length>0)
			{
				var listener = eventListeners.pop();
				
				element.controller.removeEventListener(
						listener.eventId, 
						listener.handlerGuid);
			}
		};
		
		element.addEventListener(
		{
			eventId: 'draw',
			rank: element.z,
			handler: function(e) { 
				element.controller.context.beginPath(); // missing in draw() would mess everything up...
				draw.call(element, element.controller.context);
				handleEvents();
		}});

		element.addEventListener(
		{
			eventId: 'deactivate', 
			handler: function(e) { element.deactivate(); }
		});

	};
	
	creanvas.Element.prototype.triggerRedraw = function()
	{
		this.controller.redraw();
	};
})();