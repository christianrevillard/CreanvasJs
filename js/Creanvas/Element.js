// Basic Element
// Define position, drawing info

(function(){
	var creanvas = CreJs.Creanvas;

	// decorators as additional arguments.
	creanvas.Element = function(
		controller, 
		elementDefinition){
		
		this.elementName = elementDefinition.elementName;
		var image = elementDefinition.elementImage;
		var draw = image.imageDraw;
		var position = elementDefinition.elementPosition;
		
		var rules = elementDefinition.rules;
		
		var decoratorArguments = [].slice.apply(arguments).slice(2);

		var cachedResults = [];

		// generic stuff		
		this.controller = controller;
		this.elementId = CreJs.CreHelpers.GetGuid();	

		// box property, including dx		
		this.elementWidth = image.imageWidth;
		this.elementHeight = image.imageHeight;

		// position prop
		this.elementX = position.positionX || 0;
		this.elementY = position.positionY || 0;
		this.elementZ = position.positionZ || 0;
		this.elementAngle = position.positionAngle || 0;
		
		// scaling decorator ?? => should be
		this.elementScaleX = image.imageScaleX || 1;
		this.elementScaleY = image.imageScaleY || 1;
		this.elementMass = 1;
	
		// rename cleary, center or something
		var translate = image.imageTranslate || {translateDx:image.imageWidth/2, translateDy:image.imageHeight/2};			
		this.dx = translate.translateDx;
		this.dy = translate.translateDy;

		if (image.rawImage)
		{
			this.elementImage = image.rawImage;

			var canvas = this.controller.context.canvas;
			var tempCanvas = canvas.ownerDocument.createElement('canvas');			
			this.temporaryRenderingContext = tempCanvas.getContext("2d");
			this.temporaryRenderingContext.putImageData(this.elementImage,0,0);
		}
		else
		{
			var canvas = this.controller.context.canvas;
			var tempCanvas = canvas.ownerDocument.createElement('canvas');			
			tempCanvas.width = image.imageWidth;
			tempCanvas.height = image.imageHeight;
			
			this.temporaryRenderingContext = tempCanvas.getContext("2d");
			this.temporaryRenderingContext.beginPath();
			
			this.temporaryRenderingContext.translate(this.dx, this.dy);
			draw(this.temporaryRenderingContext);
			// several image:store them here with offset
			this.elementImage = this.temporaryRenderingContext.getImageData(0, 0, image.imageWidth, image.imageHeight);
		}
						
		var element = this;
		
		if (DEBUG)
		{
			element.debug = function(source, message)
			{
					element.controller.logMessage(
							"Element." + source + ": " + message + ". Element: " + element.elementName + "/" + element.elementId);
			};
		}
		
		// decorator stuff ?
		if (rules)
		{
			element.rules = [];
			rules.forEach(function(rule)
			{
				var  ruleId = element.rules.length;
				element.rules.push(rule);
				setInterval(
						function()
						{
							element.rules[ruleId]["rule"].call(element);					
							element.triggerRedraw();
						},
						rule["checkTime"]);
			});
		};
							
		this.elementEvents = new CreJs.Creevents.EventContainer();			
			
		this.isPointInPath = function(clientXY){

			var canvasXY = element.controller.getCanvasXYFromClientXY(clientXY);	

			return element.controller.noDrawContext.isPointInPath(element, draw, canvasXY);
		};

		if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators)
		{
			if (DEBUG)
			{
				controller.logMessage("New element " + elementName + " : apply " + decoratorArguments.length + " decorators");
			}
			element.applyElementDecorators(decoratorArguments);
		}
		
		this.hit = function(pointerX,pointerY)
		{
			var imageX = Math.round(pointerX - element.elementX + element.dx);
			var imageY = Math.round(pointerY - element.elementY + element.dy);
		
			var xx = imageX >= 0 && 
			imageX <= element.elementWidth &&
			imageY >= 0 &&
			imageY <= element.elementHeight && 
			element.elementImage.data[4*imageY*element.elementWidth + 4*imageX + 3]>0;
			
			if(DEBUG) element.debug("hit",xx?"hit":"no hit");

			return xx;

		};
		
		this.cloneElement = function(ignoreDecorators)
		{
			image.image = element.elementImage;
			
			if (DEBUG) element.debug("cloneElement","start cloning");

			var newElement = element.controller.add(elementDefinition);
									
			var decoratorsToApply = 
				ignoreDecorators ? 
					decoratorArguments.filter(function(d){
				return ignoreDecorators.every(function(toIgnore){ return toIgnore != d[0];});				
			}):decoratorArguments;

			if (DEBUG) element.debug("cloneElement","apply " + decoratorsToApply.length + " decorators");

			newElement.applyElementDecorators.apply(newElement, decoratorsToApply);
			
			return newElement;
		};
		
		this.removeElementDecorator = function (decoratorType)
		{			
			if(DEBUG) element.debug("removeElementDecorator", decoratorType);			

			var decorator = CreJs.Creanvas.elementDecorators[decoratorType];

			if (decorator && decorator.removeFrom)
			{
				decorator.removeFrom(element);
			}
			else
			{
				if(DEBUG) element.debug("removeElementDecorator","Cannot remove: " + decoratorType);
			}		
		};
		
		this.canHandle = function(eventId)
		{
			// click, pointerDown, always stopped by top element, even if not handled
			return eventId == 'click' || eventId == 'pointerDown' || 
			element.elementEvents.hasEvent(eventId);
		};
		
		this.deactivate = function ()
		{
			element.controller.elementEvents.removeEventListener({listenerId:element.elementId});
			element.temporaryRenderingContext = null;
		};
		
		element.controller.elementEvents.addEventListenerX(
		{
			"eventId": 'deactivate', 
			"listenerId":element.elementId,
			"handleEvent": function(e) { element.deactivate(); }
		});

		this.triggerRedraw = function()
		{
			element.controller.triggerRedraw();
		};	
				
		this.getCanvasXY=function(imageX, imageY)
		{
			return {
				x: Math.round(element.elementX + imageX*element.elementScaleX*Math.cos(element.elementAngle) - imageY*element.elementScaleY*Math.sin(element.elementAngle)),
				y: Math.round(element.elementY + imageX*element.elementScaleX*Math.sin(element.elementAngle) + imageY*element.elementScaleY*Math.cos(element.elementAngle))
			};
		};

		this.getCanvasXYNoRounding=function(imageX, imageY)
		{
			return {
				x: element.elementX + imageX*element.elementScaleX*Math.cos(element.elementAngle) - imageY*element.elementScaleY*Math.sin(element.elementAngle),
				y: element.elementY + imageX*element.elementScaleX*Math.sin(element.elementAngle) + imageY*element.elementScaleY*Math.cos(element.elementAngle)
			};
		};

		this.getElementXY=function(canvasX, canvasY)
		{
			return {
				x: Math.round(((canvasX- element.elementX)*Math.cos(element.elementAngle) + (canvasY-element.elementY)*Math.sin(element.elementAngle))/element.elementScaleX),
				y: Math.round(((canvasY- element.elementY)*Math.cos(element.elementAngle)-(canvasX-element.elementX)*Math.sin(element.elementAngle))/element.elementScaleY)
			};
		};
				
		this.getCenter = function()
		{
			return element.getCanvasXY(-element.dx + element.elementWidth/2, -element.dy + element.elementHeight/2);
		};
		
		var corners=[];
		corners.push({x:- element.dx, y: -element.dy});
		corners.push({x:- element.dx + element.elementWidth, y:-element.dy});
		corners.push({x:- element.dx + element.elementWidth, y:-element.dy + element.elementHeight});
		corners.push({x:- element.dx, y:-element.dy + element.elementHeight});

		this.getClientCornersCache = function()
		{				
			return corners.map(function(point){return element.getCanvasXY(point.x, point.y);});
		};

		this.getClientCorners = function()
		{				
			var key = element.elementX + '' + element.elementY + '' + element.elementAngle + '' + element.elementScaleX + '' + element.elementScaleX;
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
			var key = element.elementX + '' + element.elementY + '' + element.elementAngle + '' + element.elementScaleX + '' + element.elementScaleX;
			if (cachedResults['getClientRect'] && cachedResults['getClientRect'].key == key)
			{
				return cachedResults['getClientRect'].value;
			}
			var value = element.getClientRectCache();
			cachedResults['getClientRect'] = {key:key, value:value};
			return value;
		};		
			
		this.applyElementDecorators = function()
		{
			var element = this;
			
			var newDecorators = [].slice.apply(arguments);

			decoratorArguments = decoratorArguments.concat(newDecorators);

			newDecorators.forEach(
			function(decoratorArgument)
			{
				element.applyElementDecorator(decoratorArgument[0], decoratorArgument[1]);
			});
		};

		this.applyElementDecorator = function(decoratorType, decoratorSettings)
		{
			var element = this;
			
			if(DEBUG) element.debug("applyElementDecorator", decoratorType);			

			var decorator = CreJs.Creanvas.elementDecorators[decoratorType];

			if (decorator)
			{
				decorator.applyTo(element, decoratorSettings);
			}
			else
			{
				if(DEBUG) element.debug("applyElementDecorator","Not found: " + decoratorType);
			}
		};

		// Export interface 
		
		Object.defineProperty(element, "name", { get: function() {return this.elementName; }, set: function(y) { this.elementName = y; }});
		Object.defineProperty(element, "width", { get: function() {return this.elementWidth; }, set: function(y) { this.elementWidth = y; }});
		Object.defineProperty(element, "height", { get: function() {return this.elementHeight; }, set: function(y) { this.elementHeight = y; }});
		Object.defineProperty(element, "scaleX", { get: function() {return this.elementScaleX; }, set: function(y) { this.elementScaleX = y; }});
		Object.defineProperty(element, "scaleY", { get: function() {return this.elementScaleY; }, set: function(y) { this.elementScaleY = y; }});
		Object.defineProperty(element, "x", { get: function() {return this.elementX; }, set: function(y) { this.elementX = y; }});
		Object.defineProperty(element, "y", { get: function() {return this.elementY; }, set: function(y) { this.elementY = y; }});
		Object.defineProperty(element, "z", { get: function() {return this.elementZ; }, set: function(y) { this.elementZ = y; }});
		Object.defineProperty(element, "angle", { get: function() {return this.elementAngle; }, set: function(y) { this.elementAngle = y; }});
		Object.defineProperty(element, "mass", { get: function() {return this.elementMass; }, set: function(y) { this.elementMass = y; }});

		Object.defineProperty(element, "id", { get: function() {return this.elementId; }});
		Object.defineProperty(element, "image", { get: function() {return this.elementImage; }});
		Object.defineProperty(element, "events", { get: function() {return this.elementEvents; }});

		element["clone"] = element.cloneElement;
		element["applyDecorator"] = element.applyElementDecorator;
		element["applyDecorators"] = element.applyElementDecorators;
		element["removeDecorator"] = element.removeElementDecorator;
	};
}());