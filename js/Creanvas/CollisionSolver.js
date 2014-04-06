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
		
		var findCollisionPoint = function(element, other)
		{
			var clientRectElement, clientRectOther, clientRectIntersection, imageBefore, imageAfter, edges;
			
			clientRectElement = element.getClientRect();													
			clientRectOther = other.getClientRect();

			clientRectIntersection = {
				left: Math.max(clientRectElement.left, clientRectOther.left)-1,
				right: Math.min(clientRectElement.right, clientRectOther.right)+1,
				top: Math.max(clientRectElement.top, clientRectOther.top)-1,
				bottom: Math.min(clientRectElement.bottom, clientRectOther.bottom)+1};
			
			clientRectIntersection.width = clientRectIntersection.right-clientRectIntersection.left;
			clientRectIntersection.height = clientRectIntersection.bottom-clientRectIntersection.top;
				
			if (clientRectIntersection.width<=0|| clientRectIntersection.height<=0)
				return;

			collisionContext.clearRect(
					clientRectIntersection.left,
					clientRectIntersection.top,
					clientRectIntersection.width,
					clientRectIntersection.height);
					
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
										
			imageBefore = collisionContext.getImageData(
					clientRectIntersection.left,
					clientRectIntersection.top,
					clientRectIntersection.width,
					clientRectIntersection.height);
								
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
			
			imageAfter = collisionContext.getImageData(
					clientRectIntersection.left,
					clientRectIntersection.top,
					clientRectIntersection.width,
					clientRectIntersection.height);

			edges=[];

			for (var imageX=1;imageX<clientRectIntersection.width-1; imageX++)
			{
				for (var imageY=1;imageY<clientRectIntersection.height-1; imageY++)
				{
						// check alpha only
					if (imageBefore.data[imageY*clientRectIntersection.width*4 + imageX*4 + 3] > 160 && imageAfter.data[imageY*clientRectIntersection.width*4 + imageX*4 + 3] < 90)
					{
						edges.push({x:imageX, y:imageY});
					}
				}
			}

			if (edges.length < 2)
				return null;

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
			
			return {
				x:(edges[theMax.i].x +  edges[theMax.j].x)/2 + clientRectIntersection.left, 
				y:(edges[theMax.i].y +  edges[theMax.j].y)/2 + clientRectIntersection.top, 
				vectors: CreJs.Core.getUnitVectors(edges[theMax.i].x, edges[theMax.i].y,  edges[theMax.j].x , edges[theMax.j].y)};
		};
		
		var updateAfterCollision = function (element, other, collisionPoint)
		{
			var 
				colVectors, speedElement, speedOther, localSpeedElement, localSpeedOther, centerCollisionElement,l1,d1,
				centerCollisionOther,l2,d2;
			
			colVectors = collisionPoint.vectors;
				
			speedElement = new CreJs.Core.Vector(element.moving.speed.x, element.moving.speed.y);
			speedOther = new CreJs.Core.Vector(other.moving.speed.x, other.moving.speed.y);

			localSpeedElement = speedElement.getCoordinates(colVectors);
			localSpeedOther = speedOther.getCoordinates(colVectors);
			
			centerCollisionElement = new CreJs.Core.Vector(collisionPoint.x-element.x, collisionPoint.y-element.y);								
			l1 = CreJs.Core.VectorProduct(centerCollisionElement, colVectors.v);		
			if (Math.abs(l1)<1) // for collision near the axe
				d1 = Infinity;
			else
				d1 = l1;

			centerCollisionOther = new CreJs.Core.Vector(collisionPoint.x-other.x, collisionPoint.y-other.y);								
			l2= CreJs.Core.VectorProduct(centerCollisionOther, colVectors.v);		
			if (Math.abs(l2)<1) // for collision near the axe
				d2 = Infinity;
			else
				d2 = l2;

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
											
			//element.controller.log('collision : ' + element.name + " and " + other.name);			
		};

		this.solveCollision = function(element, toCheck)
		{
			var others, center, collisionPoint, other;
			
			center = element.getCenter();
			others = toCheck.filter(function(other){ 
				var otherCenter;
				if (
					other.id === element.id || 
					((!other.moving.speed.x && !other.moving.speed.y && !element.moving.speed.x && !element.moving.speed.y)))
					return false;
				
				otherCenter = other.getCenter();
				
				if (Math.sqrt((center.x-otherCenter.x)*(center.x-otherCenter.x)+(center.y-otherCenter.y)*(center.y-otherCenter.y))>element.getRadius() + other.getRadius())
					return false;
					
				return true;								
			});
			
			if (others.length==0)
				return true;
			
			collisionPoint = null;
			
			others.forEach(
				function(checkCollisionWith)
				{
					if (collisionPoint)
						return;
				
					collisionPoint = findCollisionPoint(element, checkCollisionWith);

					if (collisionPoint)
						other = checkCollisionWith;
				});

			if (!collisionPoint)
				return true;
			
			updateAfterCollision(element, other, collisionPoint);
	
			//element.events.dispatch('collision', {element:other, contactPoint:{x:left+imageX,y:top+imageY}});									
			//other.events.dispatch('collision', {element:element, contactPoint:{x:left+imageX,y:top+imageY}});

			return false;
		};
	};
}());
