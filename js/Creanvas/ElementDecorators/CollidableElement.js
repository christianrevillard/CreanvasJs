var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'collidable',
		applyTo: function(element, collidableData)
		{	
			element.collidable = true;
			
			element.events.addEventListener(
					{
						eventId:'collision',
						handleEvent:function(collisionEvent)
					{
							//inverse speed. Must work the physics here...
							if ((collisionEvent.contactPoint.y-element.y)*element.vy>0)
								element.vy=-element.vy;
							if ((collisionEvent.contactPoint.x-element.x)*element.vx>0)
								element.vx=-element.vx;
					}});
		}
	});
}());
