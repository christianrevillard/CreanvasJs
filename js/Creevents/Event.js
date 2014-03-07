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
		this.register = function(handleEvent, rank)
		{
			var handlerGuid = helpers.GetGuid();
			
			eventHandlers.push({
				handlerGuid:handlerGuid, 
				handleEvent:handleEvent, 
				rank:rank});
	
			eventHandlers = eventHandlers.sort(
				function(a,b) { return (a.rank || Infinity)  - (b.rank || Infinity); }

			); 
			
			return handlerGuid;
		};
	
		this.cancel = function(handlerGuid)
		{
			eventHandlers = eventHandlers.filter(function(registered){ return registered.handlerGuid != handlerGuid;});
		};
	};
})();