(function(){
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	
	creevents.EventContainer = function()
	{	
		var container = this;
		var events = {};		
		
		container.hasEvent = function(eventId)
		{
			return events[eventId] != undefined;
		};
		
		container.getEvent = function(eventId)
		{			
			if (!events[eventId])
			{
				events[eventId] = new creevents.Event(eventId);
			}
			
			return events[eventId];
		};						

		container['getEvent'] = container.getEvent;
	};

	// Available after ADVANCED_OPTIMIZATION 
	creevents['EventContainer'] = creevents.EventContainer;
}());