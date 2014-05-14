var onload = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	var controller;
	
	var setUp = function()
	{
		controller = new CreJs.Creanvas.Controller(
		{
			noWorker:true,
			canvas:theCanvas, 
			log: new CreJs.Crelog.Logger().log,
			timeScale:0.1,
			refreshTime:100
				
		});

		
	var elementData	= {
			name:'O',
			collidable:{collisionCoefficient:1},
			moving:true,
			width:50,
			height:50,
			x: 75,
			y: 325,
			scaleX:1,
			scaleY:1,
			draw: function (context) 
			{
				var color1, color2;
				color1 =  "#AAF";
				color2= "#DDD";

				context.arc(0,0,20,0,2*Math.PI);
				var gradient = context.createRadialGradient(0,0,50,50,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
			}};

	var elementData2	= {
			name:'T',
			collidable:true,
			moving:true,
			width:100,
			height:100,			
			x: 200,
			vx:10,
			vy:2,
			y: 300,
			scaleX:1,
			scaleY:1,
			draw: function (context) 
			{
				var color1, color2;
				color1 =  "#AAF";
				color2= "#DDD";

				context.moveTo(0,-50);
				context.lineTo(50,50);
				context.lineTo(-50,50);
				var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
				context.stroke();
			}};

	
	var bumperData	= {
			name:'bumper',
			collidable:{
				collisionCoefficient:1,
				onCollision: function(e)
				{
					if (this.scaleSpeed && this.scaleSpeed.x>0)
						this.scaleSpeed = new CreJs.Core.Vector(-this.scaleSpeed.x, -this.scaleSpeed.y);
				}
				},
			clickable:{
				onclick: function(e)
				{
					var scaleSpeed = 0.05;
					var scaleLimit = 2;
					var scaleInitialX = 1;
					var scaleInitialY = 1;
					this.scaleSpeed = new CreJs.Core.Vector(scaleSpeed, scaleSpeed)
					var that = this;
					
					this.scaleUpdate = window.setInterval(function() {
						if (that.scaleX>scaleLimit)
							that.scaleSpeed = new CreJs.Core.Vector(-scaleSpeed, -scaleSpeed)
													
						if (that.scaleX< scaleInitialX)
						{
							that.scaleSpeed = null;
							window.clearInterval(that.scaleUpdate);
							that.scaleX = scaleInitialX;
							that.scaleY = scaleInitialY;
						}
					},5);

				}
			},
			moving:true,
			width:50,
			height:50,
			x: 75,
			y: 325,
			scaleX:1,
			scaleY:1,
			draw: function (context) 
			{
				var color1, color2;
				color1 =  "#F00";
				color2= "#FF0";

				context.arc(0,0,20,0,2*Math.PI);
				var gradient = context.createRadialGradient(0,0,50,50,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
			}};

	var element1 = controller.addElement(elementData);
	element1.name = 'O1';
	element1.x = 200;
	element1.y = 200;
	element1.moving.speed.x = 1;
	element1.moving.speed.y = 0;
	element1.scaleX=2;
	element1.scaleY=2;
	
	var element2 = controller.addElement(elementData);
	element2.name = 'O2';
	element2.x=500;
	element2.y= 200;
	element2.scaleX=2;
	element2.scaleY=2;
	element2.moving.speed.x = -1;
	element2.moving.speed.y = 0;
	
	var element3 = controller.addElement(elementData);
	element3.x=150;
	element3.y=150;
	element3.scaleX=0.5;
	element3.scaleY=0.5;
	element3.moving.speed.x = 2.2;
	element3.moving.speed.y = 1.8;
	element3.m=50;

	var element4 = controller.addElement(elementData);
	element4.x=500;
	element4.y=100;
	element4.moving.speed.x = -2;
	element4.moving.speed.y = 0.8;

	var element5 = controller.addElement(elementData);
	element5.x=600;
	element5.y=100;
	element5.moving.speed.y = 2;

	var element6 = controller.addElement(elementData);
	element6.x=400;
	element6.y=400;
	element6.moving.speed.y =-0.5;

	var element7 = controller.addElement(elementData2);
	element7.name = 'Triangle';
element7.moving.speed.x=1;
element7.y=400;
element7.moving.speed.y=0.5;
//element7.scaleX = 3;
//element7.scaleY = 0.2;
element7.moving.rotationSpeed = Math.PI/128;

	var element8 = controller.addElement(elementData);
	element8.name = 'O1';
	element8.x = 300;
	element8.y = 210;
	element8.scaleX=0.5;
	element8.scaleY=7;
	element8.moving.speed.x = 1;
	element8.moving.speed.y = 1;
	element8.moving.rotationSpeed = 0.01;
	element8.m= 1;
/*
	var element9 = controller.addElement(bumperData);
	element9.name = 'Bumper';
	element9.x=200;
	element9.y= 200;
	element9.scaleY=1;
	element9.moving.speed.x = 0;
	element9.moving.speed.y = 0;
	element9.m= Infinity;

	var element91 = controller.addElement(bumperData);
	element91.name = 'Bumper';
	element91.x=500;
	element91.y= 200;
	element91.scaleY=1;
	element91.moving.speed.x = 0;
	element91.moving.speed.y = 0;
	element91.m= Infinity;

	var element92 = controller.addElement(bumperData);
	element92.name = 'Bumper';
	element92.x=300;
	element92.y= 100;
	element92.scaleY=1;
	element92.moving.speed.x = 0;
	element92.moving.speed.y = 0;
	element92.m= Infinity;

	var element93 = controller.addElement(bumperData);
	element93.name = 'Bumper';
	element93.x=300;
	element93.y= 400;
	element93.scaleY=1;
	element93.moving.speed.x = 0;
	element93.moving.speed.y = 0;
	element93.m= Infinity;

	var element10 = controller.addElement(elementData);
	element10.name = 'O2';
	element10.x=250;
	element10.y= 250;
	element10.scaleY=4;
	element10.moving.speed.x = 0;
	element10.moving.speed.y = 0;
	element10.m= 1;
*/
	var elementDataWall	= {
			name:'wall',
			collidable:{collisionCoefficient:1},
			width:10,
			height:500,
			translate:{dx:0,dy:0},
			x: 5,
			y: 5,
			draw: function (context) 
			{
				var color1, color2;
				color1 =  "#AAF";
				color2= "#DDD";
				context.moveTo(0,0);
				context.lineTo(this.width,0);
				context.lineTo(this.width,this.height);
				context.lineTo(0,this.height);
				context.closePath();
				var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
			}};
	var left = controller.addElement(elementDataWall);
	var top = controller.addElement(elementDataWall);
	var right = controller.addElement(elementDataWall);
	var bottom = controller.addElement(elementDataWall);
	right.x = 690;
	top.angle = -Math.PI/2;
	top.y = 5;
	top.x=0;
	top.scaleY = bottom.scaleY = 700/500;
	left.m = top.m = bottom.m = right.m = Infinity;

	bottom.x = 0;
	bottom.angle = -Math.PI/2;
	bottom.y = 495;
	bottom.scaleY = 700/500;
	bottom.m = Infinity;
	
	
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