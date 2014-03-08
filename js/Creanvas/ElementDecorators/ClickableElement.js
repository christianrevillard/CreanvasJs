var CreJs = CreJs || {};

CreJs.Creanvas = CreJs.Creanvas || {};		

CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];

CreJs.Creanvas.elementDecorators.push(
{
	type: 'clickable',
	applyTo: function(element, eventTarget, clickData)
	{	
		var onclick = clickData.onclick;

		element.controller.events.addEventListener(
				{
					decoratorType:'clickable',
					eventId: 'click', 
					handleEvent: function(e){
						eventTarget.queueEvent(function()
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
