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
			
			var lastUpdated = element.controller.getTime();
			setInterval(
					function()
					{
						var currentTime = element.controller.getTime();
						var dt = currentTime-lastUpdated;
						lastUpdated = currentTime;

						element.vx+= element.ax*dt;
						element.vy+= element.ay*dt;
						element.x+= element.vx*dt;
						element.y+= element.vy*dt;
						element.angle+= element.omega*dt;						
					},
					10);
		}
	});
}());
