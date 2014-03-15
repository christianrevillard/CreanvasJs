var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.push(
	{
		type: 'clickable',
		applyTo: function(element, clickData)
		{	
			element.onClick = function()
			{
				clickData.onclick.call(element);						

				element.triggerRedraw();
			};
			
			element.events.addEventListener(
			{
				eventId:'click', 
				handleEvent:element.onClick
			});
		}
	});
}());
