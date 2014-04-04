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
		
		var cachedResults = [];

		// generic stuff		
		this.controller = elementData.controller;
		this.x = elementData.x || 0;
		this.y = elementData.y || 0;
		this.z = elementData.z || 0;
		this.id = CreJs.CreHelpers.GetGuid();	
		this.name = elementData.name;	
		this.image = elementData.image; // need to be property?
		this.width = elementData.width;
		this.height = elementData.height;
		this.angle = elementData.angle || 0;
		this.scaleX = elementData.scaleX || 1;
		this.scaleY = elementData.scaleY || 1;
		this.m = 1;
		
		var draw = elementData.draw;	

		this.getM = function()
		{				
			return element.m / 12 * (element.width*element.scaleX * element.width*element.scaleX + element.height*element.scaleY * element.height*element.scaleY); // square...};
		};
		
		this.geRadiusCache = function()
		{				
			return Math.sqrt(element.width*element.width*element.scaleX*element.scaleX + element.height*element.height*element.scaleY*element.scaleY)/2;
		};

		this.getRadius = function()
		{				
			var key = element.width + '' + element.height + '' + element.scaleX+ '' + element.scaleY ;
			if (cachedResults['getRadius'] && cachedResults['getRadius'].key == key)
			{
				return cachedResults['getRadius'].value;
			}
			var value = element.geRadiusCache();
			cachedResults['geRadius'] = {key:key, value:value};
			return value;
		};
				
		var translate = elementData.translate || {dx:elementData.width/2, dy:elementData.height/2};			
		this.dx = translate.dx;
		this.dy = translate.dy;
		var element = this;
		
		if (elementData.rules)
		{
			element.rules = [];
			elementData.rules.forEach(function(rule)
			{
				var  ruleId = element.rules.length;
				element.rules.push(rule);
				setInterval(
						function()
						{
							element.rules[ruleId].rule.call(element);					
							element.triggerRedraw();
						},
						rule.checkTime);
			});
		};
							
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
		};

		this.clone = function()
		{
			var newElement = element.controller.addElementWithoutContext(elementData);
			newElement.temporaryRenderingContext = element.temporaryRenderingContext;
			newElement.image = element.image;
			return newElement;
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
			element.temporaryRenderingContext = null;
		};
		
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
		
		
		// move to element
		this.getCanvasXY=function(imageX, imageY)
		{
			return {
				x: Math.round(element.x + imageX*element.scaleX*Math.cos(element.angle) - imageY*element.scaleY*Math.sin(element.angle)),
				y: Math.round(element.y + imageX*element.scaleX*Math.sin(element.angle) + imageY*element.scaleY*Math.cos(element.angle))
			};
		};

		this.getElementXY=function(canvasX, canvasY)
		{
			return {
				x: Math.round(((canvasX- element.x)*Math.cos(element.angle) + (canvasY-element.y)*Math.sin(element.angle))/element.scaleX),
				y: Math.round(((canvasY- element.y)*Math.cos(element.angle)-(canvasX-element.x)*Math.sin(element.angle))/element.scaleY),
			};
		};
		
		
		this.getCenter = function()
		{
			return element.getCanvasXY(-element.dx + element.width/2, -element.dy + element.height/2);
		};
		
		var corners=[];
		corners.push({x:- element.dx, y: -element.dy});
		corners.push({x:- element.dx + element.width, y:-element.dy});
		corners.push({x:- element.dx + element.width, y:-element.dy + element.height});
		corners.push({x:- element.dx, y:-element.dy + element.height});

		this.getClientCornersCache = function()
		{				
			return corners.map(function(point){return element.getCanvasXY(point.x, point.y);});
		};

		this.getClientCorners = function()
		{				
			var key = element.x + '' + element.y + '' + element.angle + '' + element.scaleX + '' + element.scaleX;
			if (cachedResults['getClientCorners'] && cachedResults['getClientCorners'].key == key)
			{
				return cachedResults['getClientCorners'].value;
			}
			var value = element.getClientCornersCache();
			cachedResults['getClientCorners'] = {key:key, value:value};
			return value;
		};

		this.getClientRectCache = function()
		{			
			var clientCorners = element.getClientCorners();
			
			return {
				top: clientCorners.reduce(function(a,b){ return Math.min(a,b.y);}, Infinity),
				bottom: clientCorners.reduce(function(a,b){ return Math.max(a,b.y);}, -Infinity),
				left: clientCorners.reduce(function(a,b){ return Math.min(a,b.x);}, Infinity),
				right: clientCorners.reduce(function(a,b){ return Math.max(a,b.x);}, -Infinity)
			};
		};

		this.getClientRect = function()
		{			
			var key = element.x + '' + element.y + '' + element.angle + '' + element.scaleX + '' + element.scaleX;
			if (cachedResults['getClientRect'] && cachedResults['getClientRect'].key == key)
			{
				return cachedResults['getClientRect'].value;
			}
			var value = element.getClientRectCache();
			cachedResults['getClientRect'] = {key:key, value:value};
			return value;
		};		
	};

}());