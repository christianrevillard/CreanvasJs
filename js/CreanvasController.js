var CreanvasJs 	= CreanvasJs || {};		

CreanvasJs.CreanvasController = function(canvas) {
	this.canvas = canvas;
	this.context = 	canvas.getContext("2d");
	this.needRedraw = true;	
	var redrawCheckTime = 50; // ms	
	var controller = this;

	this.events = new Creevents.CreeventRegister();			
	
	var checkRedraw = setInterval(
		function()
		{
			if (controller.needRedraw)
				{
					controller.needRedraw = false;
					// to improve? redraw only needed parts? a Rectangle of stuff
					// when image background: will need to redraw the whole anyway? Or store it a getImageData?
					// but can cause a cascade of redraw of about everything anyway... 
					controller.context.beginPath();
					controller.context.fillStyle = "#FFF";
					controller.context.fillRect(0,0,canvas.width,canvas.height);
					controller.events.dispatchEvent('draw');
				}
		},
		redrawCheckTime);
	
	this.getCanvasXYFromClientXY  = function(clientX, clientY)
	{
		var boundings = controller.canvas.getBoundingClientRect();
		return { 
			x: (clientX-boundings.left)*canvas.width/boundings.width,
			y: (clientY-boundings.top)*canvas.height/boundings.height};		
	};
	
	this.events.addCustomEvent('draw');
	this.events.registerControlEvent(canvas, 'click');
	this.events.registerControlEvent(canvas, 'mousedown');
	this.events.registerControlEvent(canvas, 'mouseup');
	this.events.registerControlEvent(canvas, 'mousemove');
	
	this.addEventListener = function(eventId, eventHandler, rank)
	{
		controller.events.registerEvent(eventId, eventHandler, rank);
	};

	this.removeEventListener = function(eventId, eventHandle)
	{
		controller.events.cancelEvent(eventId, eventHandle);
	};
};
