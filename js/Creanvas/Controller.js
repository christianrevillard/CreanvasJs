var Creanvas = Creanvas || {};		

Creanvas.Controller = function(canvasData) {
	var canvas, needRedraw, refreshTime, controller, events;

	var isStopped = false;
	
	this.stop = function()
	{
		isStopped = true;
	};
	
	controller = this;

	canvas = canvasData.canvas;
	this.context = canvas.getContext("2d");	
	needRedraw = true;	
	refreshTime = canvasData.refreshTime || 50; // ms	

	events = new Creevents.EventContainer();			
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
		
	this.redraw = function()
	{
		if (!isStopped)
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
		events.register(eventId, eventHandler, rank);
	};

	this.removeEventListener = function(eventId, eventHandle)
	{
		events.cancel(eventId, eventHandle);
	};

//	controller.context.transform(1,0,0.1,1,0,0);
//	controller.context.rotate(Math.PI/4);

	setInterval(
			function()
			{
				if (needRedraw)
					{
						needRedraw = false;
						events.dispatch('draw');
					}
			},
			refreshTime);

	var background = new Creanvas.Element(
	{
		controller: controller,
		draw: 
			canvasData.drawBackground ||  
			function (context) 
			{
				context.fillStyle = canvasData.backgroundColor || "#FFF";
				context.fillRect(0,0,canvas.width,canvas.height);
			},
		z: -Infinity});
	
	this.dispatchEvent = function(id, eventData)
	{
		events.dispatch(id, eventData);
	};
};
