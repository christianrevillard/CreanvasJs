/*var startStuff = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	
	var controller = new CreJs.Creanvas.Controller(
			{
				canvas:theCanvas, 
				backgroundColor: "#DDD",
				drawBackground : 
					function (context) 
					{
						context.fillStyle = "#666";
						context.fillRect(100,100,theCanvas.width-200,theCanvas.height-200);
					},		
			});
	
	controller.addElement({
			x: 400,
			y: 300,
			movable: true,
			draw: function (context) 
			{
				context.strokeStyle = "#f00";
				context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,5,0,2*Math.PI);
				context.stroke();
			}});

	controller.addElement({
			x: 500,
			y: 200,
			movable: true,
			draw: function (context) 
			{
			context.strokeStyle = "#0f0";
			context.lineWidth=2;
				
			//context.beginPath(); // forgotten, should not mess evrything up - done
			context.arc(this.x,this.y,10,0,2*Math.PI);
			context.stroke();
			}});

	controller.addElement({
			x: 200,
			y: 350,
			onclick: function(){ //alert(this.x + ',' + this.y)
				},			
			draw: function (context) 
			{
				context.strokeStyle = "#00f";
				context.lineWidth=2;
				
				context.beginPath();
				context.arc(this.x,this.y,50,0,2*Math.PI);
				context.stroke();
			}});


	controller.addElement({
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

	
	controller.addElement({
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
	
	
	// prevent a Galaxy bug stuff - can we do better ? must handle scrolling manually...
	function touchHandlerDummy(e)
	{
	    e.preventDefault();
	    return false;
	}
	document.addEventListener("touchstart", touchHandlerDummy, false);
	document.addEventListener("touchmove", touchHandlerDummy, false);
	document.addEventListener("touchend", touchHandlerDummy, false);

};*/