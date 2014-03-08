// delayed events, keep track and handle them on request
// not needed at the moment...
/*
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
*/