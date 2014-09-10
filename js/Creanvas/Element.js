// Basic Element
// Define position, drawing info

(function(){
	var creanvas = CreJs.Creanvas;
	
	var setIdentification = function(element, identificationData)
	{
		element.elementName = identificationData;			
		element.elementId = CreJs.CreHelpers.GetGuid();	
	};
	
	var setImage = function(element, imageData)
	{		
		var width = imageData["width"];
		var height = imageData["height"];

		element.top = imageData["top"]==0 ? 0 : imageData["top"] || (-height/2);
		element.left = imageData["left"]==0 ? 0 : imageData["left"] || (-width/2);
		element.bottom = imageData["bottom"]==0 ? 0 : imageData["bottom"] || (element.top + height);
		element.right = imageData["right"]==0 ? 0 : imageData["right"] || (element.left + width);
		element.elementWidth = width || (element.right - element.left);
		element.elementHeight = height || (element.bottom - element.top);

		element.topInPoints = Math.round(element.top*element.controller.lengthScale);
		element.leftInPoints = Math.round(element.left*element.controller.lengthScale);
		element.bottomInPoints = Math.round(element.bottom*element.controller.lengthScale);
		element.rightInPoints = Math.round(element.right*element.controller.lengthScale);
		element.widthInPoints = Math.round(element.elementWidth*element.controller.lengthScale);
		element.heightInPoints = Math.round(element.elementHeight*element.controller.lengthScale);

		var canvas = element.controller.context.canvas;
		var tempCanvas = canvas.ownerDocument.createElement('canvas');			
		element.temporaryRenderingContext = tempCanvas.getContext("2d");

		// scaling decorator ?? => should be
		element.elementScaleX = imageData["scaleX"] || 1;
		element.elementScaleY = imageData["scaleY"] || 1;

		if (imageData["rawImage"])
		{
			element.elementImage = imageData["rawImage"];
			element.temporaryRenderingContext.putImageData(element.elementImage,0,0);
		}
		else
		{
			var draw = imageData["draw"];
			tempCanvas.width = element.widthInPoints;
			tempCanvas.height = element.heightInPoints;
			
			element.temporaryRenderingContext.beginPath();
			
			element.temporaryRenderingContext.translate(-element.leftInPoints, -element.topInPoints);
			
			element.temporaryRenderingContext.scale(element.controller.lengthScale,element.controller.lengthScale);
			
			draw.call(element,element.temporaryRenderingContext);
			// several image:store them here with offset
			element.elementImage = element.temporaryRenderingContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);
		}
	};
	
	var setPosition = function(element, position)
	{
		// position prop
		element.elementX = position["x"] || 0;
		element.elementY = position["y"] || 0;
		element.elementZ = position["z"] || 0;
		element.elementAngle = position["angle"]|| 0;
	};
	
	// decorators as additional arguments.
	creanvas.Element = function(controller, identificationData, imageData, positionData){

		var element = this;
		element.controller = controller;
		var cachedResults = [];
		var clonerdata = [];

		setIdentification(element, identificationData[1]);
		setImage(element, imageData[1]);
		setPosition(element, positionData[1]);
		
		clonerdata.push(identificationData);
		clonerdata.push(imageData);
		clonerdata.push(positionData);

		if (DEBUG)
		{
			element.debug = function(source, message)
			{
					element.controller.logMessage(
							"Element." + source + ": " + message + ". Element: " + element.elementName + "/" + element.elementId);
			};
		}

		element.elementEvents = new CreJs.Creevents.EventContainer();			
					
		element.hit = function(pointerX,pointerY)
		{

			var imageXY = element.getElementXY(pointerX, pointerY);

			var imageX = imageXY.x - element.leftInPoints;
			var imageY = imageXY.y - element.topInPoints;
		
			var xx = imageX >= 0 && 
			imageX <= element.widthInPoints &&
			imageY >= 0 &&
			imageY <= element.heightInPoints && 
			element.elementImage.data[4*imageY*element.widthInPoints + 4*imageX + 3]>0;
			
			if(DEBUG) element.debug("hit",xx?"hit":"no hit");

			return xx;

		};
		
		element.cloneElement = function(ignoreDecorators)
		{
			if (DEBUG) element.debug("cloneElement","start cloning");

			var elementsToApply = 
				ignoreDecorators ? 
						clonerdata.filter(function(d){
				return ignoreDecorators.every(function(toIgnore){ return toIgnore != d[0];});				
			}):clonerdata;

			if (DEBUG) element.debug("cloneElement","apply " + elementsToApply.length + " stuff");

			return element.controller.add.apply(element.controller, elementsToApply);
		};
		
		element.removeElementDecorator = function (decoratorType)
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
		
		element.canHandle = function(eventId)
		{
			// click, pointerDown, always stopped by top element, even if not handled
			return eventId == 'click' || eventId == 'pointerDown' || 
			element.elementEvents.hasEvent(eventId);
		};
		
		element.deactivate = function ()
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

		element.triggerRedraw = function()
		{
			element.controller.triggerRedraw();
		};	
				
		// coordinate in Web app canvas according to scale
		element.getWebappXY=function(imageX, imageY)
		{
			return {
				x: element.elementX + (imageX*element.elementScaleX*Math.cos(element.elementAngle) - imageY*element.elementScaleY*Math.sin(element.elementAngle))/element.controller.lengthScale,
				y: element.elementY + (imageX*element.elementScaleX*Math.sin(element.elementAngle) + imageY*element.elementScaleY*Math.cos(element.elementAngle))/element.controller.lengthScale
			};
		};

		// coordinates inside element image, in points
		element.getElementXY=function(webAppX, webAppY)
		{
			return {
				x: Math.round(((webAppX- element.elementX)*element.controller.lengthScale*Math.cos(element.elementAngle) +(webAppY-element.elementY)*element.controller.lengthScale*Math.sin(element.elementAngle))/element.elementScaleX),
				y: Math.round(((webAppY- element.elementY)*element.controller.lengthScale*Math.cos(element.elementAngle)-(webAppX-element.elementX)*element.controller.lengthScale*Math.sin(element.elementAngle))/element.elementScaleY)
			};
		};

		element.getCenter = function()
		{
			return element.getWebappXY(element.leftInPoints + element.widthInPoints/2, element.topInPoints + element.heightInPoints/2);
		};
		
		var corners=[];
		corners.push({x: element.leftInPoints, y: element.topInPoints});
		corners.push({x: element.rightInPoints, y: element.topInPoints});
		corners.push({x: element.rightInPoints, y: element.bottomInPoints});
		corners.push({x: element.leftInPoints, y: element.bottomInPoints});

		element.getClientCornersCache = function()
		{				
			return corners.map(function(point){return element.getWebappXY(point.x, point.y);});
		};

		element.getClientCorners = function()
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

		element.getClientRectCache = function()
		{			
			var clientCorners = element.getClientCorners();
			
			return {
				top: clientCorners.reduce(function(a,b){ return Math.min(a,b.y);}, Infinity),
				bottom: clientCorners.reduce(function(a,b){ return Math.max(a,b.y);}, -Infinity),
				left: clientCorners.reduce(function(a,b){ return Math.min(a,b.x);}, Infinity),
				right: clientCorners.reduce(function(a,b){ return Math.max(a,b.x);}, -Infinity)
			};
		};

		element.getClientRect = function()
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
			
		element.applyElementDecorators = function()
		{
			var element = this;
			
			var newDecorators = [].slice.apply(arguments);

			clonerdata = clonerdata.concat(newDecorators);

			newDecorators.forEach(
			function(decoratorArgument)
			{
				element.applyElementDecorator(decoratorArgument[0], decoratorArgument[1]);
			});
		};

		element.applyElementDecorator = function(decoratorType, decoratorSettings)
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

		Object.defineProperty(element, "id", { get: function() {return this.elementId; }});
		Object.defineProperty(element, "image", { get: function() {return this.elementImage; }});
		Object.defineProperty(element, "events", { get: function() {return this.elementEvents; }});

		element["clone"] = element.cloneElement;
		element["applyDecorator"] = element.applyElementDecorator;
		element["applyDecorators"] = element.applyElementDecorators;
		element["removeDecorator"] = element.removeElementDecorator;
	};
}());