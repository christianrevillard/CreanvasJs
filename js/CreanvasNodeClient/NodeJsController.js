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

		this.nodeSocket.on('textMessage', function(msg){		
			var data = JSON.parse(msg);
			if (controller.onTextMessage)
			{
				controller.onTextMessage(data);
			}			
		}); 	

		this.nodeSocket.on('updateClientElements', function(msg){
			var data = JSON.parse(msg);
			
			data.updates.forEach(function(updated){
				var els = controller.elements.filter(function(e){ return e.id == updated.id;});
				
				if (els.length>0) { 
					// updates			
					var el = els[0];
					el.elementX = updated["x"] || el.elementX;
					el.elementY = updated["y"] || el.elementY;
					el.elementZ = updated["z"] || el.elementZ;
					el.elementScaleX = updated["scaleX"] || el.elementScaleX;
					el.elementScaleY = updated["scaleY"] || el.elementScaleY;
					el.elementAngle = updated["angle"] || el.elementAngle;
				}
				else {
					//inserts
					if (DEBUG) controller.logMessage('Adding element ' + updated['drawingMethod'] + ' in (' + updated["x"] + ',' + updated["y"] + ',' + updated["z"] +')');
	
					var drawingMethod = controller.drawingMethods.filter(function(e){ return e.drawingMethod == updated['drawingMethod'];})[0];
					
					var element = controller.add(
							["name",updated["name"]],
							["image", {
								"edges" :drawingMethod.edges,
								"draw": drawingMethod.draw
							}],
							["position", {"x": updated["x"], "y": updated["y"], "z": updated["z"], "angle":updated["angle"]}]);
					element.id = updated.id;
				}
			});

			data.deletes.forEach(function(deleted){
				controller.removeElementById(deleted.id);
			});

			needRedraw = true;
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
					//"left" :0,
					//"top":0,
					//"width":controller.context.canvas.width/controller.lengthScale,
					//"height":controller.context.canvas.height/controller.lengthScale,
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

					if (controller.displayMessage)
					{
						controller.displayMessage(controller.context);
					}					

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
	
	creanvas.NodeJsController.prototype.getEdges = function(draw, left, width, top, height)
	{
		var controller = this;
		var edges = [];
		
		var stuff = 50;	// can be overriden if needed for complex figures	
		
		// draw in a 50/50 points matrix
		var tempCanvas = controller.context.canvas.ownerDocument.createElement('canvas');
		var temporaryRenderingContext = tempCanvas.getContext("2d");
//		element.controller.context.canvas.ownerDocument.body.appendChild(tempCanvas);

		
		tempCanvas.width = stuff;
		tempCanvas.height = stuff;

		temporaryRenderingContext.beginPath();
		temporaryRenderingContext.translate(-stuff*left/width, -stuff*top/height);
		temporaryRenderingContext.scale(stuff / width, stuff / height);
		draw(temporaryRenderingContext);
		
		var stuffImage = temporaryRenderingContext.getImageData(0, 0, stuff, stuff);
		
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
			
			edges.push({
				x: (x + dx)*width/stuff + left,
				y: (y + dy)*height/stuff + top}); 

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
		
		return edges;
	};
		
	creanvas.NodeJsController.prototype.addElementDrawing = function(drawingMethod, draw, boxData)
	{
		
		// support height/width; left/width|left/right+top/height|top/bottom
		var width = boxData["width"];
		var height = boxData["height"];

		var top = boxData["top"] == 0 ? 0 : boxData["top"] || (-height / 2);
		var left = boxData["left"] == 0 ? 0 : boxData["left"] || (-width / 2);
		var bottom = boxData["bottom"] == 0 ? 0 : boxData["bottom"] || (top + height);
		var right = boxData["right"] == 0 ? 0 : boxData["right"]|| (left + width);
		width = width || (right - left);
		height = height || (bottom - top);
		
		// compute edges
		var edges = this.getEdges(draw, left, width, top, height);
		
		this.drawingMethods.push({drawingMethod:drawingMethod, draw:draw, edges:edges});
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
