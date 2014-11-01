// Basic Element
// Define position, drawing info

(function(){
	var creanvas = CreJs.Creanvas;

	// decorators as additional arguments.
	creanvas.Element = function(controller, identificationData, imageData, positionData){

		var element = this;
		
		this.controller = controller;
		this.cachedValues = [];
		this.clonerData = [];
		this.elementEvents = this.elementEvents || new CreJs.Creevents.EventContainer();
		
		setIdentification(element, identificationData[1]);
		setImage(element, imageData[1]);
		setPosition(element, positionData[1]);
		
		this.clonerData.push(identificationData);
		this.clonerData.push(imageData);
		this.clonerData.push(positionData);

		element.controller.elementEvents.getEvent('deactivate').addListener(function(e) { element.deactivate(); });
	};

	var setIdentification = function(element, identificationData)
	{
		element.elementName = identificationData;			
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
			// several image:store them here with offset // TODO
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
	
	creanvas.Element.prototype.hit = function(pointerX,pointerY)
	{
		var imageXY = this.getElementXY(pointerX, pointerY);
		var imageX = imageXY.x - this.leftInPoints;
		var imageY = imageXY.y - this.topInPoints;
	
		return imageX >= 0 && 
		imageX <= this.widthInPoints &&
		imageY >= 0 &&
		imageY <= this.heightInPoints && 
		this.elementImage.data[4*imageY*this.widthInPoints + 4*imageX + 3]>0;
	};
	

	creanvas.Element.prototype.applyElementDecorator = function(decoratorType, decoratorSettings)
	{
		if(DEBUG) this.debug("applyElementDecorator", decoratorType);			
	
		var decorator = CreJs.Creanvas.elementDecorators[decoratorType];

		if (decorator)
		{
			this.clonerData.push([decoratorType, decoratorSettings]);
			decorator.applyTo(this, decoratorSettings);
		}
		else
		{
			if(DEBUG) this.debug("applyElementDecorator","Not found: " + decoratorType);
		}
	};
	
	creanvas.Element.prototype.getCacheableValue = function(cacheKey, currentKey, getData)
	{				
		if (this.cachedValues[cacheKey] && this.cachedValues[cacheKey].key == currentKey)
		{
			return this.cachedValues[cacheKey].value;
		}
		var newValue = getData.call(this);
		this.cachedValues[cacheKey] = {key:currentKey, value:newValue};
		return newValue;
	};

	// unpractical syntax... ignore is unnatural here TODO
	creanvas.Element.prototype.cloneElement = function(ignoreDecorators)
	{
		if (DEBUG) this.debug("cloneElement","start cloning");

		var elementsToApply = 
			ignoreDecorators ? 
					this.clonerData.filter(function(d){
			return ignoreDecorators.every(function(toIgnore){ return toIgnore != d[0];});				
		}):this.clonerData;

		if (DEBUG) this.debug("cloneElement","apply " + elementsToApply.length + " stuff");

		return this.controller.add.apply(this.controller, elementsToApply);
	};
			
	creanvas.Element.prototype.canHandleEvent = function(eventId)
	{
		// click, pointerDown, always stopped by top element, even if not handled
		return eventId == 'click' || eventId == 'pointerDown' || 
		this.elementEvents.hasEvent(eventId);
	};
	
	creanvas.Element.prototype.deactivate = function ()
	{
		this.temporaryRenderingContext = null;
	};
	
	creanvas.Element.prototype.triggerRedraw = function()
	{
		this.controller.triggerRedraw();
	};	
			
	// coordinate in Web app canvas according to scale
	creanvas.Element.prototype.getWebappXY=function(imageX, imageY)
	{
		return {
			x: this.elementX + (imageX*this.elementScaleX*Math.cos(this.elementAngle) - imageY*this.elementScaleY*Math.sin(this.elementAngle))/this.controller.lengthScale,
			y: this.elementY + (imageX*this.elementScaleX*Math.sin(this.elementAngle) + imageY*this.elementScaleY*Math.cos(this.elementAngle))/this.controller.lengthScale
		};
	};

	// coordinates inside element image, in points
	creanvas.Element.prototype.getElementXY=function(webAppX, webAppY)
	{
		return {
			x: Math.round(((webAppX- this.elementX)*this.controller.lengthScale*Math.cos(this.elementAngle) +(webAppY-this.elementY)*this.controller.lengthScale*Math.sin(this.elementAngle))/this.elementScaleX),
			y: Math.round(((webAppY- this.elementY)*this.controller.lengthScale*Math.cos(this.elementAngle)-(webAppX-this.elementX)*this.controller.lengthScale*Math.sin(this.elementAngle))/this.elementScaleY)
		};
	};

	creanvas.Element.prototype.getCenter = function()
	{
		return this.getWebappXY(this.leftInPoints + this.widthInPoints/2, this.topInPoints + this.heightInPoints/2);
	};
	
	creanvas.Element.prototype.getClientCorners = function()
	{							
		var element = this;

		return this.getCacheableValue(
			'getClientCorners',
			element.elementX + '' + element.elementY + '' + element.elementAngle + '' + element.elementScaleX + '' + element.elementScaleX,
			function()
			{
				var corners=[];
				corners.push({x: element.leftInPoints, y: element.topInPoints});
				corners.push({x: element.rightInPoints, y: element.topInPoints});
				corners.push({x: element.rightInPoints, y: element.bottomInPoints});
				corners.push({x: element.leftInPoints, y: element.bottomInPoints});

				return corners.map(function(point){return element.getWebappXY(point.x, point.y);});					
			}				
		);
	};
	
	creanvas.Element.prototype.getClientRect = function()
	{			
		var element = this;

		return this.getCacheableValue(
			'getClientRect',
			element.elementX + '' + element.elementY + '' + element.elementAngle + '' + element.elementScaleX + '' + element.elementScaleX,
			function()
			{
				var clientCorners = element.getClientCorners();
				
				return {
					top: clientCorners.reduce(function(a,b){ return Math.min(a,b.y);}, Infinity),
					bottom: clientCorners.reduce(function(a,b){ return Math.max(a,b.y);}, -Infinity),
					left: clientCorners.reduce(function(a,b){ return Math.min(a,b.x);}, Infinity),
					right: clientCorners.reduce(function(a,b){ return Math.max(a,b.x);}, -Infinity)
				};
			}				
		);
	};		
		
	creanvas.Element.prototype.applyElementDecorators = function()
	{
		var element = this;
		
		var newDecorators = [].slice.apply(arguments);

		newDecorators.forEach(
		function(decoratorArgument)
		{
			element.applyElementDecorator(decoratorArgument[0], decoratorArgument[1]);
		});
	};

	if (DEBUG)
	{
		creanvas.Element.prototype.debug = function(source, message)
		{			
			this.controller.logMessage(
				"Element." + source + ": " + message + ". Element: " + this.elementName + "/" + this.elementId);
		};
	}

	// Export interface 		

	creanvas.Element.prototype["clone"] = creanvas.Element.prototype.cloneElement;
	creanvas.Element.prototype["applyDecorator"] = creanvas.Element.prototype.applyElementDecorator;
	creanvas.Element.prototype["applyDecorators"] = creanvas.Element.prototype.applyElementDecorators;

	Object.defineProperty(creanvas.Element.prototype, "width", { get: function() {return this.elementWidth; }, set: function(y) { this.elementWidth = y; }});
	Object.defineProperty(creanvas.Element.prototype, "height", { get: function() {return this.elementHeight; }, set: function(y) { this.elementHeight = y; }});
	Object.defineProperty(creanvas.Element.prototype, "scaleX", { get: function() {return this.elementScaleX; }, set: function(y) { this.elementScaleX = y; }});
	Object.defineProperty(creanvas.Element.prototype, "scaleY", { get: function() {return this.elementScaleY; }, set: function(y) { this.elementScaleY = y; }});
	Object.defineProperty(creanvas.Element.prototype, "x", { get: function() {return this.elementX; }, set: function(y) { this.elementX = y; }});
	Object.defineProperty(creanvas.Element.prototype, "y", { get: function() {return this.elementY; }, set: function(y) { this.elementY = y; }});
	Object.defineProperty(creanvas.Element.prototype, "z", { get: function() {return this.elementZ; }, set: function(y) { this.elementZ = y; }});
	Object.defineProperty(creanvas.Element.prototype, "angle", { get: function() {return this.elementAngle; }, set: function(y) { this.elementAngle = y; }});
	Object.defineProperty(creanvas.Element.prototype, "name", { get: function() {return this.elementName; }});
	Object.defineProperty(creanvas.Element.prototype, "id", { get: function() {return this.elementId; }});
	Object.defineProperty(creanvas.Element.prototype, "image", { get: function() {return this.elementImage; }});
	Object.defineProperty(creanvas.Element.prototype, "events", { get: function() {return this.elementEvents; }});
}());