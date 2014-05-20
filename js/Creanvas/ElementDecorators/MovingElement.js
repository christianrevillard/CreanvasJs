var CreJs = CreJs || {};

(function() {
	CreJs.Creanvas = CreJs.Creanvas || {};

	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

	CreJs.Creanvas.elementDecorators.push({
		type : 'moving',
		applyTo : function(element, movingData) 
		{
			var lastUpdated, currentTime, dt, rollbackData;
			
			element.moving = element.moving || {};

			element.moving.speed = new CreJs.Core.Vector(
					movingData.vx || 0,
					movingData.vy || 0);
			
			element.moving.acceleration = new CreJs.Core.Vector(
					movingData.ax || 0, 
					movingData.ay || 0);
			
			element.moving.rotationSpeed = movingData.omega || 0;
			
			lastUpdated = element.controller.getTime();

			setInterval(function() {

				currentTime = element.controller.getTime();
				dt = currentTime - lastUpdated;

				if (dt < 1)
					return;

				//element.controller.log('Now moving : ' + element.name + ', dt=' + dt);

				lastUpdated = currentTime;

				element.moving.speed.x += element.moving.acceleration.x * dt;
				element.moving.speed.y += element.moving.acceleration.y * dt;

				if (element.moving.speed.x == 0 &&
						element.moving.speed.y == 0 &&
						element.moving.rotationSpeed == 0 &&
						(!element.scaleSpeed ||(
						element.scaleSpeed.x == 0 && element.scaleSpeed.y==0						
						)))
				{
					return;
				}
				
				rollbackData = {
						x:element.x, 
						y:element.y, 
						angle:element.angle,
						scaleX:element.scaleX,
						scaleY:element.scaleY};

				element.x += element.moving.speed.x * dt;
				element.y += element.moving.speed.y * dt;				
				element.angle += element.moving.rotationSpeed * dt;
				if (element.scaleSpeed)
				{
					element.scaleX += element.scaleSpeed.x * dt;	
					element.scaleY += element.scaleSpeed.y * dt;	
				}
				
				var preMoveOk = true;

				if (element.preMove)
				{						
					element.preMove.forEach(
						function(preMoveFunction)
						{
							if (!preMoveOk)
								return;
							
							if (!preMoveFunction.call(element))
							{
								preMoveOk = false;
							}
						}
					);
				}
										
				if (!preMoveOk) {
					element.x = rollbackData.x;
					element.y = rollbackData.y;
					element.angle = rollbackData.angle;						
					element.scaleX = rollbackData.scaleX;	
					element.scaleY = rollbackData.scaleY;
				} else {
					//element.controller.log(element.name + " : Updated ok to : " + element.x + ', ' + element.y + ', ' + element.angle);
				}
			}, 20);
		}
	});
}());
