var onload = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	var context = theCanvas.getContext("2d");
	
	var controller;

	var canvasX = document.getElementById('canvasX');
	var canvasY = document.getElementById('canvasY');
	var elementX = document.getElementById('elementX');
	var elementY = document.getElementById('elementY');
	var canvasX2 = document.getElementById('canvasX2');
	var canvasY2 = document.getElementById('canvasY2');

	var setUp = function()
	{
		controller = new CreJs.Creanvas.Controller(
		{
			noWorker:true,
			canvas:theCanvas, 
			log: new CreJs.Crelog.Logger().log				
		});

		
	var elementData	= {
			name:'grid',
			width:200,
			height:200,
			x: 350,
			y: 250,
			scaleX:2,
			scaleY:0.8,
			angle:-Math.PI/8,
			draw: function (context) 
			{
				context.fillStyle="#00F";
				context.fillRect(-100,-100,200,200);
				for (var i = 0;i<=10;i++)
				{
					context.moveTo(-100+i*20,-100);
					context.lineTo(-100+i*20,100);
					context.moveTo(-100,-100+i*20);
					context.lineTo(100,-100+i*20);
				}				
				context.stroke();
				context.fillStyle="#F00";
				context.fillText("(-100,-100)",-95,-90);
				context.fillText("(100,-100)",50,-90);
				context.fillText("(100,100)",50,90);
				context.fillText("(-100,100)",-95,90);
				context.fillText("(0,0)",-10,0);
			}};

		var element1 = controller.addElement(elementData);

	
		theCanvas.addEventListener(
				'mousemove',
				function(event)
				{
					var e = controller.getCanvasXYFromClientXY(event);
					var imageXY = element1.getElementXY(e.x, e.y);
					var canvasXY = element1.getCanvasXY(imageXY.x, imageXY.y);

					canvasX.innerHTML = e.x;
					canvasY.innerHTML = e.y;
					elementX.innerHTML = imageXY.x;
					elementY.innerHTML  = imageXY.y;
					canvasX2.innerHTML = canvasXY.x;
					canvasY2.innerHTML = canvasXY.y;
					
					var r = element1.getClientRect();
					
					context.strokeStyle="#F00";
					context.beginPath();
					context.moveTo (r.left, r.top);
					context.lineTo (r.right, r.top);
					context.lineTo (r.right,r.bottom);
					context.lineTo (r.left,r.bottom);
					context.closePath();
					context.stroke();
				});
		
		setInterval(
				function()
				{
					element1.angle+=Math.PI/16;
					element1.triggerRedraw();
				}
				,1000);
	};
	
	setUp();
	
	// fix Galaxy Chrome scrolling bug
	document.addEventListener(
		"touchmove", function touchHandlerDummy(e)
		{
		    e.preventDefault();
		    return false;
		},
		false);	
};