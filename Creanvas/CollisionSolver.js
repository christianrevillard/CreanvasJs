(function(){
	CreJs.Creanvas.CollisionSolver = function(controller)
	{				
		var findCollisionPoint = function(element, other)
		{
			var clientRectElement, clientRectOther, clientRectIntersection, imageAfter, edges;
			
			clientRectElement = element.getClientRect();													
			clientRectOther = other.getClientRect();

			clientRectIntersection = {
				left: Math.max(clientRectElement.leftInPoints, clientRectOther.leftInPoints)-1,
				right: Math.min(clientRectElement.rightInPoints, clientRectOther.rightInPoints)+1,
				top: Math.max(clientRectElement.topInPoints, clientRectOther.topInPoints)-1,
				bottom: Math.min(clientRectElement.bottomInPoints, clientRectOther.bottomInPoints)+1};
			
			clientRectIntersection.width = clientRectIntersection.right-clientRectIntersection.left;
			clientRectIntersection.height = clientRectIntersection.bottom-clientRectIntersection.top;
				
			if (clientRectIntersection.width<=0|| clientRectIntersection.height<=0)
				return;
			
			var collisionImage = element.collisionContext.getImageData(0, 0, element.widthInPoints, element.heightInPoints);

			element.collisionContext.scale(1 / (element.elementScaleX || 1), 1 / (element.elementScaleY || 1));
			element.collisionContext.rotate( - (element.elementAngle || 0));
			element.collisionContext.translate(other.elementX * element.controller.lengthScale - element.elementX * element.controller.lengthScale, other.elementY * element.controller.lengthScale - element.elementY * element.controller.lengthScale);
			element.collisionContext.rotate(other.elementAngle || 0 );
			element.collisionContext.scale(other.elementScaleX || 1, other.elementScaleY || 1);

			element.collisionContext.globalCompositeOperation='destination-out';

			element.collisionContext.drawImage(
				other.collidedContext.canvas,
				0, 0, other.widthInPoints, other.heightInPoints,
				  other.leftInPoints , other.topInPoints, other.widthInPoints, other.heightInPoints);
	
			element.collisionContext.scale(1/(other.elementScaleX || 1), 1/(other.elementScaleY || 1));
			element.collisionContext.rotate( - other.elementAngle || 0 );
			element.collisionContext.translate(-other.elementX * element.controller.lengthScale + element.elementX * element.controller.lengthScale, -other.elementY * element.controller.lengthScale + element.elementY * element.controller.lengthScale);
			element.collisionContext.rotate( element.elementAngle || 0);
			element.collisionContext.scale(element.elementScaleX || 1, element.elementScaleY || 1);

			 imageAfter =element.collisionContext.getImageData(
					0,
					0,
					element.widthInPoints,
					element.heightInPoints);

				element.collisionContext.globalCompositeOperation='source-over';

				element.collisionContext.putImageData(collisionImage, 0, 0);

			edges=[];

			element.edges.forEach(
					function(edgePoint)
					{
						if (imageAfter.data[(edgePoint.y)*element.widthInPoints*4 + (edgePoint.x)*4 + 3] < 90)
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

			var point1 = element.getWebappXY(edges[theMax.i].x + element.left, edges[theMax.i].y + element.topInPoints);
			var point2 = element.getWebappXY(edges[theMax.j].x + element.left, edges[theMax.j].y + element.topInPoints);
			
			if (point1.x == point2.x && point1.y == point2.y)
			{
				return null;
			}
			
			return {
				x:(point1.x + point2.x)/2, 
				y:(point1.y + point2.y)/2, 
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
					element.movingSpeed.x, 
					element.movingSpeed.y);
			
			speedOther = new CreJs.Core.Vector(
					other.movingSpeed.x, 
					other.movingSpeed.y);

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

			var elementMass = element.fixedPoint ? Infinity:element.elementMass;
			var otherMass = other.fixedPoint ? Infinity:other.elementMass;
			var elementMOI = element.fixed ? Infinity:element.getMomentOfInertia();
			var otherMOI = other.fixed ? Infinity:other.getMomentOfInertia();

			var F = element.collisionCoefficient * other.collisionCoefficient * 2 *
				(localSpeedOther.v - localSpeedElement.v + other.omega * otherRot.z - element.omega * elementRot.z)
				/( 1/otherMass + 1/elementMass + otherRot.z*otherRot.z/otherMOI + elementRot.z*elementRot.z/elementMOI );
					
			element.movingSpeed.x += F/elementMass*colVectors.v.x;
			element.movingSpeed.y += F/elementMass*colVectors.v.y;
			other.movingSpeed.x -= F/otherMass*colVectors.v.x;
			other.movingSpeed.y -= F/otherMass*colVectors.v.y;
			element.omega += F * l1 / elementMOI;
			other.omega -= F * l2 / otherMOI;
		};

		var getCollidableElements = function()
		{
			return controller.elements.filter(function(e){ return e.isSolid;});
		};					

		this.solveCollision = function(element)
		{			
			var toCheck = getCollidableElements();
			
			var others, center, collisionPoint, other = null;
			
			center = element.getCenter();
			others = toCheck.filter(function(other){ 
				var otherCenter;
				if (
					other.elementId === element.elementId || 
					((
							!other.movingSpeed.x 
							&& !other.movingSpeed.y 
							&& !element.movingSpeed.x 
							&& !element.movingSpeed.y
							&& !other.elementScaleSpeed 
							&& !element.elementScaleSpeed	
							&& !element.omega
							&& !other.omega	
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
	
			element.elementEvents.getEvent('collision').dispatch({element:other, collisionPoint:collisionPoint});									
			other.elementEvents.getEvent('collision').dispatch({element:element, collisionPoint:collisionPoint});

			return false;
		};
	};
}());
