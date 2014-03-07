var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

CreJs.Creanvas.elementDecorators.push(
{
	type: 'clickable',
	applyTo: function(element, eventsToHandle, clickData)
	{	
		var onclick = clickData.onclick;

		element.addEventListener(
				{
					decoratorType:'clickable',
					eventId: 'click', 
					handler: function(e){
						eventsToHandle.push(function()
						{
							if (element.isPointInPath(e))			
							{	
								onclick.call(element);
							}			
						});

			element.triggerRedraw();
				}
			});
	}
});