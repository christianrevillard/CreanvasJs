
(function(){
	
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	var helpers;	

	creevents.Event = function(eventId)
	{
		this.eventId = eventId;
		
		helpers = CreJs.CreHelpers;

		var eventHandlers = [];

		var logger = new CreJs.Crelog.Logger();
		
		this.dispatch = function(eventData, callback)
		{		
			var myDispatch = helpers.GetGuid();
			
			var count = eventHandlers.length;
			if (DEBUG && eventData && eventData.eventId != 'pointerMove' && eventData.eventId != 'drag' && eventData.eventId != 'drop')
				logger.logMessage("Dispatching " + count + " " + eventData.eventId + ". (" + myDispatch + ")");			
			
			eventHandlers.forEach(function(handler){ 
				handler.debugEvent = eventId;
				setTimeout(
						function()
						{
							if (DEBUG && eventData && eventData.eventId != 'pointerMove')
								logger.logMessage("Actually handling " + eventData.eventId + ". (" + myDispatch + ")");			
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
		this.addListener = function(listenerData)
		{
			// May be called from intern/extern code - handle optimized and not optimized.
			listenerData.handleEvent = listenerData.handleEvent || listenerData["handleEvent"];
			listenerData.rank = listenerData.rank || listenerData["rank"];
			listenerData.listenerId = listenerData.listenerId || listenerData["listenerId"];
			
			var handlerGuid = helpers.GetGuid();
			
			eventHandlers.push({
				handlerGuid:handlerGuid, 
				handleEvent:listenerData.handleEvent, 
				rank:listenerData.rank,
				listenerId:listenerData.listenerId});
	
			eventHandlers = eventHandlers.sort(
				function(a,b) { return (a.rank || Infinity)  - (b.rank || Infinity); }
			); 
			
			return handlerGuid;
		};
	
		this.removeEventListener = function(listenerData)
		{
			eventHandlers = eventHandlers.filter(
					function(registered){ 
						return (Boolean(listenerData.handlerGuid) && (registered.handlerGuid != listenerData.handlerGuid))
								|| (Boolean(listenerData.listenerId) && (registered.listenerId != listenerData.listenerId));
						});
		};
	};
	
	// Available after ADVANCED_OPTIMIZATION 
	CreJs['Creevents'] = creevents;
	creevents['Event'] = creevents.Event;
})();