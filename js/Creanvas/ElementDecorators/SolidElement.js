var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["solid"]=
	{
		applyTo: function(element, solidData)
		{	
			var cachedResults = [];

			element.solidData = {};
			element.solidData.elementMass = solidData["mass"] || 1; 
			var onCollision = solidData["onCollision"];			
			var collisionCoefficient = solidData["coefficient"];

			element.solidData.fixed = solidData["fixed"]|| false;
			element.solidData.fixedPoint = element.solidData.fixed || solidData["fixedPoint"]|| false;
			
			element.controller.collisionSolver = 
				element.controller.collisionSolver || 
				new CreJs.Creanvas.CollisionSolver(element.controller);
			
			element.solidData.coefficient = (!collisionCoefficient && collisionCoefficient !==0)? 1 : collisionCoefficient;
			
			element.elementMoving = element.elementMoving || 
			{
				movingSpeed: new CreJs.Core.Vector(0,0), 
				movingAcceleration: new CreJs.Core.Vector(0,0), 
				omega:0
			};
			
			element.elementEvents.addEventListenerX(
			{
				eventId:'collision',
				handleEvent:function(collisionEvent)
			{
				if (onCollision) onCollision.call(element, collisionEvent);						
			}});
			
			
			element.preMove = this.preMove || [];
			
			element.preMove.push(function()
			 {			
				return (element.controller.collisionSolver.solveCollision(element));
			 });			
			
			element.getMomentOfInertia = function()
			{				
				return element.solidData.elementMass / 12 * (element.widthInPoints*element.elementScaleX * element.widthInPoints*element.elementScaleX + element.heightInPoints*element.elementScaleY * element.heightInPoints*element.elementScaleY); // square...};
			};
			// obs. "real" distance in WebApp unit
			element.geRadiusCache = function()
			{				
				return Math.sqrt(element.elementWidth*element.elementWidth*element.elementScaleX*element.elementScaleX + element.elementHeight*element.elementHeight*element.elementScaleY*element.elementScaleY)/2;
			};

			element.getRadius = function()
			{				
				var key = element.elementWidth + '' + element.elementHeight + '' + element.elementScaleX + '' + element.elementScaleY ;
				if (cachedResults['getRadius'] && cachedResults['getRadius'].key == key)
				{
					return cachedResults['getRadius'].value_;
				}
				var value = element.geRadiusCache();
				cachedResults['geRadius'] = {kevectorY:key, value_:value};
				return value;
			};

			var canvas = element.controller.context.canvas;
			
			var tempCollisionCanvas = canvas.ownerDocument.createElement('canvas');			
//				canvas.ownerDocument.body.appendChild(tempCollisionCanvas);
			var tempCollidedCanvas = canvas.ownerDocument.createElement('canvas');			
//				canvas.ownerDocument.body.appendChild(tempCollidedCanvas);
			
			tempCollisionCanvas.width = tempCollidedCanvas.width = element.widthInPoints;
			tempCollisionCanvas.height = tempCollidedCanvas.height = element.heightInPoints;				

			element.collidedContext = tempCollidedCanvas.getContext("2d");				
			element.collidedContext.putImageData(element.elementImage,0,0);
			element.collidedContext.globalCompositeOperation='source-atop';
			element.collidedContext.fillStyle="#000";
			element.collidedContext.fillRect(0,0,element.widthInPoints, element.heightInPoints);

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

			Object.defineProperty(element, "solid", { get: function() {return this.solidData; }, set: function(y) { this.solidData = y; }});
			Object.defineProperty(element.solidData, "mass", { get: function() {return this.elementMass; }, set: function(y) { this.elementMass = y; }});
		}
	};
}());
