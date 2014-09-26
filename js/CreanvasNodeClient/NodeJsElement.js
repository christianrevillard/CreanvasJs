// Basic Element
// Define position, drawing info

(function() {
	var creanvas = CreJs.CreanvasNodeClient;

	// decorators as additional arguments.
	creanvas.NodeJsElement = function(controller, identificationData,
			imageData, positionData) {

		var element = this;

		this.controller = controller;
		this.cachedValues = [];
		this.clonerData = [];
		this.elementEvents = this.elementEvents
				|| new CreJs.Creevents.EventContainer();

		setIdentification(element, identificationData[1]);
		setImage(element, imageData[1]);
		setPosition(element, positionData[1]);

		this.clonerData.push(identificationData);
		this.clonerData.push(imageData);
		this.clonerData.push(positionData);

		element.controller.elementEvents.getEvent('deactivate').addListener(
				function(e) {
					element.deactivate();
				});

		this.drawMyself = function() {

			var element = this;

			element.controller.context.scale(element.controller.lengthScale,
					element.controller.lengthScale);

			element.controller.context.translate(element.elementX,
					element.elementY);
			element.controller.context.rotate(element.elementAngle || 0);
			element.controller.context.scale(element.elementScaleX || 1,
					element.elementScaleY || 1);

			controller.context.beginPath();
			element.draw(controller.context);
			controller.context.setTransform(1, 0, 0, 1, 0, 0);

		};

		this.drawMyEdges = function() {

			var element = this;
			if (element.edges && element.edges.length>0)
			{
	
				element.controller.context.scale(element.controller.lengthScale,
						element.controller.lengthScale);
	
				element.controller.context.translate(element.elementX,
						element.elementY);
				element.controller.context.rotate(element.elementAngle || 0);
				element.controller.context.scale(element.elementScaleX || 1,
						element.elementScaleY || 1);
			
				element.controller.context.beginPath();
				var current = element.edges[0];
				element.controller.context.moveTo(current.x, current.y);
				for (var i=1; i<element.edges.length; i++)
				{
					current = element.edges[i];
					element.controller.context.lineTo(current.x, current.y);
				}
				element.controller.context.closePath();
			}
			
			controller.context.setTransform(1, 0, 0, 1, 0, 0);
		};


	};

	var setIdentification = function(element, identificationData) {
		element.elementName = identificationData;
	};

	var setImage = function(element, imageData) {
		var width = imageData["width"];
		var height = imageData["height"];

		element.top = imageData["top"] == 0 ? 0 : imageData["top"]
				|| (-height / 2);
		element.left = imageData["left"] == 0 ? 0 : imageData["left"]
				|| (-width / 2);
		element.bottom = imageData["bottom"] == 0 ? 0 : imageData["bottom"]
				|| (element.top + height);
		element.right = imageData["right"] == 0 ? 0 : imageData["right"]
				|| (element.left + width);
		element.elementWidth = width || (element.right - element.left);
		element.elementHeight = height || (element.bottom - element.top);

		element.topInPoints = Math.round(element.top
				* element.controller.lengthScale);
		element.leftInPoints = Math.round(element.left
				* element.controller.lengthScale);
		element.bottomInPoints = Math.round(element.bottom
				* element.controller.lengthScale);
		element.rightInPoints = Math.round(element.right
				* element.controller.lengthScale);
		element.widthInPoints = Math.round(element.elementWidth
				* element.controller.lengthScale);
		element.heightInPoints = Math.round(element.elementHeight
				* element.controller.lengthScale);

		// scaling decorator ?? => should be
		element.elementScaleX = imageData["scaleX"] || 1;
		element.elementScaleY = imageData["scaleY"] || 1;

		element.draw = imageData["draw"];

		// draw in a 50/50 points matrix
		var tempCanvas = element.controller.context.canvas.ownerDocument
				.createElement('canvas');
		element.temporaryRenderingContext = tempCanvas.getContext("2d");
		element.controller.context.canvas.ownerDocument.body.appendChild(tempCanvas);

		var stuff = 50;		
		
		tempCanvas.width = stuff;
		tempCanvas.height = stuff;

		element.temporaryRenderingContext.beginPath();
		element.temporaryRenderingContext.translate(-stuff*element.left/element.width, -stuff*element.top/element.height);
		element.temporaryRenderingContext.scale(stuff / element.width, stuff / element.height);
		element.draw.call(element, element.temporaryRenderingContext);
		
		var stuffImage = element.temporaryRenderingContext.getImageData(0, 0, stuff, stuff);
		element.edges = [];
		
		var startEdge = null;
		var transparencyLimit = 1;
		
		var imageX= null;
		var imageY = null;
		var currentEdge = null;
		
		var checkPoint = function(x,y,edge)
		{
			if (stuffImage.data[y*stuff*4 + x*4 + 3] < transparencyLimit)
				return false;
							
			var match = false;
			
			if (edge == "top")
			{
				match = y==0 || stuffImage.data[(y-1)*stuff*4 + x*4 + 3] < transparencyLimit;
				dx = 0.5; dy=0;
			}
			if (edge == "left")
			{
				match = x==0 || stuffImage.data[y*stuff*4 + (x-1)*4 + 3] < transparencyLimit;
				dx = 0; dy=0.5;
			}
			if (edge == "right")
			{
				match = x==stuff-1 || stuffImage.data[y*stuff*4 + (x+1)*4 + 3] < transparencyLimit;
				dx = 1; dy=0.5;
			}
			if (edge == "bottom")
			{
				match = y==stuff-1 || stuffImage.data[(y+1)*stuff*4 + x*4 + 3] < transparencyLimit;
				dx = 0.5; dy=1;
			};

			if (!match)
				return;
			
			element.edges.push({
				x: (x + dx)*element.width/stuff+ element.left,
				y: (y + dy)*element.height/stuff+ element.top}); 

			imageX = x;
			imageY = y;
			currentEdge = edge;

			return true;
		};
			
		for (var forX=0;forX<stuff; forX++)
		{
			for (var forY=0;forY<stuff; forY++)
			{
				if (checkPoint(forX, forY, "top"))
				{
					startEdge = {x:imageX, y:imageY};
					forX = stuff; forY=stuff;
				}
			}
		}

		if (startEdge)
		{						
			do 
			{
				if (currentEdge == "top")
				{
					if (imageX<stuff-1 && imageY>0 && checkPoint(imageX+1, imageY-1, "left"))
					{
						continue;
					}
					
					if (imageX<stuff-1 && checkPoint(imageX+1, imageY, "top"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "right"))
					{
						continue;
					}
				}
				else if (currentEdge == "right")
				{
					if (imageX<stuff-1 && imageY<stuff-1 && checkPoint(imageX+1, imageY+1, "top"))
					{
						continue;
					}
					
					if (imageY<stuff-1 && checkPoint(imageX, imageY+1, "right"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "bottom"))
					{
						continue;
					}
				}
				else if (currentEdge == "bottom")
				{
					if (imageX>0 && imageY<stuff-1 && checkPoint(imageX-1, imageY+1, "right"))
					{
						continue;
					}
					
					if (imageX>0 && checkPoint(imageX-1, imageY, "bottom"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "left"))
					{
						continue;
					}
				}
				else if (currentEdge == "left")
				{
					if (imageX>0 && imageY>0 && checkPoint(imageX-1, imageY-1, "bottom"))
					{
						continue;
					}
					
					if (imageY>0 && checkPoint(imageX, imageY-1, "left"))
					{
						continue;
					}
					
					if (checkPoint(imageX, imageY, "top"))
					{
						continue;
					}
				}
			} while (imageX != startEdge.x || imageY != startEdge.y);
		}
	};

	var setPosition = function(element, position) {
		// position prop
		element.elementX = position["x"] || 0;
		element.elementY = position["y"] || 0;
		element.elementZ = position["z"] || 0;
		element.elementAngle = position["angle"] || 0;
	};

	creanvas.NodeJsElement.prototype.hit = function(pointerX, pointerY) {
		if (!this.edges)
			return false;
		this.drawMyEdges();
		return this.controller.context.isPointInPath(pointerX, pointerY);
	};

	creanvas.NodeJsElement.prototype.applyElementDecorator = function(
			decoratorType, decoratorSettings) {
		if (DEBUG)
			this.debug("applyElementDecorator", decoratorType);

		var decorator = CreJs.Creanvas.elementDecorators[decoratorType];

		if (decorator) {
			this.clonerData.push([ decoratorType, decoratorSettings ]);
			decorator.applyTo(this, decoratorSettings);
		} else {
			if (DEBUG)
				this.debug("applyElementDecorator", "Not found: "
						+ decoratorType);
		}
	};

	creanvas.NodeJsElement.prototype.getCacheableValue = function(cacheKey,
			currentKey, getData) {
		if (this.cachedValues[cacheKey]
				&& this.cachedValues[cacheKey].key == currentKey) {
			return this.cachedValues[cacheKey].value;
		}
		var newValue = getData.call(this);
		this.cachedValues[cacheKey] = {
			key : currentKey,
			value : newValue
		};
		return newValue;
	};

	// unpractical syntax... ignore is unnatural here TODO
	creanvas.NodeJsElement.prototype.cloneElement = function(ignoreDecorators) {
		if (DEBUG)
			this.debug("cloneElement", "start cloning");

		var elementsToApply = ignoreDecorators ? this.clonerData
				.filter(function(d) {
					return ignoreDecorators.every(function(toIgnore) {
						return toIgnore != d[0];
					});
				}) : this.clonerData;

		if (DEBUG)
			this.debug("cloneElement", "apply " + elementsToApply.length
					+ " stuff");

		return this.controller.add.apply(this.controller, elementsToApply);
	};

	creanvas.NodeJsElement.prototype.canHandleEvent = function(eventId) {
		// click, pointerDown, always stopped by top element, even if not
		// handled
		return eventId == 'click' || eventId == 'pointerDown'
				|| this.elementEvents.hasEvent(eventId);
	};

	creanvas.NodeJsElement.prototype.deactivate = function() {
		this.temporaryRenderingContext = null;
	};

	creanvas.NodeJsElement.prototype.triggerRedraw = function() {
		this.controller.triggerRedraw();
	};

	// coordinate in Web app canvas according to scale
	creanvas.NodeJsElement.prototype.getWebappXY = function(imageX, imageY) {
		return {
			x : this.elementX
					+ (imageX * this.elementScaleX
							* Math.cos(this.elementAngle) - imageY
							* this.elementScaleY * Math.sin(this.elementAngle))
					/ this.controller.lengthScale,
			y : this.elementY
					+ (imageX * this.elementScaleX
							* Math.sin(this.elementAngle) + imageY
							* this.elementScaleY * Math.cos(this.elementAngle))
					/ this.controller.lengthScale
		};
	};

	// coordinates inside element image, in points
	creanvas.NodeJsElement.prototype.getElementXY = function(webAppX, webAppY) {
		return {
			x : Math
					.round(((webAppX - this.elementX)
							* this.controller.lengthScale
							* Math.cos(this.elementAngle) + (webAppY - this.elementY)
							* this.controller.lengthScale
							* Math.sin(this.elementAngle))
							/ this.elementScaleX),
			y : Math
					.round(((webAppY - this.elementY)
							* this.controller.lengthScale
							* Math.cos(this.elementAngle) - (webAppX - this.elementX)
							* this.controller.lengthScale
							* Math.sin(this.elementAngle))
							/ this.elementScaleY)
		};
	};

	creanvas.NodeJsElement.prototype.getCenter = function() {
		return this.getWebappXY(this.leftInPoints + this.widthInPoints / 2,
				this.topInPoints + this.heightInPoints / 2);
	};

	creanvas.NodeJsElement.prototype.getClientCorners = function() {
		var element = this;

		return this.getCacheableValue('getClientCorners', element.elementX + ''
				+ element.elementY + '' + element.elementAngle + ''
				+ element.elementScaleX + '' + element.elementScaleX,
				function() {
					var corners = [];
					corners.push({
						x : element.leftInPoints,
						y : element.topInPoints
					});
					corners.push({
						x : element.rightInPoints,
						y : element.topInPoints
					});
					corners.push({
						x : element.rightInPoints,
						y : element.bottomInPoints
					});
					corners.push({
						x : element.leftInPoints,
						y : element.bottomInPoints
					});

					return corners.map(function(point) {
						return element.getWebappXY(point.x, point.y);
					});
				});
	};

	creanvas.NodeJsElement.prototype.getClientRect = function() {
		var element = this;

		return this.getCacheableValue('getClientRect', element.elementX + ''
				+ element.elementY + '' + element.elementAngle + ''
				+ element.elementScaleX + '' + element.elementScaleX,
				function() {
					var clientCorners = element.getClientCorners();

					return {
						top : clientCorners.reduce(function(a, b) {
							return Math.min(a, b.y);
						}, Infinity),
						bottom : clientCorners.reduce(function(a, b) {
							return Math.max(a, b.y);
						}, -Infinity),
						left : clientCorners.reduce(function(a, b) {
							return Math.min(a, b.x);
						}, Infinity),
						right : clientCorners.reduce(function(a, b) {
							return Math.max(a, b.x);
						}, -Infinity)
					};
				});
	};

	creanvas.NodeJsElement.prototype.applyElementDecorators = function() {
		var element = this;

		var newDecorators = [].slice.apply(arguments);

		newDecorators.forEach(function(decoratorArgument) {
			element.applyElementDecorator(decoratorArgument[0],
					decoratorArgument[1]);
		});
	};

	if (DEBUG) {
		creanvas.NodeJsElement.prototype.debug = function(source, message) {
			this.controller.logMessage("Element." + source + ": " + message
					+ ". Element: " + this.elementName + "/" + this.elementId);
		};
	}

	// Export interface

	creanvas.NodeJsElement.prototype["clone"] = creanvas.NodeJsElement.prototype.cloneElement;
	creanvas.NodeJsElement.prototype["applyDecorator"] = creanvas.NodeJsElement.prototype.applyElementDecorator;
	creanvas.NodeJsElement.prototype["applyDecorators"] = creanvas.NodeJsElement.prototype.applyElementDecorators;

	Object.defineProperty(creanvas.NodeJsElement.prototype, "width", {
		get : function() {
			return this.elementWidth;
		},
		set : function(y) {
			this.elementWidth = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "height", {
		get : function() {
			return this.elementHeight;
		},
		set : function(y) {
			this.elementHeight = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "scaleX", {
		get : function() {
			return this.elementScaleX;
		},
		set : function(y) {
			this.elementScaleX = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "scaleY", {
		get : function() {
			return this.elementScaleY;
		},
		set : function(y) {
			this.elementScaleY = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "x", {
		get : function() {
			return this.elementX;
		},
		set : function(y) {
			this.elementX = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "y", {
		get : function() {
			return this.elementY;
		},
		set : function(y) {
			this.elementY = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "z", {
		get : function() {
			return this.elementZ;
		},
		set : function(y) {
			this.elementZ = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "angle", {
		get : function() {
			return this.elementAngle;
		},
		set : function(y) {
			this.elementAngle = y;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "name", {
		get : function() {
			return this.elementName;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "id", {
		get : function() {
			return this.elementId;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "image", {
		get : function() {
			return this.elementImage;
		}
	});
	Object.defineProperty(creanvas.NodeJsElement.prototype, "events", {
		get : function() {
			return this.elementEvents;
		}
	});
}());