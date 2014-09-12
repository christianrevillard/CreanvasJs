
(function(){
	
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	var helpers;	

	creevents.Event = function(eventId)
	{
		this.eventId = eventId;
		
		var nextHandlerId = 0;
		
		helpers = CreJs.CreHelpers;

		var eventHandlers = [];

		var logger = new CreJs.Crelog.Logger();
		
		this.dispatch = function(eventData, callback)
		{					
			var count = eventHandlers.length;
			
			eventHandlers.forEach(function(handler){ 
				setTimeout(
						function()
						{
							if (DEBUG)
							{
								if (eventData && eventData.eventId != 'pointerMove')
									logger.logMessage("Handling " + eventData.eventId);			

							}
							handler.handleEvent(eventData);
							count--;
							if (count==0 && callback)
							{	
								callback();
							}
						});
				});
		};
		
		// can add a optional rank to ensure calling order of the handlers
		this.addListener = function(handleEvent, rank)
		{
			var handlerId = nextHandlerId++;
			
			eventHandlers.push({
				handlerId:handlerId, 
				handleEvent:handleEvent, 
				rank:rank});

			// insert in the right place?? TODO
			eventHandlers = eventHandlers.sort(
				function(a,b) { return (a.rank || Infinity)  - (b.rank || Infinity); }
			); 
			
			return handlerId;
		};
	
		this.removeListener = function(handlerId)
		{
			eventHandlers = eventHandlers.filter(function(registered){ return registered.handlerId != handlerId;});
		};
		
		this["addListener"] = this.addListener;
		this["removeListener"] = this.removeListener;
	};
	
	// Available after ADVANCED_OPTIMIZATION 
	CreJs['Creevents'] = creevents;
	creevents['Event'] = creevents.Event;
})();