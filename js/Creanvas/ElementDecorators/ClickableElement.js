var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'clickable',
		applyTo: function(element, clickData)
		{	
			element.controller.events.addEventListener(
			{
				decoratorType:'clickable',
				eventId: 'click', 
				handleEvent: function(e){
					if (element.isPointInPath(e))
					{
						clickData.onclick.call(element);						

						element.triggerRedraw();
					}					
				}
			});
		}
	});
}());
