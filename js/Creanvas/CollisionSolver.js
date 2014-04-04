var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.CollisionSolver = function(controller)
	{
		var canvas, collisionCanvas;

		canvas = controller.context.canvas;
		collisionCanvas = canvas.ownerDocument.createElement('canvas');		
		
		//canvas.ownerDocument.body.appendChild(collisionCanvas);
		collisionCanvas.width = canvas.width;
		collisionCanvas.height = canvas.height;
		collisionContext = collisionCanvas.getContext("2d");

		this.solveCollision = function(element, toCheck)
		{
			var rect1, center, others, otherCenter, hasCollided, isDrawn, rect2, left, right, top, bottom, imageWidth, imageHeight, imageBefore, imageAfter, edges;
			
			rect1 = element.getClientRect();

			center = element.getCenter();
			
			others = toCheck.filter(function(other){ 
				if (other.id === element.id || ((!other.moving.speed.x && !other.moving.speed.y && !element.moving.speed.x && !element.moving.speed.y)))
					return false;
				
				otherCenter = other.getCenter();
				
				if (Math.sqrt((center.x-otherCenter.x)*(center.x-otherCenter.x)+(center.y-otherCenter.y)*(center.y-otherCenter.y))>element.getRadius() + other.getRadius())
					return false;
					
				return true;								
			});
			
			if (others.length==0)
				return true;
			
			hasCollided = false;
			isDrawn=false;
			
			others.forEach(
				function(other)
				{
					if (hasCollided)
						return; // take just the first one...
					
					rect2 = other.getClientRect();
					left = Math.max(rect1.left, rect2.left);
					right = Math.min(rect1.right, rect2.right);
					top = Math.max(rect1.top, rect2.top);
					bottom = Math.min(rect1.bottom, rect2.bottom);
						
					if (bottom<=top || right<=left)
						return;

					if (!isDrawn)
						{

						collisionContext.clearRect(left-1,top-1,right-left+2,bottom-top+2);
					
						collisionContext.translate(element.x, element.y);
						collisionContext.rotate(element.angle || 0);
						collisionContext.scale(element.scaleX || 1, element.scaleY || 1);
						collisionContext.drawImage(
							element.collisionContext.canvas,
							0, 0, element.width, element.height,
							-element.dx, -element.dy, element.width, element.height);
				
						collisionContext.scale(1/(element.scaleX || 1), 1/(element.scaleY) || 1);
						collisionContext.rotate(- (element.angle || 0));
						collisionContext.translate(-element.x, -element.y);	
						isDrawn = true;
						};
					
					
					// save this image
					imageWidth = right-left+2;
					imageHeight = bottom-top+2;
					imageBefore = collisionContext.getImageData(left-1,top-1,imageWidth,imageHeight);
									
					collisionContext.translate(other.x, other.y);
					collisionContext.rotate(other.angle || 0);
					collisionContext.scale(other.scaleX || 1, other.scaleY || 1);
					collisionContext.globalCompositeOperation='destination-out';
					collisionContext.drawImage(
						other.collisionContext.canvas,
						0, 0, other.width, other.height,
						-other.dx, -other.dy, other.width, other.height);		
					collisionContext.globalCompositeOperation='source-over';
					collisionContext.scale(1/(other.scaleX || 1), 1/(other.scaleY) || 1);
					collisionContext.rotate(- (other.angle || 0));
					collisionContext.translate(-other.x, - other.y);						
					
					imageAfter = collisionContext.getImageData(left-1,top-1,imageWidth,imageHeight);

					edges=[];

					for (var imageX=1;imageX<imageWidth-1; imageX++)
					{
						for (var imageY=1;imageY<imageHeight-1; imageY++)
						{
								// check alpha only
							if (imageBefore.data[imageY*imageWidth*4 + imageX*4 + 3] > 160 && imageAfter.data[imageY*imageWidth*4 + imageX*4 + 3] < 90)
							{
								edges.push({x:imageX, y:imageY});
							}
						}
					}

					if (edges.length < 2)
						return;

					var d,dmax = 0;
					var theMax = {i:0, j:edges.length-1};
					for (var i = 1; i<edges.length; i++)
					{
						for (var j = i+1; j<edges.length; j++)
						{
							var dx = edges[i].x-edges[j].x;
							var dy = edges[i].y-edges[j].y;
							d = Math.sqrt(dx*dx+dy*dy);
							if (d>dmax)
							{
								dmax=d;
								theMax.i = i;
								theMax.j = j;
							};
						};																			
					};

					collisionContext.putImageData(imageAfter, left-1,top-1);

					
					var colVectors = CreJs.Core.getUnitVectors(edges[theMax.i].x, edges[theMax.i].y,  edges[theMax.j].x , edges[theMax.j].y);
					 
					var imageX = (edges[theMax.i].x +  edges[theMax.j].x)/2 + left - 1;
					var imageY = (edges[theMax.i].y +  edges[theMax.j].y)/2 + top - 1;


					//element.events.dispatch('collision', {element:other, contactPoint:{x:left+imageX,y:top+imageY}});									
					//other.events.dispatch('collision', {element:element, contactPoint:{x:left+imageX,y:top+imageY}});
					
					var collisionPoint = {x:imageX, y:imageY};
					// CreJs.Core.drawUnitVectors(collisionContext, collisionPoint.x, collisionPoint.y, colVectors, "#0F0");

					var speedElement = new CreJs.Core.Vector(element.moving.speed.x, element.moving.speed.y);
					var speedOther = new CreJs.Core.Vector(other.moving.speed.x, other.moving.speed.y);

					var localSpeedElement = speedElement.getCoordinates(colVectors);
					var localSpeedOther = speedOther.getCoordinates(colVectors);
					
					var centerCollisionElement = new CreJs.Core.Vector(collisionPoint.x-element.x, collisionPoint.y-element.y);								
					var l1 = CreJs.Core.VectorProduct(centerCollisionElement, colVectors.v);		
					var d1;
					if (Math.abs(l1)<1)
						d1 = Infinity;
					else
						d1 = l1;

					var centerCollisionOther = new CreJs.Core.Vector(collisionPoint.x-other.x, collisionPoint.y-other.y);								
					var l2= CreJs.Core.VectorProduct(centerCollisionOther, colVectors.v);		
					var d2;
					if (Math.abs(l2)<1)
						d2 = Infinity;
					else
						d2 = l2;

					// F selon colVectors.v
					var F = 
						2 / (1/other.m + 1/element.m)*
						(localSpeedOther.v-localSpeedElement.v)
					  + 2 * (1/other.getM() + 1/element.getM())*
					  	(-other.moving.rotationSpeed/d2 + element.moving.rotationSpeed/d1);
					
					element.moving.speed.x += F/element.m*colVectors.v.x;
					element.moving.speed.y += F/element.m*colVectors.v.y;
					other.moving.speed.x -= F/other.m*colVectors.v.x;
					other.moving.speed.y -= F/other.m*colVectors.v.y;
					element.moving.rotationSpeed += 1*F * l1 / element.getM();
					other.moving.rotationSpeed -= 1*F * l2 / other.getM();
													
					hasCollided = true;
					element.controller.log('collision : ' + element.name + " and " + other.name);
				});
			
			return !hasCollided;
		};
	};
}());
