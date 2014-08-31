// TODO, log levels, other logging output.
(function()
{
	var isLogging = true; // on/off, to improve... Or just test DEBUG? to see...
	
	var log = CreJs.Crelog = CreJs.Crelog || {};
	
	log.Logger = function()
	{
		this.log = function(logData)
		{
			if (!isLogging)
				return;
			
			console.log(logData);
		};
	};	
}());