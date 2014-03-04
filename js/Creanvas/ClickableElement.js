var Creanvas = Creanvas || {};		

Creanvas.elementDecorators = Creanvas.elementDecorators || [];

Creanvas.elementDecorators.push(
{
	type: 'clickable',
	applyTo: function(element, eventsToHandle, clickData)
	{	
		element.controller.addEventListener('click', function(e){

			eventsToHandle.push(function()
			{
				if (element.isPointInPath(e))			
				{	
					clickData.onclick.call(element);
				}			
			});

			element.triggerRedraw();
		});
	}
});
