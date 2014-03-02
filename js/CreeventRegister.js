var Creevents = Creevents || {};		

Creevents.CreeventRegister = function()
{	
	var events = [];
	var register = this;
	
	this.dispatchEvent = function(eventId, eventData)
	{
		if (events[eventId])
		{
			events[eventId].dispatch(eventData);
		}
	};

	this.registerEvent = function(eventId, callback, rank)
	{
		if (events[eventId])
		{
			return events[eventId].register(callback, rank);
		}
	};

	this.cancelEvent = function(eventId, handle)
	{
		if (events[eventId])
		{
			events[eventId].cancel(handle);
		}
	};
	

	this.addCustomEvent = function(eventId)
	{
		if (events[eventId])
			return; // already there !

		events[eventId] = new Creevents.Creevent();					
	};

	this.registerControlEvent = function (control, eventId)
	{
		if (events[eventId])
			return; // already there !
		
		events[eventId] = new Creevents.Creevent();			

		control.addEventListener(
			eventId,
			function(event)
			{
				register.dispatchEvent(eventId, event);
			});
	};
};