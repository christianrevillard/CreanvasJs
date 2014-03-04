var CreTictactoe = CreTictactoe || {};

CreTictactoe.onload = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	var controller;
	var setUp = function()
	{
			controller = new Creanvas.Controller(
			{
				canvas:theCanvas, 
				drawBackground : 
					function (context) 
					{
						context.strokeStyle = "#000";

						context.fillStyle = "#666";
						context.fillRect(0,0,700,500);


						var gradient = context.createLinearGradient(100,100,600,400);
						gradient.addColorStop(0.0,"#EEE");
						gradient.addColorStop(1.0,"#999");

						
						context.fillStyle = gradient;
						context.fillRect(25,25,450,450);
						context.fillRect(525,75,150,150);
						context.fillRect(525,250,150,150);
						
						context.moveTo(25+150,25);
						context.lineTo(25+150,25+450);
						context.moveTo(25+300,25);
						context.lineTo(25+300,25+450);
						context.moveTo(25,25+150);
						context.lineTo(25+450,25+150);
						context.moveTo(25,25+300);
						context.lineTo(25+450,25+300);
						context.lineWidth=4;
						context.lineCap='round';
						context.stroke();
						
					},		
			});
	
	var markX= new Creanvas.Element(
		{
			controller: controller,
			x: 600,
			y: 150,
			duplicable: {generatorCount:3},
			draw: function (context) 
			{
				var color1, color2;
				if (this.isDropped)
				{
					color1 =  "#D22";
					color2= "#600";
				}
				else
					{
					color1 = "#F44";
					color2= "#900";
				}
				context.lineCap='round';
				context.lineWidth=10;
				context.moveTo(this.x-50,this.y-50);
				context.bezierCurveTo(this.x+50,this.y,this.x, this.y+50, this.x+50,this.y+50);
				context.moveTo(this.x-50,this.y+50);
				context.bezierCurveTo(this.x-20,this.y,this.x+30, this.y-25,   this.x+50,this.y-50);
				var gradient = context.createLinearGradient(this.x-45,this.y-30,this.x+55,this.y+60);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.strokeStyle = gradient;
				context.stroke();
				context.moveTo(this.x-50,this.y-50);
				context.lineTo(this.x+50,this.y-50);
				context.moveTo(this.x+50,this.y+50);
				context.lineTo(this.x-50,this.y+50);
				
				context.arc(this.x,this.y,50,0,2*Math.PI);
			}});

	var markO = new Creanvas.Element(
			{
				controller: controller,
			x: 600,
			y: 325,
			duplicable: {generatorCount:3},
			draw: function (context) 
			{
				var color1, color2;
				if (this.isDropped)
				{
					color1 = "#88F";
					color2= "#FFF";
				}
				else
				{
					color1 =  "#AAF";
					color2= "#DDD";
				}
				context.arc(this.x,this.y,50,0,2*Math.PI);
				var gradient = context.createRadialGradient(this.x,this.y,45,this.x-10,this.y-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
			}});

	var tttCase = function(x,y)
	{
		return new Creanvas.Element(
		{
			controller: controller,
			x: 25 + x*150,
			y: 25 + y*150,
			z:-100,
			dropzone:{
				dropX:100+x*150,
				dropY:100+y*150,
				dropCount:1}, 
			draw: function (context) 
			{
				context.moveTo(this.x, this.y);
				context.lineTo(this.x+150, this.y);
				context.lineTo(this.x+150, this.y+150);
				context.lineTo(this.x, this.y+150);
				context.closePath();
			}
		});
	};
	
	var case00 = tttCase(0,0);
	var case01 = tttCase(0,1);
	var case02 = tttCase(0,2);
	var case10 = tttCase(1,0);
	var case11 = tttCase(1,1);
	var case12 = tttCase(1,2);
	var case20 = tttCase(2,0);
	var case21 = tttCase(2,1);
	var case22 = tttCase(2,2);
		
	var resetButton = new Creanvas.Element(
			{
				controller: controller,
			x: 600,
			y: 35,
			clickable: {onclick:function(){
				controller.stop();
				setUp();
				}},
			draw: function (context) 
			{
				context.arc(this.x,this.y,25,0,2*Math.PI);
				var gradient = context.createRadialGradient(this.x,this.y,25,this.x-10,this.y-5,5);
				gradient.addColorStop(0.0,"#00F");
				gradient.addColorStop(0.5,"#FFF");
				gradient.addColorStop(1.0,"#F00");
				context.fillStyle = gradient;
				context.fill();
			}});
	};
	
	setUp();
	// prevent a Galaxy bug stuff - can we do better ? must handle scrolling manually...
	function touchHandlerDummy(e)
	{
	    e.preventDefault();
	    return false;
	}
	
	document.addEventListener("touchstart", touchHandlerDummy, false);
	document.addEventListener("touchmove", touchHandlerDummy, false);
	document.addEventListener("touchend", touchHandlerDummy, false);
};