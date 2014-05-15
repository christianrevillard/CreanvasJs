var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'collidable',
		applyTo: function(element, collidableData)
		{	
			element.collidable = {};
			
			if (collidableData.hasOwnProperty('collisionCoefficient'))
				element.collidable.coefficient = collidableData.collisionCoefficient;
			else
				element.collidable.coefficient = 1;
			
			element.moving = element.moving || 
			{
				speed: new CreJs.Core.Vector(0,0), 
				acceleration: new CreJs.Core.Vector(0,0), 
				rotationSpeed:0
			};
			
			element.events.addEventListener(
			{
				eventId:'collision',
				handleEvent:function(collisionEvent)
			{
				if (collidableData.onCollision)
					collidableData.onCollision.call(element, collisionEvent);						
			}});
			
			
			element.preMove = this.preMove || [];
			
			element.preMove.push(function()
			 {			
				return (element.controller.collisionSolver.solveCollision(element, element.controller.getCollidableElements()));
			 });			
			
			var canvas = element.controller.context.canvas;
			
			var tempCollisionCanvas = canvas.ownerDocument.createElement('canvas');			
//				canvas.ownerDocument.body.appendChild(tempCollisionCanvas);
			var tempCollidedCanvas = canvas.ownerDocument.createElement('canvas');			
//				canvas.ownerDocument.body.appendChild(tempCollidedCanvas);
			
			tempCollisionCanvas.width = tempCollidedCanvas.width = element.width;
			tempCollisionCanvas.height = tempCollidedCanvas.height = element.height;				

			element.collidedContext = tempCollidedCanvas.getContext("2d");				
			element.collidedContext.putImageData(element.image,0,0);
			element.collidedContext.globalCompositeOperation='source-atop';
			element.collidedContext.fillStyle="#000";
			element.collidedContext.fillRect(0,0,element.width, element.height);

			element.collisionContext = tempCollisionCanvas.getContext("2d");				
			element.collisionContext.globalCompositeOperation='source-over';
			element.collisionContext.drawImage(element.collidedContext.canvas,0, 0);

			var collisionImageOld = element.collisionContext.getImageData(0, 0, element.width, element.height);
			var collisionImageNew = element.collisionContext.createImageData(element.width, element.height);

			element.edges = [];
			
			for (var imageX=0;imageX<element.width; imageX++)
			{
				for (var imageY=0;imageY<element.height; imageY++)
				{
					if (collisionImageOld.data[imageY*element.width*4 + imageX*4 + 3] < 200)
						continue;

					var edge = false;
					
					for (var i=-1;i<2;i++)
					{
						for (var j=-1;j<2;j++)
						{
							if (imageY+i<0 || imageX+j <0 || 
									imageY+i>element.height-1 
									|| imageX+i>element.width-1 ||
									collisionImageOld.data[((imageY+i)*element.width)*4 + (imageX+j)*4 + 3] < 100)
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
													
						collisionImageNew.data[((imageY)*element.width)*4 + (imageX)*4]=0;
						collisionImageNew.data[((imageY)*element.width)*4 + (imageX)*4+1]=0;
						collisionImageNew.data[((imageY)*element.width)*4 + (imageX)*4+2]=0;
						collisionImageNew.data[((imageY)*element.width)*4 + (imageX)*4+3]=fillValue;
					}
				}
			}
			element.collisionContext.putImageData(collisionImageNew, 0, 0);
			
			element.collisionContext.translate(element.dx, element.dy);
		}
	});
}());
