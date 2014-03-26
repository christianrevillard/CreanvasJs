var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'moving',
		applyTo: function(element, movingData)
		{	
			element.vx  = movingData.vx || 0;
			element.vy  = movingData.vy || 0;
			element.ax  = movingData.ax || 0;
			element.ay  = movingData.ay || 0;
			element.omega  = movingData.omega || 0;
						
			var localX;
			var localY;
			
			var lastUpdated = element.controller.getTime();
			setInterval(
					function()
					{						

						localX = localX || element.x;
						localY = localY || element.y;
						var currentTime = element.controller.getTime();
						var dt = currentTime-lastUpdated;

						element.controller.log('Now moving : ' + element.name + ', dt=' + dt);
						
						lastUpdated = currentTime;

						element.vx+= element.ax*dt;
						element.vy+= element.ay*dt;
			
						var oldX = localX;
						var oldY = localY;
						var oldAngle = element.angle;					

						localX += element.vx*dt;
						localY += element.vy*dt;
						element.angle += element.omega*dt;					
						element.x = Math.round(localX);
						element.y = Math.round(localY);
						
						// do not check collision if the pixel did not change
						//if (Math.round(element.x)!=Math.round(oldX) || Math.round(element.y)!=Math.round(oldY) || element.angle != oldAngle)
						{
							if (element.preMove && !element.preMove())
							{
								// rollback
								element.controller.log(element.name + " : Updated NOT ok to : " + element.x + ', ' + element.y + ', ' + element.angle);
								element.controller.log(element.name + " : Rolling back to : " + oldX + ', ' + oldY + ', ' + oldAngle);
								localX = oldX;
								localY = oldY;
								element.x = Math.round(localX);
								element.y = Math.round(localY);
								element.angle = oldAngle;											
								if (element.preMove && !element.preMove())
								{
									var whatthef=true;
								}

								
							}
							else
							{
								element.controller.log(element.name + " : Updated ok to : " + element.x + ', ' + element.y + ', ' + element.angle);
							}
						}
						//else
					//	{
						//	element.controller.log(element.name + " : Assume updated ok, no pixel change, to : " + element.x + ', ' + element.y + ', ' + element.angle);							
					//	}
					},
					10);
		}
	});
}());
