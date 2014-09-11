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

		this['getEvent'] = this.getEvent;
};

	// Available after ADVANCED_OPTIMIZATION 
	creevents['EventContainer'] = creevents.EventContainer;
}());