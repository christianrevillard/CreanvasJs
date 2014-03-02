var startStuff = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	
	var controller = new CreanvasJs.CreanvasController(theCanvas);
	
	var test1 = new CreanvasJs.CreanvasElement(
			{
			controller: controller,
			x: 400,
			y: 300,
			draw: function (context) 
			{
				context.strokeStyle = "#f00";
				context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,5,0,2*Math.PI);
				context.stroke();
			}});

	var test2 = new CreanvasJs.CreanvasElement(
			{
				controller: controller,
			x: 500,
			y: 200,
			draw: function (context) 
			{
			context.strokeStyle = "#0f0";
			context.lineWidth=2;
				
			//context.beginPath(); // forgotten, should not mess evrything up - done
			context.arc(this.x,this.y,10,0,2*Math.PI);
			context.stroke();
			}});

	var test3 = new CreanvasJs.CreanvasElement(
			{
				controller: controller,
			x: 200,
			y: 350,
			draw: function (context) 
			{
				context.strokeStyle = "#00f";
				context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,50,0,2*Math.PI);
				context.stroke();
			}});


	var test4 = new CreanvasJs.CreanvasElement(
			{
				controller: controller,
			x: 150,
			Y: 270,
			z:-5,
			draw: function (context) 
			{
			context.strokeStyle = "#Ff0";
			context.lineWidth=5;
				
			context.beginPath();
			context.arc(this.x,this.y,15,0,2*Math.PI);
			context.stroke();
			}});

	
	var test5 = new CreanvasJs.CreanvasElement(
			{
				controller: controller,
			x: 200,
			y: 300,
			z:-10,
			draw: function (context) 
			{
				
				// two different paths. Only the last is clickable
				// any way to handle this ? Is this a feature?
				// another way to handle events?
			context.beginPath();
			context.strokeStyle = "#Ff0";
			context.lineWidth=2;
			context.arc(this.x,this.y,20,0,Math.PI);
			context.stroke();
				
			context.beginPath();
			context.strokeStyle = "#0FF";
			context.lineWidth=5;
			context.arc(this.x,this.y,20,Math.PI,2*Math.PI);
			context.stroke();
			}});

	
};