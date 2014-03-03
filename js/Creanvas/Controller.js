var Creanvas = Creanvas || {};		

Creanvas.Controller = function(canvasData) {
	var canvas, needRedraw, refreshTime, controller, events;

	controller = this;

	canvas = canvasData.canvas;
	this.context = canvas.getContext("2d");	
	needRedraw = true;	
	refreshTime = canvasData.refreshTime || 50; // ms	

	events = new Creevents.EventContainer();			
	events.addEvent('draw');
	events.registerControlEvent(canvas, 'click');
	events.registerControlEvent(canvas, 'mousedown');
	events.registerControlEvent(canvas, 'mouseup');
	events.registerControlEvent(canvas, 'mousemove');
	events.registerControlEvent(canvas, 'touchstart');
	events.registerControlEvent(canvas, 'touchend');
	events.registerControlEvent(canvas, 'touchmove');
		
	this.redraw = function()
	{
		needRedraw = true;
	};	

	this.getCanvasXYFromClientXY  = function(clientX, clientY)
	{
		var boundings = canvas.getBoundingClientRect();
		return { 
			x: (clientX-boundings.left) * canvas.width/boundings.width,
			y: (clientY-boundings.top) * canvas.height/boundings.height};		
	};

	this.addEventListener = function(eventId, eventHandler, rank)
	{
		events.register(eventId, eventHandler, rank);
	};

	this.removeEventListener = function(eventId, eventHandle)
	{
		events.cancel(eventId, eventHandle);
	};

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
};



