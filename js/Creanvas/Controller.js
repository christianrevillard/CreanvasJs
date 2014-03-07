var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.Controller = function(controllerData) {
	var canvas, needRedraw, refreshTime, controller, events;

	controller = this;

	canvas = controllerData.canvas;
	controller.context = canvas.getContext("2d");	
	needRedraw = true;	
	isStopping = false;
	refreshTime = controllerData.refreshTime || 50; // ms	

	events = new CreJs.Creevents.EventContainer();			
	events.addEvent('deactivate');
	events.addEvent('draw');
	events.addEvent('drop');
	events.addEvent('drag');
	events.addEvent('dropped');
	events.registerControlEvent(canvas, 'click');
	events.registerControlEvent(canvas, 'mousedown');
	events.registerControlEvent(canvas, 'mouseup');
	events.registerControlEvent(canvas, 'mousemove');
	events.registerControlEvent(canvas, 'touchstart');
	events.registerControlEvent(canvas, 'touchend');
	events.registerControlEvent(canvas, 'touchmove');
			
	this.stop = function()
	{
		events.dispatch('deactivate');
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

	this.addEventListener = function(eventId, eventHandler, rank)
	{
		return events.register(eventId, eventHandler, rank);
	};

	this.removeEventListener = function(eventId, eventHandle)
	{
		events.cancel(eventId, eventHandle);
	};

	this.addElement  = function (elementData)
	{
		elementData.controller = controller;

		var element = new CreJs.Creanvas.Element(elementData);
								
		return element;
	};
		
	this.dispatchEvent = function(id, eventData)
	{
		events.dispatch(id, eventData);
	};
	
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
					events.dispatch('draw');
				}
			},
			refreshTime);
};