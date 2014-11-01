(function(){
	var creanvas = CreJs.Creanvas;
	
	creanvas.Controller = function(controllerData) {
		var controller = this;
				
		var canvas = controllerData["canvas"];
		this.logger = controllerData['log'];		
		this.lengthScale =  controllerData["lengthScale"] ||  canvas.height / controllerData["realHeight"] || canvas.width / controllerData["realWidth"]|| 1;
		timeScale = controllerData["timeScale"] || 1;
		
		/*if (controllerData.realTime) { var timeStart = Date.now(); this.getTime = function(){return (Date.now() - timeStart) * timeScale / 1000 ; };} else {*/
		var time=0; // seconds
		setInterval(
			function(){ time+=10*timeScale/1000;},    
			10);
		this.getTime = function(){return time;};
		//}
		
		// startHeavyLoadController();
				
		if (DEBUG) this.logMessage('Starting controller');
		
		controller.needRedraw = true;
		controller.isDrawing = false;
		controller.refreshTime = controllerData["controller.refreshTime"] || creanvas.Controller.DEFAULT_REFRESH_TIME;
		controller.elements = [];
		controller.elementEvents = new CreJs.Creevents.EventContainer();		
		controller.context = canvas.getContext("2d");		
		
		controller.context.setTransform(1,0,0,1,0,0);
		registerCanvasEvents.call(controller);
		addBackground.call(controller, controllerData["drawBackground"], controllerData["backgroundStyle"]);
		startController.call(controller);
	};
	
	/* Not used for the moment
	var startHeavyLoadController = function()
	{
		var controller = this;
		//for heavy load stuff that can be handled by a worker / WebSocket
		var asynchronousController;
		if (window.Worker && (!controllerData.noWorker))
		{			
			asynchronousController = {};
			asynchronousController.worker = new Worker("js/Creanvas/AsynchronousControllerWorker.js");
			asynchronousController.receiveMessage = function(message){ asynchronousController.worker.postMessage(message);};
			asynchronousController.worker.onmessage = function(e){ asynchronousController.sendMessage(e.data);};
			asynchronousController.sendMessage = function(message) { controller.receiveMessage(message);};
		}
		else
		{
			// fall back to synchronous calls
			asynchronousController = new CreJs.Creanvas.HeavyLoadController();
			asynchronousController.sendMessage = function(message){ controller.receiveMessage(message);};
		}
		
		this.receiveMessage = function(message)
		{
			this.logMessage("HeavyLoad: " + message);
		};
		
		this.sendMessage = function(message)
		{
			asynchronousController.receiveMessage(message);
		};
			
		this.sendMessage("Test heavy load");
					
	};*/
	
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
						context.fillStyle = backgroundStyle || creanvas.Controller.DEFAULT_BACKGROUND_COLOUR;
						context.fillRect(0,0,controller.context.canvas.width/controller.lengthScale,controller.context.canvas.height/controller.lengthScale);
					}
				}
			],
			["position", {"z": -Infinity }]
		);
	};
	
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
							draw.call(controller, element);
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
	
	var draw = function(element)
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
	};
		
	creanvas.Controller.prototype.logMessage = function(logData){
		if (this.logger)
			this.logger(logData);
		};

	creanvas.Controller.prototype.triggerPointedElementEvent = function(eventId, event)
	{
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
						element.elementEvents.getEvent(eventId).dispatch(event);
						hit = true;
					}
				}
			);
	};

	creanvas.Controller.prototype.triggerElementEventByIdentifier = function(eventId, event)
	{
		this.elements
		.forEach(
			function(element)
			{							
				if (element.touchIdentifier == event.touchIdentifier)
				{
					element.elementEvents.getEvent(eventId).dispatch(event);
				}
			});
	};
	
	creanvas.Controller.prototype.registerCanvasPointerEvent = function (controlEventId, customEventId)
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
						var eventData = controller.getWebappXYFromClientXY(clientXY);
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
	
	creanvas.Controller.prototype.registerTouchIdentifierEvent = function (controlEventId, customEventId)
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
						var eventData = controller.getWebappXYFromClientXY(clientXY);
						eventData.touchIdentifier = touchIdentifier;
						controller.triggerElementEventByIdentifier(customEventId, eventData);
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
	
	creanvas.Controller.prototype.stopController = function()
	{
		this.elementEvents.getEvent('deactivate').dispatch();
		this.elements = [];
	};

	creanvas.Controller.prototype.triggerRedraw = function()
	{		
		this.needRedraw = true;
	};	

	creanvas.Controller.prototype.getWebappXYFromClientXY  = function(clientXY)
	{
		var boundings = this.context.canvas.getBoundingClientRect();
		var xy = { 
			x: (clientXY.clientX-boundings.left) * this.context.canvas.width/boundings.width/this.lengthScale,
			y: (clientXY.clientY-boundings.top) * this.context.canvas.height/boundings.height/this.lengthScale};
		if (DEBUG) this.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ") - WebAppXY: (" + xy.x + "," + xy.y + ")" );
		return xy;
	};

	creanvas.Controller.prototype.add = function ()
	{
		var controller = this;
		
		if (DEBUG) controller.logMessage("Controller.addElement: Adding element - args:" + arguments.length );

		var args = [].slice.call(arguments);

		var identificationData = args.filter(function(arg){ return arg && arg[0]=="name";})[0] || ["name","Unknown"];
		var imageData = args.filter(function(arg){ return arg && arg[0]=="image";})[0]; // mandatory
		var positionData = args.filter(function(arg){ return arg && arg[0]=="position";})[0]; // mandatory
		
		var element = new CreJs.Creanvas.Element(controller, identificationData, imageData, positionData);

		element.elementId = controller.elements.length == 0 ? 0 : controller.elements[controller.elements.length-1].elementId + 1;
		
		var decoratorArguments = args.filter(function(arg){ return arg && arg[0]!="name" && arg[0]!="position" && arg[0]!="image";});
		
		if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators)
		{
			if (DEBUG) element.debug('New element',  "apply " + decoratorArguments.length + " decorators");
			element.applyElementDecorators.apply(element, decoratorArguments);
		}
		
		controller.elements.push(element);
		
		return element;
	};

	creanvas.Controller.DEFAULT_REFRESH_TIME = 50;
	creanvas.Controller.DEFAULT_BACKGROUND_COLOUR = "#FFF";

	// Export interface 
	creanvas["Controller"] = creanvas.Controller;
	creanvas.Controller.prototype["addElement"] = creanvas.Controller.prototype.add;
	creanvas.Controller.prototype["redraw"] = creanvas.Controller.prototype.triggerRedraw;
	creanvas.Controller.prototype["stop"] = creanvas.Controller.prototype.stopController;
}());
