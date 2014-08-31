(function(){
	CreJs.Creanvas.CollisionSolver = function(controller)
	{				
		var findCollisionPoint = function(element, other)
		{
			var clientRectElement, clientRectOther, clientRectIntersection, imageAfter, edges;
			
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
			
			var collisionImage = element.collisionContext.getImageData(0, 0, element.width, element.height);

			element.collisionContext.scale(1 / (element.scaleX || 1), 1 / (element.scaleY || 1));
			element.collisionContext.rotate( - (element.angle || 0));
			element.collisionContext.translate(other.x - element.x, other.y - element.y);
			element.collisionContext.rotate(other.angle || 0 );
			element.collisionContext.scale(other.scaleX || 1, other.scaleY || 1);

			element.collisionContext.globalCompositeOperation='destination-out';

			element.collisionContext.drawImage(
				other.collidedContext.canvas,
				0, 0, other.width, other.height,
				 - other.dx , - other.dy, other.width, other.height);
	
			element.collisionContext.scale(1/(other.scaleX || 1), 1/(other.scaleY || 1));
			element.collisionContext.rotate( - other.angle || 0 );
			element.collisionContext.translate(-other.x + element.x, -other.y + element.y);
			element.collisionContext.rotate( element.angle || 0);
			element.collisionContext.scale(element.scaleX || 1, element.scaleY || 1);

			 imageAfter =element.collisionContext.getImageData(
					0,
					0,
					element.width,
					element.height);

				element.collisionContext.globalCompositeOperation='source-over';

				element.collisionContext.putImageData(collisionImage, 0, 0);

			edges=[];

			element.edges.forEach(
					function(edgePoint)
					{
						if (imageAfter.data[(edgePoint.y)*element.width*4 + (edgePoint.x)*4 + 3] < 90)
						{
							edges.push(edgePoint);						
						}
					});			
		
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

			var point1 = element.getCanvasXY(edges[theMax.i].x - element.dx, edges[theMax.i].y - element.dy);
			var point2 = element.getCanvasXY(edges[theMax.j].x - element.dx, edges[theMax.j].y - element.dy);
			
			if (point1.x == point2.x && point1.y == point2.y)
			{
				return null;
			}
			
			return {
				x:Math.round((point1.x + point2.x)/2), 
				y:Math.round((point1.y + point2.y)/2), 
				vectors: CreJs.Core.getUnitVectors(point1.x, point1.y,  point2.x , point2.y)};			
		};
		
		var updateAfterCollision = function (element, other, collisionPoint)
		{
			var 
				colVectors, speedElement, speedOther, localSpeedElement, localSpeedOther, centerCollisionElement,l1,
				centerCollisionOther,l2;
			
			colVectors = collisionPoint.vectors;
				

			centerCollisionElement = new CreJs.Core.Vector(collisionPoint.x-element.x, collisionPoint.y-element.y);								
			l1 = CreJs.Core.VectorProduct(centerCollisionElement, colVectors.v).z;		

			centerCollisionOther = new CreJs.Core.Vector(collisionPoint.x-other.x, collisionPoint.y-other.y);								
			l2= CreJs.Core.VectorProduct(centerCollisionOther, colVectors.v).z;		

			var elementRot = CreJs.Core.VectorProduct(
					centerCollisionElement,
					colVectors.v);	

			var otherRot = CreJs.Core.VectorProduct(
					centerCollisionOther,
					colVectors.v);	

			speedElement = new CreJs.Core.Vector(
					element.moving.speed.x, 
					element.moving.speed.y);
			
			speedOther = new CreJs.Core.Vector(
					other.moving.speed.x, 
					other.moving.speed.y);

			if (element.scaleSpeed)
			{
				speedElement.x += centerCollisionElement.x*element.scaleSpeed.x;
				speedElement.y += centerCollisionElement.y*element.scaleSpeed.y;
			};

			if (other.scaleSpeed)
			{
				speedOther.x += centerCollisionOther.x*other.scaleSpeed.x;
				speedOther.y += centerCollisionOther.y*other.scaleSpeed.y;
			};

			localSpeedElement = speedElement.getCoordinates(colVectors);
			localSpeedOther = speedOther.getCoordinates(colVectors);


			var F = element.collidable.coefficient * other.collidable.coefficient * 2 *
				(localSpeedOther.v - localSpeedElement.v + other.moving.rotationSpeed * otherRot.z - element.moving.rotationSpeed * elementRot.z)
				/( 1/other.m + 1/element.m + otherRot.z*otherRot.z/other.getM() + elementRot.z*elementRot.z/element.getM() );
					
			element.moving.speed.x += F/element.m*colVectors.v.x;
			element.moving.speed.y += F/element.m*colVectors.v.y;
			other.moving.speed.x -= F/other.m*colVectors.v.x;
			other.moving.speed.y -= F/other.m*colVectors.v.y;
			element.moving.rotationSpeed += F * l1 / element.getM();
			other.moving.rotationSpeed -= F * l2 / other.getM();
						
			//element.controller.log('collision : ' + element.name + " and " + other.name);			
		};

		var getCollidableElements = function()
		{
			return controller.elements.filter(function(e){ return e.collidable;});
		};					

		this.solveCollision = function(element)
		{			
			var toCheck = getCollidableElements();
			
			var others, center, collisionPoint, other;
			
			center = element.getCenter();
			others = toCheck.filter(function(other){ 
				var otherCenter;
				if (
					other.id === element.id || 
					((!other.moving.speed.x && !other.moving.speed.y && !element.moving.speed.x && !element.moving.speed.y
						&& !other.scaleSpeed && !element.scaleSpeed	
					)))
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
	
			element.events.dispatch('collision', {element:other, collisionPoint:collisionPoint});									
			other.events.dispatch('collision', {element:element, collisionPoint:collisionPoint});

			return false;
		};
	};
}());
