var Creevents = Creevents || {};		

Creevents.Creevent = function()
{
	this.callbacks = [];

	this.dispatch = function(eventData)
	{
		for (var i = 0; i<this.callbacks.length; i++)
		{
			this.callbacks[i].callback(eventData);
		}
	};
	
	this.register = function(callback)
	{
		var handle = Date.now();
		this.callbacks.push({handle:handle, callback:callback});
		return handle;
	};

	this.cancel = function(handle)
	{
		this.callbacks.filter(function(registered){ return registered.handle!=handle;});
	};

};
