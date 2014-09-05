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
			
			var collisionImage = element.collisionContext.getImageData(0, 0, element.elementWidth, element.elementHeight);

			element.collisionContext.scale(1 / (element.elementScaleX || 1), 1 / (element.elementScaleY || 1));
			element.collisionContext.rotate( - (element.elementAngle || 0));
			element.collisionContext.translate(other.elementX - element.elementX, other.elementY - element.elementY);
			element.collisionContext.rotate(other.elementAngle || 0 );
			element.collisionContext.scale(other.elementScaleX || 1, other.elementScaleY || 1);

			element.collisionContext.globalCompositeOperation='destination-out';

			element.collisionContext.drawImage(
				other.collidedContext.canvas,
				0, 0, other.elementWidth, other.elementHeight,
				 - other.dx , - other.dy, other.elementWidth, other.elementHeight);
	
			element.collisionContext.scale(1/(other.elementScaleX || 1), 1/(other.elementScaleY || 1));
			element.collisionContext.rotate( - other.elementAngle || 0 );
			element.collisionContext.translate(-other.elementX + element.elementX, -other.elementY + element.elementY);
			element.collisionContext.rotate( element.elementAngle || 0);
			element.collisionContext.scale(element.elementScaleX || 1, element.elementScaleY || 1);

			 imageAfter =element.collisionContext.getImageData(
					0,
					0,
					element.elementWidth,
					element.elementHeight);

				element.collisionContext.globalCompositeOperation='source-over';

				element.collisionContext.putImageData(collisionImage, 0, 0);

			edges=[];

			element.edges.forEach(
					function(edgePoint)
					{
						if (imageAfter.data[(edgePoint.y)*element.elementWidth*4 + (edgePoint.x)*4 + 3] < 90)
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
				

			centerCollisionElement = new CreJs.Core.Vector(collisionPoint.x-element.elementX, collisionPoint.y-element.elementY);								
			l1 = CreJs.Core.vectorProduct(centerCollisionElement, colVectors.v).z;		

			centerCollisionOther = new CreJs.Core.Vector(collisionPoint.x-other.elementX, collisionPoint.y-other.elementY);								
			l2= CreJs.Core.vectorProduct(centerCollisionOther, colVectors.v).z;		

			var elementRot = CreJs.Core.vectorProduct(
					centerCollisionElement,
					colVectors.v);	

			var otherRot = CreJs.Core.vectorProduct(
					centerCollisionOther,
					colVectors.v);	

			speedElement = new CreJs.Core.Vector(
					element.elementMoving.movingSpeed.x, 
					element.elementMoving.movingSpeed.y);
			
			speedOther = new CreJs.Core.Vector(
					other.elementMoving.movingSpeed.x, 
					other.elementMoving.movingSpeed.y);

			if (element.elementScaleSpeed)
			{
				speedElement.x += centerCollisionElement.x*element.elementScaleSpeed.x;
				speedElement.y += centerCollisionElement.y*element.elementScaleSpeed.y;
			};

			if (other.elementScaleSpeed)
			{
				speedOther.x += centerCollisionOther.x*other.elementScaleSpeed.x;
				speedOther.y += centerCollisionOther.y*other.elementScaleSpeed.y;
			};

			localSpeedElement = speedElement.getCoordinates(colVectors);
			localSpeedOther = speedOther.getCoordinates(colVectors);


			var F = element.solidData.coefficient * other.solidData.coefficient * 2 *
				(localSpeedOther.v - localSpeedElement.v + other.elementMoving.omega * otherRot.z - element.elementMoving.omega * elementRot.z)
				/( 1/other.solidData.elementMass + 1/element.solidData.elementMass + otherRot.z*otherRot.z/other.getMomentOfInertia() + elementRot.z*elementRot.z/element.getMomentOfInertia() );
					
			element.elementMoving.movingSpeed.x += F/element.solidData.elementMass*colVectors.v.x;
			element.elementMoving.movingSpeed.y += F/element.solidData.elementMass*colVectors.v.y;
			other.elementMoving.movingSpeed.x -= F/other.solidData.elementMass*colVectors.v.x;
			other.elementMoving.movingSpeed.y -= F/other.solidData.elementMass*colVectors.v.y;
			element.elementMoving.omega += F * l1 / element.getMomentOfInertia();
			other.elementMoving.omega -= F * l2 / other.getMomentOfInertia();
						
			//element.controller.logMessage('collision : ' + element.elementName + " and " + other.elementName);			
		};

		var getCollidableElements = function()
		{
			return controller.elements.filter(function(e){ return e.solidData;});
		};					

		this.solveCollision = function(element)
		{			
			var toCheck = getCollidableElements();
			
			var others, center, collisionPoint, other;
			
			center = element.getCenter();
			others = toCheck.filter(function(other){ 
				var otherCenter;
				if (
					other.elementId === element.elementId || 
					((!other.elementMoving.movingSpeed.x && !other.elementMoving.movingSpeed.y && !element.elementMoving.movingSpeed.x && !element.elementMoving.movingSpeed.y
						&& !other.elementScaleSpeed && !element.elementScaleSpeed	
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
	
			element.elementEvents.dispatch('collision', {element:other, collisionPoint:collisionPoint});									
			other.elementEvents.dispatch('collision', {element:element, collisionPoint:collisionPoint});

			return false;
		};
	};
}());
