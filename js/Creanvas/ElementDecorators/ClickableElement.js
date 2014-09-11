var CreJs = CreJs || {};

(function(){
	CreJs.Creanvas = CreJs.Creanvas || {};		
	
	CreJs.Creanvas.elementDecorators = CreJs.Creanvas.elementDecorators || [];
	
	CreJs.Creanvas.elementDecorators["clickable"] = 
	{
		applyTo: function(element, clickData)
		{	
			var onclick  = clickData["onclick"];
						
			if (onclick)
			{
				element.onClick = function(event)
				{
						if(DEBUG) element.debug("onClick", onclick );
		
						onclick.call(element, event);						
		
						element.triggerRedraw();
				};
				
				element.elementEvents.getEvent('click').addListener(
				{
					handleEvent:element.onClick
				});
			}

			var isPointerDown = false;
			this.touchIdentifier = null;	

			var ondown  = clickData["ondown"];
			var onup = clickData["onup"];

			var onDown = function(e)
			{				
				if (DEBUG)
				{
					element.controller.logMessage('Registered down - identifier: ' + e.touchIdentifier);
				}

				element.touchIdentifier = e.touchIdentifier;

				isPointerDown = true;

				if (ondown)
				{
					if(DEBUG) element.debug("onDown", ondown);
	
					ondown.call(element, event);						
	
					element.triggerRedraw();
				}
			};
	
			var onUp = function(e)
			{
				if (!isPointerDown)
					return;

				if (element.touchIdentifier != e.touchIdentifier)
					return;

				if (DEBUG)
				{
					element.controller.logMessage('registerd up - identifier: ' + e.touchIdentifier);
				}
				
				isPointerDown = false;
				
				if (onup)
				{
					if(DEBUG) element.debug("onUp", onup);
	
					onup.call(element, event);						
	
					element.triggerRedraw();
				}

			};
						
			element.elementEvents.getEvent('pointerDown').addListener(
					{
					handleEvent:onDown,
					listenerId:element.elementId});
	
			element.elementEvents.getEvent('pointerUp').addListener(
					{
					handleEvent:onUp,
					listenerId:element.elementId});
		}
	};
}());
