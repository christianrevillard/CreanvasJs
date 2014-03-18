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
			timeScale:0.1
				
		});

		
	var elementData	= {
			name:'O',
			collidable:true,
			moving:true,
			width:150,
			height:150,
			x: 75,
			y: 325,
			scaleX:0.8,
			scaleY:1.2,
			rules:[
			       {
			    	  checkTime: 80, //ms
			    	  rule: function()
			    	  {
			    		  var previous = this.scaleX;
			    		  if (this.scaleX>1.2)
			    		  {
			    			  this.scaleX-=0.05;
			    		  }
			    		  else if (this.scaleX<0.8)
			    		  {
			    			  this.scaleX+=0.05;			    			  
			    		  }
			    		  else if (this.scaleX > (this.previousScaleX || this.scaleX))
			    		  {
			    			  this.scaleX+=0.05;
			    		  }
			    		  else
			    		  {
			    			  this.scaleX-=0.05;			    			  
			    		  }

			    		  this.previousScaleX=previous;
		    			  this.scaleY=2-this.scaleX;
			    	  }
			       }
			       ],
			draw: function (context) 
			{
				var color1, color2;
				color1 =  "#AAF";
				color2= "#DDD";

				context.arc(0,0,50,0,2*Math.PI);
				var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
			}};

	var element1 = controller.addElement(elementData);
	
	var element2 = controller.addElement(elementData);

	var element3 = controller.addElement(elementData);

	var element4 = controller.addElement(elementData);

	var element5 = controller.addElement(elementData);

	var element6 = controller.addElement(elementData);

	element1.vx = 0.2;
	
	element2.x=600;
	element2.scaleX=2;
	element2.scaley=0;
	element2.vx = -0.2;

	element3.x=100;
	element3.y=100;
	element3.scaleX=0;
	element3.scaley=2;
	element3.vx = 1.2;
	element3.vy = 0.8;

	element4.x=500;
	element4.y=100;
	element4.vx = -1;
	element4.vy = 0.8;

	element5.x=350;
	element5.y=100;
	element5.vy = 2;

	element6.x=400;
	element6.y=400;
	element6.vy =-0.5;

	var elementDataWall	= {
			name:'wall',
			collidable:true,
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
	bottom.angle = -Math.PI/2;
	top.x = bottom.x = 0;
	top.y = 5;
	bottom.y = 495;
	top.scaleY = bottom.scaleY = 700/500;

	
	//setInterval(function() { if(element2.x>0) element2.x--;},50);
	//setInterval(function() { if(element3.x<600) element3.x++; if(element3.y<500) element3.y++;},50);

	//setInterval(function() { if(element1.x<600) element1.x++;},50);
	//setInterval(function() { if(element2.x>0) element2.x--;},50);
	//setInterval(function() { if(element3.x<600) element3.x++; if(element3.y<500) element3.y++;},50);
	
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