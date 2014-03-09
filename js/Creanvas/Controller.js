var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	

	
	
	CreJs.Creanvas.NoDrawContext = function(context)
	{
		var noDrawContext = this;
		var isInPath = false;
		var canvasXY = null;
		
		// does not matter we do not draw!
		this.lineWidth = 0;
		this.lineCap= 0;
		this.fillStyle = 0;
		this.strokeStyle = 0;
		this.createRadialGradient = function() { return context.createLinearGradient(0,0,0,0);};
		this.createLinearGradient = function() { return context.createLinearGradient(0,0,0,0);};

		// moving is what it is all about
		this.moveTo  = function(a1,a2)  { return context.moveTo(a1, a2);};
		this.lineTo  = function(a1,a2)  { return context.lineTo(a1, a2);};
		this.bezierCurveTo = function(a1,a2,a3,a4,a5,a6) { return context.bezierCurveTo(a1,a2,a3,a4,a5,a6);};
		this.arc = function(a1,a2,a3,a4,a5) { return context.arc(a1,a2,a3,a4,a5);};
		this.closePath = function() { context.closePath();}
		
		// stop all actual drawing
		this.stroke = function(){};
		this.fill = function(){};
		this.fillRect = function(){};
		
		this.beginPath = function()
		{
			// we want to trigger if in a subpath too!
			isInPath = isInPath || context.isPointInPath(canvasXY.x, canvasXY.y);
			context.beginPath();
		};
		
		this.isPointInPath = function(element, draw, e){
			canvasXY = e;
			context.beginPath();
			isInPath = false;
			draw.call(element,noDrawContext);
			noDrawContext.beginPath();
			return isInPath;
		};
	};
	
	CreJs.Creanvas.Controller = function(controllerData) {
		var canvas, needRedraw, refreshTime, controller;

		this.log = controllerData.log;
		
		this.log('Starting controller');

		controller = this;
	
		canvas = controllerData.canvas;
		controller.context = canvas.getContext("2d");	
		controller.noDrawContext = new CreJs.Creanvas.NoDrawContext(controller.context);
		needRedraw = true;	
		isStopping = false;
		refreshTime = controllerData.refreshTime || 50; // ms	
	
		this.events = new CreJs.Creevents.EventContainer();		
		this.events.registerControlEvent(canvas, 'click', 'click');
		this.events.registerControlEvent(canvas, 'mousedown','pointerDown');
		this.events.registerControlEvent(canvas, 'mouseup','pointerUp');
		this.events.registerControlEvent(canvas, 'mousemove','pointerMove');
		this.events.registerControlEvent(canvas, 'touchstart','pointerDown');
		this.events.registerControlEvent(canvas, 'touchend','pointerUp');
		this.events.registerControlEvent(canvas, 'touchmove','pointerMove');
				
		this.stop = function()
		{
			controller.events.dispatch('deactivate');
		};
	
		this.redraw = function()
		{
			needRedraw = true;
		};	
	
		this.getCanvasXYFromClientXY  = function(clientXY)
		{
			var boundings = canvas.getBoundingClientRect();
			return { 
				x: (clientXY.clientX-boundings.left) * canvas.width/boundings.width,
				y: (clientXY.clientY-boundings.top) * canvas.height/boundings.height};		
		};
	
	/*	this.addEventListener = function(eventId, eventHandler, rank)
		{
			return events.register(eventId, eventHandler, rank);
		};
	
		this.removeEventListener = function(eventId, eventHandle)
		{
			events.cancel(eventId, eventHandle);
		};
	*/
		this.addElement  = function (elementData)
		{
			elementData.controller = controller;
	
			var element = new CreJs.Creanvas.Element(elementData);
							
			return element;
		};
			
	/*	this.dispatchEvent = function(id, eventData)
		{
			events.dispatch(id, eventData);
		};
		*/
		//background
		this.addElement({
			draw: 
				controllerData.drawBackground ||  
				function (context) 
				{
					context.fillStyle = controllerData.backgroundStyle || "#FFF";
					context.fillRect(0,0,canvas.width,canvas.height);
				},
			z: -Infinity});
	
		setInterval(
				function()
				{
					// check events
					if (needRedraw)
					{
						needRedraw = false;
						controller.events.dispatch('draw');
					}
				},
				refreshTime);
	};
}());