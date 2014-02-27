var CreanvasJs 	= CreanvasJs || {};		

CreanvasJs.CreanvasController = function(
		canvas,
		context){
	this.canvas = canvas;
	this.context = context;
	
	// TODO improve event creation
	
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
	
	this.needRedraw = true;
	
	var controller = this;
	
	var checkRedraw = setInterval(
			function()
			{
				if (controller.needRedraw)
					{
						controller.needRedraw = false;
						// to improve? redraw only needed parts? a Rectangle of stuff
						// when image background: will need to redraw the whole anyway? Or store it a getImageData?
						// but can cause a cascade.. so can probably not do anything else...
						context.beginPath();
						context.fillStyle = "#FFF";
						context.fillRect(0,0,canvas.width,canvas.height);
						controller.reDraw.dispatch();
					}
			},
			50);

};
