var CreJs = CreJs || {};

(function(){
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	
	creevents.EventContainer = function()
	{	
		var container = this;
		var events = [];		
		
		this.addEventListener = function(listenerData)
		{
			if (!events[listenerData.eventId])
			{
				events[listenerData.eventId] = new creevents.Event();								
			}
			return events[listenerData.eventId].addEventListener(listenerData);
		};
						
		this.dispatch = function(eventId, eventData)
		{
			if (events[eventId])
			{
				events[eventId].dispatch(eventData);
			}
		};
	
		this.removeEventListener = function(listenerData)
		{
			if (events[listenerData.eventId])
			{
				events[listenerData.eventId].removeEventListener(listenerData);
			}
		};

		this.registerControlEvent = function (control, eventId, preventDefault)
		{
			if (events[eventId])
				return; // already there !
			
			events[eventId] = new creevents.Event();			
	
			control.addEventListener(
				eventId,
				function(event)
				{
					if (preventDefault)
						event.preventDefault();
					
					container.dispatch(eventId, event);
				});
		};
	};
}());