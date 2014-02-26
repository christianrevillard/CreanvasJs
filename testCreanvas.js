var startStuff = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	
	var context = theCanvas.getContext("2d");		
	context.strokeStyle='#0FF';
	context.fillStyle='#FFF';

	var test1 = new CreanvasJs.CreanvasElement(
			context,
			400,
			300,
			function () 
			{
			context.strokeStyle = "#f00";
			context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,5,0,2*Math.PI);
				context.stroke();
			});

	var test2 = new CreanvasJs.CreanvasElement(
			context,
			500,
			200,
			function () 
			{
			context.strokeStyle = "#0f0";
			context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,10,0,2*Math.PI);
				context.stroke();
			});

	var test3 = new CreanvasJs.CreanvasElement(
			context,
			200,
			350,
			function () 
			{
			context.strokeStyle = "#00f";
			context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,50,0,2*Math.PI);
				context.stroke();
			});

	test1.draw();
	test2.draw();
	test3.draw();
};