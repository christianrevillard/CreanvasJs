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
		}
	});
}());
