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
			log: new CreJs.Crelog.Logger().log
				
		});

		
	var elementData	= {
			name:'O',
			collidable:true,
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

	element2.x=600;
	element2.scaleX=2;
	element2.scaley=0;

	setInterval(function() { if(element1.x<600) element1.x++;},50);
	setInterval(function() { if(element2.x>0) element2.x--;},50);
	
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