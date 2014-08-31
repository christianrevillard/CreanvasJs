// Basic Element
// Define position, drawing info

(function(){
	var creanvas = CreJs.Creanvas;

	// decorators as additional arguments.
	creanvas.Element = function(
		controller, 
		elementDefinition){

		var decoratorArguments = [].slice.apply(arguments).slice(2);

		var cachedResults = [];

		// generic stuff		
		this.controller = controller;
		this.name = elementDefinition.name;	
		this.id = CreJs.CreHelpers.GetGuid();	

		// box property, including dx		
		this.width = elementDefinition.image.width;
		this.height = elementDefinition.image.height;

		// position prop
		this.x = elementDefinition.position.x || 0;
		this.y = elementDefinition.position.y || 0;
		this.z = elementDefinition.position.z || 0;
		this.angle = elementDefinition.position.angle || 0;
		
		// scaling decorator ?? => should be
		this.scaleX = elementDefinition.image.scaleX || 1;
		this.scaleY = elementDefinition.image.scaleY || 1;
		this.m = 1;
		
		var draw = elementDefinition.image.draw;	

		// rename cleary, center or something
		var translate = elementDefinition.image.translate || {dx:elementDefinition.image.width/2, dy:elementDefinition.image.height/2};			
		this.dx = translate.dx;
		this.dy = translate.dy;

		if (elementDefinition.image.image)
		{
			this.image = elementDefinition.image.image;

			var canvas = this.controller.context.canvas;
			var tempCanvas = canvas.ownerDocument.createElement('canvas');			
			this.temporaryRenderingContext = tempCanvas.getContext("2d");
			this.temporaryRenderingContext.putImageData(this.image,0,0);
		}
		else
		{
			var canvas = this.controller.context.canvas;
			var tempCanvas = canvas.ownerDocument.createElement('canvas');			
			tempCanvas.width = elementDefinition.image.width;
			tempCanvas.height = elementDefinition.image.height;
			
			this.temporaryRenderingContext = tempCanvas.getContext("2d");
			this.temporaryRenderingContext.beginPath();
			
			this.temporaryRenderingContext.translate(this.dx, this.dy);
			elementDefinition.image.draw(this.temporaryRenderingContext);
			// several image:store them here with offset
			this.image = this.temporaryRenderingContext.getImageData(0, 0, elementDefinition.image.width, elementDefinition.image.height);
		}
						
		var element = this;
		
		if (DEBUG)
		{
			element.debug = function(source, message)
			{
					element.controller.log(
							"Element." + source + ": " + message + ". Element: " + element.name + "/" + element.id);
			};
		}
		
		// decorator stuff ?
		if (elementDefinition.rules)
		{
			element.rules = [];
			elementDefinition.rules.forEach(function(rule)
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

		if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators)
		{
			if (DEBUG)
			{
				controller.log("New element " + elementDefinition.name + " : apply " + decoratorArguments.length + " decorators");
			}
			element.applyDecorators(decoratorArguments);
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
			elementDefinition.image.image = element.image;
			
			if (DEBUG)
			{
				controller.log("cloning with elementdefinition: " + elementDefinition);
			}
			var newElement = element.controller.addElement(
					elementDefinition);
			
			if (DEBUG)
			{
				controller.log("Cloning " + newElement.name + " : apply " + decoratorArguments.length + " decorators");
			}
			newElement.applyDecorators.apply(newElement, decoratorArguments);
			
			return newElement;
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
				
		this.getCanvasXY=function(imageX, imageY)
		{
			return {
				x: Math.round(element.x + imageX*element.scaleX*Math.cos(element.angle) - imageY*element.scaleY*Math.sin(element.angle)),
				y: Math.round(element.y + imageX*element.scaleX*Math.sin(element.angle) + imageY*element.scaleY*Math.cos(element.angle))
			};
		};

		this.getCanvasXYNoRounding=function(imageX, imageY)
		{
			return {
				x: element.x + imageX*element.scaleX*Math.cos(element.angle) - imageY*element.scaleY*Math.sin(element.angle),
				y: element.y + imageX*element.scaleX*Math.sin(element.angle) + imageY*element.scaleY*Math.cos(element.angle)
			};
		};

		this.getElementXY=function(canvasX, canvasY)
		{
			return {
				x: Math.round(((canvasX- element.x)*Math.cos(element.angle) + (canvasY-element.y)*Math.sin(element.angle))/element.scaleX),
				y: Math.round(((canvasY- element.y)*Math.cos(element.angle)-(canvasX-element.x)*Math.sin(element.angle))/element.scaleY)
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
			
		this.applyDecorators = function()
		{
			var element = this;

			if(DEBUG) element.debug("applyDecorators","Applying " + arguments.length + " new decorators");

			decoratorArguments = decoratorArguments.concat([].slice.apply(arguments));

			if(DEBUG) element.debug("applyDecorators","Applying " + decoratorArguments.length + " decorators");

			decoratorArguments.forEach(
			function(decoratorArgument)
			{
				element.applyDecorator(decoratorArgument[0], decoratorArgument[1]);
			});
		};

		this.applyDecorator = function(decoratorType, decoratorSettings)
		{
			var element = this;
			
			if(DEBUG) element.debug("applyDecorator", "Applying decorator " + decoratorType);			

			var decorator = CreJs.Creanvas.elementDecorators[decoratorType];

			if (decorator)
			{
				decorator.applyTo(element, decoratorSettings);
			}
			else
			{
				if(DEBUG) element.debug("applyDecorator","Decorator not found: " + decoratorType);
			}
		};

	};
}());