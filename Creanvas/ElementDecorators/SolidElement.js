var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["solid"]=
	{
		applyTo: function(element, solidData)
		{	
			element.isSolid = true;			
			element.elementMass = solidData["mass"] || 1; 
			var onCollision = solidData["onCollision"];			
			var collisionCoefficient = solidData["coefficient"];

			element.fixed = solidData["fixed"]|| false;
			element.fixedPoint = element.fixed || solidData["fixedPoint"]|| false;
			
			element.controller.collisionSolver = 
				element.controller.collisionSolver || 
				new CreJs.Creanvas.CollisionSolver(element.controller);
			
			element.collisionCoefficient = (!collisionCoefficient && collisionCoefficient !==0)? 1 : collisionCoefficient;
			
			element.movingSpeed = element.movingSpeed || new CreJs.Core.Vector(0,0); 
			element.movingAcceleration =  element.movingAcceleration || new CreJs.Core.Vector(0,0); 
			element.omega = element.omega || 0;

			element.elementEvents.getEvent('collision').addListener(
				function(collisionEvent)
				{
					if (onCollision) onCollision.call(element, collisionEvent);						
				});
			
			element.preMove = this.preMove || [];
			
			element.preMove.push(function()
			 {			
				return (element.controller.collisionSolver.solveCollision(element));
			 });			

			createCollidedContext.call(element);
			createCollisionContext.call(element);

			element.getMomentOfInertia = function()
			{				
				return element.elementMass / 12 * (element.widthInPoints*element.elementScaleX * element.widthInPoints*element.elementScaleX + element.heightInPoints*element.elementScaleY * element.heightInPoints*element.elementScaleY); // square...};
			};

			// obs. "real" distance in WebApp unit
			element.getRadius = function()
			{				
				return this.getCacheableValue(
					'getRadius',
					element.elementWidth + '' + element.elementHeight + '' + element.elementScaleX + '' + element.elementScaleY,
					function()
					{
						return Math.sqrt(this.elementWidth*this.elementWidth*this.elementScaleX*this.elementScaleX + this.elementHeight*this.elementHeight*this.elementScaleY*this.elementScaleY)/2;
					}				
				);
			};

			Object.defineProperty(element, "mass", { get: function() {return this.elementMass; }, set: function(y) { this.elementMass = y; }});
		}
	};
	
	var createCollidedContext = function()
	{
		var element = this;
		
		var canvas = element.controller.context.canvas;
		
		var tempCollidedCanvas = canvas.ownerDocument.createElement('canvas');			
		tempCollidedCanvas.width = element.widthInPoints;
		tempCollidedCanvas.height = element.heightInPoints;				

		element.collidedContext = tempCollidedCanvas.getContext("2d");				
		element.collidedContext.putImageData(element.elementImage,0,0);
		element.collidedContext.globalCompositeOperation='source-atop';
		element.collidedContext.fillStyle="#000";
		element.collidedContext.fillRect(0,0,element.widthInPoints, element.heightInPoints);
	};
	
	var createCollisionContext = function()
	{
		var element = this;

		var canvas = element.controller.context.canvas;
		var tempCollisionCanvas = canvas.ownerDocument.createElement('canvas');					
		tempCollisionCanvas.width = element.widthInPoints;
		tempCollisionCanvas.height = element.heightInPoints;				

		element.collisionContext = tempCollisionCanvas.getContext("2d");				
		element.collisionContext.globalCompositeOperation='source-over';
		element.collisionContext.drawImage(element.collidedContext.canvas,0, 0);

		var collisionImageOld = element.collisionContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);
		var collisionImageNew = element.collisionContext.createImageData(element.widthInPoints, element.heightInPoints);

		element.edges = [];
		
		for (var imageX=0;imageX<element.widthInPoints; imageX++)
		{
			for (var imageY=0;imageY<element.heightInPoints; imageY++)
			{
				if (collisionImageOld.data[imageY*element.widthInPoints*4 + imageX*4 + 3] < 200)
					continue;

				var edge = false;
				
				for (var i=-1;i<2;i++)
				{
					for (var j=-1;j<2;j++)
					{
						if (imageY+i<0 || imageX+j <0 || 
								imageY+i>element.heightInPoints-1 
								|| imageX+i>element.elementWidth-1 ||
								collisionImageOld.data[((imageY+i)*element.elementWidth)*4 + (imageX+j)*4 + 3] < 100)
						{
							edge = true;
							i=2;
							j=2;
						}
					}																			
				}
				var fillValue = 255;
				
				element.collisionContext.putImageData(collisionImageNew, 0, 0);

				if (edge)
				{
					element.edges.push({x:imageX, y:imageY});
												
					collisionImageNew.data[((imageY)*element.widthInPoints)*4 + (imageX)*4]=0;
					collisionImageNew.data[((imageY)*element.widthInPoints)*4 + (imageX)*4+1]=0;
					collisionImageNew.data[((imageY)*element.widthInPoints)*4 + (imageX)*4+2]=0;
					collisionImageNew.data[((imageY)*element.widthInPoints)*4 + (imageX)*4+3]=fillValue;
				}
			}
		}
		element.collisionContext.putImageData(collisionImageNew, 0, 0);
		
		element.collisionContext.translate(-element.leftInPoints, -element.topInPoints);
	};
}());
