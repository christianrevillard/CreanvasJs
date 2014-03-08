var CreJs = CreJs || {};

(function(){
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	
	creevents.EventTarget = function()
	{
		var pendingEvents = [];

		this.queueEvent = function(handleEvent)
		{
			pendingEvents.push(handleEvent);
		};
		
		this.handleEvents = function()
		{
			while(pendingEvents.length>0)
			{
				pendingEvents.shift()();
			}
		};
	};
}());