var onload = function ()
{		
	var canvas1 = document.getElementById('canvas1');
	var context1 = canvas1.getContext('2d');
	var controller1;
	
	var setUp = function()
	{
		controller1 = new CreJs.Creanvas.Controller(
		{
			noWorker:true,
			canvas:canvas1, 
			log: new CreJs.Crelog.Logger().log,
			timeScale:0.1,
			refreshTime:Infinity
				
		});

		
	var elementData	= {
			width:50,
			height:50,
			x: 50,
			y: 100,
			angle:-Math.PI/4,
			scaleX:2,
			scaleY:1,
			draw: function (context) 
			{
				var color1 =  "#AAF";
				
				context.moveTo(-20,-20);
				context.lineTo(20,-20);
				context.lineTo(20,20);
				context.lineTo(-20,20);
				context.closePath();
				context.stroke();
			}};

	var test1 = controller1.addElement(elementData);
	
	window.setTimeout(function()
	{
	var p1 = test1.getCanvasXY(-10,-10);
	context1.beginPath();
	context1.arc(p1.x, p1.y, 5, 0, Math.PI*2);
	context1.strokeStyle = "#F00";
	context1.stroke();

	var p2 = test1.getElementXY(p1.x, p1.y);
	text1.innerHTML += "(-10,-10); " + "(" + p1.x + "," + p1.y + "); " + "(" + p2.x + "," + p2.y + ");\n";
	
	p1 = test1.getCanvasXY(0,0);
	context1.beginPath();
	context1.arc(p1.x, p1.y, 5, 0, Math.PI*2);
	context1.strokeStyle = "#00F";
	context1.stroke();

	p2 = test1.getElementXY(p1.x, p1.y);
	text1.innerHTML += "(0,0); " + "(" + p1.x + "," + p1.y + "); " + "(" + p2.x + "," + p2.y + ");\n";

	p1 = test1.getCanvasXY(20,20);
	context1.beginPath();
	context1.arc(p1.x, p1.y, 5, 0, Math.PI*2);
	context1.strokeStyle = "#0F0";
	context1.stroke();

	p2 = test1.getElementXY(p1.x, p1.y);
	text1.innerHTML += "(20,20); " + "(" + p1.x + "," + p1.y + "); " + "(" + p2.x + "," + p2.y + ");\n";

	},100);
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