var CreJs = CreJs || {};

(function(){
	
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	var helpers;	

	creevents.Event = function()
	{
		helpers = CreJs.CreHelpers;

		var eventHandlers = [];
	
		this.dispatch = function(eventData)
		{
			eventHandlers.forEach(function(handler){ handler.handleEvent(eventData);});
		};
		
		// can add a optional rank to ensure calling order of the handlers
		this.addEventListener = function(listenerData)
		{
			var handlerGuid = helpers.GetGuid();
			
			eventHandlers.push({
				handlerGuid:handlerGuid, 
				handleEvent:listenerData.handleEvent, 
				rank:listenerData.rank,
				listenerId:listenerData.listenerId,
				eventGroupType:listenerData.eventGroupType});
	
			eventHandlers = eventHandlers.sort(
				function(a,b) { return (a.rank || Infinity)  - (b.rank || Infinity); }

			); 
			
			return handlerGuid;
		};
	
		this.removeEventListener = function(listenerData)
		{
			eventHandlers = eventHandlers.filter(
					function(registered){ 
						return (! listenerData.handlerGuid || (registered.handlerGuid != listenerData.handlerGuid))
								&& (! listenerData.listenerId || (registered.listenerId != listenerData.listenerId))
								&& (! listenerData.eventGroupType || (registered.listenerId != listenerData.eventGroupType));
						});
		};
	};
})();