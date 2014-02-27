var CreanvasJs 	= CreanvasJs || {};		

CreanvasJs.CreanvasController = function(
		canvas,
		context){
	this.canvas = canvas;
	this.context = context;
	
	this.click = function(eventData){
		this.clickEvent.dispatch(eventData);
	};

	this.mouseUp= function(eventData){
		this.mouseUpEvent.dispatch(eventData);
		};

	this.mouseDown = function(eventData){
		this.mouseDownEvent.dispatch(eventData);
	};

	this.mouseMove = function(eventData){
		this.mouseMoveEvent.dispatch(eventData);
	};

	this.clickEvent = new Creevents.Creevent();			

	this.mouseUpEvent = new Creevents.Creevent();			

	this.mouseDownEvent = new Creevents.Creevent();			

	this.mouseMoveEvent = new Creevents.Creevent();			

	this.reDraw = new Creevents.Creevent();		
	
	var controller = this;
	
	var drawingAll = setInterval(
			function()
			{
				// to improve? redraw on need only?
				context.beginPath();
				context.fillStyle = "#FFF";
				context.fillRect(0,0,canvas.width,canvas.height);
				controller.reDraw.dispatch();
			},
			50);

};
