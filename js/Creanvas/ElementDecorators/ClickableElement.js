var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators.clickable = 
	{
		applyTo: function(element, clickData)
		{	
			element.onClick = function(event)
			{
				clickData.onclick.call(element, event);						

				element.triggerRedraw();
			};
			
			element.events.addEventListener(
			{
				eventId:'click', 
				handleEvent:element.onClick
			});
		}
	};
}());
