// IN progress
// client side of the controller
// register elements locally, register them on the server
// client controller (here) does the display on request from the server
// client event (mouse) to be send to the server- hit: local? server? TBD

(function(){
	var creanvas = CreJs.CreanvasNodeClient;
	
	creanvas.NodeJsController = function(controllerData) {
		var controller = this;
				
		var canvas = controllerData["canvas"];
		this.logger = controllerData['log'];		
		this.lengthScale =  controllerData["lengthScale"] ||  canvas.height / controllerData["realHeight"] || canvas.width / controllerData["realWidth"]|| 1;
		timeScale = controllerData["timeScale"] || 1;
		this.nodeSocket = controllerData["nodeSocket"];				
		this.drawingMethods = [];
						
		controller.needRedraw = true;
		controller.isDrawing = false;
		if (DEBUG) this.logMessage('Starting controller');
		
		controller.refreshTime = controllerData["controller.refreshTime"] || creanvas.NodeJsController.DEFAULT_REFRESH_TIME;
		controller.elements = [];
		controller.elementEvents = new CreJs.Creevents.EventContainer();		
		controller.context = canvas.getContext("2d");		
		
		controller.context.setTransform(1,0,0,1,0,0);
		registerCanvasEvents.call(controller);
		addBackground.call(controller, controllerData["drawBackground"], controllerData["backgroundStyle"]);
		startController.call(controller);
		
		this.nodeSocket.on('update', function(msg){
			var data = JSON.parse(msg);
			
			data.forEach(function(updated){
			var el = controller.elements.filter(function(e){ return e.id == updated.id;})[0];
			el.x = updated.x;
			el.y = updated.y;});
			
			  new CreJs.Crelog.Logger().logMessage("MOVED:" + msg);
		  });	  

		this.nodeSocket.on('addElement', function(msg){
			var data = JSON.parse(msg);
			controller.add(
					["name",data.name],
					["image", {
						"left" :data.left,
						"top": data.top,
						"width": data.width,
						"height": data.height,
						"draw": controller.drawingMethods.filter(function(e){ return e.elementType == data.elementType;})[0].draw
					}],
					["position", {"x": data.x, "y": data.y, "z": data.z }]);
		});
		
	};
	
	var registerCanvasEvents = function()
	{
		this.registerCanvasPointerEvent('click', 'click');
		this.registerCanvasPointerEvent('mousedown','pointerDown');
		this.registerCanvasPointerEvent('touchstart','pointerDown');
		this.registerTouchIdentifierEvent('mousemove','pointerMove');
		this.registerTouchIdentifierEvent('touchmove','pointerMove');
		this.registerTouchIdentifierEvent('mouseup','pointerUp');
		this.registerTouchIdentifierEvent('touchend','pointerUp');
	};		
	
	var addBackground = function(drawBackground, backgroundStyle)
	{
		var controller = this;
		
		if (DEBUG) controller.logMessage('Adding background');

		controller.add(
			["name",'background'],
			["image", 
				{
					"left" :0,
					"top":0,
					"width":controller.context.canvas.width/controller.lengthScale,
					"height":controller.context.canvas.height/controller.lengthScale,
					"draw": drawBackground || function(context)
					{
						context.fillStyle = backgroundStyle || creanvas.NodeJsController.DEFAULT_BACKGROUND_COLOUR;
						context.fillRect(0,0,controller.context.canvas.width/controller.lengthScale,controller.context.canvas.height/controller.lengthScale);
					}
				}
			],
			["position", {"z": -Infinity }]
		);
	};
	
	/*
	var drawElements = function()
	{
		if (!controller.isDrawing)
		{						
			controller.isDrawing = true;					
			controller
				.elements
				.sort(function(a,b){return ((a.elementZ || 0) - (b.elementZ || 0));})
				.forEach(function(element)
				{
					draw.call(controller, element);
				});					
			controller.isDrawing = false;
		}
		else
		{
			if (DEBUG) controller.logMessage ("No redraw");
		}
	};*/
	
	/*	var draw = function(element)
	{
		var controller = this;
				
		controller.context.translate(element.elementX*controller.lengthScale, element.elementY*controller.lengthScale);
		controller.context.rotate(element.elementAngle || 0);
		controller.context.scale(element.elementScaleX || 1, element.elementScaleY || 1);
													
		controller.context.drawImage(
			element.temporaryRenderingContext.canvas,
			0, 0, element.widthInPoints, element.heightInPoints,
			element.leftInPoints, element.topInPoints, element.widthInPoints, element.heightInPoints);
		
		controller.context.scale(1/(element.elementScaleX || 1), 1/(element.elementScaleY) || 1);
		controller.context.rotate(- (element.elementAngle || 0));
		controller.context.translate(-element.elementX*controller.lengthScale, - element.elementY*controller.lengthScale);		
		
	};*/

	var startController = function()
	{
		var controller = this;

		setInterval(
			function()
			{
				if (controller.needRedraw && !controller.isDrawing)
				{						
					controller.isDrawing = true;					
					controller
						.elements
						.sort(function(a,b){return ((a.elementZ || 0) - (b.elementZ || 0));})
						.forEach(function(element)
						{
							element.drawMyself();

//							draw.call(controller, element);
						});					
					controller.isDrawing = false;
				}
				else
				{
					if (DEBUG) controller.logMessage ("No redraw");
				}
			},
			controller.refreshTime);	
	};
		
	creanvas.NodeJsController.prototype.logMessage = function(logData){
		if (this.logger)
			this.logger(logData);
		};

	creanvas.NodeJsController.prototype.triggerPointedElementEvent = function(eventId, event)
	{
		var controller = this;
		
		var hit = false;
		this
			.elements
			.filter(function(e){return e.canHandleEvent(eventId);})
			.sort(function(a,b){return (b.elementZ || 0 - a.elementZ || 0);})
			.forEach(
				function(element)
				{						
					if (hit)
						return;
					
					if (element.hit(event.x, event.y))
					{
						// send event to server
						// should hit check be handled there too?
						controller.nodeSocket.emit('dispatchEvent', JSON.stringify({
							"element":element.id, 
							"event":eventId,
							"touchIdentifier":event.touchIdentifier}));
						element.elementEvents.getEvent(eventId).dispatch(event);
						hit = true;
					}
				}
			);
	};

	creanvas.NodeJsController.prototype.triggerElementEventByIdentifier = function(eventId, event)
	{
		this.elements
		.forEach(
			function(element)
			{							
				if (element.touchIdentifier == event.touchIdentifier)
				{
					controller.nodeSocket.emit('dispatchEvent', JSON.stringify({"element":element.id, "event":eventId}));
					element.elementEvents.getEvent(eventId).dispatch(event);
				}
			});
	};
	
	creanvas.NodeJsController.prototype.registerCanvasPointerEvent = function (controlEventId, customEventId)
	{
		var controller = this;
		
		controller.context.canvas.addEventListener(controlEventId,
			function(event)
			{
				setTimeout(function()
				{	
					var triggerEvent = function(clientXY, touchIdentifier)
					{							
						if (DEBUG)
						{
							controller.logMessage("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
						}
						var eventData = controller.getCanvasXYFromClientXY(clientXY);
						eventData.touchIdentifier = touchIdentifier;
						controller.triggerPointedElementEvent(customEventId, eventData);
					};
					
					if (event.changedTouches)
					{
						for(var i=0;i<event.changedTouches.length;i++)
						{
							 triggerEvent(event.changedTouches[i], event.changedTouches[i].identifier);
						}
					}
					else
					{
						triggerEvent(event, -1);
					}
				});
			});
	};
	
	creanvas.NodeJsController.prototype.registerTouchIdentifierEvent = function (controlEventId, customEventId)
	{
		var controller = this;
		
		this.context.canvas.addEventListener(
				controlEventId,
			function(event)
			{
				setTimeout(function()
				{	
					var triggerEvent = function(clientXY, touchIdentifier)
					{							
						if (DEBUG)
						{
							controller.logMessage("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
						}
						var eventData = controller.getCanvasXYFromClientXY(clientXY);
						eventData.touchIdentifier = touchIdentifier;
						controller.triggerElementEventByIdentifier(customEventId, eventData);
					};

					
					if (event.changedTouches)
					{
						for(var i=0;i<event.changedTouches.length;i++)
						{
							controller.nodeSocket.emit('dispatchEvent', JSON.stringify({"touchIdentifier":event.changedTouches[i].identifier, "event":customEventId,
								"x":event.changedTouches[i].x, "y":event.changedTouches[i].y}));
							 triggerEvent(event.changedTouches[i], event.changedTouches[i].identifier);
						}
					}
					else
					{
						controller.nodeSocket.emit('dispatchEvent', JSON.stringify({"touchIdentifier":-1, "event":customEventId , "x":event.x, "y":event.y}));
						triggerEvent(event, -1);
					}
				});
			});
	};
	
	creanvas.NodeJsController.prototype.stopController = function()
	{
		this.elementEvents.getEvent('deactivate').dispatch();
		this.elements = [];
	};

	creanvas.NodeJsController.prototype.triggerRedraw = function()
	{		
		this.needRedraw = true;
	};	

	creanvas.NodeJsController.prototype.getCanvasXYFromClientXY  = function(clientXY)
	{
		var boundings = this.context.canvas.getBoundingClientRect();
		var xy = { 
			x: (clientXY.clientX-boundings.left) * this.context.canvas.width/boundings.width,
			y: (clientXY.clientY-boundings.top) * this.context.canvas.height/boundings.height};
		if (DEBUG) this.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ") - CanvasXY: (" + xy.x + "," + xy.y + ")" );
		return xy;
	};
	
	creanvas.NodeJsController.prototype.addElementDrawing = function(elementType, draw)
	{
		this.drawingMethods.push({elementType:elementType, draw:draw});
	};
	
	
	creanvas.NodeJsController.prototype.add  = function ()
	{
		var controller = this;
		
		if (DEBUG) controller.logMessage("Controller.addElement: Adding element - args:" + arguments.length );

		var args = [].slice.call(arguments);

		var identificationData = args.filter(function(arg){ return arg && arg[0]=="name";})[0] || ["name","Unknown"];
		var imageData = args.filter(function(arg){ return arg && arg[0]=="image";})[0]; // mandatory
		var positionData = args.filter(function(arg){ return arg && arg[0]=="position";})[0]; // mandatory
		
		var element = new CreJs.CreanvasNodeClient.NodeJsElement(controller, identificationData, imageData, positionData);

		element.elementId = controller.elements.length == 0 ? 0 : controller.elements[controller.elements.length-1].elementId + 1;

		controller.nodeSocket.emit('registerElement', JSON.stringify({"id":element.id, "x":element.x, "y":element.y}));

		var decoratorArguments = args.filter(function(arg){ return arg && arg[0]!="name" && arg[0]!="position" && arg[0]!="image";});
		
		if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators)
		{
			if (DEBUG) element.debug('New element',  "apply " + decoratorArguments.length + " decorators");
			
			decoratorArguments.forEach(function(decoratorArgument) {
				controller.nodeSocket.emit('decorate', JSON.stringify(
						{
							"element":element.id,
							"decorator":decoratorArgument[0],
							"arguments":decoratorArgument[1]}));
						});
		}		
		
		controller.elements.push(element);
		
		return element;
	};

	creanvas.NodeJsController.DEFAULT_REFRESH_TIME = 50;
	creanvas.NodeJsController.DEFAULT_BACKGROUND_COLOUR = "#FFF";

	// Export interface 
	creanvas["NodeJsController"] = creanvas.NodeJsController;
	creanvas.NodeJsController.prototype["addElement"] = creanvas.NodeJsController.prototype.add;
	creanvas.NodeJsController.prototype["redraw"] = creanvas.NodeJsController.prototype.triggerRedraw;
	creanvas.NodeJsController.prototype["stop"] = creanvas.NodeJsController.prototype.stopController;
}());
