// Clean code... again

// Collision between elements. Can be checkec on worker, xoring a 1/0 image
//Decorator: selfMoving, Solid(collision), Massive (mass, gravity)

// is Hit through image correct.
// collision?

var a;

var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
		
	CreJs.Creanvas.Controller = function(controllerData) {
		var canvas, needRedraw, refreshTime, controller;

		var time;
		var timeStart;
		var timeScale = controllerData.timeScale || 1;

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
		
		controller = this;
		canvas = controllerData.canvas;

		var collisionCanvas = canvas.ownerDocument.createElement('canvas');		
		//canvas.ownerDocument.body.appendChild(collisionCanvas);
		collisionCanvas.width = canvas.width;
		collisionCanvas.height = canvas.height;
		collisionContext = collisionCanvas.getContext("2d");
		
		this.log = function(logData){			
			if (controllerData.log)
				controllerData.log(logData);
		};

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
			this.log("HeavyLoad: " + message);
		};
		
		this.sendMessage = function(message)
		{
			asynchronousController.receiveMessage(message);
		};
	
		
		this.sendMessage("Test heavy load");
		
			
		this.log('Starting controller');

	
		controller.context = canvas.getContext("2d");	
		needRedraw = true;
		isDrawing = false;
		refreshTime = controllerData.refreshTime || 50; // ms	

		
		this.triggerPointedElementEvent = function(eventId, event)
		{
			var hit = false;
			elements
			.filter(function(e){return e.canHandle(eventId);})
			.sort(function(a,b){return (b.z || 0 - a.z || 0);})
			.forEach(
					function(element)
					{
						
						if (hit)
							return;
						
						if (element.hit(event.x, event.y))
						{
							element.events.dispatch(eventId, event);
							hit = true;
						}
					}
				);
		};

		this.triggerElementEventByIdentifier = function(eventId, event)
		{
			elements
			.forEach(
					function(element)
					{							
						if (element.touchIdentifier == event.touchIdentifier)
						{
							element.events.dispatch(eventId, event);
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
							controller.log("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
							var eventData = controller.getCanvasXYFromClientXY(clientXY);
							eventData.touchIdentifier = touchIdentifier;
							controller.triggerPointedElementEvent(customEventId, eventData);
						}
						
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
							controller.log("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
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
		
		this.events = new CreJs.Creevents.EventContainer();		
		this.registerCanvasPointerEvent('click', 'click');
		// create two handlers... wrong

		this.registerCanvasPointerEvent('mousedown','pointerDown');
		this.registerCanvasPointerEvent('touchstart','pointerDown');

		this.registerTouchIdentifierEvent('mousemove','pointerMove');
		this.registerTouchIdentifierEvent('touchmove','pointerMove');

		this.registerTouchIdentifierEvent('mouseup','pointerUp');
		this.registerTouchIdentifierEvent('touchend','pointerUp');
				
		this.stop = function()
		{
			controller.events.dispatch('deactivate');
			elements = [];
		};
	
		this.redraw = function()
		{
			needRedraw = true;
		};	
	
		this.getCanvasXYFromClientXY  = function(clientXY)
		{
			// what about rotations here?
			var boundings = canvas.getBoundingClientRect();
			return { 
				x: Math.round((clientXY.clientX-boundings.left) * canvas.width/boundings.width),
				y: Math.round((clientXY.clientY-boundings.top) * canvas.height/boundings.height)};		
		};
	
		var elements = [];

		this.addElementWithoutContext  = function (elementData)
		{
			elementData.controller = controller;

			var element = new CreJs.Creanvas.Element(elementData);


			elements.push(element);
			return element;
			
		};

		this.addElement  = function (elementData)
		{
			var element = this.addElementWithoutContext(elementData);

			var tempCanvas = canvas.ownerDocument.createElement('canvas');			
			tempCanvas.width = elementData.width;
			tempCanvas.height = elementData.height;
			element.temporaryRenderingContext = tempCanvas.getContext("2d");
			element.temporaryRenderingContext.beginPath();
			
			element.temporaryRenderingContext.translate(element.dx, element.dy);
			elementData.draw(element.temporaryRenderingContext);
			// several image:store them here with offset
			element.image = element.temporaryRenderingContext.getImageData(0, 0, elementData.width, elementData.height);

			return element;
		};
			
		//background
		this.addElement({
			name:'background',
			width:canvas.width,
			height:canvas.height,
			translate:{dx:0, dy:0},
			draw: 
				controllerData.drawBackground ||  
				function (context) 
				{
					context.fillStyle = controllerData.backgroundStyle || "#FFF";
					context.fillRect(0,0,this.width,this.height);
				},
			z: -Infinity});
		
		setInterval(
				function()
				{
					if (needRedraw && !isDrawing)
					{						
						needRedraw = false;
						isDrawing = true;
						
						elements
						.sort(function(a,b){return ((a.z || 0) - (b.z || 0));})
						.forEach(function(element)
						{
							//controller.log('rendering ' + element.name + ' (' + element.z+ ')');

							controller.context.translate(element.x, element.y);
							controller.context.rotate(element.angle || 0);
							controller.context.scale(element.scaleX || 1, element.scaleY || 1);
							controller.context.drawImage(
									element.temporaryRenderingContext.canvas,
									0, 0, element.width, element.height,
									-element.dx, -element.dy, element.width, element.height);	//width height will be transformed!				
							controller.context.scale(1/(element.scaleX || 1), 1/(element.scaleY) || 1);
							controller.context.rotate(- (element.angle || 0));
							controller.context.translate(-element.x, - element.y);
						});
					
						isDrawing = false;
												
					}
				},
				refreshTime);
		
		// check collision
		setInterval(			
				function()
				 {
					var toCheck = elements.filter(function(e){ return e.collidable;});					
																	
					toCheck.sort(function(a,b){ return a.id<b.id;}).forEach(
						function(element)
						{
							
							var rect1 = element.getClientRect();
							

							var others = toCheck.filter(function(other){ return (other.id>element.id && (other.vx || other.vy  || element.vx  || element.vy));});
							
							if (others.length==0)
								return;
							
							others.forEach(
								function(other)
								{
									var rect2 = other.getClientRect();
									
									var left = Math.max(rect1.left, rect2.left);
									var right = Math.min(rect1.right, rect2.right);
									var top = Math.max(rect1.top, rect2.top);
									var bottom = Math.min(rect1.bottom, rect2.bottom);
										
									if (bottom<=top || right<=left)
										return;

									collisionContext.globalCompositeOperation='source-over';
								//	collisionContext.clearRect(0,0,canvas.width,canvas.height);

									
									collisionContext.clearRect(left,top,right-left,bottom-top);
									
									/*
									collisionContext.strokeStyle="#F00";
									collisionContext.beginPath();
									collisionContext.moveTo(left-2,top-2);
									collisionContext.lineTo(right+2,top-2);
									collisionContext.lineTo(right+2,bottom+2);
									collisionContext.lineTo(left-2,bottom+2);
									collisionContext.closePath();
									collisionContext.stroke();
									*/
									collisionContext.translate(other.x, other.y);
									collisionContext.rotate(other.angle || 0);
									collisionContext.scale(other.scaleX || 1, other.scaleY || 1);
									collisionContext.drawImage(
										other.temporaryRenderingContext.canvas,
										0, 0, other.width, other.height,
										-other.dx, -other.dy, other.width, other.height);		
									collisionContext.scale(1/(other.scaleX || 1), 1/(other.scaleY) || 1);
									collisionContext.rotate(- (other.angle || 0));
									collisionContext.translate(-other.x, - other.y);						
									
									// save this image
									var imageDataBefore = collisionContext.getImageData(left,top,right-left,bottom-top).data;
									
									collisionContext.translate(element.x, element.y);
									collisionContext.rotate(element.angle || 0);
									collisionContext.scale(element.scaleX || 1, element.scaleY || 1);
									collisionContext.globalCompositeOperation='destination-out';
									collisionContext.drawImage(
											element.temporaryRenderingContext.canvas,
											0, 0, element.width, element.height,
											-element.dx, -element.dy, element.width, element.height);
								
									collisionContext.scale(1/(element.scaleX || 1), 1/(element.scaleY) || 1);
									collisionContext.rotate(- (element.angle || 0));
									collisionContext.translate(-element.x, - element.y);	
									collisionContext.globalCompositeOperation='source-over';
			
									var imageDataAfter = collisionContext.getImageData(left,top,right-left,bottom-top).data;

									var Xs=[];
									var Ys=[];
									for (var imageX=0;imageX<right-left; imageX++)
									{
										for (var imageY=0;imageY<bottom-top; imageY++)
										{
											// check alpha only
											if (imageDataBefore[imageY*(right-left)*4 + imageX*4 + 3] != imageDataAfter[imageY*(right-left)*4 + imageX*4 + 3])
											{
												Xs.push(imageX);
												Ys.push(imageY);
											}
										}
									}
									
									if (Xs.length == 0)
										return;
									
									// average... need more, the shape is important to find the exact consequence
									var imageX = Xs.reduce(function(sum, x){ return sum + x;}) / Xs.length;
									var imageY = Ys.reduce(function(sum, y){ return sum + y;}) / Ys.length;
									
									element.events.dispatch('collision', {element:other, contactPoint:{x:left+imageX,y:top+imageY}});
									
									other.events.dispatch('collision', {element:element, contactPoint:{x:left+imageX,y:top+imageY}});
								});
							
					 		});
			}
		,80);				
		
			
	
	};
}());