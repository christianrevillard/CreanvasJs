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
		this.image = elementData.image; // TODO : switch betwwen multiple image
		var draw = elementData.draw;	
		this.width = elementData.width;
		this.height = elementData.height;
		
		var element = this;
							
		this.events = new CreJs.Creevents.EventContainer();			
			
		this.isPointInPath = function(clientXY){

			var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);	

			return element.controller.noDrawContext.isPointInPath(element, draw, canvasXY);
		};

		if (CreJs.Creanvas.elementDecorators)
		{
			for(var decoratorId=0; decoratorId<creanvas.elementDecorators.length; decoratorId++)
			{
				var decorator = CreJs.Creanvas.elementDecorators[decoratorId];
				if (elementData.hasOwnProperty(decorator.type) && elementData[decorator.type])
				{
					decorator.applyTo(element, elementData[decorator.type]);
				}
			}
		}
		
		this.hit = function(pointerX,pointerY)
		{
			var imageX = Math.round(pointerX - element.x + element.dx);
			var imageY = Math.round(pointerY - element.y + element.dy);
			
			return imageX >= 0 && 
			imageX <= element.width &&
			imageY >= 0 &&
			imageY <= element.height && 
			element.image.data[4*imageY*element.width + 4*imageX + 3]>0;
		}

		this.clone = function()
		{
			return element.controller.addElement(elementData);
		};
	
		this.applyDecorator = function(decorator, decoratorData)
		{
			decorator.applyTo(element, decoratorData);
		};
		
		this.removeDecorator = function (decoratorType)
		{
			element.events.removeEventListener(
					{eventGroupType:decoratorType,
						listenerId:element.id});
		};
		
		this.canHandle = function(eventId)
		{
			// click, pointerDown, always stopped by top element, even if not handled
			return eventId == 'click' || eventId == 'pointerDown' || 
			element.events.hasEvent(eventId);
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
				
/*				element.controller.context.beginPath(); // missing in draw() would mess everything up...

				var eventsToCheck = e.events.filter(function(x){ return element.canHandle(x.eventId);});
				
				eventsToCheck.forEach(function(eventPoint)
				{
					eventPoint.mask = element.controller.context.createImageData(1,1);
					eventPoint.mask.data[3]=0;
					element.controller.context.putImageData(eventPoint.mask, eventPoint.event.x, eventPoint.event.y);
				});
								
				draw.call(element, element.controller.context);

				eventsToCheck.forEach(function(eventPoint)
				{
					eventPoint.after = element.controller.context.getImageData(
								eventPoint.event.x, eventPoint.event.y,1,1);

					if (eventPoint.after.data[3] != 0)
					{
						eventPoint.claimingElement = element;
					}
				});*/
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