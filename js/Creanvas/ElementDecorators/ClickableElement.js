var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["clickable"] = 
	{
		applyTo: function(element, clickData)
		{	
			var onclick  = clickData["onclick"];
			
			element.onClick = function(event)
			{
				if(DEBUG) element.debug("onClick", onclick );

				onclick.call(element, event);						

				element.triggerRedraw();
			};
			
			element.elementEvents.addEventListenerX(
			{
				eventId:'click', 
				handleEvent:element.onClick
			});
		}
	};
}());
