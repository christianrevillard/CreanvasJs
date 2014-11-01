var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["clickable"] = 
	{
		applyTo: function(element, clickData)
		{	
			var isPointerDown = false;
			var ondown  = clickData["ondown"];
			var onup = clickData["onup"];
			var onclick  = clickData["onclick"];

			this.touchIdentifier = null;	
						
			if (onclick)
			{
				var onClick = function(e)
				{
					if (DEBUG) element.debug("Clickable", "onclick");
					onclick.call(element, e);						
					element.triggerRedraw();
				};
				
				element.elementEvents.getEvent('click').addListener(onClick);
			}

			if (ondown)
			{
				var onDown = function(e)
				{				
					if (DEBUG) element.debug("Clickable", "onDown: Identifier: " + e.touchIdentifier);	
					element.touchIdentifier = e.touchIdentifier;	
					isPointerDown = true;	
					ondown.call(element, event);								
					element.triggerRedraw();
				};

				element.elementEvents.getEvent('pointerDown').addListener(onDown);
			}
	
			if (onup)
			{
				var onUp = function(e)
				{
					if (!isPointerDown)
						return;
	
					if (element.touchIdentifier != e.touchIdentifier)
						return;
	
					if (DEBUG) element.debug("Clickable", "onUp: Identifier: " + e.touchIdentifier);	
					
					isPointerDown = false;
					
					onup.call(element, event);								
					element.triggerRedraw();
				};							
		
				element.elementEvents.getEvent('pointerUp').addListener(onUp);
			}
		}
	};
}());
