var startStuff = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	
	var context = theCanvas.getContext("2d");		
	context.strokeStyle='#0FF';
	context.fillStyle='#FFF';

	var controller = new CreanvasJs.CreanvasController(
		theCanvas,
		context);
				
	var test1 = new CreanvasJs.CreanvasElement(
			"red",
			controller,
			400,
			300,
			function () 
			{
				controller.context.strokeStyle = "#f00";
				controller.context.lineWidth=2;
				
				controller.context.beginPath();
				controller.context.arc(this.x,this.y,5,0,2*Math.PI);
				controller.context.stroke();
			});

	var test2 = new CreanvasJs.CreanvasElement(
			"green",
			controller,
			500,
			200,
			function () 
			{
			context.strokeStyle = "#0f0";
			context.lineWidth=2;
				
			controller.context.beginPath();
			controller.context.arc(this.x,this.y,10,0,2*Math.PI);
			controller.context.stroke();
			});

	var test3 = new CreanvasJs.CreanvasElement(
			"blue",
			controller,
			200,
			350,
			function () 
			{
				controller.context.strokeStyle = "#00f";
				controller.context.lineWidth=2;
				
				controller.context.beginPath();
				controller.context.arc(this.x,this.y,50,0,2*Math.PI);
				controller.context.stroke();
			});

	test1.draw();
	test2.draw();
	test3.draw();
	
	theCanvas.addEventListener(
			"click",
			function(event)
			{
				// should only dispatch a click event to the elements...
				controller.click(event);
			});

	theCanvas.addEventListener(
			"mousedown",
			function(event)
			{
				// should only dispatch a click event to the elements...
				controller.mouseDown(event);
			});
	
	theCanvas.addEventListener(
			"mouseup",
			function(event)
			{
				// should only dispatch a click event to the elements...
				controller.mouseUp(event);
			});

	theCanvas.addEventListener(
			"mousemove",
			function(event)
			{
				// should only dispatch a click event to the elements...
				controller.mouseMove(event);
			});
};