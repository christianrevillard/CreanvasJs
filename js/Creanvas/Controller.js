var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.Controller = function(controllerData) {
	var canvas, needRedraw, refreshTime, controller;

	controller = this;

	canvas = controllerData.canvas;
	controller.context = canvas.getContext("2d");	
	needRedraw = true;	
	isStopping = false;
	refreshTime = controllerData.refreshTime || 50; // ms	

	this.events = new CreJs.Creevents.EventContainer();			
/*	events.addEvent('deactivate');
	events.addEvent('draw');
	events.addEvent('drop');
	events.addEvent('drag');
	events.addEvent('dropped');*/
	this.events.registerControlEvent(canvas, 'click');
	this.events.registerControlEvent(canvas, 'mousedown');
	this.events.registerControlEvent(canvas, 'mouseup');
	this.events.registerControlEvent(canvas, 'mousemove');
	this.events.registerControlEvent(canvas, 'touchstart');
	this.events.registerControlEvent(canvas, 'touchend');
	this.events.registerControlEvent(canvas, 'touchmove');
			
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
