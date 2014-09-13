var CreJs = CreJs || {};

(function() {
	CreJs.Creanvas = CreJs.Creanvas || {};

	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

	CreJs.Creanvas.elementDecorators["moving"] = {
		type : 'moving',
		applyTo : function(element, elementMoving) 
		{
			var vx = elementMoving["vx"];
			var vy = elementMoving["vy"];
			var ax = elementMoving["ax"];
			var ay = elementMoving["ay"];
			var omega = elementMoving["rotationSpeed"];

			if (DEBUG)
			{
				element.controller.logMessage('Applying moving decorator to ' + element.elementName + '-' + element.elementId);
			}

			var lastUpdated, currentTime, dt, rollbackData;
			
			element.movingSpeed =
				new CreJs.Core.Vector(
					vx || 0,
					vy || 0);
						
			element.movingAcceleration = 
				 new CreJs.Core.Vector(
					ax || 0, 
					ay || 0);
			
			element.omega = omega || 0;
			
			lastUpdated = element.controller.getTime();

			setInterval(function() {

				currentTime = element.controller.getTime();
				dt = currentTime - lastUpdated;

				if (dt < 0.001)
					return;

				//element.controller.logMessage('Now moving : ' + element.elementName + ', dt=' + dt);

				lastUpdated = currentTime;

				element.movingSpeed.x += element.movingAcceleration.x * dt;
				element.movingSpeed.y += element.movingAcceleration.y * dt;

				if (element.movingSpeed.x == 0 &&
						element.movingSpeed.y == 0 &&
						element.omega == 0 &&
						(!element.elementScaleSpeed ||(
						element.elementScaleSpeed.x == 0 && element.elementScaleSpeed.y==0						
						)))
				{
					return;
				}
				
				rollbackData = {
						elementX:element.elementX, 
						elementY:element.elementY, 
						elementAngle:element.elementAngle,
						elementScaleX:element.elementScaleX,
						elementScaleY:element.elementScaleY};

				element.elementX += element.movingSpeed.x * dt;
				element.elementY += element.movingSpeed.y * dt;				
				element.elementAngle += element.omega * dt;
				if (element.elementScaleSpeed)
				{
					element.elementScaleX += element.elementScaleSpeed.x * dt;	
					element.elementScaleY += element.elementScaleSpeed.y * dt;	
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
					element.elementX = rollbackData.elementX;
					element.elementY = rollbackData.elementY;
					element.elementAngle = rollbackData.elementAngle;						
					element.elementScaleX = rollbackData.elementScaleX;	
					element.elementScaleY = rollbackData.elementScaleY;
				} else {
					//element.controller.logMessage(element.elementName + " : Updated ok to : " + element.elementX + ', ' + element.elementY + ', ' + element.elementAngle);
				}
			}, 20);
			
			Object.defineProperty(element, "speed", { get: function() {return this.movingSpeed; }, set: function(y) { this.movingSpeed = y; }});
			Object.defineProperty(element, "acceleration", { get: function() {return this.movingAcceleration; }, set: function(y) { this.movingAcceleration = y; }});
			Object.defineProperty(element, "rotationSpeed", { get: function() {return this.omega; }, set: function(y) { this.omega = y; }});
			Object.defineProperty(element, "scaleSpeed", { get: function() {return this.elementScaleSpeed; }, set: function(y) { this.elementScaleSpeed = y; }});
		}	
	};	
}());
