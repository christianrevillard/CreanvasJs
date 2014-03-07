var CreJs = CreJs || {};

(function(){
	var creevents = CreJs.Creevents = CreJs.Creevents || {};		
	
	creevents.EventContainer = function()
	{	
		var events = [];
		var container = this;
		
		this.dispatch = function(eventId, eventData)
		{
			if (events[eventId])
			{
				events[eventId].dispatch(eventData);
			}
		};
	
		this.register = function(eventId, callback, rank)
		{
			if (events[eventId])
			{
				return events[eventId].register(callback, rank);
			}
		};
	
		this.cancel = function(eventId, handle)
		{
			if (events[eventId])
			{
				events[eventId].cancel(handle);
			}
		};
			
		this.addEvent = function(eventId)
		{
			if (events[eventId])
				return; // already there !
	
			events[eventId] = new creevents.Event();					
		};
	
		this.registerControlEvent = function (control, eventId, preventDefault)
		{
			if (events[eventId])
				return; // already there !
			
			events[eventId] = new creevents.Event();			
	
			control.addEventListener(
				eventId,
				function(event)
				{
					if (preventDefault)
						event.preventDefault();
					
					container.dispatch(eventId, event);
				});
		};
	};
})();