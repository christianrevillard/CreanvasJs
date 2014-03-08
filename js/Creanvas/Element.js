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
		this.id = CreJs.CreHelpers.GetGuid();	
		this.name = elementData.name;	
	
		var draw = elementData.draw;	
	
		var element = this;
					
		var eventTarget = new CreJs.Creevents.EventTarget();
		
		this.events = new CreJs.Creevents.EventContainer();			
	
		this.isPointInPath = function(clientXY){
			// weakness: will only work with the last path in 'draw' function
			// and only just after drawing this element.
			var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);	
			return element.controller.context.isPointInPath(
				canvasXY.x, 
				canvasXY.y);
		};

		if (CreJs.Creanvas.elementDecorators)
		{
			for(var decoratorId=0; decoratorId<creanvas.elementDecorators.length; decoratorId++)
			{
				var decorator = CreJs.Creanvas.elementDecorators[decoratorId];
				if (elementData.hasOwnProperty(decorator.type) && elementData[decorator.type])
				{
					decorator.applyTo(element, eventTarget, elementData[decorator.type]);
				}
			}
		}
		
		this.clone = function()
		{
			return element.controller.addElement(elementData);
		};
	
		this.applyDecorator = function(decorator, decoratorData)
		{
			decorator.applyTo(element, eventTarget, decoratorData);
		};
		
		this.removeDecorator = function (decoratorType)
		{
			element.controller.events.removeEventListener(
					{eventGroupType:decoratorType,
						listenerId:element.id});
		};
		
		this.deactivate = function ()
		{
			element.controller.events.removeEventListener({listenerId:element.id});
		};
		
		element.controller.events.addEventListener(
		{
			eventId: 'draw',
			rank: element.z,
			listenerId:element.id,
			handleEvent: function(e) { 
				element.controller.context.beginPath(); // missing in draw() would mess everything up...
				draw.call(element, element.controller.context);
				eventTarget.handleEvents();
		}});

		element.controller.events.addEventListener(
		{
			eventId: 'deactivate', 
			listenerId:element.id,
			handleEvent: function(e) { element.deactivate(); }
		});


		this.triggerRedraw = function()
		{
			element.controller.redraw();
		};	
	};
	

}());