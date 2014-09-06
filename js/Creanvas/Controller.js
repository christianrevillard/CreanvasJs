(function(){
	CreJs.Creanvas.Controller = function(controllerData) {
		var 
			canvas, 
			needRedraw, 
			refreshTime, 
			controller,
			time,
			timeStart,
			timeScale, // timeCreanvas/timeComputer 100 => every seconds on computer is 100 seconds in Creanvas
			meterPerPoint; // distanceCreanvas/RealDistance 1 => every point on canvas is 1 meter.
		controller = this;
		canvas = controllerData["canvas"];
		timeScale = controllerData["timeScale"] || 1;
		meterPerPoint = controllerData["meterPerPoint"] || 1;
		
		if (controllerData.realTime)
		{	
			timeStart = Date.now();
			this.getTime = function(){return (Date.now() - timeStart) * timeScale; };					
		}
		else
		{
			time=0;
			setInterval(
					function(){
						time+=10*timeScale;
					},
					10);
			this.getTime = function(){return time;};
		}
		
		this.logMessage = function(logData){
			if (controllerData['log'])
				controllerData['log'](logData);
		};
				
		/* Not used for the moment
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
					*/
		if (DEBUG) this.logMessage('Starting controller');
		
		controller.context = canvas.getContext("2d");
		controller.context.setTransform(1,0,0,1,0,0);
		controller.context.scale(1/meterPerPoint, 1/meterPerPoint);
		needRedraw = true;
		isDrawing = false;
		refreshTime = controllerData["refreshTime"] || 50; // ms	- TODO constant default refresh time
		
		this.triggerPointedElementEvent = function(eventId, event)
		{
			var hit = false;
			controller.elements
			.filter(function(e){return e.canHandle(eventId);})
			.sort(function(a,b){return (b.elementZ || 0 - a.elementZ || 0);})
			.forEach(
					function(element)
					{
						
						if (hit)
							return;
						
						if (element.hit(event.x, event.y))
						{
							element.elementEvents.dispatch(eventId, event);
							hit = true;
						}
					}
				);
		};

		this.triggerElementEventByIdentifier = function(eventId, event)
		{
			controller.elements
			.forEach(
					function(element)
					{							
						if (element.touchIdentifier == event.touchIdentifier)
						{
							element.elementEvents.dispatch(eventId, event);
						}
					}
				);
		};
		
		this.registerCanvasPointerEvent = function (controlEventId, customEventId)
		{
			canvas.addEventListener(controlEventId,
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
		
		this.registerTouchIdentifierEvent = function (controlEventId, customEventId)
		{
			canvas.addEventListener(
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
		
		this.elementEvents = new CreJs.Creevents.EventContainer();		
		this.registerCanvasPointerEvent('click', 'click');

		this.registerCanvasPointerEvent('mousedown','pointerDown');
		this.registerCanvasPointerEvent('touchstart','pointerDown');

		this.registerTouchIdentifierEvent('mousemove','pointerMove');
		this.registerTouchIdentifierEvent('touchmove','pointerMove');

		this.registerTouchIdentifierEvent('mouseup','pointerUp');
		this.registerTouchIdentifierEvent('touchend','pointerUp');
				
		this.stopController = function()
		{
			controller.elementEvents.dispatch('deactivate');
			controller.elements = [];
		};
	
		this.triggerRedraw = function()
		{		
			needRedraw = true;
		};	
	
		this.getCanvasXYFromClientXY  = function(clientXY)
		{
			// what about rotations here?
			var boundings = canvas.getBoundingClientRect();
			controller.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ")" );
			var xy = { 
				x: Math.round((clientXY.clientX-boundings.left) * canvas.width/boundings.width * meterPerPoint),
				y: Math.round((clientXY.clientY-boundings.top) * canvas.height/boundings.height * meterPerPoint)};
			controller.logMessage("canvasXY: (" + xy.x + "," + xy.y + ")" );
			if (clientXY.type=="click")
				{
				controller.logMessage("Click on ! canvasXY: (" + xy.x + "," + xy.y + ")" );
				
				}

			return xy;
		};
	
		controller.elements = [];
		
		this.add  = function ()
		{
			if (DEBUG)
			{
				controller.logMessage("Controller.addElement: Adding element - args:" + arguments.length );
			}
			var args = [].slice.call(arguments);

			var identificationData = args.filter(function(arg){ return arg && arg[0]=="name";})[0] || ["name","Unknown"];
			var imageData = args.filter(function(arg){ return arg && arg[0]=="image";})[0]; // mandatory
			var positionData = args.filter(function(arg){ return arg && arg[0]=="position";})[0]; // mandatory
			
			var element = new CreJs.Creanvas.Element(controller, identificationData, imageData, positionData);

			var decoratorArguments = args.filter(function(arg){ return arg && arg[0]!="name" && arg[0]!="position" && arg[0]!="image";});
			
			if (decoratorArguments.length > 0 && CreJs.Creanvas.elementDecorators)
			{
				if (DEBUG) element.debug('New element',  "apply " + decoratorArguments.length + " decorators");
				element.applyElementDecorators.apply(element, decoratorArguments);
			}
			
			controller.elements.push(element);
			
			return element;
		};
			
		//background
		controller.logMessage('Adding background');
		this.add(
			["name",'background'],
			["image", 
				{
					"width":canvas.width,
					"height":canvas.height,
					"translate":{"dx":0, "dy":0},
					"draw": 
						controllerData["drawBackground"] ||  
						function (context) 
						{
							context.fillStyle = controllerData["backgroundStyle"] || "#FFF";
							context.fillRect(0,0,this.elementWidth,this.elementHeight);
						}				
				}
			],
			["position", 
			 	{
					"z": -Infinity	
				}
			]);
		
		setInterval(
				function()
				{
					if (needRedraw && !isDrawing)
					{						
						//needRedraw = false;
						isDrawing = true;
						
						controller.elements
						.sort(function(a,b){return ((a.elementZ || 0) - (b.elementZ || 0));})
						.forEach(function(element)
						{
//							controller.logMessage ("Redraw " + element.elementName + "/" + element.elementId);
							
							controller.context.translate(element.elementX, element.elementY);
							controller.context.rotate(element.elementAngle || 0);
							controller.context.scale(element.elementScaleX || 1, element.elementScaleY || 1);
																		
							controller.context.drawImage(
									element.temporaryRenderingContext.canvas,
									0, 0, element.elementWidth, element.elementHeight,
									-element.dx, -element.dy, element.elementWidth, element.elementHeight);
							
							controller.context.scale(1/(element.elementScaleX || 1), 1/(element.elementScaleY) || 1);
							controller.context.rotate(- (element.elementAngle || 0));
							controller.context.translate(-element.elementX, - element.elementY);
						});
					
						isDrawing = false;
												
					}
					else
					{
						controller.logMessage ("No redraw");
					}
				},
				refreshTime);	
				
		this["addElement"] = this.add;
		this["redraw"] = this.triggerRedraw;
		this["stop"] = this.stopController;
	};

	// Available after ADVANCED_OPTIMIZATION 
	CreJs.Creanvas["Controller"] = CreJs.Creanvas.Controller;
}());
