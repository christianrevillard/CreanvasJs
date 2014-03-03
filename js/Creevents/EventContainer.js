var Creevents = Creevents || {};		

Creevents.EventContainer = function()
{	
	var events = [];
	var register = this;
	
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

		events[eventId] = new Creevents.Event();					
	};

	this.registerControlEvent = function (control, eventId)
	{
		if (events[eventId])
			return; // already there !
		
		events[eventId] = new Creevents.Event();			

		control.addEventListener(
			eventId,
			function(event)
			{
				register.dispatch(eventId, event);
			});
	};
};