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
		this.collisionSolver = new CreJs.Creanvas.CollisionSolver(this);
		needRedraw = true;
		isDrawing = false;
		refreshTime = controllerData.refreshTime || 50; // ms	

		
		this.triggerPointedElementEvent = function(eventId, event)
		{
			var hit = false;
			controller.elements
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
			controller.elements
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
			controller.elements = [];
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
	
		controller.elements = [];
		
		this.getCollidableElements = function()
		{
			return controller.elements.filter(function(e){ return e.collidable;});
		};					

		this.addElementWithoutContext  = function (elementData)
		{
			elementData.controller = controller;

			var element = new CreJs.Creanvas.Element(elementData);


			controller.elements.push(element);
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

			
			if (elementData.collidable)
			{
				var tempCollisionCanvas = canvas.ownerDocument.createElement('canvas');			
//				canvas.ownerDocument.body.appendChild(tempCollisionCanvas);
				var tempCollidedCanvas = canvas.ownerDocument.createElement('canvas');			
//				canvas.ownerDocument.body.appendChild(tempCollidedCanvas);
				
				tempCollisionCanvas.width = tempCollidedCanvas.width = elementData.width;
				tempCollisionCanvas.height = tempCollidedCanvas.height = elementData.height;				

				element.collisionContext = tempCollisionCanvas.getContext("2d");				
				element.collisionContext.putImageData(element.image,0,0);
				element.collisionContext.globalCompositeOperation='source-atop';
				element.collisionContext.fillStyle="#000";
				element.collisionContext.fillRect(0,0,elementData.width, elementData.height);
				element.collisionContext.globalCompositeOperation='source-over';

				element.collidedContext = tempCollidedCanvas.getContext("2d");				
				element.collidedContext.putImageData(element.image,0,0);
				element.collidedContext.globalCompositeOperation='source-atop';
				element.collidedContext.fillStyle="#000";
				element.collidedContext.fillRect(0,0,elementData.width, elementData.height);

				var collisionImageOld = element.collisionContext.getImageData(0, 0, elementData.width, elementData.height);
				var collisionImageNew = element.collisionContext.createImageData(elementData.width, elementData.height);
	
				element.edges = [];
				
				for (var imageX=0;imageX<elementData.width; imageX++)
				{
					for (var imageY=0;imageY<elementData.height; imageY++)
					{
						if (collisionImageOld.data[imageY*elementData.width*4 + imageX*4 + 3] < 200)
							continue;
	
						var edge = false;
						
						for (var i=-1;i<2;i++)
						{
							for (var j=-1;j<2;j++)
							{
								if (imageY+i<0 || imageX+j <0 || 
										imageY+i>elementData.height-1 
										|| imageX+i>elementData.width-1 ||
										collisionImageOld.data[((imageY+i)*elementData.width)*4 + (imageX+j)*4 + 3] < 100)
								{
									edge = true;
									i=2;
									j=2;
								}
							}																			
						}
						var fillValue = 255;
						
						element.collisionContext.putImageData(collisionImageNew, 0, 0);

						if (edge)
						{
							element.edges.push({x:imageX, y:imageY});
														
							collisionImageNew.data[((imageY)*elementData.width)*4 + (imageX)*4]=0;
							collisionImageNew.data[((imageY)*elementData.width)*4 + (imageX)*4+1]=0;
							collisionImageNew.data[((imageY)*elementData.width)*4 + (imageX)*4+2]=0;
							collisionImageNew.data[((imageY)*elementData.width)*4 + (imageX)*4+3]=fillValue;
						}
					}
				}
				element.collisionContext.putImageData(collisionImageNew, 0, 0);
			}
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
						//needRedraw = false;
						isDrawing = true;
						
						controller.elements
						.sort(function(a,b){return ((a.z || 0) - (b.z || 0));})
						.forEach(function(element)
						{
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
		
			
	};

}());