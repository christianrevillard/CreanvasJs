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
	
	// can add a rank to ensure calling order (example drawing by increasing z)
	this.register = function(callback, rank)
	{
		var handle = Date.now();
		this.callbacks.push({handle:handle, callback:callback, rank:rank});

		this.callbacks = this.callbacks.sort(
			function(a,b)
			{
				return (a.rank || Infinity)  - (b.rank || Infinity);					
			}
		); 
		return handle;
	};

	this.cancel = function(handle)
	{
		this.callbacks = this.callbacks.filter(function(registered){ return registered.handle!=handle;});
	};
};
