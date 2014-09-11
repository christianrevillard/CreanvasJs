(function(){
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	
	creevents.EventContainer = function()
	{	
		var container = this;
		var events = {};		
		var eventIds = [];		
		
		this.hasEvent = function(eventId)
		{
			return events[eventId] != undefined;
		};
		
		var addEvent = function(eventId)
		{
			eventIds.push(eventId);
			events[eventId] = new creevents.Event(eventId);											
		};
		
		this.getEvent = function(eventId)
		{			
			if (!events[eventId])
			{
				addEvent(eventId);
			}
			
			return events[eventId];
		};
						
		this.dispatch = function(eventId, eventData, callback)
		{
			if (events[eventId])
			{
				if (eventData)
					eventData.eventId = eventId;
				
				events[eventId].dispatch(eventData, callback);
			}		
		};
	
		this.removeEventListener = function(listenerData)
		{
			if (events[listenerData.eventId])
			{
				events[listenerData.eventId].removeEventListener(listenerData);
			}
			else
			{
				eventIds.forEach(function(eventId){ events[eventId].removeEventListener(listenerData);});
			}
		};

		this.registerControlEvent = function (control, controlEventId, customEventId)
		{
			if (!events[customEventId])
			{
				addEvent(customEventId);
			}

			control.addListener(
					controlEventId,
				function(event)
				{
					event.preventDefault();
					setTimeout(function()
					{					
						container.dispatch(customEventId, event);
					},
					0);
				});
		};

		this['getEvent'] = this.getEvent;
};

	// Available after ADVANCED_OPTIMIZATION 
	creevents['EventContainer'] = creevents.EventContainer;
}());