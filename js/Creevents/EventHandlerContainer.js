var CreJs = CreJs || {};

(function(){
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	
	creevents.EventHandlerContainer = function()
	{
		var pendingEvents = [];

		this.addPendingEvent = function(handleEvent)
		{
			pendingEvents.push(handleEvent);
		};
		
		this.handlePendingEvents = function()
		{
			while(pendingEvents.length>0)
			{
				pendingEvents.shift()();
			}
		};
	};
}());