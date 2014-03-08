var CreTictactoe = CreTictactoe || {};

CreTictactoe.onload = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	var controller;
	
	var setUp = function()
	{
		var blockedX = false;
		var blockedO = true;

		controller = new CreJs.Creanvas.Controller(
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
			
				var currentPlayer = controller.addElement({
				x: 600,
				y: 150,
				z:-100,
				draw: function (context) 
				{
					var gradient = context.createLinearGradient(100,100,600,400);
					gradient.addColorStop(0.0,"#FF0");
					gradient.addColorStop(1.0,"#BBB");					
					context.fillStyle = gradient;
					context.fillRect(this.x-75,this.y-75,150,150);
				}});

		
		var markX= 	controller.addElement({
			name:'X',
			x: 600,
			y: 150,
			duplicable: {generatorCount:3, isBlocked:function(){return blockedX;}},
			droppable: true,
			draw: function (context) 
			{
				var color1, color2;
				if (this.dropZone)
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

	var markO = controller.addElement({
			name:'O',
			x: 600,
			y: 325,
			duplicable: {generatorCount:3, isBlocked:function(){return blockedO;}},
			droppable: true,
			draw: function (context) 
			{
				var color1, color2;
				if (this.dropZone)
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
		var theCase = controller.addElement({
			x: 25 + x*150,
			y: 25 + y*150,
			z:-100,
			dropzone:{
				dropX:100+x*150,
				dropY:100+y*150,
				availableSpots:1}, 
			draw: function (context) 
			{
				context.moveTo(this.x, this.y);
				context.lineTo(this.x+150, this.y);
				context.lineTo(this.x+150, this.y+150);
				context.lineTo(this.x, this.y+150);
				context.closePath();
			}
		});
		
		theCase.events.addEventListener(
				{
				eventId:'droppedInZone',
				handleEvent: function(e)
				{
					blockedX = !blockedX;
					blockedO = !blockedO;
					currentPlayer.y = blockedX?325:150;
					controller.redraw();
				},
				listenerId:'application'}
				);
		
		return theCase;
	};
	
	var cases = [];
	
	for (var i = 0; i<3; i++)
	{		
		cases[i] = [];
		for (var j = 0; j<3; j++)
		{
			cases[i][j] = tttCase(i,j);			
		}
	}

	var resetButton = controller.addElement({
			x: 600,
			y: 35,
			clickable : {onclick:function(){			
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
	
	var hasWon = function (element)
	{
		controller.stop(); 
				
		controller.addElement({
			draw:function(context)
			{
				var gradient = context.createLinearGradient(325-75,250-125,325-75+300,250-125+400);
				gradient.addColorStop(0.0,"#ff0");
				gradient.addColorStop(1.0,"#f00");

				context.fillStyle= gradient;
				context.fillRect(325-75, 250-125,150, 200);

				context.fillStyle="#00d";
				context.font= "24pt Times Roman";
				context.fillText(
						"VINNER !!",
						325-75,
						250-100);
			}});
		
		var winner = element.clone();
		winner.z = Infinity;
		winner.x = 325;
		winner.y = 250;
		winner.removeDecorator('duplicable');

		winner.applyDecorator(
				CreJs.Creanvas.getElementDecorator('clickable'),
				{onclick:function(){			
					controller.stop();
					setUp();}});
		
		controller.redraw();
};

	var won = function(list)
	{
		if (list.length!=3)
			return false;
		
		if (list.filter(function(e){ return e.i == list[0].i;}).length == 3)
			return true;

		if (list.filter(function(e){ return e.j == list[0].j;}).length == 3)
			return true;

		if (list.filter(function(e){ return e.i == e.j;}).length == 3)
			return true;

		if (list.filter(function(e){ return e.i == 2 - e.j;}).length == 3)
			return true;

		return false;
	};
	
	var game = setInterval(
			function()
			{
				var Xs = [];
				var Os = [];
				for (var i = 0; i<3; i++)
				{		
					for (var j = 0; j<3; j++)
					{
						if (cases[i][j].droppedElements.length>0 )
						{
							if (cases[i][j].droppedElements[0].name=='X')
							{
								Xs.push({i:i,j:j});
							}
							else if (cases[i][j].droppedElements[0].name=='O')
							{
								Os.push({i:i,j:j});
							}
						}
					}
				}
				
				if (won(Xs))
				{
					clearInterval(game);
					hasWon(markX);					
				}
				if (won(Os))
				{
					clearInterval(game);
					hasWon(markO);
				}
			}
			,100);
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