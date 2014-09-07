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
			
			element.elementMoving = element.elementMoving || {};

			element.elementMoving.movingSpeed =
				new CreJs.Core.Vector(
					vx || 0,
					vy || 0);
						
			element.elementMoving.movingAcceleration = 
				 new CreJs.Core.Vector(
					ax || 0, 
					ay || 0);
			
			element.elementMoving.omega = omega || 0;
			
			lastUpdated = element.controller.getTime();

			setInterval(function() {

				currentTime = element.controller.getTime();
				dt = currentTime - lastUpdated;

				if (dt < 1)
					return;

				//element.controller.logMessage('Now moving : ' + element.elementName + ', dt=' + dt);

				lastUpdated = currentTime;

				element.elementMoving.movingSpeed.x += element.elementMoving.movingAcceleration.x * dt;
				element.elementMoving.movingSpeed.y += element.elementMoving.movingAcceleration.y * dt;

				if (element.elementMoving.movingSpeed.x == 0 &&
						element.elementMoving.movingSpeed.y == 0 &&
						element.elementMoving.omega == 0 &&
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

				element.elementX += element.elementMoving.movingSpeed.x * dt;
				element.elementY += element.elementMoving.movingSpeed.y * dt;				
				element.elementAngle += element.elementMoving.omega * dt;
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
			
			Object.defineProperty(element, "moving", { get: function() {return this.elementMoving; }, set: function(y) { this.elementMoving = y; }});
			Object.defineProperty(element.elementMoving, "speed", { get: function() {return this.movingSpeed; }, set: function(y) { this.movingSpeed = y; }});
			Object.defineProperty(element.elementMoving, "acceleration", { get: function() {return this.movingAcceleration; }, set: function(y) { this.movingAcceleration = y; }});
			Object.defineProperty(element.elementMoving, "rotationSpeed", { get: function() {return this.omega; }, set: function(y) { this.omega = y; }});
			Object.defineProperty(element, "scaleSpeed", { get: function() {return this.elementScaleSpeed; }, set: function(y) { this.elementScaleSpeed = y; }});
		}	
	};	
}());
