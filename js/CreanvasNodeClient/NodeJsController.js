// IN progress
// client side of the controller
// register elements locally, register them on the server
// client controller (here) does the display on request from the server
// client event (mouse) to be send to the server- hit: local? server? TBD

(function(){
	var creanvas = CreJs.CreanvasNodeClient;
	
	creanvas.NodeJsController = function(controllerData) {
		var controller = this;
		controller.refreshTime = controllerData["controller.refreshTime"] || creanvas.NodeJsController.DEFAULT_REFRESH_TIME;
		this.clientToServerBuffering = 50;
		
		var canvas = controllerData["canvas"];
		this.logger = controllerData['log'];		
		this.lengthScale =  controllerData["lengthScale"] ||  canvas.height / controllerData["realHeight"] || canvas.width / controllerData["realWidth"]|| 1;
//		timeScale = controllerData["timeScale"] || 1;
		this.nodeSocket = controllerData["nodeSocket"];				
		this.drawingMethods = [];
		
		var emitBuffer = [];

		this.emitToServer = function (action, actionData, overrideActionKey)
		{
			if (overrideActionKey && emitBuffer.length>0)
			{
				/*var last = emitBuffer[emitBuffer.length-1];
				if (last.overrideActionKey== overrideActionKey)
				{
					last.actionData = actionData;
					return;
				}*/
				var toOverride = emitBuffer.filter(function(e){ return e.overrideActionKey == overrideActionKey;});
				
				if (toOverride.length>0)
				{
//					console.log('overriding before emitting ' + overrideActionKey);
					toOverride.forEach(function(e){ e.actionData = actionData;});
					return;
				}

			}
//			console.log('registering all new emit ' + overrideActionKey);
			emitBuffer.push({action:action, actionData:actionData, overrideActionKey:overrideActionKey});
			
			setTimeout(
					function()
					{
						if (emitBuffer.length == 0)
							return;
						
						emitBuffer.forEach(function(e) {
//							if (DEBUG) controller.logMessage('Emit to server: ' + e.overrideActionKey + '; ' + e.action + ", " + JSON.stringify(e.actionData));
							
							controller.nodeSocket.emit(
								e.action, 
								JSON.stringify(e.actionData));	
							
						emitBuffer = [];
						});
					}
					,controller.clientToServerBuffering);

		};
		
		
		if (DEBUG) this.logMessage('Starting controller');
		
		controller.elements = [];
		controller.context = canvas.getContext("2d");		
		controller.needRedraw = true;
		controller.isDrawing = false;
		
		controller.context.setTransform(1,0,0,1,0,0);
		registerCanvasEvents.call(controller);
		addBackground.call(controller, controllerData["drawBackground"], controllerData["backgroundStyle"]);
		startController.call(controller);
		
		this.nodeSocket.on('update', function(msg){
			var data = JSON.parse(msg);
			
			data.forEach(function(updated){
				var el = controller.elements.filter(function(e){ return e.id == updated.id;})[0];
				el.elementX = updated["x"] || el.elementX;
				el.elementY = updated["y"] || el.elementY;
				el.elementZ = updated["z"] || el.elementZ;
				el.elementAngle = updated["angle"] || el.elementAngle;
			});
			
			needRedraw = true;
		  });	  

		this.nodeSocket.on('addElement', function(msg){
			var data = JSON.parse(msg);

			if (DEBUG) controller.logMessage('Adding element ' + data['drawingMethod'] + ' in (' + data["x"] + ',' + data["y"] + ',' + data["z"] +')');

			var element = controller.add(
					["name",data["name"]],
					["image", {
						"left" :data["left"],
						"top": data['top'],
						"width": data['width'],
						"height": data['height'],
						"draw": controller.drawingMethods.filter(function(e){ return e.drawingMethod == data['drawingMethod'];})[0].draw
					}],
					["position", {"x": data.x, "y": data.y, "z": data.z, "angle":data.angle }]);
			element.id = data.id;
		});
	};
	
	var registerCanvasEvents = function()
	{
		this.registerCanvasPointerEvent('click', 'click');
		this.registerCanvasPointerEvent('mousedown','pointerDown');
		this.registerCanvasPointerEvent('touchstart','pointerDown');
		this.registerCanvasPointerEvent('mousemove','pointerMove');
		this.registerCanvasPointerEvent('touchmove','pointerMove');
		this.registerCanvasPointerEvent('mouseup','pointerUp');
		this.registerCanvasPointerEvent('touchend','pointerUp');
	};		
	
	var addBackground = function(drawBackground, backgroundStyle)
	{
		var controller = this;
		
		if (DEBUG) controller.logMessage('Adding background');

		var background = controller.add(
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
		
		background.id = 0;
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
							element.drawMyself();
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
				
	creanvas.NodeJsController.prototype.triggerElementEvent = function(eventId, event)
	{
		var controller = this;	
		
		var hits = this
			.elements
			.filter(function(e){ return e.hit(event.x, event.y);})
			.sort(function(a,b){return (b.elementZ || 0 - a.elementZ || 0);})
			.map(function(e){ return {id:e.id, z:e.elementZ};});		
		
		controller.emitToServer(
			'pointerEvent', 
			{
				"eventId":eventId, 
				"x":event.x,
				"y":event.y,
				"touchIdentifier":event.touchIdentifier,
				"hits": hits
			},
			eventId + ':' + event.touchIdentifier + hits.join());
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
						var eventData = controller.getRealXYFromClientXY(clientXY);
						eventData.touchIdentifier = touchIdentifier;
						controller.triggerElementEvent.call(controller, customEventId, eventData);						
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

	creanvas.NodeJsController.prototype.getRealXYFromClientXY  = function(clientXY)
	{
		var boundings = this.context.canvas.getBoundingClientRect();
		
		var xy = { 
			x: (clientXY.clientX-boundings.left) * this.context.canvas.width/boundings.width / this.lengthScale,
			y: (clientXY.clientY-boundings.top) * this.context.canvas.height/boundings.height /  this.lengthScale};
		
		if (DEBUG) this.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ") - RealXY: (" + xy.x + "," + xy.y + ")" );
		return xy;
	};
	
	creanvas.NodeJsController.prototype.addElementDrawing = function(drawingMethod, draw)
	{
		this.drawingMethods.push({drawingMethod:drawingMethod, draw:draw});
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
		
		controller.elements.push(element);
		
		return element;
	};

	creanvas.NodeJsController.DEFAULT_REFRESH_TIME = 50;
	creanvas.NodeJsController.DEFAULT_BACKGROUND_COLOUR = "#FFF";

	// Export interface 
	creanvas["NodeJsController"] = creanvas.NodeJsController;
	creanvas.NodeJsController.prototype["addElementDrawing"] = creanvas.NodeJsController.prototype.addElementDrawing;
	creanvas.NodeJsController.prototype["startApplication"] = creanvas.NodeJsController.prototype.startApplication;
}());
